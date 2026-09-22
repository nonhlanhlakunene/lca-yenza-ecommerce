<script setup>
import {
    computed,
    onMounted,
    onBeforeUnmount,
    ref,
    watch
} from 'vue'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

import api from '../api/api.js'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
})

const categories = ref([])

const professionals = ref([])

const activeCategory = ref('')

const activeFilter = ref('All')

const search = ref('')

const currentPage = ref(1)

const priceFilter =
    ref('All prices')

const priceMenuOpen =
    ref(false)

const loading = ref(false)

const errorMessage =
    ref('')

const workersPerPage = 3

const filters = [
    'Reviews',
    'Rating'
]

const priceOptions = [
    'All prices',
    'Under R300/hr',
    'R300 – R500/hr',
    'R501+/hr'
]

/*
|--------------------------------------------------------------------------
| MAP
|--------------------------------------------------------------------------
*/

const mapElement =
    ref(null)

const map =
    ref(null)

const markersLayer =
    ref(null)

const mapReady =
    ref(false)

const mapFilterEnabled =
    ref(false)

const workerLocations =
    ref([])

const geocoding =
    ref(false)

const mapMessage =
    ref('')

const selectedProfessionalId =
    ref(null)

/*
|--------------------------------------------------------------------------
| PROFESSIONAL FILTERING
|--------------------------------------------------------------------------
*/

const filteredProfessionals =
    computed(() => {
        let result = [
            ...professionals.value
        ]

        if (
            mapFilterEnabled.value &&
            mapReady.value
        ) {
            const bounds =
                map.value.getBounds()

            result =
                result.filter(pro => {
                    const location =
                        workerLocations.value.find(
                            item =>
                                String(
                                    item.id
                                ) ===
                                String(
                                    pro.id
                                )
                        )

                    if (
                        !location ||
                        location.latitude === null ||
                        location.longitude === null
                    ) {
                        return false
                    }

                    return bounds.contains([
                        location.latitude,
                        location.longitude
                    ])
                })
        }

        return result
    })

/*
|--------------------------------------------------------------------------
| PAGINATION
|--------------------------------------------------------------------------
*/

const totalPages =
    computed(() => {
        return Math.ceil(
            filteredProfessionals.value
                .length /
            workersPerPage
        )
    })

const visibleProfessionals =
    computed(() => {
        const start =
            (currentPage.value - 1) *
            workersPerPage

        const end =
            start + workersPerPage

        return filteredProfessionals.value.slice(
            start,
            end
        )
    })

/*
|--------------------------------------------------------------------------
| PRICE FILTER
|--------------------------------------------------------------------------
*/

function addPriceParams(
    params
) {
    if (
        priceFilter.value ===
        'Under R300/hr'
    ) {
        params.maxPrice = 299.99
    } else if (
        priceFilter.value ===
        'R300 – R500/hr'
    ) {
        params.minPrice = 300
        params.maxPrice = 500
    } else if (
        priceFilter.value ===
        'R501+/hr'
    ) {
        params.minPrice = 501
    }
}

/*
|--------------------------------------------------------------------------
| LOAD PROFESSIONALS
|--------------------------------------------------------------------------
*/

async function loadProfessionals() {
    loading.value = true

    errorMessage.value = ''

    try {
        const params = {}

        if (
            activeCategory.value
        ) {
            params.category =
                activeCategory.value
        }

        if (
            search.value.trim()
        ) {
            params.search =
                search.value.trim()
        }

        if (
            activeFilter.value ===
            'Reviews'
        ) {
            params.sort =
                'reviews'
        } else if (
            activeFilter.value ===
            'Rating'
        ) {
            params.sort =
                'rating'
        } else if (
            priceFilter.value !==
            'All prices'
        ) {
            params.sort =
                'price-asc'
        } else {
            params.sort =
                'best-match'
        }

        addPriceParams(
            params
        )

        const response =
            await api.get(
                '/professionals',
                {
                    params
                }
            )

        professionals.value =
            response.data
                .professionals || []

        currentPage.value = 1

        await updateMapMarkers()
    } catch (error) {
        console.error(
            'Failed to load professionals:',
            error
        )

        professionals.value = []

        currentPage.value = 1

        errorMessage.value =
            error.response?.data?.message ||
            'Unable to load professionals. Please try again.'
    } finally {
        loading.value = false
    }
}

