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
      reviews.value = data.reviews
    }
  } catch (error) {
    console.error('Error loading reviews:', error)
  } finally {
    reviewsLoading.value = false
  }
}

onMounted(() => {
  getReviews()
})
</script>

<template>
    <div class="home-container">
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

                    Find Your Professional →
                    <button
                        class="service-link"
                        @click="router.push('/services')"
                    >
                        service
                    </button>
                </p>

                <br>

                <button class="worker-link" @click="router.push('/workersignup')">
                    Join as a worker
                </button>
            </div>

            <div class="home-services">
                <img :src="services" alt="Services">
            </div>
        </div>


        <div class="home-third-section">
            <h2>
                Why choose
                <span class="special-font">YENZA!</span>
            </h2>

            <div class="home-boxes">
                <div class="box">
                    <h3>Trusted Professionals</h3>
                    <p>Professionals you can rely on</p>
                </div>

                <hr>

                <div class="box">
                    <h3>Quick & Easy</h3>
                    <p>Find someone without waiting hours searching</p>
                </div>

                <hr>

                <div class="box">
                    <h3>Transparent Pricing</h3>
                    <p>Know what you're paying for</p>
                </div>
            </div>
        </div>


        <hr class="customhrline">


        <div class="home-fourth-section">
            <div class="home-boxes">
                <div class="box">
                    <h2>
                        500+
                        <br>
                        Professionals
                    </h2>
                </div>

                <div class="box">
                    <h2>
                        1,200+
                        <br>
                        Jobs completed
                    </h2>
                </div>

                <div class="box">
                    <h2>
                        4.8/5
                        <br>
                        Average rating
                    </h2>
                </div>
            </div>
        </div>


        <!-- REVIEWS -->

        <div class="home-reviews">
            <h2>Don't just take our word for it</h2>

            <div v-if="reviewsLoading" class="reviews-message">
                Loading reviews...
            </div>

            <div v-else-if="reviews.length === 0" class="reviews-message">
                No reviews available.
            </div>

            <div v-else class="review-cards">
                <div v-for="review in reviews" :key="review.id" class="review-card">
                    <div class="quote-mark">
                        “
                    </div>

                    <div class="review-stars">
                        <span v-for="star in 5" :key="star">
                            {{ star <= Math.round(review.rating) ? '★' : '☆' }}
                        </span>
                    </div>

                    <h3>
                        {{ review.full_name }}
                    </h3>

                    <p class="review-job">
                        {{ review.job_title }}
                    </p>

                    <div class="review-divider"></div>

                    <p class="review-rating">
                        {{ review.rating }}/5
                    </p>

                    <p class="review-count">
                        Based on {{ review.review_count }} reviews
                    </p>
                </div>
            </div>
        </div>
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
    .home-container {
        height: auto;
    }

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
}


/* ========================= */
/* SECOND SECTION */
/* ========================= */

.home-second-section {
    width: 100%;
    padding: 60px 50px;
    flex-shrink: 0;
}

.home-second-section h4 {
    color: #136163;
    margin-bottom: 15px;
    font-size: 25px;
}

