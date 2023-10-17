<template>
  <div class="marker-feed-card">
    <div class="marker-feed-card__title-container">
      <p class="marker-feed-card__title ">{{ marker?.name }}</p>
    </div>
    <p class="marker-feed-card__description">MoQA ID: {{ marker?.idDb }}</p>
    <p class="marker-feed-card__description">Latitude: {{ marker?.lat }}</p>
    <p class="marker-feed-card__description" style="margin-bottom: 1.5rem">Longitude: {{ marker?.long }}</p>
    
    <div class="marker-feed-card__title-container">
      <p class="marker-feed-card__title">Dados</p>
    </div>
    <p class="marker-feed-card__description">Último Timestamp: {{ formatDate(lastDocument?.Timestamp) }}</p>
    <p class="marker-feed-card__description">PM25: {{ lastDocument?.pm25 }} μg/m³</p>
    <p class="marker-feed-card__description">PM10: {{ lastDocument?.pm10 }} μg/m³</p>
    <p class="marker-feed-card__description">Humidity: {{ lastDocument?.hum }} %</p>
    <p class="marker-feed-card__description">Temperature: {{ lastDocument?.intTemp }} °C</p>
    <!-- Add more fields as needed -->
  </div>
</template>

<script>
export default {
  props: {
    marker: {
      type: Object,
      default: () => ({})
    },
    lastDocument: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    formatDate(timestamp) {
      const date = new Date(timestamp?.seconds * 1000);
      return timestamp?.seconds > 0 ? date.toLocaleString('en-GB', { timeZone: 'UTC' }) : ''
    }
  }
};
</script>

<style lang="scss" scoped>
.marker-feed-card {
  padding: 1.5rem;
  border-width: 1px;
  border-radius: 0.5rem;
} 

.marker-feed-card__title {
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.25rem;
  margin-bottom: 0.5rem;
}

.marker-feed-card__title-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: .5rem;
}


.marker-feed-card__description {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1rem;
  margin-bottom: 1rem;
}

</style>
