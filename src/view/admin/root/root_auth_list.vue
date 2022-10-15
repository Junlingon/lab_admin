<template>
  <div class="userlist">
    <el-card shadow="always">
      <el-form :inline="true" :model="formdata" @submit.native.prevent>
        <el-form-item>
          <el-button type="primary" @click="updbtn('add',{id:null})">新建权限</el-button>
        </el-form-item>
        <el-form-item label="搜索">
          <el-input @submit.native.prevent v-model="formdata.search" clearable placeholder="搜索"/>
        </el-form-item>
<!--        <el-form-item label="用户状态">-->
<!--          <el-select v-model="formdata.status" clearable placeholder="用户状态">-->
<!--            <el-option label="正常" value="1"/>-->
<!--            <el-option label="冻结" value="2"/>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="searchbtn">搜索</el-button>
          <el-button type="info" @click="clear">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mt20">
      <el-table :data="list" style="width: 100%" stripe border scrollbar-always-on>
        <el-table-column label="名称" prop="name"/>
        <el-table-column label="描述" prop="roleInfo"/>
<!--        <el-table-column label="账号状态" prop="type" >-->
<!--          <template #default="scope">-->
<!--            <el-tag type="success" v-if="scope.row.status==1"> 正常</el-tag>-->
<!--            <el-tooltip-->
<!--                class="box-item"-->
<!--                effect="dark"-->
<!--                :content="scope.row.des"-->
<!--                placement="top"-->
<!--            >-->
<!--              <el-tag type="danger" v-if="scope.row.status==2"> 冻结</el-tag>-->
<!--            </el-tooltip>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column label="生成日期" prop="createTime"/>
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <div>
<!--              <el-button text type="primary" icon="View" size="small" @click="detailsbtn('det',scope.row)">查询详情</el-button>-->
              <el-button text type="primary" icon="Edit" size="small" @click="updbtn('upd',scope.row)">修改数据</el-button>
            </div>
<!--            <div>-->
<!--              <el-button text v-if="scope.row.status==1" type="danger" icon="Failed" size="small"-->
<!--                         @click="detailsbtn('del',scope.row)">账户冻结-->
<!--              </el-button>-->
<!--              <el-button text v-if="scope.row.status==2" type="success" icon="Failed" size="small"-->
<!--                         @click="frozenbtn(scope.row)">解除冻结-->
<!--              </el-button>-->
<!--            </div>-->
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

    <RootAuthUpd @savebtn="updsavebtn" ref="RootAuthUpdref"></RootAuthUpd>
  </div>
</template>

<script setup>



import RootAuthUpd from  "@/view/admin/root/root_auth_upd.vue" //新增修改组件



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
const RootAuthUpdref = ref(null) //新增 修改组件
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


//点击添加 修改
const updbtn = async (type,e) => {
  RootAuthUpdref.value.blockfunc(type,e);
}

//添加 修改账号的回调
const updsavebtn = async (e) => {
  await getlist();
}


//获取列表
const getlist = async (e) => {
  const res = await proxy.$api.AdminApi.RoleList({
    search: formdata.value.search,
    status: formdata.value.status,
    page: page.value,
    limit: limit.value,
  });
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
