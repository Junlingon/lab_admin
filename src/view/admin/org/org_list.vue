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
        <el-form-item label="组织状态">
          <el-select v-model="formdata.status" clearable placeholder="组织状态">
            <el-option label="正常" value="1"/>
            <el-option label="冻结" value="2"/>
            <el-option label="已过期" value="3"/>
            <el-option label="已注销" value="4"/>

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
        <el-table-column label="组织名称" prop="groupName"/>
        <el-table-column label="统一社会信用代码" prop="scCode" width="240">
          <template #default="scope">
            <el-link icon="Pointer" @click="goherf(scope.row)" type="success">{{scope.row.scCode}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="法人" prop="legalPerson"/>
        <el-table-column label="前台用户" prop="mobile">
          <template #default="scope">
            <el-link @click="userbtn(scope.row)" type="success">{{ scope.row.user.username }}</el-link>
          </template>
        </el-table-column>
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

        <el-table-column label="组织状态" prop="type">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status==1"> 正常</el-tag>
            <el-tooltip class="box-item" effect="dark" :content="scope.row.des" placement="top">
              <el-tag type="danger" v-if="scope.row.status==2">冻结</el-tag>
            </el-tooltip>
            <el-tag type="info" v-if="scope.row.status==3">已过期</el-tag>
            <el-tag type="info" v-if="scope.row.status==4">已注销</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="有效期" prop="overTime"/>
        <el-table-column label="注册日期" prop="createTime"/>
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <div class="dfw">
              <div>
                <el-button text type="primary" icon="View" size="small" @click="detailsbtn('det',scope.row)">查询详情
                </el-button>
              </div>
              <div>
                <el-button text v-if="scope.row.status==1" type="danger" icon="Failed" size="small"
                           @click="detailsbtn('del',scope.row)">冻结组织
                </el-button>
              </div>
              <div>
                <el-button text v-if="scope.row.status==2" type="success" icon="Failed" size="small"
                           @click="frozenbtn(scope.row)">解除冻结
                </el-button>
              </div>
              <div>
                <el-button text type="primary" icon="Notebook" size="small" @click="orguserlistbtn(scope.row)">查看证书
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


    <OrgDetails @savebtn="delsavebtn" ref="OrgDetailsRef"></OrgDetails>

    <UserDetails ref="UserDetailsRef"></UserDetails>

    <OrgUserLsit ref="OrgUserListRef"></OrgUserLsit>


  </div>
</template>

<script setup>


import OrgDetails from "@/view/admin/org/org_details.vue"//详情组件

import UserDetails from "@/view/admin/user/user_details.vue" //用户详情

import OrgUserLsit from "@/view/admin/org/org_user_list.vue" //证书列表

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
const UserUpdRef = ref(null) //新增 修改组件
const OrgDetailsRef = ref(null)//详情组件
const UserDetailsRef = ref(null) //用户详情
const OrgUserListRef = ref(null) //证书列表

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

//跳转到企查查
const  goherf=(e)=>{
  var url = `https://www.tianyancha.com/search?key=${e.scCode}`
  window.open(url, '_blank')
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

//解除冻结按钮
const frozenbtn = async (e) => {
  const res = await proxy.$api.AdminApi.NoDelOrg({
    id: e.id
  });
  await getlist();
}

//查看详情
const detailsbtn = (type, e) => {
  OrgDetailsRef.value.blockfunc(type, e);
}

//查看证书
const orguserlistbtn = (e) => {
  OrgUserListRef.value.blockfunc(e);
}

//监听冻结按钮返回
const delsavebtn = async (e) => {
  await getlist();
}

//点击添加 修改
const updbtn = async (type, e) => {
  UserUpdRef.value.blockfunc(type, e);
}

//添加 修改账号的回调
const updsavebtn = async (e) => {
  await getlist();
}

//点击前台用户
const userbtn =  (e) => {
  var data = {
    type:'del',
    id:e.userId
  }
   UserDetailsRef.value.blockfunc("det", data)
}

//获取列表
const getlist = async (e) => {
  const res = await proxy.$api.AdminApi.Orglist({
    search: formdata.value.search,
    status: formdata.value.status,
    page: page.value,
    limit: limit.value,
  });
  res.data.list.forEach((item, index) => {
    item.logo =item.logo ? `${proxy.$utils.imgurl}${item.logo}`:''
    item.licenseImg =item.licenseImg ? `${proxy.$utils.imgurl}${item.licenseImg}`:''
    item.srcList = [item.logo, item.licenseImg]
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
