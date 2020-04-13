<template>
	<div>
    <div id="step">
      <el-steps :active="step">
        <el-step title="步骤1"></el-step>
        <el-step title="步骤2"></el-step>
        <el-step title="步骤3"></el-step>
      </el-steps>
    </div>
    <div v-if="step==1">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-form">
        <el-form-item label="订单名称" prop="name">
          <el-input placeholder="例如：顺兴发全自动煎药壶中药壶锅砂锅陶瓷药煲煮炖器中医壶电子熬药罐" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="店铺名" prop="shopname">
          <el-input placeholder="例如：顺兴发医疗电器企业店" v-model="form.shopname"></el-input>
        </el-form-item>
        <el-form-item label="任务时间" required>
          <el-col :span="11">
            <el-form-item prop="date">
              <el-date-picker value-format="yyyy-MM-dd" placeholder="选择日期" v-model="form.date" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="是否特殊订单" required>
          <el-col :span="11">
            <el-tooltip class="item" effect="dark" content="例如订单需要提前浏览，隔天付款，注意任务时间选择为付款时间" placement="top-start">
              <el-select v-model="form.special" placeholder="请选择">
                <el-option key="0" label="否" :value="0"></el-option>
                <el-option key="1" label="是" :value="1"></el-option>
              </el-select>
            </el-tooltip>
          </el-col>
        </el-form-item>
        <el-form-item label="参考图片" prop="image">
          <image-upload v-model="form.image"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input placeholder="例如：早上8点开始付款 下午4:30交单" type="textarea" v-model="form.remarks"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">立即创建</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="step==2">
      
      <order-item v-bind:orderId="orderId" v-on:step="step=3"></order-item>  
      
    </div>
    <div v-if="step==3">
      <el-alert style="margin-top: 20px;" title="添加成功"
          type="success" :closable="false" show-icon>
      </el-alert>
      
    </div>
		
	</div>
</template>
<script>
  import { mapState } from 'vuex'
  import imageUpload from '~/components/image-upload.vue'
  import orderItem from '~/components/order-item.vue'
  export default {
    middleware: 'check-auth',
    head () {
      return {
        title: '添加新订单',
        meta: [
          {hid: 'keyword', name: 'keyword', content: '商家端'},
          {hid: 'description', name: 'description', content: '内部订单管理平台'}
        ]
      }
    },
    components:{
      imageUpload,
      orderItem
    },
    computed: mapState({
      // 当前订单的id
      orderId: state => {
        return state.order.orderId
      },
      // 当前用户的id
      userId: state => {
        return state.user.data.id
      },
    }),
    mounted () {
      this.form.userId = this.userId
    },
    data() {
      return {
        step: 1,
        form: {
          name: '',
          shopname: '',
          date: '',
          special: 0,
          image: '',
          remarks: '',
          userId: 0
        },
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          shopname: [
            { required: true, message: '请输入店铺名称', trigger: 'blur' }
          ],
          date: [
            { required: true, message: '请选择日期', trigger: 'change' }
          ],
          image: [
            { required: true, message: '请上传示例图', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$store.dispatch('order/addOrder', this.form).then(() => {
              this.resetForm('form')
              this.step = 2;
            })
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style>
  #step {
    padding-bottom: 10px;
    padding-left: 20%;
    align-content: center;
  }
</style>