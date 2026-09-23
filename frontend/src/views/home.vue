<script setup>
import { ref, onMounted } from 'vue'
import services from '../assets/services2.png'
import { useRouter } from 'vue-router'

const router = useRouter()

const reviews = ref([])
const reviewsLoading = ref(true)

const getReviews = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/reviews')
        const data = await response.json()

        if (response.ok && data.success) {
            reviews.value = data.reviews.slice(0, 3)
        }
    } catch (error) {
        console.error('Error loading reviews:', error)
    } finally {
        reviewsLoading.value = false
    }
}

const goToServices = () => {
    router.push('/services')
}

const goToSignup = () => {
    router.push('/signup')
}

const goToWorkerSignup = () => {
    router.push('/workersignup')
}

onMounted(() => {
    getReviews()
})
</script>

<template>
    <div class="home-container">

        <!-- ========================= -->
        <!-- HERO SECTION -->
        <!-- ========================= -->

        <div class="home-hero-section">
            <div class="home-text">
                <h1 class="home-heading">YENZA!</h1>

                <p>Need a helping hand?</p>

                <br>

                <p>
                    Find trusted professionals for all your home and maintenance needs.
                    From plumbing and painting to gardening, carpentry, and more —
                    get the job done by skilled workers you can rely on.

                    <br><br>

                    Don't spend hours looking for someone you can trust. Find the right professional,
                    book your service, and let the experts handle the rest

                    <br><br>

                </p>

                <br>

            </div>

            <div class="home-services">
                <img :src="services" alt="Services">
            </div>
        </div>


        <!-- ========================= -->
        <!-- THIRD SECTION -->
        <!-- ========================= -->

        <div class="home-third-section">
            <h2>
                Why choose
                <span class="special-font">YENZA!</span>
            </h2>

            <div class="home-boxes">

                <div class="box">
                    <div class="feature-icon">✓</div>

                    <h3>Trusted Professionals</h3>

                    <p>
                        Professionals you can rely on
                    </p>
                </div>

                <hr>

                <div class="box">
                    <div class="feature-icon">⚡</div>

                    <h3>Quick & Easy</h3>

                    <p>
                        Find someone without waiting hours searching
                    </p>
                </div>

                <hr>

                <div class="box">
                    <div class="feature-icon">R</div>

                    <h3>Transparent Pricing</h3>

                    <p>
                        Know what you're paying for
                    </p>
                </div>

            </div>
        </div>


        <hr class="customhrline">


        <!-- ========================= -->
        <!-- STATISTICS -->
        <!-- ========================= -->

        <div class="home-fourth-section">

            <div class="home-boxes">

                <div class="box">
                    <h2>
                        500+
                        <br>
                        Professionals
                    </h2>

                    <p>
                        Ready to help
                    </p>
                </div>

                <div class="box">
                    <h2>
                        1,200+
                        <br>
                        Jobs completed
                    </h2>

                    <p>
                        Successfully completed
                    </p>
                </div>

                <div class="box">
                    <h2>
                        4.8/5
                        <br>
                        Average rating
                    </h2>

                    <p>
                        From customers
                    </p>
                </div>

            </div>

        </div>


        <!-- ========================= -->
        <!-- REVIEWS -->
        <!-- ========================= -->

        <div class="home-reviews">

            <div class="reviews-heading">

                <p>
                    WHAT OUR CUSTOMERS SAY
                </p>

                <h2>
                    Don't just take our word for it
                </h2>

                <span>
                    Real experiences from people who have used YENZA.
                </span>

            </div>


            <div
                v-if="reviewsLoading"
                class="reviews-message"
            >
                Loading reviews...
            </div>


            <div
                v-else-if="reviews.length === 0"
                class="reviews-message"
            >
                No reviews available.
            </div>


            <div
                v-else
                class="review-cards"
            >

                <div
                    v-for="review in reviews"
                    :key="review.id"
                    class="review-card"
                >

                    <div class="review-card-top">

                        <div class="customer-avatar">
                            {{ review.full_name?.charAt(0)?.toUpperCase() || 'C' }}
                        </div>


                        <div class="customer-info">

                            <h3>
                                {{ review.full_name }}
                            </h3>

                            <p>
                                Verified Customer
                            </p>

                        </div>


                        <div class="verified-badge">
                            ✓
                        </div>

                    </div>


                    <div class="review-stars">

                        <span
                            v-for="star in 5"
                            :key="star"
                        >
                            {{ star <= Math.round(review.rating) ? '★' : '☆' }}
                        </span>

                    </div>


                    <div class="review-quote">
                        “
                    </div>


                    <p class="review-text">
                    {{ review.comment || review.review_text || review.review || 'Great service and a professional experience with YENZA.' }}
                    </p>


                    <div class="review-bottom">

                        <div>

                            <span class="review-rating">
                                {{ review.rating }}/5
                            </span>

                            <span class="review-job">
                                {{ review.job_title }}
                            </span>

                        </div>


                        <span class="review-count">
                            {{ review.review_count }} reviews
                        </span>

                    </div>

                </div>

            </div>

        </div>


        <!-- ========================= -->
        <!-- BOTTOM CTA -->
        <!-- ========================= -->

        <section class="bottom-cta">

            <div class="bottom-cta-content">

                <span>
                    YENZA!
                </span>

                <h2>
                    Your home.
                    <br>
                    Our professionals.
                </h2>

                <p>
                    Whatever needs fixing, building or improving,
                    there's someone on YENZA ready to help.
                </p>


                <div class="bottom-cta-buttons">

                    <button
                        @click="goToServices"
                    >
                        Find a Professional
                    </button>

                    <button
                        class="outline-button"
                        @click="goToSignup"
                    >
                        Create an Account
                    </button>

                </div>

            </div>

        </section>

    </div>
