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
      <el-form-item label="项目名:" prop="name">
        <el-input v-model="formdata.name" placeholder="项目名" />
      </el-form-item>
      <el-form-item label="负责人:" prop="principal">
        <el-input v-model="formdata.principal" placeholder="负责人" />
      </el-form-item>
      <el-form-item label="进度:" prop="schedule">
        <el-input v-model="formdata.schedule" placeholder="项目进度" />
      </el-form-item>
      <el-form-item label="图片:" prop="img">
        <el-upload
          class="avatar-uploader"
          action="http://121.41.112.205:8088/img/upload"
          accept="jpg,jpeg,png"
          :show-file-list="false"
          :before-upload="handleBeforeUpload"
          :on-success="handleUrlSuccess"
        >
          <img
            style="width: 200px; height: 100px; border: 1px solid #e9e9e9"
            v-if="formdata.showimg"
            :src="formdata.showimg"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="简介:" prop="info">
        <el-input v-model="formdata.info" placeholder="简介" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="savebtn()">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import wangEdtior from "@/components/wangEditor.vue";

import { ref, getCurrentInstance } from "vue";
import { ElMessage } from "element-plus";
var a = [];

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
  principal: "",
  schedule: "",
  img: "",
  info: "",
});

//清空数据
const clearbtn = async (e) => {
  dialogTableVisible.value = false;
  editableTabsValue.value = "基础信息";
  formdata.value.name = "";
  formdata.value.principal = "";
  formdata.value.info = "";
  formdata.value.showimg = "";
  wangEdtiorshow.value = false;
};

// 声明点击确定返回事件
const emit = defineEmits(["savebtn"]);
//提交接口
const savebtn = async (e) => {
  if (nowtype.value == "add") {
    //新增
    await proxy.$api.AdminApi.projectSave({
      name: formdata.value.name,
      principal: formdata.value.principal,
      schedule: formdata.value.schedule,
      img: formdata.value.img,
      info: formdata.value.info,
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
const handleBeforeUpload = (file) => {
  const sufix = file.name.split(".")[1] || "";
  if (!["jpg", "jpeg", "png"].includes(sufix)) {
    ElMessage.error("请上传 jpg、jpeg、png 格式的图片");
    return false;
  }
};
const handleUrlSuccess = (val) => {
  formdata.value.img = val.data || ""; //上传图片参数
  console.log(formdata);
  formdata.value.showimg = val.data ? `${proxy.$utils.imgurl}${val.data}` : ""; //临时创建一个图片地址用于展示
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
