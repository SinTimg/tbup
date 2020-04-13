import koaRouter from 'koa-router'
import db from '../models'

const router = koaRouter()
const crypto = require('crypto')
const moment = require('moment');
const xlsx = require('node-xlsx');

moment.locale('zh-cn');
router.name = '/manager'
export default router

// 获取当天所有任务信息及库存
router.get('/listAll/:page', async ctx => {
  let list = await db.order.findAndCountAll({
    order: [
      ['date', 'DESC']
    ],
    where: {
      date: moment().format('YYYY-MM-DD')
    },
    include: [{
      model: db.order_item,
      include: {
        model: db.keyword,
        include: {
          model: db.inventory
        }
      }
    },{
      model: db.user
    }],
    limit: 10,
    offset: parseInt(ctx.params.page - 1) * 10
  })
  let count = await db.order.count({
    where: {
      date: moment().format('YYYY-MM-DD')
    }
  })
  list.count = count
  ctx.body = {code: 0, data: list}
})

// 获取历史订单信息
router.get('/history/:page', async ctx => {
  let list = await db.order.findAndCountAll({
    order: [
      ['date', 'DESC']
    ],
    where: {
      date:{$ne:moment().format('YYYY-MM-DD')}
    },
    include: [{
      model: db.order_item,
      include: {
        model: db.keyword,
        include: {
          model: db.inventory
        }
      }
    }],
    limit: 10,
    offset: parseInt(ctx.params.page - 1) * 10
  })
  let count = await db.order.count({
    where: {
      date:{$ne:moment().format('YYYY-MM-DD')}
    }
  })
  list.count = count
  ctx.body = {code: 0, data: list}
})

// 查看任务接受情况
router.get('/listTaskList/:id', async ctx => {
  let list = await db.keyword.find({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      id: ctx.params.id
    },
    include: [{
      model: db.order_item,
      include: {
        model: db.order
      }
    },{
      model: db.inventory
    }, {
      model: db.task,
      include: [{
        model: db.user
      }, {
        model: db.complete
      }]
    }]
  })
  ctx.body = {code: 0, data: list}
})

// 查看所有账号信息
router.get('/listUser', async ctx => {
  let member = await db.user.findAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      role: 1,
      status: 1
    }
  })
  let shop = await db.user.findAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      role: 0,
      status: 1
    }
  })
  ctx.body = {code: 0, member: member, shop: shop}
})

// 查看所有会员账号信息
router.get('/listMember', async ctx => {
  let list = await db.user.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      role: 1
    }
  })
  ctx.body = {code: 0, data: list}
})

// 查看所有商家账号信息
router.get('/listShop', async ctx => {
  let list = await db.user.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      role: 0
    }
  })
  ctx.body = {code: 0, data: list}
})

// 添加新用户
router.post('/user', async (ctx) => {
  let hash = crypto.createHash('md5')
  hash.update(ctx.request.body.password)
  try {
    ctx.request.body.password = hash.digest('hex')
    let data = await db.user.create(ctx.request.body)
    ctx.body = {code: 0, data: data}
  } catch (e) {
    ctx.body = {code: 700, message: e.toString()}
  }
})

// 修改用户信息
router.put('/user/:id', async (ctx) => {
  try {
    console.log(ctx.request.body)
    if (!ctx.request.body.password) {
      delete ctx.request.body.password
      console.log(ctx.request.body)
    } else {
      let hash = crypto.createHash('md5')
      hash.update(ctx.request.body.password)
      ctx.request.body.password = hash.digest('hex')
    }

    let data = await db.user.update(ctx.request.body, {
      where: {
        id: ctx.params.id
      }
    })
    ctx.body = {code: 0, data: data}
  } catch (e) {
    ctx.body = {code: 700, message: e.toString()}
  }
})

// 删除用户
router.delete('/user/:id', async (ctx) => {
  try {
    let data = await db.user.update({status: 0}, {
      where: {
        id: ctx.params.id
      }
    })
    ctx.body = {code: 0, data: data}
  } catch (e) {
    ctx.body = {code: 700, message: e.toString()}
  }
})

// 导出Excel
router.post('/excel', async (ctx) => {
  try {
    let headers = ["店铺名", "sku", "关键词", "本金", "佣金", "旺旺号", "收货人","付款价格", "总价格", "差价", "任务人"];
    let data = await db.complete.findAll({
      include: [{
        model: db.order_item,
        include: {
          where: {
            date: moment().format('YYYY-MM-DD')
          },
          model: db.order
        }
      }, {
        model: db.task,
        include: [{
          model: db.user
        },{
          model: db.keyword
        }]
      }]
    })

    let rows = [];
    // 添加表头
    rows.push(headers)
    // 添加数据
    for (let key in data) {
      let row = []
      row.push(data[key].order_item.order.shopname)
      row.push(data[key].order_item.sku)
      row.push(data[key].task.keyword.keyword)
      row.push(data[key].order_item.principal)
      row.push(data[key].order_item.commission)
      row.push(data[key].tb_name)
      row.push(data[key].consignee)
      row.push(data[key].payment)
      row.push(data[key].price)
      row.push(data[key].price_difference)
      row.push(data[key].task.user.name)
      rows.push(row)
    }

    let buffer = xlsx.build([{name: "sheet1", data: rows}]); // Returns a buffer
    ctx.set('Content-Type', 'application/vnd.openxmlformats');
    ctx.set("Content-Disposition", "attachment; filename=" + "Report.xlsx");
    ctx.body = buffer
  } catch (e) {
    ctx.body = {code: 700, message: e.toString()}
  }
})
