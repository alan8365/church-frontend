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
            <a><a-icon type="environment" style="margin-right: 3px"/>新增教友資料</a>
          </div>
        </div>
        <div class="box_content">
          <div class="box_content_top">
            <div class="box_content_left">
                <div class="barImg">
                    <a>照片：</a>
                    <img-inputer
                        v-model="userImg"
                        theme="light"
                        size="large"
                        no-mask
                        placeholder="請上傳照片"
                    />
                </div>
                <!-- <div class="bar">
                    <a>教友編號：</a>
                    <a-input class="inputBox" placeholder="請輸入教友編號" v-model="userNum"/>
                </div> -->
                <div class="bar">
                    <i>*</i><a>姓名：</a>
                    <a-input class="inputBox" placeholder="請輸入姓名" v-model="name"/>
                </div>
                <div class="bar">
                    <a>戶長：</a>
                    <!-- <a-input class="inputBox" placeholder="請輸入姓名" v-model="household" :disabled="household_disabled"/> -->
                    <a-radio-group v-model="household" @change="onChangeReceipt" style="margin-left: 15px">
                      <a-radio :value="true">
                        是
                      </a-radio>
                      <a-radio :value="false">
                        否
                      </a-radio>
                    </a-radio-group>
                    <div class="searchButton" style="width: 50px"></div>
                </div>
                 <div class="bar">
                    <i>*</i><a>家號：</a>
                    <!-- 如果是戶長的話手動輸入家號，如果不是戶長則選擇對應的家號 -->
                    <a-input v-if="household == true" class="inputBox" placeholder="請輸入家號" v-model="home_number"/>
                    <a-select show-search v-if="household == false" v-model="home_number" placeholder="請選擇家號" class="inputBox">
                        <a-select-option v-for="item in home_numberArr" :key="item.value" :value="item.value">
                        {{ item.label }}
                        </a-select-option>
                    </a-select>

                    <!-- <a-button class="searchButton" @click="searchHouseholds">查詢戶長</a-button> -->
                </div>
                
                <div class="bar">
                    <i>*</i><a>性別：</a>
                    <a-select v-model="gender" placeholder="請選擇性別" class="inputBox">
                        <a-select-option v-for="item in genderArr" :key="item.value" :value="item.value">
                        {{ item.label }}
                        </a-select-option>
                    </a-select>
                </div>
                <div class="bar">
                    <i>*</i><a>出生日期：</a>
                    <a-date-picker @change="onChangeDate" placeholder="請選擇日期" v-model="birth_at"/>
                </div>
                <div class="bar">
                    <a>手機：</a>
                    <a-input class="inputBox" placeholder="請輸入手機" v-model="mobile_phone"/>
                </div>
                <div class="bar">
                    <a>電話：</a>
                    <a-input class="inputBox" placeholder="請輸入電話" v-model="home_phone"/>
                </div>
                <!-- <div class="bar">
                    <a>配偶：</a>
                    <a-input class="inputBox" placeholder="請輸入姓名" v-model="spouse"/>
                </div> -->
                <!-- <div class="bar">
                    <a>手足人數：</a>
                     <a-input-number v-model="sibling_number" :min="0" :max="100" @change="onChangeBrother" />
                </div> -->
                <!-- <div class="bar">
                    <a>兒女人數：</a>
                     <a-input-number v-model="children_number" :min="0" :max="100" @change="onChangeKid" />
                </div> -->
            </div>

            <div class="box_content_right">
               <div class="bar">
                    <a>父親：</a>
                    <a-input class="inputBox" placeholder="請輸入姓名" v-model="father"/>
                    <a-button class="searchButton" @click="searchParishioner(father, 'father')">查詢</a-button>
                </div>
                <div class="status">
                  <a v-if="father_id == ''"><a-icon type="warning" />非教友</a>
                  <a v-else style="color: #5EA64E"><a-icon type="check-circle" />已連接本堂教友資料</a>          
                </div>
                <div class="bar">
                    <a>母親：</a>
                    <a-input class="inputBox" placeholder="請輸入姓名" v-model="mother"/>
                    <a-button class="searchButton" @click="searchParishioner(mother, 'mother')">查詢</a-button>
                </div>
                <div class="status">
                  <a v-if="mother_id == ''" ><a-icon type="warning" />非教友</a>
                  <a v-else style="color: #5EA64E"><a-icon type="check-circle" />已連接本堂教友資料</a>
                </div>
                <div class="bar">
                    <a>郵遞區號：</a>
                    <a-input class="inputBox" placeholder="請輸入郵遞區號" v-model="postal_code"/>
                    <div class="searchButton" :style="{ width: scroll_X > 550 ? '85px' : '30px'}"></div>
                </div>
                <div class="bar">
                    <a>地址：</a>
                    <a-input class="inputBox" placeholder="請輸入地址" v-model="address"/>
                    <div class="searchButton" :style="{ width: scroll_X > 550 ? '85px' : '30px'}"></div>
                </div>
                <div class="bar">
                    <a>國籍：</a>
                    <a-select show-search v-model="nationality" placeholder="請選擇國籍">
                        <a-select-option v-for="country in countries" :key="country.name.common" :value="country.name.common">
                        {{ country.name.common }}
                        </a-select-option>
                    </a-select>
                   <div class="searchButton" :style="{ width: scroll_X > 550 ? '85px' : '30px'}"></div>
                </div>
                <div class="bar">
                    <a>職業：</a>
                    <a-input class="inputBox" placeholder="請輸入職業" v-model="profession"/>
                    <div class="searchButton" :style="{ width: scroll_X > 550 ? '85px' : '30px'}"></div>
                </div>
                <div class="bar">
                    <a>公司名稱：</a>
                    <a-input class="inputBox" placeholder="請輸入公司名稱" v-model="company_name"/>
                    <div class="searchButton" :style="{ width: scroll_X > 550 ? '85px' : '30px'}"></div>
                </div>

                <!-- <div class="bar">
                    <a>領洗：</a>
                    <a-date-picker @change="onChangeBaptizedDate" placeholder="請選擇日期"/>
                    <div class="searchButton"></div>
                </div>
                <div class="bar">
                    <a>初領領聖體：</a>
                    <a-date-picker @change="onChangeEucharistDate" placeholder="請選擇日期"/>
                    <div class="searchButton"></div>
                </div>
                <div class="bar">
                    <a>堅振：</a>
                    <a-date-picker @change="onChangeConfirmationDate" placeholder="請選擇日期"/>
                    <div class="searchButton"></div>
                </div>
                <div class="bar">
                    <a>婚配：</a>
                    <a-date-picker @change="onChangeMarriageDate" placeholder="請選擇日期"/>
                    <a-button class="searchButton" @click="searchMarry">查詢</a-button>
                </div> -->

                <div class="bar">
                    <a>遷入日期：</a>
                    <a-date-picker @change="onChangeAddDate" placeholder="請選擇日期" v-model="move_in_date"/>
                    <div class="searchButton" :style="{ width: scroll_X > 550 ? '85px' : '30px'}"></div>
                </div>
                <div class="bar">
                    <a>原屬堂區：</a>
                    <a-input class="inputBox" placeholder="請輸入原屬堂區" v-model="original_parish"/>
                   <div class="searchButton" :style="{ width: scroll_X > 550 ? '85px' : '30px'}"></div>
                </div>

                <div class="bar">
                  <a>備註：</a>
                  <a-textarea
                    v-model="comment"
                    :auto-size="{ minRows: 2, maxRows: 2 }"
                  />
                  <div class="searchButton" :style="{ width: scroll_X > 550 ? '85px' : '30px'}"></div>
                </div>

                <!-- <div class="bar">
                    <a>遷出日期：</a>
                    <a-date-picker @change="onChangeExitDate" placeholder="請選擇日期" v-model="move_out_date"/>
                    <div class="searchButton"></div>
                </div>
                <div class="bar">
                    <a>遷出原因：</a>
                    <a-input class="inputBox" placeholder="請輸入遷出原因" v-model="move_out_reason"/>
                    <div class="searchButton"></div>
                </div>
                <div class="bar">
                    <a>遷出堂區：</a>
                    <a-input class="inputBox" placeholder="請輸入遷出堂區" v-model="destination_parish"/>
                    <div class="searchButton"></div>
                </div> -->
            </div>
            
          </div>
          <div class="box_content_bottom">
            <!-- <a-button class="button" @click="forwardup">取消新增</a-button> -->
            <a-button type="primary" @click="addUser" class="button" style="margin-left: 10px">儲存資料</a-button>
          </div>

          <!-- 查詢教友確認彈窗 -->
          <div class="modal_box">
            <a-modal class="modal" v-model="searchParishionerModal" title="確認教友" ok-text="確認" cancel-text="取消" @ok="checkParishioner" :okButtonProps="okButtonProps">
              <div class="bar" style="border-bottom: 1px solid #dddddd; margin-top: -5px; padding-top: 0px">
              <a>姓名</a>
              <a>生日</a>
              <a>操作</a>
              </div>
              <div class="bar" v-for="(item , index) in searchParishionerArr" :key = index>
                <a>{{ item.name }}</a>
                <a>{{ item.birth_at }}</a>
                <a><a-button type="primary" @click="checkParishioner(item)">選擇</a-button></a>
              </div>
            </a-modal>
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
import Loading from "@/components/Loading.vue";
import Back from "@/components/Back.vue";

