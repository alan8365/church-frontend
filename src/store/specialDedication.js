/*eslint-disable */

import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
Vue.use(Vuex);

const CryptoJS = require("crypto-js");
// const token = localStorage.getItem("token");

// const api = "http://163.17.135.152:7465/api";
const api = process.env.VUE_APP_API_URL;

// 有Token
const userTokenAxios = axios.create({
  // baseURL: "http://163.17.135.152:7465/api",
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
    // Authorization: `Bearer ${token}`
  },
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

const state = {

};

const getters = {

};
const actions = {
  // 奉獻活動 ------------------------------------------
  // 撈所有特殊奉獻活動
  getAllSpecialDonationsEvents({ commit }, contents) {
    const apiUrl = `${api}/events`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 新增特殊奉獻活動
  getAddSpecialDonationsEvents({ commit }, contents) {
    const apiUrl = `${api}/events`;
    const content = {
      name: contents.name,
      start_at: contents.start_at,
      comment: contents.comment,
    };
    return userTokenAxios.post(apiUrl, content).then((res) => {
      return res;
    });
  },
  // 刪除特殊奉獻活動
  getDeleteSpecialDonationsEvents({ commit }, contents) {
    const apiUrl = `${api}/events/${contents._id}`;
    return userTokenAxios.delete(apiUrl).then((res) => {
      return res;
    });
  },
  // 撈特殊奉獻活動詳情
  getSpecialDonationsEventsData({ commit }, contents) {
    const apiUrl = `${api}/events/${contents._id}`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 儲存特殊奉獻資料
  getSaveSpecialDonationsEventsData({ commit }, contents) {
    const apiUrl = `${api}/events/${contents._id}`;
    const content = {
      name: contents.name,
      start_at: contents.start_at,
      comment: contents.comment,
    };
    return userTokenAxios.patch(apiUrl, content).then((res) => {
      return res;
    });
  },
  // 搜尋特殊奉獻活動
  getSearchSpecialDonationsEvents({ commit }, contents) {
    const apiUrl = `${api}/events?any_field=${contents._basic}`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 撈對應年份有的活動
  getYearSpecialDonationsEvents({ commit }, contents) {
    const apiUrl = `${api}/events?date=${contents.date}`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },

  // 奉獻細項 ------------------------------------------
  // 撈該活動奉獻細項
  getAllSpecialDonations({ commit }, contents) {
    const apiUrl = `${api}/special_donations?event_id=${contents._id}`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 新增該活動特殊奉獻細項
  getAddSpecialDonations({ commit }, contents) {
    const apiUrl = `${api}/special_donations`;
    const content = {
      event_id: contents.event_id,
      home_number: contents.home_number,
      donation_at: contents.donation_at,
      donation_amount: contents.donation_amount,
      comment: contents.comment,
      receipt: contents.receipt
    };
    return userTokenAxios.post(apiUrl, content).then((res) => {
      return res;
    });
  },
  // 刪除該活動特殊奉獻細項
  getDeleteSpecialDonations({ commit }, contents) {
    const apiUrl = `${api}/special_donations/${contents._id}`;
    return userTokenAxios.delete(apiUrl).then((res) => {
      return res;
    });
  },
  // 撈該活動特殊奉獻細項
  getSpecialDonationsData({ commit }, contents) {
    const apiUrl = `${api}/special_donations/${contents._id}`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 儲存該活動特殊奉獻細項
  getSaveSpecialDonationsData({ commit }, contents) {
    const apiUrl = `${api}/special_donations/${contents._id}`;
    const content = {
      event_id: contents.event_id,
      home_number: contents.home_number,
      donation_at: contents.donation_at,
      donation_amount: contents.donation_amount,
      comment: contents.comment,
      receipt: contents.receipt
    };
    return userTokenAxios.patch(apiUrl, content).then((res) => {
      return res;
    });
  },
  // 搜尋該活動特殊奉獻細項
  getSearchSpecialDonations({ commit }, contents) {
    const apiUrl = `${api}/special_donations?any_field=${contents._basic}&event_id=${contents._id}`;
    return userTokenAxios.get(apiUrl).then((res) => {
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
