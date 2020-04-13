<template>
  <div>
  	<el-collapse v-model="activeNames">
  	  <el-collapse-item v-for="(order, pindex) in orderList" :key="order.id" :title="order.name+'   '+getTime(order.date)" :name="pindex">
  	    <el-form :label-position="'top'">
  	    	<el-row>
  	    		<el-col :span="6">
  	    			<el-form-item label="示例图">
  	    				<img :src="getMinImagePath(order.image)" class="image">
  	    			</el-form-item>
  	    		</el-col>
  	    		<el-col :span="5">
  	    			<el-form-item label="订单ID">
  	    				{{order.id}}
  	    			</el-form-item>
  	    			<el-form-item label="店铺名">
  	    				{{order.shopname}}
  	    			</el-form-item>
  	    		</el-col>
  	    		<el-col :span="5">
					<el-form-item label="订单名">
						{{order.name}}
					</el-form-item>
  	    			<el-form-item label="订单备注">
  	    				{{order.remarks}}
  	    			</el-form-item>
  	    		</el-col>
				<el-col :span="4">
					<el-form-item label="是否特殊订单">
						{{order.special?"是":"否"}}
					</el-form-item>
					<el-form-item label="任务时间">
						{{getTime(order.date)}}
					</el-form-item>
				</el-col>
  	    		<el-col :span="4">
					<el-form-item>
						<el-button size="small" @click="copyOrder(order.id)" style="margin-top: 24px;" type="warning" plain>复制</el-button>
						<el-button size="small" @click="addOrderItem(pindex)" style="margin-top: 24px;" plain>添加新订单项</el-button>
					</el-form-item>
  	    			<el-form-item>
  	    				<el-button size="small" @click="editOrder(pindex)" style="margin-top: 24px;" type="primary" plain>修改</el-button>
						<el-button size="small" @click="deleteOrder(pindex,order.id)" style="margin-top: 24px;" type="danger" plain>删除</el-button>
  	    			</el-form-item>
  	    		</el-col>
  	    	</el-row>
  	    	<div v-for="(orderItem, index) in order.order_items" style="border: 1px solid #dcdfe6;padding: 10px;">
  	    		<el-row>
                  <el-col :span="16">
                    <el-row>
                      <el-col :span="16">
                          <el-form-item label="规格">
                              {{orderItem.sku}}
                          </el-form-item>
                      </el-col>
                      <el-col :span="4">
                          <el-form-item label="本金">
                              {{orderItem.principal}}
                          </el-form-item>
                      </el-col>
                      <el-col :span="4">
                          <el-form-item label="佣金">
                              {{orderItem.commission}}
                          </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="18">
                        <el-form-item label="备注">
                          {{orderItem.remarks}}
                        </el-form-item>
                      </el-col>
					  <el-col :span="2">
						  <el-tooltip class="item" effect="dark" content="添加关键词" placement="top-start">
							  <el-button style="margin-top: 24px;" size="small" @click="addKeyword(pindex,index)" icon="el-icon-news" type="primary" circle></el-button>
						  </el-tooltip>
					  </el-col>
                      <el-col :span="2">
						  <el-tooltip class="item" effect="dark" content="编辑订单项" placement="top-start">
							  <el-button style="margin-top: 24px;" size="small" @click="editOrderItem(pindex,index)" icon="el-icon-edit" type="primary" circle></el-button>
						  </el-tooltip>
                      </el-col>
                      <el-col :span="2">
						  <el-tooltip class="item" effect="dark" content="删除订单项" placement="top-start">
							  <el-button style="margin-top: 24px;" size="small" @click="deleteOrderItem(pindex,index,orderItem.id)" icon="el-icon-delete" type="danger" circle></el-button>
						  </el-tooltip>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="示例图">
                      <img :src="getMinImagePath(orderItem.image)" class="image">
                    </el-form-item>
                  </el-col>
  	    		</el-row>
				<el-table
						:data="orderItem.keywords"
						border
						style="width: 100%">
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
							label="订单数">
					</el-table-column>
					<el-table-column
							prop="number"
							label="每单购买数量">
					</el-table-column>
					<el-table-column label="操作" width="180">
						<template slot-scope="scope">
							<el-button
									size="mini"
									@click="keywordEdit(pindex, index, scope.$index)">编辑</el-button>
							<el-button
									size="mini"
									type="danger"
									@click="keywordDelete(pindex, index, scope.$index, scope.row.id)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
  	    	</div>

  	    </el-form>
  	  </el-collapse-item>
  	</el-collapse>
    <span class="demonstration">显示总数</span>
    <el-pagination
		  @current-change="handleCurrentChange"
		  :current-page.sync="currentPage"
		  :page-size="10"
		  layout="total, prev, pager, next"
		  :total="totalRow">
    </el-pagination>
  	<order-edit ref="orderEdit"/>
    <item-edit ref="itemEdit"/>
    <keyword-edit v-model="updateOrderList" ref="keywordEdit"/>
  </div>
  
