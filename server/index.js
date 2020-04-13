import Koa from 'koa'
import { Nuxt, Builder } from 'nuxt'
import bodyParser from 'koa-bodyparser'
import compress from 'koa-compress'
import cors from 'koa-cors'
import routers from './routers'
import models from './models'
import session from 'koa-session-minimal'
import SequelizeStore from 'koa-generic-session-sequelize'
import Sequelize from 'sequelize'
import path from 'path'

var staticCache = require('koa-static-cache')

const app = new Koa()
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

app.use(cors({
  origin: '*'
}))
app.use(compress({
  filter: function (content_type) {
    return /text/i.test(content_type)
  },
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}))

app.use(async (ctx, next) => {
    if (ctx.path.includes('upload')) {
        ctx.compress = true
        await next()
    } else {
        await next()
    }
})

app.use(staticCache(path.join(__dirname, '..', 'static'), {
    maxAge: 365 * 24 * 60 * 60
}))

app.use(session({
  store: new SequelizeStore(
    models.sequelize,            // pass your sequelize object as the first arg
    {}                    // pass any config options for sequelizeStore as the second arg (see below)
  )
}))

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    if (e instanceof Sequelize.ValidationError) {
      if (e instanceof Sequelize.UniqueConstraintError) {
        ctx.body = {code: 1, message: e.message}
      } else {
        let error = ''
        for (let err of e.errors) {
          error += err.message + '\n'
        }
        ctx.body = {code: 1, message: error}
      }
    } else {
      ctx.body = {code: 1, message: e.message}
    }
  }
})
app.use(bodyParser())

async function start () {
  let config = require('../nuxt.config.js')
  config.dev = !(app.env === 'production')
  const nuxt = await new Nuxt(config)
  if (config.dev) {
    try {
      const builder = new Builder(nuxt)
      await builder.build()
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  }

  routers(app)
  app.use(async (ctx) => {
    ctx.status = 200 // koa defaults to 404 when it sees that status is unset
    ctx.req.session = ctx.session
    ctx.respond = false // Mark request as handled for Koa
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    await nuxt.render(ctx.req, ctx.res)
  })
  await models.init()
  models.sequelize.sync().then(function () {
    app.listen(port, host)
    console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
  })
}

start()
