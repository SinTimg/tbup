module.exports = function (sequelize, DataTypes) {
    return sequelize.define('complete', {
        tb_name: {  // 淘宝会员名
            type: DataTypes.STRING(200)
        },
        order_number: {  // 订单号
            type: DataTypes.STRING(200)
        },
        consignee: {    // 收货人
            type: DataTypes.STRING(200)
        },
        payment: {  //付款金额
          type: DataTypes.INTEGER(11)
        },
        price: {    // 总价
            type: DataTypes.INTEGER(11)
        },
        price_difference: {     //差价
            type: DataTypes.INTEGER(11)
        }
    }, {
        classMethods: {
            associate: function (models) {
                this.belongsTo(models.task),
                this.belongsTo(models.order_item)
            }
        },
        comment: '任务完成表'
    })
}
