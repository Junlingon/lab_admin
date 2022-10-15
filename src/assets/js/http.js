import axios from "axios";
import utils from "./utils";
import { ElLoading } from "element-plus";
import { ElMessage } from "element-plus";

import router from "../../router";

let loadingIsShow = null;

var windowlocation = window.location.host; //获取当前访问地址
var httpurl = "http://121.41.112.205:8088/"; //定义访问地址
var locationurlbox = [
    "localhost:8080",
    "localhost:8081",
    "localhost:8082",
    "localhost:8083",
    "localhost:3000",
]; //定义本地地址
if (locationurlbox.includes(windowlocation)) {  //如果是本地地址
    httpurl = 'http://121.41.112.205:8088/'; //线上
} else if ('http://121.41.112.205:8088/'.includes(windowlocation)) {
    httpurl = 'http://121.41.112.205:8088/'; //哈尔滨外网
}

const service = axios.create({
    baseURL: httpurl,
    // baseURL: "http://bokeapi.wuguyx.vip/",
    timeout: 9000,
    headers: {
        // "Content-Type": "application/x-www-form-urlencoded",
        "Content-Type": "application/json",
    },
});

// 请求拦截
service.interceptors.request.use((res) => {
    res.headers.common["satoken"] = localStorage.getItem("token");
    loadingIsShow = ElLoading.service({
        fullscreen: true,
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
    });
    return res;
});

// 响应拦截
service.interceptors.response.use((res) => {
    if (res.status === 200) {
        if (res.data && res.data.code != 101 && res.data.code != 102) {
            loadingIsShow.close();
            return Promise.resolve(res.data);
        } else if (res.data.code == 102) {
            localStorage.clear();
            router.push("/login");
            loadingIsShow.close();
            return Promise.reject(res);
        }
        else {
            ElMessage({
                dangerouslyUseHTMLString: true,
                message: `${res.data.msg}`,
                type: "warning",
                showClose: true,
                icon: "",
                duration: 2500,
            });
        }
        loadingIsShow.close();
        return Promise.reject(res);
    } else {
        setTimeout(() => {
            return Promise.resolve(res);
            loadingIsShow.close();
        }, 5000)
    }
});

export const request = (url = "", data = {}, type = "POST") => {
    return new Promise((resolve, reject) => {
        let promise;
        // var setpwddata = utils.setpwd(JSON.stringify(data));
        // var getpwddata = utils.getpwd(setpwddata);

        if (type.toUpperCase() === "GET") {
            promise = service({
                url,
                params: data,
            });
        } else if (type.toUpperCase() === "POST") {
            promise = service({
                method: "POST",
                url,
                data: data,
            });
        }
        promise
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