async function searchForProfessional() {
    await loadProfessionals()

    if (!search.value.trim() || !professionals.value.length) return

    await geocodeProfessionals()

    const searchTerm = search.value.trim().toLowerCase()
    const professional = professionals.value.find(
        item => item.name.toLowerCase() === searchTerm
    ) || professionals.value[0]

    focusProfessionalOnMap(professional.id)
}

/*
|--------------------------------------------------------------------------
| LOAD CATEGORIES
|--------------------------------------------------------------------------
*/

async function loadCategories() {
    try {
        const response =
            await api.get(
                '/categories'
            )

        categories.value =
            response.data
                .categories || []
    } catch (error) {
        console.error(
            'Failed to load categories:',
            error
        )

        categories.value = []
    }
}

/*
|--------------------------------------------------------------------------
| MAP INITIALISATION
|--------------------------------------------------------------------------
*/

function initialiseMap() {
    if (
        !mapElement.value ||
        map.value
    ) {
        return
    }

    map.value =
        L.map(
            mapElement.value,
            {
                zoomControl: true
            }
        ).setView(
            [
                -33.9249,
                18.4241
            ],
            11
        )

    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution:
                '&copy; OpenStreetMap contributors',

            // OpenStreetMap supplies tiles through zoom 19. Allowing Leaflet
            // to scale those tiles prevents a blank map at our focus zoom of 20.
            maxNativeZoom: 19,
            maxZoom: 20
        }
    ).addTo(
        map.value
    )

    markersLayer.value =
        L.layerGroup().addTo(
            map.value
        )

    map.value.on(
        'moveend',
        () => {
            if (
                mapFilterEnabled.value
            ) {
                currentPage.value = 1
            }
        }
    )

    map.value.on(
        'zoomend',
        () => {
            if (
                mapFilterEnabled.value
            ) {
                currentPage.value = 1
            }
        }
    )

    mapReady.value = true
}

/*
|--------------------------------------------------------------------------
| CREATE ADDRESS
|--------------------------------------------------------------------------
*/

function getProfessionalAddress(
    professional
) {
    return [
        professional.address,
        professional.city,
        professional.province,
        professional.postal_code,
        'South Africa'
    ]
        .filter(Boolean)
        .join(', ')
}

/*
|--------------------------------------------------------------------------
| GEOCODING
|--------------------------------------------------------------------------
*/

async function geocodeAddress(
    address
) {
    try {
        const url =
            'https://nominatim.openstreetmap.org/search?' +
            new URLSearchParams({
                q: address,
                format: 'json',
                limit: '1',
                countrycodes: 'za'
            })

        const response =
            await fetch(url, {
                headers: {
                    Accept:
                        'application/json'
                }
            })

        if (
            !response.ok
        ) {
            return null
        }

        const data =
            await response.json()

        if (
            !data.length
        ) {
            return null
        }

        return {
            latitude:
                Number(
                    data[0].lat
                ),

            longitude:
                Number(
                    data[0].lon
                )
        }
    } catch (error) {
        console.error(
            'Geocoding failed:',
            error
        )

        return null
    }
}

/*
|--------------------------------------------------------------------------
| GEOCODE ALL PROFESSIONALS
|--------------------------------------------------------------------------
*/

async function geocodeProfessionals() {
    if (
        !professionals.value.length
    ) {
        workerLocations.value = []

        return
    }

    geocoding.value = true

    mapMessage.value =
        'Finding worker locations...'

    const locations = []

    for (
        const professional
        of professionals.value
    ) {
        const address =
            getProfessionalAddress(
                professional
            )

        let coordinates = null

        /*
         * If the API ever gives us
         * coordinates in the future,
         * use them first.
         */
        if (
            professional.latitude !==
                undefined &&
            professional.longitude !==
                undefined &&
            professional.latitude !==
                null &&
            professional.longitude !==
                null
        ) {
            coordinates = {
                latitude:
                    Number(
                        professional.latitude
                    ),

                longitude:
                    Number(
                        professional.longitude
                    )
            }
        }

        /*
         * Otherwise use the existing
         * database address.
         */
        if (
            !coordinates &&
            address
        ) {
            coordinates =
                await geocodeAddress(
                    address
                )

            /*
             * Small delay between
             * requests.
             */
            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        1000
                    )
            )
        }

        locations.push({
            id: professional.id,

            latitude:
                coordinates
                    ? coordinates.latitude
                    : null,

            longitude:
                coordinates
                    ? coordinates.longitude
                    : null,

            address
        })
    }

    workerLocations.value =
        locations

    geocoding.value = false

    mapMessage.value = ''

    updateMapMarkers()
}

