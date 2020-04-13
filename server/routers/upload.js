/* eslint-disable no-eval */
import koaRouter from 'koa-router'
import asyncBusboy from 'async-busboy'
import path from 'path'
import fs from 'fs'
import uuid from 'uuid'
const gm = require('gm').subClass({imageMagick: true})

// import sharp from 'sharp'
const execFile = require('child_process').execFile
const router = koaRouter()
router.name = '/upload'

const env = process.env.NODE_ENV || 'development'


router.post('/image', async ctx => {
  const {files} = await asyncBusboy(ctx.req)
  if (!(/(.jpg|.png|.jpeg)$/.test(files[0].filename.toLowerCase()))) {
    ctx.body = {code: 1, message: '仅支持.jpg|.png|.jpeg格式'}
  } else {
    let uploadPath = path.join(__dirname, '../..', '/static/upload/')
    let fileName = uuid.v4() + files[0].filename.substr(files[0].filename.lastIndexOf('.'))
    // let resizer = sharp()
    //   .resize(200, 200)
    //   .png()
    files[0].pipe(fs.createWriteStream(
      uploadPath + fileName
    ))
    gm(files[0]).resize('200', '200').write(uploadPath + 'min/' + fileName, (err) => {
      if (err) {
        console.log(err)
      }
    })
    ctx.body = {code: 0, data: fileName}
  }
})



export default router
