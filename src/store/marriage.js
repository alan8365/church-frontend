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
  // 撈所有婚姻資料
  getAllMarriages({ commit }, contents) {
    const apiUrl = `${api}/marriages`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 新增婚姻資料
  getAddMarriages({ commit }, contents) {
    const apiUrl = `${api}/marriages`;
    const content = {
      marriage_at: contents.marriage_at,
      marriage_location: contents.marriage_location,
      bride: contents.bride,
      bride_id: contents.bride_id,
      bride_birth_at: contents.bride_birth_at,
      bride_father: contents.bride_father,
      bride_mother: contents.bride_mother,

      groom: contents.groom,
      groom_id: contents.groom_id,
      groom_birth_at: contents.groom_birth_at,
      groom_father: contents.groom_father,
      groom_mother: contents.groom_mother,

      presbyter: contents.presbyter,
      witness1: contents.witness1,
      witness2: contents.witness2,
      comment: contents.comment,
    };
    return userTokenAxios.post(apiUrl, content).then((res) => {
      return res;
    });
  },
  // 刪除婚姻資料
  getDeleteMarriages({ commit }, contents) {
    const apiUrl = `${api}/marriages/${contents._id}`;
    return userTokenAxios.delete(apiUrl).then((res) => {
      return res;
    });
  },
  // 撈婚姻資料詳情
  getMarriagesData({ commit }, contents) {
    const apiUrl = `${api}/marriages/${contents._id}`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 儲存婚姻資料
  getSaveMarriagesData({ commit }, contents) {
    const apiUrl = `${api}/marriages/${contents._id}`;
    const content = {
      marriage_at: contents.marriage_at,
      marriage_location: contents.marriage_location,
      bride: contents.bride,
      bride_id: contents.bride_id,
      bride_birth_at: contents.bride_birth_at,
      bride_father: contents.bride_father,
      bride_mother: contents.bride_mother,
      
      groom: contents.groom,
      groom_id: contents.groom_id,
      groom_birth_at: contents.groom_birth_at,
      groom_father: contents.groom_father,
      groom_mother: contents.groom_mother,

      presbyter: contents.presbyter,
      witness1: contents.witness1,
      witness2: contents.witness2,
      comment: contents.comment,
    };
    return userTokenAxios.patch(apiUrl, content).then((res) => {
      return res;
    });
  },
  // 搜尋婚姻資料
  getSearchMarriagesData({ commit }, contents) {
    const apiUrl = `${api}/marriages?any_field=${contents._basic}`;
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
