<template>
  <div class="page-container">

    <!-- TOP DIVIDER -->
    <div class="divider-line"></div>

    <main class="about-page">

      <!-- ================================
           HERO SECTION
      ================================= -->
      <section class="about-hero">
        <h1>About Us</h1>

        <h2>Connecting you with local professionals, fast.</h2>

        <p class="hero-description">
          YENZA! was created to make it easier for households and businesses
          to find skilled service providers in their own area. We believe in
          reliable work, no stress.
        </p>
      </section>


      <!-- ================================
           MISSION SECTION
      ================================= -->
      <section class="mission-section">
        <h2>Our Mission</h2>

        <p class="mission-text">
          Our mission is to empower South African communities by providing
          a seamless, reliable platform that connects households with trusted
          local service professionals. We aim to drive economic opportunity
          while taking the hassle out of everyday home services.
        </p>
      </section>


      <!-- ================================
           BENEFITS BANNER
      ================================= -->
      <section class="banner-section">
        <div
          v-for="(item, index) in bannerItems"
          :key="index"
          class="banner-item"
        >
          <div class="banner-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path
                d="M12 2l2.4 1.8 2.9-.6 1.1 2.8 2.8 1.1-.6 2.9L22 12l-1.8 2.4.6 2.9-2.8 1.1-1.1 2.8-2.9-.6L12 22l-2.4-1.8-2.9.6-1.1-2.8-2.8-1.1.6-2.9L2 12l1.8-2.4-.6-2.9 2.8-1.1 1.1-2.8 2.9.6L12 2z"
              />

              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>

          <p>{{ item.title }}</p>
        </div>
      </section>


      <!-- ================================
           TEAM SECTION
      ================================= -->
      <section class="team-section">
        <h2>Meet the Yenza Team</h2>

        <p class="team-intro">
          Meet the people behind Yenza, working together to make finding
          trusted local professionals easier and more convenient.
        </p>

        <div class="team-grid">

          <!-- TEAM MEMBER CARD -->
          <div
            v-for="(member, index) in teamMembers"
            :key="index"
            class="team-card"
          >
            <img
              :src="member.image"
              :alt="`${member.name} - ${member.role}`"
            />

            <div class="team-info">
              <h3>{{ member.name }}</h3>

              <p class="team-role">
                {{ member.role }}
              </p>

              <p class="team-description">
                {{ member.description }}
              </p>
            </div>
          </div>

        </div>
      </section>


      <!-- ================================
           FAQ SECTION
      ================================= -->
      <section class="faq-section">
        <h2>FAQs</h2>

        <p class="faq-intro">
          Have questions about Yenza? Find answers to some of our most
          frequently asked questions below.
        </p>

        <div class="faq-list">

          <!-- FAQ ITEM -->
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="faq-item"
          >

            <!-- QUESTION -->
            <button
              type="button"
              class="faq-question"
              @click="toggleFaq(index)"
              :aria-expanded="openFaq === index"
            >
              <span class="faq-question-text">
                {{ faq.question }}
              </span>

              <span
                class="faq-icon"
                :class="{ open: openFaq === index }"
                aria-hidden="true"
              >
                +
              </span>
            </button>


            <!-- ANSWER -->
            <div
              v-if="openFaq === index"
              class="faq-answer"
            >
              <p>
                {{ faq.answer }}
              </p>
            </div>

          </div>

        </div>
      </section>

    </main>


    <!-- BOTTOM DIVIDER -->
    <div class="divider-line"></div>

  </div>
</template>


<script setup>
import { ref } from 'vue'


// ========================================
// TEAM IMAGES
// ========================================

import angelaImg from '../assets/Angela Solomons.jpg'
import ishmaelImg from '../assets/Ishma-iel Gray.jpg'
import elijahImg from '../assets/Elijah Lategan.png'
import nonhlanhlaImg from '../assets/Nonhlanhla Kunene.jpg'


// ========================================
// BANNER ITEMS
// ========================================

const bannerList = [
  {
    title: 'Satisfaction Guaranteed'
  },
  {
    title: 'Local Experts'
  },
  {
    title: 'Easy Bookings'
  },
  {
    title: 'Safe and Secure'
  }
]

const bannerItems = ref(bannerList)


// ========================================
// TEAM MEMBERS
// ========================================

