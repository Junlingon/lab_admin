import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
const routes = [
    {
        name: "login",
        path: "/login",
        mate: {
            title: "登录",
        },
        component: () => import("/src/view/admin/login.vue"),
    },
    {
        name: "",
        path: "/",
        mate: {
            title: "",
        },
        component: () => import("/src/view/admin/layout.vue"),
        children: [
            {
                name: "",
                path: "/",
                meta: {
                    title: "首页",
                },
                component: () => import("/src/view/admin/home.vue"),
            },
            //用户模块
            {
                name: "user_list",
                path: "/user_list",
                meta: {
                    title: "用户信息",
                },
                component: () => import("/src/view/admin/user/user_list.vue"),
            },
            {
                name: "user_permissions",
                path: "/user_permissions",
                meta: {
                    title: "用户权限",
                },
                component: () => import("/src/view/admin/user/user_permissions.vue"),
            },
            {
                name: "user_menu",
                path: "/user_menu",
                meta: {
                    title: "用户菜单",
                },
                component: () => import("/src/view/admin/user/user_menu.vue"),
            },
            //实验室
            {
                name: "org_direction",
                path: "/org_direction",
                meta: {
                    title: "发展方向",
                },
                component: () => import("/src/view/admin/lab/org_direction.vue"),
            },
            {
                name: "org_list",
                path: "/org_list",
                meta: {
                    title: "实验室简介",
                },
                component: () => import("/src/view/admin/lab/org_list.vue"),
            },
            {
                name: "org_showimg",
                path: "/org_showimg",
                meta: {
                    title: "图片展示",
                },
                component: () => import("/src/view/admin/lab/org_showimg.vue"),
            },
            //实验室成员
            {
                name: "audit_member_list",
                path: "/audit_member_list",
                meta: {
                    title: "成员信息",
                },
                component: () => import("/src/view/admin/user/user_list.vue"),
            },
            {
                name: "audit_tercher_list",
                path: "/audit_tercher_list",
                meta: {
                    title: "教师信息",
                },
                component: () => import("/src/view/admin/lab/audit_tercher_list.vue"),
            },
            //智能车
            {
                name: "elementSearch",
                path: "/elementSearch",
                meta: {
                    title: "元素",
                },
                component: () => import("/src/view/admin/SmartCar/element.vue"),
            },
            {
                name: "message_car",
                path: "/message_car",
                meta: {
                    title: "智能车信息",
                },
                component: () => import("/src/view/admin/SmartCar/car.vue"),
            },
            {
                name: "message_carlist",
                path: "/message_carlist",
                meta: {
                    title: "智能车队信息",
                },
                component: () => import("/src/view/admin/SmartCar/fleet.vue"),
            },
            //展示平台
            {
                name: "map_list",
                path: "/map_list",
                meta: {
                    title: "赛道图",
                },
                component: () => import("/src/view/admin/platform/map.vue"),
            },
            {
                name: "draw_list",
                path: "/draw_list",
                meta: {
                    title: "赛道图绘制",
                },
                component: () => import("/src/view/admin/platform/draw.vue"),
            },
            {
                name: "track_list",
                path: "/track_list",
                meta: {
                    title: "运行轨迹信息",
                },
                component: () => import("/src/view/admin/platform/track.vue"),
            },
            //竞赛
            {
                name: "competition_list",
                path: "/competition_list",
                meta: {
                    title: "竞赛信息",
                },
                component: () => import("/src/view/admin/contest/info.vue"),
            },
            {
                name: "competition_award",
                path: "/competition_award",
                meta: {
                    title: "竞赛获奖",
                },
                component: () => import("/src/view/admin/contest/award.vue"),
            },
            //站内信息
            {
                name: "innerinfo",
                path: "/innerinfo",
                meta: {
                    title: "站内信息",
                },
                component: () => import("/src/view/admin/public/innerinfo.vue"),
            },
            //系统配置
            {
                name: "system",
                path: "/system",
                meta: {
                    title: "站内信息",
                },
                component: () => import("/src/view/admin/public/system.vue"),
            },
            {
                name: "object",
                path: "/object",
                meta: {
                    title: "项目列表",
                },
                component: () => import("/src/view/admin/obj/object.vue"),
            },
            {
                name: "audit_user_list",
                path: "/audit_user_list",
                meta: {
                    title: "用户审核",
                },
                component: () => import("/src/view/admin/audit/audit_user_list.vue"),
            },

            {
                name: "audit_org_list",
                path: "/audit_org_list",
                meta: {
                    title: "组织审核",
                },
                component: () => import("/src/view/admin/audit/audit_org_list.vue"),
            },

            {
                name: "message_list",
                path: "/message_list",
                meta: {
                    title: "消息列表",
                },
                component: () => import("/src/view/admin/message/message_list.vue"),
            },
            {
                name: "notice_notice_list",
                path: "/notice_notice_list",
                meta: {
                    title: "公告列表",
                },
                component: () => import("/src/view/admin/notice/notice_notice_list.vue"),
            },
            {
                name: "log_list",
                path: "/log_list",
                meta: {
                    title: "日志列表",
                },
                component: () => import("/src/view/admin/log/log_list.vue"),
            },
            {
                name: "faq_list",
                path: "/faq_list",
                meta: {
                    title: "常见问题",
                },
                component: () => import("/src/view/admin/notice/notice_faq_list.vue"),
            },
            {
                name: "root_role",
                path: "/root_role",
                meta: {
                    title: "角色列表",
                },
                component: () => import("/src/view/admin/root/root_role.vue"),
            },
            {
                name: "root_admin_list",
                path: "/root_admin_list",
                meta: {
                    title: "账号列表",
                },
                component: () => import("/src/view/admin/root/root_admin_list.vue"),
            },
            {
                name: "root_auth_list",
                path: "/root_auth_list",
                meta: {
                    title: "权限列表",
                },
                component: () => import("/src/view/admin/root/root_auth_list.vue"),
            },
            {
                name: "root_menu_list",
                path: "/root_menu_list",
                meta: {
                    title: "菜单列表",
                },
                component: () => import("/src/view/admin/root/root_menu_list.vue"),
            },


        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
