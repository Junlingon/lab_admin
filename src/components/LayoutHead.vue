<template>
  <div class="head">
    <div class="head_l">
      <div class="iconbtn cursor" @click="menushowbtn">
        <el-icon v-if="store.openshow == true">
          <Expand />
        </el-icon>
        <el-icon v-if="store.openshow == false">
          <Fold />
        </el-icon>
      </div>
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ breadcrumb }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="head_r">
      <div class="myinfo">
        <el-dropdown @command="rigbtn">
          <img class="myinfimg cursor" src="@/assets/img/myimg.gif" />
          <template #dropdown>
            <el-dropdown-menu slot="dropdown">
              <!--              <el-dropdown-item command="a">系统设置</el-dropdown-item>-->
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { mainStore } from "@/store/index";
const store = mainStore();
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, ref, watch, getCurrentInstance } from "vue";
const { proxy, ctx } = getCurrentInstance();
const $router = useRouter();
const $useroute = useRoute();

const breadcrumb = ref(""); //面包屑
//点击按钮 让左侧收缩展开
const menushowbtn = () => {
  store.openshow = !store.openshow;
  setTimeout(() => {
    store.opennum = store.openshow ? "80px" : "200px";
  }, 400);
};

// 监听count
watch(
  () => $useroute.path,
  (newVal, oldVal) => {
    breadcrumb.value = $useroute.meta.title;
  },
  {
    immediate: true, // 立即执行
    deep: true, // 深度监听
  }
);

//获取路由
const getrouter = () => {
  breadcrumb.value = $useroute.meta.title;
};

//点击右上角
const rigbtn = async (e) => {
  if (e == "logout") {
    ElMessageBox.confirm("您确定退出登录?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        const res = await proxy.$api.AdminApi.logout({});
        localStorage.clear();
        await $router.push({ path: "/login" });
        await getlist();
      })
      .catch(() => {});
  }
};

onMounted(() => {
  getrouter();
});
</script>

<style lang="less" scoped>
.head {
  height: 50px;
  width: 100%;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;

  .head_l {
    display: flex;
    align-items: center;

    .iconbtn {
      i {
        font-size: 20px;
      }
    }

    .breadcrumb {
      margin: 0 0 0 10px;
    }
  }

  .head_r {
    .myinfo {
      margin: 0 10px 0 0;

      .myinfimg {
        width: 36px;
        height: 36px;
        border-radius: 10px;
      }
    }
  }
}
</style>
