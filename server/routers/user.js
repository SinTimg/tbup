import koaRouter from 'koa-router'
import db from '../models'

const router = koaRouter()
const crypto = require('crypto')

router.post('/login', async (ctx) => {
  if (ctx.session.user && ctx.session.user.role==0) {
    ctx.body = {code: 707, message: '已经处于登录状态，无法再次登录'}
    return
  }
  try {
    let hash = crypto.createHash('md5')
    hash.update(ctx.request.body.password)
    let user = await db.user.findAll({
      attributes: ['username', 'id', 'role', 'name'],
      where: {
        username: ctx.request.body.username,
        password: hash.digest('hex'),
        role: 0,
        status: 1
      }
    })
    if (user.length > 0) {
      ctx.session.user = user[0]
      ctx.body = {code: 0, data: user[0]}
    } else {
      ctx.body = {code: 701, message: '登录失败，账号或密码错误'}
    }
  } catch (e) {
    ctx.body = {code: 700, message: e.toString()}
  }
})

router.post('/reset', async (ctx) => {
  let hash = crypto.createHash('md5')
  hash.update(ctx.request.body.password)
  try {
    let user = await db.user.findAll({
      attributes: ['username'],
      where: {
        username: ctx.request.body.username,
        password: hash.digest('hex'),
        role: 0,
        status: 1
      }
    })
    if (user.length > 0) {
      hash = crypto.createHash('md5')
      hash.update(ctx.request.body.newPassword)
      ctx.request.body.password = hash.digest('hex')
      let data = await db.user.update(ctx.request.body, {
        where: {
          username: ctx.request.body.username,
          role: 0
        }
      })
      ctx.body = {code: 0, data: user[0]}
      // ctx.body = {code: 0, data: data}
    } else {
      ctx.body = {code: 701, message: '重置失败，账号或密码错误'}
    }
  } catch (e) {
    ctx.body = {code: 700, message: e.toString()}
  }
})
router.post('/checkLogin', ctx => {
  if (ctx.session.user) {
    ctx.body = {code: 0, data: ctx.session.user}
  } else {
    ctx.body = {code: 400}
  }
})

router.post('/logout', (ctx) => {
  ctx.session = null
  ctx.body = {code: 0, message: '退出登录成功'}
})

router.post('/ ', ctx => {
  if (ctx.session.user) {
    ctx.body = {code: 0, data: ctx.session.user}
  } else {
    ctx.body = {code: 400}
  }
})

router.post('/decode', ctx => {
  let hash = crypto.createHash('md5')
  hash.update(ctx.request.body.text)
  let data = hash.digest('hex')
  ctx.body = {data: data}
})

export default router
