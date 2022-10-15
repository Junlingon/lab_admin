<template>
  <el-dialog
    v-model="dialogTableVisible"
    title="账号详情"
    width="70%"
    @close="clearbtn"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-descriptions border :column="store.openshow ? 1 : 3">
      <el-descriptions-item label="姓名">{{
        myinfo.name
      }}</el-descriptions-item>
      <el-descriptions-item label="头像">
        <!--        <el-avatar :src="myinfo.headrImg"/>-->
        <el-image
          preview-teleported
          style="width: 50px; height: 50px"
          :src="myinfo.headrImg"
          :preview-src-list="srcList"
          :initial-index="1"
          fit="cover"
        />
      </el-descriptions-item>

      <el-descriptions-item label="手机号">{{
        myinfo.iphone
      }}</el-descriptions-item>
      <el-descriptions-item label="注册日期">{{
        myinfo.createTime
      }}</el-descriptions-item>
      <el-descriptions-item label="邮箱">{{
        myinfo.email
      }}</el-descriptions-item>
      <el-descriptions-item label="性别">{{ myinfo.sex }}</el-descriptions-item>

      <el-descriptions-item label="用户状态">
        <el-tag v-if="myinfo.status == 1" type="success"> 正常</el-tag>
        <el-tag v-if="myinfo.status == 2" type="danger"> 冻结</el-tag>
        <el-tag v-if="myinfo.status == 3" type="info"> 已注销</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="冻结原因" v-if="myinfo.status == 2">
        {{ myinfo.des }}
      </el-descriptions-item>
    </el-descriptions>
    <el-form :model="form" class="mt20" ref="formRef" v-if="nowtype == 'del'">
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
const srcList = ref([]); //查看图片列表
//提交信息
const form = ref({
  text: "",
});

const formRef = ref(null); //表单ref

//获取详情
const getdetails = async (e) => {
  const res = await proxy.$api.AdminApi.TeacherDetails({ id: id.value });
  res.data.headrImg = res.data.headrImg
    ? `${proxy.$utils.imgurl}${res.data.headrImg}`
    : "";
  myinfo.value = res.data;
  srcList.value = [res.data.headrImg];
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

//添加提交冻结
const savebtn = async () => {
  if (form.value.text == "") {
    ElMessage({
      message: "请填写冻结原因！",
      type: "warning",
    });
    return;
  }
  const res = await proxy.$api.AdminApi.DelUser({
    id: id.value,
    des: form.value.text,
  });
  dialogTableVisible.value = false;
  emit("savebtn", "ok");
};

//关闭窗口
const clearbtn = async () => {
  if (nowtype.value == "del") {
    form.value.text = "";
  }
  dialogTableVisible.value = false;
};

onMounted(() => {});
</script>

<style lang="less"></style>
