const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require: true
    },
    email:{type:String},
    mobile:{type:String},
    type:{
        type:Number,
        default:1
    },
    create_time:{
        type:Date,
        default:Date.now()
    },
    modify_time:{
        type:Date
    },
    is_delete:{
        type:Boolean,
        default: false
    },
    is_active:{
        type:Boolean,
        default: false
    }
},{versionKey:false})

module.exports = userModule = mongoose.model('user',userSchema)
