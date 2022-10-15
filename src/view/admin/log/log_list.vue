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
        <el-table-column label="操作账号" prop="username" />
        <el-table-column label="ip地址">
          <template #default="scope">
            <div>{{ scope.row.ip }}</div>
            <div>{{ scope.row.ipAddr }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作类型" prop="type" />
        <el-table-column label="操作接口" prop="url" />
        <el-table-column label="描述" prop="info" />
        <el-table-column label="生成时间" prop="createTime" />
        <!--        <el-table-column fixed="right" label="操作" width="170">-->
        <!--          <template #default="scope">-->
        <!--            <el-button  type="primary" icon="Edit" size="small" @click="detailsbtn(scope.row)">详情</el-button>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
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
  const res = await proxy.$api.AdminApi.LogList({
    page: page.value,
    limit: limit.value,
    search: formdata.value.search,
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
