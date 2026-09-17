<script setup>
import { ref, computed } from 'vue' 


/* Temporary booking data. Later, this information will come from the backend/database. */
const bookings = ref([
  {
    id: 1,
    service: 'Plumbing',
    professional: 'Arthur Pendleton',
    job: 'Master Plumber & Pipe Specialist',
    date: '2026-09-15',
    time: '10:00',
    address: '123 Main Street, Cape Town',
    notes: 'Kitchen sink needs to be repaired.',
    status: 'Confirmed'
  },
  {
    id: 2,
    service: 'Electrician',
    professional: 'Sarah Jenkins',
    job: 'Licensed Residential Electrician',
    date: '2026-09-02',
    time: '14:00',
    address: '45 Long Street, Cape Town',
    notes: 'Install two new lights.',
    status: 'Completed'
  },
  {
    id: 3,
    service: 'Painter',
    professional: 'Elena Rodriguez',
    job: 'Interior & Exterior Painting Specialist',
    date: '2026-08-25',
    time: '09:00',
    address: '18 Main Road, Cape Town',
    notes: 'Paint the living room and hallway.',
    status: 'Completed'
  },
  {
    id: 4,
    service: 'Locksmith',
    professional: 'Daniel Okafor',
    job: '24/7 Residential & Auto Locksmith',
    date: '2026-08-18',
    time: '11:00',
    address: '7 Oak Avenue, Cape Town',
    notes: 'Replace the front door lock.',
    status: 'Cancelled'
  }
])

/* Finds the customer's current/upcoming booking. */
const currentBooking = computed(() => {
    return bookings.value.find(
        booking => booking.status === 'Confirmed'
    )
}) 

/* Gets all bookings that are not the current booking. */
const bookingHistory = computed(() => {
    return bookings.value.filter(
        booking => booking.status !== 'Confirmed'
    )
}) 

