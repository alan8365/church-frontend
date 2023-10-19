<template>
  <div class="div">
    <a-row :gutter="[8, 8]">
      <a-col
        :xl="{ span: 24 }"
        :lg="{ span: 24 }"
        :md="{ span: 24 }"
        :sm="{ span: 24 }"
        :xs="{ span: 24 }"
      >
        <div class="box">
          <div class="box_content">
            <router-link to="Authority" class="box_link" v-if="user_authority !== '' && user_authority == '最高權限'">
              <img src="../../assets/Authority.jpg"/>
                會員管理
            </router-link>
            <router-link to="PrintProfileData" class="box_link">
              <img src="../../assets/IDcard.jpg"/>
                列印教友證
            </router-link>
            <router-link to="PrintProfileCertificate" class="box_link">
              <img src="../../assets/certificate.jpg"/>
                列印領洗及堅振證明
            </router-link>
            
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      signin: false,
      // 使用者權限
      user_authority: ""
    };
  },
  mounted() {
    // 確認權限
    this.user_authority = localStorage.getItem("authority") !== undefined ? localStorage.getItem("authority") : ""
    // 紀錄當前頁面
    localStorage.setItem("pageName", this.$route.name.split("/")[0]);
  },
  methods: {
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

.box {
  margin: 20px 10px;
  height: 100%;
  min-height: 80vh;
  border-radius: 10px;
//   box-shadow: 0px 0px 5px #c0c0c0;
//   background-color: #ffffff;
  @include flex(column, initial, flex-start);
}

.box_content {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.box_link {
  border: none;
  width: 250px;
  height: 180px;;
  background-color: #f5f5f5;
  border-radius: 20px;
  box-shadow: 0px 0px 5px #737373;
  color: #737373;
  font-size: 24px;
  font-weight: bolder;
  text-decoration: none;
  margin: 10px;
  @include flex(column, center, center);
}

.box_link img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 5px;
}

.box_link i {
  font-size: 40px;
  margin-bottom: 5px;
}

.box_link:hover {
  cursor: pointer;
  color: white;
  background-color: var(--primary-color);
  transition: background 0.2s, color 0.2s;
}

@media screen and (max-width: 550px) {
  .box {
    margin: 0 auto;
    margin-bottom: 120px;
  }
}
</style>

