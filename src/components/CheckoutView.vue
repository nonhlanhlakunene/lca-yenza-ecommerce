<script setup>
import { ref } from 'vue'

// FORM DATA

// Contact Information
const fullName = ref('')
const email = ref('')

// Address Information
const address = ref('')
const city = ref('')
const postalCode = ref('')
const cell = ref('')

// Payment Method
const paymentMethod = ref('')

// Form Submission
const message = ref('')


// SELECT PAYMENT METHOD
function selectPayment(method) {
    paymentMethod.value = method
}

// PAYMENT BUTTON
function paySecurely() {

    // Check if all required fields are filled
    if (
        !fullName.value ||
        !email.value ||
        !address.value ||
        !city.value ||
        !postalCode.value ||
        !cell.value
    ) {
        message.value = 'Please fill in all required fields.'

        return

}

    // Check if a payment method is selected
    if (!paymentMethod.value) {
        message.value = 'Please select a payment method.'

        return

    }


    // Check card information(change with actual card validation logic)
    if (
        !cardNumber.value ||
        !expiryDate.value ||
        !cardName.value ||
        !cvv.value
    ) {

        message. value = 'Please complete your payment information.'

        return

    }

    // Everything is valid, proceed with payment processing
    message.value = 'Payment successful! Thank you for your purchase.'

}
</script>


<template>

    <div class="booking-page">

        <!-- MAIN BOOKING/PAYMENT BOX -->

        <main class="payment-container">

            <h1>COMPLETE YOUR PURCHASE</h1>


            <!-- CONTACT INFORMATION -->

            <section class="form-section">

                <h2>Contact Information</h2>

                <div class="form-row">

                    <input
                        v-model="fullName"
                        type="text"
                        placeholder="Full Name"
                    />

                    <input
                        v-model="email"
                        type="email"
                        placeholder="Email"
                    />

                </div>

            </section>


            <!-- ADDRESS -->

            <section class="form-section">

                <h2>Shipping Address</h2>

                <div class="form-row">

                    <input
                        v-model="address"
                        type="text"
                        placeholder="Address"
                    />

                    <input
                        v-model="city"
                        type="text"
                        placeholder="City"
                    />

                </div>


                <div class="form-row">

                    <input
                        v-model="postalCode"
                        type="text"
                        placeholder="Postal Code"
                    />

                    <input
                        v-model="cell"
                        type="tel"
                        placeholder="Cell"
                    />

                </div>

            </section>


            <!-- PAYMENT METHOD -->

            <section class="form-section payment-section">

                <h2>Payment Method</h2>

                <div class="payment-methods">


                    <!-- CREDIT -->

                    <div
                        class="payment-option"
                        :class="{ selected: paymentMethod === 'Credit' }"
                        @click="selectPayment('Credit')"
                    >

                        <div class="payment-box">
                        </div>

                        <p>Credit</p>

                    </div>


                    <!-- DEBIT -->

                    <div
                        class="payment-option"
                        :class="{ selected: paymentMethod === 'Debit' }"
                        @click="selectPayment('Debit')"
                    >

                        <div class="payment-box">
                        </div>

                        <p>Debit</p>

                    </div>


                    <!-- PAYPAL -->

                    <div
                        class="payment-option"
                        :class="{ selected: paymentMethod === 'PayPal' }"
                        @click="selectPayment('PayPal')"
                    >

                        <div class="payment-box">
                        </div>

                        <p>PayPal</p>

                    </div>


                    <!-- OTHER -->

                    <div
                        class="payment-option"
                        :class="{ selected: paymentMethod === 'Other' }"
                        @click="selectPayment('Other')"
                    >

                        <div class="payment-box">
                        </div>

                        <p>Other</p>

                    </div>

                </div>

            </section>


            <!-- CARD INFORMATION -->

            <section class="card-information">

                <div class="form-row">

                    <input
                        v-model="cardNumber"
                        type="text"
                        placeholder="Card Number"
                    />

                    <input
                        v-model="expiryDate"
                        type="text"
                        placeholder="Expiry Date"
                    />

                </div>


                <div class="form-row">

                    <input
                        v-model="cardName"
                        type="text"
                        placeholder="Card Name"
                    />

                    <input
                        v-model="cvv"
                        type="password"
                        placeholder="CVV"
                    />

                </div>

            </section>


            <!-- PAY BUTTON -->

            <button
                class="pay-button"
                @click="paySecurely"
            >
                Pay Securely
            </button>


            <!-- MESSAGE -->

            <p
                v-if="message"
                class="payment-message"
            >
                {{ message }}
            </p>

        </main>

    </div>