.home-second-section p {
    word-spacing: 5%;
    font-weight: 600;
    font-size: 20px;
    line-height: 1.7;
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

@media (max-width: 1024px) {
    .home-second-section {
        padding: 50px 40px;
    }

    .home-second-section h4 {
        font-size: 23px;
    }

    .home-second-section p {
        max-width: 650px;
        font-size: 16px;
        line-height: 1.6;
    }

    .service-link {
        font-size: 16px;
    }
}

@media (max-width: 768px) {
    .home-second-section {
        padding: 45px 25px;
    }

    .home-second-section h4 {
        font-size: 21px;
        margin-bottom: 12px;
    }

    .home-second-section p {
        max-width: 100%;
        font-size: 15px;
        line-height: 1.6;
    }

    .service-link {
        font-size: 15px;
        margin-left: 8px;
    }
}

@media (max-width: 480px) {
    .home-second-section {
        padding: 35px 20px;
    }

    .home-second-section h4 {
        font-size: 20px;
        line-height: 1.3;
    }

    .home-second-section p {
        font-size: 14px;
        line-height: 1.6;
    }

    .service-link {
        font-size: 14px;
        margin-left: 5px;
    }
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

@media (max-width: 768px) {
    .home-third-section {
        padding: 45px 25px;
    }

    .home-third-section h2 {
        font-size: 28px;
    }

    .home-third-section .home-boxes {
        flex-direction: column;
        gap: 20px;
    }

    .box {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .home-third-section {
        padding: 35px 20px;
    }

    .home-third-section h2 {
        font-size: 25px;
    }

    .box {
        min-height: 140px;
        padding: 20px;
    }

    .box h3 {
        font-size: 18px;
    }

    .box p {
        font-size: 14px;
    }
}


/* ========================= */
/* FOURTH SECTION */
/* ========================= */

.customhrline {
    width: 100%;
    max-width: 90%;
    margin: 20px auto;
}

.home-fourth-section {
    width: 100%;
    padding: 60px 50px;
    box-sizing: border-box;
}

.home-fourth-section h2 {
    color: #136163;
    text-align: center;
    font-size: 35px;
    margin: 0 0 40px 0;
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

@media (max-width: 768px) {
    .home-fourth-section {
        padding: 45px 25px;
    }

    .home-fourth-section h2 {
        font-size: 28px;
    }

    .home-fourth-section .home-boxes {
        flex-direction: column;
        gap: 20px;
    }

    .home-fourth-section .box {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .home-fourth-section {
        padding: 35px 20px;
    }

    .home-fourth-section h2 {
        font-size: 25px;
    }

    .home-fourth-section .box {
        min-height: 140px;
        padding: 20px;
    }

    .home-fourth-section .box h2 {
        font-size: 25px;
    }
}


/* ========================= */
/* REVIEWS SECTION */
/* ========================= */

.home-reviews {
    width: 100%;
    padding: 70px 50px;
    box-sizing: border-box;
    background: #f7f9f9;
}

.home-reviews h2 {
    color: #136163;
    text-align: center;
    font-size: 35px;
    margin: 0 0 45px 0;
}


/* Review cards container */

.review-cards {
    width: 100%;
    max-width: 1150px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 70px;
}


/* Individual card */

.review-card {
    position: relative;
    background: white;
    min-height: 270px;
    padding: 35px 30px 30px;
    border-radius: 18px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    border: 1px solid #e7eeee;

    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);

    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
}


/* Teal line at top */

.review-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: #136163;
}


/* Hover effect */

.review-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 35px rgba(0, 0, 0, 0.12);
}


/* Quote */

.quote-mark {
    position: absolute;
    top: 12px;
    left: 20px;
    font-family: Georgia, serif;
    font-size: 65px;
    line-height: 1;
    color: rgba(19, 97, 99, 0.10);
}


/* Stars */

.review-stars {
    margin: 5px 0 12px;
    font-size: 24px;
    color: #f5b301;
    letter-spacing: 3px;
}

.review-stars span {
    display: inline-block;
}


/* Professional name */

.review-card h3 {
    margin: 0 0 7px;
    color: #136163;
    font-size: 21px;
    font-weight: 700;
}


/* Job title */

.review-job {
    margin: 0;
    color: #666;
    font-size: 15px;
    font-weight: 500;
}


/* Divider */

.review-divider {
    width: 45px;
    height: 2px;
    background: #136163;
    margin: 18px 0 14px;
    border-radius: 10px;
}


/* Rating */

.review-rating {
    margin: 0;
    color: #333;
    font-size: 17px;
    font-weight: 700;
}


/* Review count */

.review-count {
    margin-top: 5px;
    color: #888;
    font-size: 13px;
}


/* Loading / empty message */

.reviews-message {
    text-align: center;
    padding: 50px 20px;
    font-size: 18px;
    color: #666;
}


/* Reviews responsive */

@media (max-width: 900px) {
    .review-cards {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .home-reviews {
        padding: 50px 25px;
    }

    .home-reviews h2 {
        font-size: 28px;
        margin-bottom: 35px;
    }

    .review-cards {
        grid-template-columns: 1fr;
        max-width: 550px;
    }

    .review-card {
        min-height: 250px;
    }
}

@media (max-width: 480px) {
    .home-reviews {
        padding: 40px 20px;
    }

    .home-reviews h2 {
        font-size: 25px;
    }

    .review-card {
        min-height: 230px;
        padding: 30px 20px;
    }

    .review-card h3 {
        font-size: 18px;
    }

    .review-stars {
        font-size: 21px;
    }
}

</style>