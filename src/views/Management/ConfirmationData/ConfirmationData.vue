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
            <a><a-icon type="environment" style="margin-right: 3px"/>堅振資料</a>
            <input
              class="box_search"
              @change="onSearch"
              placeholder="輸入堅振資料"
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
              to="/ConfirmationData/AddConfirmationData"
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
const confirmation = createNamespacedHelpers('confirmation');
const households = createNamespacedHelpers('households');

// 假資料
const data = [
  {
    key: '1',
    home_number: '0-609',
    gender: 'females',
    name: 'John',
    christian_name: '',
    confirmed_at: '2000-01-01',
    confirmed_location: '彰化市聖十字架天主堂',
    presbyter: ''
  },
  {
    key: '2',
    home_number: '0-610',
    gender: 'boy',
    name: 'Jim',
    christian_name: '',
    confirmed_at: '2001-02-01',
    confirmed_location: '',
    presbyter: ''
  },
  {
    key: '3',
    home_number: '0-608',
    gender: 'boy',
    name: 'Jerry',
    christian_name: '',
    confirmed_at: '2022-03-03',
    confirmed_location: '彰化市聖十字架天主堂',
    presbyter: '黃世明神父'
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
      data: data,
      filteredInfo: null,
      sortedInfo: null,
      lastSortOrder: null,
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
    // 欄位
    columns() {
      let { sortedInfo, filteredInfo } = this;
      sortedInfo = sortedInfo || {};
      filteredInfo = filteredInfo || {};

      let columns = []
      if (this.user_authority !== '' && this.user_authority !== '檢視者') { 
        columns = [
          // {
          //   title: '家號',
          //   dataIndex: 'home_number',
          //   key: 'home_number',
          //   sorter: (a, b) => parseInt(a.home_number.replace("-","")) - parseInt(b.home_number.replace("-","")),
          //   sortOrder: sortedInfo.columnKey === 'home_number' && sortedInfo.order,
          // },
          // {
          //   title: '性別',
          //   dataIndex: 'gender',
          //   key: 'gender',
          //   filters: [
          //     { text: '男', value: '男' },
          //     { text: '女', value: '女' },
          //   ],
          //   sorter: (a, b) => a.gender.length - b.home_number.length,
          //   sortOrder: sortedInfo.columnKey === 'gender' && sortedInfo.order,
          //   filteredValue: filteredInfo.gender || null,
          //   onFilter: (value, record) => record.gender.toString().indexOf(value) !== -1,
          //   customRender: (_, { gender }) => (
          //     <a style="color: #222222">{ gender == 'boy' ? '男' : gender == 'females' ? '女' :'未知'}</a>
          //   ),
          // },
          {
            title: '聖事序號',
            dataIndex: 'serial_number',
            key: 'serial_number',
            width: 120,
            sorter: (a, b) => parseInt(a.serial_number.replace("/","")) - parseInt(b.serial_number.replace("/","")),
            sortOrder: sortedInfo.columnKey === 'serial_number' && sortedInfo.order,
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
            title: '聖名',
            dataIndex: 'christian_name',
            key: 'christian_name',
            width: 120,
            sorter: (a, b) => a.christian_name.length - b.christian_name.length,
            sortOrder: sortedInfo.columnKey === 'christian_name' && sortedInfo.order,
          },
          {
            title: '堅振日期',
            dataIndex: 'confirmed_at',
            key: 'confirmed_at',
            width: 120,
            sorter: (a, b) => parseInt(a.confirmed_at.replace("-","")) - parseInt(b.confirmed_at.replace("-","")),
            sortOrder: sortedInfo.columnKey === 'confirmed_at' && sortedInfo.order,
          },
          {
            title: '堅振教堂',
            dataIndex: 'confirmed_location',
            key: 'confirmed_location',
            width: 150,
            sorter: (a, b) => a.confirmed_location.length - b.confirmed_location.length,
            sortOrder: sortedInfo.columnKey === 'confirmed_location' && sortedInfo.order,
          },
          {
            title: '堅振司鐸',
            dataIndex: 'presbyter',
            key: 'presbyter',
            width: 120,
            sorter: (a, b) => a.presbyter.length - b.presbyter.length,
            sortOrder: sortedInfo.columnKey === 'presbyter' && sortedInfo.order,
          },
          {
            title: '代父（母）',
            dataIndex: 'parents',
            key: 'parents',
            width: 120,
            sorter: (a, b) => a.parents.length - b.parents.length,
            sortOrder: sortedInfo.columnKey === 'parents' && sortedInfo.order,
          },
          {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: 150,
            customRender: (_, { christian_name, parishioner_id }) => (
              <span>
                  <a-button style="margin-right: 10px" onClick={() => this.editUser(christian_name, parishioner_id)}>編輯</a-button>
                  <a-button type="danger" onClick={() => this.checkDeleteUser(christian_name, parishioner_id)}>刪除</a-button>
              </span>
            ),
          },
        ];
      } else {
        columns = [
          // {
          //   title: '家號',
          //   dataIndex: 'home_number',
          //   key: 'home_number',
          //   sorter: (a, b) => parseInt(a.home_number.replace("-","")) - parseInt(b.home_number.replace("-","")),
          //   sortOrder: sortedInfo.columnKey === 'home_number' && sortedInfo.order,
          // },
          // {
          //   title: '性別',
          //   dataIndex: 'gender',
          //   key: 'gender',
          //   filters: [
          //     { text: '男', value: '男' },
          //     { text: '女', value: '女' },
          //   ],
          //   sorter: (a, b) => a.gender.length - b.home_number.length,
          //   sortOrder: sortedInfo.columnKey === 'gender' && sortedInfo.order,
          //   filteredValue: filteredInfo.gender || null,
          //   onFilter: (value, record) => record.gender.toString().indexOf(value) !== -1,
          //   customRender: (_, { gender }) => (
          //     <a style="color: #222222">{ gender == 'boy' ? '男' : gender == 'females' ? '女' :'未知'}</a>
          //   ),
          // },
          {
            title: '聖事序號',
            dataIndex: 'serial_number',
            key: 'serial_number',
            width: 120,
            sorter: (a, b) => parseInt(a.serial_number.replace("/","")) - parseInt(b.serial_number.replace("/","")),
            sortOrder: sortedInfo.columnKey === 'serial_number' && sortedInfo.order,
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
            title: '聖名',
            dataIndex: 'christian_name',
            key: 'christian_name',
            width: 120,
            sorter: (a, b) => a.christian_name.length - b.christian_name.length,
            sortOrder: sortedInfo.columnKey === 'christian_name' && sortedInfo.order,
          },
          {
            title: '堅振日期',
            dataIndex: 'confirmed_at',
            key: 'confirmed_at',
            width: 120,
            sorter: (a, b) => parseInt(a.confirmed_at.replace("-","")) - parseInt(b.confirmed_at.replace("-","")),
            sortOrder: sortedInfo.columnKey === 'confirmed_at' && sortedInfo.order,
          },
          {
            title: '堅振教堂',
            dataIndex: 'confirmed_location',
            key: 'confirmed_location',
            width: 150,
            sorter: (a, b) => a.confirmed_location.length - b.confirmed_location.length,
            sortOrder: sortedInfo.columnKey === 'confirmed_location' && sortedInfo.order,
          },
          {
            title: '堅振司鐸',
            dataIndex: 'presbyter',
            key: 'presbyter',
            width: 120,
            sorter: (a, b) => a.presbyter.length - b.presbyter.length,
            sortOrder: sortedInfo.columnKey === 'presbyter' && sortedInfo.order,
          },
          {
            title: '代父（母）',
            dataIndex: 'parents',
            key: 'parents',
            width: 120,
            sorter: (a, b) => a.parents.length - b.parents.length,
            sortOrder: sortedInfo.columnKey === 'parents' && sortedInfo.order,
          },
          // {
          //   title: '操作',
          //   dataIndex: 'action',
          //   key: 'action',
          //   width: 150,
          //   customRender: (_, { christian_name, parishioner_id }) => (
          //     <span>
          //         <a-button style="margin-right: 10px" onClick={() => this.editUser(christian_name, parishioner_id)}>編輯</a-button>
          //         <a-button type="danger" onClick={() => this.checkDeleteUser(christian_name, parishioner_id)}>刪除</a-button>
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
    // 撈所有堅振資料
    this.getUser();
  },
  methods: {
    ...confirmation.mapActions({
      // 撈堅振資料
      getAllConfirmationm: 'getAllConfirmationm',
      // 刪除堅振資料
      getDeleteConfirmationm: 'getDeleteConfirmationm',
      // 撈堅振資料詳情
      getConfirmationmData: 'getConfirmationmData',
      // 搜尋堅振資料
      getSearchConfirmationmData: 'getSearchConfirmationmData',
    }),
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
        this.getSearchConfirmationmData({
          _basic: this.searchText
        }).then(res => {
          this.loading = false
          if (res.data.length !== 0) {
            for (let i = 0; i < res.data.length; i++) {
              this.data.push({
                  key: i.toString(),
                  serial_number: res.data[i].serial_number,
                  parishioner_id: res.data[i].parishioner_id,
                  home_number: res.data[i].home_number,
                  name: res.data[i].parishioner.last_name + res.data[i].parishioner.first_name,
                  gender: res.data[i].gender,
                  confirmed_at: res.data[i].confirmed_at,
                  confirmed_location: res.data[i].confirmed_location,
                  presbyter: res.data[i].presbyter,
                  christian_name: res.data[i].parishioner.baptism !== undefined && res.data[i].parishioner.baptism !== null ? res.data[i].parishioner.baptism.christian_name : "",
                  parents: res.data[i].godfather == "" ? res.data[i].godmother : res.data[i].godfather,
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
    // 所有堅振資料
    getUser() {
      this.data = []
      this.getAllConfirmationm().then(res => {
            this.loading = false
            // console.log("281",res.data);
            if (res.data.length !== 0) {
              for (let i = 0; i < res.data.length; i++) {
                this.data.push({
                    key: i.toString(),
                    serial_number: res.data[i].serial_number,
                    parishioner_id: res.data[i].parishioner_id,
                    home_number: res.data[i].home_number,
                    name: res.data[i].parishioner.last_name + res.data[i].parishioner.first_name,
                    gender: res.data[i].gender,
                    confirmed_at: res.data[i].confirmed_at,
                    confirmed_location: res.data[i].confirmed_location,
                    presbyter: res.data[i].presbyter,
                    christian_name: res.data[i].parishioner.baptism !== undefined && res.data[i].parishioner.baptism !== null ? res.data[i].parishioner.baptism.christian_name : "",
                    parents: res.data[i].godfather == "" ? res.data[i].godmother : res.data[i].godfather,
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
    // 編輯教友
    editUser(name, parishioner_id) {
      this.loading = true
      this.getConfirmationmData({
          _parishioner_id: parishioner_id
      }).then(res => {
          this.loading = false
          let editData = res.data
          localStorage.setItem("editData", JSON.stringify(editData))
          this.$router.push("/ConfirmationData/EditConfirmationData");
      }).catch(error => {
          this.loading = false
          Modal.error({
            title: '系統提示',
            content: '請重新嘗試',
            okText: '確認',
          });
      })
    },
    // 確認刪除堅振資料
    checkDeleteUser(christian_name, parishioner_id) {
        // console.log("189", christian_name, parishioner_id);
        let vs = this
        Modal.confirm({
          title: '系統提示',
          content: `請確認是否刪除「${christian_name}」教友領洗資料`,
          okText: '確認',
          cancelText: '取消',
          onOk() {
            vs.loading = true
            vs.deleteUser(christian_name, parishioner_id);
          },
        });
    },
    // 刪除領洗資料
    deleteUser(name, parishioner_id) {
      this.getDeleteConfirmationm({
        _parishioner_id: parishioner_id
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
