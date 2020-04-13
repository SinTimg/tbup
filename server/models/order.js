module.exports = function (sequelize, DataTypes) {
  return sequelize.define('order', {
    name: {   // 订单名称
      type: DataTypes.STRING(20)
    },
    shopname: {   //店铺名
      type: DataTypes.STRING(20)
    },
    image: {  //图片地址
      type: DataTypes.STRING(200)
    },
    special: {  //是否是特殊单 0=> 否，1=> 是
      type: DataTypes.INTEGER(11)
    },
    remarks: {  // 备注
      type: DataTypes.STRING(200)
    },
    date: { //任务日期
      type: DataTypes.DATEONLY()
    },
  }, {
    classMethods: {
      associate: function (models) {
        this.hasMany(models.order_item)
        this.belongsTo(models.user)
      }
    },
    comment: '订单表'
  })
}
