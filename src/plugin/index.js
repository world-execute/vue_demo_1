// 注册element-ui 组件库
import Vue from "vue";
// 全部导入
// import ElementUI from 'element-ui';
// 按需导入
import {
    Button,Form,FormItem,Input,Message,
    Container,Header,Aside,Main,Menu,Submenu,
    MenuItemGroup,MenuItem,Breadcrumb,BreadcrumbItem,
    Card,Row,Col,Table,TableColumn,Switch,Tooltip,
    Pagination,Dialog,MessageBox,Tag,Tree,Select,Option,
    Cascader,Alert,Tabs,TabPane,Step,Steps,CheckboxGroup,
    Checkbox,Upload,Image
} from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';

// 导入树形表格插件
import TreeTable from 'vue-table-with-tree-grid'

Vue.component('tree-table',TreeTable)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Image)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

// 定义全局过滤器
// 用于将时间戳转为可读格式
Vue.filter('dataFormat',function (originVal){
    const dt = new Date(originVal)
    const year = dt.getFullYear()
    const month = (dt.getMonth()+1+'').padStart(2,'0')
    const day = (dt.getDay() + '').padStart(2,'0')
    const hh = (dt.getHours() + '').padStart(2,'0')
    const mm = (dt.getMinutes() + '').padStart(2,'0')
    const ss = (dt.getSeconds() + '').padStart(2,'0')
    return `${year}-${month}-${day}-${hh}-${mm}-${ss}`
})

// 导入字体图标
import '../assets/fonts/iconfont.css'

// 导入vue-quill-editor插件
import VueQuillEditor from "vue-quill-editor";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)
