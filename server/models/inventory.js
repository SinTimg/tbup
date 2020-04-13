module.exports = function (sequelize, DataTypes) {
    return sequelize.define('inventory', {
        remaining_number: { // 剩余数量
            type: DataTypes.INTEGER(11)
        },
        remarks: {  // 备注
            type: DataTypes.STRING(200)
        }
    }, {
        classMethods: {
            associate: function (models) {
                this.belongsTo(models.keyword)
            }
        },
        comment: '库存表'
    })
}