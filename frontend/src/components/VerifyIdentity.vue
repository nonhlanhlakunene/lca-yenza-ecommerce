<template>
    <div v-if="showVerification" class="verification-overlay">
        <div class="n-verifyForm">

            <button class="close-btn" type="button" @click="$emit('close')">×</button>

            <div class="n-bars">
                <div
                    v-for="n in totalSteps"
                    :key="n"
                    class="progress-segment"
                    :class="{ active: step >= n }"
                ></div>
            </div>
            <p class="step-count">{{ step }}/{{ totalSteps }}</p>

            <p v-if="globalError" class="error-banner">{{ globalError }}</p>

            <!-- STEP 1: Phone (both) -->
            <div v-if="step === 1">
                <div class="n-headings">
                    <h3>VERIFY YOUR PHONE</h3>
                    <p>Enter your mobile number to receive the code.</p>
                </div>

                <form class="verification-card" @submit.prevent="sendOtp">
                    <label for="number">Phone Number</label>
                    <div class="phone-row">
                        <select v-model="countryCode">
                            <option value="+27">+27</option>
                        </select>
                        <input
                            id="number"
                            type="tel"
                            v-model="phoneNumber"
                            placeholder="82 000 0000"
                            required
                        />
                    </div>
                    <button class="send-otp" type="submit">Send OTP</button>
                </form>
            </div>

            <!-- STEP 2: OTP (both) -->
            <div v-if="step === 2">
                <div class="n-headings">
                    <h3>ENTER VERIFICATION CODE</h3>
                    <p>We sent a code to {{ countryCode }} {{ phoneNumber }}</p>
                </div>

                <form class="verification-card" @submit.prevent="verifyOtp">
                    <div class="otp-inputs">
                        <input
                            v-for="(digit, index) in otpDigits"
                            :key="index"
                            type="text"
                            maxlength="1"
                            v-model="otpDigits[index]"
                            @input="handleOtpInput(index, $event)"
                            @keydown.backspace="handleOtpBackspace(index, $event)"
                            ref="otpInputs"
                        />
                    </div>
                    <p v-if="otpError" class="error-message">Incorrect code, try again.</p>
                    <button class="send-otp" type="submit" :disabled="!isOtpComplete">Verify OTP</button>
                    <p class="resend" @click="resendCooldown === 0 ? sendOtp() : null" :class="{ disabled: resendCooldown > 0 }">
                        {{ resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code' }}
                    </p>
                </form>
            </div>

            <!-- STEP 3: ID upload (worker only) -->
            <div v-if="step === 3 && userType === 'worker'">
                <div class="n-headings">
                    <h3>VERIFY YOUR IDENTITY</h3>
                    <p>Upload a certified document of your South African ID.</p>
                </div>

                <form class="verification-card" @submit.prevent="submitId">
                    <div class="upload-group">
                        <label for="idUpload">ID Document</label>
                        <input
                            id="idUpload"
                            type="file"
                            accept="image/*"
                            capture="environment"
                            @change="handleFileUpload($event, 'idFile', 'idFileName')"
                            required
                        />
                        <p v-if="idFileName" class="file-selected">Selected: {{ idFileName }}</p>
                        <p class="upload-info">Accepted formats: JPG, PNG</p>
                    </div>

                    <button class="send-otp" type="submit" :disabled="!idFile">Continue</button>
                    <div class="row-actions">
                        <button type="button" class="link-button" @click="goBack">← Back</button>
                        <button type="button" class="link-button" @click="skipStep">Skip for now</button>
                    </div>
                </form>
            </div>

            <!-- STEP 4: Address (worker only) -->
            <div v-if="step === 4 && userType === 'worker'">
                <div class="n-headings">
                    <h3>VERIFY YOUR ADDRESS</h3>
                    <p>Upload a certified document of your proof of address.</p>
                </div>

                <form class="verification-card" @submit.prevent="submitAddress">
                    <div class="upload-group">
                        <label for="addressUpload">Proof of Address</label>
                        <input
                            id="addressUpload"
                            type="file"
                            accept="image/*"
                            @change="handleFileUpload($event, 'addressFile', 'addressFileName')"
                            required
                        />
                        <p v-if="addressFileName" class="file-selected">Selected: {{ addressFileName }}</p>
                        <p class="upload-info">Accepted formats: JPG, PNG</p>
                    </div>

                    <button class="send-otp" type="submit" :disabled="!addressFile">Continue</button>
                    <div class="row-actions">
                        <button type="button" class="link-button" @click="goBack">← Back</button>
                        <button type="button" class="link-button" @click="skipStep">Skip for now</button>
                    </div>
                </form>
            </div>

            <!-- STEP 5: Background check (worker only) -->
            <div v-if="step === 5 && userType === 'worker'">
                <div class="n-headings">
                    <h3>BACKGROUND CHECK</h3>
                    <p>Submit the documents required for your background verification.</p>
                </div>

                <form class="verification-card" @submit.prevent="submitBackground">
                    <div class="upload-section">
                        <label for="policeClearance">Police Clearance</label>
                        <p>Upload your police clearance certificate.</p>
                        <input
                            id="policeClearance"
                            type="file"
                            accept="image/*"
                            @change="handleFileUpload($event, 'policeClearanceFile', 'policeClearanceFileName')"
                        />
                        <p v-if="policeClearanceFileName" class="file-selected">Selected: {{ policeClearanceFileName }}</p>
                    </div>

                    <div class="upload-section">
                        <label for="affidavit">Affidavit</label>
                        <p>Upload your completed affidavit.</p>
                        <input
                            id="affidavit"
                            type="file"
                            accept="image/*"
                            @change="handleFileUpload($event, 'affidavitFile', 'affidavitFileName')"
                        />
                        <p v-if="affidavitFileName" class="file-selected">Selected: {{ affidavitFileName }}</p>
                    </div>

                    <button class="send-otp" type="submit" :disabled="!policeClearanceFile || !affidavitFile">Continue</button>
                    <div class="row-actions">
                        <button type="button" class="link-button" @click="goBack">← Back</button>
                        <button type="button" class="link-button" @click="skipStep">Skip for now</button>
                    </div>
                </form>
            </div>

            <!-- STEP 6: Experience (worker only) -->
            <div v-if="step === 6 && userType === 'worker'">
                <div class="n-headings">
                    <h3>SKILLS &amp; EXPERIENCE</h3>
                    <p>Tell us about your experience and the services you provide.</p>
                </div>

                <form class="verification-card" @submit.prevent="submitExperience">
                    <label for="service">What service do you provide?</label>
                    <select id="service" v-model="service" required>
                        <option value="">Select a service</option>
                        <option value="plumber">Plumber</option>
                        <option value="carpenter">Carpenter</option>
                        <option value="nanny">Nanny</option>
                        <option value="cleaner">Painter</option>
                        <option value="gardener">Gardener</option>
                        <option value="other">Other</option>
                    </select>

                    <label for="experience">Years of Experience</label>
                    <input id="experience" type="number" min="0" v-model.number="yearsExperience" placeholder="e.g. 3" required />


                    <label for="experienceNotes">Tell us more about your experience</label>
                    <textarea id="experienceNotes" rows="4" v-model="experienceNotes" placeholder="Describe your experience and the type of work you have done..."></textarea>

                    <button class="send-otp" type="submit">Submit Information</button>
                    <div class="row-actions">
                        <button type="button" class="link-button" @click="goBack">← Back</button>
                    </div>
                </form>
            </div>

            <!-- FINAL STEP: Complete -->
            <div v-if="step === totalSteps" class="complete-state">
                <div class="success-icon">✓</div>
                <h3 v-if="userType === 'worker'">YOU'RE ALL SET</h3>
                <h3 v-else>PHONE VERIFIED</h3>

                <p v-if="userType === 'worker'">Your verification information has been submitted successfully.</p>
                <p v-else>You're ready to start booking.</p>

                <div class="verification-summary" v-if="userType === 'worker'">
                    <div class="summary-item"><span>✓</span><p>Phone verified</p></div>
                    <div class="summary-item" v-if="idFile"><span>✓</span><p>ID submitted</p></div>
                    <div class="summary-item" v-if="addressFile"><span>✓</span><p>Address submitted</p></div>
                    <div class="summary-item" v-if="policeClearanceFile && affidavitFile"><span>✓</span><p>Background check submitted</p></div>
                    <div class="summary-item" v-if="service"><span>✓</span><p>Skills &amp; experience submitted</p></div>
                </div>

                <button class="send-otp" type="button" @click="finishVerification">Continue</button>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: "PhoneVerification",
    props: {
        showVerification: {
            type: Boolean,
            default: false
        },
        userType: {
            type: String,
            required: true // 'worker' or 'customer'
        }
    },
    data() {
        return {
            step: 1,
            globalError: '',

            // Phone / OTP
            countryCode: '+27',
            phoneNumber: '',
            generatedOtp: '',
            otpDigits: ['', '', '', '', '', ''],
            otpError: false,
            resendCooldown: 0,
            resendTimer: null,

            // Step 3: ID
            idFile: null,
            idFileName: '',

            // Step 4: Address
            addressFile: null,
            addressFileName: '',

            // Step 5: Background
            policeClearanceFile: null,
            policeClearanceFileName: '',
            affidavitFile: null,
            affidavitFileName: '',

            // Step 6: Experience
            service: '',
            yearsExperience: null,
            experienceNotes: ''
        }
    },
    computed: {
        // Workers go through all 7 steps. Customers only need phone + OTP + done.
        totalSteps() {
            return this.userType === 'worker' ? 7 : 3
        },
        isOtpComplete() {
            return this.otpDigits.every(d => d !== '')
        }
    },
    methods: {
        sendOtp() {
            // BACKEND: replace with POST /api/verify/send-otp { phone }
            this.generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()
            console.log('Simulated OTP sent:', this.generatedOtp)

            this.otpError = false
            this.otpDigits = ['', '', '', '', '', '']
            this.step = 2
            this.startResendCountdown()
        },
        startResendCountdown() {
            this.resendCooldown = 30
            clearInterval(this.resendTimer)
            this.resendTimer = setInterval(() => {
                this.resendCooldown--
                if (this.resendCooldown <= 0) clearInterval(this.resendTimer)
            }, 1000)
        },
        handleOtpInput(index, event) {
            const value = event.target.value
            if (value && index < 5) {
                this.$refs.otpInputs[index + 1].focus()
            }
            this.otpError = false
        },
        handleOtpBackspace(index, event) {
            if (!this.otpDigits[index] && index > 0) {
                this.$refs.otpInputs[index - 1].focus()
            }
        },
        verifyOtp() {
            // BACKEND: replace with POST /api/verify/check-otp { phone, code }
            const enteredCode = this.otpDigits.join('')
            if (enteredCode === this.generatedOtp) {
                this.otpError = false
                this.step = this.userType === 'worker' ? 3 : this.totalSteps
            } else {
                this.otpError = true
            }
        },

        // Generic file handler used by every upload step
        handleFileUpload(event, fileKey, fileNameKey) {
            const file = event.target.files[0]
            if (file) {
                this[fileKey] = file
                this[fileNameKey] = file.name
            }
        },

        submitId() {
            // BACKEND: POST /api/verify/submit-id (multipart/form-data)
            console.log('ID submitted:', this.idFile)
            this.step = 4
        },
        submitAddress() {
            // BACKEND: POST /api/verify/submit-address (multipart/form-data)
            console.log('Address submitted:', this.addressFile)
            this.step = 5
        },
        submitBackground() {
            // BACKEND: POST /api/verify/submit-background (multipart/form-data, 2 files)
            console.log('Background docs submitted:', this.policeClearanceFile, this.affidavitFile)
            this.step = 6
        },
        submitExperience() {
            if (!this.service) {
                this.globalError = 'Please select a service.'
                return
            }
            this.globalError = ''
            // BACKEND: POST /api/verify/submit-experience { service, yearsExperience, experienceChecks, experienceNotes }
            console.log('Experience submitted:', {
                service: this.service,
                yearsExperience: this.yearsExperience,
                experienceNotes: this.experienceNotes
            })
            this.step = this.totalSteps
        },

        goBack() {
            if (this.step > 1) this.step--
        },
        skipStep() {
            if (this.step < this.totalSteps - 1) this.step++
        },
        finishVerification() {
            this.$emit('complete')
        }
    },
    beforeUnmount() {
        clearInterval(this.resendTimer)
    }
}
</script>



<style scoped>
.verification-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.n-verifyForm {
    background: white;
    padding: 60px;
    border-radius: 5px;
    max-width: 500px;
    width: 480px;
    font-family: var(--font-main);
    position: relative;
    max-height: 130vh;
    height: 95vh;
    overflow-y: auto;
}

.close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #999;
}