</template>


<style scoped>

@import url('https://db.onlinewebfonts.com/c/2da952d097bffd198ec0f0aa3fdd6804?family=JejuHallasan');


* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Plus Jakarta Sans', sans-serif;
}


.home-container {
    display: flex;
    flex-direction: column;
    width: 100%;
}


/* ========================= */
/* HERO SECTION */
/* ========================= */

.home-heading {
    font-family: "JejuHallasan", sans-serif;
    color: white;
    font-size: clamp(65px, 6vw, 100px);
    font-weight: 800;
    margin-bottom: 25px;
}


.special-font {
    font-size: 50px;
    font-family: "JejuHallasan", sans-serif;
}


.home-text {
    height: 600px;
    padding: 50px;
    color: white;
    background: #136163;
    width: 35%;
    flex: 0 0 35%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    box-sizing: border-box;
    flex-direction: column;
}


.home-text p {
    max-width: 550px;
    font-size: 18px;
    line-height: 1.7;
    word-spacing: 10%;
}


.home-services {
    width: 65%;
    flex: 0 0 65%;
    height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    box-sizing: border-box;
    background: #136163;
}


.home-services img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
}


.home-hero-section {
    width: 100%;
    height: 600px;
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
}


.service-link {
    background: #136163;
    color: white;
    border: none;
    font-weight: 600;
    font-size: 20px;
    text-decoration: underline;
    margin-left: 15px;
    cursor: pointer;
}


.service-link:hover {
    color: #bfcacb;
}


.worker-link {
    background: #136163;
    color: white;
    border: none;
    font-weight: 600;
    font-size: 20px;
    text-decoration: underline;
    cursor: pointer;
}


.worker-link:hover {
    color: #bfcacb;
}


/* ========================= */
/* THIRD SECTION */
/* ========================= */

.home-third-section {
    width: 100%;
    padding: 60px 50px;
    box-sizing: border-box;
}


.home-third-section h2 {
    color: #136163;
    text-align: center;
    font-size: 35px;
    margin: 0 0 40px 0;
}


.home-third-section .home-boxes {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 30px;
}


.box {
    flex: 1;
    min-height: 180px;
    padding: 30px;
    border-radius: 15px;
    box-sizing: border-box;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}


.box h3 {
    margin: 0 0 15px 0;
    font-size: 21px;
}


