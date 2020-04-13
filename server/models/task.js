module.exports = function (sequelize, DataTypes) {
    return sequelize.define('task', {
        total_num: {   // 接受任务数
            type: DataTypes.INTEGER(11)
        },
        complete_number: { // 完成任务数
            type: DataTypes.INTEGER(11),
            defaultValue: 0
        },
        remarks: {  // 备注
            type: DataTypes.STRING(200)
        },
        state: {  // 订单项状态  0 => 进行状态 1 => 完成状态
            type: DataTypes.INTEGER(11),
            defaultValue: 0
        }
    }, {
        classMethods: {
            associate: function (models) {
                this.belongsTo(models.keyword),
                this.belongsTo(models.user),
                this.hasMany(models.complete)
            }
        },
        comment: '任务表'
    })
}
