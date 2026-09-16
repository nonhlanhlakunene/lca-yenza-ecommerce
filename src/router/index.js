import { createRouter, createWebHistory } from "vue-router";

import AboutView from "../components/AboutView.vue";
import BookFormView from "../views/BookFormView.vue";
import BookingsView from "../views/BookingsView.vue";
import CheckoutView from "../views/CheckoutView.vue";
import workerlogin from "@/components/workerlogin.vue";
import Login from '@/components/login.vue';
import Signup from '@/components/signup.vue';
import Home from '@/views/home.vue';
import HandymanProfileView from '../views/HandymanProfileView.vue';
import ServicesView from '../views/ServicesView.vue';
import WorkerDashboard from '../views/WorkerDashboardView.vue';
import Admin from '@/components/AdminView.vue';

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/workerlogin",
    name: "workerlogin",
    component: workerlogin,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/profiles/:slug",
    name: "profile",
    component: HandymanProfileView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/bookings",
    name: "bookings",
    component: BookingsView,
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin
  },
  {
    path: "/book/:slug",
    name: "book",
    component: BookFormView,
  },
  {
    path: "/checkout",
    name: "checkout",
    component: CheckoutView,
  },

  {
    path: '/services',
    name: 'services',
    component: ServicesView
  },

  {
    path: '/worker',
    name: 'WorkerDashboard',
    component: WorkerDashboard
  },

  // Contact route
  {
    path: "/contact",
    name: "contact",
    component: () => import("../views/ContactView.vue"),
  },

  // Temp testing report popup route
  {
    path: "/report-test",
    name: "report-test",
    component: () => import("../components/ReportPopup.vue"),
  },

  // Temp testing review popup route
  {
    path: "/review-test",
    name: "review-test",
    component: () => import("../components/ReviewPopup.vue"),
  },

  // Temp testing verify identify route
  {
    path: "/verification",
    name: "verification",
    component: () => import("../components/VerifyIdentity.vue"),
    props: { showVerification: true, userType: "worker" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
