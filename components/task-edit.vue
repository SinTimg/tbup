<template>
    <el-dialog title="添加订单" :visible.sync="show">
        <el-form :model="taskForm" :rules="rules" :label-position="'top'" ref="form">
            <div style="border: 1px solid #dcdfe6;padding: 10px;">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="参考图">
                            <img :src="getMinImagePath(form.order_item.image)" class="itemImage">
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="关键词">
                            <el-alert
                                    :title="form.keyword"
                                    type="info"
                                    :closable="false">
                            </el-alert>
                        </el-form-item>
                        <el-form-item label="规格">
                            <el-alert
                                    :title="form.order_item.sku"
                                    type="info"
                                    :closable="false">
                            </el-alert>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="9">
                        <!--<el-form-item label="订单数(最大数)" prop="total_num">-->
                        <el-form-item :label="`订单数(最大数${max_num})`" prop="total_num">

                            <el-input-number v-model="taskForm.total_num" :min="taskForm.complete_number" :max="max_num"
                                             :step="1" label="form.order_num"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="件数">
                            <el-tag>{{form.number}}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="本金">
                            <el-tag type="warning">{{form.order_item.principal}}元</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="佣金">
                            <el-tag type="danger">{{form.order_item.commission}}元</el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="备注">
                        <el-alert
                                :title="form.order_item.remarks"
                                type="info"
                                :closable="false">
                        </el-alert>
                    </el-form-item>
                </el-row>
            </div>

            <el-form-item>
                <el-button type="primary" @click="submitForm()">提交</el-button>
                <el-button @click="show = false">取 消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>
  export default {
    data() {
      return {
        show: false,
        edit: true,
        index: 0,
        id: 0,
        form: {
          id: '',
          keyword: '',
          order_num: 10,
          number: 1,
          order_item: {},
          state: 0,
          createdAt: '',
          updatedAt: '',
          inventory: {
            complete_number: 0,
            completes: [],
            createdAt: '',
            id: 0,
            keywordId: 0,
            remarks: '',
            state: 0,
            total_num: 0,
            updatedAt: '',
            userId: 0
          }
        },
        max_num: 0,
        taskForm: {},
        initTaskNum: 0,
        rules: {
          total_num: [
            {type: 'number', required: true, message: '请输入订单数', trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.taskForm["modifyNum"] = this.taskForm.total_num - this.initTaskNum
            this.$store.dispatch('task/updateTaskList', {
              id: this.id,
              form: this.taskForm,
              index: this.index
            }).then(() => {
              this.show = false
            }).catch(e => {
              this.$message.error(e.message)
              this.show = false
            })

          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      open(row, index) {
        this.index = index;
        this.initTaskNum = row.total_num
        this.id = row.id
        this.taskForm = Object.assign({
          complete_number: 0,
          completes: [],
          createdAt: '',
          id: 0,
          keywordId: 0,
          keyword: {},
          remarks: '',
          state: 0,
          total_num: 0,
          updatedAt: '',
          userId: 0
        }, row)
        this.$store.dispatch('task/getInventory', {id: row.keywordId, isUpdateList: false}).then((res) => {
          this.form = Object.assign({
            id: '',
            keyword: '',
            order_num: 10,
            number: 1,
            order_item: {},
            state: 0,
            createdAt: '',
            updatedAt: '',
            inventory: {}
          }, res.data)
          this.max_num = this.form.inventory.remaining_number + row.total_num
        })

        this.show = true
      },
    }
  }
</script>
<style>
    .itemImage {
        width: 150px;
        height: 150px;
        border-radius: 5px;
    }
</style>