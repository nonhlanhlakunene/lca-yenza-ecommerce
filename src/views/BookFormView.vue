<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { professionals } from '../data/professionals'

const route = useRoute()

const professional = computed(() => {
    return professionals.find(
        person => person.slug === route.params.slug
    )
})

const booking = ref({
    date: '',
    time: '',
    address: '',
    notes: ''
})

const submitBooking = () => {
    if (
        !booking.value.date ||
        !booking.value.time ||
        !booking.value.address
    ) {
        alert('Please complete all required fields.')
        return
    } alert('Your booking request has been submitted!')

    console.log('Booking:', booking.value)
} 
</script>



<template>
    <main class="booking-page">

        <!-- PAGE HEADER -->
        <section class="booking-header">
            <h1>BOOK A PROFESSIONAL</h1>
            <p> 
               Select a date and time that works for you and provide the details of the service you need.
            </p>
        </section>

        <!-- BOOKING SECTION -->
        <section class="booking-section">
            <!-- BOOKING FORM -->
            <form class="booking-form" @submit.prevent="submitBooking">
                
                <div v-if="professional" class="selected-professional">
                    <span class="detail-label">BOOKING WITH</span>

                    <h2>{{ professional.name }}</h2>

                    <p>{{ professional.job }}</p>

                    <span class="professional-category">
                        {{ professional.category }}
                    </span>
                </div>

                <!-- DATE AND TIME -->
                <div class="form-row">
                    <div class="form-group"> <label for="date"> Preferred Date * </label> <input id="date"
                            v-model="booking.date" type="date"> </div>
                    <div class="form-group"> <label for="time"> Preferred Time * </label> <input id="time"
                            v-model="booking.time" type="time"> </div>
                </div>

                <!-- ADDRESS -->
                <div class="form-group"> <label for="address"> Service Address * </label> <input id="address"
                        v-model="booking.address" type="text"
                        placeholder="Enter the address where the service is needed"> </div>

                <!-- ADDITIONAL INFORMATION -->
                <div class="form-group"> <label for="notes"> Additional Information </label> <textarea id="notes"
                        v-model="booking.notes" rows="5"
                        placeholder="Tell the professional anything they should know about the job..."></textarea>
                </div>

                <!-- SUBMIT BUTTON -->
                <button type="submit" class="booking-button"> REQUEST BOOKING </button>
            </form>

            <!-- INFORMATION PANEL -->
            <aside class="booking-info">
                <h2>HOW IT WORKS</h2>
                <!-- STEP 1 -->
                <div class="info-item"> <span>01</span>
                    <div>
                        <h3>Choose your professional</h3>
                        <p> Select a professional that suits your needs. </p>
                    </div>
                </div>
                <!-- STEP 2 -->
                <div class="info-item"> <span>02</span>
                    <div>
                        <h3>Request a booking</h3>
                        <p>Choose a date and time that works for you.</p>
                    </div>
                </div>
                <!-- STEP 3 -->
                <div class="info-item"> <span>03</span>
                    <div>
                        <h3>Confirm your booking</h3>
                        <p> Review your booking details before continuing to payment. </p>
                    </div>
                </div>
            </aside>
        </section>


    </main>
</template>


<style scoped>
.booking-page {
    min-height: 100vh;
    padding: 40px 20px;
    background: var(--color-page);
}

/* PAGE HEADER */
.booking-header {
    color: var(--color-primary);
    font-size: var(--font-xl);
    margin-bottom: var(--spacing-xs);
    font-weight: bolder;
    font-size: 50px;
}

.booking-label {
    margin-bottom: 8px;
    color: var(--color-primary);
    font-size: var(--font-sm);
    font-weight: 700;
    letter-spacing: 2px;
}

.booking-header h1 {
    color: var(--color-primary);
    font-size: 50px;
    margin-bottom: var(--spacing-xs);
    font-weight: bolder;
}

.booking-header p:last-child {
    max-width: 650px;
    color: #666;
    font-size: var(--font-md);
    font-weight: 200;
    line-height: 1.6;
}
.selected-professional {
    margin-bottom: 30px;
}

