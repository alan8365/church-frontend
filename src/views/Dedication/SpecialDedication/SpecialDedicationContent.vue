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
            <a><a-icon type="environment" style="margin-right: 3px"/>{{ eventName }}</a>
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
              總金額： <a style="color: red">{{ totalPrice }}</a> 元
            </div>
            <router-link
              v-if="user_authority !== '' && user_authority !== '檢視者'"
              to="/SpecialDedicationContent/AddSpecialDedicationContent"
              class="crud_button"
              >新增</router-link
            >
            <!-- <button
              v-if="user_authority !== '' && user_authority !== '檢視者'"
              @click="exportProfileData"
              class="crud_button"
            >
              匯出
            </button> -->
          </div>
        </div>
        <!-- :row-selection="rowSelection" -->
        <div class="box_content">
          <a-table :columns="columns" :data-source="data" @change="handleChange" :pagination="pagination" />
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
const specialDedication = createNamespacedHelpers('specialDedication');

// 假資料
const data = [
  {
    key: '1',
    home_number: '0-609',
    name: 'John',
    donation_at: '2022-12-24',
    donation_amount: '0912345678',
    remark: "",
  },
  {
    key: '2',
    home_number: '0-610',
    name: 'Jim',
    donation_at: '2022-12-24',
    donation_amount: '0912345678',
    receipt: "",
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
      data: [],
      filteredInfo: null,
      sortedInfo: null,
      lastSortOrder: null,
      // 已被勾選的人
      selectedRowKeys: [],
      searchDedicationDate: "",
      // 使用者權限
      user_authority: "",
      // 活動名稱
      eventName: localStorage.getItem("event_name"),
      totalPrice: 0
    };
  },
  components: {
    Back,
    Loading
  },
  watch: {
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
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
          },
          {
            title: '奉獻日期',
            dataIndex: 'donation_at',
            key: 'donation_at',
            sorter: (a, b) => parseInt(a.donation_at.replace("-","")) - parseInt(b.donation_at.replace("-","")),
            sortOrder: sortedInfo.columnKey === 'donation_at' && sortedInfo.order,
          },
          {
            title: '金額',
            dataIndex: 'donation_amount',
            key: 'donation_amount',
            sorter: (a, b) => a.donation_amount - b.donation_amount,
            sortOrder: sortedInfo.columnKey === 'donation_amount' && sortedInfo.order,
          },
          // {
          //   title: '備註',
          //   dataIndex: 'receipt',
          //   key: 'receipt',
          //   sorter: (a, b) => a.receipt.length - b.receipt.length,
          //   sortOrder: sortedInfo.columnKey === 'receipt' && sortedInfo.order,
          // },
          {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            customRender: (_, { home_number, id, donation_at }) => (
              <span>
                  <a-button style="margin-right: 10px" onClick={() => this.editUser(id, home_number)}>編輯</a-button>
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
            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
          },
          {
            title: '奉獻日期',
            dataIndex: 'donation_at',
            key: 'donation_at',
            sorter: (a, b) => parseInt(a.donation_at.replace("-","")) - parseInt(b.donation_at.replace("-","")),
            sortOrder: sortedInfo.columnKey === 'donation_at' && sortedInfo.order,
          },
          {
            title: '金額',
            dataIndex: 'donation_amount',
            key: 'donation_amount',
            sorter: (a, b) => a.donation_amount - b.donation_amount,
            sortOrder: sortedInfo.columnKey === 'donation_amount' && sortedInfo.order,
          },
          // {
          //   title: '備註',
          //   dataIndex: 'receipt',
          //   key: 'receipt',
          //   sorter: (a, b) => a.receipt.length - b.receipt.length,
          //   sortOrder: sortedInfo.columnKey === 'receipt' && sortedInfo.order,
          // },
          // {
          //   title: '操作',
          //   dataIndex: 'action',
          //   key: 'action',
          //   customRender: (_, { name }) => (
          //     <span>
          //         <a-button style="margin-right: 10px" onClick={() => this.editUser(name)}>編輯</a-button>
          //         <a-button type="danger" onClick={() => this.checkDeleteUser(name)}>刪除</a-button>
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
    // 撈對應活動細項
    this.getUser()
  },
  methods: {
    ...specialDedication.mapActions({
      // 撈該活動奉獻細項
      getAllSpecialDonations: 'getAllSpecialDonations',
      // 刪除特殊奉獻活動
      getDeleteSpecialDonations: 'getDeleteSpecialDonations',
      // 撈特殊奉獻活動詳情
      getSpecialDonationsData: 'getSpecialDonationsData',
      // 搜尋特殊奉獻活動
      getSearchSpecialDonations: 'getSearchSpecialDonations',
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
      this.$router.push("/SpecialDedication");
    },
    exportProfileData() {
      if (this.selectedRowKeys == "") {
        Modal.warning({
          title: '系統提示',
          content: '請選擇要匯出的奉獻資料',
          okText: '確認'
        });
      } else {
        this.loading = true
        let finExportUserData = []
        // for (let i = 0; i < this.selectedRowKeys.length; i++) {
        //   let indexx = parseInt(this.selectedRowKeys[i]) - 1
        //   finExportUserData.push(
        //     this.data[indexx]
        //   )
        // }
        setTimeout(() => {
          this.loading = false
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
        this.data = []
        this.getUser()
      } else {
        this.getSearchSpecialDonations({
          _basic: this.searchText,
          _id: localStorage.getItem("event_id")
        }).then(res => {
          this.loading = false
          if (res.data.length !== 0) {
            for (let i = 0; i < res.data.length; i++) {
              this.data.push({
                key: i.toString(),
                id: res.data[i].id,
                home_number: res.data[i].home_number,
                // name: res.data[i].name !== null ? res.data[i].last_name + res.data[i].first_name : [], 
                name: res.data[i].name !== null ? res.data[i].name : "", 
                // name: res.data[i].household.head_of_household !== null 
                //       ? res.data[i].household.head_of_household.name
                //       : res.data[i].household.comment,
                donation_at: res.data[i].donation_at,
                donation_amount: res.data[i].donation_amount,
                comment: res.data[i].comment !== null ? res.data[i].comment : "" ,
              })
            } 
            let donation_amount = this.data.map(x => x.donation_amount)
            this.totalPrice = donation_amount.reduce((a,b) => a + b)
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
      this.getAllSpecialDonations({
        _id: localStorage.getItem("event_id")
      }).then(res => {
          this.loading = false
          // console.log("281",res.data);
          if (res.data.length !== 0) {
            for (let i = 0; i < res.data.length; i++) {
              this.data.push({
                key: i.toString(),
                id: res.data[i].id,
                home_number: res.data[i].home_number,
                // name: res.data[i].name !== null ? res.data[i].last_name + res.data[i].first_name : [],
                name: res.data[i].name !== null ? res.data[i].name : "", 
                // name: res.data[i].household.head_of_household !== null 
                //       ? res.data[i].household.head_of_household.name
                //       : res.data[i].household.comment,
                donation_at: res.data[i].donation_at,
                donation_amount: res.data[i].donation_amount,
                comment: res.data[i].comment !== null ? res.data[i].comment : "" ,
              })
            } 
            let donation_amount = this.data.map(x => x.donation_amount)
            this.totalPrice = donation_amount.reduce((a,b) => a + b)
            this.data = this.data.reverse()
          }
        }).catch(error => {
          // console.log("365",error);
            this.loading = false
            Modal.error({
              title: '系統提示',
              content: '請重新嘗試',
              okText: '確認',
            });
        })
    },
    // 編輯特殊奉獻活動細項
    editUser(id, name) {
      this.loading = true
      this.getSpecialDonationsData({
          _id: id
      }).then(res => {
          this.loading = false
          let editData = res.data
          localStorage.setItem("editData", JSON.stringify(editData))
          this.$router.push("/SpecialDedicationContent/EditSpecialDedicationContent");
      }).catch(error => {
          this.loading = false
          Modal.error({
            title: '系統提示',
            content: '請重新嘗試',
            okText: '確認',
          });
      })
      
    },
    // 確認刪除特殊奉獻活動細項
    checkDeleteUser(home_number, id, donation_at) {
      // console.log("189", id);
      let vs = this
      Modal.confirm({
        title: '系統提示',
        content: `請確認是否刪除「${home_number}」家號「${donation_at}」的特殊奉獻資料`,
        okText: '確認',
        cancelText: '取消',
        onOk() {
          vs.loading = true
          vs.deleteUser(home_number, id, donation_at);
        },
      });
    },
    // 刪除特殊奉獻活動細項
    deleteUser(home_number, id, donation_at) {
      this.getDeleteSpecialDonations({
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