.n-bars {
    display: flex;
    gap: 6px;
    margin-bottom: 4px;
}

.progress-segment {
    flex: 1;
    height: 4px;
    background: #e5e7eb;
    border-radius: 2px;
}

.progress-segment.active {
    background: var(--color-primary);
}

.step-count {
    text-align: right;
    font-size: var(--font-xs);
    color: #999;
    margin-bottom: 20px;
}

.error-banner {
    background: #fef2f2;
    color: #b91c1c;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: var(--font-sm);
    margin-bottom: 16px;
}

.n-headings h3 {
    font-size: var(--font-lg);
    color: var(--color-text);
    margin-bottom: 4px;
}

.n-headings p {
    font-size: var(--font-sm);
    color: #666;
    margin-bottom: 20px;
}

.verification-card {
    margin-top: 40px;
}

.verification-card label {
    font-size: var(--font-sm);
    font-weight: 600;
    display: block;
    margin-bottom: 15px;
}

.verification-card select,
.verification-card input[type="number"],
.verification-card textarea {
    width: 100%;
    padding: 10px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-family: inherit;
    font-size: var(--font-sm);
    margin-bottom: 16px;
    box-sizing: border-box;
}

.verification-card textarea {
    resize: vertical;
    min-height: 90px;
}

.phone-row {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
}

