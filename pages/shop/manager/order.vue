<template>
  <div id="bottom">
  	<div id="menu">
  		<li class="menu-item" :class="{active:$route.name == 'shop-manager-order-list'}"
      @click="toNewPage('list')">
  		  <i class="el-icon-menu"></i>
  		  <span slot="title">订单列表</span>
  		</li>
  		<li class="menu-item" :class="{active:$route.name == 'shop-manager-order-add'}"
      @click="toNewPage('add')">
  		  <i class="el-icon-menu"></i>
  		  <span slot="title">添加订单</span>
  		</li>
  	</div>
	<nuxt-child id="content"/>
  </div>
</template>
<style>
	  #bottom {
        position: absolute;
        top: 50px;
        bottom: 0;
        left: 0px;
        right: 0;
        overflow-y: auto;
    }
    #content {
      padding: 20px;
      position: absolute;
      top: 10px;
      bottom: 0;
      left: 180px;
      right: 20px;
      overflow-y: auto;
    }
    #menu {
        position: absolute;
        top: 0px;
        left: 0;
        bottom: 0;
        width: 180px;
        background: #f0f0f0;
        border-right: #C6C8CC 1px solid;
    }

    .menu-title {
        height: 40px;
        padding: 16px;
        line-height: 40px;
        background: #e9e9e9;
        color: #555;
    }

    .menu {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .menu-item {
        padding: 8px 16px 8px 32px;
        line-height: 40px;
        font-size: 14px;
        transition: background .3s;
        cursor: pointer;
        color: #666;
    }

    .menu-item a{
        color: #666;
        text-decoration: none;
    }

    .menu-item:hover, .menu-item.active{
        background: #545c64;
        color: #ffd04b;
    }

    .menu-item .icon {
        float: right;
        color: #999;
    }
</style>
<script>
	export default {
	  middleware: 'check-auth',
	  methods: {
      toNewPage (route) {
        window.location.href = '/shop/manager/order/'+route
      },
      handleRightMenu (common) {
		    if (common === 'logout') {
		      this.$store.dispatch('user/logout').then(res => {
		        this.$router.push('/login')
		      })
		    }
		    if (common === 'reset') {
		      this.$router.push('/reset')
		    }
  		},
    }
	};
</script>