/*
|--------------------------------------------------------------------------
| UPDATE MAP MARKERS
|--------------------------------------------------------------------------
*/

function updateMapMarkers() {
    if (
        !mapReady.value ||
        !markersLayer.value
    ) {
        return
    }

    markersLayer.value.clearLayers()

    const markerBounds = []

    professionals.value.forEach(
        professional => {
            const location =
                workerLocations.value.find(
                    item =>
                        String(
                            item.id
                        ) ===
                        String(
                            professional.id
                        )
                )

            if (
                !location ||
                location.latitude === null ||
                location.longitude === null
            ) {
                return
            }

            const marker =
                L.marker([
                    location.latitude,
                    location.longitude
                ], {
                    professionalId: professional.id
                })

            const popup = `
                <div class="map-popup">
                    <strong>
                        ${escapeHtml(
                            professional.name ||
                            'Professional'
                        )}
                    </strong>

                    <br>

                    <span>
                        ${escapeHtml(
                            professional.job ||
                            'Professional'
                        )}
                    </span>

                    <br>

                    <strong>
                        R${Number(
                            professional.price || 0
                        ).toFixed(2)}/hr
                    </strong>

                    <br>

                    <span>
                        ${escapeHtml(
                            professional.city ||
                            ''
                        )}
                    </span>
                </div>
            `

            marker.bindPopup(
                popup
            )

            marker.on(
                'click',
                () => {
                    focusProfessionalOnMap(professional.id)
                }
            )

            marker.addTo(
                markersLayer.value
            )

            markerBounds.push([
                location.latitude,
                location.longitude
            ])
        }
    )

    /*
     * Only fit the map to workers
     * when the map is first populated.
     */
    if (
        markerBounds.length &&
        !map.value._yenzaInitialFit
    ) {
        map.value.fitBounds(
            markerBounds,
            {
                padding: [
                    30,
                    30
                ]
            }
        )

        map.value._yenzaInitialFit =
            true
    }
}

/*
|--------------------------------------------------------------------------
| HTML ESCAPE FOR POPUPS
|--------------------------------------------------------------------------
*/

function focusProfessionalOnMap(professionalId) {
    if (!map.value || !markersLayer.value) return

    const location = workerLocations.value.find(
        item => String(item.id) === String(professionalId)
    )

    if (!location || location.latitude === null || location.longitude === null) {
        mapMessage.value = 'This professional does not have a mapped location yet.'
        return
    }

    selectedProfessionalId.value = professionalId

    map.value.flyTo([location.latitude, location.longitude], 20, {
        animate: true,
        duration: 0.8
    })

    const marker = markersLayer.value.getLayers().find(
        layer => String(layer.options.professionalId) === String(professionalId)
    )

    marker?.openPopup()
}

function escapeHtml(
    value
) {
    return String(value)
        .replace(
            /&/g,
            '&amp;'
        )
        .replace(
            /</g,
            '&lt;'
        )
        .replace(
            />/g,
            '&gt;'
        )
        .replace(
            /"/g,
            '&quot;'
        )
        .replace(
            /'/g,
            '&#039;'
        )
}

/*
|--------------------------------------------------------------------------
| MAP FILTER
|--------------------------------------------------------------------------
*/

function toggleMapFilter() {
    mapFilterEnabled.value =
        !mapFilterEnabled.value

    currentPage.value = 1
}

function clearMapFilter() {
    mapFilterEnabled.value =
        false

    currentPage.value = 1
}

/*
|--------------------------------------------------------------------------
| RESET MAP VIEW
|--------------------------------------------------------------------------
*/

