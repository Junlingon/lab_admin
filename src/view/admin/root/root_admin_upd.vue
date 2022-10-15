<template>
  <el-dialog
    v-model="dialogTableVisible"
    title="角色管理"
    width="70%"
    @close="clearbtn"
  >
    <el-form
      :model="formdata"
      ref="formref"
      class="demo-form-inline"
      label-position="right"
      label-width="70px"
    >
      <el-form-item label="角色名:" prop="roleName">
        <el-input v-model="formdata.roleName" placeholder="角色名" />
      </el-form-item>
      <el-form-item label="信息:" prop="roleInfo">
        <el-input v-model="formdata.roleInfo" placeholder="角色信息" />
      </el-form-item>

      <!--      <el-form-item label="权限:" prop="roleId">-->
      <!--        <el-select style="width: 100%" v-model="formdata.roleId" placeholder="选择权限">-->
      <!--          <el-option v-for="(item,index) of authlist " :key="index" :label="item.name" :value="item.id"/>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="savebtn()">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import { ElMessage } from "element-plus";

const { proxy, ctx } = getCurrentInstance();

const formref = ref(null);

const id = ref(); //id
const nowtype = ref(""); //add 添加  upd 修改
const dialogTableVisible = ref(false);
const formdata = ref({
  roleName: "",
  roleInfo: "",
});
const authlist = ref([]); //权限列表

//获取权限列表
const getauthlist = async (e) => {
  const res = await proxy.$api.AdminApi.nopagerauthlist({});
  authlist.value = res.data;
};

//清空数据
const clearbtn = async (e) => {
  dialogTableVisible.value = false;
  formref.value.resetFields();
};

// 声明点击确定返回事件
const emit = defineEmits(["savebtn"]);
//提交接口
const savebtn = async (e) => {
  // if (!formdata.value.username || !formdata.value.password || !formdata.value.iphone || !formdata.value.roleId) {
  //   ElMessage({
  //     message: '请完善信息后提交！',
  //     type: 'warning',
  //   })
  //   return;
  // }

  if (nowtype.value == "add") {
    //新增管理员账号
    await proxy.$api.AdminApi.rolesave({
      // roleId: formdata.value.roleId,
      roleName: formdata.value.roleName,
      roleInfo: formdata.value.roleInfo,
    });
  } else if (nowtype.value == "upd") {
    await proxy.$api.AdminApi.roleupdate({
      // roleId: formdata.value.roleId,
      roleName: formdata.value.roleName,
      roleInfo: formdata.value.roleInfo,
      id: id.value,
    });
  }
  dialogTableVisible.value = false;
  emit("savebtn", "ok");
};

//获取详情
const getdetails = async (e) => {
  const res = await proxy.$api.AdminApi.AdminDetails({ id: id.value });
  formdata.value = res.data;
};

//暴露方法 给父组件调用
defineExpose({
  //父组件调用 初始化方法
  blockfunc(type, e) {
    dialogTableVisible.value = true;
    nowtype.value = type;
    if (nowtype.value == "upd") {
      id.value = e.id;
      getdetails();
    }
    // getauthlist();
  },
});
</script>


<style lang="less" scoped>
</style>
