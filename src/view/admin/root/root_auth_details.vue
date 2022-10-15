<template>
  <el-dialog v-model="dialogTableVisible" title="角色详情" width="70%">
    <el-descriptions border :column="store.openshow ? 1 : 3">
      <el-descriptions-item label="头像">
        <el-avatar :src="myinfo.headImg" />
      </el-descriptions-item>
      <el-descriptions-item label="角色名">{{
        myinfo.roleName
      }}</el-descriptions-item>
      <el-descriptions-item label="角色信息">{{
        myinfo.roleInfo
      }}</el-descriptions-item>
      <el-descriptions-item label="用户状态">
        <el-tag v-if="myinfo.status == 1" type="success"> 正常</el-tag>
        <el-tag v-if="myinfo.status == 2" type="danger"> 失效</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="冻结原因" v-if="myinfo.status == 2">
        {{ myinfo.des }}
      </el-descriptions-item>
    </el-descriptions>

    <el-form :model="form" class="mt20" v-if="nowtype == 'del'">
      <el-form-item label="冻结原因">
        <el-input v-model="form.text" placeholder="请输入冻结原因" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="savebtn">确定</el-button>
        <el-button @click="clearbtn">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import { ElMessage } from "element-plus";
import { mainStore } from "@/store/index";

const dialogTableVisible = ref(false);

const { proxy, ctx } = getCurrentInstance();
const store = mainStore();
const nowtype = ref("");
const id = ref();
//个人信息
const myinfo = ref({});

//提交信息
const form = ref({
  text: "",
});

//获取详情
const getdetails = async (e) => {
  const res = await proxy.$api.AdminApi.roleDetails({ id: id.value });
  myinfo.value = res.data;
};

//暴露方法 给父组件调用
defineExpose({
  //父组件调用 初始化方法
  blockfunc(type, e) {
    dialogTableVisible.value = true;
    nowtype.value = type;
    id.value = e.id;
    getdetails();
  },
});

// 声明点击确定返回事件
const emit = defineEmits(["savebtn"]);

//添加提交
const savebtn = async () => {
  if (form.value.text == "") {
    ElMessage({
      message: "请填写冻结原因！",
      type: "warning",
    });
    return;
  }
  const res = await proxy.$api.AdminApi.DelAdmin({
    id: id.value,
    des: form.value.text,
  });
  dialogTableVisible.value = false;
  emit("savebtn", "ok");
};

//关闭窗口
const clearbtn = () => {
  dialogTableVisible.value = false;
};

onMounted(() => {});
</script>

<style lang="less"></style>