function showAllWorkersOnMap() {
    if (
        !map.value
    ) {
        return
    }

    const coordinates =
        workerLocations.value
            .filter(
                location =>
                    location.latitude !==
                        null &&
                    location.longitude !==
                        null
            )
            .map(
                location => [
                    location.latitude,
                    location.longitude
                ]
            )

    if (
        coordinates.length
    ) {
        map.value.fitBounds(
            coordinates,
            {
                padding: [
                    30,
                    30
                ]
            }
        )
    }

    mapFilterEnabled.value =
        false

    currentPage.value = 1
}

/*
|--------------------------------------------------------------------------
| PAGINATION
|--------------------------------------------------------------------------
*/

function nextPage() {
    if (
        currentPage.value <
        totalPages.value
    ) {
        currentPage.value++
    }
}

function previousPage() {
    if (
        currentPage.value > 1
    ) {
        currentPage.value--
    }
}

/*
|--------------------------------------------------------------------------
| INITIALS
|--------------------------------------------------------------------------
*/

function initials(
    name
) {
    if (!name) {
        return ''
    }

    return name
        .split(' ')
        .map(
            part => part[0]
        )
        .slice(0, 2)
        .join('')
}

/*
|--------------------------------------------------------------------------
| WATCHERS
|--------------------------------------------------------------------------
*/

watch(
    [
        activeCategory,
        search,
        priceFilter,
        activeFilter
    ],
    () => {
        currentPage.value = 1

        loadProfessionals()
    }
)

watch(
    mapFilterEnabled,
    () => {
        currentPage.value = 1
    }
)

/*
|--------------------------------------------------------------------------
| MOUNT
|--------------------------------------------------------------------------
*/

onMounted(
    async () => {
        initialiseMap()

        await loadCategories()

        await loadProfessionals()

        await geocodeProfessionals()
    }
)

/*
|--------------------------------------------------------------------------
| CLEANUP
|--------------------------------------------------------------------------
*/

onBeforeUnmount(
    () => {
        if (map.value) {
            map.value.remove()

            map.value = null
        }
    }
)
</script>

