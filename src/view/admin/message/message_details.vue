<template>
  <el-dialog v-model="dialogTableVisible" title="消息详情" width="70%">
    <el-descriptions border :column="store.openshow ? 1 : 3">
      <el-descriptions-item label="标题">{{
        myinfo.title
      }}</el-descriptions-item>
      <el-descriptions-item label="创建日期">{{
        myinfo.updateTime || myinfo.createTime
      }}</el-descriptions-item>
      <el-descriptions-item label="查看内容">
        <el-link @click="lookbtn" type="success">查看内容</el-link>
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag v-if="myinfo.status == 3" type="primary">未发送</el-tag>
        <el-tag v-if="myinfo.status == 4" type="success">已发送</el-tag>
      </el-descriptions-item>

      <el-descriptions-item label="接收人">
        <el-link type="primary" v-if="myinfo.count == 1">全部用户</el-link>
        <el-link type="success" v-if="myinfo.count == 2">指定用户</el-link>
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
    <el-drawer v-model="rightshow" title="查看内容" direction="rtl" size="40%">
      <div v-html="myinfo.context"></div>
    </el-drawer>
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

//内容的显示
const rightshow = ref(false);

//提交信息
const form = ref({
  text: "",
});

//查看内容
const lookbtn = (e) => {
  rightshow.value = true;
};

//获取详情
const getdetails = async (e) => {
  const res = await proxy.$api.AdminApi.MessageDetails({ id: id.value });

  myinfo.value = res.data;
};

//初始化方法
const blockfunc = async (type, e) => {
  dialogTableVisible.value = true;
  nowtype.value = type;
  id.value = e.id;
  await getdetails();
};

//暴露方法 给父组件调用
defineExpose({
  //父组件调用 初始化方法
  blockfunc,
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
