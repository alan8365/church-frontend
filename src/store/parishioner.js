/*eslint-disable */

import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
Vue.use(Vuex);

const CryptoJS = require("crypto-js");
const token = localStorage.getItem("token");

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

// 有Token且FormData
const userFormDataAxios = axios.create({
  // baseURL: "http://163.17.135.152:7465/api",
  baseURL: process.env.API_URL,
  headers: {
    // "Cache-Control": "no-cache",
    'Content-Type' : 'multipart/form-data',
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

userFormDataAxios.interceptors.request.use(
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
  // 撈所有教友資料（預設不會撈封存的教友）
  getAllParishioners({ commit }, contents) {
    const apiUrl = `${api}/parishioners`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  getAddParishioners({ commit }, contents) {
    const apiUrl = `${api}/parishioners`;
    const formData = new FormData();
    formData.append('home_number', contents.home_number);
    // formData.append('name', contents.name);
    formData.append('last_name', contents.name.slice(0,1));
    formData.append('first_name', contents.name.slice(1));
    formData.append('gender', contents.gender);
    formData.append('birth_at', contents.birth_at);
    formData.append('postal_code', contents.postal_code);
    formData.append('address', contents.address);

    // 圖片檔案本身、圖片名稱、圖片類型
    formData.append('picture', contents.picture);
    formData.append('pictureName', contents.picture.name);
    formData.append('pictureType', contents.picture.type);

    formData.append('father', contents.father);
    formData.append('mother', contents.mother);
    formData.append('father_id', contents.father_id !== '' ? parseInt(contents.father_id) : '');
    formData.append('mother_id', contents.mother_id !== '' ? parseInt(contents.mother_id) : '');
    formData.append('spouse', contents.spouse);
    formData.append('home_phone', contents.home_phone);
    formData.append('mobile_phone', contents.mobile_phone);
    formData.append('nationality', contents.nationality);
    formData.append('profession', contents.profession);
    formData.append('company_name', contents.company_name);
    formData.append('sibling_number', contents.sibling_number);
    formData.append('children_number', contents.children_number);
    formData.append('move_in_date', contents.move_in_date);
    formData.append('original_parish', contents.original_parish);
    formData.append('move_out_date', contents.move_out_date);
    formData.append('move_out_reason', contents.move_out_reason);
    formData.append('destination_parish', contents.destination_parish);
    formData.append('comment', contents.comment);

    return userFormDataAxios.post(apiUrl, formData).then((res) => {
      return res;
    });
  },
  // 刪除教友資料
  getDeleteParishioners({ commit }, contents) {
    const apiUrl = `${api}/parishioners/${contents._id}`;
    return userTokenAxios.delete(apiUrl).then((res) => {
      return res;
    });
  },
  // 撈教友資料詳情
  getParishionersData({ commit }, contents) {
    const apiUrl = `${api}/parishioners/${contents._id}`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 儲存教友資料（有遷出原因就會到封存教友，同理沒有封存原因就會在教友！）
  getSaveParishionersData({ commit }, contents) {
    const apiUrl = `${api}/parishioners/${contents._id}`;
    const formData = new FormData();
    formData.append('home_number', contents.home_number);
    // formData.append('name', contents.name);
    formData.append('last_name', contents.name.slice(0,1));
    formData.append('first_name', contents.name.slice(1));
    formData.append('gender', contents.gender);
    formData.append('birth_at', contents.birth_at);
    formData.append('postal_code', contents.postal_code);
    formData.append('address', contents.address);

    // 圖片檔案本身、圖片名稱、圖片類型
    if(contents.picture !== '') {
      formData.append('picture', contents.picture);
      formData.append('pictureName', contents.picture.name);
      formData.append('pictureType', contents.picture.type);
    }

    formData.append('father', contents.father);
    formData.append('mother', contents.mother);
    formData.append('father_id', contents.father_id !== '' ? parseInt(contents.father_id) : '');
    formData.append('mother_id', contents.mother_id !== '' ? parseInt(contents.mother_id) : '');
    formData.append('spouse', contents.spouse);
    formData.append('home_phone', contents.home_phone);
    formData.append('mobile_phone', contents.mobile_phone);
    formData.append('nationality', contents.nationality);
    formData.append('profession', contents.profession);
    formData.append('company_name', contents.company_name);
    formData.append('sibling_number', contents.sibling_number);
    formData.append('children_number', contents.children_number);
    formData.append('move_in_date', contents.move_in_date);
    formData.append('original_parish', contents.original_parish);
    formData.append('move_out_date', contents.move_out_date);
    formData.append('move_out_reason', contents.move_out_reason);
    formData.append('destination_parish', contents.destination_parish);
    formData.append('comment', contents.comment);
    
    return userFormDataAxios.patch(apiUrl, formData).then((res) => {
      return res;
    });
  },
  // 搜尋教友資料
  getSearchParishionersData({ commit }, contents) {
    const apiUrl = `${api}/parishioners?any_field=${contents._basic}`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 撈教友照片
  getSaveParishionersPhoto({ commit }, contents) {
    const apiUrl = `${api}/parishioners/${contents._id}/picture`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 撈已封存教友
  getAllArchiveParishioners({ commit }, contents) {
    const apiUrl = `${api}/parishioners?is_archive=true`;
    return userTokenAxios.get(apiUrl).then((res) => {
      return res;
    });
  },
  // 儲存或取修封存（封存原因、日期、教堂）
  getSaveArchiveParishioners({ commit }, contents) {
    const apiUrl = `${api}/parishioners/${contents._id}`;
    const formData = new FormData();
    formData.append('move_out_date', contents.move_out_date);
    formData.append('move_out_reason', contents.move_out_reason);
    formData.append('destination_parish', contents.destination_parish);
    formData.append('comment', contents.comment);
    
    return userFormDataAxios.patch(apiUrl, formData).then((res) => {
      return res;
    });
  },
  // 搜尋已封存教友資料
  getSearchArchiveParishioners({ commit }, contents) {
    const apiUrl = `${api}/parishioners?any_field=${contents._basic}&is_archive=true`;
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
