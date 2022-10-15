// main.ts
import { createApp } from 'vue'
import router from "./router";
const app = createApp(App)


// 挂载静态文件
import "@/assets/css/reset.less";
import "@/assets/css/public.css";

import  {request} from '@/assets/js/http.js';
import  utils from '@/assets/js/utils';
import allapi from "@/assets/js/allapi";


app.config.globalProperties.$http = request;
app.config.globalProperties.$utils = utils;
app.config.globalProperties.$api = allapi;



//挂载elmentui
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


//挂载pinia
import { createPinia } from 'pinia'
const pinia = createPinia()


import App from './App.vue'
app.use(ElementPlus, { locale: zhCn,  zIndex: 3000 })
app.use(router)
app.use(pinia)
app.mount('#app')
