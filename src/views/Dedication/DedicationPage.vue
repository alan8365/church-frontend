<template>
  <div class="div">
    <Loading v-if="loading" />
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
            <router-link to="SundayDedication" class="box_link">
              <img src="../../assets/SundayDedication.jpg"/>
                主日奉獻
            </router-link>
            <router-link to="SpecialDedication" class="box_link">
              <img src="../../assets/SpecialDedication.jpg"/>
                特殊奉獻
            </router-link>
          </div>
          <div class="box_content">
            <!-- <router-link to="Statistics" class="box_link">
                統計資料
            </router-link> -->
            <button @click="showMonModal" class="box_link">
              <img src="../../assets/MonthStatistics.jpg"/>
                主日奉獻月統計
            </button>
            <button @click="showYearModal" class="box_link">
              <img src="../../assets/Statistics.jpg"/>
                主日奉獻年統計
            </button>
            <button @click="showSpecialModal" class="box_link">
              <img src="../../assets/SpecialStatistics.jpg"/>
                特殊奉獻統計
            </button>
            <button @click="showSpecialYearModal" class="box_link">
              <img src="../../assets/SpecialYearStatistics.jpg"/>
                特殊奉獻年統計
            </button>
          </div>
          <div class="box_content">
            <button @click="showAllDonations" class="box_link">
              <img src="../../assets/AllDonations.jpg"/>
                綜合奉獻年統計
            </button>
            <button @click="showReceipt" class="box_link">
              <img src="../../assets/ReceiptStatistics.jpg"/>
                捐款收據名冊
            </button>
          </div>
        </div>

        <!-- 月統計資料查詢彈窗 -->
        <a-modal v-model="monModal" title="月統計資料" ok-text="確認" cancel-text="取消" @ok="goMonStatistics" @cancel="cancelSelect">
          <div class="bar">
            <a>月份：</a>
            <a-month-picker @change="onChangeMonDate" placeholder="請選擇月份" v-model="selectedMonDate"/>
          </div>
        </a-modal>
        <!-- 年統計資料查詢彈窗 -->
        <a-modal v-model="yearModal" title="年統計資料" ok-text="確認" cancel-text="取消" @ok="goYearStatistics" @cancel="cancelSelect">
          <div class="bar">
            <a>年份：</a>
            <!-- 年份參考資料：http://www.5imoban.net/jiaocheng/bootstrap/202211155137.html -->
            <a-date-picker
              v-model="selectedYearDate"
              mode="year"
              format="YYYY"
              placeholder="請選擇年份"
              :open="isopen"
              @change="chooseYear"
              @openChange="handYearChange"
              @panelChange="chooseYear"
            ></a-date-picker>
          </div>
        </a-modal>
        <!-- 特殊統計資料查詢彈窗 -->
        <a-modal v-model="specialModal" title="特殊統計資料" ok-text="確認" cancel-text="取消" @ok="goSpecialStatistics" @cancel="cancelSelect">
          <div class="bar">
            <a>年份：</a>
            <!-- 年份參考資料：http://www.5imoban.net/jiaocheng/bootstrap/202211155137.html -->
            <a-date-picker
              v-model="selectedEventYear"
              mode="year"
              format="YYYY"
              placeholder="請選擇年份"
              :open="eventOpen"
              @change="chooseEventYear"
              @openChange="handEventYearChange"
              @panelChange="chooseEventYear"
            ></a-date-picker>
          </div>
          <div class="bar">
            <a>活動：</a>
            <a-select show-search v-model="selectedSpecial" placeholder="請選擇活動" class="inputBox">
                <a-select-option v-for="item in specialArr" :key="item.value" :value="item.value" :disabled='disabled'>
                {{ item.label }}
                </a-select-option>
            </a-select>
          </div>
        </a-modal>
        <!-- 特殊奉獻年統計查詢彈窗 -->
        <a-modal v-model="specialYearModal" title="特殊奉獻年統計" ok-text="確認" cancel-text="取消" @ok="goSpecialYearStatistics" @cancel="cancelSelect">
          <div class="bar">
            <a>年份：</a>
            <a-date-picker
              v-model="selectedSpecialYear"
              mode="year"
              format="YYYY"
              placeholder="請選擇年份"
              :open="specialYearOpen"
              @change="chooseSpecialYear"
              @openChange="handSpecialYearChange"
              @panelChange="chooseSpecialYear"
            ></a-date-picker>
          </div>
        </a-modal>

        <!-- 送公署計資料查詢彈窗 -->
        <a-modal v-model="allDonationsModal" title="綜合奉獻年統計資料" ok-text="確認" cancel-text="取消" @ok="goAllDonationStatistics" @cancel="cancelSelect">
          <div class="bar">
            <a>年份：</a>
            <!-- 年份參考資料：http://www.5imoban.net/jiaocheng/bootstrap/202211155137.html -->
            <a-date-picker
              v-model="selectedAllDonations"
              mode="year"
              format="YYYY"
              placeholder="請選擇年份"
              :open="allDonationsOpen"
              @change="chooseAllDonationsYear"
              @openChange="handAllDonationsYearChange"
              @panelChange="chooseAllDonationsYear"
            ></a-date-picker>
          </div>
        </a-modal>
        <!-- 捐款收據名冊資料查詢彈窗 -->
        <a-modal v-model="receiptModal" title="捐款收據名冊" ok-text="確認" cancel-text="取消" @ok="goReceiptStatistics" @cancel="cancelSelect">
          <div class="bar">
            <a>年份：</a>
            <a-date-picker
              v-model="selectedReceipt"
              mode="year"
              format="YYYY"
              placeholder="請選擇年份"
              :open="receiptOpen"
              @change="chooseReceiptYear"
              @openChange="handReceiptYearChange"
              @panelChange="chooseReceiptYear"
            ></a-date-picker>
          </div>
        </a-modal>

      </a-col>
    </a-row>
  </div>
