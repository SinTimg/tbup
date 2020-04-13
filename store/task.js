import axios from 'axios'

export const state = () => ({
    listCount: 1,
    listPage: 1,
    taskCount: 1,
    taskPage: 1,
    historyCount: 1,
    historyPage: 1,
    list: [],
    taskList: [],
    history: [],
    curTaskIndex: 0,
    task: {}
})

export const mutations = {
    setList(state, data){
        state.listCount = data.data.count
        state.list = data.data.rows
        state.listPage = data.page
    },
    updateList(state, data){
        state.list[data.pindex].order_items[data.cindex].keywords.splice(data.index,1,data.data)
    },
    addTask(state, data) {
        if (!data.remaining_number) {
            state.list[data.pindex].order_items[data.cindex].keywords.splice(data.index,1)
        } else {
            state.list[data.pindex].order_items[data.cindex].keywords[data.index].inventory.remaining_number = data.remaining_number
        }
    },
    getTaskList(state, data) {
        state.taskList = data.data.rows
        state.taskCount = data.data.count
        state.taskPage = data.page
        state.task = state.taskList[0]
    },
    updateTaskList(state, data) {
        state.taskList.splice(data.index,1,data.data)
    },
    getHistory (state, data) {
        state.history = data.data.rows
        state.historyCount = data.data.count
        state.historyPage = data.page
    },
    setTask (state, index) {
        state.task = state.taskList[index]
        state.curTaskIndex = index
    },
    addComplete(state, data) {
        for (let key in data) {
            state.task.completes.push(data[key])
            state.task.complete_number++
        }
        state.taskList[state.curTaskIndex] = state.task
    },
    updateComplete(state, data) {
        for (let key in data.data) {
            state.task.completes[data.index][key] = data.data[key]
        }
        state.taskList[state.curTaskIndex] = state.task
    },
    deleteComplete(state, index) {
        state.task.completes.splice(index,1)
        state.taskList[state.curTaskIndex] = state.task
    }
}

export const actions = {
    refresh ({commit, state}, page) {
        return axios.get(`/order/listAll/${page}`).then(res => {
            if (res.data.code) {
                return Promise.reject(new Error(res.data.message))
            } else {
                console.log(res.data)
                commit("setList",{data:res.data.data,page:page})
            }
        })
    },
    getOrders ({commit, state}, page) {
        return axios.get(`/order/listAll/${page}`).then(res => {
            if (res.data.code) {
                return Promise.reject(new Error(res.data.message))
            } else {
                commit("setData",{data:res.data.data,page:page})
            }
        })
    },
    getInventory ({commit, state}, data) {
        return axios.get(`/task/getInventory/${data.id}`).then(res => {
            if (res.data.code) {
                return Promise.reject(new Error(res.data.message))
            } else {
                if (data.isUpdateList) {
                    data.data = res.data.data
                    commit("updateList",data)
                }
                return res.data
            }
        })
    },
    addTask ({commit, state}, data) {
        return axios.put(`/task/add/`,data.form).then(res => {
            //更新数据list数据
            commit("addTask",{pindex:data.pindex,cindex: data.cindex,index:data.index,remaining_number:res.data.inventory.remaining_number})
            if (res.data.code) {
                return Promise.reject(new Error(res.data.message))
            }
        })
    },
    getTaskList ({commit, state}, data) {
        return axios.get(`${data.baseUrl}/task/list/${data.userId}/${data.page}`).then(res => {
            if (res.data.code) {
                return Promise.reject(new Error(res.data.message))
            } else {
                //更新数据taskList数据
                commit("getTaskList",{data:res.data.data,page:data.page})
            }
        })
    },
    updateTaskList ({commit, state}, data) {
        return axios.put(`/task/update/${data.id}`,data.form).then(res => {
            if (res.data.code) {
                return Promise.reject(new Error(res.data.message))
            } else {
                //更新数据taskList数据
                commit("updateTaskList",{index:data.index,data:data.form})
            }
        })
    },
    addComplete ({commit, state}, data) {
        return axios.post(`/task/complete/${data.id}`,data.form).then(res => {
            if (res.data.code) {
                return Promise.reject(new Error(res.data.message))
            } else {
                //更新数据taskList数据
                commit("addComplete", res.data.data)
            }
        })
    },
    updateComplete ({commit, state}, data) {
        return axios.put(`/task/complete/${data.id}`,data.form).then(res => {
            if (res.data.code) {
                return Promise.reject(new Error(res.data.message))
            } else {
                //更新数据taskList数据
                commit("updateComplete",{index: data.index, data: data.form})
            }
        })
    },
    deleteComplete ({commit, state}, data) {
        return axios.delete(`/task/complete/${data.id}`).then(res => {
            if (res.data.code) {
                console.log("aaaaa:")
                return Promise.reject(new Error(res.data.message))
            } else {
                console.log("completes:")
                //更新数据taskList数据
                commit("deleteComplete",data.index)
            }
        })
    },
    getHistory ({commit, state}, data) {
        return axios.get(`/task/history/${data.userId}/${data.page}`).then(res => {
            if (res.data.code) {
                return Promise.reject(new Error(res.data.message))
            } else {
                //更新数据history数据
                commit("getHistory",{data:res.data.data,page:data.page})
            }
        })
    }
}