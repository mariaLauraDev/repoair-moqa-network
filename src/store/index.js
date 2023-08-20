import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    clearUser(state) {
      state.user = null
    }
  },
  actions: {
    setUser({ commit }, user) {
      localStorage.setItem('user', JSON.stringify(user)) 
      commit('setUser', user)
    },
    clearUser({ commit }) {
      localStorage.removeItem('user')
      commit('clearUser')
    },
    initializeUserFromLocalStorage({ commit }) {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        commit('setUser', JSON.parse(storedUser))
      }
    }
  },
  getters: {
    getUser(state) {
      return state.user
    },
    isAuthenticated(state) {
      return !!state.user
    }
  }
})
