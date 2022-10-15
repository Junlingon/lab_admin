<template>
  <el-dialog v-model="dialogTableVisible" title="账号管理" width="70%" @close="clearbtn">
    <el-form :model="formdata" ref="formref" class="demo-form-inline" label-position="right" label-width="70px">
      <el-form-item label="账号:" prop="username">
        <el-input v-model="formdata.username" placeholder="账号"/>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import {ref, getCurrentInstance} from "vue";
import {ElMessage} from "element-plus";

const {proxy, ctx} = getCurrentInstance();

const formref = ref(null)

const id = ref(); //id
const nowtype = ref('');//add 添加  upd 修改
const dialogTableVisible = ref(false)
const formdata = ref({
  username: '',//账号

})
const authlist = ref([])//权限列表



//清空数据
const clearbtn = async (e) => {
  dialogTableVisible.value = false;
  formref.value.resetFields();
}

// 声明点击确定返回事件
const emit = defineEmits(['savebtn'])
//提交接口
const savebtn = async (e) => {


  if (nowtype.value == 'add') {
    //新增管理员账号
    await proxy.$api.AdminApi.AdminAdd({
      roleId: formdata.value.roleId,
      username: formdata.value.username,
      nickname: formdata.value.nickname,
      password: formdata.value.password,
      iphone: formdata.value.iphone,
    });
  } else if (nowtype.value == 'upd') {
    await proxy.$api.AdminApi.AdminUpd({
      roleId: formdata.value.roleId,
      username: formdata.value.username,
      nickname: formdata.value.nickname,
      iphone: formdata.value.iphone,
      id:id.value
    });
  }
  dialogTableVisible.value = false;
  emit('savebtn', 'ok')
}

//获取详情
const getdetails = async (e) => {
  const res = await proxy.$api.AdminApi.AuditDetails({id: id.value});
  formdata.value = res.data;
}


//获取全部权限
const  getrollist=async (e)=>{
  const res = await proxy.$api.AdminApi.AuditAll({id: id.value});
}

//暴露方法 给父组件调用
defineExpose({
  //父组件调用 初始化方法
  blockfunc(type, e) {
    dialogTableVisible.value = true;
    nowtype.value = type;
    if(nowtype.value=="upd"){
      id.value = e.id;
      getdetails();
    }
    getrollist();
  },


})

</script>


<style lang="less" scoped>

</style>
