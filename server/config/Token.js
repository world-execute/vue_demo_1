module.exports = token = {
    // 加密字符
    secret:'##$$##()',
    // Token超时时间
    timeout:'12h',
    // 加密算法
    algorithms:['HS256'],
    // 无token时不解析,抛出异常
    credentialsRequired: false,
    // unless路径
    path:[
        '/api/private/users/login'
    ]
}
