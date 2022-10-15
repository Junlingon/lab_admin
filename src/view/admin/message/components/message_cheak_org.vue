<template>
  <div class="userlist">
    <el-card shadow="always">
      <el-form :inline="true" :model="formdata" @submit.native.prevent>
        <el-form-item label="搜索">
          <el-input   @keyup.enter.native="searchbtn"  v-model="formdata.search" clearable placeholder="搜索"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchbtn">搜索</el-button>
          <el-button type="info" @click="clear">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mt20">
      <el-table ref="multipleTableRef" :data="list" style="width: 100%"  border scrollbar-always-on
                max-height="400" :row-class-name="tableRowClassName">
        <el-table-column label="名称" prop="groupName"/>

        <el-table-column label="log">
          <template #default="scope">
            <el-avatar :src="scope.row.logo"/>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <div class="dfw">
              <div>
                <el-button text type="primary" icon="Plus" size="small" @click="addcheaklistbtn(scope.row)">加入待选</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>

    </el-card>
  </div>
</template>

<script setup>

import {ElMessage, ElMessageBox} from 'element-plus'
import {ref, getCurrentInstance, onMounted, nextTick} from "vue";

const {proxy, ctx} = getCurrentInstance();


const limit = ref(10) //每页条数
const page = ref(1) //当前页数
const totalCount = ref(0) //总条数
const list = ref([]) //全部数据
const formdata = ref({
  search: '', //搜索
  status: '',
})

const cheaklist = ref([]);//选中的

const UserUpdRef = ref(null) //新增 修改组件
const UserDetailsRef = ref(null)//详情组件

const multipleTableRef = ref(null)//表格

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

//选中变色
const tableRowClassName = ({row, rowIndex,}) => {
  var ids = [];
  cheaklist.value.forEach(item => {
    ids.push(item.id)
  })
  if (ids.includes(row.id)) {
    return 'success-row'
  }
  return ''
}

// 声明点击加入待选返回事件
const emit = defineEmits(['chang'])

//点击加入待选
const addcheaklistbtn =(e=>{
  var ids = [];
  cheaklist.value.forEach(item => {
    ids.push(item.id)
  })
  if(!ids.includes(e.id)){
    cheaklist.value.push(e);
  }
  emit('chang',cheaklist.value )
})



//获取列表
const getlist = async (e) => {
  const res = await proxy.$api.AdminApi.Orglist({
    search: formdata.value.search,
    status: formdata.value.status,
    page: page.value,
    limit: limit.value,
  });
  list.value = res.data.list;
  totalCount.value = res.data.totalCount;
}


onMounted(() => {
  getlist();
});


</script>


<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<style lang="less" scoped>
.userlist {

}
</style>
