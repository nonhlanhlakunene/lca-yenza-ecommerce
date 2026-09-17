<template>
    <div class="contact-page">

        <div class="contact-card">
            <div class="contact-content">
                <div class="form-column">
                    <h1>Contact Us</h1>
                    <h3>We would love to hear from you.</h3>

                    <form class="contact-form" @submit.prevent="sendMessage">
                        <div class="form-group">
                            <label for="n-name">Name:</label>
                            <input
                                type="text"
                                id="n-name"
                                name="name"
                                placeholder="Enter your name"
                                v-model="form.name"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="n-email">Email:</label>
                            <input
                                type="email"
                                id="n-email"
                                name="email"
                                placeholder="Enter your email"
                                v-model="form.email"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="n-message">Message:</label>
                            <textarea
                                id="n-message"
                                name="message"
                                rows="4"
                                placeholder="How can we help you?"
                                v-model="form.message"
                                required
                            ></textarea>
                        </div>

                        <!-- Honeypot: hidden from humans, bots fill it in -->
                        <input
                            type="checkbox"
                            name="botcheck"
                            v-model="form.botcheck"
                            style="display:none"
                            tabindex="-1"
                            autocomplete="off"
                        />

                        

                        <button class="send-button" type="submit" :disabled="isSubmitting">
                            {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                        </button>
                    </form>
                </div>

                <div class="contact-info">
                    <div class="contact-image">
                        <img
                            :src="contactImage"
                            alt="Image of woman with headphone and laptop"
                            width="100%"
                        />
                    </div>
                </div>
            </div><br><br><br><br><br>
            <div class="contact-icons">
                <div class="icon-item">
                    <Phone />
                    <div class="icon-text">
                        <span class="icon-value">+27 00 000 000</span>
                        <span class="icon-label">Call us</span>
                    </div>
                </div>

                <div class="icon-item">
                    <Mail />
                    <div class="icon-text">
                        <span class="icon-value">yenzasupport@gmail.com</span>
                        <span class="icon-label">Email us</span>
                    </div>
                </div>

                <div class="icon-item">
                    <Clock />
                    <div class="icon-text">
                        <span class="icon-value">Mon-Fri, 8:30am-4:30pm</span>
                        <span class="icon-label">Our working hours</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import contactImgFile from "../assets/woman-on-a-call-using-headphones-with-laptop.png";
import { Phone, Mail, Clock } from "lucide-vue-next";
import axios from "axios";
import Swal from "sweetalert2";

const WEB3FORMS_ACCESS_KEY = "8cc4e22e-e848-4804-a0c5-14f378192a69";

export default {
    components: { Phone, Mail, Clock },

    data() {
        return {
            contactImage: contactImgFile,
            isSubmitting: false,
            form: {
                name: '',
                email: '',
                message: '',
                botcheck: false,
            },
        };
    },

    methods: {
        async sendMessage() {
            this.isSubmitting = true;

            try {
                const response = await axios.post(
                    'https://api.web3forms.com/submit',
                    {
                        access_key: WEB3FORMS_ACCESS_KEY,
                        name: this.form.name,
                        email: this.form.email,
                        message: this.form.message,
                        botcheck: this.form.botcheck,
                        subject: 'New message from Yenza contact form',
                        from_name: 'Yenza Website',
                    }
                );

                if (response.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Message Sent!',
                        text: 'Thank you, the team will get back to you soon.',
                        confirmButtonColor: '#136163',
                    });

                    this.form = { name: '', email: '', message: '', botcheck: false };
                }
            } catch (err) {
                console.error('Web3Forms submission failed:', err);

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err.response?.data?.message || 'Something went wrong. Please try again.',
                    confirmButtonColor: '#136163',
                });
            } finally {
                this.isSubmitting = false;
            }
        },
    },
};
</script>

<!-- <style>
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap");

:root {
    --color-page: #ffffff;
    --color-primary: #136163;
    --color-primary-dark: #134748;
    --color-text: #000000;
    --color-text-muted: #c7c7c7;
    --color-border: #d9d9d9;
    --font-main: "Plus Jakarta Sans", sans-serif;
    --font-xs: 0.7rem;
    --font-sm: 0.85rem;
    --font-md: 1rem;
    --font-lg: 1.5rem;
    --font-xl: 2rem;
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 2rem;
    --spacing-lg: 4rem;
    --spacing-xl: 6rem;
    --page-max-width: 1200px;
    --page-padding: 2rem;
}
</style> -->

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.contact-page {
    min-height: 100vh;
    font-family: var(--font-main);
    /* display: flex; */
    /* justify-content: center; */
    align-items: center;
    padding: 40px 20px;
}

.contact-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: var(--color-page);
}

.form-column {
    padding: 10px 80px;
    background: var(--color-page);
}

.form-column h1 {
    color: var(--color-primary);
    font-size: var(--font-xl);
    margin-bottom: var(--spacing-xs);
    font-weight: bolder;
    font-size: 50px;
}

.form-column h3 {
    color: #666;
    font-size: var(--font-md);
    font-weight: 200;
    margin-bottom: var(--spacing-md);
}

.contact-form label {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 6px;
    font-size: var(--font-sm);
}

.form-group {
    margin-bottom: 18px;
}

.contact-form input,
.contact-form textarea {
    width: 100%;
    padding: 14px 16px;
    background: #f5f5f5;
    border: 2px solid var(--color-border);
    border-radius: 10px;
    font-family: inherit;
    font-size: var(--font-sm);
    transition: all 0.3s ease;
}

.contact-form input:focus,
.contact-form textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    background: white;
}

.contact-form textarea {
    resize: vertical;
    min-height: 100px;
}

