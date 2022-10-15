<template>
  <div class="userlist">
    <el-card shadow="always">
      <el-form
        :inline="true"
        @keyup.enter="searchbtn"
        @submit.native.prevent
        :model="formdata"
      >
        <el-form-item label="搜索">
          <el-input v-model="formdata.search" placeholder="搜索" />
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
        <el-table-column label="标题" prop="title" />
        <el-table-column label="内容" prop="context" />
        <el-table-column label="发送者" prop="sender" />
        <el-table-column label="接收者" prop="receiver" />
        <el-table-column label="接收集合" prop="ids" />
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
        <el-table-column label="创建时间" prop="createTime" />
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
  </div>
</template>
  
  <script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
const { proxy, ctx } = getCurrentInstance();

const limit = ref(10); //每页条数
const page = ref(1); //当前页数
const totalCount = ref(0); //总条数
const list = ref([]); //全部数据
const formdata = ref({
  search: "", //搜索
});

//搜索
const searchbtn = () => {
  getlist();
};
//重置
const clear = () => {
  formdata.value.search = "";
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

//获取列表
const getlist = async (e) => {
  const res = await proxy.$api.AdminApi.messageList({
    page: page.value,
    limit: limit.value,
    search: formdata.value.search,
  });
  console.log(res);
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
  