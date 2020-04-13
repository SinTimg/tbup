module.exports = function (sequelize, DataTypes) {
    return sequelize.define('admin', {
        username: {
            type: DataTypes.STRING(20)
        },
        password: {
            type: DataTypes.STRING(32)
        },
        name: {
            type: DataTypes.STRING(20)
        },
        powers: {  // 权限
            type: DataTypes.INTEGER(11)
        }
    }, {
        classMethods: {
            associate: function (models) {
                this.hasMany(models.order)
            }
        },
        comment: '管理员表'
    })
}