.send-button {
    background: var(--color-primary);
    color: white;
    border: none;
    padding: 14px 50px;
    border-radius: 10px;
    cursor: pointer;
    font-size: var(--font-md);
    font-weight: 600;
    transition: all 0.3s ease;
    width: 100%;
}

.send-button:hover {
    background: var(--color-primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(26, 95, 95, 0.3);
}

.contact-info {
    background: var(--color-page);
    display: flex;
    align-items: center;
    justify-content: center;
}

.contact-image {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.contact-image img {
    width: 100%;
    max-width: 600px;
    /* height: 700px; */
    height: auto;
    object-fit: contain;
    display: block;
    border-radius: 0;
}

.contact-icons svg {
    color: var(--color-primary);
    width: 20px;
    height: 30px;
    margin-right: 10px;
    vertical-align: middle;
}



.contact-icons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 50px 80px 30px;
    border-top: 1px solid #f0f0f0;
    background: #fafafa;
}

.contact-icons p {
    background: transparent;
    border-radius: 0;
    color: #333;
    font-size: var(--font-sm);
    padding: 0px 20px;
    border-right: 1px solid #d5e4e4;
    transition: all 0.3s ease;
}

.contact-icons p:last-child {
    border-right: none;
}

.contact-icons :hover {
    transform: translateY(-2px);
    color: var(--color-primary);
}

.icon-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 18px 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.icon-text {
    display: flex;
    flex-direction: column;
}

.icon-value {
    font-size: 0.95rem;
    font-weight: 600;
    /* color: #1a1a1a; */
    line-height: 1.3;
}

.icon-label {
    font-size: 0.8rem;
    color: #999;
    line-height: 1.3;
}

#confirm-message {
    max-width: var(--page-max-width);
    width: 100%;
    margin: 20px auto 0;
    background: #2ecc71;
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    text-align: center;
    font-weight: 500;
}

/* ========== MEDIA QUERIES ========== */

/* Tablet - 850px and below */
@media (max-width: 850px) {
    .contact-content {
        grid-template-columns: 1fr;
    }
    
    .form-column {
        padding: 30px 40px;
    }
    
    .form-column h1 {
        font-size: 38px;
    }
    
    .form-column h3 {
        font-size: 1rem;
    }
    
    /* HIDE IMAGE ON TABLET AND MOBILE */
    .contact-info {
        display: none;
    }
    
    /* Icons stay in 3 columns on tablet */
    .contact-icons {
        grid-template-columns: repeat(3, 1fr);
        padding: 20px 30px;
        gap: 15px;
    }
    
    .icon-item {
        padding: 14px 16px;
    }
    
    .contact-icons svg {
        width: 18px;
        height: 24px;
        margin-right: 8px;
    }
    
    .icon-value {
        font-size: 0.85rem;
    }
    
    .icon-label {
        font-size: 0.7rem;
    }
    
    .send-button {
        padding: 14px 40px;
        font-size: 0.95rem;
    }
}

/* Mobile - 600px and below */
@media (max-width: 600px) {
    .contact-page {
        padding: 8px;
    }
    
    .contact-card {
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
    }
    
    .form-column {
        padding: 18px 16px 25px;
    }
    
    .form-column h1 {
        font-size: 24px;
        margin-bottom: 4px;
    }
    
    .form-column h3 {
        font-size: 0.85rem;
        margin-bottom: 18px;
        font-weight: 300;
    }
    
    .form-group {
        margin-bottom: 14px;
    }
    
    .contact-form label {
        font-size: 0.8rem;
        margin-bottom: 4px;
    }
    
    .contact-form input,
    .contact-form textarea {
        padding: 10px 14px;
        font-size: 0.85rem;
        border-radius: 8px;
    }
    
    .contact-form textarea {
        min-height: 80px;
    }
    
    .send-button {
        padding: 12px 20px;
        font-size: 0.9rem;
        border-radius: 8px;
    }
    
    /* Stack icons vertically on mobile */
    .contact-icons {
        grid-template-columns: 1fr;
        padding: 12px 16px;
        gap: 8px;
    }
    
    .icon-item {
        padding: 10px 14px;
        border-radius: 8px;
        gap: 12px;
    }
    
    .contact-icons svg {
        width: 18px;
        height: 24px;
        margin-right: 0;
        flex-shrink: 0;
    }
    
    .icon-value {
        font-size: 0.85rem;
        font-weight: 600;
    }
    
    .icon-label {
        font-size: 0.7rem;
    }
    
    #confirm-message {
        margin: 12px 8px 0;
        padding: 10px 14px;
        font-size: 0.85rem;
        border-radius: 8px;
    }
}

/* Small Mobile - 400px and below */
@media (max-width: 400px) {
    .contact-page {
        padding: 5px;
    }
    
    .form-column {
        padding: 14px 12px 20px;
    }
    
    .form-column h1 {
        font-size: 20px;
    }
    
    .form-column h3 {
        font-size: 0.75rem;
        margin-bottom: 14px;
    }
    
    .contact-form input,
    .contact-form textarea {
        padding: 8px 12px;
        font-size: 0.8rem;
    }
    
    .send-button {
        padding: 10px 16px;
        font-size: 0.85rem;
    }
    
    .contact-icons {
        padding: 10px 12px;
        gap: 6px;
    }
    
    .icon-item {
        padding: 8px 12px;
        gap: 10px;
    }
    
    .contact-icons svg {
        width: 16px;
        height: 20px;
    }
    
    .icon-value {
        font-size: 0.8rem;
    }
    
    .icon-label {
        font-size: 0.65rem;
    }
    
    #confirm-message {
        margin: 10px 5px 0;
        padding: 8px 12px;
        font-size: 0.8rem;
    }
}
</style>
