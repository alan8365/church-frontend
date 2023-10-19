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
            <a><a-icon type="environment" style="margin-right: 3px"/>編輯婚姻資料</a>
          </div>
          <div class="userNum">
            最後更新時間： {{ updated_at }}
          </div>
        </div>
        <div class="box_content">
          <div class="box_content_top">
            <div class="box_content_left">
                <!-- <div class="bar">
                    <a>婚姻編號：</a>
                    <a-input class="inputBox" placeholder="婚姻編號" v-model="userNum" disabled/>
                </div> -->
                <div class="bar">
                    <i>*</i><a>婚姻日期：</a>
                    <a-date-picker @change="onChangeMarriage_at" placeholder="請選擇日期" v-model="marriage_at"/>
                </div>
                <div class="bar">
                    <i>*</i><a>證婚教堂：</a>
                    <a-input class="inputBox" placeholder="請輸入證婚教堂" v-model="marriage_location"/>
                </div>
                <div class="bar">
                    <i>*</i><a>證婚司鐸：</a>
                    <a-input class="inputBox" placeholder="請輸入證婚司鐸" v-model="presbyter"/>
                </div>
                <div class="bar">
                    <a>見證人1：</a>
                    <a-input class="inputBox" placeholder="請輸入姓名" v-model="witness1"/>
                </div>
                <div class="bar">
                    <a>見證人2：</a>
                    <a-input class="inputBox" placeholder="請輸入聖名" v-model="witness2"/>
                </div>
                <div class="bar">
                  <a>備註：</a>
                  <a-textarea
                    v-model="comment"
                    :auto-size="{ minRows: 2, maxRows: 2 }"
                  />
                </div>
            </div>
            <div class="box_content_right">
                <div class="bar">
                    <i>*</i><a>新郎姓名：</a>
                    <a-input class="inputBox" placeholder="請輸入姓名" v-model="groom"/>
                    <a-button class="searchButton" @click="searchParishioner(groom, 'groom')">查詢</a-button>
                </div>
                <div class="status">
                  <a v-if="groom_id == ''"><a-icon type="warning" />非教友</a>
                  <a v-else style="color: #5EA64E"><a-icon type="check-circle" />已連接本堂教友資料</a>          
                </div>
                <!-- <div class="bar">
                    <a>新郎聖名：</a>
                    <a-input class="inputBox" placeholder="請輸入聖名" v-model="groom_baptismalName"/>
                </div> -->
                <div class="bar">
                    <a>新郎父親：</a>
                    <a-input class="inputBox" placeholder="請輸入姓名" v-model="groom_father" :disabled="groom_id !== ''"/>
                    <!-- <a-button class="searchButton" @click="searchParishioner(groom_father, 'groom_father')">查詢</a-button> -->
                     <div class="searchButton" :style="{ width: scroll_X > 550 ? '0px' : '40px', display : groom_id !== '' ? 'none' : 'block'}"></div>
                    <a-popover placement="right" :style="{ display : groom_id !== '' ? 'block' : 'none' }">
                      <template slot="content">
                        <p>提示：如果是連接對應教友將顯示教友資料內的資訊，若要修改請至「資料管理」找到對應教友做調整</p>
                      </template>
                      <!-- <template slot="title">
                        <span>Title</span>
                      </template> -->
                      <a-icon type="question-circle" style="margin-left: 10px"/>
                    </a-popover>
                   <div class="searchButton" :style="{ width: scroll_X > 550 ? '0px' : '0px', display : groom_id !== '' ? 'block' : 'none'}"></div>
                </div>
                <div class="bar">
                    <a>新郎母親：</a>
                    <a-input class="inputBox" placeholder="請輸入姓名" v-model="groom_mother" :disabled="groom_id !== ''"/>
                    <!-- <a-button class="searchButton" @click="searchParishioner(groom_mother, 'groom_mother')">查詢</a-button> -->
                     <div class="searchButton" :style="{ width: scroll_X > 550 ? '0px' : '40px', display : groom_id !== '' ? 'none' : 'block'}"></div>
                    <a-popover placement="right" :style="{ display : groom_id !== '' ? 'block' : 'none' }">
                      <template slot="content">
                        <p>提示：如果是連接對應教友將顯示教友資料內的資訊，若要修改請至「資料管理」找到對應教友做調整</p>
                      </template>
                      <!-- <template slot="title">
                        <span>Title</span>
                      </template> -->
                      <a-icon type="question-circle" style="margin-left: 10px"/>
                    </a-popover>
                    <div class="searchButton" :style="{ width: scroll_X > 550 ? '0px' : '0px', display : groom_id !== '' ? 'block' : 'none'}"></div>
                </div>
                <div class="bar">
                    <i>*</i><a>新郎出生日期：</a>
                    <a-date-picker @change="onChangegroom_bornDate" placeholder="請選擇日期" v-model="groom_bornDate" :disabled="groom_id !== ''"/>
                     <div class="searchButton" :style="{ width: scroll_X > 550 ? '0px' : '40px', display : groom_id !== '' ? 'none' : 'block'}"></div>
                    <a-popover placement="right" :style="{ display : groom_id !== '' ? 'block' : 'none' }">
                      <template slot="content">
                        <p>提示：如果是連接對應教友將顯示教友資料內的資訊，若要修改請至「資料管理」找到對應教友做調整</p>
                      </template>
                      <!-- <template slot="title">
                        <span>Title</span>
                      </template> -->
                      <a-icon type="question-circle" style="margin-left: 10px"/>
                    </a-popover>
                    <div class="searchButton" :style="{ width: scroll_X > 550 ? '0px' : '0px', display : groom_id !== '' ? 'block' : 'none'}"></div>
                </div>
                <div class="bar">
                    <i>*</i><a>新娘姓名：</a>
                    <a-input class="inputBox" placeholder="請輸入姓名" v-model="bride"/>
                    <a-button class="searchButton" @click="searchParishioner(bride, 'bride')">查詢</a-button>
                </div>
                <div class="status">
                  <a v-if="bride_id == ''"><a-icon type="warning" />非教友</a>
                  <a v-else style="color: #5EA64E"><a-icon type="check-circle" />已連接本堂教友資料</a>          
                </div>
                <!-- <div class="bar">
                    <a>新娘聖名：</a>
                    <a-input class="inputBox" placeholder="請輸入聖名" v-model="bride_baptismalName"/>
                </div> -->
                <div class="bar">
                    <a>新娘父親：</a>
                    <a-input class="inputBox" placeholder="請輸入姓名" v-model="bride_father" :disabled="bride_id !== ''"/>
                    <!-- <a-button class="searchButton" @click="searchParishioner(bride_father, 'bride_father')">查詢</a-button> -->
                     <div class="searchButton" :style="{ width: scroll_X > 550 ? '0px' : '40px', display : bride_id !== '' ? 'none' : 'block'}"></div>
                    <a-popover placement="right" :style="{ display : bride_id !== '' ? 'block' : 'none' }">
                      <template slot="content">
                        <p>提示：如果是連接對應教友將顯示教友資料內的資訊，若要修改請至「資料管理」找到對應教友做調整</p>
                      </template>
                      <!-- <template slot="title">
                        <span>Title</span>
                      </template> -->
                      <a-icon type="question-circle" style="margin-left: 10px"/>
                    </a-popover>
                   <div class="searchButton" :style="{ width: scroll_X > 550 ? '0px' : '0px', display : bride_id !== '' ? 'block' : 'none'}"></div>
                </div>
                <div class="bar">
                    <a>新娘母親：</a>
                    <a-input class="inputBox" placeholder="請輸入姓名" v-model="bride_mother" :disabled="bride_id !== ''"/>
                    <!-- <a-button class="searchButton" @click="searchParishioner(bride_mother, 'bride_mother')">查詢</a-button> -->
                    <div class="searchButton" :style="{ width: scroll_X > 550 ? '0px' : '40px', display : bride_id !== '' ? 'none' : 'block'}"></div>
                    <a-popover placement="right" :style="{ display : bride_id !== '' ? 'block' : 'none' }">
                      <template slot="content">
                        <p>提示：如果是連接對應教友將顯示教友資料內的資訊，若要修改請至「資料管理」找到對應教友做調整</p>
                      </template>
                      <!-- <template slot="title">
                        <span>Title</span>
                      </template> -->
                      <a-icon type="question-circle" style="margin-left: 10px"/>
                    </a-popover>
                    <div class="searchButton" :style="{ width: scroll_X > 550 ? '0px' : '0px', display : bride_id !== '' ? 'block' : 'none'}"></div>
                </div>
                <div class="bar">
                    <i>*</i><a>新娘出生日期：</a>
                    <a-date-picker @change="onChangeBride_bornDate" placeholder="請選擇日期" v-model="bride_bornDate" :disabled="bride_id !== ''"/>
                    <div class="searchButton" :style="{ width: scroll_X > 550 ? '0px' : '40px', display : bride_id !== '' ? 'none' : 'block'}"></div>
                    <a-popover placement="right" :style="{ display : bride_id !== '' ? 'block' : 'none' }">
                      <template slot="content">
                        <p>提示：如果是連接對應教友將顯示教友資料內的資訊，若要修改請至「資料管理」找到對應教友做調整</p>
                      </template>
                      <!-- <template slot="title">
                        <span>Title</span>
                      </template> -->
                      <a-icon type="question-circle" style="margin-left: 10px"/>
                    </a-popover>
                    <div class="searchButton" :style="{ width: scroll_X > 550 ? '0px' : '0px', display : bride_id !== '' ? 'block' : 'none'}"></div>
                </div>
                 <!-- <div class="bar">
                  <a>備註：</a>
                  <a-textarea
                    v-model="comment"
                    :auto-size="{ minRows: 2, maxRows: 2 }"
                  />
                   <div class="searchButton"></div>
                </div> -->
            </div>
            
          </div>
          <div class="box_content_bottom">
            <!-- <a-button class="button" @click="forwardup">取消編輯</a-button> -->
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
import Back from "@/components/Back.vue";
import Loading from "@/components/Loading.vue";

