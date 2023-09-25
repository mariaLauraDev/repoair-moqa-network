<template>
  <div class="card">
    <div class="card-title__container">
      <p class="card-title"> {{ title }} </p>
    </div>
    <p class="card-value"> {{ value }}</p>
    <p class="card-description"> {{ description }}</p>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        required: true
      },
      value: {
        type: [String, Number],
        required: true
      },
      description: {
        type: [String, Number],
        required: true
      }
    }
  }
</script>

<style lang="scss" scoped>
.card {
  padding: 1.5rem;
  border-width: 1px;
  border-radius: 0.5rem;
}

.card-title__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-weight: 600;
  font-size: .875rem;
  line-height: 1.25rem;
}

.value {
  font-weight: 700;
  font-size: 1.25rem;
  margin-top: 5rem;
}

.card-description {
  color: #64748b;
  font-size: .75rem;
  line-height: 1rem;
}
</style>