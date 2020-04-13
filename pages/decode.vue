<template>
    <div>
        <h2>密码解析</h2>
        <el-form ref="user" :model="user" label-width="80px" id="form">
            <el-form-item prop="text" :rules="[{ required: true, message: '文本不能为空'}]">
                <el-input placeholder="请输入密码" v-model="user.text">
                    <el-button slot="prepend"><i class="icon">&#xe605;</i></el-button>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width: 320px;" @click="decodePassword" >解析密码</el-button>
            </el-form-item>
            <el-form-item label="解析后的密码为：">
                <el-input id="decode" v-model="user.newText" :disabled="true">
                    <el-button slot="prepend"><i class="icon">&#xe605;</i></el-button>
                </el-input>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
  import axios from 'axios'
  export default {
    head () {
      return {
        title: '密码重置'
      }
    },
    data () {
      return {
        user: {
          text: '',
          newText: ''
        }
      }
    },
    methods: {
      decodePassword () {
        let data = {text: this.user.text}
        axios.post('/user/decode', data).then(res => {
          console.log(res.data)
          this.user.newText = res.data.data
        })
      }
    }
  }
</script>
<style>
    body {
        width: 100%;
        height: 100%;
        /*background-image: url("../assets/img/reset1.jpg");*/
    }
    #form {
        color: #666666;
        position: fixed;
        top: 33%;
        left:35%;
        width:400px;
    }
    h2 {
        color: #666666;
        position: fixed;
        top: 28%;
        left:36%;
        margin: 0 80px 20px 165px;
    }
</style>