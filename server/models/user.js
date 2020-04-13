module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user', {
    username: {
      type: DataTypes.STRING(20)
    },
    password: {
      type: DataTypes.STRING(32)
    },
    name: {
      type: DataTypes.STRING(20)
    },
    role: { // 角色 0=>商家，1=>会员
        type: DataTypes.INTEGER(11)
    },
    powers: {  // 权限
      type: DataTypes.INTEGER(11)
    },
    status: {  // 状态 1=>账号可用，0=>账号不可用
      type: DataTypes.INTEGER(11),
      defaultValue: 1
    }
  }, {
    classMethods: {
      associate: function (models) {
        this.hasMany(models.order)
      }
    },
    comment: '用户表'
  })
}
