<template>
  <div class="userlist">
    <el-card shadow="always">
      <el-form :inline="true" :model="formdata" @submit.native.prevent>
        <!--        <el-form-item>-->
        <!--          <el-button type="primary" @click="updbtn('add',{id:null})">新建账号</el-button>-->
        <!--        </el-form-item>-->
        <el-form-item label="搜索">
          <el-input @submit.native.prevent v-model="formdata.search" clearable placeholder="搜索"/>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="formdata.status" clearable placeholder="用户状态">
            <el-option label="已通过" value="1"/>
            <el-option label="已驳回" value="2"/>
            <el-option label="待审核" value="3"/>
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
        <el-table-column width="250" label="组织名称" prop="groupName"/>
        <el-table-column width="270" label="统一社会信用代码" prop="societyCode">
          <template #default="scope">
            <el-link icon="Pointer" @click="goherf(scope.row)" type="success">{{scope.row.societyCode}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="法人" prop="legalPerson"/>
        <el-table-column label="手机号" prop="mobile"/>
        <el-table-column label="log">
          <template #default="scope">
            <el-image
                preview-teleported
                style="width: 50px; height: 50px;"
                :src="scope.row.logo"
                :preview-src-list="scope.row.srcList"
                :initial-index="0"
                fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="执照">
          <template #default="scope">
            <el-image
                preview-teleported
                style="width: 50px; height: 50px;"
                :src="scope.row.licenseImg"
                :preview-src-list="scope.row.srcList"
                :initial-index="1"
                fit="cover"
            />
          </template>
        </el-table-column>

        <el-table-column label="实名信息">
          <template #default="scope">
            <el-image
                preview-teleported
                style="width: 50px; height: 50px;margin: 0 10px 0 0px"
                :src="scope.row.firstImg"
                :preview-src-list="scope.row.srcList"
                :initial-index="3"
                fit="cover"
            />
            <el-image
                preview-teleported
                style="width: 50px; height: 50px;"
                :src="scope.row.lastImg"
                :preview-src-list="scope.row.srcList"
                :initial-index="4"
                fit="cover"
            />
          </template>
        </el-table-column>

        <el-table-column label="审核状态" prop="type">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status==1"> 已通过</el-tag>
            <el-tooltip class="box-item" effect="dark" :content="scope.row.applicationInfo" placement="top">
              <el-tag type="danger" v-if="scope.row.status==2"> 已驳回</el-tag>
            </el-tooltip>
            <el-tag type="info" v-if="scope.row.status==3">待审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" prop="createTime"/>
        <el-table-column fixed="right" label="操作" width="170">
          <template #default="scope">
            <div class="dfw">
              <div>
                <el-button text type="primary" icon="View" size="small" @click="detailsbtn('det',scope.row)">查询详情
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
          :page-sizes="[10, 20, 30, 40,50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </el-card>
    <AuditOrgDetails @savebtn="delsavebtn" ref="AuditOrgDetailsRef"></AuditOrgDetails>
  </div>
</template>

<script setup>
import  AuditOrgDetails from  "@/view/admin/audit/audit_org_details.vue"

import {ElMessage, ElMessageBox} from 'element-plus'

import {ref, getCurrentInstance, onMounted} from "vue";

const {proxy, ctx} = getCurrentInstance();


const limit = ref(10) //每页条数
const page = ref(1) //当前页数
const totalCount = ref(0) //总条数
const list = ref([]) //全部数据
const formdata = ref({
  search: '', //搜索
  status: '3',
})

const AuditOrgDetailsRef = ref(null) //审核详情组件

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

//监听审核按钮返回
const delsavebtn = async (e) => {
  await getlist();
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


//查看详情
const detailsbtn = (type, e) => {
  AuditOrgDetailsRef.value.blockfunc(type, e);
}

//跳转到企查查
const  goherf=(e)=>{
  var url = `https://www.tianyancha.com/search?key=${e.societyCode}`
  window.open(url, '_blank')
}


//获取列表
const getlist = async (e) => {
  const res = await proxy.$api.AdminApi.AuditOrgList({
    search: formdata.value.search,
    status: formdata.value.status,
    page: page.value,
    limit: limit.value,
  });

  res.data.list.forEach((item, index) => {
    item.logo= item.logo ? `${proxy.$utils.imgurl}${item.logo}`:'';
    item.licenseImg= item.licenseImg ? `${proxy.$utils.imgurl}${item.licenseImg}`:'';
    item.firstImg= item.firstImg ? `${proxy.$utils.imgurl}${item.firstImg}`:'';
    item.lastImg= item.lastImg ? `${proxy.$utils.imgurl}${item.lastImg}`:'';
    item.srcList = [item.logo, item.licenseImg,item.firstImg,item.lastImg]
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
