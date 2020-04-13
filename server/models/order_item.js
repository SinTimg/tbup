module.exports = function (sequelize, DataTypes) {
  return sequelize.define('order_item', {
    sku: {  //规格
      type: DataTypes.STRING(200)
    },
    principal: {  //本金
      type: DataTypes.INTEGER(11)
    },
    commission: {  //佣金
      type: DataTypes.INTEGER(11)
    },
    image: {  //图片地址
      type: DataTypes.STRING(200)
    },
    remarks: {  // 备注
      type: DataTypes.STRING(200)
    },
    state: {  // 订单项状态  0 => 关闭状态 1 => 发布状态
      type: DataTypes.INTEGER(11),
      defaultValue: 1
    },
  }, {
    classMethods: {
      associate: function (models) {
        this.belongsTo(models.order)
        this.hasMany(models.keyword)
      }
  	},
    comment: '订单表'
  })
}
