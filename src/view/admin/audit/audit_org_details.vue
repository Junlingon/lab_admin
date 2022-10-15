<template>
  <el-dialog v-model="dialogTableVisible" title="组织详情" width="70%"  @close="clearbtn" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-timeline>
      <template v-for="(item,index) of list" :key="index" >
        <el-timeline-item center  :timestamp="index==0 ?  '当前': '审核'" placement="top" >
          <el-descriptions border :column=" store.openshow ?  1 : 3">
            <el-descriptions-item width="200px" label-class-name="my-label" label="组织名称">{{ item.groupName }}</el-descriptions-item>
            <el-descriptions-item width="200px" label-class-name="my-label" label="法人">{{ item.legalPerson }}</el-descriptions-item>
            <el-descriptions-item width="200px" label-class-name="my-label" label="手机号">{{ item.mobile }}</el-descriptions-item>
            <el-descriptions-item width="200px" label-class-name="my-label" label="统一社会信用代码">
              <el-link icon="Pointer" @click="goherf(item)" type="success">{{item.societyCode}}</el-link>
            </el-descriptions-item>
            <el-descriptions-item width="200px" label="log" label-class-name="my-label">
              <el-image
                  preview-teleported
                  style="width: 50px; height: 50px;"
                  :src="item.logo"
                  :preview-src-list="item.srcList"
                  :initial-index="0"
                  fit="cover"
              />
            </el-descriptions-item>
            <el-descriptions-item width="200px" label="执照" label-class-name="my-label">
              <el-image
                  preview-teleported
                  style="width: 50px; height: 50px;"
                  :src="item.licenseImg"
                  :preview-src-list="item.srcList"
                  :initial-index="1"
                  fit="cover"
              />
            </el-descriptions-item>
            <el-descriptions-item width="200px" label="实名信息" label-class-name="my-label">
              <el-image
                  preview-teleported
                  style="width: 50px; height: 50px;"
                  :src="item.firstImg"
                  :preview-src-list="item.srcList"
                  :initial-index="2"
                  fit="cover"
              />
              <el-image
                  preview-teleported
                  style="width: 50px; height: 50px;margin: 0 0 0 10px"
                  :src="item.lastImg"
                  :preview-src-list="item.srcList"
                  :initial-index="3"
                  fit="cover"
              />
            </el-descriptions-item>
            <el-descriptions-item width="200px" label="日期" label-class-name="my-label">{{ item.createTime }}</el-descriptions-item>
          </el-descriptions>
        </el-timeline-item>
      </template>

    </el-timeline>

    <template v-if="status==3">
      <el-form
          ref="form"
          :model="formdata"
          label-width="auto"
      >
        <el-form-item label="是否通过">
          <el-radio-group v-model="formdata.resource" @change="rediobtn">
            <el-radio border label="通过" />
            <el-radio border label="拒绝" />
          </el-radio-group>
        </el-form-item>

        <el-form-item label="输入原因" v-if="formdata.resource=='拒绝'">
          <el-input v-model="formdata.applicationInfo" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="savebtn">确定</el-button>
        </el-form-item>
      </el-form>
    </template>


  </el-dialog>
</template>

<script setup>

import {ElMessage} from "element-plus";

const dialogTableVisible = ref(false)
import {mainStore} from "@/store/index";
import {ref, onMounted, getCurrentInstance} from "vue";
const {proxy, ctx} = getCurrentInstance();
const store = mainStore();
//个人信息
const list = ref({})
const  status =ref(null);//审核状态 1已通过 2已驳回 3待审核
const  userId= ref('');
const  id =ref('');

//跳转到企查查
const  goherf=(e)=>{
  var url = `https://www.tianyancha.com/search?key=${e.societyCode}`
  window.open(url, '_blank')
}

//是否同意
const  formdata= ref({
  resource:'',
  applicationInfo:''
})

//监听点击同意还是拒绝
const  rediobtn =async (e)=>{

}

// 声明点击确定返回事件
const emit = defineEmits(['savebtn'])

//点击确定提交
const savebtn=async ()=>{

  if(formdata.value.resource==''){
    ElMessage({
      message: '请选择通过还是拒绝！',
      type: 'warning',
    })
    return;
  }

  if(formdata.value.resource=="拒绝"){
    if(formdata.value.applicationInfo==""){
      ElMessage({
        message: '请填写原因！',
        type: 'warning',
      })
      return
    }
    const res = await proxy.$api.AdminApi.AuditOrgN({userId: userId.value,applicationInfo:formdata.value.applicationInfo});
    await  clearbtn();
    emit('savebtn', 'ok')
  }else if(formdata.value.resource=="通过"){
    const res = await proxy.$api.AdminApi.AuditOrgY({userId: userId.value});
    await  clearbtn();
    emit('savebtn', 'ok')
  }

}

//关闭窗口
const clearbtn = async () => {
  formdata.value.resource='';
  formdata.value.applicationInfo='';
  dialogTableVisible.value = false;
}

//获取详情
const getdetails = async (e) => {
  const res = await proxy.$api.AdminApi.AuditOrgDetails({userId: userId.value,id:id.value});
  res.data.forEach(item=>{
    item.logo= item.logo ? `${proxy.$utils.imgurl}${item.logo}`:'';
    item.licenseImg= item.licenseImg ? `${proxy.$utils.imgurl}${item.licenseImg}`:'';
    item.firstImg= item.firstImg ? `${proxy.$utils.imgurl}${item.firstImg}`:'';
    item.lastImg= item.lastImg ? `${proxy.$utils.imgurl}${item.lastImg}`:'';
    item.srcList=[item.logo, item.licenseImg,item.firstImg,item.lastImg]
  })

  if(res.data[1]==null){
    list.value=[res.data[0]];
  }else{
    list.value = res.data;
  }
}

//暴露方法 给父组件调用
defineExpose({
  //父组件调用 初始化方法
  blockfunc(type,e) {
    dialogTableVisible.value = true;
    userId.value=e.userId;
    id.value=e.id;
    status.value=e.status;
    getdetails();
  },

})


</script>

<style lang="less">
.my-label{
  //width: 15%;
}
</style>
