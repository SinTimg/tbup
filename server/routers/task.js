import koaRouter from 'koa-router'
import db from '../models'
const moment = require('moment');
const xlsx = require('node-xlsx');

const router = koaRouter()
moment.locale('zh-cn');

router.name = '/order'
export default router
// 查询会员所有任务
router.get('/list/:userId/:page', async ctx => {
    let list = await db.task.findAndCountAll({
        where: {
            userId: ctx.params.userId
        },
        include: [{
           model: db.keyword,
          include: {
            model: db.order_item,
            include: {
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
              model: db.order
            }
          }
        },{
            model: db.complete
        }],
        limit: 10,
        offset: parseInt(ctx.params.page-1)*10
    })
    let count = await db.task.count({
        where: {
            userId: ctx.params.userId
        },
        include: {
          model: db.keyword,
          include: {
            model: db.order_item,
            include: {
              order: [
                ['date', 'DESC']
              ],
              where: {
                date: moment().format('YYYY-MM-DD')
              },
              model: db.order
            }
          }
        }
    })
    list.count = count
    ctx.body = {code: 0, data: list}
})

// 获取任务信息及库存
router.get('/getInventory/:id', async ctx => {
    let list = await db.keyword.findOne({
        where: {
            id: ctx.params.id
        },
        include: [{
            model: db.order_item
        },{
            model: db.inventory
        }]
    })
    ctx.body = {code: 0, data: list}
})
// 添加任务
router.put('/add/', async ctx => {
    let task = await db.task.findOne({
        where: {
          keywordId: ctx.request.body.keywordId,
          userId: ctx.request.body.userId
        }
    })
    let inventory = await db.inventory.findOne({
        where:{
          keywordId: ctx.request.body.keywordId
        }
    })
    inventory.remaining_number = inventory.remaining_number - ctx.request.body.total_num
    if (inventory.remaining_number>=0) {
        inventory.save()
        if (task) {
            task.total_num = task.total_num + ctx.request.body.total_num
            task.save()
        } else {
            task = await db.task.create(ctx.request.body)
        }
        ctx.body = {code: 0, data: task, inventory:inventory}
    } else {
        inventory.remaining_number = inventory.remaining_number+ctx.request.body.total_num
        ctx.body = {code: 701, message: "修改失败，可能余量不足", inventory: inventory}
    }
})

// 更新任务
router.put('/update/:id', async ctx => {
    let inventory = await db.inventory.findOne({
        where:{
          keywordId: ctx.request.body.keywordId
        }
    })
    inventory.remaining_number = inventory.remaining_number - ctx.request.body.modifyNum
    if (inventory.remaining_number>=0) {
        inventory.save()
        let task = await db.task.update(ctx.request.body,{
            where: {
                id: ctx.params.id,
            }
        })
        ctx.body = {code: 0, data: task, inventory:inventory}
    } else {
        inventory.remaining_number = inventory.remaining_number+ctx.request.body.total_num
        ctx.body = {code: 701, message: "修改失败，可能余量不足", inventory: inventory}
    }

})

// 更新任务完成数据
router.post('/complete/update/:id', async ctx => {
    let complete = await db.complete.findAll({
        where:{
            taskId: ctx.params.id
        }
    })
    if (!complete.length)  {
        complete = await db.complete.bulkCreate(ctx.request.body)
    } else {
        console.log(ctx.request.body.length)
        if (ctx.request.body.length < complete.length) {
            for (let i = 0; i < complete.length-ctx.request.body.length; i++) {
                await complete[i].destroy()
                complete.splice(i,1)
            }
        }
        for (let i = 0; i < ctx.request.body.length ;i++) {
            if (!complete[i]) {
                complete[i] = db.complete.build({
                    tb_name: ctx.request.body[i].tb_name,
                    order_number: ctx.request.body[i].order_number,
                    taskId: ctx.request.body[i].taskId
                })
            } else {
                complete[i].tb_name = ctx.request.body[i].tb_name
                complete[i].order_number = ctx.request.body[i].order_number
            }
            complete[i].save();
        }
    }
    let task = await db.task.update({complete_number:ctx.request.body.length},{
        where: {
            id: ctx.params.id
        }
    })
    ctx.body = {code: 0, data: complete, task:task}
})

