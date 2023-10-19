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
            <a><a-icon type="environment" style="margin-right: 3px"/>主日奉獻</a>
            <!-- <a-month-picker @change="onChangeDedicationDate" placeholder="請選擇日期"/> -->
            <input
              class="box_search"
              @change="onSearch"
              placeholder="輸入奉獻資料"
              v-model="searchText"
            />
            <button type="button" @click="onSearch">查詢</button>
            <div id="computerUI">
              <button type="button" @click="onSearchAll">全部</button>
            </div>
          </div>
          <div class="crud">
            <router-link
              v-if="user_authority !== '' && user_authority !== '檢視者'"
              to="/SundayDedication/AddSundayDedication"
              class="crud_button"
              >新增</router-link
            >
            <button
              v-if="user_authority !== '' && user_authority !== '檢視者'"
              @click="exportProfileData"
              class="crud_button"
            >
              匯出
            </button>
          </div>
        </div>
        <div class="box_content" id="computerUI">
          <a-table :columns="columns" :data-source="data" @change="handleChange" :pagination="pagination" :row-selection="rowSelection" :scroll="{ y: scroll_Y }" :row-key="data => data.id"/>
        </div>

        <div class="box_content" id="phoneUI">
          <a-table :columns="columns" :data-source="data" @change="handleChange" :pagination="pagination" :row-selection="rowSelection" :row-key="data => data.id"/>
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
const sundayDedication = createNamespacedHelpers('sundayDedication');
const households = createNamespacedHelpers('households');
const report = createNamespacedHelpers('report');

import { mapGetters, mapActions, createNamespacedHelpers } from 'vuex';

// 假資料
const data = [
  {
    key: '1',
    home_number: '0-609',
    name: 'John',
    donation_at: '',
    money: '0912345678',
    receipt: true,
  },
  {
    key: '2',
    home_number: '0-610',
    name: 'Jim',
    donation_at: '',
    money: '0912345678',
    receipt: true,
  },
];

