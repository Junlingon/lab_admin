<template>
  <div class="common-layout">
    <el-container >
      <el-aside :style="{ width: store.opennum }">
        <LayoutMenu></LayoutMenu>
      </el-aside>
      <el-container>
        <el-header>
          <LayoutHead></LayoutHead>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import LayoutHead from "@/components/LayoutHead.vue"
import LayoutMenu from "@/components/LayoutMenu.vue"
import { mainStore } from "@/store/index";
import {onMounted, ref,watch,getCurrentInstance} from "vue";
const { proxy, ctx } = getCurrentInstance();
const store = mainStore();

const  getlist = async  ()=>{
  const res = await proxy.$api.AdminApi.AdminList({
    search:'',
  });
}


onMounted(() => {
});



</script>

<style lang="less" scoped>
.common-layout{

  .el-container{
    height: 100vh;
  }

  .el-aside{
    animation: load 3s normal forwards;
    height: 100vh;
    background: #304156;
  }
  .el-header{
    width: 100%;
    margin: 0;
    padding: 0 ;
  }
}

</style>
