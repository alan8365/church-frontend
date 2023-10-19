<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <!-- 選單列 -->
    <a-layout-sider
      defaultCollapsed
      breakpoint="lg"
      collapsed-width="0"
      width="90"
      v-model="collapsed"
      :style="{ background: '#f5f5f5' }"
    >
      <a-menu
        theme="dark"
        mode="vertical"
        :defaultSelectedKeys="[$route.path]"
        :default-selected-keys="['1']"
        :style="{ margin: '0px', background: '#f5f5f5' }"
      >
        <!-- 資料管理 -->
        <a-menu-item
          key="/ManagementPage"
          :style="{ margin: '20px 0px' }"
        >
          <a-icon
            type="snippets"
            :style="{ fontSize: '35px', margin: '0px 2px', marginTop: '10px' }"
          />
          <a>資料管理</a>
          <router-link to="/ManagementPage"></router-link>
        </a-menu-item>

        <!-- 奉獻紀錄 -->
        <a-menu-item
          key="/DedicationPage"
          :style="{ margin: '20px 0px' }"
        >
          <a-icon
            type="pay-circle"
            :style="{ fontSize: '35px', margin: '0px 2px', marginTop: '10px' }"
          />
          <a>奉獻紀錄</a>
          <router-link to="/DedicationPage"></router-link>
        </a-menu-item>

        <!-- 工具箱 -->
        <a-menu-item
          key="/ToolPage"
          :style="{ margin: '20px 0px' }"
        >
          <a-icon
            type="tool"
            :style="{ fontSize: '35px', margin: '0px 2px', marginTop: '10px' }"
          />
          <a>工具箱</a>
          <router-link to="/ToolPage"></router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- 內容 -->
    <a-layout class="layout_content">
      <a-layout-header style="background: #ffffff; border-bottom: 3px solid var(--primary-color);" id="computerUI">
        <router-link to="">
          <!-- <img src="https://i.imgur.com/paRdONo.png"/> -->
          <img src="../assets/logo-1.png"/>
          <div class="title">
            <a style="font-size: 16px">財團法人天主教會臺中教區</a>
            <a>彰化天主堂教友系統</a>
          </div>
         
        </router-link>
        <div class="users">
          <div class="userContent" v-if="userName !== 'undefined'">
            <h4>{{ this.userName }}</h4>
          </div>
          <a-dropdown :trigger="['click']">
            <a-icon
              type="setting"
              :style="{
                fontSize: '22px',
                margin: '-5px 0px 0px 0px',
                color: 'var(--primary-color)',
                cursor: 'pointer',
              }"
            />
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="SignOut">登出</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </a-layout-header>

      <a-layout-header style="background: #ffffff; border-bottom: 3px solid var(--primary-color);" id="phoneUI">
        <div class="phoneHerderTop">
          <router-link to="/">
            <img src="https://i.imgur.com/paRdONo.png"/>
            <div class="title">
              <a style="font-size: 16px">財團法人天主教會臺中教區</a>
              <a>彰化天主堂教友系統</a>
            </div>
            </router-link>
          <div class="users">
            <div class="userContent" v-if="userName !== 'undefined'">
              <h4>{{ this.userName }}</h4>
            </div>
            <a-dropdown :trigger="['click']">
              <a-icon
                type="setting"
                :style="{
                  fontSize: '22px',
                  margin: '-5px 0px 0px 0px',
                  color: 'var(--primary-color)',
                  cursor: 'pointer',
                }"
              />
              <a-menu slot="overlay">
                <a-menu-item>
                  <a @click="SignOut">登出</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </div>
      </a-layout-header>

      <a-layout-content
        :style="{
          margin: '16px',
          minwidth: '1024px',
          overflow: 'initial',
        }"
        ><router-view />
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
import { mapMutations, mapGetters, mapActions, createNamespacedHelpers } from "vuex";

