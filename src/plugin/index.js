// 注册element-ui 组件库
import Vue from "vue";
// 全部导入
// import ElementUI from 'element-ui';
// 按需导入
import {Button,Form,FormItem,Input,Message} from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message

// 导入字体图标
import '../assets/fonts/iconfont.css'

