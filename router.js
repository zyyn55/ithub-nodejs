// 根据不同的请求方法 + 请求路径分发到具体的模块处理函数



const indexCtrl = require('./controllers/index')

const userCtrl = require('./controllers/user')

const topicCtrl = require('./controllers/topic')

//引入express
const express = require('express')

  // 创建路由
  const router = express.Router()



  // 2配置路由列表


 //首页
  router
  .get('/',indexCtrl.showIndex)

  // 用户模块

  router
  .get('/signin',userCtrl.showSignin)
  .post('/signin',userCtrl.handleSignin)
  .get('/signup',userCtrl.showSignup)
  .post('/signup',userCtrl.handleSignup)
  .get('/signout',userCtrl.handleSignout)

  //话题模块

 router
 .get('/topic/create',topicCtrl.showCreate)
 .post('/topic/create',topicCtrl.handleCreate)
 .get('/topic/show',topicCtrl.showTopic)
 .get('/topic/edit',topicCtrl.showEdit)
 .post('/topic/edit',topicCtrl.handleEdit)
 .get('/topic/delete',topicCtrl.handleDelete)



 // 在应用程序app.js中使用 app.use(router)挂载路由器对象


 module.exports = router

