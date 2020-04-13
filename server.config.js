module.exports = {
  development: {
    username: 'root',
    password: '654321',
    database: 'tbup',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  test: {
    dialect: 'sqlite',
    storage: 'memory'
  },
  production: {
    username: 'root',
    password: 'tbup2018',
    database: 'tbup',
    host: '127.0.0.1',
    dialect: 'mysql'
  }
}
