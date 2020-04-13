<template>
	<div class="card">
		<el-button size="mini" type="primary" @click="add()">添加</el-button>
		<el-tabs v-model="activeName" type="card">
		    <el-tab-pane label="用户管理" name="member">
		    	<el-table :data="memberList" style="width: 100%">
		    		<el-table-column
		    		        label="账号"
		    		        prop="username">
		    		</el-table-column>
		    		<el-table-column
		    		        label="用户名"
		    		        prop="name">
		    		</el-table-column>
		    		<el-table-column
		    		        label="权限"
		    		        prop="powers">
		    		</el-table-column>
		    		<el-table-column
		    		        label="创建时间"
		    		        prop="createdAt">
		    		    <template slot-scope="props">
		    		        {{getTime(props.row.createdAt)}}
		    		    </template>
		    		</el-table-column>
		    		<el-table-column
		    		        label="更新时间"
		    		        prop="updatedAt">
		    		    <template slot-scope="props">
		    		        {{getTime(props.row.updatedAt)}}
		    		    </template>
		    		</el-table-column>
		    		<el-table-column label="操作" width="180">
		    		    <template slot-scope="scope">
		    		        <el-button size="mini" @click="edit(false,scope.$index)">修改</el-button>
		    		        <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
		    		        	<el-button size="mini" type="danger" icon="el-icon-delete" @click="remove(false,scope.$index)"></el-button>
		    		        </el-tooltip>
		    		    </template>
		    		</el-table-column>
		    	</el-table>
		    </el-tab-pane>
		    <el-tab-pane label="商家管理" name="shop">
		    	<el-table :data="shopList" style="width: 100%">
		    		<el-table-column
		    		        label="账号"
		    		        prop="username">
		    		</el-table-column>
		    		<el-table-column
		    		        label="用户名"
		    		        prop="name">
		    		</el-table-column>
		    		<el-table-column
		    		        label="权限"
		    		        prop="powers">
		    		</el-table-column>
		    		<el-table-column
		    		        label="创建时间"
		    		        prop="createdAt">
		    		    <template slot-scope="props">
		    		        {{getTime(props.row.createdAt)}}
		    		    </template>
		    		</el-table-column>
		    		<el-table-column
		    		        label="更新时间"
		    		        prop="updatedAt">
		    		    <template slot-scope="props">
		    		        {{getTime(props.row.updatedAt)}}
		    		    </template>
		    		</el-table-column>
		    		<el-table-column label="操作" width="180">
		    		    <template slot-scope="scope">
		    		        <el-button size="mini" @click="edit(true,scope.$index)">修改</el-button>
		    		        <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
		    		        	<el-button size="mini" type="danger" icon="el-icon-delete" @click="remove(true,scope.$index)"></el-button>
		    		        </el-tooltip>
		    		    </template>
		    		</el-table-column>
		    	</el-table>
		    </el-tab-pane>
		</el-tabs>
		
		<account-edit ref="accountEdit"/>
	</div>
</template>

<style>
	.image {
		width: 100px;
		height: 100px;
		border-radius: 5px;
	}
	.card {
		padding: 15px;
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.24);
	}

</style>

<script>
    import { mapState } from 'vuex'
    import accountEdit from '~/components/account-edit.vue'
    export default {
    	middleware: 'check-admin',
        head () {
            return {
                title: '账号管理'
            }
        },
        components:{
            accountEdit
        },
        computed: mapState({
            memberList: state => {
                return state.manager.memberList
            },
            shopList: state => {
                return state.manager.shopList
            }
        }),
        mounted () {
            this.$store.dispatch('manager/getAccount').then((e)=>{
        
            })
        },
        data() {
            return {
                activeName: 'member'
            }
        },
        methods: {
        	add() {
			  this.$refs.accountEdit.open(false)
        	},
        	edit(isShop,index) {
        	  this.$refs.accountEdit.open(true,isShop,index)
        	},
            remove(isShop,index) {
            	this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
            	  confirmButtonText: '确定',
            	  cancelButtonText: '取消',
            	  type: 'warning'
            	}).then(() => {
            	    this.$store.dispatch('manager/deleteAccount',{isShop:isShop,index:index}).then((e)=>{
	  	               this.$message({
	  	                 type: 'success',
	  	                 message: '删除成功!'
	  	               })
	  	            }).catch(e => {
	  	                this.$message({
	  	                  type: 'error',
	  	                  message: '修改失败!' + e
	  	                })
	  	            })
            	})
            }
        }
    }
</script>