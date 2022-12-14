const jwt = require('jsonwebtoken')
const Report = require('../models/report')
const auth = async(req,res,next) =>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decode = jwt.verify(token,'nodecourse')
        const reporter = await Report.findOne({_id:decode._id,tokens:token})
        if(!reporter){
            throw new Error()
        }
        req.reporter = reporter

        next()
    }
    catch(e){
        res.status(401).send({error:'Please authenticate'})
    }

}



module.exports = auth