/* MAIN BOOKING CONTENT */
.booking-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-width: 1200px;
    margin: 0 auto;
    background: var(--color-page);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

/* BOOKING FORM */
.booking-form {
    padding: 40px 80px 50px;
    background: var(--color-page);
}

.form-group {
    margin-bottom: 18px;
}

.form-group label {
    display: block;
    margin-bottom: 6px;
    color: #333;
    font-size: var(--font-sm);
    font-weight: 600;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 14px 16px;
    background: #f5f5f5;
    border: 2px solid #d9d9d9;
    border-radius: 10px;
    color: #333;
    font-family: inherit;
    font-size: var(--font-sm);
    transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    background: white;
}

.form-group textarea {
    resize: vertical;
    min-height: 100px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

/* BOOKING BUTTON */
.booking-button {
    width: 100%;
    padding: 14px 50px;
    background: var(--color-primary);
    border: none;
    border-radius: 10px;
    color: white;
    font-size: var(--font-md);
    font-weight: 600;
    transition: all 0.3s ease;
}

.booking-button:hover {
    background: var(--color-primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(26, 95, 95, 0.3);
}

/* HOW IT WORKS */
.booking-info {
    padding: 10px 80px 50px;
    background: #fafafa;
}

.booking-info h2 {
    margin-bottom: 30px;
    color: var(--color-primary);
    font-size: var(--font-xl);
    font-weight: 700;
}

.info-item {
    display: flex;
    align-items: flex-start;
    gap: 18px;
    padding: 20px 0;
    border-bottom: 1px solid #e5e5e5;
}

.info-item:first-of-type {
    border-top: 1px solid #e5e5e5;
}

.info-item span {
    min-width: 30px;
    color: var(--color-primary);
    font-size: var(--font-sm);
    font-weight: 700;
}

.info-item h3 {
    margin-bottom: 6px;
    color: #333;
    font-size: var(--font-md);
    font-weight: 600;
}

.info-item p {
    color: #777;
    font-size: var(--font-sm);
    font-weight: 300;
    line-height: 1.5;
}

/* TABLET */
@media (max-width: 850px) {
    .booking-header {
        padding: 30px 40px;
    }

    .booking-header h1 {
        font-size: 38px;
    }

    .booking-section {
        grid-template-columns: 1fr;
    }

    .booking-form {
        padding: 30px 40px 40px;
    }

    .booking-info {
        padding: 30px 40px 40px;
    }
}

/* MOBILE */
@media (max-width: 600px) {
    .booking-page {
        padding: 8px;
    }

    .booking-header {
        padding: 25px 16px 20px;
    }

    .booking-header h1 {
        font-size: 28px;
    }

    .booking-header p:last-child {
        font-size: 0.85rem;
    }

    .booking-form {
        padding: 18px 16px 25px;
    }

    .booking-info {
        padding: 25px 16px;
    }

    .booking-info h2 {
        font-size: 24px;
        margin-bottom: 20px;
    }

    .form-row {
        grid-template-columns: 1fr;
        gap: 0;
    }

    .form-group {
        margin-bottom: 14px;
    }

    .form-group label {
        font-size: 0.8rem;
        margin-bottom: 4px;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
        padding: 10px 14px;
        font-size: 0.85rem;
        border-radius: 8px;
    }

    .form-group textarea {
        min-height: 80px;
    }

    .booking-button {
        padding: 12px 20px;
        font-size: 0.9rem;
        border-radius: 8px;
    }

    .info-item {
        padding: 15px 0;
    }

    .info-item h3 {
        font-size: 0.9rem;
    }

    .info-item p {
        font-size: 0.8rem;
    }
}

/* SMALL MOBILE */
@media (max-width: 400px) {
    .booking-header {
        padding: 20px 12px;
    }

    .booking-header h1 {
        font-size: 24px;
    }

    .booking-form {
        padding: 14px 12px 20px;
    }

    .booking-info {
        padding: 20px 12px;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
        padding: 8px 12px;
        font-size: 0.8rem;
    }

    .booking-button {
        padding: 10px 16px;
        font-size: 0.85rem;
    }
}
</style>
