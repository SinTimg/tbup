<template>
    <div id="login-box">
        <h1 id="login-title">登录</h1>
        <el-form :model="user" ref="user" label-position="top">
            <el-form-item label="用户名" prop="username"
                          :rules="[{ required: true, message: '用户名不能为空'}]">
                <el-input name="username" placeholder="在此输入用户名" v-model="user.username">
                    <el-button slot="prepend"><i class="icon">&#xe625;</i></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password"
                          :rules="[{ required: true, message: '密码不能为空'}]">
                <el-input name="password" type="password" placeholder="在此输入密码" v-model="user.password">
                    <el-button slot="prepend"><i class="icon">&#xe605;</i></el-button>
                </el-input>
            </el-form-item>
            <el-button type="primary" id="login-btn" :loading="loading" @click="login">登录</el-button>
        </el-form>
    </div>
</template>
<style>
    #login-box {
        width: 360px;
        margin: 100px auto 0;
        padding: 30px;
        border: 1px solid #ccc;
    }

    #login-box .el-button {
        padding: 8px;
    }

    #login-box .iconfont {
        font-size: 18px;
    }

    #login-title {
        text-align: center;
        font-size: 20px;
        margin-bottom: 30px;
    }

    #login-btn {
        width: 100%;
        margin-top: 32px;
        margin-bottom: 32px;
        font-size: 16px;
    }
</style>
<script>
  export default {
    middleware: 'check-admin-before',
    head () {
      return {
        title: '管理员，请登录'
      }
    },
    data () {
      return {
        user: {
          username: '',
          password: ''
        },
        loading: false
      }
    },
    methods: {
      login () {
        this.user.password = this.user.password
        this.$refs.user.validate(function (valid) {
          if (valid) {
            this.loading = true
          }
          this.$store.dispatch('admin/login', this.user).then(res => {
            this.$router.push('/admin/manager/order/list')
            this.loading = false
          }).catch(e => {
            this.$message.error(e.message)
            this.loading = false
          })
        }.bind(this))
      }
    }
  }
</script>
