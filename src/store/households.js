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
  // 撈所有家號資料
  getAllHouseholds({ commit }, contents) {
    const apiUrl = `${api}/households`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 新增家號資料
  getAddHouseholds({ commit }, contents) {
    const apiUrl = `${api}/households`;
    const content = {
      home_number: contents.home_number,
      head_of_household_id: contents.head_of_household_id,
      comment: contents.comment,
      special: contents.special,
    };
    return userTokenAxios.post(apiUrl, content).then((res) => {
      return res;
    });
  },
  // 刪除家號資料
  getDeleteHouseholds({ commit }, contents) {
    const apiUrl = `${api}/households/${contents._home_number}`;
    return userTokenAxios.delete(apiUrl).then((res) => {
      return res;
    });
  },
  // 撈家號資料詳情
  getHouseholdsData({ commit }, contents) {
    const apiUrl = `${api}/households/${contents._home_number}`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 儲存家號資料
  getSaveHouseholdsData({ commit }, contents) {
    const apiUrl = `${api}/households/${contents._home_number}`;
    const content = {
      home_number: contents._home_number,
      head_of_household_id: contents.head_of_household_id,
      comment: contents.comment,
      special: contents.special
    };
    return userTokenAxios.patch(apiUrl, content).then((res) => {
      return res;
    });
  },
  // 搜尋家號資料
  searchHouseholdsData({ commit }, contents) {
    const apiUrl = `${api}/households?any_field=${contents._basic}`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 撈已封存教友
  getAllArchiveHouseholds({ commit }, contents) {
    const apiUrl = `${api}/households?is_archive=true`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 搜尋已封存家號資料
  getSearchArchiveHouseholds({ commit }, contents) {
    const apiUrl = `${api}/households?any_field=${contents._basic}&is_archive=true`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 封存或取消封存家號
  getSaveArchiveHouseholds({ commit }, contents) {
    const apiUrl = `${api}/households/${contents._home_number}`;
    const content = {
      is_archive: contents.is_archive
    };
    return userTokenAxios.patch(apiUrl, content).then((res) => {
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
