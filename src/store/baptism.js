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
  // 撈所有領洗資料
  getAllBaptism({ commit }, contents) {
    const apiUrl = `${api}/baptisms`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 新增領洗資料
  getAddBaptism({ commit }, contents) {
    const apiUrl = `${api}/baptisms`;
    const content = {
      // 教友id
      parishioner_id: contents.parishioner_id,
      presbyter_id: contents.presbyter_id,
      baptized_at: contents.baptized_at,
      baptized_location: contents.baptized_location,
      christian_name: contents.christian_name,
      godfather: contents.godfather,
      godfather_id: contents.godfather_id,
      godmother: contents.godmother,
      godmother_id: contents.godmother_id,
      presbyter: contents.presbyter,
      baptized_person: contents.baptized_person,
    };
    return userTokenAxios.post(apiUrl, content).then((res) => {
      return res;
    });
  },
  // 刪除領洗資料
  getDeleteBaptism({ commit }, contents) {
    const apiUrl = `${api}/baptisms/${contents._parishioner_id}`;
    return userTokenAxios.delete(apiUrl).then((res) => {
      return res;
    });
  },
  // 撈領洗資料詳情
  getBaptismData({ commit }, contents) {
    const apiUrl = `${api}/baptisms/${contents._parishioner_id}`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 儲存領洗資料
  getSaveBaptismData({ commit }, contents) {
    const apiUrl = `${api}/baptisms/${contents._parishioner_id}`;
    const content = {
      // 教友id
      parishioner_id: contents.parishioner_id,
      presbyter_id: contents.presbyter_id,
      baptized_at: contents.baptized_at,
      baptized_location: contents.baptized_location,
      christian_name: contents.christian_name,
      godfather: contents.godfather,
      godfather_id: contents.godfather_id,
      godmother: contents.godmother,
      godmother_id: contents.godmother_id,
      presbyter: contents.presbyter,
      baptized_person: contents.baptized_person,
    };
    return userTokenAxios.patch(apiUrl, content).then((res) => {
      return res;
    });
  },
  // 搜尋領洗資料
  getSearchBaptismData({ commit }, contents) {
    const apiUrl = `${api}/baptisms?any_field=${contents._basic}`;
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