// 获取任务完成信息
router.get('/complete/:taskId', async ctx => {
    let task = await db.task.find({
        where:{
            id: ctx.params.taskId
        },
        include: [{
          model: db.keyword,
          include: {
            model: db.order_item,
          }
        },{
          model: db.complete
        }]
    })
    ctx.body = {code: 0, data: task}
})

// 添加任务完成信息
router.post('/complete/:taskId', async ctx => {
    let task = await db.task.find({
        where: {
            id: ctx.params.taskId
        }
    })
    let keyword = await db.keyword.find({
        where: {
            id: task.keywordId
        },
        include: {
          model: db.order_item
        }
    })
    let complete = [];
    for (let i = 0; i < ctx.request.body.length ;i++) {
        ctx.request.body[i].price = keyword.number * keyword.order_item.principal
        ctx.request.body[i].price_difference = ctx.request.body[i].price - ctx.request.body[i].payment
        ctx.request.body[i].orderItemId = keyword.order_item.id
        ctx.request.body[i].taskId = task.id
        complete[i] = await db.complete.create(ctx.request.body[i])
    }
    // let complete = await db.complete.bulkCreate(ctx.request.body)
    task.complete_number = task.complete_number + ctx.request.body.length
    task.save();

    ctx.body = {code: 0, data: complete, task:task}
})

// 更新任务完成信息
router.put('/complete/:id', async ctx => {
    let complete = await db.complete.update(ctx.request.body,{
        where: {
            id: ctx.params.id
        }
    })
    ctx.body = {code: 0, data: complete}
})

// 删除任务完成信息
router.delete('/complete/:id', async ctx => {
  try {
    let complete = await db.complete.find({
      where: {
        id: ctx.params.id
      }
    })
    let task = await db.task.find({
      where: {
        id: complete.taskId
      }
    })
    task.complete_number--
    task.save();
    complete.destroy();
    ctx.body = {code: 0, data: complete, task:task}
  } catch (e) {
    ctx.body = {code: 700, data: e}
  }

})

// 获取历史完成数据
router.get('/history/:userId/:page', async ctx => {
    let list = await db.task.findAndCountAll({
        order: [
            ['createdAt', 'DESC']
        ],
        where: {
            userId: ctx.params.userId
        },
        include: [{
            model: db.keyword,
            include: {
              model: db.order_item,
              include: {
                where: {
                  date: { $lt : moment().format('YYYY-MM-DD')}
                },
                model: db.order
              }
            }
        },{
            model: db.complete
        }],
        limit: 10,
        offset: parseInt(ctx.params.page-1)*10
    })
    ctx.body = {code: 0, data: list}
})

// 导出Excel
router.post('/excel/:userId', async (ctx) => {
  try {
    let headers = ["店铺名","关键词", "订单数量", "每单购买数量", "sku", "本金", "佣金", "备注1", "备注2"];
    let data = await db.task.findAll({
      where: {
        userId: ctx.params.userId
      },
      include: {
        model: db.keyword,
        include: {
          model: db.order_item,
          include: {
            order: [
              ['date', 'DESC']
            ],
            where: {
              date: moment().format('YYYY-MM-DD')
            },
            model: db.order
          }
        }
      }
    })

    let rows = [];
    // 添加表头
    rows.push(headers)
    // 添加数据
    for (let key in data) {
      let row = []
      row.push(data[key].keyword.order_item.order.shopname)
      row.push(data[key].keyword.keyword)
      row.push(data[key].total_num)
      row.push(data[key].keyword.number)
      row.push(data[key].keyword.order_item.sku)
      row.push(data[key].keyword.order_item.principal)
      row.push(data[key].keyword.order_item.commission)
      row.push(data[key].keyword.order_item.order.remarks)
      row.push(data[key].keyword.order_item.remarks)
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