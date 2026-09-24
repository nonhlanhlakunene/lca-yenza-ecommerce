<template>
    <div class="n-reviewOverlay" @click.self="$emit('close')">
        <div class="n-reviewCard">

            <div class="n-header">
                <h2>Rate your experience with {{ personName }} ({{ personType }})</h2>
            </div>

            <div class="form-group">
                <label>{{ personType === 'Worker' ? 'How was your service?' : 'How was this customer?' }}</label>

                <div class="stars">
                    <span v-for="star in 5" :key="star" class="star"
                        :class="{ active: star <= (hoveredRating || selectedRating) }"
                        @mouseenter="hoveredRating = star"
                        @mouseleave="hoveredRating = 0"
                        @click="selectedRating = star"
                    >☆</span>
                </div>
            </div>

            <div class="comments">
                <label for="comment">Leave a comment (Optional)</label>
                <textarea
                    id="comment"
                    name="comment"
                    rows="4"
                    v-model="comment"
                ></textarea>
            </div>

            <div class="booking-info">
                <p><span class="label">Booking:</span> #{{ bookingId }}</p>
                <p><span class="label">Date:</span> {{ date }}</p>
            </div>

            <div class="n-buttons">
                <button class="skip-button" type="button" @click="$emit('close')">Cancel</button>
                <button
                    class="submit-button"
                    type="button"
                    @click="submitReview"
                    :disabled="selectedRating === 0 || isSubmitting"
                >
                    {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { createReview } from '../api/reviews'
import Swal from 'sweetalert2'

export default {
    props: {
        personName: { type: String, required: true },
        personType: { type: String, required: true },
        reviewedUserId: { type: Number, required: true },
        bookingId: { type: [String, Number], required: true },
        date: { type: String, required: true },
    },
    emits: ['close'],
    data() {
        return {
            hoveredRating: 0,
            selectedRating: 0,
            comment: '',
            isSubmitting: false
        }
    },
    methods: {
        async submitReview() {
            this.isSubmitting = true

            try {
                await createReview({
                    reviewerId: 1,
                    reviewedUserId: this.reviewedUserId,
                    bookingId: this.bookingId,
                    rating: this.selectedRating,
                    comment: this.comment
                })

                Swal.fire({
                    icon: 'success',
                    title: 'Review Submitted',
                    text: 'Thank you for your feedback!',
                    confirmButtonColor: '#136163'
                })

                this.$emit('close')
            } catch (err) {
                console.error('Review submission failed:', err)

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err.response?.data?.message || 'Something went wrong. Please try again.',
                    confirmButtonColor: '#136163'
                })
            } finally {
                this.isSubmitting = false
            }
        }
    }
}
</script>

<style scoped>
.n-reviewOverlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.n-reviewCard {
    background: var(--color-primary);
    color: white;
    padding: 32px;
    border-radius: 12px;
    max-width: 420px;
    width: 100%;
    font-family: var(--font-main);
}

.n-header {
  margin-bottom: 28px;
}

.n-header h2 {
    font-size: var(--font-lg);
    text-align: center;
}

.form-group,
.comments {
    text-align:center;
}

.stars {
    justify-content: center;
}

.form-group,
.comments,
.booking-info {
    margin-bottom: 20px;
}

.form-group label,
.comments label {
    display: block;
    font-size: var(--font-sm);
    margin-bottom: 8px;
}

textarea {
  width: 100%;
  padding: 13px;
  border: none;
  border-radius: 8px;
  font-family: inherit;
  font-size: var(--font-sm);
  background: white;
  color: #333;
  box-sizing: border-box;

}

textarea:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

.booking-info {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: var(--font-sm);
}

.stars {
  display: flex;
  gap: 8px;
}

.star {
  font-size: 30px;
  color: rgba(255, 255, 255, 0.35);
  cursor: pointer;
  transition: 0.2s;
}

.star:hover {
  transform: scale(1.15);
}

.star.active {
  color: #F2B705;
}

.n-buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 8px;
}

.skip-button,
.submit-button {
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    flex: 1;
    color: #333;
    font-family: inherit;
}

.skip-button {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.skip-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.submit-button {
  background: white;
  color: var(--color-primary);
}

.submit-button:hover {
  background: #f0f0f0;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>