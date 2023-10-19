<template>
  <a-layout id="components-layout-demo-custom-index">
    <Loading v-if="loading" />

    <a-layout class="layout_content">
      <a-layout-header style="background: #ffffff; border-bottom: 3px solid var(--primary-color);">
        <router-link to="/">
          <!-- <img src="https://i.imgur.com/paRdONo.png"/> -->
          <img src="../assets/logo-1.png"/>
         <div class="title">
            <a style="font-size: 16px">財團法人天主教會臺中教區</a>
            <a>彰化天主堂教友系統</a>
          </div>
        </router-link>
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          background: '#F8F8F8',
          backgroundImage: 'url('+ url +')',
          minwidth: '1024px',
          overflow: 'initial',
        }"
      >
        <div class="UserLogincontent_bottom">
          <h1>管理員登入</h1>
          <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="帳號">
              <el-input
                type="text"
                v-model="ruleForm.user"
                name="ACCOUNT"
              ></el-input>
            </el-form-item>
            <el-form-item label="密碼" prop="checkPass" style="margin-top: -30px">
              <a-input-password v-model="ruleForm.checkPass" name="PASSWORD" style="margin-top: 40px"/>
              <div class="noteBox">
                （ 密碼為中、英六碼以上 ）
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm()">送出</el-button>
              <el-button @click="resetForm('ruleForm')">清除</el-button>
              <a-checkbox
                @click="onRemember"
                :checked="checked"
                :style="{ margin: '0px -10px 0px 10px', fontSize: '16px' }"
              >
                記住我
              </a-checkbox>
            </el-form-item>
          </el-form>
        </div>
      </a-layout-content>
      <a-layout-footer
        :style="{
          textAlign: 'center',
          height: '40px',
          background: 'var(--primary-color)',
          color: '#ffffff',
          zIndex: '100'
        }"
      >
        目前系統時間：{{ date | formateItme }}
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
/* eslint-disable */
import { Modal } from "ant-design-vue";
import { mapGetters, mapActions, createNamespacedHelpers } from 'vuex';

import Loading from "../components/Loading.vue";
const user = createNamespacedHelpers('user');

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("請輸入密碼"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    return {
      loading: false,
      checked: false,
      collapsed: false,
      date: new Date(),
      ruleForm: {
        checkPass: "",
        user: "",
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
      },
      url: "https://i.imgur.com/PVPOFhA.jpg"
    };
  },
  components: {
    Loading
  },
  computed: {
    ...mapGetters({
      thisDateTime: 'thisDateTime',
    })
  },
  filters: {
    formateItme(val) {
      let month =
        (new Date().getMonth() + 1) < 10
          ? `0${parseInt(new Date().getMonth().toString()) + 1}`
          : parseInt(new Date().getMonth().toString()) + 1;
      let day =
        new Date().getDate() < 10
          ? `0${new Date().getDate().toString()}`
          : new Date().getDate().toString();
      let date = new Date().getFullYear() + "-" + month + "-" + day;
      let hour =
        new Date().getHours().toString() < 10
          ? `0${new Date().getHours().toString()}`
          : new Date().getHours().toString();
      let min =
        new Date().getMinutes().toString() < 10
          ? `0${new Date().getMinutes().toString()}`
          : new Date().getMinutes().toString();
      let sec =
        new Date().getSeconds().toString() < 10
          ? `0${new Date().getSeconds().toString()}`
          : new Date().getSeconds().toString();
      let time = hour + ":" + min + ":" + sec;
      return date + " " + time;
    },
  },
  mounted() {
    // 取得目前時間
    this.timer = setInterval(() => {
      this.getDateTime()
      this.date = this.thisDateTime;
    }, 1000);
    if (
      localStorage.getItem("remember") === "true" &&
      localStorage.getItem("user") !== ""
    ) {
      this.ruleForm.user = localStorage.getItem("user");
      // this.ruleForm.checkPass = localStorage.getItem("password");
      this.checked = true;
    } else {
      this.ruleForm.user = "";
      this.ruleForm.checkPass = "";
      this.checked = false;
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    ...mapActions({
      // 目前時間
      getDateTime: 'getDateTime',
      // base64解密
      decodeBase64: 'decodeBase64'
    }),
    ...user.mapActions({
      // 登入
      Login: 'Login',
    }),
    // 記住我
    onRemember() {
      this.checked = !this.checked;
      if (this.checked == true) {
        localStorage.setItem("remember", true);
        localStorage.setItem("user", this.ruleForm.user);
        // localStorage.setItem("password", this.ruleForm.checkPass);
      } else {
        localStorage.setItem("remember", false);
        localStorage.setItem("user", "");
        // localStorage.setItem("password", "");
      }
    },
    // 登入
    submitForm() {
      this.loading = true
      this.Login({
        username: this.ruleForm.user,
        password: this.ruleForm.checkPass
      }).then(res => {
        this.loading = false
        this.$message({
          message: '登入成功',
          type: 'success'
        });
        localStorage.setItem("userName", res.data.username);
        if (this.checked == true) {
          localStorage.setItem("remember", true);
          localStorage.setItem("user", this.ruleForm.user);
          // localStorage.setItem("password", this.ruleForm.checkPass);
        } else {
          localStorage.setItem("remember", false);
          localStorage.setItem("user", "");
          // localStorage.setItem("password", "");
        }
        // 將Token存到LS
        localStorage.setItem("token", res.data.token);

        // 從token中解密
        let token = res.data.token.split('.')
        this.decodeBase64(token[1]).then(res => {
          // console.log("212",JSON.parse(res));
          let data = JSON.parse(res)
          let authority = data.is_admin == true ? '最高權限' : data.is_modulator == true ? '編輯者' : '檢視者'
          localStorage.setItem("authority", authority);
        })
        this.$router.push({
            path: `/ManagementPage`,
        });
        
      }).catch(error => {
        this.loading = false
        Modal.error({
          title: '系統提示',
          content: '帳號密碼錯誤，請重新輸入',
          okText: '確認'
        });
      })
    },
    // 清除
    resetForm(formName) {
      this.ruleForm.user = "";
      this.ruleForm.checkPass = "";
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style lang="scss">
@mixin flex($direction: row, $align: flex-start, $justify: flex-start) {
  display: flex;
  flex-direction: $direction;
  align-items: $align;
  justify-content: $justify;
}

#components-layout-demo-custom-index {
  height: 100vh;
}
#components-layout-demo-custom-index .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-index .trigger:hover {
  color: var(--primary-color);
}

#components-layout-demo-custom-index .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

#components-layout-demo-custom-index .ant-menu-item {
  height: 60px !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.ant-menu.ant-menu-dark .ant-menu-item-selected,
.ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
  background-color: initial !important;
}

