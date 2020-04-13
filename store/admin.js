import axios from 'axios'

export const state = () => ({
  data: {},
  userId: 0,
  isLogin: false,
  isReset: false
})

export const mutations = {
  setAdmin (state, data) {
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
    console.log(data)
    return axios.post('/admin/login', data).then(res => {
      if (res.data.code) {
        state.isLogin = false
        return Promise.reject(new Error(res.data.message))
      } else {
        commit("setAdmin",res.data.data)
      }
    })
  },
  reset ({ commit, state }, data) {
    return axios.post('/admin/reset', data).then(res => {
      if (res.data.code) {
        return Promise.reject(new Error(res.data.message))
      } else {
        commit("setAdmin",res.data.data)
      }
    })
  },
  logout ({ commit, state }, data) {
    return axios.post('/admin/logout').then(res => {
      if (res.data.code) {
        state.isLogin = true
        return Promise.reject(new Error(res.data.message))
      } else {
        commit("cleanUser")
      }
    })
  },
  checkLogin ({ commit, state }) {
    return axios.post('/admin/checkLogin').then(res => {
      if (res.data.code) {
        state.isLogin = false
        return false
      } else {
        commit("setAdmin",res.data.data)
        return true
      }
    })
  }
}
