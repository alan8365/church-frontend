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
             <a><a-icon type="environment" style="margin-right: 3px"/>會員管理</a>
            <input
              class="box_search"
              @change="onSearch"
              placeholder="輸入資料"
              v-model="searchText"
            />
            <button type="button" @click="onSearch">查詢</button>
            <div id="computerUI">
              <button type="button" @click="onSearchAll">全部</button>
            </div>
          </div>
          <div class="crud">
            <router-link
              to="/Authority/AddAuthority"
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
import { Modal } from "ant-design-vue";
import Back from "@/components/Back.vue";
import Loading from "@/components/Loading.vue";

import { mapGetters, mapActions, createNamespacedHelpers } from 'vuex';
const user = createNamespacedHelpers('user');

const data = [
  {
    key: '1',
    name: 'John',
    username: 'admin',
    // password: '!123',
    authority: 'admin',
  },
  {
    key: '2',
    name: 'Jim',
    username: 'test',
    // password: '123456',
    authority: 'test',
  },
];

export default {
  data() {
    return {
      searchText: "",
      user_id: "",
      loading: true,
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
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          width: 120,
          sorter: (a, b) => a.name.length - b.name.length,
          sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        },
        {
          title: '帳號',
          dataIndex: 'username',
          key: 'username',
          width: 120,
          sorter: (a, b) => a.username.length - b.username.length,
          sortOrder: sortedInfo.columnKey === 'username' && sortedInfo.order,
        },
        // {
        //   title: '密碼',
        //   dataIndex: 'password',
        //   key: 'password',
        //   sorter: (a, b) => a.password.length - b.password.length,
        //   sortOrder: sortedInfo.columnKey === 'password' && sortedInfo.order,
        // },
        {
          title: '權限',
          dataIndex: 'authority',
          key: 'authority',
          width: 120,
          filters: [
            { text: '最高權限', value: '最高權限' },
            { text: '編輯者', value: '編輯者' },
            { text: '檢視者', value: '檢視者' },
          ],
          sorter: (a, b) => a.authority.length - b.authority.length,
          sortOrder: sortedInfo.columnKey === 'authority' && sortedInfo.order,
          onFilter: (value, record) => record.authority.toString().indexOf(value) !== -1,
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          width: 150,
          customRender: (_, { username }) => (
            <span>
                <a-button style="margin-right: 10px" onClick={() => this.editUser(username)}>編輯</a-button>
                <a-button type="danger" onClick={() => this.checkDeleteUser(username)}>刪除</a-button>
            </span>
          ),
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
    // 撈所有管理員
    this.getUser();
  },
  methods: {
    ...user.mapActions({
      // 撈所有管理員
      getAllUser: 'getAllUser',
      // 刪除管理員
      getDeleteUser: 'getDeleteUser',
      // 撈管理員詳情
      getUserData: 'getUserData',
      // 搜尋管理員
      getSearchUserData: 'getSearchUserData',
    }),
    // 上一頁
    forwardup() {
      this.$router.push("ToolPage");
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
        this.getSearchUserData({
          _basic: this.searchText
        }).then(res => {
          this.loading = false
          if (res.data.length !== 0) {
            for (let i = 0; i < res.data.length; i++) {
              this.data.push({
                  key: i.toString(),
                  name: res.data[i].name,
                  username: res.data[i].username,
                  authority: res.data[i].is_admin == true ? '最高權限' : res.data[i].is_modulator == true ? '編輯者' : '檢視者' ,
              })
            } 
          }
        })
      }
    },
    // 所有管理員
    getUser() {
      this.data = []
        this.getAllUser().then(res => {
            this.loading = false
            // console.log("172",res.data);
            if (res.data.length !== 0) {
              for (let i = 0; i < res.data.length; i++) {
                this.data.push({
                    key: i.toString(),
                    name: res.data[i].name,
                    username: res.data[i].username,
                    authority: res.data[i].is_admin == true ? '最高權限' : res.data[i].is_modulator == true ? '編輯者' : '檢視者' ,
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
    },
    // 編輯管理員
    editUser(username) {
        this.loading = true
        this.getUserData({
            _username: username
        }).then(res => {
            this.loading = false
            let editData = res.data
            localStorage.setItem("editData", JSON.stringify(editData))
            this.$router.push("/Authority/EditAuthority");
        }).catch(error => {
            this.loading = false
            Modal.error({
              title: '系統提示',
              content: '請重新嘗試',
              okText: '確認',
            });
        })
    },
    // 刪除管理員
    checkDeleteUser(username) {
        // console.log("189", username);
        let vs = this
        Modal.confirm({
          title: '系統提示',
          content: `請確認是否刪除「${username}」帳號`,
          okText: '確認',
          cancelText: '取消',
          onOk() {
            vs.loading = true
            vs.deleteUser(username);
          },
        });
    },
    // 刪除管理員
    deleteUser(username) {
        this.getDeleteUser({
            _username: username
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
    },
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
  .crud_button {
    width: 350px;
  }
}
</style>
