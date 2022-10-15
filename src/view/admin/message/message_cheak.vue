<template>
  <el-dialog v-model="dialogTableVisible" title="发送消息" width="70%">
    <div class="mt20">
      <el-radio-group v-model="radio" @change="radiochang">
        <el-radio label="all" border>选择全体</el-radio>
        <el-radio label="us" border>选择用户</el-radio>
      </el-radio-group>
    </div>
    <!--官网用户-->
    <div
      class="mt20"
      style="display: flex; flex-wrap: wrap; justify-content: space-between"
      v-if="radio == 'us'"
    >
      <div style="width: 48%">
        <MessageCheakUser
          @chang="gwaddcheakbtn"
          ref="MessageCheakUserRef"
        ></MessageCheakUser>
      </div>
      <div style="width: 48%">
        <MessageCheakUserList
          :usercheaklist="usercheaklist"
          ref="MessageCheakUserListRef"
        ></MessageCheakUserList>
      </div>
    </div>

    <!--平台用户-->
    <div
      class="mt20"
      style="display: flex; flex-wrap: wrap; justify-content: space-between"
      v-if="radio == 'us' && type == 2"
    >
      <div style="width: 48%">
        <MessageCheakOrg
          @chang="zzdddcheakbtn"
          ref="MessageCheakOrgRef"
        ></MessageCheakOrg>
      </div>
      <div style="width: 48%">
        <MessageCheakOrgList
          :usercheaklist="orgcheaklist"
          ref="MessageCheakOrgListRef"
        ></MessageCheakOrgList>
      </div>
    </div>

    <div class="mt20">
      <el-form>
        <el-form-item>
          <el-button type="primary" @click="savebtn">确定</el-button>
          <el-button @click="clearbtn">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup>
import MessageCheakUser from "@/view/admin/message/components/message_cheak_user.vue";
import MessageCheakUserList from "@/view/admin/message/components/message_cheak_user_list.vue";

import MessageCheakOrg from "@/view/admin/message/components/message_cheak_org.vue";
import MessageCheakOrgList from "@/view/admin/message/components/messag_cheak_org_list.vue";

import { ref, onMounted, getCurrentInstance } from "vue";
import { mainStore } from "@/store/index";
import { ElMessage } from "element-plus";

const dialogTableVisible = ref(false);
const { proxy, ctx } = getCurrentInstance();
const store = mainStore();
const id = ref(""); //id
const type = ref(""); //分类 1 官网消息  2组织端消息
const radio = ref("all"); //all发送全体 us选择用户
const usercheaklist = ref([]); //选中的人员
const orgcheaklist = ref([]); //选中的组织

const MessageCheakUserRef = ref(null); //pc端官网数据
const MessageCheakUserListRef = ref(null); //右侧pc端选中数据

const MessageCheakOrgRef = ref(null); //组织端数据
const MessageCheakOrgListRef = ref(null); //组织端选中数据

//提交信息
const form = ref({
  text: "",
});

//监听pc官网加入待选返回值
const gwaddcheakbtn = (e) => {
  usercheaklist.value = e;
};

//监听组织端加入待选返回值
const zzdddcheakbtn = (e) => {
  orgcheaklist.value = e;
};

//点击选择 全体 用户 清除选中的
const radiochang = (e) => {
  usercheaklist.value = [];
  orgcheaklist.value = [];
};

//获取详情
const getdetails = async (e) => {
  // const res = await proxy.$api.AdminApi.UserDetails({id: id.value});
  // myinfo.value = res.data;
};

//暴露方法 给父组件调用
defineExpose({
  //父组件调用 初始化方法
  blockfunc(e) {
    dialogTableVisible.value = true;
    id.value = e.id;
    type.value = e.type;
    radio.value = "all";
  },
});

// 声明点击确定返回事件
const emit = defineEmits(["savebtn"]);

//添加提交冻结
const savebtn = async () => {
  console.log(usercheaklist.value);
  // type 1 官网消息  2组织端消息
  //radio  all发送全体 us选择用户
  if (radio.value == "all") {
    const res = await proxy.$api.AdminApi.MessagePsotAll({ id: id.value });
  } else if (radio.value == "us") {
    console.log(type);
    var ids = [];

    // if (type.value == 1) {
    //   usercheaklist.value.forEach((item) => {
    //     ids.push(item.id);
    //   });
    // } else if (type.value == 2) {
    //   orgcheaklist.value.forEach((item) => {
    //     ids.push(item.id);
    //   });
    usercheaklist.value.forEach((item) => {
      ids.push(item.id);
    });
    if (ids.length == 0) {
      ElMessage({
        message: `请选择接收人`,
        type: "warning",
      });
      return;
    } else {
      const res = await proxy.$api.AdminApi.MessagePsot({
        id: id.value,
        ids: ids.join(","),
        // title:,
        // context:,
      });
    }
  }
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
