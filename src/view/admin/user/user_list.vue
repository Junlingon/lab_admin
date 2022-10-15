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
            placeholder="搜索"
          />
        </el-form-item>
        <el-form-item label="用户状态">
          <el-select v-model="formdata.status" clearable placeholder="用户状态">
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
        <el-table-column label="姓名" prop="name" style="text-align: center" />
        <el-table-column label="头像">
          <template #default="scope">
            <el-image
              preview-teleported
              style="width: 50px; height: 50px"
              :src="scope.row.img"
              :preview-src-list="scope.row.srcList"
              :initial-index="0"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="iphone" />

        <el-table-column label="性别" prop="sex">
          <template #default="scope">
            <div v-if="scope.row.sex == 1">男</div>
            <div v-if="scope.row.sex == 2">女</div>
            <div v-if="scope.row.sex == 0">未知</div>
          </template>
        </el-table-column>

        <el-table-column label="邮箱" prop="email" />

        <!-- <el-table-column label="认证状态" prop="certificationStatus">
          <template #default="scope">
            <el-tag
              type=""
              v-if="
                scope.row.certificationStatus == 1 ||
                scope.row.certificationStatus == 0
              "
            >
              未认证</el-tag
            >
            <el-tag type="success" v-if="scope.row.certificationStatus == 2">
              已认证</el-tag
            >
            <el-tag type="info" v-if="scope.row.certificationStatus == 3">
              审核中</el-tag
            >
            <el-tag type="danger" v-if="scope.row.certificationStatus == 4">
              未通过</el-tag
            >
          </template>
        </el-table-column> -->

        <el-table-column label="地址" prop="adress" />
        <el-table-column label="方向" prop="post" />
        <el-table-column label="项目" prop="project" />
        <el-table-column label="账号状态" prop="type">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status == 1"> 正常</el-tag>
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="scope.row.des"
              placement="top"
            >
              <el-tag type="danger" v-if="scope.row.status == 2"> 冻结</el-tag>
              <el-tag type="info" v-if="scope.row.status == 3"> 已注销</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="注册日期" prop="createTime" />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <div class="dfw">
              <div>
                <el-button
                  text
                  type="primary"
                  icon="View"
                  size="small"
                  @click="detailsbtn('det', scope.row)"
                  >查询详情
                </el-button>
              </div>
            </div>
          </template>
        </el-table-column>
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
  const res = await proxy.$api.AdminApi.UserList({
    search: formdata.value.search,
    status: formdata.value.status,
    page: page.value,
    limit: limit.value,
  });
  console.log(res);
  res.data.list.forEach((item) => {
    item.img = item.img ? `${proxy.$utils.imgurl}${item.img}` : "";
    item.srcList = [item.img];
  });

  list.value = res.data.list;
  totalCount.value = res.data.totalCount;
};

//重置密码
const creatpwd = (e) => {
  ElMessageBox.confirm("请谨慎操作，您确定删除?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "Warning",
  })
    .then(async () => {
      const res = await proxy.$api.AdminApi.creatpwd({
        id: e.id,
      });
      ElMessage({
        message: `重置密码成功,新密码:${res.data}`,
        type: "success",
      });
    })
    .catch(() => {});
};

onMounted(() => {
  getlist();
});
</script>

<style lang="less" scoped>
.userlist {
}
</style>
