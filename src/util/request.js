// 封装请求方法
// 初始化axios对象实例
const instance = axios.create({
    // 接口地址根路径
    baseURL: 'http://localhost:5000',
    // 请求超时时间
    timeout: 1000
});

// GTE请求方法
let get = (url,params) => {
    return instance.get(url,{params})
}

// POST请求方法
let post = (url,params) => {
    return instance.post(url,params)
}

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});
