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
            <a><a-icon type="environment" style="margin-right: 3px"/>新增堅振資料</a>
          </div>
        </div>
        <div class="box_content">
          <div class="box_content_top">
            <div class="box_content_left">
                <!-- <div class="bar">
                    <a>堅振編號：</a>
                    <a-input class="inputBox" placeholder="初領領聖體編號" v-model="userNum" disabled/>
                </div>
                <div class="bar">
                    <i>*</i><a>家號：</a>
                    <a-input class="inputBox" placeholder="請輸入家號" v-model="keyName"/>
                </div>
                <div class="bar">
                    <i>*</i><a>姓名：</a>
                    <a-input class="inputBox" placeholder="請輸入姓名" v-model="name"/>
                </div>
                <div class="bar">
                    <i>*</i><a>性別：</a>
                    <a-select v-model="gender" placeholder="請選擇性別" class="inputBox">
                        <a-select-option v-for="item in genderArr" :key="item.value" :value="item.value">
                        {{ item.label }}
                        </a-select-option>
                    </a-select>
                </div> -->
                <div class="bar">
                    <i>*</i><a>教友：</a>
                    <!-- <a-input class="inputBox" placeholder="請輸入聖名" v-model="christian_name"/> -->
                    <a-select 
                      show-search
                      v-model="parishioners" 
                      placeholder="請選擇教友" 
                      class="inputBox"
                      :filter-option="customFilterOption"
                    >
                        <a-select-option v-for="item in parishionersArr" :key="item.value" :value="item.value">
                        {{ item.label }}
                        </a-select-option>
                    </a-select>
                </div>
                <!-- <div class="bar">
                    <i>*</i><a>聖名：</a>
                    <a-input class="inputBox" placeholder="請輸入聖名" v-model="christian_name"/>
                </div> -->
                <div class="bar">
                    <i>*</i><a>堅振教堂：</a>
                    <a-input class="inputBox" placeholder="請輸入堅振教堂" v-model="confirmed_location"/>
                </div>
            </div>
            <div class="box_content_right">
               <div class="bar">
                    <i>*</i><a>堅振日期：</a>
                    <a-date-picker @change="onChangeConfirmationDate" placeholder="請選擇日期" v-model="confirmed_at"/>
                     <div class="searchButton" :style="{ width: scroll_X > 550 ? '0px' : '30px'}"></div>
                </div>
                <div class="bar">
                    <i>*</i><a>堅振司鐸：</a>
                    <a-input class="inputBox" placeholder="請輸入堅振司鐸" v-model="presbyter"/>
                     <div class="searchButton" :style="{ width: scroll_X > 550 ? '0px' : '30px'}"></div>
                </div>
                <div class="bar">
                  <a-radio-group v-model="god" @change="onChangeReceipt" style="margin-left: 15px">
                    <a-radio :value="true">
                      代父
                    </a-radio>
                    <a-radio :value="false">
                      代母
                    </a-radio>
                  </a-radio-group>
                  <a-input v-if="god == true" class="inputBox" placeholder="請輸入姓名" v-model="godfather"/>
                  <a-input v-if="god == false" class="inputBox" placeholder="請輸入姓名" v-model="godmother"/>
                </div>
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
const parishioner = createNamespacedHelpers('parishioner');
const confirmation = createNamespacedHelpers('confirmation');
const households = createNamespacedHelpers('households');

export default {
  data() {
    return {
      loading: false,
      userImg: "",
      keyName: "",
      userNum: "",
      gender: "",
      god: true,
      genderArr: [
        {
          label: "男",
          value: "男"
        },
        {
          label: "女",
          value: "女"
        },
      ],
      name: "",
      confirmed_at: "",
      confirmed_location: "彰化天主堂",
      parishioners: "",
      parishionersArr: [],
      christian_name: "",
      presbyter: "",
      godfather: "",
      godmother: "",
       // 寬度
      scroll_X: document.body.clientWidth
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
    // 取得所有教友
    this.checkAllPresbyter();
  },
  methods: {
    ...parishioner.mapActions({
      // 撈所有教友資料
      getAllParishioners: 'getAllParishioners',
    }),
    ...confirmation.mapActions({
      // 新增堅振資料
      getAddConfirmationm: 'getAddConfirmationm',
    }),
    // 上一頁
    forwardup() {
      this.$router.push("/ConfirmationData");
    },
    // 選擇堅振日期
    onChangeConfirmationDate(date, dateString) {
      // console.log(date, dateString);
      this.confirmed_at = dateString
    },
    // 選擇代父、代母
    onChangeReceipt(value) {
      this.godfather = "";
      this.godmother = "";
      this.god = value.target.value
    },
    // 重新定義可以搜尋到label而不是value而已
    customFilterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    // 取得所有教友
    checkAllPresbyter() {
      this.parishionersArr = [];
      this.getAllParishioners().then(res => {
        this.loading = false
        // console.log("281",res.data);
        // 過濾為領洗的教友
        let data = res.data.filter(x => x.confirmation == undefined)
        if (data !== 0) {
          for (let i = 0; i < data.length; i++) {
            this.parishionersArr.push({
              label: data[i].first_name !== null && data[i].last_name !== null ? data[i].last_name + data[i].first_name : "",
              value: data[i].id
            })
          }
        }
      })
    },
    // 新增堅振資料
    addUser() {
      if (this.parishioners == "" || this.confirmed_location == "" || this.presbyter == "" || this.confirmed_at == "" || (this.godfather == "" && this.godmother == "")) {
        Modal.warning({
          title: '系統提示',
          content: `請檢查所輸入的資料內容`,
          okText: '確認',
        })
      } else {
        this.loading = true
        this.getAddConfirmationm({
          parishioner_id: this.parishioners,
          confirmed_at: this.confirmed_at,
          confirmed_location: this.confirmed_location,
          christian_name: this.christian_name,
          godfather: this.godfather,
          godmother: this.godmother,
          presbyter: this.presbyter,
        }).then(res => {
          this.loading = false
          let vs = this
          Modal.success({
            title: '系統提示',
            content: '新增成功',
            okText: '確認',
            onOk() {
              vs.checkAllPresbyter();
              vs.parishioners = "";
              vs.confirmed_at = "";
              vs.confirmed_location = "";
              vs.christian_name = "";
              vs.godfather = "";
              vs.godmother = "";
              vs.presbyter = "";
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

.bar {
    justify-content: flex-end;
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
  min-width: 80%;
  padding: 20px;
  min-height: 60vh;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.box_content_left,
.box_content_right {
  min-width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
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
    width: 80px;
    margin-left: 10px;
}

@media screen and (max-width: 550px) {
  .box_content {
    width: initial;
    min-width: initial;
    overflow-x: auto;
    margin: initial;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .box_content_top {
    width: 100%;
    padding: 0;
    margin-top: 50px;
    display: flex;
    flex-direction: column;
  }
}
</style>
