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
            <a><a-icon type="environment" style="margin-right: 3px"/>特殊奉獻－{{ eventName }}統計資料</a>
          </div>
          <div class="crud">
            <div class="userNum">
              總金額： <a style="color: red">{{ totalPrice }}</a> 元
            </div>
            <button
              @click="exportProfileDataAnnounce"
              class="crud_button"
              style="width: 150px;"
            >
              匯出公告名冊
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
      eventName: localStorage.getItem("event_name"),
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
          title: '奉獻日期',
          dataIndex: 'donation_at',
          key: 'donation_at',
          width: 100,
          sorter: (a, b) => parseInt(a.donation_at.replace(/\//g, '')) - parseInt(b.donation_at.replace(/\//g, '')),
          sortOrder: sortedInfo.columnKey === 'donation_at' && sortedInfo.order,
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
          title: '金額',
          dataIndex: 'donation_amount',
          key: 'donation_amount',
          width: 100,
          sorter: (a, b) => {
              const valueA = (typeof a.donation_amount === 'string') ? parseInt(a.donation_amount.replace(/,/g, '')) : a.donation_amount;
              const valueB = (typeof b.donation_amount === 'string') ? parseInt(b.donation_amount.replace(/,/g, '')) : b.donation_amount;
              return valueA - valueB;
            },
          sortOrder: sortedInfo.columnKey === 'donation_amount' && sortedInfo.order,
        },
        {
          title: '備註',
          dataIndex: 'comment',
          key: 'comment',
          width: 120,
          sorter: (a, b) => a.comment - b.comment,
          sortOrder: sortedInfo.columnKey === 'comment' && sortedInfo.order,
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
    // 撈所有特殊奉獻資料
    this.allRegularDonations()
  },
  methods: {
    ...report.mapActions({
      // 匯出特殊奉獻資料
      reportSpecialDonations: 'reportSpecialDonations',
      // 顯示特殊奉獻資料
      getAllRegularSpecialDonations: 'getAllRegularSpecialDonations',
      // 匯出特殊奉獻資料（公告用）
      reportSpecialDonationsAnnounce: 'reportSpecialDonationsAnnounce'
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
      this.getAllRegularSpecialDonations({
        event_id: localStorage.getItem('event_id')
      }).then(res => {
        this.loading = false
        // console.log("195",res.data);
        let data = res.data

        // 從1開始是因為第一欄多了一個標題
        for (let i = 1; i < data.length; i++) {
          if (data[i][0] !== null) {
            this.result.push({
              home_number: data[i][0],
              donation_at: data[i][1],
              name: data[i][2],
              donation_amount: data[i][3],
              comment: data[i][4],
            });
          }
        }

        // 扣1是扣掉最後兩筆資料是總合計
        for (let i = 1; i < this.result.length - 1; i++) {
          this.data.push({
            key: i.toString(),
            home_number: this.result[i].home_number,
            donation_at: this.result[i].donation_at,
            name: this.result[i].name,
            donation_amount: this.result[i].donation_amount !== null ?  this.result[i].donation_amount.toLocaleString() : 0,
            comment: this.result[i].comment
          })
        }

        let totalPrice = 0
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].donation_amount !== null) {
           totalPrice = totalPrice + parseInt(this.data[i].donation_amount.replace(/,/g, ''))
          }
        }
        // this.totalPrice = this.result[this.result.length - 1].donation_amount
        this.totalPrice = totalPrice.toLocaleString()
        
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
          content: `請確認是否匯出統計資料`,
          okText: '確認',
          cancelText: '取消',
          onOk() {
            vs.loading = true
            setTimeout(() => {
                vs.loading = false
                vs.reportSpecialDonations({
                  event_id: localStorage.getItem('event_id')
                }).then(res => {
                  // console.log("309",res);
                  // 自動下載
                  const url = window.URL.createObjectURL(new Blob([res.data]));
                  const link = document.createElement('a');
                  link.href = url;
                   // 指定下載的檔案名稱
                  link.setAttribute('download', `${localStorage.getItem('event_name') +'特殊奉獻統計資料.xlsx'}`);
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
    // 匯出公告用
    exportProfileDataAnnounce() {
        let vs = this
        Modal.confirm({
          title: '系統提示',
          content: `請確認是否匯出「公告名冊」統計資料`,
          okText: '確認',
          cancelText: '取消',
          onOk() {
            vs.loading = true
            setTimeout(() => {
                vs.loading = false
                vs.reportSpecialDonationsAnnounce({
                  event_id: localStorage.getItem('event_id')
                }).then(res => {
                  // console.log("309",res);
                  // 自動下載
                  const url = window.URL.createObjectURL(new Blob([res.data]));
                  const link = document.createElement('a');
                  link.href = url;
                   // 指定下載的檔案名稱
                  link.setAttribute('download', `${localStorage.getItem('event_name') +'特殊奉獻統計資料.xlsx'}`);
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
