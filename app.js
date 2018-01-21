  const express = require('express')

  const router = require('./router')

  const {port,secret}= require('./config.js')//  .js 可以省咯

  // console.log({port})   // {port:3000}
   // {port}  解构赋值

   const bodyParser = require('body-parser')
   const session = require('express-session')
  

  const app = express()
  
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use('/node_modules/',express.static('./node_modules'))
  app.use('/public/',express.static('./publich'))
  app.engine('html', require('express-art-template'))


 // 配置 Session 插件
// 参考文档：https://github.com/expressjs/session
// 使用 Session
//   写 Session
//     req.session.xxx = xxx
//   取 Session
//     req.session.xxx
  app.use(session({
    secret, // 解构赋值 私钥
    resave:false,
    saveUninitialized: true // 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
  }))



  app.use(router)



 // app.get('/',(req,res) =>{
 //       res.send('hello world')
 // })

 app.listen(port,() => {
 	// console.log('runing...')
   console.log(	`Sever is runing at port ${port}`)

   console.log(`Please visit http://localhost:${port}`)

 })


 