const teamList = [
  {
    name: 'Elijah Lategan',
    role: 'Co-Founder & Product Development',
    image: elijahImg,
    description:
      'Drives product development and builds the technology that makes it easier for customers to discover, connect with and book local professionals.'
  },

  {
    name: 'Ishma-iel Gray',
    role: 'Co-Founder & Marketplace Growth',
    image: ishmaelImg,
    description:
      'Helps shape the Yenza marketplace by connecting customer needs with local services and creating opportunities for professionals to grow their businesses.'
  },

  {
    name: 'Angela Solomons',
    role: 'Co-Founder & Customer Experience',
    image: angelaImg,
    description:
      'Shapes the customer journey, from discovering a professional to booking and paying, with a focus on making Yenza simple, accessible and trustworthy.'
  },

  {
    name: 'Nonhlanhla Kunene',
    role: 'Co-Founder & Community & Trust',
    image: nonhlanhlaImg,
    description:
      'Builds trust within the Yenza community by championing user feedback, professional standards and a marketplace where customers and service providers can thrive.'
  }
]

const teamMembers = ref(teamList)


// ========================================
// FAQ ITEMS
// ========================================

const faqList = [
  {
    question: 'What is Yenza?',
    answer:
      'Yenza is a local services marketplace that connects customers with professionals in their area. Whether you need a plumber, electrician, painter, carpenter or another skilled professional, Yenza makes it easier to find and book the right person.'
  },

  {
    question: 'How do I find a professional?',
    answer:
      'You can browse available services or use the search and location features to find professionals in your area. You can view professional profiles, services, experience and reviews before deciding who to book.'
  },

  {
    question: 'How do I book a service?',
    answer:
      'Once you have found a professional you would like to work with, select the service you need and choose an available date and time. Provide the required booking details and confirm your booking through Yenza.'
  },

  {
    question: 'Can I choose a specific professional?',
    answer:
      'Yes. Yenza allows you to browse professional profiles so you can choose a service provider based on their services, experience, reviews and availability.'
  },

  {
    question: 'How does payment work?',
    answer:
      'Yenza provides secure online payment options during the checkout process. You can select an available payment method and complete your payment through our secure payment system.'
  },

  {
    question: 'Is my payment information safe?',
    answer:
      'Yenza is designed with security in mind. Payment information is processed through our payment system rather than being stored directly as plain text in the application.'
  },

  {
    question: 'Can I leave a review after my booking?',
    answer:
      'Yes. After completing a booking, customers can leave feedback about their experience. Reviews help other customers make informed choices and help professionals build their reputation on Yenza.'
  },

  {
    question: 'Can I report a professional?',
    answer:
      'Yes. Customers can report professionals if they experience inappropriate behaviour, unreliable service, suspicious activity or another serious issue. Reports help us maintain a safer marketplace.'
  },

  {
    question: 'Can professionals join Yenza?',
    answer:
      'Yes. Skilled service providers can join Yenza, create a professional profile and showcase their services, experience and skills to potential customers.'
  },

  {
    question: 'What areas does Yenza operate in?',
    answer:
      'Yenza is currently available in Cape Town only, connecting customers with local professionals in the Cape Town area. As the platform grows, we aim to expand to more communities and areas across South Africa.'
  }

]

const faqs = ref(faqList)


// ========================================
// FAQ DROPDOWN
// ========================================

const openFaq = ref(null)

const toggleFaq = (index) => {
  if (openFaq.value === index) {
    openFaq.value = null
  } else {
    openFaq.value = index
  }
}
</script>


<style scoped>

/* ========================================
   BASE PAGE
======================================== */

.page-container {
  background-color: var(--color-primary);
  color: var(--color-page);
  min-height: 100vh;
  font-family: var(--font-main);
}


/* ========================================
   DIVIDERS
======================================== */

.divider-line {
  width: 100%;
  height: 2px;
  background-color: var(--color-page);
}


/* ========================================
   HERO SECTION
======================================== */

.about-hero {
  padding: var(--spacing-lg) var(--page-padding);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.about-hero h1 {
  font-size: var(--font-xl);
  font-weight: 700;
  margin: 0 0 var(--spacing-xs);
}

.about-hero h2 {
  font-size: var(--font-md);
  font-weight: 600;
  margin: 0 0 var(--spacing-xs);
}

.hero-description {
  max-width: 500px;
  font-size: var(--font-sm);
  line-height: 1.5;
  opacity: 0.9;
  margin: 0;
}


/* ========================================
   MISSION SECTION
======================================== */

.mission-section {
  max-width: var(--page-max-width);
  margin: 0 auto;
  padding: 0 var(--page-padding) var(--spacing-lg);
  text-align: center;
}

.mission-section h2 {
  font-size: var(--font-md);
  font-weight: 600;
  margin: 0 0 var(--spacing-xs);
}

.mission-text {
  max-width: 600px;
  margin: 0 auto;
  font-size: var(--font-sm);
  line-height: 1.6;
  opacity: 0.9;
}


/* ========================================
   BENEFITS BANNER
======================================== */

.banner-section {
  background-color: var(--color-primary-dark);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: var(--spacing-md) var(--page-padding);
  margin-bottom: var(--spacing-lg);
}

.banner-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  text-align: center;
}

