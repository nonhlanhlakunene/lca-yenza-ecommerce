<template>
  <div class="page-container">

    <!-- TOP DIVIDER -->
    <div class="divider-line"></div>

    <main class="about-page">

      <!-- HERO SECTION -->
      <section class="about-hero">
        <h1>About Us</h1>
        <h2>Connecting you with local professionals, fast.</h2>
        <p class="hero-description">
          YENZA! was created to make it easier for households and businesses to find skilled service providers in their own area. We believe in reliable work, no stress.
        </p>
      </section>


      <!-- MISSION SECTION -->
       <section class="mission-section">
        <h2>Our Mission</h2>
        <p class="mission-text">
          Our mission is to empower South African communities by providing a seamless, reliable platform that connects households with trusted local service professionals. We aim to drive economic opportunity while taking the hassle out of everyday home services.
        </p>
       </section>


      <!-- BANNER SECTION -->
       <section class="banner-section">
        <div 
          v-for="(item, index) in bannerItems"
          v-bind:key="index"
          class="banner-item"
        >

          <div class="banner-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2l2.4 1.8 2.9-.6 1.1 2.8 2.8 1.1-.6 2.9L22 12l-1.8 2.4.6 2.9-2.8 1.1-1.1 2.8-2.9-.6L12 22l-2.4-1.8-2.9.6-1.1-2.8-2.8-1.1.6-2.9L2 12l1.8-2.4-.6-2.9 2.8-1.1 1.1-2.8 2.9.6L12 2z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <p>{{  item.title  }}</p>
        </div> 
       </section>


      <!-- TEAM SECTION -->
       <section class="team-section">
        <h2>Meet the team</h2>

        <div class="team-photo">
          <img
            src="/team-photo.png"
            alt="YENAZ team group photo"
          >
        </div>

        <div class="team-row">
          <div
            v-for="(member, index) in teamMembers"
            v-bind:key="index"
            class="team-item"
          >
            <span class="team-focus">{{ member.focus }}</span>
            <h3>{{ member.title }}</h3>
            <p>{{ member.description }}</p>
          </div>
        </div>
       </section>


      <!-- FAQ SECTION -->
       <section class="faq-section">
        <h2>FAQs</h2>

        <div class="faq-list">
          <div
            v-for="(faq, index) in faqs"
            v-bind:key="index"
            class="faq-item"
          >

            <h3>{{  faq.question  }}</h3>
            <p>{{  faq.answer  }}</p>
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

const bannerList = [
  { title: 'Satisfaction Guaranteed' },
  { title: 'Local Experts' },
  { title: 'Easy Bookings' },
  { title: 'Safe and Secure' }
]
const bannerItems = ref(bannerList)


const teamList = [
  {
    title: 'Nonhlanhla Kunene',
    focus: 'Operations and service quality',
    description: 'Vets and onboards professionals, and keeps every booking running smoothly.'
  },
  {
    title: 'Co-founder',
    focus: 'Product and technology',
    description: 'Shapes the platform experience and keeps the booking journey simple.'
  },
  {
    title: 'Ishma-iel Gray',
    focus: 'Partnerships and growth',
    description: 'Builds relationships with local professionals and grows awareness in the community.'
  },
  {
    title: 'Co-founder',
    focus: 'Customer support and trust',
    description: 'Looks after customers and professionals alike, resolving issues and gathering feedback.'
  }
]

const teamMembers = ref(teamList)


const faqList = [
  {
    question: 'How do I find a professional?',
    answer: 'You can search for professionals by category, location, or service type using our search feature. You can also browse through our list of verified professionals and read reviews from other users.'
  },
  {
    question: 'How do I book a service?',
    answer: 'Once you have found a professional you would like to hire, you can book their services directly through our platform. Simply select the service, choose a date and time, and provide any necessary details.'
  },
  {
    question: 'What if I have an issue with a professional?',
    answer: 'If you encounter any issues with a professional, please contact our support team immediately. We will work with you to resolve the issue and ensure that you are satisfied with the outcome.'
  }
]

const faqs = ref(faqList)
</script>


<style scoped>
/* Base Page Styling */
.page-container {
  background-color: var(--color-primary);
  color: var(--color-page);
  min-height: 100vh;
  font-family: var(--font-main);
}

/* Divider Styling */
.divider-line {
  width: 100%;
  height: 2px;
  background-color: var(--color-page);
}

/* Hero Section Styling */
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
  margin: 0 0 var(--spacing-xs) 0;
}
.about-hero h2 {
  font-size: var(--font-md);
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
}
.hero-description {
  max-width: 500px;
  font-size: var(--font-sm);
  line-height: 1.5;
  opacity: 0.9;
  margin: 0;
}
/* Mission Section Styling */
.mission-section {
  text-align: center;
  padding: 0 var(--page-padding) var(--spacing-lg);
  max-width: var(--page-max-width);
  margin: 0 auto;
}
.mission-section h2 {
  font-size: var(--font-md);
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
}
.mission-text {
  max-width: 500px;
  font-size: var(--font-sm);
  line-height: 1.5;
  opacity: 0.9;
  margin: 0 auto;
}
/* Banner Section Styling */
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
/* Team Section Styling */
.team-photo {
  width: 100%;
  max-width: 900px;
  margin: 0 auto var(--spacing-lg);
}
.team-photo img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
}
.team-section {
  text-align: center;
  padding: 0 var(--page-padding) var(--spacing-lg);
  max-width: var(--page-max-width);
  margin: 0 auto;
}
.team-section h2 {
  font-size: var(--font-xl);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
}
.team-row {
  display: flex;
  border-top: 1px solid var(--color-page);
  border-bottom: 1px solid var(--color-page);
}
.team-item {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-xs);
  /* border-left: 1px solid var(--color-page); */
}
.team-item:first-child {
  border-left: none;
}
.team-focus {
  display: block;
  font-size: var(--font-xs);
  font-weight: 600;
  opacity: 0.75;
  margin-bottom: var(--spacing-xs);
}
.team-item h3 {
  font-size: var(--font-size-sm);
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
}
.team-item p {
  font-size: var(--font-xs);
  line-height: 1.5;
  opacity: 0.85;
  margin: 0;
}

@media (max-width: 768px) {
  .team-row {
    flex-direction: column;
    border-left: none;
    border-right: none;
  }
  .team-item {
    border-left: none;
    border-top: 1px solid var(--color-page);
  }
  .team-item:first-child {
    border-top: none;
  }
}
/* FAQ Section Styling */
.faq-section {
  text-align: center;
  padding: 0 var(--page-padding) var(--spacing-lg);
  max-width: var(--page-max-width);
  margin: 0 auto;
}
.faq-section h2 {
  font-size: var(--font-xl);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
}
.faq-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
.faq-item h3 {
  font-size: var(--font-size-sm);
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
}
.faq-item p {
  font-size: var(--font-xs);
  line-height: 1.5;
  opacity: 0.85;
  max-width: 500px;
  margin: 0 auto;
}
</style>