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
            <a><a-icon type="environment" style="margin-right: 3px"/>編輯封存資料</a>
          </div>
          <div class="userNum">
            最後更新時間： {{ updated_at }}
          </div>
        </div>
        <div class="box_content">
          <div class="box_content_top">
            <div class="bar">
                <i>*</i><a>遷出日期：</a>
                <a-date-picker @change="onChangeExitDate" placeholder="請選擇日期" v-model="move_out_date"/>
                        
            </div>
            <div class="bar">
                <i>*</i><a>遷出原因：</a>
                <!-- <a-input class="inputBox" placeholder="請輸入遷出原因" v-model="move_out_reason"/> -->
                <a-select v-model="move_out_reason" placeholder="請選擇遷出原因" class="inputBox">
                  <a-select-option v-for="item in move_out_reasonArr" :key="item.value" :value="item.value">
                  {{ item.label }}
                  </a-select-option>
                </a-select>
                  
            </div>
            <div class="bar">
                <a>遷出堂區：</a>
                <a-input class="inputBox" placeholder="請輸入遷出堂區" v-model="destination_parish"/>
                  
            </div>
                
            
          </div>
          <div class="box_content_bottom">
            <!-- <a-button class="button" @click="forwardup">取消編輯</a-button> -->
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
import axios from 'axios';
import { Modal } from "ant-design-vue";
import Back from "@/components/Back.vue";
import Loading from "@/components/Loading.vue";

import { mapGetters, mapActions, createNamespacedHelpers } from 'vuex';

const households = createNamespacedHelpers('households');
const parishioner = createNamespacedHelpers('parishioner');

export default {
  data() {
    return {
      loading: false,
      home_number: "",
      userNum: "",

      move_out_date: "",
      move_out_reason: "",
      destination_parish: "",
      comment: "",

      move_out_reasonArr: [
        {
          label: "遷出",
          value: "遷出"
        },
        {
          label: "死亡",
          value: "死亡"
        },
      ],
      // 最後更新時間
      updated_at: ""
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
    // 檢查LS是否有該編輯詳情
    this.checkLSEditData()
  },
  methods: {
    ...parishioner.mapActions({
      // 儲存教友資料
      getSaveArchiveParishioners: 'getSaveArchiveParishioners',
    }),
    ...mapActions({
        
    }),
    // 上一頁
    forwardup() {
      this.$router.push("/ArchiveData");
    },
    // 選擇遷出日期
    onChangeExitDate(date, dateString) {
      // console.log(date, dateString);
      this.move_out_date = dateString
    },
    // 檢查LS是否有該資料詳情
    checkLSEditData() {
      let data = localStorage.getItem("editData")
      if (data !== null && data !== undefined) {
        this.userNum = JSON.parse(localStorage.getItem("editData")).id
        this.move_out_date = JSON.parse(localStorage.getItem("editData")).move_out_date
        this.move_out_reason = JSON.parse(localStorage.getItem("editData")).move_out_reason
        this.destination_parish = JSON.parse(localStorage.getItem("editData")).destination_parish
        // this.comment = JSON.parse(localStorage.getItem("editData")).comment
        // 最後更新時間
        let updated_at = JSON.parse(localStorage.getItem("editData")).updated_at
        const indexOfT = updated_at.indexOf('T');
        const datePart = updated_at.substring(0, indexOfT);
        const timePart = updated_at.substring(indexOfT + 1, updated_at.indexOf('.'));
        const extractedDateTime = datePart + " " + timePart
        this.updated_at = extractedDateTime
      }
    },
    // 儲存教友資料
    addUser() {
      if (this.move_out_date == "" || this.move_out_reason == "") {
        Modal.warning({
          title: '系統提示',
          content: `請檢查所輸入的資料內容`,
          okText: '確認',
        })
      } else {
        this.loading = true
        this.getSaveArchiveParishioners({
            _id: this.userNum,
            move_in_date: this.move_in_date,
            move_out_date: this.move_out_date,
            move_out_reason: this.move_out_reason,
            destination_parish: this.destination_parish,
            // comment: this.comment
          }).then(res => {
            this.loading = false
              let vs = this
              Modal.success({
                title: '系統提示',
                content: '編輯成功',
                okText: '確認',
                onOk() {
                  vs.$router.push("/ArchiveData");
                }
            })
          }).catch(error => {
            this.loading = false
            Modal.error({
              title: '系統提示',
              content: '編輯失敗，請重新檢查資料',
              okText: '確認'
            });
        });
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

.barImgButton {
  display: flex;
  margin-left: 10px;
  justify-content: center;
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

.box_content_bottom {
  margin-top: 30px;
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

.searchButton {
    width: 50px;
    margin-left: 10px;
}

.updateImgButton {
  width: 85px;
  margin-left: 20px;
}

.imgBox {
  margin-left: 25px;
  width: 125px;
  height: 125px;
}

.imgBox img {
  width: 100%;
}

.titleButton {
  width: 100px;
  height: 30px;
  font-weight: bold;
  font-size: 14px;
  margin-top: 50px;
}

.move_out_box {
  margin-top: 10px;
  background-color: #fff9ef;
  padding: 15px 20px;
  border-radius: 10px;
}

@media screen and (max-width: 550px) {
  .box_content {
    width: 340px;
    overflow-x: auto;
  }
}
</style>
