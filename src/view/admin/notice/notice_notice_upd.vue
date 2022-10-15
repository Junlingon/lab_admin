<template>
  <el-dialog v-model="dialogTableVisible" title="公告管理" width="70%"
             @close="clearbtn" :close-on-click-modal="false"
             :close-on-press-escape="false">
    <el-form :model="formdata" ref="formref" class="demo-form-inline" label-position="right" label-width="70px">
      <el-tabs tab-position="left" style="height: 100%" v-model="editableTabsValue">
        <el-tab-pane label="基础信息" name="基础信息">
          <el-form-item label="标题:" prop="name">
            <el-input v-model="formdata.title" placeholder="标题"/>
          </el-form-item>
          <el-form-item label="排序:" prop="status">
            <el-input-number
                v-model="formdata.sort"
                :min="1"
                size="small"
            />
          </el-form-item>
          <el-form-item label="状态:" prop="status">
            <el-switch v-model="formdata.status"/>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="内容" name="内容" v-if="wangEdtiorshow">
          <el-form-item label="内容:" prop="msg">
            <wangEdtior @changetext="changetext" ref="wangEdtiorRef"></wangEdtior>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="savebtn()">确定</el-button>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-dialog>
</template>

<script setup>

import wangEdtior from '@/components/wangEditor.vue'

import {ref, getCurrentInstance} from "vue";
import {ElMessage} from "element-plus";

const {proxy, ctx} = getCurrentInstance();

const formref = ref(null)//表单ref
const wangEdtiorRef = ref(null) //富文本ref


const id = ref(); //id
const nowtype = ref('');//add 添加  upd 修改
const dialogTableVisible = ref(false)//弹窗显示
const editableTabsValue = ref("基础信息");//tab
const formdata = ref({
  title: '',//标题
  status: true, //状态
  sort: 1,//排序
  context: '',//富文本
})
const wangEdtiorshow = ref(false);//富文本显示

//清空数据
const clearbtn = async (e) => {
  dialogTableVisible.value = false;
  editableTabsValue.value = "基础信息"
  formdata.value.title = '';
  formdata.value.context = '';
  formdata.value.status = true;
  formdata.value.sort = 1;
  wangEdtiorshow.value = false;
}

// 声明点击确定返回事件
const emit = defineEmits(['savebtn'])
//提交接口
const savebtn = async (e) => {
  if (nowtype.value == 'add') {
    //新增管理员账号
    await proxy.$api.AdminApi.AddNotice({
      title: formdata.value.title,
      context: formdata.value.context,
      sort: formdata.value.sort,
      status: formdata.value.status == true ? 1 : 2
    });

  } else if (nowtype.value == 'upd') {
    await proxy.$api.AdminApi.UpdNotice({
      id: id.value,
      title: formdata.value.title,
      context: formdata.value.context,
      sort: formdata.value.sort,
      status: formdata.value.status == true ? 1 : 2
    });
  }
  await clearbtn();
  emit('savebtn', 'ok')

}

//获取详情
const getdetails = async (e) => {
  const res = await proxy.$api.AdminApi.NoticeDetails({id: id.value});
  res.data.status = res.data.status == 1 ? true : false
  formdata.value = res.data;
  wangEdtiorshow.value = true;
  setTimeout(() => {
    wangEdtiorRef.value.blockfunc(res.data.context);
  }, 200)

}


//富文本返回
const changetext = (e) => {
  formdata.value.context = e;
}


//初始化方法
const blockfunc = (type, e) => {
  dialogTableVisible.value = true;
  nowtype.value = type;
  if (nowtype.value == "upd") {
    id.value = e.id;
    getdetails();
  }
  wangEdtiorshow.value = true;
}


//暴露方法 给父组件调用
defineExpose({
  //父组件调用 初始化方法
  blockfunc
})

</script>


<style lang="less" scoped>

</style>
