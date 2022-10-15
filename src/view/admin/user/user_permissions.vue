<template>
  <div class="userlist">
    <el-card shadow="always">
      <el-form :inline="true" :model="formdata" @submit.native.prevent>
        <!--        <el-form-item>-->
        <!--          <el-button type="primary" @click="updbtn('add',{id:null})">新建账号</el-button>-->
        <!--        </el-form-item>-->
        <el-form-item label="搜索">
          <el-input
            @submit.native.prevent
            v-model="formdata.search"
            clearable
            placeholder="权限名称"
          />
        </el-form-item>
        <el-form-item label="权限状态">
          <el-select v-model="formdata.status" clearable placeholder="权限状态">
            <el-option label="正常" value="1" />
            <el-option label="冻结" value="2" />
            <el-option label="注销" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchbtn">搜索</el-button>
          <el-button type="info" @click="clear">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mt20">
      <el-table
        :data="list"
        style="width: 100%"
        stripe
        border
        scrollbar-always-on
      >
        <el-table-column label="权限名称" prop="permissionName" />
        <el-table-column label="权限信息" prop="permissionInfo" />
        <el-table-column label="状态" prop="status">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status == 1"> 正常</el-tag>
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="scope.row.des"
              placement="top"
            >
              <el-tag type="danger" v-if="scope.row.status == 2"> 失效</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="注册日期" prop="createTime" />
      </el-table>
      <el-pagination
        class="mt20"
        v-model:currentPage="page"
        v-model:page-size="limit"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <UserDetails @savebtn="delsavebtn" ref="UserDetailsRef"></UserDetails>
  </div>
</template>

<script setup>
import UserDetails from "@/view/admin/user/user_details.vue"; //详情组件

import { ElMessage, ElMessageBox } from "element-plus";
import { ref, getCurrentInstance, onMounted } from "vue";

const { proxy, ctx } = getCurrentInstance();
const limit = ref(10); //每页条数
const page = ref(1); //当前页数
const totalCount = ref(0); //总条数
const list = ref([]); //全部数据
const formdata = ref({
  search: "", //搜索
  status: "",
});
const UserUpdRef = ref(null); //新增 修改组件
const UserDetailsRef = ref(null); //详情组件

//搜索
const searchbtn = () => {
  getlist();
};
//重置
const clear = () => {
  formdata.value.search = "";
  formdata.value.status = "";
  page.value = 1;
  list.value = [];
  getlist();
};

//修改当前每页条数
const handleSizeChange = (e) => {
  limit.value = e;
  getlist();
};
//监听页数
const handleCurrentChange = (e) => {
  page.value = e;
  getlist();
};

//解除冻结按钮
const frozenbtn = async (e) => {
  const res = await proxy.$api.AdminApi.NoDelUser({
    id: e.id,
  });
  await getlist();
};

//查看详情
const detailsbtn = (type, e) => {
  UserDetailsRef.value.blockfunc(type, e);
};

//监听冻结按钮返回
const delsavebtn = async (e) => {
  await getlist();
};

//点击添加 修改
const updbtn = async (type, e) => {
  UserUpdRef.value.blockfunc(type, e);
};

//添加 修改账号的回调
const updsavebtn = async (e) => {
  await getlist();
};

//获取列表
const getlist = async (e) => {
  const res = await proxy.$api.AdminApi.UserPermission({
    search: formdata.value.search,
    status: formdata.value.status,
    page: page.value,
    limit: limit.value,
  });
  console.log(res);
  res.data.list.forEach((item) => {
    item.headrImg = item.headrImg
      ? `${proxy.$utils.imgurl}${item.headrImg}`
      : "";
    item.srcList = [item.headrImg];
  });

  list.value = res.data.list;
  totalCount.value = res.data.totalCount;
};

onMounted(() => {
  getlist();
});
</script>

<style lang="less" scoped>
.userlist {
}
</style>
