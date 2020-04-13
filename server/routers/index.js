import koaRouter from 'koa-router'
import order from './order'
import upload from './upload'
import user from './user'
import task from './task'
import member from './member'
import admin from './admin'
import manager from './manager'

const router = koaRouter()

export default function (app) {
  router.use('/order', order.routes(), order.allowedMethods())
  router.use('/upload', upload.routes(), upload.allowedMethods())
  router.use('/user', user.routes(), user.allowedMethods())
  router.use('/task', task.routes(), task.allowedMethods())
  router.use('/member', member.routes(), member.allowedMethods())
  router.use('/admin', admin.routes(), admin.allowedMethods())
  router.use('/manager', manager.routes(), manager.allowedMethods())
  app.use(router.routes(), router.allowedMethods())
}
