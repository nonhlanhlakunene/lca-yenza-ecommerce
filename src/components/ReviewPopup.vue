<template>
    <div class="n-reviewCard">
        
        <div class="n-header">
            <h2>Rate your experience with  {{ personName }} ({{ personType }})</h2>
        </div>
        
        <div class="form-group">
            <label for="rating">{{ personType === 'Worker' ? 'How was your service?' : 'How was this customer?' }}</label>
            
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
            <label for="comment">Leave a comment (Optional) </label>
            <textarea
            id="comment"
            name="comment"
            rows="4" 
            v-model="comment">
            </textarea>
        </div>

        <div class="booking-info">
            <p><span class="label">Booking:</span> #{{ bookingId }}</p>
            <p><span class="label">Date:</span> {{ date }}</p>
        </div>

        <div class="n-buttons">
          <button class="skip-button" type="button" @click="$emit('close')">Skip</button>  
          <button class="submit-button" type="button" @click="submitReview" :disabled="selectedRating === 0">Submit Review</button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        personName: {
            type: String,
            required: true
        },
        personType: {
            type: String,
            required: true
        },
        bookingId: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            hoveredRating: 0,
            selectedRating: 0,
            comment: ''
        }
    },

    methods: {
        submitReview() {
            const review = {
                personName: this.personName,
                personType: this.personType,
                bookingId: this.bookingId,
                rating: this.selectedRating,
                comment: this.comment
            }
            console.log('Review submitted:', review)
            this.$emit('close')
        }
    }
}
</script>


<style scoped>
.n-reviewCard {
    background: var(--color-primary);
    color: white;
    padding: 20px;
    border-radius: 10px;
    max-width: 350px;
    margin: 70px auto;
    font-family: var(--font-main);
}

.n-header {
  margin-bottom: 24px;
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