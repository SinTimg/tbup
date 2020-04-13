const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('../../server.config.js')[env]
const mysql = require('mysql')

let sequelize
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}
let db = {}

fs.readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach(function (file) {
    // 编译到build里面后，__dirname的路径变为 ${projectPath}/build/  所以要用 .. 返回上一级
    let model = sequelize.import(path.join('..', __dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

db.init = async function () {
  await createDatabase()
}

// 首次运行程序，创建数据库
function createDatabase () {
  return new Promise((resolve, reject) => {
    let connection = mysql.createConnection({
      host: config.host,
      user: config.username,
      password: config.password
    })
    connection.query(
      `create database if not exists \`${config.database}\`
      default character set utf8
      collate utf8_general_ci`,
      function (error) {
        if (error) reject(error)
        connection.end()
        resolve()
      })
  })
}

export default db
