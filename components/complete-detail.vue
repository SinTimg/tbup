<template>
	<div v-show="show">
		<el-tooltip class="item" effect="dark" content="返回" placement="top-start">
			<el-button size="medium" @click="toggle()" icon="el-icon-back" circle style="border:0px solid #fff"></el-button>
		</el-tooltip>
		<el-card v-if="task">
			<el-col :span="4">
				<img :src="getMinImagePath(orderItem.image)" class="image">
			</el-col>
			<el-col :span="20">
				<el-row>
					<el-col :span="6">
						<div class="card-item">关键词</div>
						<el-tag class="card-value">{{keyword.keyword}}</el-tag>
					</el-col>
					<el-col :span="4">
						<div class="card-item">订单总数</div>
						<el-tag class="card-value" type="danger">{{task.total_num}}</el-tag>
					</el-col>
					<el-col :span="4">
						<div class="card-item">完成数量</div>
						<el-tag class="card-value" type="success">{{task.complete_number}}</el-tag>
					</el-col>
					<el-col :span="4">
						<div class="card-item">需购数量</div>
						<el-tag class="card-value" type="warning">{{keyword.number}}</el-tag>
					</el-col>
					<el-col :span="3">
						<div class="card-item">本金</div>
						<el-tag class="card-value" type="warning">{{orderItem.principal}}</el-tag>
					</el-col>
					<el-col :span="3">
						<div class="card-item">佣金</div>
						<el-tag class="card-value" type="warning">{{orderItem.commission}}</el-tag>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<div class="card-item">规格</div><div class="card-value">{{orderItem.sku}}</div>
					</el-col>
					<el-col :span="1"></el-col>
					<el-col :span="6">
						<div class="card-item">备注</div><div class="card-value">{{orderItem.remarks}}</div>
					</el-col>
					<el-col :span="4">
						<div class="card-item">下单时间</div><div class="card-value">{{keyword.time}}</div>
					</el-col>
					<el-col :span="1">
						<el-tooltip class="item" effect="dark" content="添加完成信息" placement="top-start">
							<el-button size="medium" type="primary" @click="add()" icon="el-icon-circle-plus" circle></el-button>
						</el-tooltip>
					</el-col>
				</el-row>
			</el-col>
		</el-card>
		<el-table
				:data="completeList"
				style="width: 100%">
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
		<name-add ref="nameAdd"/>
	</div>
</template>
<style>
	.image {
		width: 100px;
		height: 100px;
		border-radius: 5px;
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
    import nameAdd from '~/components/name-add.vue'
    export default {
        components:{
            nameAdd
        },
        computed: mapState({
            completeList: state => {
                return state.task.task&&state.task.task.completes? state.task.task.completes: []
            },
		  	keyword: state=> {
              return state.task.task&&state.task.task.keyword? state.task.task.keyword: {}
            },
            orderItem: state=> {
                return state.task.task&&state.task.task.keyword&&state.task.task.keyword.order_item? state.task.task.keyword.order_item: {}
            },
            task: state=> {
                return state.task.task? state.task.task: {}
            }
        }),
        props: {
          value: Boolean
        },
        data() {
            return {
                show: this.value
            }
        },
        methods: {
        	toggle() {
                this.show = !this.show
                this.$emit('input', this.show)
            },
            add() {
				this.$refs.nameAdd.open(true)
			},
            edit(index) {
				this.$refs.nameAdd.open(false,index)
            },
            remove(index,id) {
              this.$confirm('此操作将删除该会员, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$store.dispatch('task/deleteComplete',{index:index, id:id}).then((e)=>{
                  this.$message({
                    showClose: true,
                    message: '删除成功',
                    type: 'success'
                  });
                }).catch(e => {
                  console.log(e.message)
                  this.$message.error(e.message)
                })
			  })

			}
        }
    }
</script>