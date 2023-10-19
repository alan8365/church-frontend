<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <router-view />
    </a-config-provider>
  </div>
</template>

<script>
import zhTW from 'ant-design-vue/es/locale/zh_TW';

export default {
  data() {
    return {
      locale: zhTW,
    };
  },
}
</script>

<style lang="scss">
@mixin flex($direction: row, $align: flex-start, $justify: flex-start) {
  display: flex;
  flex-direction: $direction;
  align-items: $align;
  justify-content: $justify;
}

* {
  box-sizing: border-box !important;
  font-family: Microsoft JhengHei !important;
}
body {
  // background-color: #F8F8F8 !important;
  background-image: url("https://i.imgur.com/PVPOFhA.jpg");
  background-repeat: repeat;
  background-origin: border-box;
}

// 色系
:root {
  --primary-color: #D48806;
  --button-color: #f5f5f5;
  --text-color: #222222;
}

::placeholder {
  color: rgb(211, 211, 211);
}

// 圖片等比
.img-inputer__preview-box {
  text-align: center;
}

.img-inputer__preview-box img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}

.img-inputer__err {
  display: none;
}

// // 分頁樣式
// .ant-pagination-item a {
//   color: white !important;
// }

.ant-pagination-item-active a {
  color: var(--primary-color) !important;
}

.ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-ellipsis, .ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-ellipsis {
  color: white !important;
}

.ant-menu-item > .ant-badge > a {
  color: rgba(255, 255, 255, 0.65) !important;
}

.ant-menu-dark .ant-menu-item-selected > .ant-badge > a {
  color: white !important;
}

.ant-menu-item:hover > .ant-badge > a {
  color: var(--primary-color) !important;
}

.ant-menu-dark .ant-menu-item,
.ant-menu-dark .ant-menu-item > a {
  color: #939393 !important;
}

// 頁碼位置
.ant-table-pagination.ant-pagination {
  float: initial !important;
  margin: 10px auto !important;
  margin-bottom: 10px !important;
  display: flex;
  justify-content: center;
}

.ant-spin-container {
  // height: 75vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.ant-table-thead > tr > th, .ant-table-tbody > tr > th {
  min-width: 150px !important;
}

// .ant-table-thead > tr > th:last-child,
// .ant-table-tbody > tr > td:last-child {
//   display: flex;
//   justify-content: flex-end;
// }

// 輸入框
.bar {
  width: 100%;
  height: 4vmin;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 2vmin;
  margin: 1.5vmin 0;
  padding-top: 20px;
  margin-bottom: 3vmin;
}

.barImg a,
.barImg a:hover,
.bar a,
.bar a:hover {
  cursor: initial;
  color: var(--text-color);
}

.bar .ant-input,
.bar .ant-input-affix-wrapper .ant-input {
  width: 27vmin !important;
  height: 4vmin;
  border-radius: 0.5vmin !important;
  border: 1px solid #ababab;
  padding: 1vmin 1.5vmin !important;
  color: var(--text-color);
  font-size: 1.5vmin !important;
}

.bar .ant-input-affix-wrapper {
  width: initial;
}

.bar .ant-input-affix-wrapper .ant-input:not(:last-child) {
  width: 27vmin !important;
  height: 4vmin !important;
}

.bar .ant-select-selection--single {
  width: 27vmin !important;
  height: 4vmin;
  padding: 1vmin 1.5vmin !important;
  color: var(--text-color);
  font-size: 1.5vmin !important;
  border: 1px solid #ababab;
}

.bar .ant-select-selection__placeholder {
  display: flex; 
  margin-top: -11px !important;
}

.bar .ant-select-selection__rendered {
  margin-left: 0px !important;
  line-height: initial !important;
}

.bar .ant-input-number {
  width: 27vmin !important;
  height: 4vmin;
  color: var(--text-color);
  font-size: 1.5vmin !important;
  border: 1px solid #ababab;
}

.box_content_top .noteBox {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: var(--text-color);
  font-size: 1vmin;
  padding-bottom: 5px;
  margin-left: 10px;
}

.bar i {
  color: red;
  margin-right: 5px;
}

