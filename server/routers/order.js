import koaRouter from 'koa-router'
import db from '../models'
import {applyAsyncData} from "../../.nuxt/utils";

const router = koaRouter()
const moment = require('moment');
moment.locale('zh-cn');

router.name = '/order'
export default router
// 查询店家所有订单
router.get('/list/:userId/:page', async ctx => {
    let list = await db.order.findAll({
        order: [
            ['date', 'DESC'],
            ['id', 'DESC'],
            [{model: db.order_item}, 'id']
        ],
        where: {
            userId: ctx.params.userId
        },
        include: {
            model: db.order_item,
            include: {
              model: db.keyword
            }
        },
        limit: 10,
        offset: parseInt(ctx.params.page-1)*10
    })
    let count = await db.order.count({
        where: {
            userId: ctx.params.userId
        }
    })
    ctx.body = {code: 0, data: list,count: count}
})
// 获取所有任务信息及库存
router.get('/listAll/:page', async ctx => {
    let list = await db.order.findAndCountAll({
        order: [
            ['date', 'ASC']
        ],
        where: {
            $or: [{
              date: moment().format('YYYY-MM-DD')
            },{
              date:moment().subtract(-1, 'days').format('YYYY-MM-DD'),
              special: 1
            }]
        },
        include: [{
            model: db.order_item,
            include: {
              model: db.keyword,
              include: {
                model: db.inventory,
                where: {
                  remaining_number: {$gt: 0}
                }
              }
            }
        }],
        limit: 10,
        offset: parseInt(ctx.params.page-1)*10
    })
    let count = await db.order.findAll({
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
                model: db.inventory,
                where: {
                  remaining_number: {$gt: 0}
                }
              }
            }
        }]
    })
    list.count = count.length
    ctx.body = {code: 0, data: list}
})

// 根据日期查询订单
// router.get('/list/:date/:page', async ctx => {
//   let list = await db.order.findAndCountAll({
//   	where: {
//   	  date: ctx.params.date
//   	},
//     limit: 20,
//     offset: parseInt(ctx.params.page)
//   })
//   ctx.body = {code: 0, data: list}
// })

// 添加新订单
router.post('/add/', async ctx => {
    let list = await db.order.create(ctx.request.body)
    ctx.body = {code: 0, data: list}
})
// 修改订单
router.put('/edit/:id', async ctx => {
    let list = await db.order.update(ctx.request.body, {
        where: {
            id: ctx.params.id
        }
    })
    ctx.body = {code: 0, data: list}
})
// 删除订单
router.delete('/delete/:id', async ctx => {
    let keyword = [];
    let data = await db.order_item.findAll({
        where: {
            orderId: ctx.params.id
        }
    })
    for (let key in data) {
      keyword[key] = await db.keyword.destroy({
        where: {
          orderItemId: data[key].id
        }
      })
    }
    data = await db.order_item.findAll({
      where: {
        orderId: ctx.params.id
      }
    });
    let list = await db.order.destroy({
        where: {
            id: ctx.params.id
        }
    });

    ctx.body = {code: 0, data: list}
})


// 批量添加订单项
router.post('/items/', async ctx => {
    let list = [];
    let keywords = [];
    let inventory = [];
    await ctx.request.body.forEach(async function (item,index){
      list[index] = await db.order_item.create(item)
      console.log("item:",item.keywords[0])
      console.log(list[index].id)
      for (let key in item.keywords) {
        item.keywords[key].orderItemId = list[index].id
        console.log("keywords:",item.keywords[key])
        keywords[key] = await db.keyword.create(item.keywords[key])
        let data = {
          keywordId: keywords[key].id,
          remaining_number: keywords[key].order_num
        }
        inventory[key] = await db.inventory.create(data)
      }
    });
    ctx.body = {code: 0, data: list,keywords: keywords, inventory: inventory}
})
// 添加订单项
router.post('/item/', async ctx => {
    let list = await db.order_item.create(ctx.request.body)
    ctx.body = {code: 0, data: list}
})
// 修改订单项
router.put('/item/:id', async ctx => {
  let list = await db.order_item.update(ctx.request.body, {
    where: {
      id: ctx.params.id
    }
  })
  ctx.body = {code: 0, data: list}
})
// 删除订单项
router.delete('/item/:id', async ctx => {
    let keyword = await db.keyword.destroy({
      where: {
        orderItemId: ctx.params.id
      }
    })
    let list = await db.order_item.destroy({
        where: {
            id: ctx.params.id
        }
    })
    ctx.body = {code: 0, data: list, keyword: keyword}
})

