<template>
  <el-dialog
    v-model="dialogTableVisible"
    title="项目管理"
    width="70%"
    @close="clearbtn"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="formdata"
      ref="formref"
      class="demo-form-inline"
      label-position="right"
      label-width="70px"
    >
      <el-form-item label="配置名:" prop="name">
        <el-input v-model="formdata.name" placeholder="配置名" />
      </el-form-item>
      <el-form-item label="配置值:" prop="value">
        <el-input v-model="formdata.value" placeholder="配置值" />
      </el-form-item>
      <el-form-item label="标识:" prop="label">
        <el-input v-model="formdata.label" placeholder="标识" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="savebtn()">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
var a = [];

import wangEdtior from "@/components/wangEditor.vue";

import { ref, getCurrentInstance } from "vue";
import { ElMessage } from "element-plus";

const { proxy, ctx } = getCurrentInstance();

const formref = ref(null); //表单ref
const wangEdtiorRef = ref(null); //富文本ref

const wangEdtiorshow = ref(false); //富文本显示

const id = ref(); //id
const nowtype = ref(""); //add 添加  upd 修改
const dialogTableVisible = ref(false); //弹窗显示
const editableTabsValue = ref("基础信息"); //tab
const formdata = ref({
  name: "",
  value: "",
  label: "",
});

//清空数据
const clearbtn = async (e) => {
  dialogTableVisible.value = false;
  editableTabsValue.value = "基础信息";
  formdata.value.label = "";
  formdata.value.value = "";
  formdata.value.name = "";
  wangEdtiorshow.value = false;
};

// 声明点击确定返回事件
const emit = defineEmits(["savebtn"]);
//提交接口
const savebtn = async (e) => {
  if (nowtype.value == "add") {
    //新增
    await proxy.$api.AdminApi.configAdd({
      name: formdata.value.name,
      value: formdata.value.value,
      label: formdata.value.label,
    });
  } else if (nowtype.value == "upd") {
    //修改
    await proxy.$api.AdminApi.configUpdate({
      name: formdata.value.name,
      value: formdata.value.value,
      label: formdata.value.label,
    });
  }
  await clearbtn();
  emit("savebtn", "ok");
};

//获取详情
const getdetails = async (e) => {
  const res = await proxy.$api.AdminApi.MessageDetails({ id: id.value });
  formdata.value = res.data;
  res.data.state = String(res.data.state);
  wangEdtiorshow.value = true;
  setTimeout(() => {
    wangEdtiorRef.value.blockfunc(res.data.msg);
  }, 200);
};

//富文本返回
const changetext = (e) => {
  formdata.value.img = e;
};

//初始化方法
const blockfunc = (type, e) => {
  dialogTableVisible.value = true;
  nowtype.value = type;
  if (nowtype.value == "upd") {
    id.value = e.id;
    getdetails();
  }
  wangEdtiorshow.value = true;
};

//暴露方法 给父组件调用
defineExpose({
  //父组件调用 初始化方法
  blockfunc,
});
</script>


<style lang="less" scoped>
</style>
