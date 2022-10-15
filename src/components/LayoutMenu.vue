<template>
  <div class="menu">
    <el-menu
      :collapse="store.openshow"
      active-text-color="#409EFF"
      background-color="#304156"
      class="el-menu-vertical-demo"
      unique-opened
      :default-active="newrouter"
      text-color="#bfcbd9"
      style="border: none"
      collapse-transition
    >
      <el-menu-item index="0" @click="goindex">
        <el-icon>
          <HomeFilled />
        </el-icon>
        <template #title>系统首页</template>
      </el-menu-item>
      <el-sub-menu
        v-for="(item, index) of menulist"
        :index="item.id"
        :key="index"
      >
        <template #title>
          <el-icon>
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
        <el-menu-item
          v-for="(item2, index2) of item.item"
          :index="item2.id"
          :key="index2"
          @click="gobtn(item, item2)"
        >
          <el-icon>
            <el-icon>
              <component :is="item2.icon" />
            </el-icon>
          </el-icon>
          {{ item2.title }}
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { mainStore } from "@/store/index";
import { useRoute, useRouter } from "vue-router";

const $router = useRouter();
const $useroute = useRoute();

const store = mainStore();
const menulist = ref([
  {
    icon: "SwitchFilled",
    title: "实验室中心",
    path: "",
    id: 1,
    item: [
      {
        icon: "School",
        title: "实验室信息列表",
        path: "/org_list",
        id: 2,
      },
      {
        icon: "UserFilled",
        title: "实验室老师列表",
        path: "/audit_tercher_list",
        id: 3,
      },
      {
        icon: "User",
        title: "实验室成员列表",
        path: "/user_list",
        id: 4,
      },
    ],
  },
  {
    icon: "Trophy",
    title: "竞赛中心",
    path: "",
    id: 5,
    item: [
      {
        icon: "WalletFilled",
        title: "竞赛列表",
        path: "/competition_list",
        id: 6,
      },
      {
        icon: "Briefcase",
        title: "项目列表",
        path: "/object",
        id: 7,
      },
      {
        icon: "Stamp",
        title: "发展目标列表",
        path: "/org_direction",
        id: 8,
      },
    ],
  },
  {
    icon: "Bell",
    title: "信息中心",
    path: "",
    id: 9,
    item: [
      {
        icon: "WarnTriangleFilled",
        title: "公告列表",
        path: "/notice_notice_list",
        id: 10,
      },
      {
        icon: "Message",
        title: "站内信列表",
        path: "/message_list",
        id: 11,
      },
    ],
  },
  {
    icon: "WindPower",
    title: "智能车中心",
    path: "",
    id: 12,
    item: [
      {
        icon: "Coin",
        title: "赛道元素列表",
        path: "/elementSearch",
        id: 13,
      },
      {
        icon: "TrendCharts",
        title: "赛道图列表",
        path: "/map_list",
        id: 14,
      },
      {
        icon: "Bicycle",
        title: "智能小车列表",
        path: "/message_car",
        id: 15,
      },
      {
        icon: "Van",
        title: "智能车队列表",
        path: "/message_carlist",
        id: 16,
      },
      {
        icon: "MoonNight",
        title: "智能小车轨迹列表",
        path: "/track_list",
        id: 17,
      },
    ],
  },
  {
    icon: "Avatar",
    title: "管理员中心",
    path: "",
    id: 18,
    item: [
      {
        icon: "Avatar",
        title: "管理员列表",
        path: "/root_admin_list",
        id: 19,
      },
      {
        icon: "User",
        title: "角色列表",
        path: "/root_role",
        id: 20,
      },
      {
        icon: "Document",
        title: "菜单列表",
        path: "/user_menu",
        id: 21,
      },
      {
        icon: "Postcard",
        title: "权限列表",
        path: "/user_permissions",
        id: 22,
      },
    ],
  },
  {
    icon: "Cpu",
    title: "配置",
    path: "",
    id: 23,
    item: [
      {
        icon: "Key",
        title: "配置列表",
        path: "/system",
        id: 24,
      },
    ],
  },
  {
    icon: "Files",
    title: "日志",
    path: "",
    id: 25,
    item: [
      {
        icon: "Reading",
        title: "日志列表",
        path: "/log_list",
        id: 26,
      },
    ],
  },

  // {
  //   icon: "Reading",
  //   title: "管理员",
  //   path: "",
  //   id: 15,
  //   item: [
  //     {
  //       icon: "Document",
  //       title: "账号列表",
  //       path: "/root_admin_list",
  //       id: 16,
  //     },
  //   ],
  // },
]);
const newrouter = ref(1);

// 监听count
watch(
  () => $useroute.path,
  (newVal, oldVal) => {
    menulist.value.forEach((item) => {
      item.item.forEach((item2) => {
        if (item2.path == newVal) {
          newrouter.value = item2.id;
        }
      });
    });
    if (newVal == "/") {
      newrouter.value = 0;
    }
  },
  {
    immediate: true, // 立即执行
    deep: true, // 深度监听
  }
);

//跳转到首页
const goindex = () => {
  $router.push({ path: "/" });
};
//跳转到公告
const goannounced = () => {
  $router.push({ path: "/notice_notice_list" });
};
//跳转到站内信息
const goinnerinfo = () => {
  $router.push({ path: "/message_list" });
};
//跳转到操作日志
const golog = () => {
  $router.push({ path: "/log_list" });
};
//跳转到配置系统
const gosystem = () => {
  $router.push({ path: "/system" });
};

//获取路由
const getrouter = () => {
  var newrouterpath = $useroute.path;
  menulist.value.forEach((item) => {
    item.item.forEach((item2) => {
      if (item2.path == newrouterpath) {
        newrouter.value = item2.id;
      }
    });
  });
};
onMounted(() => {
  getrouter();
});

// 点击按钮
const gobtn = (e, e2) => {
  $router.push({ path: e2.path });
};

//监听屏幕大小
window.onresize = () => {
  getwindoswidth();
};

//获取屏幕大小方法
const getwindoswidth = () => {
  var a = document.body.clientWidth;
  if (a < 1360) {
    setTimeout(() => {
      store.opennum = "70px";
    }, 400);
  } else {
    setTimeout(() => {
      store.opennum = "200px";
    }, 400);
  }
  store.openshow = a < 1360 ? true : false;
};

//初始化方法
onMounted(() => {
  getwindoswidth();
});
</script>
<style lang="less" scoped>
::-webkit-scrollbar {
  display: none;
}

.menu {
  height: 100vh;
  overflow-y: auto;
  transition: width 0.5s;
  width: 100%;
  background: #304156;
}
</style>