// 修改关键词
router.put('/keyword/:id', async ctx => {
  let keyword = await db.keyword.find({
    where: {
      id: ctx.params.id
    }
  })
  let inventory = await db.inventory.find({
    where: {
      keywordId: ctx.params.id
    }
  })
  let modify = keyword.order_num - ctx.request.body.order_num
  inventory.remaining_number -= modify
  if (inventory.remaining_number >= 0) {
    let list = await db.keyword.update(ctx.request.body, {
      where: {
        id: ctx.params.id
      }
    })
    await inventory.save()
    ctx.body = {code: 0, data: list, inventory: inventory}
  } else {
    ctx.body = {code: 701, message: "修改失败，可能余量不足", inventory: inventory}
  }
})
// 添加关键词
router.post('/keyword/', async ctx => {
  let list = await db.keyword.create(ctx.request.body)
  ctx.request.body.keywordId = list.id
  ctx.request.body.remaining_number = list.order_num
  let inventory = await db.inventory.create(ctx.request.body)
  ctx.body = {code: 0, data: list, inventory: inventory}
})
// 删除关键词
router.delete('/keyword/:id', async ctx => {
  let inventory = await db.inventory.find({
    where: {
      keywordId: ctx.params.id
    }
  })
  let list = await db.keyword.find({
    where: {
      id: ctx.params.id
    }
  })
  if (inventory.remaining_number == list.order_num) {
    await inventory.destroy()
    await list.destroy()
    ctx.body = {code: 0, data: list, inventory: inventory}
  } else {
    ctx.body = {code: 701, message: "删除失败，可能已有订单进行", inventory: inventory}
  }
})
// 复制添加新订单
router.post('/copy/:orderId', async ctx => {
  //复制订单
  let order = await db.order.find({
    where: {
        id: ctx.params.orderId
    }
  })
  let newOrder = {}
  newOrder.name = order.name
  newOrder.shopname = order.shopname
  newOrder.image = order.image
  newOrder.special = order.special
  newOrder.remarks = order.remarks
  newOrder.date = moment().subtract(-1, 'days').format('YYYY-MM-DD')
  newOrder.userId = order.userId
  order = await db.order.create(newOrder)
  // 复制订单项
  let order_item = await db.order_item.findAll({
    where: {
      orderId: ctx.params.orderId
    }
  })
  let list = [];
  let newOrderItem = {};
  for (let key in order_item) {
    newOrderItem.sku = order_item[key].sku
    newOrderItem.principal = order_item[key].principal
    newOrderItem.commission = order_item[key].commission
    newOrderItem.image = order_item[key].image
    newOrderItem.remarks = order_item[key].remarks
    newOrderItem.orderId = order.id
    list[key] = await db.order_item.create(newOrderItem)
    // 复制关键词
    let keywords = await db.keyword.findAll({
      where: {
        orderItemId: order_item[key].id
      }
    })
    for (let index in keywords) {
      let keyword = {
        keyword: keywords[index].keyword,
        order_num: keywords[index].order_num,
        number: keywords[index].number,
        orderItemId: list[key].id
      }
      let newKeywords = await db.keyword.create(keyword)
      // 复制库存
      keyword.keywordId = newKeywords.id
      keyword.remaining_number = newKeywords.order_num
      let inventory = {};
      inventory = await db.inventory.create(keyword)
    }
  }
  let data = await db.order.find({
    order: [
      ['date', 'DESC'],
      [{model: db.order_item}, 'id']
    ],
    where: {
      id: order.id
    },
    include: {
      model: db.order_item,
      include: {
        model: db.keyword
      }
    }
  })
  ctx.body = {code: 0, data: data}
})

