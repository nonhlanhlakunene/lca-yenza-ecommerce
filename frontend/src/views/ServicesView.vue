<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import api from '../api/api.js'

const categories = ref([])
const professionals = ref([])

const activeCategory = ref('')
const activeFilter = ref('All')

const search = ref('')

const currentPage = ref(1)

const priceFilter = ref('All prices')
const priceMenuOpen = ref(false)

const loading = ref(false)
const errorMessage = ref('')

const workersPerPage = 3

const filters = [
    'Reviews',
    'Rating'
]

const priceOptions = [
    'All prices',
    'Best prices (under R75/hr)',
    'R76 – R90/hr',
    'R91+/hr'
]

const totalPages = computed(() => {
    return Math.ceil(
        professionals.value.length /
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

        return professionals.value.slice(
            start,
            end
        )
    })

function addPriceParams(params) {
    if (
        priceFilter.value ===
        'Best prices (under R75/hr)'
    ) {
        params.maxPrice = 75
    }

    if (
        priceFilter.value ===
        'R76 – R90/hr'
    ) {
        params.minPrice = 76
        params.maxPrice = 90
    }

    if (
        priceFilter.value ===
        'R91+/hr'
    ) {
        params.minPrice = 91
    }
}

async function loadProfessionals() {
    loading.value = true
    errorMessage.value = ''

    try {
        const params = {}

        if (activeCategory.value) {
            params.category =
                activeCategory.value
        }

        if (search.value.trim()) {
            params.search =
                search.value.trim()
        }

        if (
            activeFilter.value ===
            'Reviews'
        ) {
            params.sort = 'reviews'
        } else if (
            activeFilter.value ===
            'Rating'
        ) {
            params.sort = 'rating'
        } else if (
            priceFilter.value !==
            'All prices'
        ) {
            params.sort = 'price-asc'
        } else {
            params.sort = 'best-match'
        }

        addPriceParams(params)

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

function initials(name) {
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

onMounted(async () => {
    await loadCategories()
    await loadProfessionals()
})
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
          loadProfessionals
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

      <div class="results-heading">

        <h1>
          Available Handymen
          ({{ professionals.length }}
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
            No handymen match your search.
          </p>

        </template>

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

.brand {
    margin-bottom: 24px;
    color: #ffffff;
    font-family: 'Jeju Hallasan', sans-serif;
    font-size: 30px;
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
    padding: 31px 36px;
    overflow: hidden;
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
    margin: 25px 0 10px;
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
    z-index: 100;
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

.results-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    margin: 22px 0 15px;
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
    overflow: hidden;
}

.professional-card {
    overflow: hidden;
    border: 1px solid #e2e8ea;
    border-radius: 12px;
    background: #ffffff;
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
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    margin-top: 14px;
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

@media (max-width: 1000px) {
    .sidebar {
        width: 230px;
        min-width: 230px;
    }

    .content {
        width: calc(100% - 230px);
        padding: 25px;
    }
}

@media (max-width: 700px) {
    .directory-shell {
        display: block;
        width: 100%;
        height: 100vh;
        min-height: 100vh;
        max-height: 100vh;
        overflow: hidden;
    }

    .sidebar {
        width: 100%;
        min-width: 100%;
        height: 170px;
        max-height: 170px;
        padding: 20px;
        overflow: hidden;
    }

    .brand {
        margin-bottom: 12px;
        font-size: 25px;
    }

    .sidebar nav {
        display: flex;
        gap: 5px;
        width: 100%;
        overflow: hidden;
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
        height: calc(100vh - 170px);
        max-height: calc(100vh - 170px);
        padding: 18px;
        overflow: hidden;
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

