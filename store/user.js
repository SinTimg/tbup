import axios from 'axios'

export const state = () => ({
  data: {},
  userId: 0,
  isLogin: false,
  isReset: false
})

export const mutations = {
  setUser (state, data) {
    state.data = data
    state.userId = data.id
    state.isLogin = true
  },
  cleanUser (state) {
    state.data = {}
    state.userId = 0
    state.isLogin = false
  }
}

export const actions = {
  login ({ commit, state }, data) {
    return axios.post('/user/login', data).then(res => {
      if (res.data.code) {
        state.isLogin = false
        return Promise.reject(new Error(res.data.message))
      } else {
        commit("setUser",res.data.data)
      }
    })
  },
  reset ({ commit, state }, data) {
    return axios.post('/user/reset', data).then(res => {
      if (res.data.code) {
        return Promise.reject(new Error(res.data.message))
      } else {
        commit("setUser",res.data.data)
      }
    })
  },
  logout ({ commit, state }, data) {
    return axios.post('/user/logout').then(res => {
      if (res.data.code) {
        state.isLogin = true
        return Promise.reject(new Error(res.data.message))
      } else {
        commit("cleanUser")
      }
    })
  },
  checkLogin ({ commit, state }) {
    return axios.post('/user/checkLogin').then(res => {
      if (res.data.code) {
        state.isLogin = false
        return false
      } else {
        commit("setUser",res.data.data)
        return true
      }
    })
  }
}