<template>
  <main class="directory-shell">

    <aside class="sidebar">

      <div class="brand">
        YENZA!
      </div>

      <p class="section-label">
        CATEGORY
      </p>

      <nav aria-label="Trade categories">

        <button
          type="button"
          class="category"
          :class="{
            active:
              activeCategory === ''
          }"
          @click="
            activeCategory = ''
          "
        >
          All

          <span>
            ›
          </span>
        </button>

        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="category"
          :class="{
            active:
              activeCategory ===
              category.name
          }"
          @click="
            activeCategory =
              category.name
          "
        >
          {{ category.name }}

          <span>
            ›
          </span>
        </button>

      </nav>

    </aside>

    <section class="content">

      <form
        class="search-bar"
        @submit.prevent="
          searchForProfessional
        "
      >

        <input
          v-model="search"
          type="search"
          placeholder="Search services..."
          aria-label="Search services"
        />

        <button type="submit">
          Search
        </button>

      </form>

      <p class="filter-label">
        QUICK FILTERS
      </p>

      <div class="filters">

        <button
          type="button"
          :class="{
            selected:
              activeFilter === 'All'
          }"
          @click="
            activeFilter = 'All'
          "
        >
          All
        </button>

        <div class="price-filter">

          <button
            type="button"
            class="prices-button"
            :class="{
              selected:
                priceFilter !==
                'All prices'
            }"
            @click="
              priceMenuOpen =
                !priceMenuOpen
            "
          >
            Prices ▼
          </button>

          <div
            v-if="priceMenuOpen"
            class="price-menu"
          >

            <button
              v-for="option in priceOptions"
              :key="option"
              type="button"
              :class="{
                active:
                  priceFilter ===
                  option
              }"
              @click="
                priceFilter = option;
                priceMenuOpen = false
              "
            >
              {{ option }}
            </button>

          </div>

        </div>

        <button
          v-for="filter in filters"
          :key="filter"
          type="button"
          :class="{
            selected:
              activeFilter === filter
          }"
          @click="
            activeFilter = filter
          "
        >
          {{ filter }}
        </button>

      </div>

      <!-- MAP -->

      <section class="map-section">

        <div class="map-header">

          <div>

            <h2>
              Find Handymen Near You
            </h2>

            <p>
              Move or zoom the map to explore worker locations.
            </p>

          </div>

          <div class="map-actions">

            <button
              type="button"
              class="map-filter-button"
              :class="{
                enabled:
                  mapFilterEnabled
              }"
              @click="
                toggleMapFilter
              "
            >
              {{
                mapFilterEnabled
                  ? 'Map Filter On'
                  : 'Filter by Map Area'
              }}
            </button>

            <button
              type="button"
              class="map-reset-button"
              @click="
                showAllWorkersOnMap
              "
            >
              Show All
            </button>

          </div>

        </div>

        <div
          ref="mapElement"
          class="map"
        ></div>

        <div
          v-if="geocoding"
          class="map-status"
        >
          {{ mapMessage }}
        </div>

        <div
          v-if="mapFilterEnabled"
          class="map-filter-status"
        >
          Map filtering is active. Only workers inside the visible map area
          are shown below.
        </div>

      </section>

      <!-- RESULTS -->

      <div class="results-heading">

        <h1>
          Available Handymen
          ({{ filteredProfessionals.length }}
          results)
        </h1>

        <span>
          Sorted by:

          <strong>
            {{
              activeFilter === 'All' &&
              priceFilter ===
                'All prices'
                ? 'Best Match'
                : activeFilter === 'All'
                  ? 'Lowest Price'
                  : activeFilter
            }}
          </strong>
        </span>

      </div>

      <div class="results-area">

        <p
          v-if="loading"
          class="state-message"
        >
          Loading professionals…
        </p>

        <p
          v-else-if="errorMessage"
          class="state-message error"
        >
          {{ errorMessage }}
        </p>

        <template v-else>

          <div
            v-if="
              visibleProfessionals.length
            "
            class="cards"
          >

            <article
              v-for="
                pro in visibleProfessionals
              "
              :key="pro.id"
              class="professional-card"
              :class="{
                selected:
                  String(selectedProfessionalId) ===
                  String(pro.id)
              }"
            >

              <div class="pro-top">

                <img
                  v-if="pro.photo"
                  :src="pro.photo"
                  :alt="pro.name"
                />

                <div
                  v-else
                  class="avatar"
                >
                  {{ initials(pro.name) }}
                </div>

                <div class="pro-info">

                  <h2>
                    {{ pro.name }}
                  </h2>

                  <p>
                    {{ pro.job }}
                  </p>

                  <small class="reviews">

                    <b>
                      ★
                    </b>

                    {{ pro.rating || 0 }}

                    <span>
                      ({{ pro.reviews || 0 }}
                      reviews)
                    </span>

                  </small>

                  <small
                    v-if="pro.city"
                    class="location"
                  >
                    📍 {{ pro.city }}
                  </small>

                </div>

                <strong class="price">
                  R{{ pro.price }}/hr
                </strong>

              </div>

              <div class="card-footer">

                <div class="tags">

                  <span
                    v-for="tag in pro.tags"
                    :key="tag"
                  >
                    {{ tag }}
                  </span>

                </div>

                <RouterLink
                  class="profile-button"
                  :to="{
                    name: 'profile',
                    params: {
                      slug: pro.slug
                    }
                  }"
                >
                  View Profile →
                </RouterLink>

              </div>

            </article>

          </div>

          <p
            v-else
            class="state-message"
          >
            No handymen match your search or current map area.
          </p>

        </template>

      </div>
      <div v-if="loading">
    Loading professionals...
</div>

      <nav
        v-if="totalPages > 1"
        class="pagination"
        aria-label="Results pages"
      >

        <button
          type="button"
          :disabled="
            currentPage === 1
          "
          @click="
            previousPage
          "
        >
          ← Back
        </button>

        <span>
          Page
          {{ currentPage }}
          of
          {{ totalPages }}
        </span>

        <button
          type="button"
          :disabled="
            currentPage ===
            totalPages
          "
          @click="
            nextPage
          "
        >
          View More →
        </button>

      </nav>

    </section>

  </main>
</template>

<style scoped>
@import url('https://db.onlinewebfonts.com/c/2da952d097bffd198ec0f0aa3fdd6804?family=JejuHallasan');

* {
    box-sizing: border-box;
}

.directory-shell {
    display: flex;
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    max-height: 100vh;
    overflow: hidden;
    background: #f7f7f7;
    color: #123442;
}

