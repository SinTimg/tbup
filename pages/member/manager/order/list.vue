<template>
    <div class="card">
        <el-table
                :data="orderList"
                style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-card v-for="(item,index) in props.row.order_items" :key="item.id">
                            <el-row>
                                <el-col :span="4">
                                    <img :src="getMinImagePath(item.image)" class="image">
                                </el-col>
                                <el-col :span="20">
                                    <el-row>
                                        <el-col :span="12"><div>规格</div><div class="card-item">{{item.sku}}</div></el-col>
                                        <el-col :span="3"><div>本金</div><div class="card-item">{{item.principal}}</div></el-col>
                                        <el-col :span="3"><div>佣金</div><div class="card-item">{{item.commission}}</div></el-col>
                                        <el-col :span="6"><div>备注</div><div class="card-item">{{item.remarks}}</div></el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <el-table :data="item.keywords" style="width: 100%">
                                <el-table-column
                                        prop="keyword"
                                        label="关键词">
                                </el-table-column>
                                <el-table-column
                                        prop="time"
                                        label="下单时间">
                                </el-table-column>
                                <el-table-column
                                        prop="inventory.remaining_number"
                                        label="订单剩余数"
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="number"
                                        label="每单购买数量">
                                </el-table-column>
                                <el-table-column label="操作" width="180">
                                    <template slot-scope="scope">
                                        <el-tooltip class="item" effect="dark" content="添加" placement="top-start">
                                            <el-button @click="addTask(scope.row.id,props.$index,index,scope.$index)" type="primary" size="mini">添加任务</el-button>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-card>
                    </el-form>
                </template>
            </el-table-column>

            <el-table-column
                    label="参考图片"
                    prop="image"
                    width="180">
                <template slot-scope="props">
                    <img :src="getMinImagePath(props.row.image)" class="image">
                </template>
            </el-table-column>
            <el-table-column
                    label="订单名"
                    prop="name">
            </el-table-column>
            <el-table-column
                    label="店铺名"
                    prop="shopname">
            </el-table-column>
            <el-table-column
                    label="备注"
                    prop="remarks">
            </el-table-column>
            <el-table-column
                    label="任务时间"
                    prop="date">
                <template slot-scope="props">
                    {{getTime(props.row.date)}}
                </template>
            </el-table-column>

        </el-table>
        <span class="demonstration">显示总数</span>
        <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="10"
                layout="total, prev, pager, next"
                :total="totalRow">
        </el-pagination>
        <task-add ref="taskAdd"/>
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
    }

</style>

<script>
    import axios from 'axios'
    import { mapState } from 'vuex'
    import taskAdd from '~/components/task-add.vue'
    export default {
        middleware: 'check-member',
        head () {
            return {
                title: '任务列表'
            }
        },
        components:{
            taskAdd
        },
        computed: mapState({
            // 当前用户的id
            orderList: state => {
                return state.task.list
            },
            page: state => {
                return state.task.listPage
            },
            totalRow: state => {
                return state.task.listCount
            }
        }),
        // fetch ({ store, params }) {
        //    return axios.get('/order/listAll/0').then((res) => {
        //       store.list = res.data.data
        //       console.log(store)
        //       // store.commit('setData', res.data.data)
        //    })
        // },
        mounted () {
          this.$store.dispatch('task/refresh',1).then((e)=>{
                console.log(this.orderList)
          })
        },
        data() {
            return {
                activeNames: [0],
                currentPage: this.page
            }
        },
        methods: {
            addTask(id, pindex, cindex,index) {
                this.$refs.taskAdd.open(false,id,pindex,cindex,index)
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.$store.dispatch('task/refresh',val).then((e)=>{
                    console.log(this.orderList)
                })
            },
        }
    }
</script>