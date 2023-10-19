/*eslint-disable */

import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
Vue.use(Vuex);

const CryptoJS = require("crypto-js");
// const token = localStorage.getItem("token");

const api = "http://163.17.135.152:7465/api";

// 有Token
const userTokenAxios = axios.create({
  baseURL: "http://163.17.135.152:7465/api",
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
  // 撈所有主日奉獻資料
  getAllRegularDonations({ commit }, contents) {
    const apiUrl = `${api}/regular_donations`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 新增主日奉獻資料
  getAddRegularDonations({ commit }, contents) {
    const apiUrl = `${api}/regular_donations`;
    const content = {
      home_number: contents.home_number,
      name: contents.name,
      donation_at: contents.donation_at,
      donation_amount: contents.donation_amount,
      comment: contents.comment,
      receipt: contents.receipt
    };
    return userTokenAxios.post(apiUrl, content).then((res) => {
      return res;
    });
  },
  // 刪除主日奉獻資料
  getDeleteRegularDonations({ commit }, contents) {
    const apiUrl = `${api}/regular_donations/${contents._id}`;
    return userTokenAxios.delete(apiUrl).then((res) => {
      return res;
    });
  },
  // 撈主日奉獻資料詳情
  getRegularDonationsData({ commit }, contents) {
    const apiUrl = `${api}/regular_donations/${contents._id}`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 儲存主日奉獻資料
  getSaveRegularDonationsData({ commit }, contents) {
    const apiUrl = `${api}/regular_donations/${contents._id}`;
    const content = {
        home_number: contents.home_number,
        name: contents.name,
        donation_at: contents.donation_at,
        donation_amount: contents.donation_amount,
        comment: contents.comment,
        receipt: contents.receipt
    };
    return userTokenAxios.patch(apiUrl, content).then((res) => {
      return res;
    });
  },
  // 搜尋主日奉獻資料
  getSearchRegularDonationsData({ commit }, contents) {
    const apiUrl = `${api}/regular_donations?any_field=${contents._basic}`;
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
