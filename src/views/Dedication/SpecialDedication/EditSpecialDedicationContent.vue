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
            <a><a-icon type="environment" style="margin-right: 3px"/>編輯「{{event_name}}」奉獻細項</a>
          </div>
          <div class="userNum">
            最後更新時間： {{ updated_at }}
          </div>
        </div>
        <div class="box_content">
          <div class="box_content_top">
            <div class="bar">
              <i style="margin-left: 30px">*</i><a>家號：</a>
              <!-- <a-input class="inputBox" v-model="keyName"/> -->
              <a-select show-search v-model="home_number" placeholder="請選擇家號" class="inputBox">
                  <a-select-option v-for="item in home_numberArr" :key="item.value" :value="item.value">
                  {{ item.label }}
                  </a-select-option>
              </a-select>
              <a-popover placement="right">
                <template slot="content">
                  <p>提示：如果是訪客或企業請至資料管理中「訪客家號」進行新增</p>
                </template>
                <!-- <template slot="title">
                  <span>Title</span>
                </template> -->
                <a-icon type="question-circle" style="margin-left: 10px"/>
              </a-popover>
            </div>
            <div class="bar">
              <i style="margin-right:15px"></i><a style="margin-left: 30px">姓名：</a>
              <a-input class="inputBox" placeholder="請輸入姓名" v-model="name" disabled/>
              <i style="margin-left: 25px"></i>
            </div>
            <div class="bar">
              <i>*</i><a>奉獻日期：</a>
              <a-date-picker @change="onChangeDedicationDate" placeholder="請選擇日期" v-model="donation_at"/>
              <i style="margin-left: 25px"></i>
            </div>
            <div class="bar">
              <i>*</i><a>奉獻金額：</a>
              <a-input-number v-model="donation_amount" :min="0" :max="100000000000" @change="onChangeMoney" />
              <i style="margin-left: 25px"></i>
            </div>
            <div class="bar">
              <a style="margin-left: 30px">備註：</a>
              <a-input class="inputBox" placeholder="請輸入備註" v-model="comment"/>
              <i style="margin-left: 15px"></i>
            </div>
            <div class="bar">
              <i>*</i><a>是否要收據：</a>
              <a-radio-group v-model="receipt" @change="onChangeReceipt" style="margin-left: 15px">
                <a-radio :value="true">
                  是
                </a-radio>
                <a-radio :value="false">
                  否
                </a-radio>
              </a-radio-group>
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
import { Modal } from "ant-design-vue";
import Back from "@/components/Back.vue";
import Loading from "@/components/Loading.vue";

import { mapGetters, mapActions, createNamespacedHelpers } from 'vuex';
const user = createNamespacedHelpers('user');
const households = createNamespacedHelpers('households');
const parishioner = createNamespacedHelpers('parishioner');
const specialDedication = createNamespacedHelpers('specialDedication');

export default {
  data() {
    return {
      loading: false,
      keyName: "",
      name: "",
      donation_at: "",
      donation_amount: "",
      receipt: true,
      comment: "",
      home_number: "",
      home_numberArr: [],
      home_numberArrData: [],
      event_name: localStorage.getItem("event_name"),
      // 最後更新時間
      updated_at: ""
    };
  },
  components: {
    Back,
    Loading
  },
  watch: {
    home_number(val) {
      if (val !== "") { 
        this.name = this.home_numberArrData.filter(x => x.home_number == val)[0].head_of_household !== null 
                    ? this.home_numberArrData.filter(x => x.home_number == val)[0].head_of_household.last_name + this.home_numberArrData.filter(x => x.home_number == val)[0].head_of_household.first_name 
                    : this.home_numberArrData.filter(x => x.home_number == val)[0].comment
      }
    },
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
    // 取得所有家號
    this.checkAllHouseholds();
  },
  methods: {
    ...specialDedication.mapActions({
      // 儲存該活動特殊奉獻細項
      getSaveSpecialDonationsData: 'getSaveSpecialDonationsData',
    }),
    ...households.mapActions({
      // 撈家號資料詳情
      getHouseholdsData: 'getHouseholdsData',
      // 新增家號
      getAddHouseholds: 'getAddHouseholds',
      // 撈所有家號
      getAllHouseholds: 'getAllHouseholds',
      // 儲存家號
      getSaveHouseholdsData: 'getSaveHouseholdsData'
    }),
    // 上一頁
    forwardup() {
      this.$router.push("/SpecialDedication/SpecialDedicationContent");
    },
    // 選擇奉獻日期
    onChangeDedicationDate(date, dateString) {
      // console.log(date, dateString);
      this.donation_at = dateString
    },
    // 奉獻金額
    onChangeMoney(value) {
      this.donation_amount = value
    },
    // 是否要收據
    onChangeReceipt(value) {
      this.receipt = value.target.value
    },
    // 取得所有家號
    checkAllHouseholds() {
      this.loading = true
        this.getAllHouseholds().then(res => {
          // console.log("275",res);
          this.home_numberArrData = res.data
          for (let i = 0; i < res.data.length; i++) {
            this.home_numberArr.push({
              label: res.data[i].head_of_household !== null 
                    ? res.data[i].head_of_household.last_name + res.data[i].head_of_household.first_name + "（" + res.data[i].home_number + "）" 
                    : res.data[i].home_number + "（" + res.data[i].comment + "）" ,
              value: res.data[i].home_number
            })
          }
          // 檢查LS是否有該編輯詳情
          this.checkLSEditData()
          this.loading = false
        })
    },
    // 檢查LS是否有該資料詳情
    checkLSEditData() {
      let data = localStorage.getItem("editData")
      if (data !== null && data !== undefined) {
        this.id = JSON.parse(localStorage.getItem("editData")).id
        this.home_number = JSON.parse(localStorage.getItem("editData")).home_number
        this.donation_at = JSON.parse(localStorage.getItem("editData")).donation_at
        this.name = JSON.parse(localStorage.getItem("editData")).name
        this.donation_amount = JSON.parse(localStorage.getItem("editData")).donation_amount
        this.comment = JSON.parse(localStorage.getItem("editData")).comment
        this.receipt = JSON.parse(localStorage.getItem("editData")).receipt
        // 最後更新時間
        let updated_at = JSON.parse(localStorage.getItem("editData")).updated_at
        const indexOfT = updated_at.indexOf('T');
        const datePart = updated_at.substring(0, indexOfT);
        const timePart = updated_at.substring(indexOfT + 1, updated_at.indexOf('.'));
        const extractedDateTime = datePart + " " + timePart
        this.updated_at = extractedDateTime
      }
    },
    // 儲存該活動特殊奉獻細項
    addUser() {
      if (this.home_number == "" || this.donation_at == "" || this.donation_amount == "") {
        Modal.warning({
          title: '系統提示',
          content: `請檢查所輸入的資料內容`,
          okText: '確認',
        })
      } else {
        this.loading = true
        this.getSaveSpecialDonationsData({
          _id: this.id,
          home_number: this.home_number,
          name: this.name,
          donation_at: this.donation_at,
          donation_amount: this.donation_amount,
          comment: this.comment,
          receipt: this.receipt
        }).then(res => {
          this.loading = false
          let vs = this
          Modal.success({
            title: '系統提示',
            content: '編輯成功',
            okText: '確認',
            onOk() {
              vs.$router.push("/SpecialDedication/SpecialDedicationContent");
            }
          });
        }).catch(error => {
          this.loading = false
          Modal.error({
            title: '系統提示',
            content: '編輯失敗，請重新檢查資料',
            okText: '確認'
          });
        })
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
