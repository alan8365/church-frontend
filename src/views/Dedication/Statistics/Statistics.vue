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
            <a><a-icon type="environment" style="margin-right: 3px"/>主日奉獻－年統計資料</a>
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
      result: []
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
          sorter: (a, b) => {
            const valueA = (typeof a.January === 'string') ? parseInt(a.January.replace(/,/g, '')) : a.January;
            const valueB = (typeof b.January === 'string') ? parseInt(b.January.replace(/,/g, '')) : b.January;
            return valueA - valueB;
          },
          sortOrder: sortedInfo.columnKey === 'January' && sortedInfo.order,
        },
        {
          title: '二月份',
          dataIndex: 'February',
          key: 'February',
          width: 100,
          sorter: (a, b) => {
            const valueA = (typeof a.February === 'string') ? parseInt(a.February.replace(/,/g, '')) : a.February;
            const valueB = (typeof b.February === 'string') ? parseInt(b.February.replace(/,/g, '')) : b.February;
            return valueA - valueB;
          },
          sortOrder: sortedInfo.columnKey === 'February' && sortedInfo.order,
        },
        {
          title: '三月份',
          dataIndex: 'March',
          key: 'March',
          width: 100,
          sorter: (a, b) => {
            const valueA = (typeof a.March === 'string') ? parseInt(a.March.replace(/,/g, '')) : a.March;
            const valueB = (typeof b.March === 'string') ? parseInt(b.March.replace(/,/g, '')) : b.March;
            return valueA - valueB;
          },
          sortOrder: sortedInfo.columnKey === 'March' && sortedInfo.order,
        },
        {
          title: '四月份',
          dataIndex: 'April',
          key: 'April',
          width: 100,
          sorter: (a, b) => {
            const valueA = (typeof a.April === 'string') ? parseInt(a.April.replace(/,/g, '')) : a.April;
            const valueB = (typeof b.April === 'string') ? parseInt(b.April.replace(/,/g, '')) : b.April;
            return valueA - valueB;
          },
          sortOrder: sortedInfo.columnKey === 'April' && sortedInfo.order,
        },
        {
          title: '五月份',
          dataIndex: 'May',
          key: 'May',
          width: 100,
          sorter: (a, b) => {
            const valueA = (typeof a.May === 'string') ? parseInt(a.May.replace(/,/g, '')) : a.May;
            const valueB = (typeof b.May === 'string') ? parseInt(b.May.replace(/,/g, '')) : b.May;
            return valueA - valueB;
          },
          sortOrder: sortedInfo.columnKey === 'May' && sortedInfo.order,
        },
        {
          title: '六月份',
          dataIndex: 'June',
          key: 'June',
          width: 100,
          sorter: (a, b) => {
            const valueA = (typeof a.June === 'string') ? parseInt(a.June.replace(/,/g, '')) : a.June;
            const valueB = (typeof b.June === 'string') ? parseInt(b.June.replace(/,/g, '')) : b.June;
            return valueA - valueB;
          },
          sortOrder: sortedInfo.columnKey === 'June' && sortedInfo.order,
        },
        {
          title: '七月份',
          dataIndex: 'July',
          key: 'July',
          width: 100,
          sorter: (a, b) => {
            const valueA = (typeof a.July === 'string') ? parseInt(a.July.replace(/,/g, '')) : a.July;
            const valueB = (typeof b.July === 'string') ? parseInt(b.July.replace(/,/g, '')) : b.July;
            return valueA - valueB;
          },
          sortOrder: sortedInfo.columnKey === 'July' && sortedInfo.order,
        },
        {
          title: '八月份',
          dataIndex: 'August',
          key: 'August',
          width: 100,
          sorter: (a, b) => {
            const valueA = (typeof a.August === 'string') ? parseInt(a.August.replace(/,/g, '')) : a.August;
            const valueB = (typeof b.August === 'string') ? parseInt(b.August.replace(/,/g, '')) : b.August;
            return valueA - valueB;
          },
          sortOrder: sortedInfo.columnKey === 'August' && sortedInfo.order,
        },
        {
          title: '九月份',
          dataIndex: 'September',
          key: 'September',
          width: 100,
          sorter: (a, b) => {
            const valueA = (typeof a.September === 'string') ? parseInt(a.September.replace(/,/g, '')) : a.September;
            const valueB = (typeof b.September === 'string') ? parseInt(b.September.replace(/,/g, '')) : b.September;
            return valueA - valueB;
          },
          sortOrder: sortedInfo.columnKey === 'September' && sortedInfo.order,
        },
        {
          title: '十月份',
          dataIndex: 'October',
          key: 'October',
          width: 100,
          sorter: (a, b) => {
            const valueA = (typeof a.October === 'string') ? parseInt(a.October.replace(/,/g, '')) : a.October;
            const valueB = (typeof b.October === 'string') ? parseInt(b.October.replace(/,/g, '')) : b.October;
            return valueA - valueB;
          },
          sortOrder: sortedInfo.columnKey === 'October' && sortedInfo.order,
        },
        {
          title: '十一月份',
          dataIndex: 'November',
          key: 'November',
          width: 100,
          sorter: (a, b) => {
            const valueA = (typeof a.November === 'string') ? parseInt(a.November.replace(/,/g, '')) : a.November;
            const valueB = (typeof b.November === 'string') ? parseInt(b.November.replace(/,/g, '')) : b.November;
            return valueA - valueB;
          },
          sortOrder: sortedInfo.columnKey === 'November' && sortedInfo.order,
        },
        {
          title: '十二月份',
          dataIndex: 'December',
          key: 'December',
          width: 100,
          sorter: (a, b) => {
            const valueA = (typeof a.December === 'string') ? parseInt(a.December.replace(/,/g, '')) : a.December;
            const valueB = (typeof b.December === 'string') ? parseInt(b.December.replace(/,/g, '')) : b.December;
            return valueA - valueB;
          },
          sortOrder: sortedInfo.columnKey === 'December' && sortedInfo.order,
        },
        {
          title: '總計',
          dataIndex: 'total',
          key: 'total',
          width: 100,
          sorter: (a, b) => {
            const valueA = (typeof a.total === 'string') ? parseInt(a.total.replace(/,/g, '')) : a.total;
            const valueB = (typeof b.total === 'string') ? parseInt(b.total.replace(/,/g, '')) : b.total;
            return valueA - valueB;
          },
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
      // 撈所有顯示主日奉獻資料-年統計
      getAllRegularYearDonations: 'getAllRegularYearDonations',
      // 匯出所有顯示主日奉獻資料-年統計
      reportYearRegularDonations: 'reportYearRegularDonations',
    }),
    // 自訂家號排序
    home_numberSort(a ,b) {
      const numA = this.extractNumber(a.home_number);
      const numB = this.extractNumber(b.home_number);

      if (typeof a.home_number === 'string' && typeof b.home_number === 'string') {
        // 如果沒有數字就比對字串長度
        if (numA === null && numB === null) {
          if (a.home_number.length === b.home_number.length) {
            return a.home_number.localeCompare(b.home_number);
          } else {
            return a.home_number.length - b.home_number.length;
          }
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
      this.getAllRegularYearDonations({
        date: localStorage.getItem('date')
      }).then(res => {
        this.loading = false
        // console.log("195",res.data);
        let data = res.data[1]

        for (let i = 0; i < data.length; i++) {
          this.result.push({
            home_number: data[i][0],
            name: data[i][1] !== null ? data[i][1] : "",
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
            total: data[i][14]
          });
        }

        // 扣3是扣掉最後三筆資料是有名氏統計、隱名氏統計以及總合計
        for (let i = 1; i < this.result.length - 3; i++) {
          this.data.push({
            key: i.toString(),
            home_number: this.result[i].home_number,
            name: data[i][1] !== null ? data[i][1] : "",
            January: this.result[i].January !== null ?  this.result[i].January.toLocaleString() : 0,
            February: this.result[i].February !== null ?  this.result[i].February.toLocaleString() : 0,
            March: this.result[i].March !== null ?  this.result[i].March.toLocaleString() : 0,
            April: this.result[i].April !== null ?  this.result[i].April.toLocaleString() : 0,
            May: this.result[i].May !== null ?  this.result[i].May.toLocaleString() : 0,
            June: this.result[i].June !== null ?  this.result[i].June.toLocaleString() : 0,
            July: this.result[i].July !== null ?  this.result[i].July.toLocaleString() : 0,
            August: this.result[i].August !== null ?  this.result[i].August.toLocaleString() : 0,
            September: this.result[i].September !== null ?  this.result[i].September.toLocaleString() : 0,
            October: this.result[i].October !== null ?  this.result[i].October.toLocaleString() : 0,
            November: this.result[i].November !== null ?  this.result[i].November.toLocaleString() : 0,
            December: this.result[i].December !== null ?  this.result[i].December.toLocaleString() : 0,
            total: this.result[i].total.toLocaleString()
          })
        }

        this.totalPrice = this.result[this.result.length - 1].total.toLocaleString()
        this.anonymousPrice = this.result[this.result.length - 2].total.toLocaleString()
        this.famousPrice = this.result[this.result.length - 3].total.toLocaleString()
        
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
                vs.reportYearRegularDonations({
                  date: localStorage.getItem('date')
                }).then(res => {
                  // console.log("309",res);
                  // 自動下載
                  const url = window.URL.createObjectURL(new Blob([res.data]));
                  const link = document.createElement('a');
                  link.href = url;
                   // 指定下載的檔案名稱
                  link.setAttribute('download', `${'每月_'+localStorage.getItem('date') +'教友奉獻明細表.xlsx'}`);
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
  height: 40px;
  background-color: var(--button-color);
  box-shadow: 0px 0px 5px #737373;
  border: none;
  border-radius: 10px;
  font-size: 20px;
  font-weight: bolder;
  color: var(--text-color);
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