/* Converts the date into a more readable format. */
const formatDate = (date) => {
    return new Date(date + 'T00:00:00').toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

/* Converts 24-hour time into a 12-hour format. */
const formatTime = (time) => {
    const [hours, minutes] = time.split(':')
    const date = new Date()

    date.setHours(hours, minutes)
    return date.toLocaleTimeString('en-ZA', {
        hour: 'numeric',
        minute: '2-digit'
    })
} 

/* Temporary cancel function. Later, this will send a request to the backend. */
const cancelBooking = (bookingId) => {
    const booking = bookings.value.find(
        booking => booking.id === bookingId
    )

    if (booking) {
        booking.status = 'Cancelled'
    }
}
</script>



<template>
    <main class="bookings-page"> 
        
        <!-- PAGE HEADER -->
        <section class="bookings-header">
            <h1>My Bookings</h1>
            <p> Manage your active service appointments and view your previous booking history. </p>
        </section> 
        
        <!-- CURRENT BOOKING -->
        <section class="bookings-section">
            <div class="section-heading">
                <h2>Current Booking</h2>
                <p>Your upcoming service appointment.</p>
            </div> 
            
            <!-- Show current booking -->
            <div v-if="currentBooking" class="current-booking-card">
                <div class="booking-card-header">
                    <div> <span class="booking-service"> {{ currentBooking.service }} </span>
                       <h3>
                            {{ currentBooking.professional }}
                        </h3>

                        <p class="professional-job">
                            {{ currentBooking.job }}
                        </p>
                    </div> <span class="booking-status" :class="currentBooking.status.toLowerCase()"> {{
                        currentBooking.status }} </span>
                </div>

                <div class="booking-details">
                    <div class="booking-detail"> <span class="detail-label">DATE</span> <span>{{
                        formatDate(currentBooking.date) }}</span> </div>
                    <div class="booking-detail"> <span class="detail-label">TIME</span> <span>{{
                        formatTime(currentBooking.time) }}</span> </div>
                    <div class="booking-detail"> <span class="detail-label">SERVICE ADDRESS</span> <span>{{
                            currentBooking.address }}</span> </div>
                </div>

                <div v-if="currentBooking.notes" class="booking-notes"> <span class="detail-label">ADDITIONAL
                        INFORMATION</span>
                    <p>{{ currentBooking.notes }}</p>
                </div>

                <div class="booking-actions"> 
                    <button 
                        class="cancel-button"
                        type="button"
                        @click="cancelBooking(currentBooking.id)"
                    >
                        Cancel Booking 
                    </button> 

                    <button
                        class="booking-action-button"
                        type="button"
                    >
                        Report Professional
                    </button>
                </div>

            </div> 
            
            <!-- Show message if there is no current booking -->
            <div v-else class="empty-booking">
                <h3>No Current Booking</h3>
                <p> You don't have any upcoming bookings at the moment. </p> <router-link to="/book"
                    class="book-button"> BOOK A PROFESSIONAL </router-link>
            </div>
        </section> 
        
        <!-- BOOKING HISTORY -->
        <section class="bookings-section history-section">
            <div class="section-heading">
                <h2>Booking History</h2>
                <p> View your previous service appointments. </p>
            </div>
            <div v-if="bookingHistory.length" class="history-list">
                <article v-for="booking in bookingHistory" :key="booking.id" class="history-card">
                    <div class="history-main">
                        <div> <span class="booking-service"> {{ booking.service }} </span>
                           <h3>
                                {{ booking.professional }}
                            </h3>

                            <p class="professional-job">
                                {{ booking.job }}
                            </p>
                        </div> <span class="booking-status" :class="booking.status.toLowerCase()"> {{ booking.status }}
                        </span>
                    </div>
                    <div class="history-details">
                        <div> <span class="detail-label">DATE</span> <span> {{ formatDate(booking.date) }} </span>
                        </div>
                        <div> <span class="detail-label">TIME</span> <span> {{ formatTime(booking.time) }} </span>
                        </div>
                        <div> <span class="detail-label">ADDRESS</span> <span> {{ booking.address }} </span> </div>
                    </div>
                    <div class="history-actions">
                        <button
                            class="booking-action-button"
                            type="button"
                        >
                            Report Professional
                        </button>

                        <button
                            v-if="booking.status === 'Completed'"
                            class="booking-action-button"
                            type="button"
                        >
                            Leave Review
                        </button>
                    </div>
                </article>
            </div>
            <div v-else class="empty-booking">
                <h3>No Booking History</h3>
                <p> You haven't made any previous bookings yet. </p>
            </div>
        </section>

    </main>

</template>


<style scoped>

/* PAGE */
.bookings-page {
    min-height: 100vh;
    /* padding: 40px 20px 80px; */
    background: var(--color-page);
}

/* PAGE HEADER */
.bookings-header {
    /* max-width: 1200px; */
    /* margin: 0 auto; */
    padding: 10px 80px;
}

/* .bookings-label {
    margin-bottom: 8px;
    color: var(--color-primary);
    font-size: var(--font-sm);
    font-weight: 700;
    letter-spacing: 2px;
} */

.bookings-header h1 {
    color: var(--color-primary);
    font-size: var(--font-xl);
    margin-bottom: var(--spacing-xs);
    font-weight: bolder;
    font-size: 50px;
}
/* .bookings-header h2 {
    margin: 10px 80px;
    color: var(--color-primary);
    font-size: 50px;
    font-weight: 700;
    line-height: 1.1;
} */

.bookings-header p:last-child {
    color: #666;
    font-size: var(--font-md);
    font-weight: 200;
    margin-bottom: var(--spacing-sm);
}

/* SECTION */
.bookings-section {
    max-width: 1200px;
    margin: 0 auto 50px;
}

.section-heading {
    margin: 0 80px 25px;
}

.section-heading h2 {
    /* margin-bottom: 6px;
    color: var(--color-primary);
    font-size: var(--font-xl);
    font-weight: 700; */

    color: var(--color-primary);
    font-size: var(--font-xl);
    margin-bottom: var(--spacing-xs);
    font-weight: bolder;
    margin-top: var(--spacing-sm)
    /* font-size: 50px; */
}

.section-heading p {
    color: #777;
    font-size: var(--font-sm);
    font-weight: 300;
}

.professional-job {
    margin-top: 5px;
    color: #777;
    font-size: var(--font-sm);
    font-weight: 300;
}

/* CURRENT BOOKING */
.current-booking-card {
    margin: 0 75px;
    padding: 35px 40px;
    background: #fafafa;
    border: 1px solid #e5e5e5;
}

.booking-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    padding-bottom: 25px;
    border-bottom: 1px solid #e5e5e5;
}

