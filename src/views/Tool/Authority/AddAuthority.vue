<template>
  <div class="div">
    <Loading v-if="loading" />

    <a-row :gutter="[8, 8]">
    <a-col
        class="content"
        :xl="{ span: 24 }"
        :lg="{ span: 24 }"
        :md="{ span: 24 }"
        :sm="{ span: 24 }"
        :xs="{ span: 24 }"
      >
        <div class="setting">
          <div class="search" id="sear_db">
            <a><a-icon type="environment" style="margin-right: 3px"/>新增管理員資料</a>
          </div>
        </div>
        <div class="box_content">
          <div class="box_content_top">
            <div class="bar">
              <i>*</i><a>姓名：</a>
              <a-input class="inputBox" placeholder="請輸入姓名" v-model="name"/>
            </div>
            <div class="bar">
              <i>*</i><a>帳號：</a>
              <a-input class="inputBox" placeholder="請輸入帳號" v-model="username" />
            </div>
            <div class="bar">
              <i>*</i><a>密碼：</a>
              <!-- <a-input class="inputBox" placeholder="請輸入密碼" v-model="password" /> -->
              <a-input-password v-model="password" placeholder="請輸入密碼" class="inputBox"/>
              
            </div>
            <div class="noteBox">
              （ 密碼長度請至少輸入6碼 ）
            </div>
            <div class="bar">
              <i>*</i><a>權限：</a>
              <a-select v-model="authority" placeholder="請選擇權限" class="inputBox">
                <a-select-option v-for="item in authorityArr" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
              <!-- <a-input class="inputBox" placeholder="請選擇權限" v-model="authority" /> -->
            </div>
            <div class="bar">
              <a>備註：</a>
              <a-textarea
                style="margin-right: -10px"
                v-model="comment"
                :auto-size="{ minRows: 2, maxRows: 2 }"
              />
            </div>
          </div>
          <div class="box_content_bottom">
            <!-- <a-button class="button" @click="forwardup">取消新增</a-button> -->
            <a-button type="primary" @click="addUser" class="button" style="margin-left: 10px">儲存資料</a-button>
          </div>
        </div>
       </a-col>
    </a-row>
    <Back @back="forwardup" />
  </div>
</template>

<script>
/* eslint-disable */
import { Modal } from "ant-design-vue";
import Back from "@/components/Back.vue";
import Loading from "@/components/Loading.vue";

import { mapGetters, mapActions, createNamespacedHelpers } from 'vuex';
const user = createNamespacedHelpers('user');

export default {
  data() {
    return {
      loading: false,
      name: "",
      username: "",
      password: "",
      authority: "",
      comment: "",
      // 所有權限
      authorityArr: [
        {
          label: "最高權限",
          value: "admin"
        },
        {
          label: "編輯者",
          value: "editor"
        },
        {
          label: "檢視者",
          value: "viewer"
        }
      ],
    };
  },
  components: {
    Back,
    Loading
  },
  watch: {

  },
  computed: {

  },
  mounted() {
    // 判斷有無token 否則要打回登入頁面
    let token = localStorage.getItem("token")
    if (token == undefined || token == null && token == "") {
      this.$router.push("/");
    }
    
    // 紀錄當前頁面
    localStorage.setItem("pageName", this.$route.name.split("/")[0]);
  },
  methods: {
    ...user.mapActions({
      // 新增管理員
      getAddUser: 'getAddUser',
    }),
    // 上一頁
    forwardup() {
      this.$router.push("/Authority");
    },
    // 新增管理員
    addUser() {
      if (this.name == "" || this.username == "" || this.password == "" || this.authority == "") {
        Modal.warning({
          title: '系統提示',
          content: `請檢查所輸入的資料內容`,
          okText: '確認',
        })
      } else {
        if (this.password.length < 6) {
          Modal.warning({
            title: '系統提示',
            content: `密碼長度需大於6碼`,
            okText: '確認',
          })
        } else {
          this.loading = true;
          this.getAddUser({
            name: this.name,
            username: this.username,
            password: this.password,
            is_admin: this.authority == 'admin' ? true : false,
            is_modulator: this.authority  == 'editor' ? true : false,
            comment: this.comment
          }).then(res => {
            this.loading = false
            let vs = this
            Modal.success({
              title: '系統提示',
              content: '新增成功',
              okText: '確認',
              onOk() {
                vs.name = "";
                vs.username = "";
                vs.password = "";
                vs.authority = "";
                vs.comment = "";
              }
            });
            
          }).catch(error => {
            this.loading = false
            Modal.error({
              title: '系統提示',
              content: '新增失敗，請重新檢查資料',
              okText: '確認'
            });
          })
        }
      }
    },

  },
};
</script>

<style lang="scss" scoped>
@mixin flex($direction: row, $align: flex-start, $justify: flex-start) {
  display: flex;
  flex-direction: $direction;
  align-items: $align;
  justify-content: $justify;
}

.box_content {
  margin: 5px;
  margin-top: 15px;
  min-width: 340px;
  min-height: 80vh;
  background-color: #ffffff;
  box-shadow: 0px 0px 5px #737373;
  border-radius: 10px;
  padding-bottom: 50px;
  overflow-x: auto;
  @include flex(column, space-around, flex-start);
}

.box_content_top {
  min-width: 65%;
  height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.box_content_left {
  width: 50%;
  padding: 20px;
}

.box_content_bottom {
  width: 100%;
  display: flex;
  justify-content: center;
}

.button {
  width: 150px;
  height: 40px;
  font-weight: bold;
  font-size: 16px;
}

@media screen and (max-width: 550px) {
  .box_content {
    width: 340px;
    overflow-x: auto;
  }
}
</style>
