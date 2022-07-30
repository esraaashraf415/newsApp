const mongoose = require('mongoose')

const newSchema = mongoose.Schema({
    desc:{
        type:String,
        required:true,
        trim:true ,
        minLength:10,
        timestamps:true

    },
    title:{
        type:String,
        required:true,
        trim:true,
        timestamps:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'reporter'  
    },
    avatar:{
        type:Buffer
    }
})
newSchema.methods.toJSON = function(){
    
    const news = this

    const newObject = news.toObject()
    return newObject

}
const New = mongoose.model('New',newSchema)
  
    
  

module.exports = New