<template>
	<el-dialog :title="isAdd?'添加信息':'修改信息'" :visible.sync="show">
		<el-form :model="form" :rules="rules" :label-position="'top'" ref="form">
			<div style="border: 1px solid #dcdfe6;padding: 10px;">
				<el-row v-for="(items,index) in form.row" :key="items.id">
					<el-col :span="8">
						<el-form-item label="会员名" :prop="'row.' + index + '.tb_name'" :rules="{ required: true, message: '请输入会员名', trigger: 'blur' }">
							<el-input placeholder="请输入内容" v-model="items.tb_name"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="收货人" :prop="'row.' + index + '.consignee'" :rules="{ required: true, message: '请输入收货人', trigger: 'blur' }">
							<el-input placeholder="请输入内容" v-model="items.consignee"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="付款金额" :prop="'row.' + index + '.payment'" :rules="{type: 'number', required: true, message: '请输入付款金额', trigger: 'blur' }">
							<el-input placeholder="请输入金额" v-model.number="items.payment"><template slot="append">元</template></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="2">
						<el-button v-if="isAdd" size="mini" type="danger" icon="el-icon-delete" @click.prevent="removeDomain(items)" circle></el-button>
					</el-col>
				</el-row>
			</div>
			<el-form-item>
				<el-button v-if="isAdd" type="primary" @click="addDomain()">添加会员</el-button>
				<el-button type="primary" @click="submitForm()">提交</el-button>
				<el-button v-if="isAdd" @click="show = false">取 消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>
<script>
    export default {
        data() {
            return {
                show: false,
                isAdd: false,
                isAdmin: false,
                index: 0,
                totalNum: 0,
                index: 0,
                form: {
                    taskId: 0,
                    row: []
                },
                rules: {
                    tb_name: [
                        { required: true, message: '请输入会员名', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            submitForm() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        if (this.isAdmin) {
                            if (this.isAdd) {
                                // this.$store.dispatch('task/addComplete',{id:this.form.taskId,form:this.form.row}).then(() => {
                                //     this.show = false
                                // }).catch(e => {
                                //     this.$message.error(e.message)
                                //     this.show = false
                                // })
                            } else {
                              	this.form.row[0].price_difference = this.form.row[0].price - this.form.row[0].payment
                                this.$store.dispatch('manager/updateComplete',{index: this.index,id:this.form.row[0].id,form:this.form.row[0]}).then(() => {
                                    this.show = false
                                }).catch(e => {
                                    this.$message.error(e.message)
                                    this.show = false
                                })
                            }
                        } else {
                            if (this.isAdd) {
                                this.$store.dispatch('task/addComplete',{id:this.form.taskId,form:this.form.row}).then(() => {
                                    this.show = false
                                }).catch(e => {
                                    this.$message.error(e.message)
                                    this.show = false
                                })
                            } else {
                              	this.form.row[0].price_difference = this.form.row[0].price - this.form.row[0].payment
                                this.$store.dispatch('task/updateComplete',{index: this.index,id:this.form.row[0].id,form:this.form.row[0]}).then(() => {
                                    this.show = false
                                }).catch(e => {
                                    this.$message.error(e.message)
                                    this.show = false
                                })
                            }
                        }
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            open (isAdd, index, isAdmin) {
                this.form.row = [{
                    tb_name: "",
                    order_number: "",
                    consignee: "",
                  	payment: 0
                }]
                
                if (isAdmin) {
                  if (isAdd) {
                      // this.form.taskId = this.$store.state.manager.task.id
                      // this.totalNum = this.$store.state.manager.task.total_num-this.$store.state.manager.task.complete_number
                  } else {
                      this.form.row[0] = Object.assign({
                          id: "",
                          tb_name: "",
                          order_number: "",
                          consignee: "",
						  price: 0,
						  payment: 0
                      }, this.$store.state.manager.completeList[index])
                      this.index = index
                  }
                } else {
                  if (isAdd) {
                      this.form.taskId = this.$store.state.task.task.id
                      this.totalNum = this.$store.state.task.task.total_num-this.$store.state.task.task.complete_number
                  } else {
                      this.form.row[0] = Object.assign({
                          id: "",
                          tb_name: "",
                          order_number: "",
                          consignee: "",
						  price: 0,
						  payment: 0
                      }, this.$store.state.task.task.completes[index])
                      this.index = index
                  }
                }
                this.isAdmin = isAdmin
                this.isAdd = isAdd
                this.show = true
            },
            removeDomain(item) {
                let index = this.form.row.indexOf(item)
                if (index !== -1) {
                    this.form.row.splice(index, 1)
                }
            },
            addDomain() {
                if (this.form.row.length+1 > this.totalNum) {
                    this.$message('不可以添加超过当前接受的任务数量')
                } else {
                    this.form.row.push({
                        tb_name: "",
                        order_number: "",
                        consignee: "",
					    payment: 0
                    });
                }
            }
        }
    }
</script>
<style>
	.order-row {
		list-style: none;
	}
	.order-row-item {
		overflow: hidden;
		padding: 8px 20px 8px 20px;
		margin: 1px;
		background: #646cdc;
		border-radius: 2px;
		box-shadow: 0 2px 4px rgba(90, 90, 90, .1);
		transition: box-shadow .4s;
	}
	.order-ul {
		margin-top: 5px;
	}
</style>