.box p {
    font-size: 16px;
    line-height: 1.5;
    margin: 0;
}


.feature-icon {
    width: 50px;
    height: 50px;
    display: grid;
    place-items: center;
    margin-bottom: 15px;
    border-radius: 50%;
    background: #dff2f1;
    color: #136163;
    font-size: 22px;
    font-weight: 700;
}


/* ========================= */
/* HR */
/* ========================= */

.customhrline {
    width: 100%;
    max-width: 90%;
    margin: 20px auto;
}


/* ========================= */
/* STATISTICS */
/* ========================= */

.home-fourth-section {
    width: 100%;
    padding: 60px 50px;
    box-sizing: border-box;
}


.home-fourth-section .home-boxes {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 30px;
}


.home-fourth-section .box {
    flex: 1;
    min-height: 180px;
    padding: 30px;
    border-radius: 15px;
    box-sizing: border-box;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}


.home-fourth-section .box h2 {
    color: #136163;
    margin: 0;
    font-size: 40px;
}


.home-fourth-section .box p {
    color: #777;
    margin-top: 10px;
}


/* ========================= */
/* REVIEWS SECTION */
/* ========================= */

.home-reviews {
    width: 100%;
    padding: 80px 50px;
    box-sizing: border-box;
    background: #f5f8f8;
}


.reviews-heading {
    text-align: center;
    margin-bottom: 50px;
}


.reviews-heading p {
    color: #136163;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    margin-bottom: 10px;
}


.home-reviews h2 {
    color: #136163;
    font-size: 35px;
    margin-bottom: 12px;
}


.reviews-heading span {
    color: #777;
    font-size: 15px;
}


.review-cards {
    width: 100%;
    max-width: 1150px;
    margin: auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 25px;
}


.review-card {
    position: relative;
    min-height: 300px;
    padding: 28px;
    background: white;
    border: 1px solid #e1eaea;
    border-radius: 22px;
    box-shadow: 0 10px 35px rgba(19, 97, 99, 0.07);
    overflow: hidden;
    transition: all 0.3s ease;
}


.review-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: #136163;
}


.review-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 45px rgba(19, 97, 99, 0.15);
}


.review-card-top {
    display: flex;
    align-items: center;
    gap: 13px;
}


.customer-avatar {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: #136163;
    color: white;
    font-size: 18px;
    font-weight: 700;
}


.customer-info {
    text-align: left;
}


.customer-info h3 {
    color: #183b56;
    font-size: 16px;
    margin-bottom: 4px;
}


.customer-info p {
    color: #7c8a8a;
    font-size: 12px;
}


.verified-badge {
    margin-left: auto;
    width: 24px;
    height: 24px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #dff2f1;
    color: #136163;
    font-size: 13px;
    font-weight: 700;
}


.review-stars {
    margin-top: 25px;
    color: #f2ae00;
    font-size: 19px;
    letter-spacing: 3px;
}


.review-quote {
    position: absolute;
    right: 22px;
    top: 65px;
    color: rgba(19, 97, 99, 0.08);
    font-family: Georgia, serif;
    font-size: 90px;
    line-height: 1;
}


.review-text {
    position: relative;
    z-index: 1;
    margin-top: 20px;
    min-height: 70px;
    color: #4d5d5d;
    font-size: 14px;
    line-height: 1.8;
    text-align: left;
}


.review-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding-top: 20px;
    margin-top: 20px;
    border-top: 1px solid #edf1f1;
}


.review-rating {
    display: block;
    color: #136163;
    font-size: 14px;
    font-weight: 700;
}


.review-job {
    display: block;
    margin-top: 4px;
    color: #888;
    font-size: 11px;
}


.review-count {
    color: #888;
    font-size: 11px;
}


.reviews-message {
    text-align: center;
    padding: 50px 20px;
    font-size: 18px;
    color: #666;
}


/* ========================= */
/* BOTTOM CTA */
/* ========================= */

.bottom-cta {
    width: 100%;
    padding: 100px 30px;
    background: #136163;
    position: relative;
    overflow: hidden;
}


