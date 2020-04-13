<template>
    <el-dialog :title="edit?'修改订单信息':'新增订单'" :visible.sync="show">
        <el-form :model="form" :rules="rules" ref="form" class="demo-form">
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
          <image-upload v-model="form.image"></image-upload>
        </el-form-item>
        <el-form-item label="备注">
          <el-input placeholder="例如：早上8点开始付款 下午4:30交单" type="textarea" v-model="form.remarks"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">确定</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
          <el-button @click="show = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
</template>
<script>
  import imageUpload from '~/components/image-upload.vue'
  export default {
    components: {
      imageUpload
    },
    data () {
      return {
        edit: true,
        show: false,
        index: 0,
        form: {
          name: '',
          shopname: '',
          date: '',
          special: '',
          image: '',
          remarks: ''
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
      }
    },
    methods: {
      open (edit, index) {
        if (edit) {
          this.index = index

          this.form = Object.assign({
            name: '',
            shopname: '',
            date: '',
            special: '',
            image: '',
            remarks: ''
          },this.$store.state.order.data[index])
          // this.form.date = new Date(this.$store.state.order.data[index].date)
        }
        this.edit = edit
        this.show = true
      },
      submitForm() {
        if (this.edit) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              this.$store.dispatch('order/editOrder', {index: this.index,form: this.form}).then(() => {
                this.show = false
              })
            }
          });
        } else {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              this.$store.dispatch('order/addOrder', this.form).then(() => { 2;
                this.show = false
              })
            }
          });
        }
        
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
