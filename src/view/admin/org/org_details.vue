<template>
  <el-dialog v-model="dialogTableVisible" title="组织详情" width="70%" @close="clearbtn" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-descriptions border :column=" store.openshow ?  1 : 3">
      <el-descriptions-item label="log">
        <!--        <el-avatar :src="myinfo.logo"/>-->
        <el-image
            preview-teleported
            style="width: 50px; height: 50px;"
            :src="myinfo.logo"
            :preview-src-list="srcList"
            :initial-index="0"
            fit="cover"
        />
      </el-descriptions-item>
      <el-descriptions-item label="执照">
        <!--        <el-image style="width: 50px;height: 50px" :src="myinfo.licenseImg"></el-image>-->
        <el-image
            preview-teleported
            style="width: 50px; height: 50px;"
            :src="myinfo.licenseImg"
            :preview-src-list="srcList"
            :initial-index="1"
            fit="cover"
        />
      </el-descriptions-item>
      <el-descriptions-item label="名称">{{ myinfo.groupName }}</el-descriptions-item>
      <el-descriptions-item label="组织编号">{{ myinfo.groupCode }}</el-descriptions-item>
      <el-descriptions-item label="统一社会信用代码">{{ myinfo.scCode }}</el-descriptions-item>
      <el-descriptions-item label="法人">{{ myinfo.legalPerson }}</el-descriptions-item>
      <el-descriptions-item label="前台用户">
        <el-link @click="userbtn(myinfo.user)" type="success">{{ myinfo.user.username }}</el-link>
      </el-descriptions-item>
      <el-descriptions-item label="手机号">{{ myinfo.mobile }}</el-descriptions-item>
      <el-descriptions-item label="有效期">{{ myinfo.overTime }}</el-descriptions-item>
      <el-descriptions-item label="注册日期">{{ myinfo.createTime }}</el-descriptions-item>
      <el-descriptions-item label="组织状态">
        <el-tag v-if="myinfo.status==1" type="success"> 正常</el-tag>
        <el-tag v-if="myinfo.status==2" type="danger"> 冻结</el-tag>
        <el-tag v-if="myinfo.status==3" type="info"> 已过期</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="冻结原因" v-if="myinfo.status==2">
        {{ myinfo.des }}
      </el-descriptions-item>
    </el-descriptions>

    <el-form :model="form" class="mt20" v-if="nowtype=='del'">
      <el-form-item label="冻结原因">
        <el-input v-model="form.text" placeholder="请输入冻结原因"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="savebtn">确定</el-button>
        <el-button @click="clearbtn">取消</el-button>
      </el-form-item>
    </el-form>

    <UserDetails ref="UserDetailsRef"></UserDetails>

  </el-dialog>
</template>

<script setup>

import UserDetails from "@/view/admin/user/user_details.vue" //用户详情

import {ref, onMounted, getCurrentInstance} from "vue";
import {ElMessage} from "element-plus";
import {mainStore} from "@/store/index";

const dialogTableVisible = ref(false)

const {proxy, ctx} = getCurrentInstance();
const store = mainStore();
const nowtype = ref('')
const id = ref()

const srcList = ref([]) //查看图片

const UserDetailsRef = ref(null) //用户详情

//个人信息
const myinfo = ref({
  user: {},
})

//提交信息
const form = ref({
  text: '',
})

//获取详情
const getdetails = async (e) => {
  const res = await proxy.$api.AdminApi.OrgDetails({id: id.value});
  res.data.logo =res.data.logo ? `${proxy.$utils.imgurl}${res.data.logo}`:''
  res.data.licenseImg =res.data.licenseImg ? `${proxy.$utils.imgurl}${res.data.licenseImg}`:''
  myinfo.value = res.data;
  srcList.value = [res.data.logo, res.data.licenseImg]
}

//暴露方法 给父组件调用
defineExpose({
  //父组件调用 初始化方法
  blockfunc(type, e) {
    dialogTableVisible.value = true;
    nowtype.value = type;
    id.value = e.id
    getdetails();
  },
})

//点击前台用户
const userbtn = async (e) => {
  UserDetailsRef.value.blockfunc("det", e)
}


// 声明点击确定返回事件
const emit = defineEmits(['savebtn'])


//添加提交冻结
const savebtn = async () => {
  if (form.value.text == "") {
    ElMessage({
      message: '请填写冻结原因！',
      type: 'warning',
    })
    return
  }
  const res = await proxy.$api.AdminApi.DelOrg({id: id.value, des: form.value.text});
  await clearbtn();
  emit('savebtn', 'ok')
}

//关闭窗口
const clearbtn = () => {
  if(nowtype.value=='del'){
    form.value.text='';
  }
  dialogTableVisible.value = false;
}

onMounted(() => {
});


</script>

<style lang="less"></style>
