<template>
    <div class="card">
        <el-table
                :data="historyList"
                style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-card>
                            <el-row>
                                <el-col :span="4">
                                    <img :src="getMinImagePath(props.row.keyword.order_item && props.row.keyword.order_item.order? props.row.keyword.order_item.order.image: '')" class="image">
                                </el-col>
                                <el-col :span="20">
                                    <el-row>
                                        <el-col :span="6">
                                            <div>店名</div>
                                            <div class="card-item">{{props.row.keyword.order_item && props.row.keyword.order_item.order? props.row.keyword.order_item.order.shopname: ''}}</div>
                                        </el-col>
                                        <el-col :span="6">
                                            <div>任务时间</div>
                                            <div class="card-item">{{getTime(props.row.keyword.order_item && props.row.keyword.order_item.order?props.row.keyword.order_item.order.date: '')}}</div>
                                        </el-col>
                                        <el-col :span="6">
                                            <div>订单名</div>
                                            <div class="card-item">{{props.row.keyword.order_item && props.row.keyword.order_item.order?props.row.keyword.order_item.order.name:''}}</div>
                                        </el-col>
                                        <el-col :span="6">
                                            <div>备注</div>
                                            <div class="card-item">{{props.row.keyword.order_item && props.row.keyword.order_item.order?props.row.keyword.order_item.order.remarks:''}}</div>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <el-row v-for="item in props.row.completes" :key="item.id">
                                <el-col :span="6">
                                    <el-tag type="danger">淘宝会员名</el-tag>
                                </el-col>
                                <el-col :span="6">
                                    <div class="card-item">{{item.tb_name}}</div>
                                </el-col>
                                <el-col :span="6">
                                    <el-tag>收货人</el-tag>
                                </el-col>
                                <el-col :span="6">
                                    <div class="card-item">{{item.consignee}}</div>
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
                    <img :src="getMinImagePath(props.row.keyword.order_item?props.row.keyword.order_item.image:'')" class="image">
                </template>
            </el-table-column>
            <el-table-column
                    label="关键词"
                    prop="keyword.keyword">
            </el-table-column>
            <el-table-column
                    label="订单数量"
                    prop="keyword.total_num">
            </el-table-column>
            <el-table-column
                    label="完成数量"
                    prop="complete_number">
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
        </el-table>
        <span class="demonstration">显示总数</span>
        <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="10"
                layout="total, prev, pager, next"
                :total="totalRow">
        </el-pagination>
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

</style>

<script>
    import {mapState} from 'vuex'

    export default {
        middleware: 'check-member',
        head() {
            return {
                title: '任务管理'
            }
        },
        computed: mapState({
            // 当前用户的id
            userId: state => {
                return state.member.data.id
            },
            historyList: state => {
                return state.task.history
            },
            page: state => {
                return state.task.historyPage
            },
            totalRow: state => {
                return state.task.historyCount
            }
        }),
        mounted() {
            this.$store.dispatch('task/getHistory', {userId: this.userId, page: 1}).then((e) => {
                console.log(this.historyList)
            })
        },
        data() {
            return {
                activeNames: [0],
                currentPage: this.page
            }
        },
        methods: {
            editTask(row, index) {
                this.$refs.taskEdit.open(row, index)
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.$store.dispatch('task/getHistory', {userId: this.userId, page: val}).then((e) => {
                    console.log(this.historyList)
                })
            },
        }
    }
</script>