.barImg {
  width: 100%;
  min-height: 4vmin;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 2vmin;
  margin: 1.5vmin 0;
  padding-top: 20px;
  margin-bottom: 3vmin;
}

.barImg .img-inputer--large {
  width: 140px;
  height: 140px;
  // margin-right: 30px;
}

.img-inputer__preview-box img {
  width: 100%;
  height: 100%;
}

// 圖片放大
.viewer-title,
.viewer-list > li,
.viewer-prev,
.viewer-play,
.viewer-next,
.viewer-reset,
.viewer-rotate-left,
.viewer-flip-horizontal,
.viewer-flip-vertical
 {
  display: none !important;
}

.viewer-toolbar > ul > li {
  width: 40px;
  height: 40px;
  margin-right: 5px;
  background-color: #f5f5f5;
  border: 1px solid white;
}

.viewer-toolbar > ul > li::before { 
  margin: 9px;
}

.ant-layout-sider-children a {
  font-size: 16px !important;
  font-weight: bold !important;
}

.setting {
  margin: 5px;
  margin-top: 10px;
  min-height: 40px;
  @include flex(row, center, space-between);
}

.search {
  min-width: 600px;
  @include flex(row, center, flex-start);
}

.search a {
  color: var(--text-color);
  font-size: 18px;
  font-weight: bold;
}

.search a:hover {
  color: var(--text-color);
  cursor: initial;
}

.box_search {
  width: 220px;
  height: 40px;
  background-color: rgb(255, 255, 255);
  box-shadow: 0px 0px 5px #737373;
  border-radius: 10px;
  border: none;
  font-weight: bolder;
  font-size: 16px;
  padding-left: 10px;
  outline: var(--primary-color);
  margin-left: 10px;
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
  margin-left: 10px;
}

.crud_button {
  width: 100px;
  height: 40px;
  background-color: var(--button-color);
  box-shadow: 0px 0px 5px #737373;
  border: none;
  text-align: center;
  line-height: 40px;
  border-radius: 10px;
  font-size: 20px;
  margin-right: 10px;
  font-weight: bolder;
  color: var(--text-color);
}

.crud_button:hover {
  cursor: pointer;
  opacity: 0.8;
  color: var(--primary-color);
  transition: opacity 0.2s, color 0.2s;
}

.modal_box .ant-modal-body {
  padding: 10px !important;
}

.box_content_top  .status {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: var(--text-color);
  font-size: 1vmin;
  padding-bottom: 5px;
  margin-left: 80px;
}

.box_content_top  .status a {
  color: #949494;
}

.box_content_top  .status a:hover {
  cursor: initial;
}

.ant-table table {
  font-size: 16px;
}

.ant-btn {
  font-size: 16px !important;
  font-weight: bold !important;
  margin: 5px 0px;
}

.box_content a {
  font-size: 16px;
}

.box_content_top .status a {
  font-size: 12px;
}

.box_content_top .status i {
  font-size: 16px;
  margin-right: 5px;
}

#computerUI {
  display: block;
}

#phoneUI {
  display: none;
}

.userNum {
  font-size: 16px;
  font-weight: bold;
  margin-right: 20px;
}

@media screen and (max-width: 550px) {
  // 下拉選單
  .el-select-dropdown {
    width: 350px !important;
    left: 3% !important;
  }

  .crud_button {
    width: 160px;
  }

  #computerUI {
    display: none;
  }

  #phoneUI {
    display: block;
  }

  .bar {
    height: 10vmin !important;
  }

  .bar .ant-input,
  .bar .ant-input-affix-wrapper .ant-input,
  .bar .ant-select-selection--single,
  .bar .ant-input-number  {
    width: 45vmin !important;
    height: 10vmin !important;
    border-radius: 1vmin !important;
  }

  .bar .ant-input-affix-wrapper .ant-input:not(:last-child) {
    width: 45vmin !important;
    height: 10vmin !important;
  }

  .box_content_top .status {
    margin-left: 50px;
  }

  .ant-btn {
    width: 100px;
    height: 40px !important;
    margin: 5px 0px;
  }

  .search {
    min-width: initial;
    width: 350px;
  }

  .box_search {
    width: 145px !important;
  }

  .box_link {
    width: 350px !important;
  }
}


</style>
