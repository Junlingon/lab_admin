<template>
  <div class="userlist">
    <el-card shadow="always">
      <el-form :inline="true" :model="formdata" @submit.native.prevent>
        <!--        <el-form-item label="搜索">-->
        <!--          <el-input @submit.native.prevent v-model="formdata.search" clearable placeholder="搜索"/>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="用户状态">-->
        <!--          <el-select v-model="formdata.status" clearable placeholder="用户状态">-->
        <!--            <el-option label="正常" value="1"/>-->
        <!--            <el-option label="冻结" value="2"/>-->
        <!--            <el-option label="注销" value="3"/>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item>-->
        <!--          <el-button type="primary" @click="searchbtn">搜索</el-button>-->
        <!--          <el-button type="info" @click="clear">重置</el-button>-->
        <!--        </el-form-item>-->
        <el-form-item>
          <el-button type="info" @click="delchekitemallbtn">全部移出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mt20">
      <el-table
        :data="usercheaklist"
        style="width: 100%"
        stripe
        border
        scrollbar-always-on
        max-height="400"
      >
        <el-table-column label="昵称" prop="name" />
        <el-table-column label="头像">
          <template #default="scope">
            <el-avatar :src="scope.row.headrImg" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="认证状态" prop="certificationStatus">
          <template #default="scope">
            <el-tag type="" v-if="scope.row.certificationStatus==1||scope.row.certificationStatus==0"> 未认证</el-tag>
            <el-tag type="success" v-if="scope.row.certificationStatus==2"> 已认证</el-tag>
            <el-tag type="info" v-if="scope.row.certificationStatus==3"> 审核中</el-tag>
            <el-tag type="danger" v-if="scope.row.certificationStatus==4"> 未通过</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column label="账号状态" prop="type">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status == 1"> 正常</el-tag>
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="scope.row.des"
              placement="top"
            >
              <el-tag type="danger" v-if="scope.row.status == 2"> 冻结</el-tag>
              <el-tag type="info" v-if="scope.row.status == 3"> 已注销</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <!--        <el-table-column label="注册日期" prop="createTime"/>-->
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="scope">
            <div class="dfw">
              <div>
                <el-button
                  text
                  type="primary"
                  icon="CloseBold"
                  size="small"
                  @click="delchekitembtn(scope.row)"
                  >移出</el-button
                >
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
const { proxy, ctx } = getCurrentInstance();

//props
const props = defineProps({
  //移入的数据
  usercheaklist: {
    type: Array,
    default: [],
  },
});

//点击移出
const delchekitembtn = (e) => {
  props.usercheaklist.splice(
    props.usercheaklist.findIndex((item) => item.id === e.id),
    1
  );
  console.log(props.usercheaklist);
};

//点击移除全部
const delchekitemallbtn = () => {
  // emit('delall', 'ok')
  props.usercheaklist.length = 0;
};

//暴露方法 给父组件调用
defineExpose({
  //父组件调用 初始化方法
  blockfunc(e) {
    id.value = e.id;
    type.value = e.type;
  },
});

onMounted(() => {});
</script>

<style lang="less" scoped>
.userlist {
}
</style>
