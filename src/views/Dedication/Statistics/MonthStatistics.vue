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
            <a><a-icon type="environment" style="margin-right: 3px"/>主日奉獻－{{ month }}月統計資料</a>
          </div>
          <div class="crud">
            <!-- <div class="userNum">
              有名氏合計： <a style="color: red">{{ famousPrice }}</a> 元、
              無名氏合計： <a style="color: red">{{ anonymousPrice }}</a> 元、
              總金額： <a style="color: red">{{ totalPrice }}</a> 元
            </div> -->
            <button
              @click="searchPriceModal = true"
              class="crud_button"
            >
              查詢總額
            </button>
            <button
              @click="exportProfileData"
              class="crud_button"
            >
              匯出
            </button>
          </div>
        </div>
        <div class="box_content" id="computerUI">
          <a-table :columns="columns" :data-source="data" @change="handleChange" :pagination="pagination" :scroll="{ y: scroll_Y }"/>
        </div>
        <div class="box_content" id="phoneUI">
          <a-table :columns="columns" :data-source="data" @change="handleChange" :pagination="pagination"/>
        </div>
       </a-col>
    </a-row>

    <!-- 查詢金額合計彈窗 -->
    <div class="modal_box" v-if="this.result.length !== 0">
      <a-modal class="modal" v-model="searchPriceModal" title="各項合計金額查詢" ok-text="確認" cancel-text="取消" @ok="checkPrice" :cancelButtonProps="cancelButtonProps">
        <div class="bar" style="border-bottom: 1px solid #dddddd; margin-top: -5px; padding-top: 0px">
          <a>項目</a>
          <a>合計金額</a>
        </div>
        <div class="bar">
          <a>{{ this.result[0].date1 }}</a>
          <a style="text-align: right;"><a style="color: red">{{ date1_price }}</a> 元</a>
        </div>
        <div class="bar">
          <a>{{ this.result[0].date2 }}</a>
          <a style="text-align: right;"><a style="color: red">{{ date2_price }}</a> 元</a>
        </div>
        <div class="bar">
          <a>{{ this.result[0].date3 }}</a>
          <a style="text-align: right;"><a style="color: red">{{ date3_price }}</a> 元</a>
        </div>
        <div class="bar">
          <a>{{ this.result[0].date4 }}</a>
          <a style="text-align: right;"><a style="color: red">{{ date4_price }}</a> 元</a>
        </div>
        <div class="bar" v-if="this.result[0].date5 !== undefined">
          <a>{{ this.result[0].date5 }}</a>
          <a style="text-align: right;"><a style="color: red">{{ date5_price }}</a> 元</a>
        </div>
        <div class="bar" style="border-top: 1px solid #dddddd;">
          <a>有名氏</a>
          <a style="text-align: right;"><a style="color: red">{{ famousPrice }}</a> 元</a>
        </div>
        <div class="bar">
          <a>無名氏</a>
          <a style="text-align: right;"><a style="color: red">{{ anonymousPrice }}</a> 元</a>
        </div>
        <div class="bar">
          <a>總合計</a>
          <a style="text-align: right;"><a style="color: red">{{ totalPrice }}</a> 元</a>
        </div>
      </a-modal>
    </div>

    <Back @back="forwardup" />
  </div>
</template>

<script>
/* eslint-disable */
import { Modal, Checkbox } from "ant-design-vue";
import Back from "@/components/Back.vue";
import Loading from "@/components/Loading.vue";

import { mapGetters, mapActions, createNamespacedHelpers } from 'vuex';
const report = createNamespacedHelpers('report');

// 假資料
const data = [
  {
    key: '1',
    home_number: '0-609',
    name: 'John',
    date1: 500,
    date2: 0,
    date3: 0,
    date4: 500,
    total: 1000,
  },
  {
    key: '2',
    home_number: '0-610',
    name: 'Jim',
    date1: 0,
    date2: 0,
    date3: 0,
    date4: 0,
    total: 0,
  },
];

