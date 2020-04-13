<template>
	<el-dialog :title="edit?'修改账号信息':'新增账号'" :visible.sync="show">
	  <el-form :model="form" :rules="rules" :label-position="'top'" ref="form">
	  	<div style="border: 1px solid #dcdfe6;padding: 10px;">
	  		<el-form-item label="账号" prop="username">
          <el-input placeholder="请输入账号" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input placeholder="请输入用户名" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="权限等级">
          <el-select v-model="form.powers" placeholder="请选择权限等级">
            <el-option key="0" label="0" value="0"></el-option>
            <el-option key="1" label="1" value="1"></el-option>
            <el-option key="2" label="2" value="2"></el-option>
            <el-option key="3" label="3" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="!edit" label="角色">
          <el-select v-model="form.role" placeholder="请选择">
            <el-option :key="0" label="商家" :value="0"></el-option>
            <el-option :key="1" label="会员" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="!edit||isPassword" label="密码" prop="password">
          <el-input placeholder="请输入密码" type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-button v-show="edit" size="mini" type="warning" @click="editPassword()">{{isPassword?'放弃修改':'修改密码'}}</el-button>
	  	</div>
		<el-form-item>
          <el-button type="primary" @click="submitForm()">提交</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
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
        isShop: false,
      	index: 0,
      	id: 0,
        isPassword: false,
        form: {
          username: '',
          name: '',
          powers: 0
        },
        rules: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          role: [
            { required: true, message: '请选择角色', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
        }
      };
    },
    methods: {
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
          	if (this.edit) {
          	  this.$store.dispatch('manager/updateAccount',{index:this.index,isShop:this.isShop,form:this.form}).then(() => {
	              this.show = false
	            }).catch(e => {
                this.$message({
                  type: 'error',
                  message: '修改失败!' + e
                })
              })
          	} else {
          		this.$store.dispatch('manager/addAccount', this.form).then(() => {
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
      open (edit, isShop, index) {
        if (edit) {
          this.index = index
          if (isShop) {
            this.id = this.$store.state.manager.shopList[index].id
            this.form = Object.assign({
              id: '',
              username: '',
              name: '',
              powers: 0,
            },this.$store.state.manager.shopList[index])
          } else {
            this.id = this.$store.state.manager.memberList[index].id
            this.form = Object.assign({
              id: '',
              username: '',
              name: '',
              powers: 0,
              password: ''
            },this.$store.state.manager.memberList[index])
          }
          
        } else {
          this.form = {
            username: '',
            name: '',
            powers: 0,
            password: '',
            role: 0
          }
        }
        this.isShop = isShop
        this.edit = edit
        this.show = true
      },
      editPassword() {
        this.form.password = '';
        this.isPassword = !this.isPassword
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