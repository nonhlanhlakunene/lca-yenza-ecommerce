<template>
    <div class="n-reportCard">
        
        <div class="n-header">
            <h2>Report an issue with {{ personName }} ({{ personType }})</h2>
        </div>
        
        <div class="form-group">
            <label for="reasons">Reasons for reporting:</label>
            <select name="reasons" id="reasons" v-model="selectedReason">
                <option value="">Select a reason</option>
                <option value="behavior">Inappropriate behavior / Harassment</option>
                <option value="no-show">No-show</option>
                <option value="communication">Poor Communication</option>
                <option value="safety">Safety Concern</option>
                <option value="scam">Scam or fraud attempt</option>
                <option value="unprofessional">Unprofessional</option>
                <option value="Other">Other</option>
            </select>
            
        </div>
        
        <div class="description-text">
            <label for="message">Please describe what happened: </label>
            <textarea
            id="message"
            name="message"
            rows="4" 
            placeholder="Add details about the incident...?"
            v-model="description"
            ></textarea>
        </div>

        <div class="booking-info">
            <p><span class="label">Booking:</span> #{{ bookingId }}</p>
            <p><span class="label">Date:</span> {{ date }}</p>
        </div>

        <div class="warning">
            <p>False reports may result in action against your account!!</p>
        </div>

        <div class="n-buttons">
          <button class="cancel-button" type="button" @click="$emit('close')">Cancel</button>  
          <button
            class="submit-button"
            type="button"
            @click="submitReport"
            :disabled="!selectedReason || !description.trim()"
          >Submit</button>
        </div>
    </div>
</template>


<script>
export default {
    name: "ReportCard",
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
            selectedReason: '',
            description: ''
        }
    },
    methods: {
        submitReport() {
            const report = {
                personName: this.personName,
                personType: this.personType,
                bookingId: this.bookingId,
                reason: this.selectedReason,
                description: this.description
            }
            console.log('Report submitted:', report)
            this.$emit('close')
        }
    }
};
</script>

<style scoped>

* {
  margin: 0;
  padding: 0;
}

.n-reportCard {
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
.description-text,
.booking-info {
    margin-bottom: 20px;
}

.form-group label,
.description-text label {
    display: block;
    font-size: var(--font-sm);
    margin-bottom: 8px;
}



select,
textarea {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-family: inherit;
  font-size: var(--font-sm);
  background: white;
  color: #333;
  box-sizing: border-box;
}

select:focus,
textarea:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='2' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  cursor: pointer;
}


.booking-info {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-size: var(--font-sm)
}

.warning p {
    font-size: var(--font-xs);
    margin-bottom: 20px;
}

.n-buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.cancel-button,
.submit-button {
    background: #e8e8e8;
    color: #333;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    flex: 1;
}

.cancel-button {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.cancel-button:hover {
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