<template>
	<el-dialog :title="edit?'修改关键词信息':'新增关键词'" :visible.sync="show">
	  <el-form :model="form" :rules="rules" :label-position="'top'" ref="form">
	  	<div style="border: 1px solid #dcdfe6;padding: 10px;">
	  		<el-row>
  		  	  <el-form-item label="关键词" prop="keyword">
  		  		<el-input size="small" placeholder="请输入关键词" v-model="form.keyword"></el-input>
  		  	  </el-form-item>
	  		</el-row>
	  		<el-row>
	  		  <el-col :span="12">
	  		  	<el-form-item label="订单数" prop="principal">
	  		  		<el-input size="small" placeholder="请输入订单数" v-model.number="form.order_num"><template slot="append">元</template></el-input>
	  		  	</el-form-item>
	  		  </el-col>
	  		  <el-col :span="12">
	  		  	<el-form-item label="购买件数" prop="commission">
	  		  		<el-input size="small" placeholder="请输入购买件数" v-model.number="form.number"><template slot="append">元</template></el-input>
	  		  	</el-form-item>
	  		  </el-col>
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
		pindex: 0,
		cindex: 0,
      	index: 0,
      	id: 0,
        form: {
          id: 0,
          orderItemId: 0,
          keyword: '',
          order_num: 0,
          number: 0,
          state: 0
        },
        rules: {
          keyword: [
            { required: true, message: '请输入关键词', trigger: 'blur' }
          ],
          order_num: [
            {type: 'number', required: true, message: '请输入订单数', trigger: 'blur' }
          ],
          number: [
            {type: 'number', required: true, message: '请输入每单购买的件数', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
          	if (this.edit) {
          	    this.$store.dispatch('order/editKeyword',{pindex: this.pindex,cindex: this.cindex,index:this.index,id:this.id,form:this.form}).then(() => {
          	      this.$emit("input",this.$store.state.order.data)
	              this.show = false
	            }).catch(e => {
					this.$message({
					  type: 'error',
					  message: '修改失败!' + e
					})
				})
          	} else {
          		this.$store.dispatch('order/addKeyword', {pindex: this.pindex,cindex: this.cindex,form:this.form}).then(() => {
	              this.show = false
	            }).catch(e => {
                  this.$message({
                    type: 'error',
                    message: '添加失败!' + e
                  })
                })
          	}
            
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      open (edit, pindex, cindex, index) {
        if (edit) {
          this.id = this.$store.state.order.data[pindex].order_items[cindex].keywords[index].id
          this.form = Object.assign({
			id: 0,
            orderItemId: 0,
            keyword: '',
            order_num: 0,
            number: 0,
            state: 0
          },this.$store.state.order.data[pindex].order_items[cindex].keywords[index])
          // this.form = this.$store.state.order.data[cindex].order_items[index]
        } else {
          this.form = {
            orderItemId: this.$store.state.order.data[pindex].order_items[cindex].id,
            keyword: '',
            order_num: 0,
            number: 0
          }
        }
		this.pindex = pindex
		this.cindex = cindex
		this.index = index
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