</template>


<style scoped>

/* --------------------------------------
   MAIN PAGE
-------------------------------------- */

.booking-page {

    width: 100%;

    min-height: 100vh;

    padding: 38px 36px;

    box-sizing: border-box;

}


/* --------------------------------------
   PAYMENT CONTAINER
-------------------------------------- */

.payment-container {

    width: 100%;

    max-width: 600px;

    min-height: 568px;

    margin: 0 auto;

    border: 1px solid #7faeb0;

    padding: 20px 40px 30px;

    box-sizing: border-box;

}


/* --------------------------------------
   MAIN TITLE
-------------------------------------- */

.payment-container h1 {

    text-align: center;

    font-size: 12px;

    font-weight: 700;

    margin: 0 0 32px;

}


/* --------------------------------------
   SECTIONS
-------------------------------------- */

.form-section {

    margin-bottom: 28px;

}


.form-section h2 {

    text-align: center;

    font-size: 11px;

    font-weight: 600;

    margin: 0 0 10px;

}


/* --------------------------------------
   FORM ROW
-------------------------------------- */

.form-row {

    display: flex;

    justify-content: center;

    gap: 98px;

    margin-bottom: 12px;

}


/* --------------------------------------
   INPUTS
-------------------------------------- */

.form-row input {

    width: 160px;

    height: 19px;

    border: 1px solid #cfcfcf;

    padding: 2px 8px;

    box-sizing: border-box;

    font-family: 'Plus Jakarta Sans', sans-serif;

    font-size: 8px;

    text-align: center;

    outline: none;

}


.form-row input:focus {

    border: 1px solid #126c6e;

}


.form-row input::placeholder {

    color: #222;

    opacity: 1;

    letter-spacing: 3px;

}


/* --------------------------------------
   PAYMENT METHODS
-------------------------------------- */

.payment-section {

    margin-top: 4px;

}


.payment-methods {

    display: flex;

    justify-content: space-between;

    align-items: flex-start;

    max-width: 470px;

    margin: 0 auto;

}


.payment-option {

    text-align: center;

    cursor: pointer;

}


/* --------------------------------------
   PAYMENT BOX
-------------------------------------- */

.payment-box {

    width: 40px;

    height: 44px;

    border: 1px solid #7faeb0;

    margin: 0 auto 5px;

    transition: 0.2s ease;

}


/* When payment option is selected */

.payment-option.selected .payment-box {

    background-color: #126c6e;

}


/* Payment text */

.payment-option p {

    margin: 0;

    font-size: 10px;

    font-weight: 500;

}


/* --------------------------------------
   CARD INFORMATION
-------------------------------------- */

.card-information {

    margin-top: 40px;

}


/* --------------------------------------
   PAY BUTTON
-------------------------------------- */

.pay-button {

    display: block;

    width: 160px;

    height: 24px;

    margin: 56px auto 0;

    border: none;

    border-radius: 20px;

    background-color: #126c6e;

    color: white;

    font-family: 'Plus Jakarta Sans', sans-serif;

    font-size: 8px;

    font-weight: 600;

    cursor: pointer;

    transition: 0.2s ease;

}


.pay-button:hover {

    background-color: #0e5b5d;

    transform: translateY(-1px);

}


/* --------------------------------------
   MESSAGE
-------------------------------------- */

.payment-message {

    text-align: center;

    margin-top: 15px;

    font-size: 10px;

}


/* --------------------------------------
   MOBILE
-------------------------------------- */

@media (max-width: 700px) {

    .booking-page {

        padding: 25px 15px;

    }


    .payment-container {

        padding: 25px 20px;

    }


    .form-row {

        flex-direction: column;

        align-items: center;

        gap: 10px;

    }


    .form-row input {

        width: 80%;

    }


    .payment-methods {

        max-width: 90%;

    }

}


</style>