.banner-icon svg {
  width: 42px;
  height: 42px;
  stroke: var(--color-page);
}

.banner-item p {
  font-size: var(--font-xs);
  font-weight: 600;
  margin: 0;
}


/* ========================================
   TEAM SECTION
======================================== */

.team-section {
  max-width: var(--page-max-width);
  margin: 0 auto;
  padding: 0 var(--page-padding) var(--spacing-lg);
  text-align: center;
}

.team-section h2 {
  font-size: var(--font-xl);
  font-weight: 700;
  margin: 0 0 var(--spacing-xs);
}

.team-intro {
  max-width: 650px;
  margin: 0 auto var(--spacing-lg);
  font-size: var(--font-sm);
  line-height: 1.6;
  opacity: 0.9;
}


/* ========================================
   TEAM GRID
======================================== */

.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  width: 100%;
}


/* ========================================
   TEAM CARD
======================================== */

.team-card {
  background-color: var(--color-primary);
  border: 1px solid var(--color-page);
  overflow: hidden;
  text-align: left;
  transition: transform 0.2s ease;
}

.team-card:hover {
  transform: translateY(-5px);
}


/* ========================================
   TEAM IMAGE
======================================== */

.team-card img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
}


/* ========================================
   TEAM INFORMATION
======================================== */

.team-info {
  padding: var(--spacing-sm);
}

.team-info h3 {
  margin: 0 0 var(--spacing-xs);
  font-size: var(--font-md);
  font-weight: 600;
}

.team-role {
  margin: 0 0 var(--spacing-xs);
  font-size: var(--font-xs);
  font-weight: 600;
}

.team-description {
  margin: 0;
  font-size: var(--font-xs);
  line-height: 1.6;
  opacity: 0.85;
}


/* ========================================
   FAQ SECTION
======================================== */

/* ========================================
   FAQ SECTION
======================================== */

.faq-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 var(--page-padding) var(--spacing-lg);
  text-align: center;
}

.faq-section h2 {
  font-size: var(--font-xl);
  font-weight: 700;
  margin: 0 0 var(--spacing-sm);
}

.faq-intro {
  max-width: 600px;
  margin: 0 auto var(--spacing-lg);
  font-size: var(--font-sm);
  line-height: 1.6;
  opacity: 0.85;
}


/* ========================================
   FAQ LIST
======================================== */

.faq-list {
  width: 100%;
}


/* ========================================
   FAQ ITEM / DROPDOWN
======================================== */

.faq-item {
  background-color: var(--color-primary-dark);
  border: 1px solid var(--color-primary);
  margin-bottom: var(--spacing-sm);
}


/* ========================================
   FAQ QUESTION
======================================== */

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: 20px 24px;
  background-color: var(--color-primary-dark);
  border: none;
  cursor: pointer;
  text-align: left;
  color: #ffffff;
  font-family: var(--font-main);
  font-size: var(--font-sm);
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.faq-question:hover {
  background-color: var(--color-primary);
}

.faq-question-text {
  flex: 1;
  color: #ffffff;
}


/* ========================================
   FAQ PLUS ICON
======================================== */

.faq-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 400;
  color: #ffffff;
  transition: transform 0.2s ease;
}

.faq-icon.open {
  transform: rotate(45deg);
}


/* ========================================
   FAQ ANSWER
======================================== */

.faq-answer {
  background-color: var(--color-primary-dark);
  text-align: left;
  padding: 0 24px 22px;
  border-top: 1px solid var(--color-primary);
}

.faq-answer p {
  max-width: 700px;
  margin: 18px 0 0;
  color: #ffffff;
  font-size: var(--font-xs);
  line-height: 1.7;
  font-weight: 400;
}

/* ========================================
   RESPONSIVE - TABLET
======================================== */

@media (max-width: 900px) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}


/* ========================================
   RESPONSIVE - MOBILE
======================================== */

@media (max-width: 550px) {

  .banner-section {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .team-grid {
    grid-template-columns: 1fr;
  }

  .team-card img {
    height: 320px;
  }

  .faq-section {
    padding-left: 5%;
    padding-right: 5%;
  }

  .faq-question {
    font-size: var(--font-xs);
    padding: 18px 16px;
  }

  .faq-answer {
    padding: 0 16px 18px;
  }

  .faq-answer p {
    font-size: var(--font-xs);
  }
}

</style>