export default {
  data() {
    return {
      collapsed: true,
      dotPosition: "right",
      date: new Date(),
      userName: localStorage.getItem("userName"),
      publicPath: process.env.BASE_URL,
      fullWidth: 0,
      newsContent: "",
    };
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
  computed: {
    ...mapGetters({
        thisDateTime: 'thisDateTime',
    }),
  },
  mounted() {
    // 如果沒有抓到資料跳回登入頁面
    if (
      localStorage.getItem("user") == null ||
      localStorage.getItem("userName") == null
    ) {
      localStorage.setItem("href", this.$route.name.split("/")[0]);
      this.$router.push(`/`);
    } else {
      localStorage.removeItem("href");
    }

    // 取得目前時間
    this.timer = setInterval(() => {
      this.getDateTime()
      this.date = this.thisDateTime;
    }, 1000);

    this.fullWidth = window.innerWidth;
    window.onresize = () => {
      this.fullWidth = window.innerWidth;
    };
    
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
    }),
    // 倒數計時
    countdown() {
      this.time--;
      if (this.time == 0) {
        this.time = 60;
        this.checkPwd();
      }
    },
    SignOut() {
      this.$message({
        message: '已登出',
        type: 'success'
      });
      this.$router.push({
        path: "/",
      });
      // localStorage.setItem("href", "Login");
      localStorage.removeItem("href");
      localStorage.removeItem("userName");
    },
  },
  watch: {
    $route: function(val) {
      // 於手機頁面時切換路徑則關閉BAR
      if (this.fullWidth < 550) {
        if (this.collapsed == false) {
          this.collapsed = !this.collapsed;
        }
      }
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

.loading {
  height: 98vh;
  text-align: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  z-index: 100000;
  @include flex(row, center, center);
}

.ant-layout-sider-zero-width-trigger {
  width: 60px !important;
  height: 66px !important;
  right: -60px !important;
  background: var(--primary-color) !important;
  line-height: 60px !important;
  box-shadow: 0px 0px 5px #000000;
}
#computerUI {
  display: flex !important;
}
#phoneUI {
  display: none !important;
}
// #components-layout-demo-custom-trigger {
//   height: 100vh;
// }
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.ant-layout-sider {
  position: fixed !important;
  height: 100vh !important;
  z-index: 100 !important;
  box-shadow: 0px 0px 5px #7b7b7b;
}

.ant-menu-item {
  height: 80px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  align-items: center !important;
}

.ant-menu.ant-menu-dark .ant-menu-item-selected,
.ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected,
.ant-menu-item:hover,
.ant-menu-item:hover > a,
.ant-menu-dark .ant-menu-item-selected .anticon + a,
.ant-menu-dark .ant-menu-item-selected .anticon,
.ant-menu-dark .ant-menu-submenu-title:hover {
  background-color: initial !important;
  color: var(--primary-color) !important;
  font-weight: bold !important;
}

.ant-layout {
  background-color: initial !important;
}

#components-layout-demo-custom-trigger .layout_content {
  min-height: 60% !important;
  margin-left: 90px !important;
  margin-bottom: 25px !important;
}

.ant-layout-content {
  margin-top: 90px !important;
}

#components-layout-demo-custom-trigger .carousel {
  width: 40%;
  margin-right: 10px;
  // max-width: 700px !important;
  padding: 0 15px !important;
  padding-top: 6px !important;
  height: 50px !important;
  margin-left: 20px !important;
  border-radius: 10px;
  box-shadow: 3px 3px 5px rgb(20, 20, 20);
  background: #ffeecd !important;
  display: flex;
  flex-direction: row;
  line-height: 38px !important;
}

.carousel h3 {
  color: white;
  font-weight: bold;
  font-size: 22px;
}

#components-layout-demo-custom-trigger .v-marquee {
  width: 100%;
  // max-width: 650px !important;
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin-top: 2px;
}