</template>
<style>
  .image {
  	width: 150px;
  	height: 150px;
  	border-radius: 5px;
  }
</style>
<script>
  import orderEdit from '~/components/order-edit.vue'
  import itemEdit from '~/components/item-edit.vue'
  import keywordEdit from '~/components/keyword-edit.vue'
  import { mapState } from 'vuex'
  
  export default {
    middleware: 'check-auth',
    head () {
      return {
        title: '订单列表',
        meta: [
          {hid: 'keyword', name: 'keyword', content: '商家端'},
          {hid: 'description', name: 'description', content: '内部订单管理平台'}
        ]
      }
    },
  	components: {
  	  orderEdit,
      itemEdit,
      keywordEdit
  	},
  	computed: mapState({
      // 当前用户的id
      userId: state => {
        return state.user.data.id
      },
      orderList: state => {
      	return state.order.data
      },
      page: state => {
        return state.order.page
      },
      totalRow: state => {
        return state.order.pageList
      }
    }),
    mounted () {
      this.$store.dispatch('order/getOrder', this.userId).then((e)=>{

      })

    },
    // fetch ({store,param}) {
    //   // console.log("aaa:",store)
    //   return store.dispatch('order/getOrder',1).then(()=>{

    //   })
    // },
    data() {
      return {
        activeNames: [0],
        currentPage: this.page,
		updateOrderList: []
      };
    },
    methods: {
      editOrder(index) {
        this.$refs.orderEdit.open(true,index)
      },
      copyOrder(id) {
        this.$confirm('此操作将复制该订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('order/copyOrder', id).then(() => {
            this.$message({
              type: 'success',
              message: '复制成功!'
            })
            this.activeNames = [0];
          }).catch(e => {
            this.$message({
              type: 'error',
              message: '复制失败!' + e
            })
          })
        })
	  },
      deleteOrder(index, id) {
        this.$confirm('此操作将永久删除该订单项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('order/deleteOrder', {index:index,id: id}).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(e => {
            this.$message({
              type: 'error',
              message: '删除失败!' + e
            })
          })
        })
      },
      editOrderItem(pindex,index) {
        this.$store.commit('order/setOrderIndex', pindex)
        this.$refs.itemEdit.open(true,pindex,index)
      },
      addOrderItem(pindex) {
        this.$store.commit('order/setOrderIndex', pindex)
        this.$refs.itemEdit.open(false,pindex)
      },
      deleteOrderItem(pindex,index,id) {
        this.$store.commit('order/setOrderIndex', pindex)
        this.$confirm('此操作将永久删除该订单项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('order/deleteOrderItem', {index:index,id:id}).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(e => {
            this.$message({
              type: 'error',
              message: '删除失败!' + e
            })
          })
        })
      },
      handleCurrentChange(val) {
        this.$store.commit("order/setPage", val)
        this.$store.dispatch('order/getOrder', this.userId)
      },
      addKeyword(pindex,cindex) {
        this.$refs.keywordEdit.open(false,pindex,cindex)
	  },
      keywordEdit(pindex, cindex, index) {
		this.$refs.keywordEdit.open(true,pindex,cindex,index)
	  },
      keywordDelete(pindex, cindex, index, id) {
        this.$confirm('此操作将永久删除该订单项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('order/deleteKeyword', {pindex: pindex,cindex: cindex, index:index, id:id}).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(e => {
            this.$message({
              type: 'error',
              message: '删除失败!' + e
            })
          })
        })
	  }
    }
  }
</script>