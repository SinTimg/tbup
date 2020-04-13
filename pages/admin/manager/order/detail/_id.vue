<template>
    <div class="card">
        <el-tooltip class="item" effect="dark" content="返回订单列表" placement="top-start">
            <el-button size="medium" @click="back()" icon="el-icon-back" circle style="border:0px solid #fff"></el-button>
        </el-tooltip>
        <el-card>
            <el-col :span="4">
                <img :src="getMinImagePath(taskList.order_item?taskList.order_item.image:'')" class="image">
            </el-col>
            <el-col :span="20">
                <el-row>
                    <el-col :span="6">
                        <div class="card-item">关键词</div>
                        <el-tag class="card-value">{{taskList.keyword}}</el-tag>
                    </el-col>
                    <el-col :span="4">
                        <div class="card-item">订单总数</div>
                        <el-tag class="card-value" type="success">{{taskList.order_num}}</el-tag>
                    </el-col>
                    <el-col :span="4">
                        <div class="card-item">订单余量</div>
                        <el-tag class="card-value" type="danger">{{taskList.inventory?taskList.inventory.remaining_number:''}}</el-tag>
                    </el-col>
                    <el-col :span="4">
                        <div class="card-item">购买数量</div>
                        <el-tag class="card-value" type="warning">{{taskList.number}}</el-tag>
                    </el-col>
                    <el-col :span="3">
                        <div class="card-item">本金</div>
                        <el-tag class="card-value" type="warning">{{taskList.order_item?taskList.order_item.principal:''}}</el-tag>
                    </el-col>
                    <el-col :span="3">
                        <div class="card-item">佣金</div>
                        <el-tag class="card-value" type="warning">{{taskList.order_item?taskList.order_item.commission:''}}</el-tag>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <div class="card-item">规格</div><div class="card-value">{{taskList.order_item?taskList.order_item.sku:''}}</div>
                    </el-col>
                    <el-col :span="7">
                        <div class="card-item">备注</div><div class="card-value">{{taskList.order_item?taskList.order_item.remarks:''}}</div>
                    </el-col>
                    <el-col :span="4">
                        <div class="card-item">下单时间</div><div class="card-value">{{taskList.time}}</div>
                    </el-col>
                    <el-col :span="1">
                        <el-tooltip class="item" effect="dark" content="返回" placement="top-start">
                            <el-button v-show="isDetail" size="medium" @click="isDetail=false" icon="el-icon-back" circle style="border:0px solid #fff"></el-button>
                        </el-tooltip>
                    </el-col>
                </el-row>
            </el-col>
        </el-card>
        <el-table v-show="!isDetail" :data="taskList.tasks" style="width: 100%">
            <el-table-column
                    label="用户"
                    prop="user.name">
            </el-table-column>
            <el-table-column
                    label="接单总数"
                    prop="total_num">
            </el-table-column>
            <el-table-column
                    label="完成数"
                    prop="complete_number">
            </el-table-column>
            <el-table-column
                    label="创建时间"
                    prop="createdAt">
                <template slot-scope="props">
                    {{getTime(props.row.createdAt)}}
                </template>
            </el-table-column>
            <el-table-column
                    label="更新时间"
                    prop="updatedAt">
                <template slot-scope="props">
                    {{getTime(props.row.updatedAt)}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="viewDetail(scope.$index)">查看</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="editTask(scope.$index)">修改</el-button>
              </template>
            </el-table-column>
        </el-table>
        <el-table v-show="isDetail" :data="completeList" style="width: 100%">
            <el-table-column
                    label="旺旺名"
                    prop="tb_name">
            </el-table-column>
            <el-table-column
                    label="收货人"
                    prop="consignee">
            </el-table-column>
            <el-table-column
                    label="付款金额"
                    prop="payment">
            </el-table-column>
            <el-table-column
                    label="总金额"
                    prop="price">
            </el-table-column>
            <el-table-column
                    label="差价"
                    prop="price_difference">
            </el-table-column>
            <el-table-column
                    label="创建时间"
                    prop="createdAt">
                <template slot-scope="props">
                    {{getTime(props.row.createdAt)}}
                </template>
            </el-table-column>
            <el-table-column
                    label="更新时间"
                    prop="updatedAt">
                <template slot-scope="props">
                    {{getTime(props.row.updatedAt)}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="edit(scope.$index)">修改</el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            icon="el-icon-delete"
                            @click="remove(scope.$index,scope.row.id)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <task-edit ref="taskEdit"/>
        <name-add ref="nameAdd"/>
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
        box-shadow: 0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.24);
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
    import { mapState } from 'vuex'
    import taskEdit from '~/components/task-edit.vue'
    import nameAdd from '~/components/name-add.vue'
    export default {
        fetch ({route,store,env}) {
          return store.dispatch('manager/getTaskList', {baseUrl: env.baseUrl,id:route.params.id}).then(()=>{
            store.commit("manager/setPage",route.query)
          })
        },
        middleware: 'check-admin',
        head () {
            return {
                title: '任务列表'
            }
        },
        components:{
            taskEdit,
            nameAdd
        },
        computed: mapState({
            // 当前用户的id
            taskList: state => {
                return state.manager.taskList
            },
            completeList: state => {
                return state.manager.completeList
            },
            backPage: state => {
                return state.manager.backPage
            },
            isHistory: state => {
                return state.manager.isHistory
            }
        }),
        mounted () {
          // this.$store.dispatch('manager/getTaskList',this.$route.params.id).then((e)=>{
                
          // })
        },
        data() {
            return {
                isDetail: false
            }
        },
        methods: {
            viewDetail(index) {
                this.$store.commit('manager/setCompleteList',index)
                this.isDetail = true
            },
            editTask(index) {
                
            },
            edit(index) {
                this.$refs.nameAdd.open(false,index,true)
            },
            remove(index,id) {
                this.$confirm('此操作将永久删除该会员, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    this.$store.dispatch('manager/deleteComplete',{index:index, id:id}).then((e)=>{
                        this.$message({
                            showClose: true,
                            message: '删除成功',
                            type: 'success'
                        });
                    }).catch(e => {
                        this.$message.error(e.message)
                    })
                })
            },
            back() {
                if (this.isHistory) {
                    window.location.href = `/admin/manager/order/history?page=${this.backPage}`
                } else {
                    window.location.href = `/admin/manager/order/list?page=${this.backPage}`
                }
                
            }
        }
    }
</script>