.sidebar {
    width: 276px;
    min-width: 276px;
    height: 100vh;
    padding: 34px 20px;
    background: #136163;
    color: #dceeee;
    overflow: hidden;
}

.directory-shell .sidebar .brand {
    margin-bottom: 24px;
    color: #ffffff !important;
    font-family: "JejuHallasan", sans-serif !important;
    font-size: 50px;
    font-weight: 700;
}

.section-label {
    margin-bottom: 10px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .06em;
}

.category {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 14px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: #dceeee;
    text-align: left;
    font-size: 14px;
    cursor: pointer;
}

.category span {
    font-size: 18px;
}

.category.active,
.category:hover {
    background: #0d5153;
    color: #ffffff;
}

.content {
    flex: 1;
    min-width: 0;
    width: calc(100% - 276px);
    height: 100vh;
    max-height: 100vh;
    padding: 25px 36px;
    overflow-y: auto;
}

.search-bar {
    display: flex;
    gap: 10px;
    width: 100%;
    padding: 10px;
    border: 1px solid #dce3e7;
    border-radius: 8px;
    background: #ffffff;
}

.search-bar input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: 0;
    padding: 5px;
    background: transparent;
    color: #123442;
}

.search-bar button {
    padding: 0 18px;
    border: 0;
    border-radius: 6px;
    background: #136163;
    color: #ffffff;
    cursor: pointer;
}

.filter-label {
    margin: 20px 0 10px;
    color: #66808b;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .06em;
}

.filters {
    display: flex;
    align-items: center;
    gap: 8px;
}

.filters > button,
.prices-button {
    padding: 8px 13px;
    border: 0;
    border-radius: 17px;
    background: #136163;
    color: #ffffff;
    font-size: 12px;
    cursor: pointer;
}

.filters .selected {
    background: #0b484a;
    box-shadow: inset 0 0 0 1px #ffffff;
}

.price-filter {
    position: relative;
}

.price-menu {
    position: absolute;
    z-index: 1000;
    top: 39px;
    left: 0;
    width: 210px;
    overflow: hidden;
    border-radius: 7px;
    background: #ffffff;
    box-shadow: 0 5px 14px #15313722;
}

.price-menu button {
    display: block;
    width: 100%;
    padding: 10px;
    border: 0;
    background: #ffffff;
    color: #24434c;
    text-align: left;
    font-size: 12px;
    cursor: pointer;
}

.price-menu button:hover,
.price-menu button.active {
    background: #e7f1f1;
}

/* MAP */

.map-section {
    margin-top: 18px;
    padding: 14px;
    border: 1px solid #e2e8ea;
    border-radius: 12px;
    background: #ffffff;
}

.map-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 10px;
}

.map-header h2 {
    margin: 0;
    font-size: 15px;
}

.map-header p {
    margin: 4px 0 0;
    color: #71818a;
    font-size: 11px;
}

.map-actions {
    display: flex;
    gap: 7px;
}

.map-filter-button,
.map-reset-button {
    padding: 8px 11px;
    border: 0;
    border-radius: 6px;
    font-size: 11px;
    cursor: pointer;
}

.map-filter-button {
    background: #136163;
    color: #ffffff;
}

.map-filter-button.enabled {
    background: #0b484a;
    box-shadow: inset 0 0 0 2px #ffffff;
}

.map-reset-button {
    background: #e3eff0;
    color: #136163;
}

.map {
    width: 100%;
    height: 260px;
    overflow: hidden;
    border-radius: 9px;
}

.map-status {
    padding: 7px 0 0;
    color: #136163;
    font-size: 11px;
}

.map-filter-status {
    margin-top: 8px;
    padding: 8px;
    border-radius: 6px;
    background: #e7f1f1;
    color: #136163;
    font-size: 11px;
}

/* RESULTS */

.results-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    margin: 20px 0 15px;
}

.results-heading h1 {
    margin: 0;
    font-size: 18px;
}

.results-heading span {
    color: #71818a;
    font-size: 12px;
}

.results-heading strong {
    color: #136163;
}

.results-area {
    overflow: hidden;
}

.cards {
    display: grid;
    gap: 12px;
}

.professional-card {
    overflow: hidden;
    border: 1px solid #e2e8ea;
    border-radius: 12px;
    background: #ffffff;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.professional-card.selected {
    border-color: #136163;
    box-shadow: 0 0 0 2px #13616333;
}

