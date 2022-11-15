const joi = require("joi");
const getErrMessage = require('../config/joiMsg')

const username = joi.string().min(2).max(10).required()
    .messages(getErrMessage('用户名'))
const password = joi.string().min(6).max(15).alphanum()
    .required().messages(getErrMessage('密码'))
const email = joi.string().email().messages(getErrMessage('邮箱'))

module.exports.joiSchema_forLogin = {
    body:{
        username,
        password
    }
}
