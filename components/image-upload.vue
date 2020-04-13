<template>
  <div class="editor-upload">
    <el-upload drag action="/upload/image" :show-file-list="false" :on-success="handleUplaadSuccess"
               :on-progress="on_upload">
        <div v-if="progress" style="height:200px;background: #fff;">
            <el-progress type="circle" style="padding:40px 0;"
                         :percentage="progress"></el-progress>
        </div>
        <img v-if="value" style="width:100%;height: 100%" :src="getImagePath(value)">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
  </div>
</template>
<script>
  export default {
    props: {
      value: String
    },
    data: function () {
      return {
        progress: 0
      }
    },
    methods: {
      handleUplaadSuccess (res, file) {
        this.progress = 0
        this.$emit('input', res.data)
      },
      on_upload (event) {
        this.progress = parseInt(event.percent)
      }
    }
  }
</script>
<style>
    .el-upload-dragger {
        width: 200px;
        height: 200px;
    }
</style>