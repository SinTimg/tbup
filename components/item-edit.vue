<template>
	<el-dialog :title="edit?'修改订单项信息':'新增订单'" :visible.sync="show">
	  <el-form :model="form" :rules="rules" :label-position="'top'" ref="form">
	  	<div style="border: 1px solid #dcdfe6;padding: 10px;">
	  		<el-row>
  		  	  <el-form-item label="规格" prop="sku">
  		  		<el-input size="small" placeholder="请输入内容" v-model="form.sku"></el-input>
  		  	  </el-form-item>
	  		</el-row>
	  		<el-row>
	  		  <el-col :span="12">
	  		  	<el-form-item label="本金" prop="principal">
	  		  		<el-input size="small" placeholder="请输入内容" v-model.number="form.principal"><template slot="append">元</template></el-input>
	  		  	</el-form-item>
	  		  </el-col>
	  		  <el-col :span="12">
	  		  	<el-form-item label="佣金" prop="commission">
	  		  		<el-input size="small" placeholder="请输入内容" v-model.number="form.commission"><template slot="append">元</template></el-input>
	  		  	</el-form-item>
	  		  </el-col>
	  		</el-row>
	  		<el-row>
	  		  <el-form-item label="备注">
	  		  	  <el-input size="small" placeholder="请输入内容" v-model="form.remarks"></el-input>
	  		  </el-form-item>
	  		</el-row>
        <el-row>
          <el-form-item label="参考图片">
            <image-upload v-model="form.image"></image-upload>
          </el-form-item>
        </el-row>
	  	</div>
		
		<el-form-item>
          <el-button size="small" type="primary" @click="submitForm()">提交</el-button>
          <el-button size="small" @click="resetForm('form')">重置</el-button>
          <el-button size="small" @click="show = false">取 消</el-button>
        </el-form-item>
	  </el-form>
	</el-dialog>
</template>
<script>
  import imageUpload from '~/components/image-upload.vue'
  export default {
    middleware: 'check-auth',
    components:{
      imageUpload
    },
    data() {
      return {
      	show: false,
      	edit: true,
      	index: 0,
      	id: 0,
        form: {
          orderId: 0,
          sku: '',
      	  principal: 0,
      	  commission: 0,
      	  remarks: '',
          image:''
        },
        rules: {
          sku: [
            { required: true, message: '请输入规格', trigger: 'blur' }
          ],
          principal: [
            {type: 'number', required: true, message: '请输入本金', trigger: 'blur' }
          ],
          commission: [
            {type: 'number', required: true, message: '请输入佣金', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
          	if (this.edit) {
          	    this.$store.dispatch('order/editOrderItem',{index:this.index,id:this.id,form:this.form}).then(() => {
	              this.show = false
	            }).catch(e => {
                this.$message({
                  type: 'error',
                  message: '修改失败!' + e
                })
              })
          	} else {
          		this.$store.dispatch('order/addOneItem', this.form).then(() => {
	              this.show = false
	            })
          	}
            
          }
        });
      },
      resetForm(formName) {
      	console.log(this.form)
        this.$refs[formName].resetFields();
      },
      open (edit, cindex, index) {
        if (edit) {
          this.index = index
          this.id = this.$store.state.order.data[cindex].order_items[index].id
          this.form = Object.assign({
            orderId: 0,
            sku: '',
            principal: 0,
            commission: 0,
            remarks: '',
            image:''
          },this.$store.state.order.data[cindex].order_items[index])
          // this.form = this.$store.state.order.data[cindex].order_items[index]
          // console.log(this.form)
        } else {
          this.form = {
            orderId: this.$store.state.order.data[cindex].id,
  	        sku: '',
			principal: 0,
			commission: 0,
            image: '',
			remarks: ''
          }
        }
        this.edit = edit
        this.show = true
      },
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