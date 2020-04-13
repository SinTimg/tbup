<template>
    <div class="card">
        <div v-show="!isDetail">
            <el-table :data="taskList" style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-card>
                                <el-row>
                                    <el-col :span="4">
                                        <img :src="getMinImagePath(props.row.keyword&&props.row.keyword.order_item&&props.row.keyword.order_item.order?props.row.keyword.order_item.order.image:'')"
                                             class="image">
                                    </el-col>
                                    <el-col :span="20">
                                        <el-row>
                                            <el-col :span="6">
                                                <div>店名</div>
                                                <div class="card-item">
                                                    {{props.row.keyword&&props.row.keyword.order_item&&props.row.keyword.order_item.order?props.row.keyword.order_item.order.shopname:''}}
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>任务时间</div>
                                                <div class="card-item">
                                                    {{getTime(props.row.keyword&&props.row.keyword.order_item&&props.row.keyword.order_item.order?props.row.keyword.order_item.order.date:'')}}
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>订单名</div>
                                                <div class="card-item">
                                                    {{props.row.keyword&&props.row.keyword.order_item&&props.row.keyword.order_item.order?props.row.keyword.order_item.order.name:''}}
                                                </div>
                                            </el-col>
                                            <el-col :span="6">
                                                <div>备注</div>
                                                <div class="card-item">
                                                    {{props.row.keyword&&props.row.keyword.order_item&&props.row.keyword.order_item.order?props.row.keyword.order_item.order.remarks:''}}
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </el-col>
                                </el-row>
                            </el-card>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                        label="参考图片"
                        prop="image"
                        width="180">
                    <template slot-scope="props">
                        <img :src="getMinImagePath(props.row.keyword&&props.row.keyword.order_item?props.row.keyword.order_item.image:'')" class="image">
                    </template>
                </el-table-column>
                <el-table-column
                        label="关键词"
                        prop="keyword.keyword">
                </el-table-column>
                <el-table-column
                        label="下单时间"
                        prop="keyword.time">
                </el-table-column>
                <el-table-column
                        label="订单数量"
                        prop="total_num">
                </el-table-column>
                <el-table-column
                        label="完成数量"
                        prop="complete_number">
                    <template slot-scope="props">
                        <el-button @click="viewDetail(props.$index)" type="text">{{props.row.complete_number}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        label="规格"
                        prop="keyword.order_item.sku">
                </el-table-column>
                <el-table-column
                        label="购买数量"
                        prop="keyword.number">
                </el-table-column>
                <el-table-column
                        label="本金"
                        prop="keyword.order_item.principal">
                </el-table-column>
                <el-table-column
                        label="佣金"
                        prop="keyword.order_item.commission">
                </el-table-column>
                <el-table-column
                        label="备注"
                        prop="keyword.order_item.remarks">
                </el-table-column>
                <el-table-column
                        label="任务状态"
                        prop="state">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="180">
                    <template slot-scope="props">
                        <el-button size="mini" @click="editTask(props.row,props.$index)" type="primary">修改</el-button>
                        <el-button size="mini" @click="viewDetail(props.$index)" type="success">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span class="demonstration">显示总数</span>
            <el-button @click="exportExcel()" type="warning" size="mini">导出Excel</el-button>
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="10"
                    layout="total, prev, pager, next"
                    :total="totalRow">
            </el-pagination>
        </div>
        <task-edit ref="taskEdit"/>
        <complete-detail v-model="isDetail" ref="completeDetail"/>
    </div>
</template>

<style>
    .image {
        width: 100px;
        height: 100px;
        border-radius: 5px;
    }

    .card {
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .12), 0 1px 2px rgba(0, 0, 0, .24);
    }

    .card-item {
        color: #606266;
        font-size: 14px;
        margin-bottom: 10px;
    }

    .card-value {
        margin-bottom: 10px;
    }
</style>

<script>
  import axios from 'axios'
  import {mapState} from 'vuex'
  import taskEdit from '~/components/task-edit.vue'
  import completeDetail from '~/components/complete-detail.vue'

  export default {
    middleware: 'check-member',
    head() {
      return {
        title: '任务管理'
      }
    },
    components: {
      taskEdit,
      completeDetail
    },
    computed: mapState({
      userId: state => {
        return state.member.userId
      },
      taskList: state => {
        return state.task.taskList
      },
      page: state => {
        return state.task.taskPage
      },
      totalRow: state => {
        return state.task.taskCount
      }
    }),
    fetch({route, store, env}) {
      return store.dispatch('task/getTaskList', {baseUrl: env.baseUrl, userId: store.state.member.userId, page: 1})
    },
    mounted () {
        // this.$store.dispatch('task/getTask',{userId:this.userId,page:1}).then((e)=>{
        //     console.log(this.task)
        //     console.log(this.orderItem)
        //     console.log(this.completeList)
        // })
      console.log(this.taskList)
    },
    data() {
      return {
        activeNames: [0],
        currentPage: this.page,
        isDetail: false
      }
    },
    methods: {
      viewDetail(index) {
        this.$store.commit('task/setTask', index)
        this.isDetail = !this.isDetail
        this.$refs.completeDetail.toggle()
      },
      editTask(row, index) {
        this.$refs.taskEdit.open(row, index)
      },
      handleCurrentChange(val) {
        this.$store.dispatch('task/getTaskList', {userId: this.userId, page: val}).then((e) => {
          console.log(this.taskList)
        })
      },
      exportExcel() {
        return axios.post(`/task/excel/${this.userId}`, {}, {responseType: 'blob'}).then(res => {
          if (res.data.code) {
            return Promise.reject(new Error(res.data.message))
          } else {
            console.log(res.data)
            let blob = new Blob([res.data])
            let downloadElement = document.createElement('a');
            let href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            console.log(new Date())
            downloadElement.download = this.curDate() + '订单数据.xlsx'; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
          }
        })
      }
    }
  }
</script>