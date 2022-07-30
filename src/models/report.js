const mongoose = require('mongoose')
// const  Validate  = require('validate');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const reportSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true 
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true ,
        // validate(value){
        //     if(!Validate.isEmail(value)){
        //         throw new Error (' email is invalid')

        //     }
        // }
    },
    age:{
        type:Number,
        default:20,
        validate(value){
            if(value <0){
                throw new Error (' age is wrong')

            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:6,
        validate(value){
            let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
           if(!strongRegex.test(value)){
            throw new Error (' password must be strong')

           }
        }
        
    },
    phone:{
        type:Number,
      
        trim:true,
        validate(value){
            let phoneRegex = new RegExp("^01[0125][0-9]{8}$");
           if(!phoneRegex.test(value)){
            throw new Error (' phone number is wrong')

           }
        }
    },
   
    tokens:[
        {
            type:String,
            required:true
        }
    ],
    avatar:{
        type:Buffer
    },
  


})
reportSchema.virtual('news',{
    ref:'New',
    localField:'_id',
    foreignField:'owner'
})
reportSchema.pre('save', async function(){
    const reporter = this
    if(reporter.isModified('password'))
    reporter.password = await bcryptjs.hash(reporter.password,8)
})
reportSchema.statics.findByCredentials = async(email,password)=>{
    const reporter = await Report.findOne({email})
    // console.log(reporter)
    if(!reporter){
        throw new Error('please sheck  email')
    }
    const isMatch = await bcryptjs.compare(password, reporter.password)
    if(!isMatch){
        throw new Error('please sheck password')
    }
    return reporter
}
reportSchema.methods.generateToken = async function(){
    const reporter = this
    const token = jwt.sign({_id:reporter._id.toString()},'nodecourse')
    reporter.tokens = reporter.tokens.concat(token)
    await reporter.save()
    return token
}

reportSchema.methods.toJSON = function(){
    const reporter = this

    const reportObject = reporter.toObject()

    delete reportObject.password
    delete reportObject.tokens

    return reportObject

}
const Report = mongoose.model('reporter',reportSchema)
module.exports = Report