.bottom-cta::before {
    content: "";
    position: absolute;
    width: 400px;
    height: 400px;
    right: -150px;
    top: -150px;
    border: 70px solid rgba(255, 255, 255, 0.04);
    border-radius: 50%;
}


.bottom-cta::after {
    content: "";
    position: absolute;
    width: 300px;
    height: 300px;
    left: -150px;
    bottom: -150px;
    border: 60px solid rgba(255, 255, 255, 0.04);
    border-radius: 50%;
}


.bottom-cta-content {
    position: relative;
    z-index: 1;
    max-width: 800px;
    margin: auto;
    text-align: center;
    color: white;
}


.bottom-cta-content > span {
    font-family: "JejuHallasan", sans-serif;
    font-size: 25px;
}


.bottom-cta h2 {
    margin-top: 12px;
    font-size: 48px;
    line-height: 1.1;
}


.bottom-cta p {
    max-width: 600px;
    margin: 20px auto 30px;
    font-size: 16px;
    line-height: 1.7;
    opacity: 0.9;
}


.bottom-cta-buttons {
    display: flex;
    justify-content: center;
    gap: 12px;
}


.bottom-cta-buttons button {
    padding: 14px 25px;
    border: 2px solid white;
    border-radius: 30px;
    background: white;
    color: #136163;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}


.bottom-cta-buttons button:hover {
    transform: translateY(-3px);
}


.bottom-cta-buttons .outline-button {
    background: transparent;
    color: white;
}


.bottom-cta-buttons .outline-button:hover {
    background: white;
    color: #136163;
}


/* ========================= */
/* RESPONSIVE */
/* ========================= */

@media (max-width: 1400px) {

    .home-text {
        width: 35%;
        flex: 0 0 35%;
    }

    .home-services {
        width: 65%;
        flex: 0 0 65%;
    }

    .home-heading {
        font-size: 80px;
    }
}


@media (max-width: 1024px) {

    .home-hero-section {
        flex-direction: column;
        height: auto;
    }

    .home-text {
        width: 100%;
        height: auto;
        min-height: 400px;
        padding: 40px;
    }

    .home-heading {
        font-size: 80px;
    }

    .home-text p {
        max-width: 100%;
        font-size: 17px;
    }

    .home-services {
        width: 100%;
        height: 500px;
    }

    .home-services img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .review-cards {
        grid-template-columns: 1fr 1fr;
    }
}


@media (max-width: 768px) {

    .home-text {
        min-height: 400px;
        padding: 35px 25px;
    }

    .home-heading {
        font-size: 65px;
        margin-bottom: 20px;
    }

    .home-text p {
        font-size: 16px;
        line-height: 1.6;
    }

    .home-services {
        height: 400px;
    }

    .home-third-section,
    .home-fourth-section {
        padding: 45px 25px;
    }

    .home-third-section .home-boxes,
    .home-fourth-section .home-boxes {
        flex-direction: column;
    }

    .box {
        width: 100%;
    }

    .home-reviews {
        padding: 60px 25px;
    }

    .review-cards {
        grid-template-columns: 1fr;
        max-width: 500px;
    }

    .home-reviews h2 {
        font-size: 28px;
    }

    .bottom-cta {
        padding: 75px 25px;
    }

    .bottom-cta h2 {
        font-size: 36px;
    }

    .bottom-cta-buttons {
        flex-direction: column;
    }

    .bottom-cta-buttons button {
        width: 100%;
    }
}


@media (max-width: 480px) {

    .home-text {
        min-height: 350px;
        padding: 30px 20px;
    }

    .home-heading {
        font-size: 55px;
    }

    .home-text p {
        font-size: 15px;
        line-height: 1.5;
    }

    .home-services {
        height: 220px;
    }

    .home-services img {
        height: 220px;
        object-fit: cover;
    }

    .home-reviews {
        padding: 50px 20px;
    }

    .home-reviews h2 {
        font-size: 26px;
    }

    .review-card {
        padding: 25px;
    }

    .bottom-cta {
        padding: 60px 20px;
    }

    .bottom-cta h2 {
        font-size: 30px;
    }
}

</style>