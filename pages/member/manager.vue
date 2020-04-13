<template>
    <div>
        <div id="top-bar">
            <!-- <ul class="top-menu">
                <li class="top-item" :class="{active:RegExp(/manager-order/).test($route.name)}">
                    <nuxt-link to="/member/manager/task">任务列表</nuxt-link>
                </li>
                <li class="top-item" :class="{active:$route.name === 'manager'}">
                    <nuxt-link to="/member/manager/order">任务管理</nuxt-link>
                </li>
            </ul> -->
            <ul class="top-right">
                <li class="top-item" style=" overflow: hidden;height: 50px;">
                    <el-dropdown trigger="click" @command="handleRightMenu">
                        <a style="float: left;width:80px;padding-right:0">{{username}}</a>
                        <span class="el-icon-setting"
                              style="line-height:50px;float:left;color:#fff;padding-right:16px;"></span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="reset" :disabled="true">修改密码</el-dropdown-item>
                            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </li>
            </ul>
        </div>
        <nuxt-child/>
    </div>
</template>
<style>

    #top-bar {
        position: absolute;
        left: 0;
        right: 0;
        top: 0px;
        height: 50px;
        background: #373D41;
        border-bottom: 1px;
        z-index: 100;
    }

    .top-menu {
        margin: 0;
        padding: 0;
        list-style: none;
        line-height: 50px;
        float: left;
    }

    .top-item {
        float: left;
        transition: background .3s;
        font-size: 14px;
        cursor: pointer;
        border-right: 1px solid #2a2f32;
        font-weight: 300;
    }

    .top-item a {
        display: block;
        width: 100%;
        padding: 0 32px;
        height: 100%;
        color: #fff;
        text-decoration: none;
    }

    .top-item.active {
        background: #2a2f32;
    }

    .top-item.active a {
        color: #41B883;
    }

    .top-item:hover {
        background: #2a2f32;
    }

    .top-right {
        margin: 0;
        padding: 0;
        list-style: none;
        line-height: 50px;
        float: right;
    }
</style>
<script>
	export default {
	  middleware: 'check-member',
	  computed: {
	    username () {
	  	    return this.$store.state.member.data?this.$store.state.member.data.name: ''
	    }
	  },
	  methods: {
        handleRightMenu (common) {
		    if (common === 'logout') {
		      this.$store.dispatch('member/logout').then(res => {
		        this.$router.push('/member/login')
		      })
		    }
		    if (common === 'reset') {
		      this.$router.push('/reset')
		    }
		} 
      }
	};
</script>

