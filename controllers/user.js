const db = require('./db')
const md5 = require('md5')
const moment = require('moment')
const {secret} = require('../config')


exports.showSignin = (req, res) => {
  res.render('signin.html')
}

exports.handleSignin = (req, res) => {
  // res.send('handleSignin')
  // 1 获取表单数据
  // 2 数据效验
  // 3 效验成功，保持登录状态，发送响应
  const body = req.body
  db.query('SELECT * FROM `users` WHERE `email`=?',[body.email],(err,results) =>{
    if(err){
      return res.status(500).send(`Server Internal Error:${err.message}`)
    }

    //如果没有数据则results会返回一个空数组
    // console.log(results) //  []
    const user = results[0]
    // console.log(user)

    if(!user){
      return res.status(200).json({
        code :1,
        message:'用户不存在'        

      })
    }

     // 校验密码
    body.password = md5(`${md5(body.password)}${secret}`)
    if (body.password !== user.password) {
      return res.status(200).json({
        code: 2,
        message: '密码错误'
      })
    }

    // 校验通过，保持登陆状态
    req.session.user = user

    // 发送相应，告诉客户端登陆成功了
    res.status(200).json({
      code: 0,
      message: '登陆成功'
    })

  })
}

exports.showSignup = (req, res) => {
  res.render('signup.html')
}

exports.handleSignup = (req, res) => {
  // res.send('handleSignup')
  //1 获取表单提交的post 请求体数据
  //2 数据效验 普通数据格式效验
      // 业务数据效验
  // 3 效验通过，持久化存储用户注册的数据
  // 4 通知客户端，注册成功

  // console.log(req.body) 
 const body = req.body
 db.query('SELECT * FROM `users` WHERE `email`=?',[body.email],(err,results) =>{
   if(err){
   	 return res.status(500).send(`Server Internal Error:${err.message}`)//变量拼接

   }
   // console.log(results)
   //如果数组中有一个元素，则说明邮箱已存在
   if(results[0]){
   	// res.json 方法会接受一个对象 该方法会把对象转成json格式的字符串然后发送给客户端
   	return res.status(200).json({
   		code:1,
   		message:'邮箱已存在'
   	})

   }

   db.query('SELECT * FROM `users` WHERE `nickname` =?',[body.nickname],(err,results) =>{
   	if(err){
   			 return res.status(500).send(`Server Internal Error:${err.message}`)
   	}
   	if(results[0]){
   		return res.status(200).json({
   			code:2,
   			message:'昵称已存在'
   		})
   	}

   	//数据效验成功，然后就可以真正的持久化存储用户信息了
   	//加密 md5
   	// 添加创建时间和更新时间 moment 
   	body.password = md5(`${md5(body.password)}${secret}`)
   	body.createdAt = moment().format('YYYY-MM-DD HH:mm:ss')
    body.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')

    db.query('INSERT INTO `users` SET ?',body,(err,ret) =>{
    	if(err){
    	 return res.status(500).send(`Server Internal Error:${err.message}`)
    	}
        // console.log(ret)
        if(ret.affectedRows !==1){
        	return res.status(500).send('注册失败')
        }

    //     res.status(200).json({
   	// 	code:1,
   	// 	message:'注册成功'
   	// })
  // 我们接下来要为注册保持登录状态
  //利用 Session 来保持登录状态
  //为了方便 我们在其他业务中使用用户 id  所以这里直接就把用户 id 也存储到了 Session 数据中了
    // req.session.loge = true 
    body.id = ret.insertId

    req.session.user = body

    res.status(200).json({
      code:0,
      message:'注册成功'
    })


    })

   })


 })



}

exports.handleSignout = (req, res) => {
  // res.send('handleSignout')
  //1 清除session 登录状态
  // 2 跳到登录页
  delete req.session.user
  res.redirect('/signin')
}
