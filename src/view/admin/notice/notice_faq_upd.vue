<template>
  <el-dialog v-model="dialogTableVisible" title="问题管理" width="70%"
             @close="clearbtn" :close-on-click-modal="false"
             :close-on-press-escape="false"
  >
    <el-form :model="formdata" ref="formref" class="demo-form-inline" label-position="right" label-width="70px">
      <el-form-item label="标题:" prop="name">
        <el-input v-model="formdata.name" placeholder="标题"/>
      </el-form-item>
      <el-form-item label="答案:" prop="msg">
        <el-input v-model="formdata.msg" type="textarea" placeholder="答案"/>
      </el-form-item>
      <el-form-item label="排序:" prop="sort">
        <el-input-number
            v-model="formdata.sort"
            :min="1"
            size="small"
        />
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-switch v-model="formdata.status"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="savebtn()">确定</el-button>
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
  name: '',//标题
  msg: '', //答案
  status: true, //状态
  sort: 1,//排序
})


//清空数据
const clearbtn = async (e) => {
  formdata.value.name = '';
  formdata.value.msg = '';
  formdata.value.status = true;
  formdata.value.sort = 1;
  dialogTableVisible.value = false;
}

// 声明点击确定返回事件
const emit = defineEmits(['savebtn'])
//提交接口
const savebtn = async (e) => {

  if (nowtype.value == 'add') {
    //新增管理员账号
    await proxy.$api.AdminApi.AddFaq({
      name: formdata.value.name,
      msg: formdata.value.msg,
      sort: formdata.value.sort,
      status: formdata.value.status == true ? 1 : 2
    });
  } else if (nowtype.value == 'upd') {
    await proxy.$api.AdminApi.UpdFaq({
      id: id.value,
      name: formdata.value.name,
      msg: formdata.value.msg,
      sort: formdata.value.sort,
      status: formdata.value.status == true ? 1 : 2
    });
  }
  dialogTableVisible.value = false;
  emit('savebtn', 'ok')
}

//获取详情
const getdetails = async (e) => {
  const res = await proxy.$api.AdminApi.FaqDetails({id: id.value});
  res.data.status = res.data.status == 1 ? true : false
  formdata.value = res.data;
}

//父组件调用 初始化方法
const blockfunc = async (type, e) => {
  dialogTableVisible.value = true;
  nowtype.value = type;
  if (nowtype.value == "upd") {
    id.value = e.id;
    getdetails();
  }

}

//暴露方法 给父组件调用
defineExpose({
  //父组件调用 初始化方法
  blockfunc


})

</script>


<style lang="less" scoped>

</style>
