module.exports = function (sequelize, DataTypes) {
  return sequelize.define('keyword', {
    keyword: {   // 关键词
      type: DataTypes.STRING(20)
    },
    order_num: {   //订单数
      type: DataTypes.INTEGER(11)
    },
    number: {  //件数
      type: DataTypes.INTEGER(11)
    },
    time: {   //下单时间
      type: DataTypes.STRING(20)
    },
    state: {  // 订单项状态  0 => 关闭状态 1 => 发布状态
      type: DataTypes.INTEGER(11),
      defaultValue: 1
    },
  }, {
    classMethods: {
      associate: function (models) {
        this.belongsTo(models.order_item)
        this.hasOne(models.inventory)
        this.hasMany(models.task)
      }
    },
    comment: '关键词表'
  })
}
