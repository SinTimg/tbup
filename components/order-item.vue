<template>
	<div>
	  <el-form :model="form" :label-position="'top'" ref="form">
	  	<div style="border: 1px solid #dcdfe6;padding: 10px;" v-for="(row, index) in form.row">
	  		<el-row>
				<el-col :span="6">
					<el-form-item label="参考图片">
						<image-upload v-model="row.image"/>
					</el-form-item>
				</el-col>
	  			<el-col :span="18">
					<el-row>
						<el-col :span="4">
							<el-form-item label="本金" :prop="'row.'+index+'.principal'"
										  :rules="{type: 'number', required: true, message: '请输入本金', trigger: 'blur' }">
								<el-input size="small" placeholder="请输入内容" v-model.number="row.principal"><template slot="append">元</template></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-form-item label="佣金" :prop="'row.'+index+'.commission'"
										  :rules="{type: 'number', required: true, message: '请输入佣金', trigger: 'blur' }">
								<el-input size="small" placeholder="请输入内容" v-model.number="row.commission"><template slot="append">元</template></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="16">
							<el-form-item label="规格" :prop="'row.'+index+'.sku'"
										  :rules="{ required: true, message: '请输入规格', trigger: 'blur' }">
								<el-input size="small" placeholder="请输入内容" v-model="row.sku"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="22">
							<el-form-item label="备注">
								<el-input size="small" placeholder="请输入内容" v-model="row.remarks"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="2">
							<el-button size="small" style="margin-top: 50px;" type="danger" @click.prevent="removeRow(index)" icon="el-icon-delete" circle></el-button>
						</el-col>
					</el-row>

	  			</el-col>
	  		</el-row>
			<el-row v-for="(item,key) in row.keywords" :key="key">
				<el-col :span="12">
					<el-form-item label="关键词" :prop="'row.'+index+'.keywords.'+key+'.keyword'"
								  :rules="[{ required: true, message: '请输入关键词', trigger: 'blur' }]">
						<el-input size="small" placeholder="请输入关键词" v-model="item.keyword"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item label="下单时间" :prop="'row.'+index+'.keywords.'+key+'.time'"
								  :rules="{required: true, message: '请输入下单时间', trigger: 'blur' }">
						<el-time-select style="width: 130px" size="small" placeholder="请输入内容"  v-model="item.time"
							:picker-options="{
							    start: '00:00',
							    step: '01:00',
							    end: '24:00'
							}"
						></el-time-select>
					</el-form-item>
				</el-col>
				<el-col :span="3">
					<el-form-item label="订单数" :prop="'row.'+index+'.keywords.'+key+'.order_num'"
								  :rules="{type: 'number', required: true, message: '请输入订单数', trigger: 'blur' }">
						<el-input size="small" placeholder="请输入内容" v-model.number="item.order_num"><template slot="append">个</template></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="3">
					<el-form-item label="件数" :prop="'row.'+index+'.keywords.'+key+'.number'"
								  :rules="{type: 'number', required: true, message: '请输入件数', trigger: 'blur' }">
						<el-input size="small" placeholder="请输入内容" v-model.number="item.number"><template slot="append">个</template></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="1">
					<el-button size="mini" style="margin-top: 56px;margin-left: 2px" type="warning" @click.prevent="copyKeyword(index,key)">复制</el-button>
				</el-col>
				<el-col :span="1">
					<el-button size="mini" style="margin-top: 56px;margin-left: 15px" type="danger" @click.prevent="removeKeyword(index,key)">删除</el-button>
				</el-col>
			</el-row>
			<el-button size="small" type="primary" @click.prevent="addKeyword(index)">添加关键词</el-button>

	  	</div>
		
		<el-form-item>
          <el-button size="small" type="primary" @click="submitForm()">提交</el-button>
          <el-button size="small" @click="addRow">新增</el-button>
          <el-button size="small" @click="resetForm('form')">重置</el-button>
        </el-form-item>
	  </el-form>
	</div>
</template>

<script>
  import imageUpload from '~/components/image-upload.vue'

  export default {
  	middleware: 'check-auth',
    components:{
      imageUpload
    },
  	props: {
      orderId: Number
    },
    data() {
      return {
        form: {
          row: [{
          	orderId: this.orderId,
            keywords: [{
          	  keyword: '',
              order_num: 1,
              number: 1,
              time: ''
            }],
          	sku: '',
          	principal: 0,
          	commission: 0,
          	remarks: '',
          	image:''
	      }]
        },
      };
    },
    methods: {
      submitForm() {
      	console.log(this.orderId)
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$store.dispatch('order/addOrderItem', this.form.row).then(() => {
              this.resetForm('form')
              this.$emit('step')
            })
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      addRow() {
      	this.form.row.push({
      	  orderId: this.orderId,
          keywords: [{
            keyword: '',
            order_num: 1,
            number: 1
		  }],
          sku: '',
          principal: 0,
          commission: 0,
          remarks: '',
          image:''
        })
        console.log(this.form.row)
      },
      removeRow(index) {
      	this.form.row.splice(index,1)
      },
      addKeyword(index) {
        this.form.row[index].keywords.push({
          keyword: '',
          order_num: 1,
          number: 1
        })
	  },
	  copyKeyword(index,key) {
        this.form.row[index].keywords.push(this.form.row[index].keywords[key])
	  },
      removeKeyword(index, key) {
        this.form.row[index].keywords.splice(key,1)
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