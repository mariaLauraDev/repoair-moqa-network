<template>
  <div
    style="display: flex; flex-direction: column;"
  >
  <router-link
    v-for="(link, index) in links"
    :key="index"
    :to="link.path"
    class="sidebar__item"
  >
    <i
      class="material-symbols-outlined"
      style="vertical-align: middle; display: inline-block;font-size: 1.30rem"
    >
      {{ link.icon }}
    </i>
    <p class="truncate"> {{ link.title }}</p>
  </router-link>
  </div>
</template>

<script>
  export default {
    props: {
      links: {
        type: Array,
        required: true
      }
    },
  }
</script>

<style lang="scss" scoped>
.sidebar__item  {
  font-size: 15px;
  text-align: left;
  padding-left: 1rem;
  padding-right: 1rem;
  padding: 0.75rem;
  gap: 1rem;
  align-items: center;
  display: inline-flex;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>