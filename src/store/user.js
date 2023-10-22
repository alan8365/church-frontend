/*eslint-disable */

import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
Vue.use(Vuex);

const CryptoJS = require("crypto-js");
const token = localStorage.getItem("token");

// 本地跨域測試
// const userAxios = axios.create({
//   baseURL: "/api",
//   headers: {
//     "Cache-Control": "no-cache",
//   },
// });

// 有Token
// const userTokenAxios = axios.create({
//   baseURL: "/api",
//   headers: {
//     "Cache-Control": "no-cache",
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`
//   },
// });
// const api = "http://163.17.135.152:7465/api";
const api = process.env.API_URL;

const userAxios = axios.create({
  // baseURL: "http://163.17.135.152:7465/api",
  baseURL: process.env.API_URL,
    headers: {
    "Cache-Control": "no-cache",
  },
});

const userTokenAxios = axios.create({
  // baseURL: "http://163.17.135.152:7465/api",
  baseURL: process.env.API_URL,
  headers: {
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
});



const state = {

};

const getters = {

};
// // 本地測試
// const actions = {
//   // 登入
//   Login({ commit }, contents) {
//     const apiUrl = `/auth/login`;
//     const content = {
//       username: contents.username,
//       password: contents.password,
//     };
//     return userAxios.post(apiUrl, content).then((res) => {
//       return res;
//     });
//   },
//   // 撈所有管理員
//   getAllUser({ commit }, contents) {
//     const apiUrl = `/users`;
//     return userTokenAxios.get(apiUrl).then((res) => {
//       return res;
//     });
//   },
//   // 新增管理員
//   getAddUser({ commit }, contents) {
//     const apiUrl = `/users`;
//     const content = {
//       name: contents.name,
//       username: contents.username,
//       password: contents.password,
//       is_modulator: contents.is_modulator,
//       is_admin: contents.is_admin,
//       comment: contents.comment
//     };
//     return userTokenAxios.post(apiUrl, content).then((res) => {
//       return res;
//     });
//   },
//   // 刪除管理員
//   getDeleteUser({ commit }, contents) {
//     const apiUrl = `/users/${contents._username}`;
//     return userTokenAxios.delete(apiUrl).then((res) => {
//       return res;
//     });
//   },
//   // 撈管理員詳情
//   getUserData({ commit }, contents) {
//     const apiUrl = `/users/${contents._username}`;
//     return userTokenAxios.get(apiUrl).then((res) => {
//       return res;
//     });
//   },
//   // 儲存管理員詳情
//   getSaveUserData({ commit }, contents) {
//     const apiUrl = `/users/${contents._username}`;
//     const content = {
//       name: contents.name,
//       username: contents.username,
//       password: contents.password,
//       is_modulator: contents.is_modulator,
//       is_admin: contents.is_admin,
//       comment: contents.comment
//     };
//     return userTokenAxios.put(apiUrl, content).then((res) => {
//       return res;
//     });
//   },
//   // 搜尋管理員
//   getSearchUserData({ commit }, contents) {
//     const apiUrl = `/users?any_field=${contents._basic}`;
//     return userTokenAxios.get(apiUrl).then((res) => {
//       return res;
//     });
//   },
// };

// vm
const actions = {
  // 登入
  Login({ commit }, contents) {
    const apiUrl = `${api}/auth/login`;
    const content = {
      username: contents.username,
      password: contents.password,
    };
    return userAxios.post(apiUrl, content).then((res) => {
      return res;
    });
  },
  // 撈所有管理員
  getAllUser({ commit }, contents) {
    const apiUrl = `${api}/users`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 新增管理員
  getAddUser({ commit }, contents) {
    const apiUrl = `${api}/users`;
    const content = {
      name: contents.name,
      username: contents.username,
      password: contents.password,
      is_modulator: contents.is_modulator,
      is_admin: contents.is_admin,
      comment: contents.comment
    };
    return userTokenAxios.post(apiUrl, content).then((res) => {
      return res;
    });
  },
  // 刪除管理員
  getDeleteUser({ commit }, contents) {
    const apiUrl = `${api}/users/${contents._username}`;
    return userTokenAxios.delete(apiUrl).then((res) => {
      return res;
    });
  },
  // 撈管理員詳情
  getUserData({ commit }, contents) {
    const apiUrl = `${api}/users/${contents._username}`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 儲存管理員詳情
  getSaveUserData({ commit }, contents) {
    const apiUrl = `${api}/users/${contents._username}`;
    const content = {
      name: contents.name,
      username: contents.username,
      password: contents.password,
      is_modulator: contents.is_modulator,
      is_admin: contents.is_admin,
      comment: contents.comment
    };
    return userTokenAxios.put(api, content).then((res) => {
      return res;
    });
  },
  // 搜尋管理員
  getSearchUserData({ commit }, contents) {
    const apiUrl = `${api}/users?any_field=${contents._basic}`;
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
