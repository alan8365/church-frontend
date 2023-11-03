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
            <a><a-icon type="environment" style="margin-right: 3px"/>教友資料細項</a>
          </div>
        </div>
        <div class="box_content">
          <div class="box_content_top">
            <div class="box_content_left">
                <div class="barImg">
                  <a>照片：</a>
                    <div class="imgBox" v-if="updateImg == false">
                      <img :src="getImageUrl" />
                    </div>
                </div>
                <!-- <div class="bar">
                    <a>教友編號：</a>
                    <a-input class="inputBox" placeholder="請輸入教友編號" v-model="userNum" disabled/>
                </div> -->      
                <div class="bar">
                    <a>領洗編號：</a>
                    <div class="textbox">
                      <a>{{ serial_number }}</a>
                    </div>
                </div>
                <div class="bar">
                    <a>姓名：</a>
                    <div class="textbox">
                      <a>{{ name }}</a>
                    </div>
                    <!-- <a-input class="inputBox" placeholder="請輸入姓名" v-model="name" disabled/> -->
                </div>
                <div class="bar">
                    <a>戶長：</a>
                    <div class="textbox">
                      <a>{{ household == true ? '是戶長' : '非戶長' }}</a>
                    </div>
                    <!-- <a-input class="inputBox" placeholder="請輸入姓名" v-model="household" :disabled="household_disabled"/> -->
                    <!-- <a-radio-group v-model="household" @change="onChangeReceipt" style="margin-left: 15px">
                      <a-radio :value="true">
                        是
                      </a-radio>
                      <a-radio :value="false">
                        否
                      </a-radio>
                    </a-radio-group> -->

                </div>
                 <div class="bar">
                    <a>家號：</a>
                    <div class="textbox">
                      <a>{{ home_number }}</a>
                    </div>
                    <!-- 如果是戶長的話手動輸入家號，如果不是戶長則選擇對應的家號 -->
                    <!-- <a-input v-if="household == true" class="inputBox" placeholder="請輸入家號" v-model="home_number"/>
                    <a-select show-search v-if="household == false" v-model="home_number" placeholder="請選擇家號" class="inputBox">
                        <a-select-option v-for="item in home_numberArr" :key="item.value" :value="item.value">
                        {{ item.label }}
                        </a-select-option>
                    </a-select> -->

                    <!-- <a-button class="searchButton" @click="searchHouseholds">查詢戶長</a-button> -->
                </div>
                
                <div class="bar">
                    <a>性別：</a>
                    <div class="textbox">
                      <a>{{ gender }}</a>
                    </div>
                    <!-- <a-select v-model="gender" placeholder="請選擇性別" class="inputBox">
                        <a-select-option v-for="item in genderArr" :key="item.value" :value="item.value">
                        {{ item.label }}
                        </a-select-option>
                    </a-select> -->
                </div>
                <div class="bar">
                    <a>出生日期：</a>
                     <div class="textbox">
                      <a>{{ birth_at }}</a>
                    </div>
                    <!-- <a-date-picker @change="onChangeDate" placeholder="請選擇日期" v-model="birth_at"/> -->
                </div>
                <div class="bar">
                    <a>父親：</a>
                    <div class="textbox">
                      <a>{{ father }}</a>
                    </div>
                    <!-- <a-input class="inputBox" placeholder="請輸入姓名" v-model="father"/> -->
                </div>
                <div class="bar">
                    <a>母親：</a>
                    <div class="textbox">
                      <a>{{ mother }}</a>
                    </div>
                    <!-- <a-input class="inputBox" placeholder="請輸入姓名" v-model="mother"/> -->
                </div>
                <!-- <div class="bar">
                    <a>配偶：</a>
                    <div class="textbox">
                      <a>{{ spouse }}</a>
                    </div>
                    <a-input class="inputBox" placeholder="請輸入姓名" v-model="spouse"/>
                </div> -->
                <div class="bar">
                    <a>手足人數：</a>
                    <div class="textbox">
                      <a>{{ sibling_number }}</a>
                      <span v-if="sibling.length !== 0">
                        <a>（</a>
                        <a v-for="(item, index) in sibling" :key="index">
                          <a v-if="index == 0">{{ item }}</a>
                          <a v-else>{{ "、" + item }}</a>
                        </a>
                        <a>）</a>
                      </span>
                    </div>
                     <!-- <a-input-number v-model="sibling_number" :min="0" :max="10" @change="onChangeBrother" /> -->
                </div>
                <div class="bar">
                    <a>兒女人數：</a>
                    <div class="textbox">
                      <a>{{ children_number }}</a>
                      <span v-if="children.length !== 0">
                        <a>（</a>
                        <a v-for="(item, index) in children" :key="index">
                          <a v-if="index == 0">{{ item }}</a>
                          <a v-else>{{ "、" + item }}</a>
                        </a>
                        <a>）</a>
                      </span>
                    </div>
                     <!-- <a-input-number v-model="children_number" :min="0" :max="10" @change="onChangeKid" /> -->
                </div>
            </div>

            <div class="box_content_right">
              <div class="bar">
                    <a>郵遞區號：</a>
                    <div class="textbox">
                      <a>{{ postal_code }}</a>
                    </div>
                    <!-- <a-input class="inputBox" placeholder="請輸入郵遞區號" v-model="postal_code"/> -->
                     
                </div>
                <div class="bar">
                    <a>地址：</a>
                     <div class="textbox">
                      <a>{{ address }}</a>
                    </div>
                    <!-- <a-input class="inputBox" placeholder="請輸入地址" v-model="address"/> -->
                     
                </div>
                <div class="bar">
                    <a>手機：</a>
                    <div class="textbox">
                      <a>{{ mobile_phone }}</a>
                    </div>
                    <!-- <a-input class="inputBox" placeholder="請輸入手機" v-model="mobile_phone"/> -->
                     
                </div>
                <div class="bar">
                    <a>電話：</a>
                    <div class="textbox">
                      <a>{{ home_phone }}</a>
                    </div>
                    <!-- <a-input class="inputBox" placeholder="請輸入電話" v-model="home_phone"/> -->
                     
                </div>
                <div class="bar">
                    <a>國籍：</a>
                    <div class="textbox">
                      <a>{{ nationality }}</a>
                    </div>
                    <!-- <a-select show-search v-model="nationality" placeholder="請選擇國籍">
                        <a-select-option v-for="country in countries" :key="country.name.common" :value="country.name.common">
                        {{ country.name.common }}
                        </a-select-option>
                    </a-select> -->
                     
                </div>
                <div class="bar">
                    <a>職業：</a>
                    <div class="textbox">
                      <a>{{ profession }}</a>
                    </div>
                    <!-- <a-input class="inputBox" placeholder="請輸入職業" v-model="profession"/> -->
                     
                </div>
                <div class="bar">
                    <a>公司名稱：</a>
                    <div class="textbox">
                      <a>{{ company_name }}</a>
                    </div>
                    <!-- <a-input class="inputBox" placeholder="請輸入公司名稱" v-model="company_name"/> -->
                     
                </div>

                <!-- <div class="bar">
                    <a>領洗：</a>
                    <a-date-picker @change="onChangeBaptizedDate" placeholder="請選擇日期"/>
                     
                </div>
                <div class="bar">
                    <a>領初領聖體：</a>
                    <a-date-picker @change="onChangeEucharistDate" placeholder="請選擇日期"/>
                     
                </div>
                <div class="bar">
                    <a>堅振：</a>
                    <a-date-picker @change="onChangeConfirmationDate" placeholder="請選擇日期"/>
                     
                </div>
                <div class="bar">
                    <a>婚配：</a>
                    <a-date-picker @change="onChangeMarriageDate" placeholder="請選擇日期"/>
                    <a-button class="searchButton" @click="searchMarry">查詢</a-button>
                </div> -->

                <div class="bar">
                    <a>遷入日期：</a>
                    <div class="textbox">
                      <a>{{ move_in_date }}</a>
                    </div>
                    <!-- <a-date-picker @change="onChangeAddDate" placeholder="請選擇日期" v-model="move_in_date"/> -->
                     
                </div>
                <div class="bar">
                    <a>原屬堂區：</a>
                    <div class="textbox">
                      <a>{{ original_parish }}</a>
                    </div>
                    <!-- <a-input class="inputBox" placeholder="請輸入原屬堂區" v-model="original_parish"/> -->
                     
                </div>

                <div class="bar">
                    <a>遷出日期：</a>
                    <div class="textbox">
                      <a>{{ move_out_date }}</a>
                    </div>
                    <!-- <a-date-picker @change="onChangeExitDate" placeholder="請選擇日期" v-model="move_out_date"/> -->
                     
                </div>
                <div class="bar">
                    <a>遷出原因：</a>
                    <div class="textbox">
                      <a>{{ move_out_reason }}</a>
                    </div>
                    <!-- <a-input class="inputBox" placeholder="請輸入遷出原因" v-model="move_out_reason"/> -->
                     
                </div>
                <div class="bar">
                    <a>遷出堂區：</a>
                    <div class="textbox">
                      <a>{{ destination_parish }}</a>
                    </div>
                    <!-- <a-input class="inputBox" placeholder="請輸入遷出堂區" v-model="destination_parish"/> -->
                     
                </div>
                <div class="bar">
                  <a>備註：</a>
                  <div class="textbox">
                      <a>{{ comment }}</a>
                    </div>
                  <!-- <a-textarea
                    v-model="comment"
                    :auto-size="{ minRows: 2, maxRows: 2 }"
                  /> -->
                   
                </div>
            </div>
            
          </div>

          <div class="box_content_top_in">
            <div class="box_content_left">
              <a-button type="primary" class="titleButton">領洗資料</a-button>
              <div class="bar">
                  <a>聖名：</a>
                  <div class="textbox">
                    <a>{{ christian_name }}</a>
                  </div>
              </div>
              <div class="bar">
                  <a>領洗日期：</a>
                  <div class="textbox">
                    <a>{{ baptized_at }}</a>
                  </div>
              </div>
              <div class="bar">
                  <a>領洗日期：</a>
                  <div class="textbox">
                    <a>{{ baptized_at }}</a>
                  </div>
              </div>
               <div class="bar">
                  <a>領洗教堂：</a>
                  <div class="textbox">
                    <a>{{ baptized_location }}</a>
                  </div>
              </div>
              <div class="bar">
                  <a>付洗司鐸：</a>
                  <div class="textbox">
                    <a>{{ baptized_presbyter }}</a>
                  </div>
              </div>
              <div class="bar">
                  <a>代父：</a>
                  <div class="textbox">
                    <a>{{ baptized_godfather }}</a>
                  </div>
              </div>
              <div class="bar">
                  <a>代母：</a>
                  <div class="textbox">
                    <a>{{ baptized_godmother }}</a>
                  </div>
              </div>


              <a-button type="primary" class="titleButton">堅振資料</a-button>
              <div class="bar">
                  <a>堅振日期：</a>
                  <div class="textbox">
                    <a>{{ confirmed_at }}</a>
                  </div>
              </div>
               <div class="bar">
                  <a>堅振教堂：</a>
                  <div class="textbox">
                    <a>{{ confirmed_location }}</a>
                  </div>
              </div>
              <div class="bar">
                  <a>堅振司鐸：</a>
                  <div class="textbox">
                    <a>{{ confirmed_presbyter }}</a>
                  </div>
              </div>
              <div class="bar">
                  <a>代父：</a>
                  <div class="textbox">
                    <a>{{ confirmed_godfather }}</a>
                  </div>
              </div>
              <div class="bar">
                  <a>代母：</a>
                  <div class="textbox">
                    <a>{{ confirmed_godmother }}</a>
                  </div>
              </div>
            </div>

            <div class="box_content_right">
              <a-button type="primary" class="titleButton">初領聖體資料</a-button>
              <div class="bar">
                  <a>初領聖體日期：</a>
                  <div class="textbox">
                    <a>{{ eucharist_at }}</a>
                  </div>
              </div>
               <div class="bar">
                  <a>初領聖體教堂：</a>
                  <div class="textbox">
                    <a>{{ eucharist_location }}</a>
                  </div>
              </div>
              <div class="bar">
                  <a>初領聖體司鐸：</a>
                  <div class="textbox">
                    <a>{{ eucharist_presbyter }}</a>
                  </div>
              </div>
              <div class="bar">
                  <a>代父：</a>
                  <div class="textbox">
                    <a>{{ eucharist_godfather }}</a>
                  </div>
              </div>
              <div class="bar">
                  <a>代母：</a>
                  <div class="textbox">
                    <a>{{ eucharist_godmother }}</a>
                  </div>
              </div>


              <a-button type="primary" class="titleButton">婚姻資料</a-button>
              <div class="bar">
                  <a>配偶：</a>
                  <div class="textbox">
                    <a>{{ spouse }}</a>
                  </div>
              </div>
              <div class="bar">
                  <a>配偶父親：</a>
                  <div class="textbox">
                    <a>{{ spouse_father }}</a>
                  </div>
              </div>
              <div class="bar">
                  <a>配偶母親：</a>
                  <div class="textbox">
                    <a>{{ spouse_mother }}</a>
                  </div>
              </div>
              <div class="bar">
                  <a>婚姻日期：</a>
                  <div class="textbox">
                    <a>{{ marriage_at }}</a>
                  </div>
              </div>
               <div class="bar">
                  <a>婚姻教堂：</a>
                  <div class="textbox">
                    <a>{{ marriage_location }}</a>
                  </div>
              </div>
              <div class="bar">
                  <a>婚姻司鐸：</a>
                  <div class="textbox">
                    <a>{{ marriage_presbyter }}</a>
                  </div>
              </div>
              <div class="bar">
                  <a>見證人1：</a>
                  <div class="textbox">
                    <a>{{ marriage_witness1 }}</a>
                  </div>
              </div>
              <div class="bar">
                  <a>見證人2：</a>
                  <div class="textbox">
                    <a>{{ marriage_witness2 }}</a>
                  </div>
              </div>
              <!-- <div class="bar">
                  <a>新郎：</a>
                  <div class="textbox">
                    <a>{{ marriage_bridegroom }}</a>
                  </div>
              </div>
              <div class="bar">
                  <a>新娘：</a>
                  <div class="textbox">
                    <a>{{ marriage_bride }}</a>
                  </div>
              </div> -->


            </div>
          </div>

          <div class="box_content_bottom">
            <!-- <a-button type="primary" @click="forwardup" class="button" style="margin-right: 10px">返回頁面</a-button> -->
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
      household_disabled: false,
      userImg: "",
      // 是否為戶長
      household: false,
      home_number: "",
      home_numberArr: [],
      head_of_household_id: "",
      userNum: "",
      gender: "",
      genderArr: [
        {
          label: "男",
          value: "男"
        },
        {
          label: "女",
          value: "女"
        },
        // {
        //   label: "未知",
        //   value: "unknown"
        // }
      ],
      name: "",
      birth_at: "",
      father: "",
      mother: "",
      spouse: "",
      sibling_number: 0,
      children_number: 0,
      sibling: [],
      children: [],
      postal_code: "",
      address: "",

      mobile_phone: "",
      home_phone: "",
      nationality: "",
      countries: [],
      profession: "",
      company_name: "",
      baptizedDate: "",
      EucharistDate: "",
      confirmationDate: "",
      marriageDate: "",
      move_in_date: "",
      original_parish: "",
      move_out_date: "",
      move_out_reason: "",
      destination_parish: "",
      getImageUrl: "",
      updateImg: false,
      comment: "",

      // 領洗資料
      christian_name: "",
      baptized_at: "",
      baptized_location: "",
      baptized_presbyter: "",
      baptized_godfather: "",
      baptized_godmother: "",

      // 堅振資料
      confirmed_at: "",
      confirmed_location: "",
      confirmed_presbyter: "",
      confirmed_godfather: "",
      confirmed_godmother: "",

      // 初領聖體資料
      eucharist_at: "",
      eucharist_location: "",
      eucharist_presbyter: "",
      eucharist_godfather: "",
      eucharist_godmother: "",

      // 婚姻資料
      spouse_father: "",
      spouse_mother: "",
      marriage_at: "",
      marriage_location: "",
      marriage_presbyter: "",
      marriage_witness1: "",
      marriage_witness2: "",
      marriage_bridegroom: "",
      marriage_bride: "",

      // 領洗編號
      serial_number: ""
    };
  },
  components: {
    Back,
    Loading
  },
  watch: {
    // home_number(val) {
    //   if (this.household_disabled == true) {
    //     this.home_number = "";
    //     this.household_disabled = false
    //     this.household = ""
    //   } 
    // }
    household(val) {
      this.home_numberArr = []
      this.home_number = ""
      if (val == false) {
        this.loading = true
        this.getAllHouseholds().then(res => {
          this.loading = false
          for (let i = 0; i < res.data.length; i++) {
            this.home_numberArr.push({
              label: res.data[i].head_of_household !== null ? res.data[i].head_of_household.name + "（" + res.data[i].home_number + "）" : res.data[i].home_number ,
              value: res.data[i].home_number
            })
          }
          this.home_number = JSON.parse(localStorage.getItem("editData")).home_number
        })
      } else {
        this.getAllHouseholds().then(res => {
          let data = res.data.filter(x => x.head_of_household !== null)
          if (data.map(x => x.head_of_household.id).indexOf(this.userNum) !== -1) {
            this.household = true
            this.home_number = JSON.parse(localStorage.getItem("editData")).home_number
          } else {
            this.home_number = JSON.parse(localStorage.getItem("editData")).home_number
          }
        })
      } 
    }
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
    // // 取得國籍
    // this.fetchCountries();
    // 取得所有家號
    this.checkAllHouseholds();
    // 檢查LS是否有該編輯詳情
    this.checkLSEditData()
  },
  methods: {
    ...parishioner.mapActions({
      // 儲存教友資料
      getSaveParishionersData: 'getSaveParishionersData',
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
    ...mapActions({
        // 取得國籍
        getCitizenship: 'getCitizenship',
    }),
    // 上一頁
    forwardup() {
      this.$router.push("/ProfileData");
    },
    // 是否為戶長
    onChangeReceipt(value) {
      this.household = value.target.value
    },
    // 選擇出生日期
    onChangeDate(date, dateString) {
      // console.log(date, dateString);
      this.birth_at = dateString
    },
    // 選擇遷入日期
    onChangeAddDate(date, dateString) {
      // console.log(date, dateString);
      this.move_in_date = dateString
    },
    // 選擇遷出日期
    onChangeExitDate(date, dateString) {
      // console.log(date, dateString);
      this.move_out_date = dateString
    },
    // 選擇領洗日期
    onChangeBaptizedDate(date, dateString) {
      // console.log(date, dateString);
      this.baptizedDate = dateString
    },
    // 選擇領初領聖體日期
    onChangeEucharistDate(date, dateString) {
      // console.log(date, dateString);
      this.EucharistDate = dateString
    },
    // 選擇堅振日期
    onChangeConfirmationDate(date, dateString) {
      // console.log(date, dateString);
      this.confirmationDate = dateString
    },
    // 選擇婚姻日期
    onChangeMarriageDate(date, dateString) {
      // console.log(date, dateString);
      this.marriageDate = dateString
    },
    // 手足人數
    onChangeBrother(value) {
       this.sibling_number = value
    },
    // 兒女人數
    onChangeKid(value) {
        this.children_number = value
    },
    // 取得國籍
    fetchCountries() {
        this.loading = true
        this.getCitizenship().then(res => {
            this.loading = false
            let countriesData = res.data
            countriesData = countriesData.sort((a, b) => {
                const nameA = a.name.common.toLowerCase();
                const nameB = b.name.common.toLowerCase();

                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
            this.countries = countriesData
        })
    },
    // 檢查LS是否有該資料詳情
    checkLSEditData() {
      let data = localStorage.getItem("editData")
      if (data !== null && data !== undefined) {
        this.userNum = JSON.parse(localStorage.getItem("editData")).id
        this.getImageUrl = `http://163.17.135.152:7465/api/parishioners/${this.userNum}/picture`
        // console.log("416", this.getImageUrl);
        // 檢查圖片是否存在
        axios.head(this.getImageUrl).then(response => {
          if (response.status === 200) {
            // this.getImageUrl = `http://0.0.0.0:3000/api/parishioners/${this.userNum}/picture`
          } else {
            this.getImageUrl = "https://i.imgur.com/qJc2R7e.png"
          }
        })
        .catch(error => {
          this.getImageUrl = "https://i.imgur.com/qJc2R7e.png"
        });
        // 領洗編號
        this.serial_number = JSON.parse(localStorage.getItem("editData")).baptism !== undefined ? JSON.parse(localStorage.getItem("editData")).baptism.serial_number : ""

        // this.name = JSON.parse(localStorage.getItem("editData")).name
        this.name = JSON.parse(localStorage.getItem("editData")).last_name + JSON.parse(localStorage.getItem("editData")).first_name
        this.home_number = JSON.parse(localStorage.getItem("editData")).home_number
        this.gender = JSON.parse(localStorage.getItem("editData")).gender
        this.birth_at = JSON.parse(localStorage.getItem("editData")).birth_at
        // this.father = JSON.parse(localStorage.getItem("editData")).father
        // this.mother = JSON.parse(localStorage.getItem("editData")).mother
        this.mother = JSON.parse(localStorage.getItem("editData")).mother_instance !== undefined ? JSON.parse(localStorage.getItem("editData")).mother_instance.last_name + JSON.parse(localStorage.getItem("editData")).mother_instance.first_name : JSON.parse(localStorage.getItem("editData")).mother
        this.father = JSON.parse(localStorage.getItem("editData")).father_instance !== undefined ? JSON.parse(localStorage.getItem("editData")).father_instance.last_name + JSON.parse(localStorage.getItem("editData")).father_instance.first_name : JSON.parse(localStorage.getItem("editData")).father
        this.spouse = JSON.parse(localStorage.getItem("editData")).spouse
        this.postal_code = JSON.parse(localStorage.getItem("editData")).postal_code
        this.address = JSON.parse(localStorage.getItem("editData")).address
        this.mobile_phone = JSON.parse(localStorage.getItem("editData")).mobile_phone
        this.home_phone = JSON.parse(localStorage.getItem("editData")).home_phone
        this.nationality = JSON.parse(localStorage.getItem("editData")).nationality
        this.profession = JSON.parse(localStorage.getItem("editData")).profession
        this.company_name = JSON.parse(localStorage.getItem("editData")).company_name
        // 手足、子女數量
        this.sibling_number = JSON.parse(localStorage.getItem("editData")).sibling.count
        this.children_number = JSON.parse(localStorage.getItem("editData")).children.count
        // 手足、子女名字
        this.sibling = JSON.parse(localStorage.getItem("editData")).sibling.data.length !== 0 ? JSON.parse(localStorage.getItem("editData")).sibling.data.map(x => x.last_name + x.first_name) : []
        this.children = JSON.parse(localStorage.getItem("editData")).children.data.length !== 0 ? JSON.parse(localStorage.getItem("editData")).children.data.map(x => x.last_name + x.first_name) : []

        this.move_in_date = JSON.parse(localStorage.getItem("editData")).move_in_date
        this.original_parish = JSON.parse(localStorage.getItem("editData")).original_parish
        this.move_out_date = JSON.parse(localStorage.getItem("editData")).move_out_date
        this.move_out_reason = JSON.parse(localStorage.getItem("editData")).move_out_reason
        this.destination_parish = JSON.parse(localStorage.getItem("editData")).destination_parish
        this.comment = JSON.parse(localStorage.getItem("editData")).comment

        // 領洗資料
        this.christian_name = JSON.parse(localStorage.getItem("editData")).baptism ? JSON.parse(localStorage.getItem("editData")).baptism.christian_name : ""
        this.baptized_at = JSON.parse(localStorage.getItem("editData")).baptism ? JSON.parse(localStorage.getItem("editData")).baptism.baptized_at : ""
        this.baptized_location = JSON.parse(localStorage.getItem("editData")).baptism ?  JSON.parse(localStorage.getItem("editData")).baptism.baptized_location : ""
        this.baptized_presbyter = JSON.parse(localStorage.getItem("editData")).baptism ?  JSON.parse(localStorage.getItem("editData")).baptism.presbyter : ""
        this.baptized_godfather = JSON.parse(localStorage.getItem("editData")).baptism ?  JSON.parse(localStorage.getItem("editData")).baptism.godfather : ""
        this.baptized_godmother = JSON.parse(localStorage.getItem("editData")).baptism ?  JSON.parse(localStorage.getItem("editData")).baptism.godmother : ""

        // 堅振資料
        this.confirmed_at = JSON.parse(localStorage.getItem("editData")).confirmation ? JSON.parse(localStorage.getItem("editData")).confirmation.confirmed_at : ""
        this.confirmed_location = JSON.parse(localStorage.getItem("editData")).confirmation ? JSON.parse(localStorage.getItem("editData")).confirmation.confirmed_location : ""
        this.confirmed_presbyter = JSON.parse(localStorage.getItem("editData")).confirmation ? JSON.parse(localStorage.getItem("editData")).confirmation.presbyter : ""
        this.confirmed_godfather = JSON.parse(localStorage.getItem("editData")).confirmation ? JSON.parse(localStorage.getItem("editData")).confirmation.godfather : ""
        this.confirmed_godmother = JSON.parse(localStorage.getItem("editData")).confirmation ? JSON.parse(localStorage.getItem("editData")).confirmation.godmother : ""

        // 初領聖體資料
        this.eucharist_at = JSON.parse(localStorage.getItem("editData")).eucharist ? JSON.parse(localStorage.getItem("editData")).eucharist.eucharist_at : ""
        this.eucharist_location = JSON.parse(localStorage.getItem("editData")).eucharist ? JSON.parse(localStorage.getItem("editData")).eucharist.eucharist_location : ""
        this.eucharist_presbyter = JSON.parse(localStorage.getItem("editData")).eucharist ? JSON.parse(localStorage.getItem("editData")).eucharist.presbyter : ""
        this.eucharist_godfather = JSON.parse(localStorage.getItem("editData")).eucharist ? JSON.parse(localStorage.getItem("editData")).eucharist.godfather : ""
        this.eucharist_godmother = JSON.parse(localStorage.getItem("editData")).eucharist ? JSON.parse(localStorage.getItem("editData")).eucharist.godmother : ""

        // 婚姻資料
        if (JSON.parse(localStorage.getItem("editData")).wife !== undefined) {
          this.spouse = JSON.parse(localStorage.getItem("editData")).wife.bride
          this.spouse_father = JSON.parse(localStorage.getItem("editData")).wife.bride_father
          this.spouse_mother = JSON.parse(localStorage.getItem("editData")).wife.bride_mother
          this.marriage_at = JSON.parse(localStorage.getItem("editData")).wife.marriage_at
          this.marriage_location = JSON.parse(localStorage.getItem("editData")).wife.marriage_location
          this.marriage_presbyter = JSON.parse(localStorage.getItem("editData")).wife.presbyter
          this.marriage_witness1 = JSON.parse(localStorage.getItem("editData")).wife.witness1
          this.marriage_witness2 = JSON.parse(localStorage.getItem("editData")).wife.witness2
        } else if (JSON.parse(localStorage.getItem("editData")).husband !== undefined) {
          this.spouse = JSON.parse(localStorage.getItem("editData")).husband.groom
          this.spouse_father = JSON.parse(localStorage.getItem("editData")).husband.groom_father
          this.spouse_mother = JSON.parse(localStorage.getItem("editData")).husband.groom_mother
          this.marriage_at = JSON.parse(localStorage.getItem("editData")).husband.marriage_at
          this.marriage_location = JSON.parse(localStorage.getItem("editData")).husband.marriage_location
          this.marriage_presbyter = JSON.parse(localStorage.getItem("editData")).husband.presbyter
          this.marriage_witness1 = JSON.parse(localStorage.getItem("editData")).husband.witness1
          this.marriage_witness2 = JSON.parse(localStorage.getItem("editData")).husband.witness2
        } else {
          this.spouse = ""
          this.spouse_father = ""
          this.spouse_mother = ""
          this.marriage_at = ""
          this.marriage_location = ""
          this.marriage_presbyter = ""
          this.marriage_witness1 = ""
          this.marriage_witness2 = ""
        }
      }
    },
    // 查詢戶長
    searchHouseholds() {
      if (this.home_number == '') {
        Modal.confirm({
          title: '系統提示',
          content: `請輸入家號`,
          okText: '確認',
          cancelText: '取消',
          onOk() {
          },
        });
      } else {
        this.loading = true
        this.getHouseholdsData({
          _home_number: this.home_number
        }).then(res => {
          // console.log("347", res.data);
          let vs = this
          if (res.data.head_of_household !== undefined) {
            this.loading = false
            this.household = res.data.head_of_household.last_name + res.data.head_of_household.first_name

            Modal.success({
              title: '系統提示',
              content: '戶長已帶入',
              okText: '確認',
              onOk() {
                vs.household_disabled = true
              },
            });
          }
          
        }).catch(error => {
          this.loading = false
          Modal.error({
            title: '系統提示',
            content: '查無戶長',
            okText: '確認',
          });
        })
      }
    },
    // 取得所有家號
    checkAllHouseholds() {
      this.loading = true
        this.getAllHouseholds().then(res => {
          this.loading = false
          // console.log("275",res);
          for (let i = 0; i < res.data.length; i++) {
            this.home_numberArr.push({
              label: res.data[i].head_of_household !== null ? res.data[i].head_of_household.last_name + res.data[i].head_of_household.first_name + "（" + res.data[i].home_number + "）" : res.data[i].home_number ,
              value: res.data[i].home_number
            })
          }
          let data = res.data.filter(x => x.head_of_household !== null)
          if (data.map(x => x.head_of_household.id).indexOf(this.userNum) !== -1) {
            this.household = true
            this.home_number = JSON.parse(localStorage.getItem("editData")).home_number
          } else {
            this.household = false
          }
          // 取得國籍
          // this.fetchCountries();
        })
    },
    // 查詢婚姻
    searchMarry() {

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

.textbox {
  width: 27vmin;
  border-bottom: 1px solid #ababab;
  // border-radius: 0.5vmin !important;
  padding: 0.5vmin 1.5vmin !important
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
  min-width: 80%;
  padding: 20px;
  min-height: 60vh;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.box_content_top_in {
  border-top: 1px dashed #ababab;
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
  justify-content: flex-start;
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

.titleButton {
  width: 120px;
  height: 30px;
  font-weight: bold;
  font-size: 14px;
  margin-top: 10px;
}

.searchButton {
    width: 85px;
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

@media screen and (max-width: 550px) {
  .box_content {
    width: initial;
    min-width: initial;
    overflow-x: auto;
    margin: initial;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .box_content_top,
  .box_content_top_in {
    width: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .textbox {
    width: 45vmin;
  }
}
</style>