export default {
  data() {
    return {
      searchText: "",
      user_id: "",
      loading: true,
      isActive: "",
      pagination: {
        defaultPageSize: 10,
        pageSize: 10,
      },
      // data: data,
      data: [],
      filteredInfo: null,
      sortedInfo: null,
      lastSortOrder: null,
      // 已被勾選的人
      selectedRowKeys: [],
      searchDedicationDate: "",
      // 高度
      scroll_Y: 0,
      // 使用者權限
      user_authority: ""
    };
  },
  components: {
    Back,
    Loading
  },
  watch: {
    selectedRowKeys(val) {
      // console.log(val);
    },
  },
  computed: {
    // 選擇方框
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.handleSelectionChange,
      };
    },
    // 欄位
    columns() {
      let { sortedInfo, filteredInfo } = this;
      sortedInfo = sortedInfo || {};
      filteredInfo = filteredInfo || {};

      let columns = []
      if (this.user_authority !== '' && this.user_authority !== '檢視者') {
        columns = [
          {
            title: '家號',
            dataIndex: 'home_number',
            key: 'home_number',
            sorter: (a, b) => this.home_numberSort(a, b),
            // sorter: (a, b) => a.home_number.length - b.home_number.length,
            sortOrder: sortedInfo.columnKey === 'home_number' && sortedInfo.order,
            width: 100,
          },
          {
            title: '姓名/稱呼',
            dataIndex: 'name',
            key: 'name',
            width: 120,
            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
          },
          {
            title: '日期',
            dataIndex: 'donation_at',
            key: 'donation_at',
            width: 120,
            sorter: (a, b) => parseInt(a.donation_at.replace("-","")) - parseInt(b.donation_at.replace("-","")),
            sortOrder: sortedInfo.columnKey === 'donation_at' && sortedInfo.order,
          },
          {
            title: '金額',
            dataIndex: 'donation_amount',
            key: 'donation_amount',
            width: 120,
            sorter: (a, b) => a.donation_amount - b.donation_amount,
            sortOrder: sortedInfo.columnKey === 'donation_amount' && sortedInfo.order,
          },
          // {
          //   title: '備註',
          //   dataIndex: 'comment',
          //   key: 'comment',
          //   width: 120,
          //   sorter: (a, b) => a.comment.length - b.comment.length,
          //   sortOrder: sortedInfo.columnKey === 'comment' && sortedInfo.order,
          // },
          {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: 150,
            customRender: (_, { home_number, id, donation_at }) => (
              <span>
                  <a-button style="margin-right: 10px" onClick={() => this.editUser(home_number, id)}>編輯</a-button>
                  <a-button type="danger" onClick={() => this.checkDeleteUser(home_number, id, donation_at)}>刪除</a-button>
              </span>
            ),
          },
        ];
      } else {
        columns = [
          {
            title: '家號',
            dataIndex: 'home_number',
            key: 'home_number',
            sorter: (a, b) => this.home_numberSort(a, b),
            // sorter: (a, b) => a.home_number.length - b.home_number.length,
            sortOrder: sortedInfo.columnKey === 'home_number' && sortedInfo.order,
            width: 100,
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
            title: '日期',
            dataIndex: 'donation_at',
            key: 'donation_at',
            width: 120,
            sorter: (a, b) => parseInt(a.donation_at.replace("-","")) - parseInt(b.donation_at.replace("-","")),
            sortOrder: sortedInfo.columnKey === 'donation_at' && sortedInfo.order,
          },
          {
            title: '金額',
            dataIndex: 'donation_amount',
            key: 'donation_amount',
            width: 120,
            sorter: (a, b) => a.donation_amount - b.donation_amount,
            sortOrder: sortedInfo.columnKey === 'donation_amount' && sortedInfo.order,
          },
          // {
          //   title: '備註',
          //   dataIndex: 'comment',
          //   key: 'comment',
          //   width: 120,
          //   sorter: (a, b) => a.comment.length - b.comment.length,
          //   sortOrder: sortedInfo.columnKey === 'comment' && sortedInfo.order,
          // },
          // {
          //   title: '操作',
          //   dataIndex: 'action',
          //   key: 'action',
          //   width: 150,
          //   customRender: (_, { home_number, id, donation_at }) => (
          //     <span>
          //         <a-button style="margin-right: 10px" onClick={() => this.editUser(home_number, id)}>編輯</a-button>
          //         <a-button type="danger" onClick={() => this.checkDeleteUser(home_number, id, donation_at)}>刪除</a-button>
          //     </span>
          //   ),
          // },
        ];
      }

      return columns;
    },
  },
  mounted() {
    // 判斷有無token 否則要打回登入頁面
    let token = localStorage.getItem("token")
    if (token == undefined || token == null && token == "") {
      this.$router.push("/");
    }
    
    // 確認權限
    this.user_authority = localStorage.getItem("authority") !== undefined ? localStorage.getItem("authority") : ""
    // 紀錄當前頁面
    localStorage.setItem("pageName", this.$route.name.split("/")[0]);
    // 判斷高度
    this.scroll_Y = document.body.clientHeight - 320
    // 撈所有主日奉獻資料
    this.getUser();
  },
  methods: {
    ...sundayDedication.mapActions({
      // 撈主日奉獻資料
      getAllRegularDonations: 'getAllRegularDonations',
      // 刪除主日奉獻資料
      getDeleteRegularDonations: 'getDeleteRegularDonations',
      // 撈主日奉獻資料詳情
      getRegularDonationsData: 'getRegularDonationsData',
      // 搜尋主日奉獻資料
      getSearchRegularDonationsData: 'getSearchRegularDonationsData',
    }),
    ...report.mapActions({
      // 匯出主日奉獻純資料
      reportRegularDonations: 'reportRegularDonations'
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
    exportProfileData() {
      if (this.selectedRowKeys == "") {
        let vs = this
        Modal.confirm({
          title: '系統提示',
          content: `目前尚未勾選任何主日奉獻資料，是否要匯出「全部」主日奉獻資料？`,
          okText: '匯出全部',
          cancelText: '取消匯出',
          onOk() {
            vs.loading = true
            setTimeout(() => {
              vs.loading = false
              vs.reportRegularDonations({
                ids: []
              }).then(res => {
                // console.log("309",res);
                // 自動下載
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                // 指定下載的檔案名稱
                link.setAttribute('download', '主日捐款資料.xlsx');
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

        // Modal.warning({
        //   title: '系統提示',
        //   content: '請選擇要匯出的教友資料',
        //   okText: '確認'
        // });
      } else {
        this.loading = true
        let finExportUserData = []

        let ids = []
        for (let i = 0; i < this.selectedRowKeys.length; i++) {
          ids.push(this.selectedRowKeys[i])
        }
        setTimeout(() => {
          this.loading = false
          this.reportRegularDonations({
            ids: ids
          }).then(res => {
            // console.log("309",res);
            // 自動下載
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
             // 指定下載的檔案名稱
            link.setAttribute('download', '主日捐款資料.xlsx');
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
      }
    },
    // 搜尋全部
    onSearchAll() {
      this.searchText = ""
      this.data = []
      this.loading = true
      this.getUser()
    },
    // 搜尋
    onSearch() {
      this.data = []
      this.loading = true
      if (this.searchText == "") {
        this.getUser()
      } else {
        this.getSearchRegularDonationsData({
          _basic: this.searchText
        }).then(res => {
          this.loading = false
          if (res.data.length !== 0) {
            for (let i = 0; i < res.data.length; i++) {
              this.data.push({
                key: i.toString(),
                id: res.data[i].id,
                home_number: res.data[i].home_number,
                name: res.data[i].household.head_of_household !== null 
                      ? res.data[i].household.head_of_household.last_name + res.data[i].household.head_of_household.first_name !== undefined
                      : res.data[i].household.comment,
                donation_at: res.data[i].donation_at,
                donation_amount: res.data[i].donation_amount,
                comment: res.data[i].comment !== null ? res.data[i].comment : "" ,
              })
            } 
            this.data = this.data.reverse()
          }
        })
      }
    },
    // 選擇奉獻日期
    onChangeDedicationDate(date, dateString) {
      // console.log(date, dateString);
      this.searchDedicationDate = dateString
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
    handleCheckboxChange(event, key) {
      if (event.target.checked) {
        // 勾选框被选中时，将对应行的 key 加入已选中的行 key 值数组
        this.selectedRowKeys.push(key);
      } else {
        // 勾选框取消选中时，将对应行的 key 从已选中的行 key 值数组中移除
        const index = this.selectedRowKeys.indexOf(key);
        if (index !== -1) {
          this.selectedRowKeys.splice(index, 1);
        }
      }
    },
    handleSelectionChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    getUser() {
      this.data = []
      this.getAllRegularDonations().then(res => {
          this.loading = false
          // console.log("281",res.data);
          if (res.data.length !== 0) {
            for (let i = 0; i < res.data.length; i++) {
              this.data.push({
                key: i.toString(),
                id: res.data[i].id,
                home_number: res.data[i].home_number,
                name: res.data[i].household.head_of_household !== null 
                      ? res.data[i].household.head_of_household.last_name + res.data[i].household.head_of_household.first_name
                      : res.data[i].household.comment,
                donation_at: res.data[i].donation_at,
                donation_amount: res.data[i].donation_amount,
                comment: res.data[i].comment !== null ? res.data[i].comment : "" ,
              })
            } 
            this.data = this.data.reverse()
          }
        }).catch(error => {
            this.loading = false
            Modal.error({
              title: '系統提示',
              content: '請重新嘗試',
              okText: '確認',
            });
        })
    },
    // 編輯主日奉獻
    editUser(home_number, id) {
      this.loading = true
      this.getRegularDonationsData({
          _id: id
      }).then(res => {
          this.loading = false
          let editData = res.data
          localStorage.setItem("editData", JSON.stringify(editData))
          this.$router.push("/SundayDedication/EditSundayDedication");
      }).catch(error => {
          this.loading = false
          Modal.error({
            title: '系統提示',
            content: '請重新嘗試',
            okText: '確認',
          });
      })
      
    },
    // 確認刪除主日奉獻資料
    checkDeleteUser(home_number, id, donation_at) {
        // console.log("189", id);
        let vs = this
        Modal.confirm({
          title: '系統提示',
          content: `請確認是否刪除「${home_number}」家號「${donation_at}」的主日奉獻資料`,
          okText: '確認',
          cancelText: '取消',
          onOk() {
            vs.loading = true
            vs.deleteUser(home_number, id, donation_at);
          },
        });
    },
    // 刪除主日奉獻資料
    deleteUser(home_number, id, donation_at) {
      this.getDeleteRegularDonations({
        _id: id
      }).then(res => {
        this.loading = false
        this.getUser();
        Modal.success({
          title: '系統提示',
          content: '刪除成功',
          okText: '確認',
        });
      }).catch(error => {
          this.loading = false
          Modal.error({
            title: '系統提示',
            content: '刪除失敗，請重新嘗試',
            okText: '確認',
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

.search button {
  width: 100px;
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