.booking-service {
    display: block;
    margin-bottom: 6px;
    color: var(--color-primary);
    font-size: var(--font-sm);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.booking-card-header h3,
.history-main h3 {
    color: #333;
    font-size: var(--font-lg);
    font-weight: 600;
}

/* STATUS */
.booking-status {
    display: inline-block;
    padding: 7px 14px;
    font-size: var(--font-xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.booking-status.confirmed {
    background: #dceeee;
    color: var(--color-primary);
}

.booking-status.completed {
    background: #e8e8e8;
    color: #555;
}

.booking-status.cancelled {
    background: #f1dddd;
    color: #8a3f3f;
}

/* BOOKING DETAILS */
.booking-details {
    display: grid;
    grid-template-columns: 1fr 1fr 1.5fr;
    gap: 30px;
    padding: 25px 0;
}

.booking-detail {
    display: flex;
    flex-direction: column;
    gap: 7px;
    color: #333;
    font-size: var(--font-sm);
}

.detail-label {
    color: #777;
    font-size: var(--font-xs);
    font-weight: 700;
    letter-spacing: 1px;
}

/* NOTES */
.booking-notes {
    padding: 20px 0;
    border-top: 1px solid #e5e5e5;
}

.booking-notes p {
    margin-top: 8px;
    color: #555;
    font-size: var(--font-sm);
    font-weight: 300;
    line-height: 1.6;
}

/* ACTIONS */
.booking-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 20px;
    flex-wrap: wrap;
}

.cancel-button {
    padding: 12px 25px;
    background: transparent;
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
    font-size: var(--font-sm);
    font-weight: 600;
    transition: 0.3s ease;
}

.cancel-button:hover {
    background: var(--color-primary);
    color: white;
}

.booking-action-button {
    padding: 12px 25px;
    /* margin-top: 20px; */
    border: 2px solid var(--color-primary);
    background: var(--color-primary);
    color: white;
    font-size: var(--font-sm);
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s ease;
}

.booking-action-button:hover {
    background: transparent;
    color: var(--color-primary);
}

/* BOOKING HISTORY */
.history-section {
    margin-top: 60px;
}

.history-list {
    display: flex;
    flex-direction: column;
    margin: 0 55px;
}

.history-card {
    padding: 25px 30px;
    border-top: 1px solid #e5e5e5;
}

.history-card:last-child {
    border-bottom: 1px solid #e5e5e5;
}

.history-main {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
}

.history-details {
    display: grid;
    grid-template-columns: 1fr 1fr 1.5fr;
    gap: 30px;
    margin-top: 20px;
}

.history-details>div {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: #555;
    font-size: var(--font-sm);
}

.history-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
    flex-wrap: wrap;
}

/* EMPTY STATE */
.empty-booking {
    padding: 50px 30px;
    text-align: center;
    background: #fafafa;
    border: 1px solid #e5e5e5;
}

.empty-booking h3 {
    margin-bottom: 10px;
    color: var(--color-primary);
    font-size: var(--font-lg);
    font-weight: 600;
}

.empty-booking p {
    margin-bottom: 25px;
    color: #777;
    font-size: var(--font-sm);
    font-weight: 300;
}

/* BOOK BUTTON */
.book-button {
    display: inline-block;
    padding: 13px 25px;
    background: var(--color-primary);
    color: white;
    font-size: var(--font-sm);
    font-weight: 600;
    text-decoration: none;
    transition: 0.3s ease;
}

.book-button:hover {
    background: var(--color-primary-dark);
}

/* TABLET */
@media (max-width: 850px) {
    .bookings-header {
        padding: 30px 40px;
    }

    .bookings-header h1 {
        font-size: 38px;
    }

    .booking-details,
    .history-details {
        grid-template-columns: 1fr 1fr;
    }

    .booking-detail:last-child,
    .history-details>div:last-child {
        grid-column: 1 / -1;
    }
}

/* MOBILE */
@media (max-width: 600px) {
    .bookings-page {
        padding: 8px 8px 50px;
    }

    .bookings-header {
        padding: 25px 16px 30px;
    }

    .bookings-header h1 {
        font-size: 28px;
    }

    .bookings-header p:last-child {
        font-size: 0.85rem;
    }

    .current-booking-card {
        margin: 0;
        padding: 25px 20px;
    }

    .booking-card-header,
    .history-main {
        flex-direction: column;
    }

    .booking-details,
    .history-details {
        grid-template-columns: 1fr;
        gap: 18px;
    }

    .booking-detail:last-child,
    .history-details>div:last-child {
        grid-column: auto;
    }

    .history-card {
        padding: 25px 15px;
    }

    .history-list {
        margin: 0;
    }

    .section-heading h2 {
        font-size: 24px;
    }

    .cancel-button,
    .book-button {
        width: 100%;
        text-align: center;
    }

    .booking-actions {
        justify-content: stretch;
    }

    .booking-actions,
    .history-actions {
        flex-direction: column;
    }

    .booking-action-button,
    .cancel-button {
        width: 100%;
    }
}

/* SMALL MOBILE */
@media (max-width: 400px) {
    .bookings-header {
        padding: 20px 12px;
    }

    .bookings-header h1 {
        font-size: 24px;
    }

    .current-booking-card {
        padding: 20px 15px;
    }

    .booking-card-header h3,
    .history-main h3 {
        font-size: 1.1rem;
    }
}
</style>
