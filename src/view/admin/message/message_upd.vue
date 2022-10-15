<template>
  <el-dialog
    v-model="dialogTableVisible"
    title="消息管理"
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
      <el-form-item label="标题:" prop="name">
        <el-input v-model="formdata.title" placeholder="标题" />
      </el-form-item>

      <!-- <el-form-item label="类型:" prop="type">
        <el-radio-group v-model="formdata.type">
          <el-radio label="1" border>官网端消息</el-radio>
          <el-radio label="2" border>组织端消息</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="内容:" prop="msg">
        <wangEdtior
          v-if="wangEdtiorshow"
          @changetext="changetext"
          ref="wangEdtiorRef"
        ></wangEdtior>
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
  title: "", //标题
  type: "", //类型  1pc官网  2组织端
  msg: "", //富文本
});

//清空数据
const clearbtn = async (e) => {
  dialogTableVisible.value = false;
  editableTabsValue.value = "基础信息";
  formdata.value.title = "";
  formdata.value.type = "";
  formdata.value.msg = "";
  wangEdtiorshow.value = false;
};

// 声明点击确定返回事件
const emit = defineEmits(["savebtn"]);
//提交接口
const savebtn = async (e) => {
  var a = formdata.value.msg;
  var context = a.substring(3, a.length - 4);
  if (nowtype.value == "add") {
    //新增
    await proxy.$api.AdminApi.AddMessage({
      title: formdata.value.title,
      // type: formdata.value.type,
      context: context,
    });
  } else if (nowtype.value == "upd") {
    //修改
    await proxy.$api.AdminApi.UpdMessage({
      id: id.value,
      title: formdata.value.title,
      context: context,
    });
  }
  await clearbtn();
  emit("savebtn", "ok");
};

//获取详情
const getdetails = async (e) => {
  const res = await proxy.$api.AdminApi.MessageDetails({ id: id.value });
  formdata.value = res.data;
  res.data.type = String(res.data.type);
  wangEdtiorshow.value = true;
  setTimeout(() => {
    wangEdtiorRef.value.blockfunc(res.data.msg);
  }, 200);
};

//富文本返回
const changetext = (e) => {
  formdata.value.msg = e;
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
