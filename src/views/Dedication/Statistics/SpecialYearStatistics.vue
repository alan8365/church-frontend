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
            <a><a-icon type="environment" style="margin-right: 3px"/>特殊奉獻年統計資料</a>
          </div>
          <div class="crud">
            <!-- <div class="userNum">
              記名總額合計： <a style="color: red">{{ famousPrice }}</a> 元、
              善心總額合計： <a style="color: red">{{ anonymousPrice }}</a> 元、
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
      columns: []
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
    // columns() {
    //   let { sortedInfo, filteredInfo } = this;
    //   sortedInfo = sortedInfo || {};
    //   filteredInfo = filteredInfo || {};

    //   // console.log("110", this.result);
    //   let columns = [
    //     // {
    //     //   title: '家號',
    //     //   dataIndex: 'home_number',
    //     //   key: 'home_number',
    //     //   width: 100,
    //     //   sorter: (a, b) => a.home_number.length - b.home_number.length,
    //     //   sortOrder: sortedInfo.columnKey === 'home_number' && sortedInfo.order,
    //     // },
    //     // {
    //     //   title: '姓名',
    //     //   dataIndex: 'name',
    //     //   key: 'name',
    //     //   width: 120,
    //     //   sorter: (a, b) => a.name.length - b.name.length,
    //     //   sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
    //     // },
    //     // {
    //     //   title: '其他奉獻',
    //     //   dataIndex: 'other_total',
    //     //   key: 'other_total',
    //     //   width: 100,
    //     //   sorter: (a, b) => a.other_total - b.other_total,
    //     //   sortOrder: sortedInfo.columnKey === 'other_total' && sortedInfo.order,
    //     // },
    //   ];
    //   return columns;
    // },
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
    // 撈所有特殊奉獻年統計
    this.allRegularDonations()
  },
  methods: {
    ...report.mapActions({
      // 匯出所有顯示特殊奉獻年統計
      reportSpecialYearDonations: 'reportSpecialYearDonations',
      // 撈所有顯示特殊奉獻年統計
      getAllSpecialYearDonations: 'getAllSpecialYearDonations',
    }),
    forwardup() {
      this.$router.push("DedicationPage");
    },
    // 撈所有資料
    allRegularDonations() {
      this.loading = true
      this.getAllSpecialYearDonations({
        date: localStorage.getItem('date')
      }).then(res => {
        this.loading = false
        // console.log("195",res.data);
        let data = res.data
        
        // 整理表格表頭
        const headerRow = data[0];
        this.columns = headerRow.map((header) => ({
          title: header,
          dataIndex: header,
          key: header,
          width: 100,
          sorter: (a, b) => this.customSort(a[header], b[header]), // 自定義排序函數
          sortOrder: 'ascend', // 初始排序順序，可以是 'ascend' 或 'descend'
        }));

        // console.log("199", this.columns);

        // 放每一筆data
        for (let i = 1; i < data.length; i++) {
          const rowData = data[i];
          const rowObject = {};
          for (let j = 0; j < rowData.length; j++) {
            const header = headerRow[j];
            // 將非姓名和家號的值為 null 的欄位補上 0
            if (header !== "家號" && header !== "姓名") {
              rowObject[header] = rowData[j] === null ? 0 : rowData[j]; 
            } else {
              rowObject[header] = rowData[j];
            }
          }
          data[i] = rowObject;
        }

        // console.log("227", data);
        // 第一個是表頭，所以直接從1開始，且捨去最後三筆總額的
        for (let i = 1; i < data.length - 3; i++) {
          const rowData = data[i];
          // console.log("209",rowData);
          this.data.push(rowData)
        }

        // this.anonymousPrice = this.result[this.result.length - 2].total
        // this.famousPrice = this.result[this.result.length - 3].total
        // this.totalPrice = this.anonymousPrice + this.famousPrice
        
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
    customSort(a, b) {
      // 自定義排序邏輯，根據字符串長度進行比較
      const lengthA = a ? a.length : 0;
      const lengthB = b ? b.length : 0;
      return lengthA - lengthB;
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
                vs.reportSpecialYearDonations({
                  date: localStorage.getItem('date')
                }).then(res => {
                  // console.log("309",res);
                  // 自動下載
                  const url = window.URL.createObjectURL(new Blob([res.data]));
                  const link = document.createElement('a');
                  link.href = url;
                   // 指定下載的檔案名稱
                  link.setAttribute('download', `${localStorage.getItem('date') +'-其他奉獻.xlsx'}`);
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
