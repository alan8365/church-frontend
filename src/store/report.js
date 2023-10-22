/*eslint-disable */

import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
Vue.use(Vuex);

const CryptoJS = require("crypto-js");
// const token = localStorage.getItem("token");

// const api = "http://163.17.135.152:7465/api";
const api = process.env.API_URL;

// 有Token
const userTokenAxios = axios.create({
  // baseURL: "http://163.17.135.152:7465/api",
  baseURL: process.env.API_URL,
  headers: {
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
    // Authorization: `Bearer ${token}`
  },
});

// 下載excel
const downloadAxios = axios.create({
  // baseURL: "http://163.17.135.152:7465/api",
  baseURL: process.env.API_URL,
  headers: {
  //   "Cache-Control": "no-cache",
    "Content-Type": "application/json",
    // Authorization: `Bearer ${token}`
  },
  responseType: 'blob'
});

// 在這裡攔截請求，並設置 Authorization header
userTokenAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
downloadAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const state = {

};

const getters = {

};
const actions = {
  // 顯示主日奉獻資料-月統計
  getAllRegularDonations({ commit }, contents) {
    const apiUrl = `${api}/report/regular_donations/month?date=${contents.date}&test=true`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 顯示主日奉獻資料-年統計
  getAllRegularYearDonations({ commit }, contents) {
    const apiUrl = `${api}/report/regular_donations/year?date=${contents.date}&test=true`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 顯示特殊奉獻資料
  getAllRegularSpecialDonations({ commit }, contents) {
    const apiUrl = `${api}/report/special_donations/event?event_id=${contents.event_id}&test=true`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 顯示主日奉獻資料包含特殊統計-送公署用
  getAllDonations({ commit }, contents) {
    const apiUrl = `${api}/report/all_donations/year?date=${contents.date}&test=true`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 顯示捐款收據名冊
  getReceipt({ commit }, contents) {
    const apiUrl = `${api}/report/regular_donations/receipt?date=${contents.date}&test=true`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 顯示特殊奉獻年統計資料
  getAllSpecialYearDonations({ commit }, contents) {
    const apiUrl = `${api}/report/special_donations/year?date=${contents.date}&test=true`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },

  // 查詢統資資料相關-------------------
  // 查詢捐款收據名冊
  getSearchReportReceipt({ commit }, contents) {
    const apiUrl = `${api}/report/regular_donations/receipt?date=${contents.date}&test=true&any_field=${contents._basic}`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 查詢送公署名冊
  getSearchAllDonations({ commit }, contents) {
    const apiUrl = `${api}/report/all_donations/year?date=${contents.date}&test=true&any_field=${contents._basic}`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },


  // 匯出統計資料相關 --------------------
  // 匯出主日奉獻資料-月統計
  reportMonthRegularDonations({ commit }, contents) {
    const apiUrl = `${api}/report/regular_donations/month?date=${contents.date}`;
    return downloadAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 匯出主日奉獻資料-年統計
  reportYearRegularDonations({ commit }, contents) {
    const apiUrl = `${api}/report/regular_donations/year?date=${contents.date}`;
    return downloadAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 匯出特殊奉獻資料
  reportSpecialDonations({ commit }, contents) {
    const apiUrl = `${api}/report/special_donations/event?event_id=${contents.event_id}`;
    return downloadAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 匯出主日奉獻資料包含特殊統計-送公署用
  reportAllDonations({ commit }, contents) {
    const apiUrl = `${api}/report/all_donations/year?date=${contents.date}`;
    return downloadAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 匯出教友資料
  reportParishioner({ commit }, contents) {
    const apiUrl = `${api}/report/parishioner`;
    const content = {
      pid: contents.pid,
    };
    return downloadAxios.post(apiUrl, content).then((res) => {
      return res;
    });
  },
  // 匯出主日奉獻純資料
  reportRegularDonations({ commit }, contents) {
    const apiUrl = `${api}/report/regular_donations`;
    const content = {
      ids: contents.ids,
    };
    return downloadAxios.post(apiUrl, content).then((res) => {
      return res;
    });
  },
  // 匯出特殊奉獻純資料
  reportSpecialDonationsData({ commit }, contents) {
    const apiUrl = `${api}/report/special_donations`;
    const content = {
      ids: contents.ids,
    };
    return downloadAxios.post(apiUrl, content).then((res) => {
      return res;
    });
  },
  // 匯出捐款收據名冊
  reportReceipt({ commit }, contents) {
    const apiUrl = `${api}/report/regular_donations/receipt?date=${contents.date}`;
    return downloadAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 匯出特殊奉獻年統計資料
  reportSpecialYearDonations({ commit }, contents) {
    const apiUrl = `${api}/report/special_donations/year?date=${contents.date}`;
    return downloadAxios.get(apiUrl).then((res) => {
      return res;
    });
  },

  // 匯出列印相關----------------------- 
  // 列印教友證
  printParishioner({ commit }, contents) {
    const apiUrl = `${api}/id-cards`;
    let content = {}
    if (contents.ids.length !== 0) {
      content = {
        ids: contents.ids,
      };
    }
    return downloadAxios.post(apiUrl, content).then((res) => {
      return res;
    }).catch(async (error) => {
      const blobData = await error.response.data.text();
      const responseData = JSON.parse(blobData);

      if (responseData !== undefined) {
        return Promise.reject(responseData.errors);
      } else {
        return Promise.reject('請重新嘗試');
      }
    });
  },
  // 列印領洗證明
  printProfileCertificate({ commit }, contents) {
    const apiUrl = `${api}/parishioners/${contents._id}/certificate`;
    return downloadAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
};
const mutations = {

};

export default {
  namespaced: true,
  state, getters, mutations, actions
}