.pro-top {
    position: relative;
    display: flex;
    align-items: center;
    gap: 13px;
    min-height: 72px;
    padding: 14px 17px;
}

.pro-top img,
.avatar {
    width: 50px;
    min-width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}

.avatar {
    display: grid;
    place-items: center;
    background: #dff2f1;
    color: #136163;
    font-weight: 700;
}

.pro-info {
    min-width: 0;
    padding-right: 80px;
}

.pro-info h2 {
    margin: 0;
    font-size: 15px;
}

.pro-info p {
    margin: 3px 0;
    color: #136163;
    font-size: 12px;
}

.pro-info small {
    font-size: 11px;
}

.pro-info b {
    color: #f59d12;
}

.pro-info small span {
    color: #849399;
}

.reviews {
    display: block;
}

.location {
    display: block;
    margin-top: 3px;
    color: #71818a;
}

.price {
    position: absolute;
    top: 22px;
    right: 17px;
    color: #136163;
}

.card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 9px 17px;
    border-top: 1px solid #edf1f2;
    background: #fafcfc;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.tags span {
    padding: 3px 7px;
    border-radius: 4px;
    background: #e3eff0;
    color: #136163;
    font-size: 10px;
}

.profile-button {
    flex-shrink: 0;
    padding: 7px 10px;
    border-radius: 6px;
    background: #136163;
    color: #ffffff;
    font-size: 11px;
    text-decoration: none;
    white-space: nowrap;
}

.profile-button:hover {
    background: #0d5153;
}

.state-message {
    padding: 25px;
    text-align: center;
    color: #71818a;
}

.error {
    color: #a93226;
}

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    width: 100%;
    margin: 14px 0 25px;
}

.pagination button {
    min-width: 125px;
    padding: 8px 12px;
    border: 0;
    border-radius: 6px;
    background: #136163;
    color: #ffffff;
    font-size: 12px;
    cursor: pointer;
}

.pagination button:disabled {
    opacity: .45;
    cursor: not-allowed;
}

.pagination span {
    color: #71818a;
    font-size: 12px;
    text-align: center;
}

/* MOBILE */

@media (max-width: 1000px) {
    .sidebar {
        width: 230px;
        min-width: 230px;
    }

    .content {
        width: calc(100% - 230px);
        padding: 22px;
    }
}

@media (max-width: 700px) {
    .directory-shell {
        display: block;
        width: 100%;
        height: auto;
        min-height: 100vh;
        max-height: none;
        overflow: visible;
    }

    .sidebar {
        width: 100%;
        min-width: 100%;
        height: auto;
        max-height: none;
        padding: 20px;
        overflow: hidden;
    }

    .directory-shell .sidebar .brand {
        margin-bottom: 12px;
        font-size: 35px;
    }

    .sidebar nav {
        display: flex;
        gap: 5px;
        width: 100%;
        overflow-x: auto;
    }

    .category {
        flex-shrink: 0;
        width: auto;
        padding: 8px 10px;
        white-space: nowrap;
        font-size: 12px;
    }

    .content {
        width: 100%;
        height: auto;
        max-height: none;
        padding: 18px;
        overflow: visible;
    }

    .map-header {
        align-items: flex-start;
        flex-direction: column;
    }

    .map-actions {
        width: 100%;
    }

    .map-filter-button,
    .map-reset-button {
        flex: 1;
    }

    .map {
        height: 250px;
    }

    .results-heading h1 {
        font-size: 14px;
    }

    .results-heading span {
        display: none;
    }

    .pro-top {
        padding: 12px;
    }

    .pro-top img,
    .avatar {
        width: 43px;
        min-width: 43px;
        height: 43px;
    }

    .pro-info {
        padding-right: 70px;
    }

    .pro-info h2 {
        font-size: 13px;
    }

    .pro-info p {
        font-size: 11px;
    }

    .price {
        top: 17px;
        right: 12px;
        font-size: 12px;
    }

    .card-footer {
        padding: 7px 12px;
    }

    .pagination {
        margin-top: 10px;
    }

    .pagination button {
        min-width: 105px;
        padding: 7px 8px;
        font-size: 11px;
    }
}
</style>
