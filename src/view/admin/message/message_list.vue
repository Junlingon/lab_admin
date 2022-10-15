<template>
  <div class="userlist">
    <el-card shadow="always">
      <el-form
        :inline="true"
        :model="formdata"
        class="demo-form-inline"
        @submit.native.prevent
      >
        <el-form-item>
          <el-button type="primary" @click="updbtn('add', { id: null })"
            >新建消息</el-button
          >
        </el-form-item>
        <el-form-item label="搜索">
          <el-input
            @submit.native.prevent
            v-model="formdata.search"
            clearable
            placeholder="搜索"
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="formdata.status" clearable placeholder="状态">
            <el-option label="未发送" value="3" />
            <el-option label="已发送" value="4" />
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
        <el-table-column label="标题" prop="title" />
        <el-table-column label="内容" prop="context" />
        <el-table-column label="发送者" prop="sender" />
        <el-table-column label="接收者" prop="receiver" />
        <el-table-column label="接收集合" prop="ids"> </el-table-column>
        <el-table-column label="状态" prop="type">
          <template #default="scope">
            <el-tag v-if="scope.row.status == 3" type="primary">未发送</el-tag>
            <el-tag v-if="scope.row.status == 4" type="success">已发送</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column
          align="left"
          label="操作"
          width="210"
          fixed="right"
          flexible
        >
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
              <div v-if="scope.row.status == 3">
                <el-button
                  text
                  type="primary"
                  icon="Edit"
                  size="small"
                  @click="updbtn('upd', scope.row)"
                  >修改数据
                </el-button>
              </div>
              <div v-if="scope.row.status == 3">
                <el-button
                  text
                  icon="Pointer"
                  size="small"
                  @click="playbtn(scope.row)"
                  >发送消息</el-button
                >
              </div>
              <div>
                <el-button
                  text
                  type="danger"
                  icon="Failed"
                  size="small"
                  @click="delbtn(scope.row)"
                  >删除消息</el-button
                >
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

    <MessageCheak @savebtn="updsavebtn" ref="MessageCheakRef"></MessageCheak>
    <MessageDetails ref="MessageDetailsRef"></MessageDetails>
    <MessageUpd @savebtn="updsavebtn" ref="MessageUpdRef"></MessageUpd>
  </div>
</template>

<script setup>
import MessageCheak from "@/view/admin/message/message_cheak.vue";
import MessageUpd from "@/view/admin/message/message_upd.vue";
import MessageDetails from "@/view/admin/message/message_details.vue";

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
const MessageDetailsRef = ref(null); //详情组件
const MessageUpdRef = ref(null); //新增 修改组件
const MessageCheakRef = ref(null); //发送消息

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

//删除问题
const delbtn = (e) => {
  ElMessageBox.confirm("请谨慎操作，您确定删除?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "Warning",
  })
    .then(async () => {
      const res = await proxy.$api.AdminApi.DelMessage({
        ids: String(e.id),
      });
      ElMessage({
        message: `删除成功`,
        type: "success",
      });
      await getlist();
    })
    .catch(() => {});
};

//查看详情
const detailsbtn = (type, e) => {
  MessageDetailsRef.value.blockfunc(type, e);
};

//点击添加 修改
const updbtn = async (type, e) => {
  MessageUpdRef.value.blockfunc(type, e);
};

//添加 修改账号的回调
const updsavebtn = async (e) => {
  await getlist();
};

//发送消息
const playbtn = async (e) => {
  MessageCheakRef.value.blockfunc(e);
};

//获取列表
const getlist = async (e) => {
  const res = await proxy.$api.AdminApi.MessageList({
    search: formdata.value.search,
    page: page.value,
    limit: limit.value,
    status: formdata.value.status,
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
