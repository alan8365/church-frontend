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
            <a><a-icon type="environment" style="margin-right: 3px"/>婚姻資料</a>
            <input
              class="box_search"
              @change="onSearch"
              placeholder="輸入婚姻資料"
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
              to="/MarriageData/AddMarriageData"
              class="crud_button"
              >新增</router-link
            >
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
const marriage = createNamespacedHelpers('marriage');
const households = createNamespacedHelpers('households');


// 假資料
const data = [
  {
    key: '1',
    marriage_at: '2000-01-01',
    marriage_location: '彰化市聖十字架天主堂',
    groom: 'John',
    bride: 'Jim',
    presbyter: '',
  },
  {
    key: '2',
    marriage_at: '2000-01-01',
    marriage_location: '彰化市聖十字架天主堂',
    groom: 'Jerry',
    bride: 'Iris',
    presbyter: '',
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
  },
  computed: {
    // 欄位
    columns() {
      let { sortedInfo, filteredInfo } = this;
      sortedInfo = sortedInfo || {};
      filteredInfo = filteredInfo || {};

      let columns = []
      if (this.user_authority !== '' && this.user_authority !== '檢視者') {
        columns = [
          {
            title: '婚姻日期',
            dataIndex: 'marriage_at',
            key: 'marriage_at',
            width: 120,
            sorter: (a, b) => parseInt(a.marriage_at.replace("-","")) - parseInt(b.marriage_at.replace("-","")),
            sortOrder: sortedInfo.columnKey === 'marriage_at' && sortedInfo.order,
          },
          {
            title: '證婚教堂',
            dataIndex: 'marriage_location',
            key: 'marriage_location',
            width: 150,
            sorter: (a, b) => a.marriage_location.length - b.marriage_location.length,
            sortOrder: sortedInfo.columnKey === 'marriage_location' && sortedInfo.order,
          },
          {
            title: '證婚司鐸',
            dataIndex: 'presbyter',
            key: 'presbyter',
            width: 120,
            sorter: (a, b) => a.presbyter.length - b.presbyter.length,
            sortOrder: sortedInfo.columnKey === 'presbyter' && sortedInfo.order,
          },
          {
            title: '新郎',
            dataIndex: 'groom',
            key: 'groom',
            width: 120,
            sorter: (a, b) => a.groom.length - b.groom.length,
            sortOrder: sortedInfo.columnKey === 'groom' && sortedInfo.order,
          },
          {
            title: '新娘',
            dataIndex: 'bride',
            key: 'bride',
            width: 120,
            sorter: (a, b) => a.bride.length - b.bride.length,
            sortOrder: sortedInfo.columnKey === 'bride' && sortedInfo.order,
          },
          {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: 150,
            customRender: (_, { groom, bride, id }) => (
              this.renderButtons(groom, bride, id)
              // <span>
              //     <a-button style="margin-right: 10px" onClick={() => this.editUser(groom, bride, id)}>編輯</a-button>
              //     <a-button type="danger" onClick={() => this.checkDeleteUser(groom, bride, id)}>刪除</a-button>
              // </span>
            ),
          },
        ];
      } else {
        columns = [
          {
            title: '婚姻日期',
            dataIndex: 'marriage_at',
            key: 'marriage_at',
            width: 120,
            sorter: (a, b) => parseInt(a.marriage_at.replace("-","")) - parseInt(b.marriage_at.replace("-","")),
            sortOrder: sortedInfo.columnKey === 'marriage_at' && sortedInfo.order,
          },
          {
            title: '證婚教堂',
            dataIndex: 'marriage_location',
            key: 'marriage_location',
            width: 150,
            sorter: (a, b) => a.marriage_location.length - b.marriage_location.length,
            sortOrder: sortedInfo.columnKey === 'marriage_location' && sortedInfo.order,
          },
          {
            title: '證婚司鐸',
            dataIndex: 'presbyter',
            key: 'presbyter',
            width: 120,
            sorter: (a, b) => a.presbyter.length - b.presbyter.length,
            sortOrder: sortedInfo.columnKey === 'presbyter' && sortedInfo.order,
          },
          {
            title: '新郎',
            dataIndex: 'groom',
            key: 'groom',
            width: 120,
            sorter: (a, b) => a.groom.length - b.groom.length,
            sortOrder: sortedInfo.columnKey === 'groom' && sortedInfo.order,
          },
          {
            title: '新娘',
            dataIndex: 'bride',
            key: 'bride',
            width: 120,
            sorter: (a, b) => a.bride.length - b.bride.length,
            sortOrder: sortedInfo.columnKey === 'bride' && sortedInfo.order,
          },
          // {
          //   title: '操作',
          //   dataIndex: 'action',
          //   key: 'action',
          //   width: 150,
          //   customRender: (_, { groom, bride, id }) => (
          //     <span>
          //         <a-button style="margin-right: 10px" onClick={() => this.editUser(groom, bride, id)}>編輯</a-button>
          //         <a-button type="danger" onClick={() => this.checkDeleteUser(groom, bride, id)}>刪除</a-button>
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
    // 撈所有婚姻資料
    this.getUser();
  },
  methods: {
    ...marriage.mapActions({
      // 撈婚姻資料
      getAllMarriages: 'getAllMarriages',
      // 刪除婚姻資料
      getDeleteMarriages: 'getDeleteMarriages',
      // 撈婚姻資料詳情
      getMarriagesData: 'getMarriagesData',
      // 搜尋婚姻資料
      getSearchMarriagesData: 'getSearchMarriagesData',
    }),
    // 根據權限顯示對應按鈕
    renderButtons(groom, bride, id) {
      if (this.user_authority !== '' && this.user_authority !== '檢視者') {
        return (
          <span>
            <a-button style="margin-right: 10px" onClick={() => this.userContent(groom, bride, id)}>查閱</a-button>
            <a-button style="margin-right: 10px; background-color: #5EA64E; color: #ffffff" onClick={() => this.editUser(groom, bride, id)}>編輯</a-button>
            <a-button type="danger" onClick={() => this.checkDeleteUser(groom, bride, id)}>刪除</a-button>
          </span>
        );
      } else {
        return (
          <span>
            <a-button style="margin-right: 10px" onClick={() => this.userContent(groom, bride, id)}>查閱</a-button>
          </span>
        )
      }
    },
    forwardup() {
      this.$router.push("ManagementPage");
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
        this.getSearchMarriagesData({
          _basic: this.searchText
        }).then(res => {
          this.loading = false
          if (res.data.length !== 0) {
            for (let i = 0; i < res.data.length; i++) {
              this.data.push({
                key: i.toString(),
                id: res.data[i].id,
                marriage_at: res.data[i].marriage_at,
                marriage_location: res.data[i].marriage_location,
                groom: res.data[i].groom,
                bride: res.data[i].bride,
                groom_id: res.data[i].groom_id,
                bride_id: res.data[i].bride_id,
                presbyter: res.data[i].presbyter,
                witness1: res.data[i].witness1,
                witness2: res.data[i].witness2,
                comment: res.data[i].comment
              })
            } 
            this.data = this.data.reverse()
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
    getUser() {
      this.data = []
      this.getAllMarriages().then(res => {
          this.loading = false
          // console.log("281",res.data);
          if (res.data.length !== 0) {
            for (let i = 0; i < res.data.length; i++) {
              this.data.push({
                key: i.toString(),
                id: res.data[i].id,
                marriage_at: res.data[i].marriage_at,
                marriage_location: res.data[i].marriage_location,
                groom: res.data[i].groom,
                bride: res.data[i].bride,
                groom_id: res.data[i].groom_id,
                bride_id: res.data[i].bride_id,
                presbyter: res.data[i].presbyter,
                witness1: res.data[i].witness1,
                witness2: res.data[i].witness2,
                comment: res.data[i].comment
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
    // 婚姻詳情
    userContent(groom, bride, id) {
      this.loading = true
      this.getMarriagesData({
          _id: id
      }).then(res => {
          this.loading = false
          let editData = res.data
          localStorage.setItem("editData", JSON.stringify(editData))
          this.$router.push("/MarriageData/MarriageContentData");
      }).catch(error => {
          this.loading = false
          Modal.error({
            title: '系統提示',
            content: '請重新嘗試',
            okText: '確認',
          });
      })
    },
    // 編輯婚姻
    editUser(groom, bride, id) {
      this.loading = true
      this.getMarriagesData({
          _id: id
      }).then(res => {
          this.loading = false
          let editData = res.data
          localStorage.setItem("editData", JSON.stringify(editData))
          this.$router.push("/MarriageData/EditMarriageData");
      }).catch(error => {
          this.loading = false
          Modal.error({
            title: '系統提示',
            content: '請重新嘗試',
            okText: '確認',
          });
      })
      
    },
    // 確認刪除婚姻資料
    checkDeleteUser(groom, bride, id) {
        // console.log("189", groom, bride, id);
        let vs = this
        Modal.confirm({
          title: '系統提示',
          content: `請確認是否刪除新郎「${groom}」與新娘「${bride}」的婚姻資料`,
          okText: '確認',
          cancelText: '取消',
          onOk() {
            vs.loading = true
            vs.deleteUser(groom, bride, id);
          },
        });
    },
    // 刪除婚姻資料
    deleteUser(groom, bride, id) {
      this.getDeleteMarriages({
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

  .crud_button {
    width: 350px;
  }
}
</style>
