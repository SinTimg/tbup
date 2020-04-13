import axios from 'axios'

export const state = () => ({
  data: [],
  orderId: 0,
  orderIndex: 0,
  page: 1,
  pageList: 1
})

export const mutations = {
  setPage(state, page) {
    state.page = page
  },
  setData(state, data) {
    state.data = data.data
    state.pageList = data.count
  },
  setOrderIndex(state, data) {
    state.orderIndex = data
  },
  addOrder(state, data) {
    state.data.push(data)
    state.orderId = data.id
  },
  editOrder(state, data) {
    for (let key in state.data[data.index]) {
      if (key !== 'order_items') {
        state.data[data.index][key] = data.form[key]
      }
    }
  },
  deleteOrder(state, data) {
    state.data.splice(data.index, 1)
  },
  addOneItem(state, data) {
    state.data[state.orderIndex].order_items.push(data)
  },
  editOrderItem(state, data) {
    for (let key in  data.form) {
      state.data[state.orderIndex].order_items[data.index][key] = data.form[key]
    }
  },
  deleteOrderItem(state, data) {
    state.data[state.orderIndex].order_items.splice(data.index, 1)
  },
  copyOrder(state, data) {
    state.data.unshift(data)
  },
  addKeyword(state, data) {
    state.data[data.pindex].order_items[data.cindex].keywords.push(data.data)
  },
  editKeyword(state, data) {
    state.data[data.pindex].order_items[data.cindex].keywords.splice(data.index,1,data.data)
  },
  deleteKeyword(state, data) {
    state.data[data.pindex].order_items[data.cindex].keywords.splice(data.index,1)
  }
}

export const actions = {
  getOrder({commit, state}, userId) {
    return axios.get(`/order/list/${userId}/${state.page}`).then(res => {
      if (res.data.code) {
        return Promise.reject(new Error(res.data.message))
      } else {
        commit("setData", res.data);
      }
    })
  },
  addOrder({commit, state}, form) {
    return axios.post('/order/add', form).then(res => {
      if (res.data.code) {
        return Promise.reject(new Error(res.data.message))
      } else {
        commit("addOrder", res.data.data);
      }
    })
  },
  editOrder({commit, state}, data) {

    return axios.put(`/order/edit/${state.data[data.index].id}`, data.form).then(res => {
      if (res.data.code) {
        return Promise.reject(new Error(res.data.message))
      } else {
        commit("editOrder", data);
      }
    })
  },
  deleteOrder({commit, state}, data) {
    return axios.delete(`/order/delete/${data.id}`).then(res => {
      if (res.data.code) {
        return Promise.reject(new Error(res.data.message))
      } else {
        commit("deleteOrder", data);
      }
    })
  },
  addOrderItem({commit, state}, form) {
    return axios.post('/order/items', form).then(res => {
      if (res.data.code) {
        return Promise.reject(new Error(res.data.message))
      } else {
        // state.data[state.orderIndex].order_items.push(res.data.data)
      }
    })
  },
  addOneItem({commit, state}, form) {
    return axios.post('/order/item', form).then(res => {
      if (res.data.code) {
        return Promise.reject(new Error(res.data.message))
      } else {
        commit("addOneItem", res.data.data);
      }
    })
  },
  editOrderItem({commit, state}, data) {
    return axios.put(`/order/item/${data.id}`, data.form).then(res => {
      if (res.data.code) {
        return Promise.reject(new Error(res.data.message))
      } else {
        commit("editOrderItem", data);
      }
    })
  },
  deleteOrderItem({commit, state}, data) {
    return axios.delete(`/order/item/${data.id}`).then(res => {
      if (res.data.code) {
        return Promise.reject(new Error(res.data.message))
      } else {
        commit("deleteOrderItem", data);
      }
    })
  },
  copyOrder({commit, state}, id) {
    return axios.post(`/order/copy/${id}`).then(res => {
      if (res.data.code) {
        return Promise.reject(new Error(res.data.message))
      } else {
        commit("copyOrder", res.data.data);
      }
    })
  },
  addKeyword({commit, state}, data) {
    return axios.post('/order/keyword', data.form).then(res => {
      if (res.data.code) {
        return Promise.reject(new Error(res.data.message))
      } else {
        data.data = res.data.data
        commit("addKeyword", data);
      }
    })
  },
  editKeyword({commit, state}, data) {
    return axios.put(`/order/keyword/${data.id}`, data.form).then(res => {
      if (res.data.code) {
        return Promise.reject(new Error(res.data.message))
      } else {
        data.data = data.form
        commit("editKeyword", data);
      }
    })
  },
  deleteKeyword({commit, state}, data) {
    return axios.delete(`/order/keyword/${data.id}`).then(res => {
      if (res.data.code) {
        return Promise.reject(new Error(res.data.message))
      } else {
        console.log(res.data)
        commit("deleteKeyword", data);
      }
    })
  },
}