import { mapGetters, mapActions, createNamespacedHelpers } from 'vuex';
const marriage = createNamespacedHelpers('marriage');
const parishioner = createNamespacedHelpers('parishioner');

export default {
  data() {
    return {
      loading: false,
      userImg: "",
      keyName: "",
      userNum: "",
      marriage_id: "",
      marriage_at: "",
      marriage_location: "彰化天主堂",
      groom: "",
      groom_baptismalName: "",
      groom_father: "",
      groom_father_id: "",
      groom_mother: "",
      groom_mother_id: "",
      groom_bornDate: "",
      groom_id: "",

      bride: "",
      bride_baptismalName: "",
      bride_father: "",
      bride_father_id: "",
      bride_mother: "",
      bride_mother_id: "",
      bride_bornDate: "",
      bride_id: "",
      
      presbyter: "",
      witness1: "",
      witness2: "",
      comment: "",

      // 查詢教友
      clickParishionerType: "",
      searchParishionerModal: false,
      searchParishionerArr: [],
      okButtonProps: {
        style: { display: 'none' }
      },
      firstSearchGroom: true,
      firstSearchBride: true,

      // 寬度
      scroll_X: document.body.clientWidth,
      // 最後更新時間
      updated_at: ""
    };
  },
  components: {
    Back,
    Loading
  },
  watch: {
    groom(val) {
      if (this.firstSearchGroom == false || val !== JSON.parse(localStorage.getItem("editData")).groom) {
        this.groom_id = ''
        this.groom_father = ''
        this.groom_mother = ''
        this.groom_bornDate = ''
      }
    },    
    bride(val) {
      if (this.firstSearchBride == false || val !== JSON.parse(localStorage.getItem("editData")).bride) {
        this.bride_id = ''
        this.bride_father = ''
        this.bride_mother = ''
        this.bride_bornDate = ''
      }
    },
    // groom_father(val) {
    //   this.groom_father_id = ''
    // },
    // groom_mother(val) {
    //   this.groom_mother_id = ''
    // },
    // bride_father(val) {
    //   this.bride_father_id = ''
    // },
    // bride_mother(val) {
    //   this.bride_mother_id = ''
    // },
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
      // 撈所有教友資料
      getAllParishioners: 'getAllParishioners',
    }),
    ...marriage.mapActions({
      // 儲存婚姻資料
      getSaveMarriagesData: 'getSaveMarriagesData',
    }),
    // 上一頁
    forwardup() {
      this.$router.push("/MarriageData");
    },
    // 選擇婚姻日期
    onChangeMarriage_at(date, dateString) {
      // console.log(date, dateString);
      this.marriage_at = dateString
    },
    // 選擇新郎出生日期
    onChangegroom_bornDate(date, dateString) {
      // console.log(date, dateString);
      this.groom_bornDate = dateString
    },
    // 選擇新娘出生日期
    onChangeBride_bornDate(date, dateString) {
      // console.log(date, dateString);
      this.bride_bornDate = dateString
    },
    // 查詢是不是教友
    searchParishioner(val, type) {
      // console.log("512",val, type);
      if (type == 'groom') {
        this.firstSearchGroom = true
        this.groom_id = ""
      } else if (type == 'bride') {
        this.firstSearchBride = true
        this.bride_id = ""
      }else if (type == 'groom_father') {
        this.groom_father_id = ""
      } else if (type == 'groom_mother') {
        this.groom_mother_id = ""
      }  else if (type == 'bride_father') {
        this.bride_father_id = ""
      } else if (type == 'bride_mother') {
        this.bride_mother_id = ""
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
                name: data[i].last_name + data[i].last_name,
                birth_at: data[i].birth_at,
                parishioner_id: data[i].id,
                father: data[i].father,
                mother: data[i].mother
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
    // 確認查詢教友
    checkParishioner(item) {
      // console.log("553",item);
      if (this.clickParishionerType == 'groom') {
        this.groom_id = item.parishioner_id
        this.groom_father = item.father
        this.groom_mother = item.mother
        this.groom_bornDate = item.birth_at
        // console.log("groom_id", this.groom_id);
      } else if (this.clickParishionerType == 'bride') {
        this.bride_id = item.parishioner_id
        this.bride_father = item.father
        this.bride_mother = item.mother
        this.bride_bornDate = item.birth_at
        // console.log("bride_id", this.bride_id);
      } 
      // 新郎、新娘父母親id，暫擺怕之後要
      else if (this.clickParishionerType == 'groom_father') {
        this.groom_father_id = item.parishioner_id
        // console.log("groom_father_id", this.groom_father_id);
      } else if (this.clickParishionerType == 'groom_mother') {
        this.groom_mother_id = item.parishioner_id
        // console.log("groom_mother_id", this.groom_mother_id);
      } else if (this.clickParishionerType == 'bride_father') {
        this.bride_father_id = item.parishioner_id
        // console.log("groom_bride_id", this.groom_bride_id);
      } else if (this.clickParishionerType == 'bride_mother') {
        this.bride_mother_id = item.parishioner_id
        // console.log("bride_mother_id", this.bride_mother_id);
      } 

      this.searchParishionerModal = false
    },
    // 檢查LS是否有該資料詳情
    checkLSEditData() {
      let data = localStorage.getItem("editData")
      if (data !== null && data !== undefined) {
        this.marriage_id = JSON.parse(localStorage.getItem("editData")).id
        this.marriage_at = JSON.parse(localStorage.getItem("editData")).marriage_at
        this.marriage_location = JSON.parse(localStorage.getItem("editData")).marriage_location
        this.bride = JSON.parse(localStorage.getItem("editData")).bride
        this.bride_id = JSON.parse(localStorage.getItem("editData")).bride_id !== null && JSON.parse(localStorage.getItem("editData")).bride_id !== '' ? JSON.parse(localStorage.getItem("editData")).bride_id : ''
        this.bride_bornDate = JSON.parse(localStorage.getItem("editData")).bride_birth_at
        this.bride_father = JSON.parse(localStorage.getItem("editData")).bride_father
        this.bride_mother = JSON.parse(localStorage.getItem("editData")).bride_mother
        this.groom = JSON.parse(localStorage.getItem("editData")).groom
        this.groom_id = JSON.parse(localStorage.getItem("editData")).groom_id !== '' && JSON.parse(localStorage.getItem("editData")).groom_id !== null ? JSON.parse(localStorage.getItem("editData")).groom_id : ''
        this.groom_bornDate = JSON.parse(localStorage.getItem("editData")).groom_birth_at
        this.groom_father = JSON.parse(localStorage.getItem("editData")).groom_father
        this.groom_mother = JSON.parse(localStorage.getItem("editData")).groom_mother
        this.presbyter = JSON.parse(localStorage.getItem("editData")).presbyter
        this.witness1 = JSON.parse(localStorage.getItem("editData")).witness1
        this.witness2 = JSON.parse(localStorage.getItem("editData")).witness2
        this.comment = JSON.parse(localStorage.getItem("editData")).comment
        // 最後更新時間
        let updated_at = JSON.parse(localStorage.getItem("editData")).updated_at
        const indexOfT = updated_at.indexOf('T');
        const datePart = updated_at.substring(0, indexOfT);
        const timePart = updated_at.substring(indexOfT + 1, updated_at.indexOf('.'));
        const extractedDateTime = datePart + " " + timePart
        this.updated_at = extractedDateTime
      }
    },
    // 新增婚姻資料
    addUser() {
      if (this.marriage_at == "" || this.marriage_location == "" || this.presbyter == "" || this.groom == "" || this.groom_bornDate == "" || this.bride == "" || this.bride_bornDate == "" ) {
        Modal.warning({
          title: '系統提示',
          content: `請檢查所輸入的資料內容`,
          okText: '確認',
        })
      } else {
        this.loading = true
        this.getSaveMarriagesData({
          _id: this.marriage_id,
          marriage_at: this.marriage_at,
          marriage_location: this.marriage_location,
          bride: this.bride,
          bride_id: this.bride_id,
          bride_birth_at: this.bride_bornDate,
          bride_father: this.bride_father,
          bride_father_id: this.bride_father_id,
          bride_mother: this.bride_mother,
          bride_mother_id: this.bride_mother_id,
          groom: this.groom,
          groom_id: this.groom_id,
          groom_birth_at: this.groom_bornDate,
          groom_father: this.groom_father,
          groom_father_id: this.groom_father_id,
          groom_mother: this.groom_mother,
          groom_mother_id: this.groom_mother_id,
          presbyter: this.presbyter,
          witness1: this.witness1,
          witness2: this.witness2,
          comment: this.comment,
        }).then(res => {
          this.loading = false
          let vs = this
          Modal.success({
            title: '系統提示',
            content: '儲存成功',
            okText: '確認',
            onOk() {
              vs.$router.push("/MarriageData");
            }
          });
        }).catch(error => {
          this.loading = false
          Modal.error({
            title: '系統提示',
            content: '儲存失敗，請重新檢查資料',
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

.searchButtonBox {
  width: 45px;
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

  .searchButton {
    width: 75px;
    margin-left: 5px;
  }
}
</style>
