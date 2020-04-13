<template>
<div>
  <!--<el-card>-->
    <!--<el-col :span="4">-->
      <!--<img :src="getMinImagePath(orderItem.image)" class="image">-->
    <!--</el-col>-->
    <!--<el-col :span="20">-->
      <!--&lt;!&ndash; <el-tag class="card-value">{{orderItem.keyword}}</el-tag> &ndash;&gt;-->
      <!--<el-row>-->
        <!--<el-col :span="6">-->
          <!--<div class="card-item">关键词</div>-->
          <!---->
        <!--</el-col>-->
        <!--<el-col :span="4">-->
          <!--<div class="card-item">需购数量</div>-->
          <!--&lt;!&ndash; <el-tag class="card-value" type="warning">{{orderItem.number}}</el-tag> &ndash;&gt;-->
        <!--</el-col>-->
        <!--<el-col :span="3">-->
          <!--<div class="card-item">本金</div>-->
          <!--&lt;!&ndash; <el-tag class="card-value" type="warning">{{orderItem.principal}}</el-tag> &ndash;&gt;-->
        <!--</el-col>-->
        <!--<el-col :span="3">-->
          <!--<div class="card-item">佣金</div>-->
          <!--&lt;!&ndash; <el-tag class="card-value" type="warning">{{orderItem.commission}}</el-tag> &ndash;&gt;-->
        <!--</el-col>-->
      <!--</el-row>-->
      <!--<el-row>-->
        <!--<el-col :span="12">-->
          <!--<div class="card-item">规格</div><div class="card-value">{{orderItem.sku}}</div>-->
        <!--</el-col>-->
        <!--<el-col :span="1"></el-col>-->
        <!--<el-col :span="10">-->
          <!--<div class="card-item">备注</div><div class="card-value">{{orderItem.remarks}}</div>-->
        <!--</el-col>-->
        <!--<el-col :span="1">-->
          <!--<el-tooltip class="item" effect="dark" content="添加完成信息" placement="top-start">-->
            <!--<el-button size="medium" type="primary" @click="add()" icon="el-icon-circle-plus" circle></el-button>-->
          <!--</el-tooltip>-->
        <!--</el-col>-->
      <!--</el-row>-->
    <!--</el-col>-->
  <!--</el-card>-->
  <el-table v-show="is"
    :data="tableData5"
    style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="商品名称">
            <span>{{ props.row.name }}</span>
          </el-form-item>
          <el-form-item label="所属店铺">
            <span>{{ props.row.shop }}</span>
          </el-form-item>
          <el-form-item label="商品 ID">
            <span>{{ props.row.id }}</span>
          </el-form-item>
          <el-form-item label="店铺 ID">
            <span>{{ props.row.shopId }}</span>
          </el-form-item>
          <el-form-item label="商品分类">
            <span>{{ props.row.category }}</span>
          </el-form-item>
          <el-form-item label="店铺地址">
            <span>{{ props.row.address }}</span>
          </el-form-item>
          <el-form-item label="商品描述">
            <span>{{ props.row.desc }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="商品 ID"
      prop="id">
    </el-table-column>
    <el-table-column
      label="商品名称"
      prop="name">
    </el-table-column>
    <el-table-column
      label="描述"
      prop="desc">
    </el-table-column>
  </el-table>
  <el-button size="mini" @click="is = (!is)" type="success">返回</el-button>
  <el-table v-show="!is"
    :data="tableData5"
    style="width: 100%">
    <el-table-column
      label="商品 ID"
      prop="id">
    </el-table-column>
    <el-table-column
      label="商品名称"
      prop="name">
    </el-table-column>
    <el-table-column
      label="描述"
      prop="desc">
    </el-table-column>
  </el-table>
</div>
</template>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>

<script>
  export default {
    data() {
      return {
        orderItem: {},
        is: true,
        tableData5: [{
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987123',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987125',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987126',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }]
      }
    }
  }
</script>