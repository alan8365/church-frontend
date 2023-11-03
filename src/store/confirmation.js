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
  // 撈所有堅振資料
  getAllConfirmationm({ commit }, contents) {
    const apiUrl = `${api}/confirmations`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 新增堅陣資料
  getAddConfirmationm({ commit }, contents) {
    const apiUrl = `${api}/confirmations`;
    const content = {
      // 教友id
      parishioner_id: contents.parishioner_id,
      confirmed_at: contents.confirmed_at,
      confirmed_location: contents.confirmed_location,
      christian_name: contents.christian_name,
      godfather: contents.godfather,
      godfather_id: contents.godfather_id,
      godmother: contents.godmother,
      godmother_id: contents.godmother_id,
      presbyter: contents.presbyter,
      presbyter_id: contents.presbyter_id,
    };
    return userTokenAxios.post(apiUrl, content).then((res) => {
      return res;
    });
  },
  // 刪除堅振資料
  getDeleteConfirmationm({ commit }, contents) {
    const apiUrl = `${api}/confirmations/${contents._parishioner_id}`;
    return userTokenAxios.delete(apiUrl).then((res) => {
      return res;
    });
  },
  // 撈堅振資料詳情
  getConfirmationmData({ commit }, contents) {
    const apiUrl = `${api}/confirmations/${contents._parishioner_id}`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 儲存堅振資料
  getSaveConfirmationmData({ commit }, contents) {
    const apiUrl = `${api}/confirmations/${contents._parishioner_id}`;
    const content = {
        // 教友id
        parishioner_id: contents.parishioner_id,
        confirmed_at: contents.confirmed_at,
        confirmed_location: contents.confirmed_location,
        christian_name: contents.christian_name,
        godfather: contents.godfather,
        godfather_id: contents.godfather_id,
        godmother: contents.godmother,
        godmother_id: contents.godmother_id,
        presbyter: contents.presbyter,
        presbyter_id: contents.presbyter_id,
    };
    return userTokenAxios.patch(apiUrl, content).then((res) => {
      return res;
    });
  },
  // 搜尋堅振資料
  getSearchConfirmationmData({ commit }, contents) {
    const apiUrl = `${api}/confirmations?any_field=${contents._basic}`;
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