#components-layout-demo-custom-trigger .v-marquee > div {
  width: 100%;
  // max-width: 650px !important;
  display: flex;
  flex-direction: row;
}

#components-layout-demo-custom-trigger .v-marquee > div > div {
  width: 100%;
  // max-width: 650px !important;
  // margin-right: 650px !important;
}

.users {
  min-width: 100px !important;
  // height: 70px !important;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-right: 100px !important;
}

.userContent h4 {
  font-size: 20px;
  font-weight: bold;
  margin-top: 5px;
}

.userContent {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 80px !important;
}

.userContent .ant-dropdown {
  top: 75px !important;
}

.ant-layout-footer {
  position: fixed !important;
  bottom: 0 !important;
  width: 100% !important;
  padding: 0 !important;
  padding-top: 10px !important;
}

.ant-menu-dark .ant-menu-submenu-selected {
  color: var(--primary-color) !important;
}

// .ant-menu-dark,
.ant-menu.ant-menu-dark .ant-menu-item-selected {
  background: #ffeecd !important;
  border-radius: 10%;
}

.ant-layout-sider-children {
  overflow-y: auto;
}

.ant-menu-vertical .ant-menu-submenu-title {
  overflow: initial !important;
}

.ant-menu-submenu .ant-menu-submenu-vertical {
  height: 80px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  align-items: center !important;
}

.ant-menu-submenu span {
  height: 80px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  align-items: center !important;
}

.ant-menu-dark .ant-menu-submenu-title .ant-menu-submenu-arrow::before,
.ant-menu-dark .ant-menu-submenu-title .ant-menu-submenu-arrow::after {
  margin-left: 5px !important;
  margin-top: 10px !important;
}

// .ant-menu-submenu-placement-rightTop {
//   top: 450px !important;
// }

.ant-menu-submenu .ant-menu-item {
  height: 60px !important;
}

.users img {
  width: 50px !important;
  height: 50px !important;
}

.ant-dropdown-menu {
  width: 150px;
}


@media screen and (max-width: 550px) {
  .ant-layout {
    margin: 0 auto !important;
    // margin-bottom: 120px !important;
  }
  #computerUI {
    display: none !important;
  }
  #phoneUI {
    display: flex !important;
    margin: 0 auto !important;
  }
  .phoneHerderTop {
    width: 100%;
    height: 60px !important;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .users {
    margin-right: 0px !important;
  }

  .ant-layout {
    min-width: 300px !important;
    display: inline-flex !important;
  }
  #components-layout-demo-custom-trigger .carousel {
    margin-top: 10px !important;
    width: 350px !important;
    margin-right: initial !important;
    margin-left: 0 !important;
  }
  #components-layout-demo-custom-trigger h3 {
    font-size: 18px;
  }

  #components-layout-demo-custom-trigger .v-marquee {
    width: 350px;
    color: white;
    font-size: 16px;
  }

  #components-layout-demo-custom-trigger .v-marquee > div {
    width: 320px !important;
    display: flex;
    flex-direction: row;
  }

  #components-layout-demo-custom-trigger .v-marquee > div > div {
    width: 320px !important;
    // margin-right: 320px !important;
  }

  .ant-layout-content {
    margin-top: initial !important;
    margin: 24px 13px !important;
    margin: 0 auto !important ;
    margin-bottom: 120px !important;
    width: 350px !important;
  }
  #components-layout-demo-custom-trigger .layout_content {
    margin-left: 0px !important;
    margin-bottom: 80px !important;
    margin: 0 auto !important;
  }
  .ant-layout-footer {
    height: initial !important;
    padding: 10px 50px !important;
    min-width: 375px !important;
    height: 40px !important;
  }
  .ant-layout-sider-children {
    padding-bottom: 100px !important;
  }
  .users {
    min-width: 80px !important;
  } 
  .userContent h4 {
    font-size: 14px !important;
  }
}
</style>