</template>

<script>
/* eslint-disable */
import Loading from "@/components/Loading.vue";
import { Modal } from "ant-design-vue";
import { mapGetters, mapActions, createNamespacedHelpers } from 'vuex';

const specialDedication = createNamespacedHelpers('specialDedication');

export default {
  data() {
    return {
      loading: false,
      name: "",
      date: "",
      type: "",
      typeArr: [
        {
          label: "主日奉獻",
          value: "sundayDedication"
        },
        {
          label: "特殊奉獻",
          value: "specialDedication"
        },
      ],
      // 年統計資料
      yearModal: false,
      selectedYearDate: "",
      // moment格式
      year: null,
      isopen: false,
      eventOpen: false,
      // 月統計資料
      selectedMonDate: "",
      monModal: false,
      // 特殊統計資料
      selectedEventYear: "",
      selectedSpecial: "",
      specialModal: false,
      specialArr: [],
      // 特殊統計活動欄位開關
      disabled: true,
      // 送公署
      allDonationsOpen: false,
      selectedAllDonations: "",
      allDonationsModal: false,
      // 捐款收據名冊
      receiptOpen: false,
      selectedReceipt: "",
      receiptModal: false,
      // 特殊奉獻年統計
      specialYearOpen: false,
      selectedSpecialYear: "",
      specialYearModal: false,
      // 當年、當月
      nowYear: "",
      nowMonth: "",
    };
  },
  watch: {
    selectedEventYear(val) {
      this.specialArr = []
      // console.log("157",val);
      if (val !== "") {
        this.disabled = false
        this.loading = true
        this.getYearSpecialDonationsEvents({
          date: val
        }).then(res => {
          this.loading = false
          // console.log("272",res.data);
          let data = res.data
          for(let i = 0; i < data.length; i++) {
            this.specialArr.push({
              value: res.data[i].id,
              label: res.data[i].name,
            })
          }
          
        }).catch(error => {
            this.loading = false
            Modal.error({
              title: '系統提示',
              content: '請重新嘗試',
              okText: '確認',
            });
        })
      }
    }
  },
  components: {
    Loading
  },
  computed: {
    ...mapGetters({
        thisDateTime: 'thisDateTime',
    }),
  },
  mounted() {
    // 判斷有無token 否則要打回登入頁面
    let token = localStorage.getItem("token")
    if (token == undefined || token == null && token == "") {
      this.$router.push("/");
    }
    
    // 取得目前時間
    this.getDateTime()
    this.nowMonth = this.thisDateTime.split("-")[1]
    this.nowYear = this.thisDateTime.split("-")[0]

    // 紀錄當前頁面
    localStorage.setItem("pageName", this.$route.name.split("/")[0]);
  },
  methods: {
    ...specialDedication.mapActions({
      // 撈所有特殊奉獻活動
      getAllSpecialDonationsEvents: 'getAllSpecialDonationsEvents',
      // 撈對應年份有的活動
      getYearSpecialDonationsEvents: 'getYearSpecialDonationsEvents'
    }),
    ...mapActions({
      // 目前時間
      getDateTime: 'getDateTime',
    }),
    // 特殊統計資料彈窗
    goSpecialStatistics() {
      if (this.selectedSpecial == "" || this.selectedEventYear == "") {
        Modal.warning({
          title: '系統提示',
          content: '請檢查資料',
          okText: '確認',
        });
      } else {
        let event_name = this.specialArr.filter(x => x.value == this.selectedSpecial)[0].label
        localStorage.setItem("event_name", event_name)
        localStorage.setItem("event_id", this.selectedSpecial)
        localStorage.setItem("date", this.selectedEventYear)
        this.$router.push("SpecialStatistics");
      }
    },
    // 月統計資料彈窗
    goMonStatistics() {
      if (this.selectedMonDate == "") {
        Modal.warning({
          title: '系統提示',
          content: '請檢查資料',
          okText: '確認',
        });
      } else {
        localStorage.setItem("date", this.selectedMonDate.replaceAll("-", "/"))
        this.$router.push("MonthStatistics");
      }
    },
    // 年統計資料查詢彈窗
    goYearStatistics() {
      if (this.selectedYearDate == "") {
        Modal.warning({
          title: '系統提示',
          content: '請檢查資料',
          okText: '確認',
        });
      } else {
        this.loading = true
        localStorage.setItem("date", this.selectedYearDate)
        this.$router.push("Statistics");
      }
    },
    // 特殊年統計資料查詢彈窗
    goSpecialYearStatistics() {
      if (this.selectedSpecialYear == "") {
        Modal.warning({
          title: '系統提示',
          content: '請檢查資料',
          okText: '確認',
        });
      } else {
        this.loading = true
        localStorage.setItem("date", this.selectedSpecialYear)
        this.$router.push("SpecialYearStatistics");
      }
    },
    // 送公署資料查詢彈窗
    goAllDonationStatistics() {
      if (this.selectedAllDonations == "") {
        Modal.warning({
          title: '系統提示',
          content: '請檢查資料',
          okText: '確認',
        });
      } else {
        this.loading = true
        localStorage.setItem("date", this.selectedAllDonations)
        this.$router.push("AllDonations");
      }
    },
    // 捐款收據名冊
    goReceiptStatistics() {
      if (this.selectedReceipt == "") {
        Modal.warning({
          title: '系統提示',
          content: '請檢查資料',
          okText: '確認',
        });
      } else {
        this.loading = true
        localStorage.setItem("date", this.selectedReceipt)
        this.$router.push("ReceiptStatistics");
      }
    },
    // 年統計資料查詢彈窗（原本）
    // goYearStatistics() {
    //   if (this.name == "" && this.date == "" && this.type == "") {
    //     Modal.warning({
    //       title: '系統提示',
    //       content: '請檢查資料',
    //       okText: '確認',
    //     });
    //   } else {
    //     this.loading = true
    //      setTimeout(() => {
    //       this.loading = false
    //       this.$router.push("Statistics");
    //     }, 1000) 
    //   }
    // },
    // 開關年統計時的年份彈窗
    handYearChange(open){
      if(open){
        this.isopen=true
      } else {
        this.isopen=false
      }
    },
    // 開關特殊統計年的年份彈窗
    handEventYearChange(open){
      if(open){
        this.eventOpen=true
      } else {
        this.eventOpen=false
      }
    },
    // 開關特殊統計年的年份彈窗
    handAllDonationsYearChange(open){
      if(open){
        this.allDonationsOpen=true
      } else {
        this.allDonationsOpen=false
      }
    },
    // 開關特殊統計年的年份彈窗
    handSpecialYearChange(open){
      if(open){
        this.specialYearOpen=true
      } else {
        this.specialYearOpen=false
      }
    },
    // 關閉捐款收據名冊年分彈窗
    handReceiptYearChange(open){
      if(open){
        this.receiptOpen=true
      } else {
        this.receiptOpen=false
      }
    },
    // 捐款收據名冊選擇
    chooseReceiptYear (value) {
      this.selectedReceipt = value.format('YYYY')
      this.receiptOpen = false
    },
    // 送公署年選擇
    chooseAllDonationsYear (value) {
      this.selectedAllDonations = value.format('YYYY')
      this.allDonationsOpen = false
    },
    // 特殊統計年選擇
    chooseEventYear (value) {
      this.selectedEventYear = value.format('YYYY')
      this.eventOpen = false
    },
    // 特殊年統計年選擇
    chooseSpecialYear (value) {
      this.selectedSpecialYear = value.format('YYYY')
      this.specialYearOpen = false
    },
    // 年統計選擇的日期
    chooseYear(value) {
      // console.log(value);
      this.selectedYearDate = value.format('YYYY')
      // console.log("138",this.selectedYearDate);
      this.isopen = false
    },
    // 月統計選擇日期
    onChangeMonDate(date, dateString) {
      // console.log(date, dateString);
      this.selectedMonDate = dateString
    },
    // // 選擇日期(原先統計資料)
    // onChangeDate(date, dateString) {
    //   console.log(date, dateString);
    //   this.date = dateString
    // },
    // 日期區間
    getCurrentStyle(current, today) {
      const style = {};
      if (current.date() === 1) {
        style.border = '1px solid #1890ff';
        style.borderRadius = '50%';
      }
      return style;
    },
    // 開特殊年統計
    showSpecialYearModal() {
      // this.selectedSpecialYear = ""
      // 預設年
      this.selectedSpecialYear = this.nowYear
      this.specialYearModal = true
    },
    // 開特殊統計
    showSpecialModal() {
      // this.selectedEventYear = ""
      // 預設年
      this.selectedEventYear = this.nowYear
      this.selectedSpecial = ""
      // 原先直接撈所有奉獻資料
      // this.getAllSpecialDonationsEvents().then(res => {
      //   this.loading = false
      //   // console.log("272",res.data);
      //   let data = res.data
      //   for(let i = 0; i < data.length; i++) {
      //     this.specialArr.push({
      //       value: res.data[i].id,
      //       label: res.data[i].name,
      //     })
      //   }
        
      // }).catch(error => {
      //     this.loading = false
      //     Modal.error({
      //       title: '系統提示',
      //       content: '請重新嘗試',
      //       okText: '確認',
      //     });
      // })
      this.specialModal = true
    },
    // 開月統計
    showMonModal() {
      this.selectedMonDate = ""
      // 預設年、月
      this.selectedMonDate = this.nowYear+ "-"+ this.nowMonth
      this.monModal = true
    },
    // 開年統計資料彈窗
    showYearModal() {
      // this.selectedYearDate = ""
      // 預設年
      this.selectedYearDate = this.nowYear
      this.yearModal = true;
    },
    // 開送公署年統計彈窗
    showAllDonations() {
      // this.selectedAllDonations = ""
      // 預設年
      this.selectedAllDonations = this.nowYear
      this.allDonationsModal = true
    },
    // 開送捐款收據名冊彈窗
    showReceipt() {
      // this.selectedReceipt = ""
      // 預設年
      this.selectedReceipt = this.nowYear
      this.receiptModal = true
    },
    // 關所有統計資料彈窗
    hideModal() {
      this.monModal = false
      this.yearModal = false;
      this.specialModal = false
      this.allDonationsModal = false
      this.receiptModal = false
      this.specialYearModal = false
    },
    // 清除選擇資料
    cancelSelect() {
      this.selectedYearDate = ""
      this.selectedMonDate = ""
      this.selectedSpecial = ""
      this.selectedEventYear = ""
      this.selectedAllDonations = ""
      this.selectedReceipt = ""
      this.selectedSpecialYear = ""
    }
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
