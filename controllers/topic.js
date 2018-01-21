const db = require('./db')
const moment = require('moment')
const marked = require('marked')

exports.showCreate = (req, res) => {
	if(!req.session.user){
		return res.redirect('/signin')
	}

	db.query('SELECT * FROM `topic_categories`',(err,results) =>{
		if(err){
			return res.status(500).send('500 Server Interrnal Error')
		}
		 res.render('topic/create.html',{
  	      topicCategories:results,
  	      user:req.session.user
         })

	})

}

exports.showTopic = (req,res) => {
// console.log(req.query)
const {id} = req.query
db.query('SELECT * FROM `topics` WHERE `id` =?',[id],(err,results) =>{
	if(err){
		return res.status(500).send('500 Server Internal Error')

	}

   // console.log(results)
	const topic = results[0]
	if(topic){
		topic.content = marked(topic.content)
	}

	res.render('topic/show.html',{
		topic,
		user:req.session.user
	})
   })
	


}
exports.handleCreate = (req, res) => {
  // res.send('handleCreate')

  //1.获取表单提交数据
  //2.数据验证
 // 3. 持久化存储话题文章
 const body = req.body
 body.userId = req.session.user.id
 body.createdAt = moment().format('YYYY-MM-DD HH:mm:ss')
 body.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')
 db.query('INSERT INTO `topics` SET ? ',body,(err,ret) =>{
 	if(err){
 		return res.status(500).send('500 Serner Internal Error')

 	}
           // console.log(ret)
 	if(ret.affectedRows !==1){
     res.status(500).send('500 Serner Internal Error')
 	}
    res.status(200).json({
    	code:0,
    	message:'添加话题成功',
    	redirect:`/topic/show?id=${ret.insertId}`


    })

 })
}

exports.showEdit = (req, res) => {
	  // 1. 获取要编辑的话题 id
  // 2. 根据 id 查询该话题
  // 3. 查询话题分类
  // 4. 渲染编辑页面
  const {id} = req.query
  db.query('SELECT * FROM `topics` WHERE `id` =?',[id],(err,topics) =>{
  	if(err){
  	 return res.status(500).send('500 Server Internal Error')	
  	}

  	// console.log(topics)
  	db.query('SELECT * FROM `topic_categories`',(err,topicCategories)=>{
  		if(err){
  	    return res.status(500).send('500 Server Internal Error')	
     	}

     	// console.log(topicCategories)
     	res.render('topic/edit.html',{
     		topic:topics[0],
     		topicCategories

     	})
  	})
  })
 
}

exports.handleEdit = (req, res) => {
  // res.send('handleEdit')
   // 1. 获取 id 和 表单数据
  // 2. 根据 id 和表单提交数据更新到数据库
  // 3. 发送响应
  const {id}  =req.query
  const body = req.body
  // console.log(id)
  // console.log(body)

  body.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')
  db.query('UPDATE `topics` SET title=?,content=?,categoryId=?,updatedAt=? WHERE `id`=?',[
   body.title,
   body.content,
   body.categoryId,
   body.updatedAt,
   id

  	],(err,ret)=>{
  	  if(err){
  	    return res.status(500).send('500 Server Internal Error')	
     	}
      // console.log(ret)
      if(ret.affectedRows !==1){
      	return res.status(500).send('500 Server Internal Error')
      }

      res.status(200).json({
      	code:0,
      	message:'更新成功',
      	redirect:`/topic/show?id=${id}`
      })


  	})

}

exports.handleDelete = (req, res) => {
  // res.send('handleDelete')
  // 1. 获取要删除的 id
  // 2. 执行删除操作
  // 3. 删除成功跳转到首页
  const {id} = req.query
    // console.log(id)
  db.query('DELETE FROM `topics` WHERE `id`=?',[id],(err,ret)=>{

  	if(err){
  		return res.status(500).send('500 Serner Internal Error')
    	}

    	console.log(ret)
    	if(ret.affectedRows !==1){
    		    return res.status(500).send('500 Server Internal Error')
    	}

    	res.redirect('/')
  })
}