import { mapGetters, mapActions, createNamespacedHelpers } from 'vuex';

const households = createNamespacedHelpers('households');
const parishioner = createNamespacedHelpers('parishioner');

export default {
  data() {
    return {
      loading: false,
      household_disabled: false,
      userImg: "",
      base1: "",
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
      father_id: "",
      mother_id: "",
      spouse: "",
      sibling_number: 0,
      children_number: 0,
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
      comment: "",

      // 查詢教友
      clickParishionerType: "",
      searchParishionerModal: false,
      searchParishionerArr: [],
      okButtonProps: {
        style: { display: 'none' }
      },

      // 寬度
      scroll_X: document.body.clientWidth
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
    father(val) {
      this.father_id = ''
    },
    mother(val) {
      this.mother_id = ''
    },
    userImg(val) {
      // console.log("274",val);
    },
    household(val) {
      this.home_numberArr = []
      this.home_number = ""
      if (val == false) {
        this.loading = true
        this.getAllHouseholds().then(res => {
          this.loading = false
          let data = res.data.filter(x => x.special == false && x.guest == false)
          for (let i = 0; i < data.length; i++) {
            this.home_numberArr.push({
              label: data[i].head_of_household !== null ? data[i].head_of_household.last_name + data[i].head_of_household.first_name + "（" + data[i].home_number + "）" : data[i].home_number ,
              value: data[i].home_number
            })
          }
        })
      } else {
        this.loading = true
        this.getAllHouseholds().then(res => {
          this.loading = false
          let data = res.data.filter(x => x.special == false && x.guest == false)
          let allHome_number = data.map(item => this.extractNumber(item.home_number));
          // console.log("357",allHome_number);
          // 判斷最新一組家號，使用Math.max()方法找到最大值
          const maxNumber = Math.max(...allHome_number);
          this.home_number = maxNumber + 1
          // console.log("362",maxNumber);
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
    // 取得國籍
    // this.fetchCountries();
    // 取得所有家號
    this.checkAllHouseholds();
  },
  methods: {
    ...parishioner.mapActions({
      // 新增教友資料
      getAddParishioners: 'getAddParishioners',
      // 撈所有教友資料
      getAllParishioners: 'getAllParishioners',
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
    // 選擇初領領聖體日期
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
            // 將台灣排在第一個位置
            if (nameA === 'taiwan') return -1;
            if (nameB === 'taiwan') return 1;
            // 如果兩個國家都不是台灣，按字母順序排序
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
    // 定義一個函式，用於提取字串中的數字部分並轉換為數字
    extractNumber(str) {
      let strText = str.replace("-","")
      // 使用正規表達式提取數字部分
      const numberPart = strText.match(/\d+/); 
      // 轉換為數字並返回，如果找不到則返回null
      return numberPart ? parseInt(numberPart[0]) : null; 
    },
    // 儲存照片
    saveImg() {
      let file = this.userImg;
      this.base1 = {
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: file.name,
        size: file.size,
        type: file.type,
        webkitRelativePath: file.webkitRelativePath,
      }
      // console.log("395",file);
      // console.log("396",this.base1);
      this.addUser();
      // console.log("413",formData);
   
      // 之前在峻馳是base64
      // let reader = new FileReader();
      // console.log();
      // let img = new Image();
      // // 讀取圖片
      // reader.readAsDataURL(file);
      // // 讀取完畢後的操作
      // reader.onloadend = (e) => {
      //   img.src = e.target.result;
      //   // 這裏的e.target就是reader
      //   // console.log(reader.result);
      //   // reader.result就是圖片的base64字符串
      //   this.base1 = reader.result;
      //   // console.log("406",this.base1);
      //   // this.addUser();
      // };
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
    // 查詢父母親是不是教友
    searchParishioner(val, type) {
      // console.log("512",val, type);
      if (type == 'father') {
        this.father_id = ""
      } else if (type == 'mother') {
        this.mother_id = ""
      }

      this.searchParishionerArr = []
      this.clickParishionerType = type
      if (val == '') {
        Modal.warning({
          title: '系統提示',
          content: `請檢查所輸入的資料內容`,
          okText: '確認',
        })
      } else {
        this.loading = true
        this.getAllParishioners().then(res => {
          this.loading = false
          // console.log("504",res.data);
          let data = res.data.filter(x => x.last_name + x.first_name == val)
          if (data.length !== 0) {
            for (let i = 0; i < data.length; i++) {
              this.searchParishionerArr.push({
                name: data[i].last_name + data[i].first_name,
                birth_at: data[i].birth_at,
                parishioner_id: data[i].id
              })
            }
            this.searchParishionerModal = true
          } else {
            this.loading = false
            Modal.warning({
              title: '系統提示',
              content: `查無此教友，請重新輸入`,
              okText: '確認',
            })
          }
          
        })
      }
    },
    // 確認父母親教友
    checkParishioner(item) {
      // console.log("553",item);
      if (this.clickParishionerType == 'father') {
        this.father_id = item.parishioner_id
        // console.log("father_id", this.father_id);
      } else if (this.clickParishionerType == 'mother') {
        this.mother_id = item.parishioner_id
        // console.log("mother_id", this.mother_id);
      }
      this.searchParishionerModal = false
    },
    // 取得所有家號
    checkAllHouseholds() {
      this.loading = true
        this.getAllHouseholds().then(res => {
          // console.log("275",res);
          let data = res.data.filter(x => x.special == false && x.guest == false)
          for (let i = 0; i < data.length; i++) {
            this.home_numberArr.push({
              label: data[i].head_of_household !== null ? data[i].head_of_household.last_name + data[i].head_of_household.first_name + "（" + data[i].home_number + "）" : data[i].home_number ,
              value: data[i].home_number
            })
          }
          // 取得國籍
          this.fetchCountries();
        })
    },
    // 查詢婚姻
    searchMarry() {

    },
    // 新增教友資料
    addUser() {
      if (this.name == "" || this.gender == "" || this.birth_at == "" || this.home_number == "") {
        Modal.warning({
          title: '系統提示',
          content: `請檢查所輸入的資料內容`,
          okText: '確認',
        })
      } else {
        // 判斷是否為戶長
        if (this.household == true) {
          this.loading = true
          // 是戶長且家號為存在時要建立家號，先檢查家號是否存在
          this.getHouseholdsData({
            _home_number: this.home_number
          }).then(res => {
            // console.log("465", res.data);
            // 查得到代表已存在
            this.loading = false
            Modal.error({
              title: '系統提示',
              content: '新增失敗，此家號已有戶長，請重新檢查。',
              okText: '確認'
            });
          }).catch(error => {
            // 錯誤代表沒有此教友
            this.getAddHouseholds({
              home_number: this.home_number,
            }).then(ress => {
              // 已新增家號後 -> 新增教友 -> 更新家號
              setTimeout(()=>{
                this.updateHouse();
              },1000)
              
            }).catch(error => {
              this.loading = false
              Modal.error({
                title: '系統提示',
                content: '新增失敗，請重新檢查資料',
                okText: '確認'
              });
            })
          })
        } else {
          this.getAddParishioners({
            home_number: this.home_number,
            name: this.name,
            gender: this.gender,
            birth_at: this.birth_at,
            postal_code: this.postal_code,
            address: this.address,
            picture: this.userImg,
            father: this.father,
            mother: this.mother,
            father_id: this.father_id,
            mother_id: this.mother_id,
            spouse: this.spouse,
            home_phone: this.home_phone,
            mobile_phone: this.mobile_phone,
            nationality: this.nationality,
            profession: this.profession,
            company_name: this.company_name,
            sibling_number: this.sibling_number,
            children_number: this.children_number,
            move_in_date: this.move_in_date,
            original_parish: this.original_parish,
            move_out_date: this.move_out_date,
            move_out_reason: this.move_out_reason,
            destination_parish: this.destination_parish,
            comment: this.comment
          }).then(res => {
            this.loading = false
            let vs = this
            Modal.success({
              title: '系統提示',
              content: '新增成功',
              okText: '確認',
              onOk() {
                vs.userImg = "";
                vs.base1 = "";
                vs.home_number = "";
                vs.name = "";
                vs.gender = "";
                vs.birth_at = "";
                vs.postal_code = "";
                vs.userImg = "";
                vs.father = "";
                vs.mother = "";
                vs.father = "";
                vs.mother = "";
                // vs.spouse = "";
                vs.home_phone = "";
                vs.mobile_phone = "";
                vs.nationality = "";
                vs.profession = "";
                vs.company_name = "";
                vs.comment = "";
                vs.sibling_number = "";
                vs.children_number = "";
                vs.move_in_date = "";
                vs.original_parish = "";
                vs.move_out_date = "";
                vs.move_out_reason = "";
                vs.destination_parish = "";
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
    // 已新增家號後 -> 新增教友 -> 更新家號
    updateHouse() {
      this.getAddParishioners({
        home_number: this.home_number,
        name: this.name,
        gender: this.gender,
        birth_at: this.birth_at,
        postal_code: this.postal_code,
        address: this.address,
        picture: this.userImg,
        father: this.father,
        mother: this.mother,
        father_id: this.father_id,
        mother_id: this.mother_id,
        spouse: this.spouse,
        home_phone: this.home_phone,
        mobile_phone: this.mobile_phone,
        nationality: this.nationality,
        profession: this.profession,
        company_name: this.company_name,
        sibling_number: this.sibling_number,
        children_number: this.children_number,
        move_in_date: this.move_in_date,
        original_parish: this.original_parish,
        move_out_date: this.move_out_date,
        move_out_reason: this.move_out_reason,
        destination_parish: this.destination_parish,
        comment: this.comment
      }).then(res => {
        // console.log("588",res);
        this.getSaveHouseholdsData({
          _home_number: this.home_number,
          head_of_household_id: res.data.id
        }).then(ress => {
          this.loading = false
          let vs = this
          Modal.success({
            title: '系統提示',
            content: '新增成功',
            okText: '確認',
            onOk() {
              vs.userImg = "";
              vs.base1 = "";
              vs.home_number = "";
              vs.name = "";
              vs.gender = "";
              vs.birth_at = "";
              vs.postal_code = "";
              vs.userImg = "";
              vs.father = "";
              vs.mother = "";
              vs.father_id = "";
              vs.mother_id = "";
              // vs.spouse = "";
              vs.home_phone = "";
              vs.mobile_phone = "";
              vs.nationality = "";
              vs.profession = "";
              vs.company_name = "";
              vs.comment = "";
              vs.sibling_number = "";
              vs.children_number = "";
              vs.move_in_date = "";
              vs.original_parish = "";
              vs.move_out_date = "";
              vs.move_out_reason = "";
              vs.destination_parish = "";
            }
          })   
        }).catch(error => {
            this.loading = false
            Modal.error({
              title: '系統提示',
              content: '新增失敗，請重新檢查資料',
              okText: '確認'
            });
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

.modal .bar {
  justify-content: space-around;
}

.modal .bar a { 
  min-width: 50px;
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

.searchButton {
    width: 85px;
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
    display: flex;
    flex-direction: column;
  }

  .searchButton {
    width: 75px;
    margin-left: 5px;
  }
}
</style>
