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
                                        <el-col :span="1"></el-col>
                                        <el-col :span="15">
                                            <div class="card-item">规格</div>
                                            <div>{{item.sku}}</div>
                                        </el-col>
                                        <el-col :span="4">
                                            <div class="card-item">本金</div>
                                            <div>
                                                <el-tag type="danger">{{item.principal}}</el-tag>
                                            </div>
                                        </el-col>
                                        <el-col :span="4">
                                            <div class="card-item">佣金</div>
                                            <div>
                                                <el-tag type="warning">{{item.commission}}</el-tag>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="1"></el-col>
                                        <el-col :span="23">
                                            <div class="card-item">备注</div>
                                            <div>{{item.remarks}}</div>
                                        </el-col>
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
                                        prop="order_num"
                                        label="订单数"
                                        width="100">
                                </el-table-column>
                                <el-table-column
                                        prop="inventory.remaining_number"
                                        label="订单余量"
                                        width="100">
                                </el-table-column>
                                <el-table-column
                                        prop="number"
                                        label="每单购买数量"
                                        width="100">
                                </el-table-column>
                                <el-table-column label="操作" width="180">
                                    <template slot-scope="scope">
                                        <el-tooltip class="item" effect="dark" content="查看详情" placement="top-start">
                                            <el-button @click="viewDetail(scope.row.id)" type="primary" size="mini"
                                                       icon="el-icon-tickets" circle></el-button>
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
                    prop="date"
                    width="100">
                <template slot-scope="props">
                    {{getTime(props.row.date)}}
                </template>
            </el-table-column>
            <el-table-column
                    label="用户"
                    prop="userId">
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
    }

</style>

<script>
    import axios from 'axios'
    import {mapState} from 'vuex'

    export default {
        middleware: 'check-admin',
        head() {
            return {
                title: '任务列表'
            }
        },
        computed: mapState({
            orderList: state => {
                return state.manager.orderList
            },
            page: state => {
                return state.manager.orderPage
            },
            totalRow: state => {
                return state.manager.orderCount
            }
        }),
        mounted() {
            let page = 1
            if (this.$route.query.page) {
                page = this.$route.query.page
            }
            this.$store.dispatch('manager/getOrderList', page).then((e) => {
                // console.log(this.page)
            })
        },
        data() {
            return {
                activeNames: [0],
                currentPage: this.page
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.$store.dispatch('getOrderList/getOrderList', val).then((e) => {
                    
                })
            },
            viewDetail(id) {
                window.location.href = `/admin/manager/order/detail/${id}?page=${this.currentPage}`
            },
            exportExcel() {
                return axios.post(`/manager/excel`,{},{responseType: 'blob'}).then(res => {
                  if (res.data.code) {
                    return Promise.reject(new Error(res.data.message))
                  } else {
                    let blob = new Blob([res.data])
                    let downloadElement = document.createElement('a');
              　    let href = window.URL.createObjectURL(blob); //创建下载的链接
              　　  downloadElement.href = href;
                    console.log(new Date())
              　　  downloadElement.download = this.curDate()+'订单数据.xlsx'; //下载后文件名
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