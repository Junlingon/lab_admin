<template>
  <div>
    <div style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 450px; overflow-y: hidden"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
        @onChange="change"
      />
    </div>
  </div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import {
  onBeforeUnmount,
  ref,
  shallowRef,
  onMounted,
  getCurrentInstance,
} from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

const { proxy, ctx } = getCurrentInstance();

const editorRef = shallowRef();
const mode = ref("default");

const valueHtml = ref("");

const toolbarConfig = {
  excludeKeys: ["uploadVideo", "fullScreen"],
};
const editorConfig = { placeholder: "请输入内容...", MENU_CONF: {} };

//富文本上传图片
editorConfig.MENU_CONF["uploadImage"] = {
  server: proxy.$utils.apiurl + "/img/upload",
  fieldName: "file",
  // 单个文件上传成功之后
  customInsert: function (res, insertFn) {
    console.log(res, "resd");
    var img = proxy.$utils.imgurl + res.data;
    console.log(img);
    insertFn(img);
  },
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

//初始化
const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

//初始化方法
const blockfunc = (e) => {
  valueHtml.value = e;
};

//初始化方法
const clearfunc = (e) => {
  valueHtml.value = "";
};

// 声明点击确定返回事件
const emit = defineEmits(["changetext"]);
//监听输入
const change = (e) => {
  emit("changetext", valueHtml.value);
};

//暴露方法 给父组件调用
defineExpose({
  //父组件调用 初始化方法
  blockfunc,
});
</script>

<style lang="less" scoped></style>