.ant-menu-dark .ant-menu-item-selected .anticon {
  color: var(--primary-color) !important;
}

.ant-layout {
  background-color: initial !important;
}

#components-layout-demo-custom-index .layout_content {
  min-height: 60% !important;
  margin-bottom: 25px !important;
}

.ant-layout-header {
  position: fixed !important;
  top: 0 !important;
  height: 90px !important;
  width: 100% !important;
  z-index: 500 !important;
  display: flex !important;
  flex-direction: row;
  justify-content: space-between;
  padding: 5px 20px !important;
}

.ant-layout-header a {
  display: flex;
  flex-direction: row;
  font-size: 26px;
  color: #000000;
  letter-spacing: 2px;
  font-weight: bold;
}

.ant-layout-header .title {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  line-height: initial;
}

.ant-layout-header .title:hover > a {
  color: #000000;
  cursor: initial;
}

.ant-layout-header img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin-right: 10px;
}

.ant-layout-content {
  margin-top: 90px !important;
}

#components-layout-demo-custom-index .carousel {
  width: 700px !important;
  padding: 0 15px !important;
  padding-top: 6px !important;
  height: 50px !important;
  margin-left: 20px !important;
  border-radius: 10px;
  box-shadow: 3px 3px 5px rgb(20, 20, 20);
  background: #1e212b !important;
  display: flex;
  flex-direction: row;
  line-height: 38px !important;
}

.carousel h3 {
  color: white;
  font-weight: bold;
  font-size: 22px;
}

#components-layout-demo-custom-index .v-marquee {
  width: 650px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin-top: 2px;
}

#components-layout-demo-custom-index .v-marquee > div {
  width: 600px !important;
}

.ant-layout-footer {
  position: fixed !important;
  bottom: 0 !important;
  width: 100% !important;
  padding: 0 !important;
  padding-top: 10px !important;
  font-size: 15px !important;
  font-weight: bold;
}

.ant-input-affix-wrapper .ant-input:not(:last-child) {
  width: 270px !important;
  height: 40px !important;
}

h1 {
  font-size: 24px !important;
  margin-left: 60px !important;
  // color: white !important;
  margin-bottom: 26px !important;
  font-weight: bold !important;
}

.UserLogincontent_bottom {
  margin-top: -120px;
  min-height: 100vh;
  min-width: 350px !important;
  @include flex(column, center, center);
}

.el-form-item {
  @include flex(row, center, center);
}

.el-form-item__label {
  text-align: center;
  // color: #ffffff !important;
  font-size: 18px !important;
  margin-left: -50px !important;
}

.el-input__inner {
  width: 270px !important;
}

.el-form-item__content {
  margin-left: 5px !important;
}

.el-button--primary {
  font-size: 15px !important;
  font-weight: bold;
  margin-left: 40px !important;
}

.el-button--default {
  font-size: 15px !important;
  font-weight: bold;
}

.bottom span {
  margin-left: 15px;
  color: white;
  padding-left: 10px;
  font-size: 14px;
  font-weight: bold;
}

.bottom:hover > span{
  cursor: pointer;
  color: var(--primary-color);
}

@media screen and (max-width: 550px) {
  .ant-layout {
    width: 100% !important;
    display: inline-flex !important;
  }
  .ant-layout-header {
    z-index: initial !important;
    position: initial !important;
    padding: 10px !important;
    width: 375px !important;
    height: 80px !important;
    align-items: center;
  }

  .ant-layout-header a {
    font-size: 16px;
    color: #000000;
    letter-spacing: 1px;
    font-weight: bold;
  }

  // .ant-layout-header img {
  //   width: auto;
  //   height: auto;
  //   max-width: 100%;
  //   max-height: 100%;
  //   margin-right: 10px;
  // }

  #components-layout-demo-custom-index .carousel {
    margin-top: 10px !important;
    width: 350px !important;
    margin-right: initial !important;
    margin-left: 0 !important;
  }

  #components-layout-demo-custom-index h3 {
    font-size: 18px;
  }

  #components-layout-demo-custom-index .v-marquee {
    width: 350px;
    color: white;
    font-size: 16px;
  }

  #components-layout-demo-custom-index .v-marquee > div {
    width: 320px !important;
  }

  #components-layout-demo-custom-index .ant-layout-content {
    margin-top: initial !important;
  }

  #components-layout-demo-custom-index .layout_content {
    margin-left: 0px !important;
    margin-bottom: 80px !important;
  }
  #components-layout-demo-custom-index .ant-layout-header img {
    width: 60px;
    height: 60px;
    margin-right: 10px;
  }
  .ant-layout-footer {
    height: initial !important;
    padding: 10px 50px !important;
    min-width: 375px !important;
    height: 40px !important;
  }
}
</style>
