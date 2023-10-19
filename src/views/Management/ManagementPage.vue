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
            <router-link to="ProfileData" class="box_link">
              <!-- <a-icon type="user" /> -->
              <!-- <img src="https://i.imgur.com/XRKf1Fp.jpg" style="width: 55px; hight:55px; border-radius: 50%"/> -->
              <img src="../../assets/profileData.jpg"/>
              
                教友資料
            </router-link>
            <router-link to="BaptizedData" class="box_link">
              <!-- <font-awesome-icon icon="church" /> -->
              <!-- <img src="https://i.imgur.com/BYYcSku.jpg"/> -->
              <img src="../../assets/baptizedData.jpg"/>
                領洗資料
            </router-link>
            <router-link to="EucharistData" class="box_link">
              <!-- <img src="https://i.imgur.com/lLF0w9h.jpg"/> -->
              <img src="../../assets/eucharistData.jpg"/>
                初領聖體資料
            </router-link>
            <router-link to="ConfirmationData" class="box_link">
              <!-- <img src="https://i.imgur.com/gdrCsea.jpg"/> -->
              <img src="../../assets/confirmationData.jpg"/>
                堅振資料
            </router-link>
            <router-link to="MarriageData" class="box_link">
              <!-- <img src="https://i.imgur.com/OcnDgPy.png"/> -->
              <img src="../../assets/marriageData.png"/>
                婚姻資料
            </router-link>
            <router-link to="ArchiveData" class="box_link">
              <img src="../../assets/secure-folder.jpg"/>
                封存資料
            </router-link>
            <router-link to="SpecialHomeNumData" class="box_link">
              <img src="../../assets/visitors.jpg"/>
                訪客家號
            </router-link>
            <router-link to="HomeNumData" class="box_link">
              <img src="../../assets/homeNum.jpg"/>
                管理教友家號
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
    };
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
