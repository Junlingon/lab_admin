<template>
  <div class="userlist">
    <el-card shadow="always">
      <el-form :inline="true" :model="formdata" @submit.native.prevent>
        <el-form-item>
          <el-button type="primary" @click="updbtn('add',{id:null})">新建公告</el-button>
        </el-form-item>
        <el-form-item label="搜索">
          <el-input @submit.native.prevent v-model="formdata.search" clearable placeholder="搜索"/>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formdata.status" clearable placeholder="状态">
            <el-option label="正常" value="1"/>
            <el-option label="冻结" value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchbtn">搜索</el-button>
          <el-button type="info" @click="clear">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mt20">
      <el-table :data="list" style="width: 100%" stripe border scrollbar-always-on>
        <el-table-column label="标题" prop="title"/>
        <!--        <el-table-column label="回答" width="600px" prop="msg"/>-->
        <el-table-column label="状态" prop="status">
          <template #default="scope">
            <el-switch @change="switchbtn(scope.row)" v-model="scope.row.statusS"/>
          </template>
        </el-table-column>

        <el-table-column label="排序" prop="sort">
          <template #default="scope">
            <el-input-number
                @change="sortchange(scope.row)"
                v-model="scope.row.sort"
                :min="1"
                size="small"
                controls-position="right"
            />
          </template>
        </el-table-column>

        <el-table-column label="创建时间" prop="createTime"/>
        <el-table-column align="left" label="操作" width="210" fixed="right" flexible>
          <template #default="scope">
            <div class="dfw">
              <div>
                <el-button text type="primary" icon="View" size="small" @click="detailsbtn('det',scope.row)">查询详情
                </el-button>
              </div>
              <div>
                <el-button text type="primary" icon="Edit" size="small" @click="updbtn('upd',scope.row)">修改数据
                </el-button>
              </div>
              <div>
                <el-button text type="danger" icon="Failed" size="small" @click="delbtn(scope.row)">删除公告</el-button>
              </div>
            </div>

          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          class="mt20"
          v-model:currentPage="page"
          v-model:page-size="limit"
          :page-sizes="[10, 20, 30, 40,50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </el-card>

    <NoticeNoticeDetails ref="NoticeNoticeDetailsRef"></NoticeNoticeDetails>
    <NoticeNoticeUpd @savebtn="updsavebtn" ref="NoticeNoticeUpdRef"></NoticeNoticeUpd>
  </div>
</template>

<script setup>

import NoticeNoticeDetails from "@/view/admin/notice/notice_notice_details.vue"
import NoticeNoticeUpd from "@/view/admin/notice/notice_notice_upd.vue"

import {ElMessage, ElMessageBox} from 'element-plus'
import {ref, getCurrentInstance, onMounted} from "vue";

const {proxy, ctx} = getCurrentInstance();

const limit = ref(10) //每页条数
const page = ref(1) //当前页数
const totalCount = ref(0) //总条数
const list = ref([]) //全部数据
const formdata = ref({
  search: '', //搜索
  status: '',
})
const NoticeNoticeDetailsRef = ref(null) //详情组件
const NoticeNoticeUpdRef = ref(null) //新增 修改组件
//搜索
const searchbtn = () => {
  getlist();
}
//重置
const clear = () => {
  formdata.value.search = "";
  formdata.value.status = "";
  page.value = 1;
  list.value = [];
  getlist();
}

//修改当前每页条数
const handleSizeChange = (e) => {
  limit.value = e;
  getlist();
}
//监听页数
const handleCurrentChange = (e) => {
  page.value = e;
  getlist();
}

//状态切换
const switchbtn = async (e) => {
  const res = await proxy.$api.AdminApi.UpdNotice({
    id: e.id,
    title: e.title,
    context: e.context,
    sort: e.sort,
    status: e.statusS == true ? 1 : 2
  });
  await getlist();
}

//排序接口返回
const sortchange = async (e) => {
  const res = await proxy.$api.AdminApi.UpdNotice({
    id: e.id,
    title: e.title,
    context: e.context,
    sort: e.sort,
    status: e.statusS == true ? 1 : 2
  });
  getlist();
}

//删除问题
const delbtn = (e) => {
  ElMessageBox.confirm(
      '请谨慎操作，您确定删除?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'Warning',
      }
  ).then(async () => {
    const res = await proxy.$api.AdminApi.DelNotice({
      ids: String(e.id)
    });
    ElMessage({
      message: `删除成功:`,
      type: 'success',
    })
    await getlist();
  })
      .catch(() => {

      })
}

//查看详情
const detailsbtn = (type, e) => {
  NoticeNoticeDetailsRef.value.blockfunc(type, e);
}


//点击添加 修改
const updbtn = async (type, e) => {
  NoticeNoticeUpdRef.value.blockfunc(type, e);
}

//添加 修改账号的回调
const updsavebtn = async (e) => {
  await getlist();
}


//获取列表
const getlist = async (e) => {
  const res = await proxy.$api.AdminApi.NoticeList({
    search: formdata.value.search,
    page: page.value,
    limit: limit.value,
    status: formdata.value.status
  });

  res.data.list.forEach(item => {
    item.statusS = item.status == 1 ? true : false
  })

  list.value = res.data.list;
  totalCount.value = res.data.totalCount
}


onMounted(() => {
  getlist();
});


</script>

<style lang="less" scoped>
.userlist {

}
</style>
