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
            <a><a-icon type="environment" style="margin-right: 3px"/>特殊奉獻</a>
            <!-- <a-month-picker @change="onChangeDedicationDate" placeholder="請選擇日期"/> -->
            <input
              class="box_search"
              @change="onSearch"
              placeholder="輸入活動名稱"
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
              to="/SpecialDedication/AddSpecialDedication"
              class="crud_button"
              >新增活動</router-link
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
        <div class="box_content" id="computerUI">
          <a-table :columns="columns" :data-source="data" @change="handleChange" :pagination="pagination" :scroll="{ y: scroll_Y }" :row-key="data => data.id"/>
        </div>
        <div class="box_content" id="phoneUI">
          <a-table :columns="columns" :data-source="data" @change="handleChange" :pagination="pagination" :row-key="data => data.id"/>
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
const specialDedication = createNamespacedHelpers('specialDedication');
const households = createNamespacedHelpers('households');
const report = createNamespacedHelpers('report');

import { mapGetters, mapActions, createNamespacedHelpers } from 'vuex';

// 假資料
const data = [
  {
    key: '1',
    name: '聖誕活動',
    start_at: '2022-12-24',
  },
  {
    key: '2',
    name: '跨年活動',
    start_at: '2022-12-31',
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
      searchDedicationDate: "",
      // 高度
      scroll_Y: 0,
      // 使用者權限
      user_authority: "",
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
      
      const columns = [
        {
          title: '活動日期',
          dataIndex: 'start_at',
          key: 'start_at',
          width: 120,
          sorter: (a, b) => parseInt(a.start_at.replace(/-/g, '')) - parseInt(b.start_at.replace(/-/g, '')),
          sortOrder: sortedInfo.columnKey === 'start_at' && sortedInfo.order,
        },
        {
          title: '活動名稱',
          dataIndex: 'name',
          key: 'name',
          width: 150,
          sorter: (a, b) => a.name.length - b.name.length,
          sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        },
        {
          title: '奉獻筆數',
          dataIndex: 'donation_count',
          key: 'donation_count',
          width: 150,
          sorter: (a, b) => a.donation_count - b.donation_count,
          sortOrder: sortedInfo.columnKey === 'donation_count' && sortedInfo.order,
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          width: 150,
          customRender: (_, { id, name }) => (
            this.renderButtons(id, name)
            // <span>
            //     <a-button style="margin-right: 10px" onClick={() => this.activityContent(name)}>細項</a-button>
            //     <a-button style="margin-right: 10px; background-color: #5EA64E; color: #ffffff" onClick={() => this.editUser(name)}>編輯</a-button>
            //     <a-button type="danger" onClick={() => this.checkDeleteUser(name)}>刪除</a-button>
            // </span>
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
    
    // 確認權限
    this.user_authority = localStorage.getItem("authority") !== undefined ? localStorage.getItem("authority") : ""
    // 紀錄當前頁面
    localStorage.setItem("pageName", this.$route.name.split("/")[0]);
    // 判斷高度
    this.scroll_Y = document.body.clientHeight - 320
    // 撈所有特殊奉獻活動
    this.getUser();
  },
  methods: {
     ...specialDedication.mapActions({
      // 撈特殊奉獻活動
      getAllSpecialDonationsEvents: 'getAllSpecialDonationsEvents',
      // 刪除特殊奉獻活動
      getDeleteSpecialDonationsEvents: 'getDeleteSpecialDonationsEvents',
      // 撈特殊奉獻活動詳情
      getSpecialDonationsEventsData: 'getSpecialDonationsEventsData',
      // 搜尋特殊奉獻活動
      getSearchSpecialDonationsEvents: 'getSearchSpecialDonationsEvents',
    }),
    ...report.mapActions({
      // 匯出特殊奉獻純資料
      reportSpecialDonations: 'reportSpecialDonations'
    }),
    // 根據權限顯示對應按鈕
    renderButtons(id, name) {
      if (this.user_authority !== '' && this.user_authority !== '檢視者') {
        return (
          <span>
              <a-button style="margin-right: 10px" onClick={() => this.activityContent(id, name)}>奉獻</a-button>
              <a-button style="margin-right: 10px; background-color: #5EA64E; color: #ffffff" onClick={() => this.editUser(id, name)}>編輯</a-button>
              <a-button type="danger" onClick={() => this.checkDeleteUser(id, name)}>刪除</a-button>
          </span>
        );
      } else {
        return (
          <span>
              <a-button style="margin-right: 10px" onClick={() => this.activityContent(id, name)}>細項</a-button>
          </span>
        )
      }
    },
    forwardup() {
      this.$router.push("DedicationPage");
    },
    exportProfileData() {
      if (this.selectedRowKeys == "") {
        let vs = this
        Modal.warning({
          title: '系統提示',
          content: '請選擇要匯出的活動特殊奉獻',
          okText: '確認'
        });
      } else {
        this.loading = true
        let finExportUserData = []

        let ids = []
        for (let i = 0; i < this.selectedRowKeys.length; i++) {
          ids.push(this.selectedRowKeys[i])
        }
        setTimeout(() => {
          this.loading = false
          this.reportSpecialDonations({
            ids: ids
          }).then(res => {
            // console.log("309",res);
            // 自動下載
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
             // 指定下載的檔案名稱
            link.setAttribute('download', '特殊捐款資料.xlsx');
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
        this.getSearchSpecialDonationsEvents({
          _basic: this.searchText
        }).then(res => {
          this.loading = false
          if (res.data.length !== 0) {
            for (let i = 0; i < res.data.length; i++) {
              this.data.push({
                key: i.toString(),
                id: res.data[i].id,
                name: res.data[i].name,
                start_at: res.data[i].start_at,
                comment: res.data[i].comment,
                donation_count: res.data[i].donation_count
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
      this.getAllSpecialDonationsEvents().then(res => {
          this.loading = false
          // console.log("281",res.data);
          if (res.data.length !== 0) {
            for (let i = 0; i < res.data.length; i++) {
              this.data.push({
                key: i.toString(),
                id: res.data[i].id,
                name: res.data[i].name,
                start_at: res.data[i].start_at,
                comment: res.data[i].comment,
                donation_count: res.data[i].donation_count
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
    // 編輯特殊奉獻活動
    editUser(id, name) {
      this.loading = true
      this.getSpecialDonationsEventsData({
          _id: id
      }).then(res => {
          this.loading = false
          let editData = res.data
          localStorage.setItem("editData", JSON.stringify(editData))
          this.$router.push("/SpecialDedication/EditSpecialDedication");
      }).catch(error => {
          this.loading = false
          Modal.error({
            title: '系統提示',
            content: '請重新嘗試',
            okText: '確認',
          });
      })
      
    },
    // 特殊活動奉獻細項
    activityContent(id, name) {
      localStorage.setItem("event_name", name)
      localStorage.setItem("event_id", id)
      this.$router.push("/SpecialDedication/SpecialDedicationContent");
    },
    // 確認刪除特殊奉獻活動
    checkDeleteUser(id, name) {
      // console.log("189", id);
      let vs = this
      Modal.confirm({
        title: '系統提示',
        content: `請確認是否刪除「${name}」特殊奉獻活動`,
        okText: '確認',
        cancelText: '取消',
        onOk() {
          vs.loading = true
          vs.deleteUser(id, name);
        },
      });
    },
    // 刪除特殊奉獻活動
    deleteUser(id, name) {
      this.getDeleteSpecialDonationsEvents({
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

.search a {
    color: var(--text-color);
    font-size: 18px;
    font-weight: bold;
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
