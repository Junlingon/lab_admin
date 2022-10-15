<template>
  <div class="login">
    <div class="formbox">
      <el-form :model="form" status-icon>
        <el-form-item prop="pass">
          <el-input
            placeholder="请输入账号"
            prefix-icon="user"
            type="text"
            v-model="form.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input
            placeholder="请输入密码"
            prefix-icon="unlock"
            show-password
            type="password"
            v-model="form.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%" type="primary" @click="submitForm()"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import _ from "lodash";
import { ElMessage } from "element-plus";
import { getCurrentInstance, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const { proxy, ctx } = getCurrentInstance();
const $router = useRouter();
//定义参数
const form = ref({
  username: "", //账号
  password: "", //密码
});
//登录按钮
const submitForm = async () => {
  console.log(proxy);
  console.log(proxy.$api);
  if (_.trim(form.value.username) && _.trim(form.value.password)) {
    const res = await proxy.$api.AdminApi.login({
      username: form.value.username,
      password: form.value.password,
    });
    localStorage.setItem("token", res.data.tokenValue);
    $router.push({ path: "/" });
  } else {
    ElMessage({
      dangerouslyUseHTMLString: true,
      message: `请输入正确账号密码`,
      type: "warning",
      showClose: true,
    });
  }
};
</script>

<style lang="less" scoped>
.login {
  width: 100vw;
  height: 100vh;
  background: #2d3a4b;

  .formbox {
    width: 80%;
    max-width: 450px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .el-input {
      display: inline-block;
      width: 100%;
      height: 100%;

      :deep(.el-input__wrapper) {
        width: 100%;
        background: transparent;
        border: none;
        -webkit-appearance: none;
        border-radius: 0px;
        color: #fff;
        caret-color: #fff;
        height: 100%;
        box-shadow: none;

        input:-webkit-autofill {
          box-shadow: 0 0 0px 1000px #283443 inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
}
</style>