.phone-row select {
    flex: 0 0 70px;
    margin-bottom: 0;
}

.phone-row input {
    flex: 1;
    padding: 10px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-family: inherit;
    font-size: var(--font-sm);
}

input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: var(--color-primary);
}

.otp-inputs {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-bottom: 16px;
}

.otp-inputs input {
    width: 44px;
    height: 52px;
    text-align: center;
    font-size: 1.3rem;
    font-weight: 600;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-family: inherit;
}

.upload-group input[type="file"],
.upload-section input[type="file"] {
    width: 100%;
    padding: 12px;
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    font-family: inherit;
    font-size: var(--font-sm);
    margin-bottom: 8px;
    box-sizing: border-box;
    background: #fafafa;
}

.upload-section {
    background: #f9fafb;
    border-radius: 12px;
    padding: 14px;
    margin-bottom: 16px;
}

.upload-section p {
    font-size: var(--font-xs);
    color: #666;
    margin-bottom: 8px;
}

.file-selected {
    font-size: var(--font-xs);
    color: var(--color-primary);
    margin-bottom: 10px;
}

.upload-info {
    font-size: var(--font-xs);
    color: #999;
    margin-bottom: 16px;
}

.checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
}

.checkbox-group label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 400;
    font-size: var(--font-sm);
    margin-bottom: 0;
}

