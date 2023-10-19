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
            <a><a-icon type="environment" style="margin-right: 3px"/>捐款收據名冊</a>
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
            <!-- <div class="userNum">
              總金額： <a style="color: red">{{ totalPrice }}</a> 元
            </div> -->
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
    donation_at: '4/29',
    donation_amount: 2000,
    comment: ''
  },
  {
    key: '2',
    home_number: '0-609',
    name: 'Jim',
    donation_at: '5/3',
    donation_amount: 1000,
    comment: ''
  },
  {
    key: '3',
    home_number: '0-609',
    name: 'Jerry',
    donation_at: '5/6',
    donation_amount: 2000,
    comment: ''
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
      totalPrice: 5000,
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
          title: '編號',
          dataIndex: 'num',
          key: 'num',
          width: 100,
          sorter: (a, b) => this.home_numberSort(a, b),
          sortOrder: sortedInfo.columnKey === 'num' && sortedInfo.order,
        },
        {
          title: '收據開立姓名或公司行號',
          dataIndex: 'name',
          key: 'name',
          width: 120,
          sorter: (a, b) => a.name - b.name,
          sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        },
        {
          title: '金額',
          dataIndex: 'donation_amount',
          key: 'donation_amount',
          width: 120,
          sorter: (a, b) => a.donation_amount.length - b.donation_amount.length,
          sortOrder: sortedInfo.columnKey === 'donation_amount' && sortedInfo.order,
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
    // 撈所有捐款收據名冊
    this.allRegularDonations()
  },
  methods: {
    ...report.mapActions({
      // 匯出捐款收據名冊
      reportReceipt: 'reportReceipt',
      // 顯示捐款收據名冊
      getReceipt: 'getReceipt',
      // 查詢捐款收據名冊
      getSearchReportReceipt: 'getSearchReportReceipt',
    }),
    // 自訂家號排序
    home_numberSort(a ,b) {
      const numA = this.extractNumber(a.num);
      const numB = this.extractNumber(b.num);

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
        this.getSearchReportReceipt({
          date: localStorage.getItem('date'),
          _basic: this.searchText
        }).then(res => {
          this.loading = false
          if (res.data.length !== 0) {
            // console.log("234",res.data);
            let data = res.data

            // 從3開始是因為前面三行有標頭
            for (let i = 2; i < data.length; i++) {
              if (data[i][0] !== null) {
                this.result.push({
                  num: data[i][0],
                  name: data[i][1],
                  donation_amount: data[i][2],
                });
              }
            }

            // 扣3是扣掉最後三筆資料是文字說明
            for (let i = 0; i < this.result.length - 3; i++) {
              this.data.push({
                key: i.toString(),
                num: this.result[i].num,
                name: this.result[i].name,
                donation_amount: this.result[i].donation_amount !== null ?  this.result[i].donation_amount : 0,
              })
            }
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
      this.data = []
      this.result = []
      this.loading = true
      this.getReceipt({
        date: localStorage.getItem('date')
      }).then(res => {
        this.loading = false
        // console.log("195",res.data);
        let data = res.data

        // 從3開始是因為前面三行有標頭
        for (let i = 3; i < data.length; i++) {
          if (data[i][0] !== null) {
            this.result.push({
              num: data[i][0],
              name: data[i][1],
              donation_amount: data[i][2],
            });
          }
        }

        // 扣4是扣掉最後四筆資料是文字說明
        for (let i = 0; i < this.result.length - 4; i++) {
          this.data.push({
            key: i.toString(),
            num: this.result[i].num,
            name: this.result[i].name,
            donation_amount: this.result[i].donation_amount !== null ?  this.result[i].donation_amount : 0,
          })
        }

        // this.totalPrice = this.result[this.result.length - 1].donation_amount
        
        // console.log("274",this.data, this.result);
         
        
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
          content: `請確認是否匯出捐款收據名冊`,
          okText: '確認',
          cancelText: '取消',
          onOk() {
            vs.loading = true
            setTimeout(() => {
                vs.loading = false
                vs.reportReceipt({
                  date: localStorage.getItem('date')
                }).then(res => {
                  // console.log("309",res);
                  // 自動下載
                  const url = window.URL.createObjectURL(new Blob([res.data]));
                  const link = document.createElement('a');
                  link.href = url;
                   // 指定下載的檔案名稱
                  link.setAttribute('download', `${localStorage.getItem('date') +'-捐款收據名冊.xlsx'}`);
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
