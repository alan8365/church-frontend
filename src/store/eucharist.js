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
  // 撈所有初領聖體資料
  getAllEucharist({ commit }, contents) {
    const apiUrl = `${api}/eucharists`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 新增堅陣資料
  getAddEucharist({ commit }, contents) {
    const apiUrl = `${api}/eucharists`;
    const content = {
      // 教友id
      parishioner_id: contents.parishioner_id,
      eucharist_at: contents.eucharist_at,
      eucharist_location: contents.eucharist_location,
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
  // 刪除初領聖體資料
  getDeleteEucharist({ commit }, contents) {
    const apiUrl = `${api}/eucharists/${contents._parishioner_id}`;
    return userTokenAxios.delete(apiUrl).then((res) => {
      return res;
    });
  },
  // 撈初領聖體資料詳情
  getEucharistData({ commit }, contents) {
    const apiUrl = `${api}/eucharists/${contents._parishioner_id}`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 儲存初領聖體資料
  getSaveEucharistData({ commit }, contents) {
    const apiUrl = `${api}/eucharists/${contents._parishioner_id}`;
    const content = {
        // 教友id
        parishioner_id: contents.parishioner_id,
        eucharist_at: contents.eucharist_at,
        eucharist_location: contents.eucharist_location,
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
  // 搜尋初領聖體資料
  getSearchEucharistData({ commit }, contents) {
    const apiUrl = `${api}/eucharists?any_field=${contents._basic}`;
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
