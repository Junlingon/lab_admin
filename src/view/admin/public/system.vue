<template>
  <div class="userlist">
    <el-card shadow="always">
      <el-form
        :inline="true"
        @keyup.enter="searchbtn"
        @submit.native.prevent
        :model="formdata"
      >
        <el-form-item>
          <el-button type="primary" @click="updbtn('add', { id: null })"
            >新建配置</el-button
          >
        </el-form-item>
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
        <el-table-column label="配置名" prop="name" />
        <el-table-column label="配置值" prop="value" />
        <el-table-column label="标志" prop="label" />
        <el-table-column label="描述" prop="info" />
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
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <div class="dfw">
              <div>
                <el-button
                  text
                  type="primary"
                  icon="Edit"
                  size="small"
                  @click="updbtn('upd', scope.row)"
                  >修改数据
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
    <MessageUpd @savebtn="updsavebtn" ref="MessageUpdRef"></MessageUpd>
  </div>
</template>
    
    <script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import MessageUpd from "@/view/admin/public/system_upd.vue";
const { proxy, ctx } = getCurrentInstance();

const limit = ref(10); //每页条数
const page = ref(1); //当前页数
const totalCount = ref(0); //总条数
const list = ref([]); //全部数据
const formdata = ref({
  search: "", //搜索
});
const MessageUpdRef = ref(null); //新增 修改组件
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
  const res = await proxy.$api.AdminApi.configList({
    page: page.value,
    limit: limit.value,
    search: formdata.value.search,
  });
  list.value = res.data.list;
  totalCount.value = res.data.totalCount;
};
//点击添加 修改
const updbtn = async (type, e) => {
  MessageUpdRef.value.blockfunc(type, e);
};
//添加 修改账号的回调
const updsavebtn = async (e) => {
  await getlist();
};

onMounted(() => {
  getlist();
});
</script>
    
    <style lang="less" scoped>
.userlist {
}
</style>
    