export default {
  data() {
    return {
      searchText: "",
      user_id: "",
      loading: false,
      isActive: "",
      pagination: {
        defaultPageSize: 10,
        pageSize: 10,
      },
      data: [],
      filteredInfo: null,
      sortedInfo: null,
      lastSortOrder: null,
      // 已被勾選的人
      selectedRowKeys: [],
      // 高度
      scroll_Y: 0,
      totalPrice: 0,
      anonymousPrice: 0,
      famousPrice: 0,
      result: [],
      month: 0,
      // 查詢總金額彈窗
      searchPriceModal: false,
      cancelButtonProps: {
        style: { display: 'none' }
      },
      // 每週總金額
      date1_price: 0,
      date2_price: 0,
      date3_price: 0,
      date4_price: 0,
      date5_price: 0,
    };
  },
  components: {
    Back,
    Loading
  },
  watch: {
  },
  computed: {
    // 欄位
    columns() {
      let { sortedInfo, filteredInfo } = this;
      sortedInfo = sortedInfo || {};
      filteredInfo = filteredInfo || {};

      // console.log("110", this.result);
      const columns = [
        {
          title: '家號',
          dataIndex: 'home_number',
          key: 'home_number',
          width: 100,
          sorter: (a, b) => this.home_numberSort(a, b),
          sortOrder: sortedInfo.columnKey === 'home_number' && sortedInfo.order,
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          width: 120,
          sorter: (a, b) => a.name.length - b.name.length,
          sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        },
        {
          title: '1/1',
          dataIndex: 'date1',
          key: 'date1',
          width: 100,
          sorter: (a, b) => a.date1 - b.date1,
          sortOrder: sortedInfo.columnKey === 'date1' && sortedInfo.order,
        },
        {
          title: '1/8',
          dataIndex: 'date2',
          key: 'date2',
          width: 100,
          sorter: (a, b) => a.date2 - b.date2,
          sortOrder: sortedInfo.columnKey === 'date2' && sortedInfo.order,
        },
        {
          title: '1/22',
          dataIndex: 'date3',
          key: 'date3',
          width: 100,
          sorter: (a, b) => a.date3 - b.date3,
          sortOrder: sortedInfo.columnKey === 'date3' && sortedInfo.order,
        },
        {
          title: '1/29',
          dataIndex: 'date4',
          key: 'date4',
          width: 100,
          sorter: (a, b) => a.date4 - b.date4,
          sortOrder: sortedInfo.columnKey === 'date4' && sortedInfo.order,
        },
        {
          title: '個人總計',
          dataIndex: 'total',
          key: 'total',
          width: 100,
          sorter: (a, b) => a.total - b.total,
          sortOrder: sortedInfo.columnKey === 'total' && sortedInfo.order,
        },
      ];
      return columns;
    },
  },
  mounted() {
    // 判斷有無token 否則要打回登入頁面
    let token = localStorage.getItem("token")
    if (token == undefined || token == null && token == "") {
      this.$router.push("/");
    }
    // 判斷年月份
    this.month = localStorage.getItem("date").replace("/","年")
    // 紀錄當前頁面
    localStorage.setItem("pageName", this.$route.name.split("/")[0]);
    // 判斷高度
    this.scroll_Y = document.body.clientHeight - 320
    // 撈所有主日奉獻資料
    this.allRegularDonations()
  },
  methods: {
    ...report.mapActions({
      // 匯出所有顯示主日奉獻資料-月統計
      reportMonthRegularDonations: 'reportMonthRegularDonations',
      // 撈所有顯示主日奉獻資料-月統計
      getAllRegularDonations: 'getAllRegularDonations',
    }),
    // 自訂家號排序
    home_numberSort(a ,b) {
      const numA = this.extractNumber(a.home_number);
      const numB = this.extractNumber(b.home_number);

      if (typeof a.homeNumber === 'string' && typeof b.homeNumber === 'string') {
        // 如果沒有數字就比對字串長度
        if (numA === null && numB === null) {
          return a.homeNumber.length - b.homeNumber.length;
        }
      }

      if (numA !== null && numB !== null) {
        return numA - numB;
      } else if (numA !== null) {
        return -1;
      } else {
        return 1;
      }
    },
    // 定義一個函式，用於提取字串中的數字部分並轉換為數字
    extractNumber(str) {
      let strText = str.replace("-","")
      // 使用正規表達式提取數字部分
      const numberPart = strText.match(/\d+/); 
      // 轉換為數字並返回，如果找不到則返回null
      return numberPart ? parseInt(numberPart[0]) : null; 
    },
    forwardup() {
      this.$router.push("DedicationPage");
    },
    // 撈所有資料
    allRegularDonations() {
      this.loading = true
      this.getAllRegularDonations({
        date: localStorage.getItem('date')
      }).then(res => {
        this.loading = false
        // console.log("195",res.data);
        let data = res.data

        for (let i = 0; i < data.length; i++) {
          if (data[i].length === 8) {
            this.result.push({
              home_number: data[i][0],
              name: data[i][1],
              date1: data[i][2],
              date2: data[i][3],
              date3: data[i][4],
              date4: data[i][5],
              date5: data[i][6],
              total: data[i][7]
            });
          } else {
            this.result.push({
              home_number: data[i][0],
              name: data[i][1],
              date1: data[i][2],
              date2: data[i][3],
              date3: data[i][4],
              date4: data[i][5],
              total: data[i][6]
            });
          }
        }

        this.columns[2].title = this.result[0].date1
        this.columns[3].title = this.result[0].date2
        this.columns[4].title = this.result[0].date3
        this.columns[5].title = this.result[0].date4
        if (this.result[0].date5 !== undefined) {
          let { sortedInfo, filteredInfo } = this;
          sortedInfo = sortedInfo || {};
          
          let columns6 = {
            title: this.result[0].date5,
            dataIndex: 'date5',
            key: 'date5',
            width: 100,
            sorter: (a, b) => a.date5 - b.date5,
            sortOrder: sortedInfo.columnKey === 'date5' && sortedInfo.order,
          }
          // console.log("240",columns6);
          this.columns.splice(5 ,0 , columns6);
        } 

        // 扣3是扣掉最後三筆資料是有名氏統計、隱名氏統計以及總合計
        for (let i = 1; i < this.result.length - 3; i++) {
          if (this.result[0].date5 !== undefined) {
            this.data.push({
              key: i.toString(),
              home_number: this.result[i].home_number,
              name: this.result[i].name,
              date1: this.result[i].date1 !== null ?  this.result[i].date1 : 0,
              date2: this.result[i].date2 !== null ?  this.result[i].date2 : 0,
              date3: this.result[i].date3 !== null ?  this.result[i].date3 : 0,
              date4: this.result[i].date4 !== null ?  this.result[i].date4 : 0,
              date5: this.result[i].date5 !== null ?  this.result[i].date5 : 0,
              total: this.result[i].total
            })
          } else {
            this.data.push({
              key: i.toString(),
              home_number: this.result[i].home_number,
              name: this.result[i].name,
              date1: this.result[i].date1 !== null ?  this.result[i].date1 : 0,
              date2: this.result[i].date2 !== null ?  this.result[i].date2 : 0,
              date3: this.result[i].date3 !== null ?  this.result[i].date3 : 0,
              date4: this.result[i].date4 !== null ?  this.result[i].date4 : 0,
              total: this.result[i].total
            })
          }
        }
        this.totalPrice = this.result[this.result.length - 1].total
        this.anonymousPrice = this.result[this.result.length - 2].total
        this.famousPrice = this.result[this.result.length - 3].total
        // 每週總金額
        if (this.result[0].date5 !== undefined) {
          this.date1_price = this.result[this.result.length - 3].date1 !== null ? this.date1_price = this.result[this.result.length - 3].date1 : 0
          this.date2_price = this.result[this.result.length - 3].date2 !== null ? this.date2_price = this.result[this.result.length - 3].date2 : 0
          this.date3_price = this.result[this.result.length - 3].date3 !== null ? this.date3_price = this.result[this.result.length - 3].date3 : 0
          this.date4_price = this.result[this.result.length - 3].date4 !== null ? this.date4_price = this.result[this.result.length - 3].date4 : 0
          this.date5_price = this.result[this.result.length - 3].date5 !== null ? this.date5_price = this.result[this.result.length - 3].date5 : 0
        } else {
          this.date1_price = this.result[this.result.length - 3].date1 !== null ? this.date1_price = this.result[this.result.length - 3].date1 : 0
          this.date2_price = this.result[this.result.length - 3].date2 !== null ? this.date2_price = this.result[this.result.length - 3].date2 : 0
          this.date3_price = this.result[this.result.length - 3].date3 !== null ? this.date3_price = this.result[this.result.length - 3].date3 : 0
          this.date4_price = this.result[this.result.length - 3].date4 !== null ? this.date4_price = this.result[this.result.length - 3].date4 : 0
        }
        // console.log("274",this.data);
         
        
      }).catch(error => {
          this.loading = false
          Modal.error({
            title: '系統提示',
            content: '請重新查詢資料',
            okText: '確認',
          });
        })
    },
    // 匯出
    exportProfileData() {
        let vs = this
        Modal.confirm({
          title: '系統提示',
          content: `請確認是否匯出統計資料`,
          okText: '確認',
          cancelText: '取消',
          onOk() {
            vs.loading = true
            setTimeout(() => {
                vs.loading = false
                vs.reportMonthRegularDonations({
                  date: localStorage.getItem('date')
                }).then(res => {
                  // console.log("309",res);
                  // 自動下載
                  const url = window.URL.createObjectURL(new Blob([res.data]));
                  const link = document.createElement('a');
                  link.href = url;
                   // 指定下載的檔案名稱
                  link.setAttribute('download', `${localStorage.getItem('date') +'月_主日奉獻統計資料.xlsx'}`);
                  document.body.appendChild(link);
                  link.click();
                })
                Modal.success({
                    title: '系統提示',
                    content: '匯出成功',
                    okText: '確認',
                    onOk() {
                    }
                });
        }, 1000)
          },
        });
    },
    // 表格相關的
    handleChange(pagination, filters, sorter) {
      // console.log('Various parameters', pagination, filters, sorter);
      this.filteredInfo = filters;
      this.sortedInfo = sorter;

      if (!sorter.order) {
        sorter.order = 'ascend';
      }
      this.lastSortOrder = sorter.order;
    },
    // 確認完總金額
    checkPrice() {
      this.searchPriceModal = false
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

.setting {
  margin: 5px;
  margin-top: 10px;
  height: 50px;
  @include flex(row, center, space-between);
}

.search {
  width: 400px;
  @include flex(row, center, space-between);
}

.search button {
  width: 120px;
}
.search button:hover {
  cursor: pointer;
  opacity: 0.8;
  color: var(--primary-color);
  transition: opacity 0.2s, color 0.2s;
}
.crud {
  @include flex(row, center, space-between);
}

.box_search {
  width: 260px;
  height: 40px;
  background-color: rgb(255, 255, 255);
  box-shadow: 0px 0px 5px #737373;
  border-radius: 10px;
  border: none;
  font-weight: bolder;
  font-size: 16px;
  padding-left: 10px;
  outline: var(--primary-color);
}

.box_search:focus,
.box_search:active {
  border: 1px solid var(--primary-color);
}

.box_content {
  margin: 5px;
  margin-top: 10px;
  min-width: 340px;
  min-height: 74vh;
  background-color: #ffffff;
  box-shadow: 0px 0px 5px #737373;
  border-radius: 10px;
  padding-bottom: 50px;
  overflow-x: auto;
  @include flex(column, space-around, flex-start);
}

.checkbox {
  width: 15px;
  height: 15px;
}

.check {
  background-color: rgb(20, 22, 30);
  color: #000;
}

#js_his_chart tr:first-child:hover {
  background-color: initial;
  cursor: initial;
}

#js_his_chart tr:hover {
  // background-color: #ffffffc2;
  background-color: rgb(20, 22, 30);
  cursor: pointer;
}

.Item_button {
  color: black;
  border-radius: 5px;
  font-size: 18px;
  border: 0px;
  padding: 5px 10px;
  font-weight: bold;
  background: #ffffff;
}

.Item_button:hover {
  cursor: pointer;
}

@media screen and (min-width: 551px) and (max-width: 900px) {
  .setting {
    height: 100px;
    padding: 0 20px;
    margin-bottom: 10px;
    @include flex(column, flex-start, space-around);
  }
}

@media screen and (max-width: 550px) {
  .setting {
    width: 340px;
    height: 100px;
    padding: 0;
    margin-bottom: 10px;
    @include flex(column, flex-start, space-around);
  }

  .search {
    width: 340px;
  }

  .search button {
    width: 90px;
  }

  .box_search {
    width: 240px;
  }

  .crud {
    width: 350px;
    justify-content: space-around;
  }

  .box_content {
    width: 340px;
    overflow-x: auto;
  }

  .box_content table {
    width: 320px;
  }

  .box_content th,
  .box_content td {
    width: 100px;
    font-size: 18px;
    min-width: 120px;
  }

  .page {
    margin-bottom: 120px;
  }
  .page a:first-child {
    margin-left: 0px;
  }

  .page a:last-child {
    margin-right: 0px;
  }
}
</style>
