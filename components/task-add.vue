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
                        <el-form-item :label="`订单数(最大数${form.inventory.remaining_number})`" prop="total_num">

                            <el-input-number v-model="taskForm.total_num" :min="1"
                                             :max="form.inventory.remaining_number" :step="1"
                                             label="form.order_num"></el-input-number>
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
    middleware: 'check-auth',
    data() {
      return {
        show: false,
        edit: true,
        pindex: 0,
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
          inventory: {}
        },
        taskForm: {
          total_num: 1,
          state: 0,
          complete_number: 0
        },
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
            this.taskForm["userId"] = this.$store.state.member.userId
            this.$store.dispatch('task/addTask', {
              pindex: this.pindex,
              cindex: this.cindex,
              index: this.index,
              form: this.taskForm
            }).then(() => {
              this.show = false
            }).catch(e => {
              this.$message.error(e.message)
              this.show = false
            })
            // if (this.edit) {
            //     this.$store.dispatch('order/editOrderItem',{index:this.index,id:this.id,form:this.form}).then(() => {
            //         this.show = false
            //     })
            // } else {
            //     this.$store.dispatch('order/addOneItem', this.form).then(() => {
            //         this.show = false
            //     })
            // }

          }
        });
      },
      resetForm(formName) {
        console.log(this.form)
        this.$refs[formName].resetFields();
      },
      open(edit, id, pindex, cindex, index) {
        this.taskForm = {
            total_num: 1,
            state: 0,
            complete_number: 0
        }
        this.pindex = pindex
        this.cindex = cindex
        this.index = index
        this.taskForm["keywordId"] = id;
        this.$store.dispatch('task/getInventory', {
          id: id,
          pindex: pindex,
          cindex: cindex,
          index: index,
          isUpdateList: true
        }).then((res) => {
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
        })
        this.edit = edit
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