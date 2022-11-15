const userModule = require('../schema/user')
const jwt = require('jsonwebtoken')
const {secret,timeout} = require('../config/Token')
const {options, valid} = require("joi");

module.exports.login = ({body},res)=>{
    userModule.findOne({username: body.username}).then(value => {
        if(value.password === body.password){

            // 要放入JWT中的数据
            const payload ={}
            payload.username = value.username
            if (value.email) payload.email = value.email
            if (value.mobile) payload.mobile = value.mobile

            // JWT生成Token
            jwt.sign(payload,secret,{expiresIn:timeout},(err,token)=>{
                if(err) return res.status(500).json({msg:'Token生成失败'})
                res.status(200).json({
                    data:{
                        _id:value._id,
                        rid:value.type,
                        username:value.username,
                        mobile:payload.mobile,
                        email:payload.email,
                        token:'Bearer '+token
                    },
                    msg:'登陆成功'
                })
            })
        }else res.status(403).json({msg:'密码错误'})
    }).catch(reason => {
        res.status(403).json({msg:'用户名不存在'})
    })
}
module.exports.addUsers = ({body},res)=>{
    const user = {}
    user.username = body.username
    user.password = body.password
    if (body.email) user.email = body.email
    if (body.mobile) user.mobile = body.mobile
    userModule.findOne({username:body.username}).then(value=>{
        if(value) return res.status(403).json({msg:'用户名已存在'})
        new userModule(user).save().then(value => {
            console.log(value)
            res.status(200).json({data:value,msg:'添加成功'})
        }).catch(reason => {
            res.status(500).json({
                msg:'添加失败,请稍后重试',
                detail:reason.message
            })
        })
    }).catch(reason => {
        res.status(500).json({
            msg:'添加失败,请稍后重试',
            detail:reason.message
        })
    })

}
