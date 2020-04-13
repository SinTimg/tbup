import axios from 'axios'

export const state = () => ({
  orderList: [],
  orderPage: 1,
  orderCount: 1,
  taskList: {},
  accountList: [],
  completeList: [],
  curTaskIndex: 0,
  memberList: [],
  shopList: [],
  historyList: [],
  historyPage: 1,
  historyCount: 1,
  backPage: 1,
  isHistory: false
})

export const mutations = {
  setOrderList(state, data) {
  	state.orderList = data.orderList
  	state.orderCount = data.orderCount
  	state.orderPage = data.orderPage
  },
  setPage(state, data) {
    state.backPage = data.page
    state.isHistory = data.isHistory
  },
  setTaskList(state, data) {
    state.taskList = data
  },
  setCompleteList(state, index) {
    if (state.taskList.tasks && state.taskList.tasks[index]) {
      state.completeList = state.taskList.tasks[index].completes
    } else {
      state.completeList = []
    }
    state.curTaskIndex = index
  },
  updateComplete(state, data) {
    for (let key in data.data) {
        state.completeList[data.index][key] = data.data[key]
    }
    state.taskList.tasks[state.curTaskIndex].completes = state.completeList
  },
  deleteComplete(state, index) {
    state.completeList.splice(index,1)
    state.taskList.tasks[state.curTaskIndex].completes = state.completeList
    state.taskList.tasks[state.curTaskIndex].complete_number--
  },
  setAccount(state, data) {
    state.memberList = data.member
    state.shopList = data.shop
  },
  updateShopList(state, data) {
    for(let key in data.data) {
      state.shopList[data.index][key] = data.data[key] 
    }
  },
  updateMemberList(state, data) {
    for(let key in data.data) {
      state.memberList[data.index][key] = data.data[key] 
    }
  },
  addAccount(state, data) {
    if (data.role) {
      state.memberList.push(data)
    } else {
      state.shopList.push(data)
    }
  },
  deleteAccount(state, data) {
    if (data.isShop) {
      state.shopList.splice(data.index,1)
    } else {
      state.memberList.splice(data.index,1)
    }
  },
  setHistoryList(state, data) {
    state.historyList = data.historyList
    state.historyCount = data.historyCount
    state.historyPage = data.historyPage
  },
}

export const actions = {
  getOrderList ({ commit, state }, page) {
  	return axios.get(`/manager/listAll/${page}`).then(res => {
  	  if (res.data.code) {
  	    return Promise.reject(new Error(res.data.message))
  	  } else {
  	  	let data = {
  	  		orderList: res.data.data.rows,
  	  		orderCount: res.data.data.count,
  	  		orderPage: page
  	  	}
  	    commit("setOrderList",data);
  	  }
  	})
  },
  getTaskList ({ commit, state }, data) {
    return axios.get(`${data.baseUrl}/manager/listTaskList/${data.id}`).then(res => {
      if (res.data.code) {
        return Promise.reject(new Error(res.data.message))
      } else {
        commit("setTaskList",res.data.data);
      }
    })
  },
  updateComplete ({commit, state}, data) {
      return axios.put(`/task/complete/${data.id}`,data.form).then(res => {
          if (res.data.code) {
              return Promise.reject(new Error(res.data.message))
          } else {
              //更新数据completeList数据
              commit("updateComplete",{index: data.index, data: data.form})
          }
      })
  },
  deleteComplete ({commit, state}, data) {
      return axios.delete(`/task/complete/${data.id}`).then(res => {
          if (res.data.code) {
              return Promise.reject(new Error(res.data.message))
          } else {
              //更新数据completeList数据
              commit("deleteComplete",data.index)
          }
      })
  },
  getAccount ({commit, state}) {
      return axios.get(`/manager/listUser`).then(res => {
          if (res.data.code) {
              return Promise.reject(new Error(res.data.message))
          } else {
              //更新数据account数据
              commit("setAccount",res.data)
          }
      })
  },
  updateAccount ({commit, state},data) {
    return axios.put(`/manager/user/${data.form.id}`,data.form).then(res => {
        if (res.data.code) {
            return Promise.reject(new Error(res.data.message))
        } else {
            //更新数据account数据
            if (data.isShop) {
              commit("updateShopList",{index:data.index,data:data.form})
            } else {
              commit("updateMemberList",{index:data.index,data:data.form})
            }
        }
    })
  },
  addAccount ({commit, state},data) {
    return axios.post(`/manager/user`,data).then(res => {
        if (res.data.code) {
            return Promise.reject(new Error(res.data.message))
        } else {
            //更新数据account数据
            commit("addAccount",res.data.data)
        }
    })
  },
  deleteAccount ({commit, state},data) {
    let id = 0;
    if (data.isShop) {
      id = state.shopList[data.index].id
    } else {
      id = state.memberList[data.index].id
    }
    return axios.delete(`/manager/user/${id}`).then(res => {
        if (res.data.code) {
            return Promise.reject(new Error(res.data.message))
        } else {
            //更新数据account数据
            commit("deleteAccount",data)
        }
    })
  },
  getHistoryList ({ commit, state }, page) {
    return axios.get(`/manager/history/${page}`).then(res => {
      if (res.data.code) {
        return Promise.reject(new Error(res.data.message))
      } else {
        let data = {
          historyList: res.data.data.rows,
          historyCount: res.data.data.count,
          historyPage: page
        }
        commit("setHistoryList",data);
      }
    })
  }
}