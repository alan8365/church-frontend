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
            <a><a-icon type="environment" style="margin-right: 3px"/>送公署年度總帳</a>
            <input
              class="box_search"
              @change="onSearch"
              placeholder="輸入教友資料"
              v-model="searchText"
            />
            <button type="button" @click="onSearch">查詢</button>
             <div id="computerUI">
              <button type="button" @click="onSearchAll">全部</button>
            </div>
          </div>
          <div class="crud">
            <div class="userNum">
              有名氏合計： <a style="color: red">{{ famousPrice }}</a> 元、
              無名氏合計： <a style="color: red">{{ anonymousPrice }}</a> 元、
              總金額： <a style="color: red">{{ totalPrice }}</a> 元
            </div>
            <button
              @click="exportProfileData"
              class="crud_button"
            >
              匯出
            </button>
          </div>
        </div>
        <div class="box_content">
          <a-table :columns="columns" :data-source="data" @change="handleChange" :pagination="pagination"/>
        </div>
        <!-- <div class="box_content" id="computerUI">
          <a-table :columns="columns" :data-source="data" @change="handleChange" :pagination="pagination" :scroll="{ y: scroll_Y }"/>
        </div>
        <div class="box_content" id="phoneUI">
          <a-table :columns="columns" :data-source="data" @change="handleChange" :pagination="pagination"/>
        </div> -->
       </a-col>
    </a-row>

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
    January: '',
    February: '',
    March: '',
    April: '',
    May: '',
    June: '',
    July: '',
    August: '',
    September: '',
    October: '',
    November: '',
    December: '',
    total: "",
  },
  {
    key: '2',
    home_number: '0-610',
    name: 'Jim',
    January: '',
    February: '',
    March: '',
    April: '',
    May: '',
    June: '',
    July: '',
    August: '',
    September: '',
    October: '',
    November: '',
    December: '',
    total: "",
  },
  {
    key: '3',
    home_number: '0-608',
    name: 'Jerry',
    January: '',
    February: '',
    March: '',
    April: '',
    May: '',
    June: '',
    July: '',
    August: '',
    September: '',
    October: '',
    November: '',
    December: '',
    total: "",
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
      searchText: ""
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
          title: '一月份',
          dataIndex: 'January',
          key: 'January',
          width: 100,
          sorter: (a, b) => a.January - b.January,
          sortOrder: sortedInfo.columnKey === 'January' && sortedInfo.order,
        },
        {
          title: '二月份',
          dataIndex: 'February',
          key: 'February',
          width: 100,
          sorter: (a, b) => a.February - b.February,
          sortOrder: sortedInfo.columnKey === 'February' && sortedInfo.order,
        },
        {
          title: '三月份',
          dataIndex: 'March',
          key: 'March',
          width: 100,
          sorter: (a, b) => a.March - b.March,
          sortOrder: sortedInfo.columnKey === 'March' && sortedInfo.order,
        },
        {
          title: '四月份',
          dataIndex: 'April',
          key: 'April',
          width: 100,
          sorter: (a, b) => a.April - b.April,
          sortOrder: sortedInfo.columnKey === 'April' && sortedInfo.order,
        },
        {
          title: '五月份',
          dataIndex: 'May',
          key: 'May',
          width: 100,
          sorter: (a, b) => a.May - b.May,
          sortOrder: sortedInfo.columnKey === 'May' && sortedInfo.order,
        },
        {
          title: '六月份',
          dataIndex: 'June',
          key: 'June',
          width: 100,
          sorter: (a, b) => a.June - b.June,
          sortOrder: sortedInfo.columnKey === 'June' && sortedInfo.order,
        },
        {
          title: '七月份',
          dataIndex: 'July',
          key: 'July',
          width: 100,
          sorter: (a, b) => a.July - b.July,
          sortOrder: sortedInfo.columnKey === 'July' && sortedInfo.order,
        },
        {
          title: '八月份',
          dataIndex: 'August',
          key: 'August',
          width: 100,
          sorter: (a, b) => a.August - b.August,
          sortOrder: sortedInfo.columnKey === 'August' && sortedInfo.order,
        },
        {
          title: '九月份',
          dataIndex: 'September',
          key: 'September',
          width: 100,
          sorter: (a, b) => a.September - b.September,
          sortOrder: sortedInfo.columnKey === 'September' && sortedInfo.order,
        },
        {
          title: '十月份',
          dataIndex: 'October',
          key: 'October',
          width: 100,
          sorter: (a, b) => a.October - b.October,
          sortOrder: sortedInfo.columnKey === 'October' && sortedInfo.order,
        },
        {
          title: '十一月份',
          dataIndex: 'November',
          key: 'November',
          width: 100,
          sorter: (a, b) => a.November - b.November,
          sortOrder: sortedInfo.columnKey === 'November' && sortedInfo.order,
        },
        {
          title: '十二月份',
          dataIndex: 'December',
          key: 'December',
          width: 100,
          sorter: (a, b) => a.December - b.December,
          sortOrder: sortedInfo.columnKey === 'December' && sortedInfo.order,
        },
        {
          title: '年度主日奉獻總額',
          dataIndex: 'yearAllDonations',
          key: 'yearAllDonations',
          width: 100,
          sorter: (a, b) => a.yearAllDonations - b.yearAllDonations,
          sortOrder: sortedInfo.columnKey === 'yearAllDonations' && sortedInfo.order,
        },
        {
          title: '個人其他奉獻總額',
          dataIndex: 'personalAllDonations',
          key: 'personalAllDonations',
          width: 100,
          sorter: (a, b) => a.personalAllDonations - b.personalAllDonations,
          sortOrder: sortedInfo.columnKey === 'personalAllDonations' && sortedInfo.order,
        },
        {
          title: '總計',
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
    
    // 紀錄當前頁面
    localStorage.setItem("pageName", this.$route.name.split("/")[0]);
    // 判斷高度
    this.scroll_Y = document.body.clientHeight - 320
    // 撈所有主日奉獻資料
    this.allRegularDonations()
  },
  methods: {
    ...report.mapActions({
      // 撈所有顯示主日奉獻資料-送公署
      getAllDonations: 'getAllDonations',
      // 匯出所有顯示主日奉獻資料-送公署
      reportAllDonations: 'reportAllDonations',
      // 查詢捐款收據名冊
      getSearchAllDonations: 'getSearchAllDonations'
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
        // 搜尋全部
    onSearchAll() {
      this.searchText = ""
      this.data = []
      this.result = []
      this.loading = true
      this.allRegularDonations()
    },
    // 搜尋
    onSearch() {
      this.result = []
      this.data = []
      this.loading = true
      if (this.searchText == "") {
        this.allRegularDonations()
      } else {
        this.getSearchAllDonations({
          date: localStorage.getItem('date'),
          _basic: this.searchText
        }).then(res => {
          this.loading = false
          if (res.data.length !== 0) {
            // console.log("234",res.data);
            let data = res.data[1]

            for (let i = 0; i < data.length; i++) {
              this.result.push({
                home_number: data[i][0],
                name: data[i][1],
                January: data[i][2],
                February: data[i][3],
                March: data[i][4],
                April: data[i][5],
                May: data[i][6],
                June: data[i][7],
                July: data[i][8],
                August: data[i][9],
                September: data[i][10],
                October: data[i][11],
                November: data[i][12],
                December: data[i][13],
                yearAllDonations: data[i][14],
                personalAllDonations: data[i][15],
                total: data[i][16]
              });
            }

            // 扣3是扣掉最後三筆資料是有名氏統計、隱名氏統計以及總合計
            for (let i = 1; i < this.result.length - 3; i++) {
              this.data.push({
                key: i.toString(),
                home_number: this.result[i].home_number,
                name: this.result[i].name,
                January: this.result[i].January !== null ?  this.result[i].January : 0,
                February: this.result[i].February !== null ?  this.result[i].February : 0,
                March: this.result[i].March !== null ?  this.result[i].March : 0,
                April: this.result[i].April !== null ?  this.result[i].April : 0,
                May: this.result[i].May !== null ?  this.result[i].May : 0,
                June: this.result[i].June !== null ?  this.result[i].June : 0,
                July: this.result[i].July !== null ?  this.result[i].July : 0,
                August: this.result[i].August !== null ?  this.result[i].August : 0,
                September: this.result[i].September !== null ?  this.result[i].September : 0,
                October: this.result[i].October !== null ?  this.result[i].October : 0,
                November: this.result[i].November !== null ?  this.result[i].November : 0,
                December: this.result[i].December !== null ?  this.result[i].December : 0,
                yearAllDonations: this.result[i].yearAllDonations !== null ?  this.result[i].yearAllDonations : 0,
                personalAllDonations: this.result[i].personalAllDonations !== null ?  this.result[i].personalAllDonations : 0,
                total: this.result[i].total
              })
            }
            
            this.totalPrice = this.result[this.result.length - 1].total
            this.anonymousPrice = this.result[this.result.length - 2].total
            this.famousPrice = this.result[this.result.length - 3].total
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
    },
    // 撈所有資料
    allRegularDonations() {
      this.result = []
      this.data = []
      this.loading = true
      this.getAllDonations({
        date: localStorage.getItem('date')
      }).then(res => {
        this.loading = false
        // console.log("195",res.data);
        let data = res.data[1]

        for (let i = 0; i < data.length; i++) {
          this.result.push({
            home_number: data[i][0],
            name: data[i][1],
            January: data[i][2],
            February: data[i][3],
            March: data[i][4],
            April: data[i][5],
            May: data[i][6],
            June: data[i][7],
            July: data[i][8],
            August: data[i][9],
            September: data[i][10],
            October: data[i][11],
            November: data[i][12],
            December: data[i][13],
            yearAllDonations: data[i][14],
            personalAllDonations: data[i][15],
            total: data[i][16]
          });
        }

        // 扣3是扣掉最後三筆資料是有名氏統計、隱名氏統計以及總合計
        for (let i = 1; i < this.result.length - 3; i++) {
          this.data.push({
            key: i.toString(),
            home_number: this.result[i].home_number,
            name: this.result[i].name,
            January: this.result[i].January !== null ?  this.result[i].January : 0,
            February: this.result[i].February !== null ?  this.result[i].February : 0,
            March: this.result[i].March !== null ?  this.result[i].March : 0,
            April: this.result[i].April !== null ?  this.result[i].April : 0,
            May: this.result[i].May !== null ?  this.result[i].May : 0,
            June: this.result[i].June !== null ?  this.result[i].June : 0,
            July: this.result[i].July !== null ?  this.result[i].July : 0,
            August: this.result[i].August !== null ?  this.result[i].August : 0,
            September: this.result[i].September !== null ?  this.result[i].September : 0,
            October: this.result[i].October !== null ?  this.result[i].October : 0,
            November: this.result[i].November !== null ?  this.result[i].November : 0,
            December: this.result[i].December !== null ?  this.result[i].December : 0,
            yearAllDonations: this.result[i].yearAllDonations !== null ?  this.result[i].yearAllDonations : 0,
            personalAllDonations: this.result[i].personalAllDonations !== null ?  this.result[i].personalAllDonations : 0,
            total: this.result[i].total
          })
        }

        this.totalPrice = this.result[this.result.length - 1].total
        this.anonymousPrice = this.result[this.result.length - 2].total
        this.famousPrice = this.result[this.result.length - 3].total
        
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
                vs.reportAllDonations({
                  date: localStorage.getItem('date')
                }).then(res => {
                  // console.log("309",res);
                  // 自動下載
                  const url = window.URL.createObjectURL(new Blob([res.data]));
                  const link = document.createElement('a');
                  link.href = url;
                   // 指定下載的檔案名稱
                  link.setAttribute('download', `${localStorage.getItem('date') +'-年度總帳.xlsx'}`);
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

.box_search {
  width: 200px !important;
}

.setting {
  margin: 5px;
  margin-top: 10px;
  height: 50px;
  @include flex(row, center, space-between);
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