.send-otp {
    width: 100%;
    background: var(--color-primary);
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-family: inherit;
    font-size: var(--font-sm);
    font-weight: 600;
    cursor: pointer;
}

.send-otp:hover {
    background: var(--color-primary-dark);
}

.send-otp:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.error-message {
    color: #ef4444;
    font-size: var(--font-xs);
    margin-bottom: 10px;
}

.resend {
    text-align: center;
    font-size: var(--font-xs);
    color: var(--color-primary);
    margin-top: 12px;
    cursor: pointer;
    text-decoration: underline;
}

.resend.disabled {
    color: #999;
    cursor: not-allowed;
    text-decoration: none;
}

.row-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
}

.link-button {
    background: none;
    border: none;
    color: var(--color-primary);
    font-size: var(--font-sm);
    cursor: pointer;
    font-family: inherit;
}

.link-button:hover {
    text-decoration: underline;
}

.complete-state {
    text-align: center;
}

.success-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--color-primary);
    color: white;
    font-size: 1.8rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
}

.complete-state h3 {
    font-size: var(--font-lg);
    margin-bottom: 8px;
}

.complete-state > p {
    font-size: var(--font-sm);
    color: #666;
    margin-bottom: 20px;
}

.verification-summary {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
    text-align: left;
}

.summary-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f0fdfa;
    border: 1px solid #ccfbf1;
    border-radius: 8px;
    padding: 10px 14px;
}

.summary-item span {
    color: var(--color-primary);
    font-weight: 700;
}

.summary-item p {
    font-size: var(--font-sm);
    margin: 0;
}

/* Tablet and below */
@media (max-width: 768px) {
    .n-verifyForm {
        padding: 32px;
    }
}

/* Mobile */
@media (max-width: 480px) {
    .n-verifyForm {
        padding: 24px;
        height: auto;
        max-height: 85vh;
    }

    .n-headings h3 {
        font-size: 1.2rem;
    }

    .otp-inputs {
        gap: 5px;
    }

    .otp-inputs input {
        width: 36px;
        height: 44px;
        font-size: 1.1rem;
    }

    .phone-row {
        flex-direction: column;
    }

    .phone-row select {
        flex: 0 0 auto;
        width: 100%;
    }

    .row-actions {
        flex-direction: row;
        gap: 8px;
    }

    .link-button {
        flex: 1;
        padding: 10px;
        text-align: center;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
    }
}
</style>