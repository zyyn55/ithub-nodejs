
const db = require('./db')

exports.showIndex = (req,res) => {
	// console.log(req.session.loge)
	db.query('select * from `topic_categories`',(err,  topicCategories) =>{
       if(err){
       	return res.send('500 Sever Internal Error')
       }

       // console.log(results)

       db.query('SELECT * FROM `topics` ORDER BY `createdAt` DESC',(err,topics) =>{
              res.render('index.html',{
              topicCategories,
              topics,
              user:req.session.user

           })



         })
      

	})
}




