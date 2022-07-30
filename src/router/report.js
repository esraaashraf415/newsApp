const express = require('express')
const router = express.Router()
const Report = require('../models/report')
 const auth = require('../middleware/auth')
const multer = require("multer")
router.post('/signup',async(req,res)=>{
    try{
      const reporter = new Report(req.body)
       const token =  await reporter.generateToken()
         await reporter.save()
  res.status(200).send({reporter,token})
  
    }
    catch(e){
        res.status(400).send(e.message)
    }
  })
  
router.post('/login',async(req,res)=>{
    
  try{
    const reporter = await  Report.findByCredentials(req.body.email,req.body.password)
      const token =  await reporter.generateToken()

    res.status(200).send({reporter,token})

  }
   
  catch(e){
      res.status(400).send(e.message)
  }
    
})
router.get('/profile',auth,async(req,res)=>{
  res.status(200).send(req.reporter)
})
// router.patch('/update',auth,async(req,res)=>{
//   try{
//         //   const token = req.params.tokens

//     //    const updates = Object.keys(req.body)
     
//     //   const allowedUpdates = ['name','email']
     
//     //   const isValid = updates.every((el)=>allowedUpdates.includes(el))
   

//     //  if(!isValid){
//     //       return res.status(400).send("Can't update")
//     //   }
//       const reporter = await Report.findOneAndUpdate(req.reporter,req.body,{
//           new:true,
//           runValidators:true
//       })
//       // console.log(req.reporter)
//       if(!reporter){
//           return res.status(404).send('No user is found')
//       }
//       res.status(200).send(reporter)
//   }
//   catch(e){
//       res.status(400).send(e)
//   }
// })

// router.delete('/delete',auth,async(req,res)=>{
//   try{

//       const reporter = await Report.findOneAndDelete(req.params.tokens)
      

//       if(!reporter){
//           return res.status(404).send('unable to find data')
//       }
//       res.status(200).send(user)
//   }

//       catch(e){
//           res.status(500).send(e)
//       }
//   })
  const uploads= multer({
    limits:{
        fileSize:1000000  
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg|jfif)$/)){
            return cb (new Error('Please upload an image'))
        }
        cb(null,true)
    }
})
router.post('/profileImage',auth,uploads.single('image'),async(req,res)=>{
    try{
        req.reporter.avatar = req.file.buffer
        await req.reporter.save()
        res.send()
    }
    catch(e){
        res.status(400).send(e.message)
    }
})
module.exports = router