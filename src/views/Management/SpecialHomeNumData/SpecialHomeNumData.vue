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
            <a><a-icon type="environment" style="margin-right: 3px"/>訪客家號</a>
            <input
              class="box_search"
              @change="onSearch"
              placeholder="輸入訪客家號資料"
              v-model="searchText"
            />
            <button type="button" @click="onSearch">查詢</button>
            <div id="computerUI">
              <button type="button" @click="onSearchAll">全部</button>
            </div>
          </div>
          <div class="crud">
            <div class="userNum">
              訪客家號總數： {{ data.length }} 位
            </div>
            <router-link
              v-if="user_authority !== '' && user_authority !== '檢視者'"
              to="/SpecialHomeNumData/AddSpecialHomeNumData"
              class="crud_button"
              >新增訪客</router-link
            >
            <!-- <button
              @click="exportProfileData"
              class="crud_button"
            >
              匯出
            </button> -->
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
const parishioner = createNamespacedHelpers('parishioner');
const households = createNamespacedHelpers('households');

// 假資料
const data = [
  {
    key: '1',
    home_number: '0-609',
    gender: 'females',
    name: 'John',
    mobile_phone: '0912345678',
    home_phone: '02123456',
  },
  {
    key: '2',
    home_number: '0-610',
    gender: 'boy',
    name: 'Jim',
    mobile_phone: '0912345678',
    home_phone: '02123456',
  },
  {
    key: '3',
    home_number: '0-608',
    gender: 'boy',
    name: 'Jerry',
    mobile_phone: '0922345678',
    home_phone: '02123456',
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
      // 已被勾選的人
      selectedRowKeys: [],
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
    // rowSelection() {
    //   return {
    //     selectedRowKeys: this.selectedRowKeys,
    //     onChange: this.handleSelectionChange,
    //   };
    // },
    // 欄位
    columns() {
      let { sortedInfo, filteredInfo } = this;
      sortedInfo = sortedInfo || {};
      filteredInfo = filteredInfo || {};

      let columns = []
      if (this.user_authority !== '' && this.user_authority !== '檢視者') {
        columns = [
          {
            title: '訪客',
            dataIndex: 'home_number',
            key: 'home_number',
            sorter: (a, b) => this.home_numberSort(a, b, 'home_number'),
            // sorter: (a, b) => a.home_number.length - b.home_number.length,
            sortOrder: sortedInfo.columnKey === 'home_number' && sortedInfo.order,
            width: 100,
          },
          {
            title: '稱呼',
            dataIndex: 'comment',
            key: 'comment',
            width: 120,
            sorter: (a, b) => a.comment.length - b.comment.length,
            sortOrder: sortedInfo.columnKey === 'comment' && sortedInfo.order,
          },
          {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: 150,
            customRender: (_, { name, home_number }) => (
              <span>
                <a-button style="margin-right: 10px" onClick={() => this.editUser(name, home_number)}>編輯</a-button>
                <a-button type="danger" onClick={() => this.checkDeleteUser(name, home_number)}>刪除</a-button>
              </span>
            ),
          },
        ];
      } else {
        columns = [
          {
            title: '訪客',
            dataIndex: 'home_number',
            key: 'home_number',
            sorter: (a, b) => this.home_numberSort(a, b, 'home_number'),
            // sorter: (a, b) => a.home_number.length - b.home_number.length,
            sortOrder: sortedInfo.columnKey === 'home_number' && sortedInfo.order,
            width: 100,
          },
          {
            title: '稱呼',
            dataIndex: 'comment',
            key: 'comment',
            width: 120,
            sorter: (a, b) => a.comment.length - b.comment.length,
            sortOrder: sortedInfo.columnKey === 'comment' && sortedInfo.order,
          },
          // {
          //   title: '操作',
          //   dataIndex: 'action',
          //   key: 'action',
          //   width: 150,
          //   customRender: (_, { name, home_number }) => (
          //     <span>
          //       <a-button style="margin-right: 10px" onClick={() => this.editUser(name, home_number)}>編輯</a-button>
          //       <a-button type="danger" onClick={() => this.checkDeleteUser(name, home_number)}>刪除</a-button>
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
    // 撈所有教友
    this.getUser();
  },
  methods: {
    ...households.mapActions({
      // 撈家號資料詳情
      getHouseholdsData: 'getHouseholdsData',
      // 新增家號
      getAddHouseholds: 'getAddHouseholds',
      // 撈所有家號
      getAllHouseholds: 'getAllHouseholds',
      // 搜尋家號
      searchHouseholdsData: 'searchHouseholdsData',
      // 刪除家號
      getDeleteHouseholds: 'getDeleteHouseholds'
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
      this.$router.push("ManagementPage");
    },
    exportProfileData() {
      if (this.selectedRowKeys == "") {
        Modal.warning({
          title: '系統提示',
          content: '請選擇要匯出的教友資料',
          okText: '確認'
        });
      } else {
        this.loading = true
        let finExportUserData = []
        for (let i = 0; i < this.selectedRowKeys.length; i++) {
          let indexx = parseInt(this.selectedRowKeys[i]) - 1
          finExportUserData.push(
            this.data[indexx]
          )
        }
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
        this.getUser()
      } else {
        this.searchHouseholdsData({
          _basic: this.searchText
        }).then(res => {
          this.loading = false
          let data = res.data.filter(x => x.special == true && x.guest == false)
          if (data.length !== 0) {
            for (let i = 0; i < data.length; i++) {
              this.data.push({
                    key: i.toString(),
                    home_number: data[i].home_number,
                    comment: data[i].comment,
              })
              this.data = this.data.reverse()
            } 
          }
        })
      }
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
    // 所有教友
    getUser() {
      this.data = []
        this.getAllHouseholds().then(res => {
            this.loading = false
            // console.log("281",res.data.filter(x => x.special == true && x.guest == false));
            let data = res.data.filter(x => x.special == true && x.guest == false)
            if (data.length !== 0) {
              for (let i = 0; i < data.length; i++) {
                this.data.push({
                    key: i.toString(),
                    home_number: data[i].home_number,
                    comment: data[i].comment,
                })
                this.data = this.data.reverse()
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
    },
    // 編輯教友
    editUser(name, home_number) {
      this.loading = true
      this.getHouseholdsData({
          _home_number: home_number
      }).then(res => {
          this.loading = false
          let editData = res.data
          localStorage.setItem("editData", JSON.stringify(editData))
          this.$router.push("/SpecialHomeNumData/EditSpecialHomeNumData");
      }).catch(error => {
          this.loading = false
          Modal.error({
            title: '系統提示',
            content: '請重新嘗試',
            okText: '確認',
          });
      })
    },
    // 確認刪除家號
    checkDeleteUser(name, home_number) {
        // console.log("189", name, home_number);
        let vs = this
        Modal.confirm({
          title: '系統提示',
          content: `請確認是否刪除「${home_number}」家號資料`,
          okText: '確認',
          cancelText: '取消',
          onOk() {
            vs.loading = true
            vs.deleteUser(name, home_number);
          },
        });
    },
    // 刪除家號
    deleteUser(name, home_number) {
      this.getDeleteHouseholds({
        _home_number: home_number
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

.userNum {
  font-size: 16px;
  margin-right: 20px;
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

  .crud_button {
    width: 350px;
  }
}
</style>
