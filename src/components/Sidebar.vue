<template>
  <aside class="sidebar">
    <div
      class="sidebar__content"
    >
      <SidebarItem :links="menu"/>

      <div class="sidebar__footer">
        <div
          style="display: flex; flex-direction: column;"
        >
        <button
          class="sidebar__item"
          @click.prevent="handleSignOut"
        >
        <i
          class="material-symbols-outlined"
          style="vertical-align: middle; display: inline-block;font-size: 1.30rem"
        >
          logout
        </i>
        <p class="truncate"> {{ $t('components.header.logout')}} </p>
        </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import SidebarItem from './SidebarItem.vue';
import { getAuth, signOut } from 'firebase/auth'

export default {
  components: {
    SidebarItem
  },
  data() {
    return {
      auth: null
    }
  },
  mounted() {
    this.auth = getAuth()
  },
  computed: {
    menu() {
      return [
      // {
      //   title: 'Perfil',
      //   path: '/profile',
      //   icon: 'profile'
      // },
      // {
      //   title: 'Mapa',
      //   path: '/monitoring-control',
      //   icon: 'map'
      // },
      {
        title: this.$t('routes.dashboard.title'),
        path: '/dashboard',
        icon: 'space_dashboard'
      },
      {
        title: this.$t('routes.data.title'),
        path: '/data',
        icon: 'cloud_download'
      },
      {
        title: this.$t('routes.analyze.title'),
        path: '/analyze',
        icon: 'insert_chart'
      },
      ]
    }
  },
  methods: {
    async handleSignOut() {
      try {
        await signOut(this.auth)
        this.$router.push('/')
        this.$router.go(0)
        console.log('Signed out successfully.')
      } catch (error) {
        console.error('Error signing out:', error.message)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  display: none;
}

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

.sidebar__item:hover {
  background-color: rgba(178, 199, 78, 0.3);
  //transition: background-color 0.3s ease-in-out;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.router-link-active, .router-link-exact-active {
  //sets bg color #B2C79A for active link
  background-color: rgba(178, 199, 78, 0.3); ; 
  //transition: background-color 0.3s ease-in-out;
  font-weight: 600;
}

@media (min-width: 768px) {
  .sidebar {
    display: block;
    position: sticky;
    grid-column: span 3/span 3;
    padding-bottom: 1.25rem;
    padding-top: 1.25rem;
    height: calc(100vh - 65px);
    top: 65px;
  }

  .sidebar__content {
    --scrollbar-thumb-radius: 0.375rem;
    padding-bottom: 1.25rem;
    border-width: 1px;
    border-radius: 0.375rem;
    overflow-y: auto;
    gap: 1.25rem;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  .sidebar__footer {
    margin-top: auto;
  }
}

</style>