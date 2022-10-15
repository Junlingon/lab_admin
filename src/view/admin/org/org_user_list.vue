<template>
  <el-dialog v-model="dialogTableVisible" title="证书列表" width="95%">
    <el-card shadow="always">
      <el-form :inline="true" :model="formdata" @submit.native.prevent>
        <el-form-item label="搜索">
          <el-input @submit.native.prevent v-model="formdata.search" clearable placeholder="搜索"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchbtn">搜索</el-button>
          <el-button type="info" @click="clear">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mt20">
      <el-table :data="list" style="width: 100%" stripe border scrollbar-always-on>
        <el-table-column label="名字" prop="nickname"/>
        <el-table-column label="性别" prop="sex">
          <template #default="scope">
            <div v-if="scope.row.sex=='Male'||scope.row.sex==1">男</div>
            <div v-if="scope.row.sex=='FEMale'||scope.row.sex==2">女</div>
            <div v-if="scope.row.sex==3||scope.row.sex==0">未知</div>
          </template>
        </el-table-column>
        <el-table-column label="出生时间" prop="bornTime"/>
        <el-table-column label="家庭地址" prop="homeAddress"/>
        <el-table-column label="手机号" prop="mobile"/>
        <el-table-column label="职位" prop="post"/>
        <el-table-column label="数字证书编号" prop="certCode"/>
        <el-table-column label="照片">
          <template #default="scope">
<!--            <el-avatar :src="scope.row.photo"/>-->
            <el-image
                preview-teleported
                style="width: 50px; height: 50px;"
                :src="scope.row.photo"
                :preview-src-list="scope.row.srcList"
                :initial-index="0"
                fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status==1"> 正常</el-tag>
            <!--            <el-tooltip class="box-item" effect="dark" :content="scope.row.des" placement="top">-->
            <!--              <el-tag type="danger" v-if="scope.row.status==2">冻结</el-tag>-->
            <!--            </el-tooltip>-->
            <el-tag type="info" v-if="scope.row.status==2">失效</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="注册日期" prop="createTime"/>
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
  </el-dialog>
</template>

<script setup>


import {ref, onMounted, getCurrentInstance} from "vue";
import {mainStore} from "@/store/index";

const dialogTableVisible = ref(false)

const {proxy, ctx} = getCurrentInstance();
const store = mainStore();
const id = ref()
const limit = ref(10) //每页条数
const page = ref(1) //当前页数
const totalCount = ref(0) //总条数
const list = ref([]) //全部数据
const formdata = ref({
  search: '', //搜索
  status: '',
})

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

//搜索
const searchbtn = () => {
  getlist();
}
//重置
const clear = () => {
  formdata.value.search = "";
  page.value = 1;
  list.value = [];
  getlist();
}

//获取列表
const getlist = async (e) => {
  const res = await proxy.$api.AdminApi.OrgUserList({
    search: formdata.value.search,
    page: page.value,
    limit: limit.value,
    id: id.value,
  });

  res.data.list.forEach(item=>{
    item.photo =item.photo ? `${proxy.$utils.imgurl}${item.photo}`:''
    item.srcList=[item.photo]
  })

  list.value = res.data.list;
  totalCount.value = res.data.totalCount
}


//暴露方法 给父组件调用
defineExpose({
  //父组件调用 初始化方法
  blockfunc(e) {
    dialogTableVisible.value = true;
    id.value = e.id
    getlist();
  },
})


// 声明点击确定返回事件
const emit = defineEmits(['savebtn'])


//关闭窗口
const clearbtn = () => {
  dialogTableVisible.value = false;
}

onMounted(() => {
});


</script>

<style lang="less"></style>
