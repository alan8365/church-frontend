/*eslint-disable */

import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
Vue.use(Vuex);

const cityApi = "https://restcountries.com/v3.1";

// 本地跨域測試
const cityAxios = axios.create({
    baseURL: "https://restcountries.com/v3.1",
    headers: {
      "Cache-Control": "no-cache",
    },
});

const state = {
    thisDateTime: '',
};

const getters = {
    thisDateTime: (state) => state.thisDateTime,
};
const actions = {
    // 目前時間：年月日、時分秒
    getDateTime({ commit }, contents) {
        var year = new Date().getFullYear()
        var month = (new Date().getMonth() + 1) < 10 ? `0${(new Date().getMonth() + 1).toString()}` : (new Date().getMonth() + 1).toString();
        var date = new Date().getDate() < 10 ? `0${new Date().getDate().toString()}` : new Date().getDate().toString();
        let hr = new Date().getHours().toString() < 10 ? `0${new Date().getHours().toString()}` : new Date().getHours().toString();
        let min = new Date().getMinutes().toString() < 10 ? `0${new Date().getMinutes().toString()}` : new Date().getMinutes().toString();
        let sec = new Date().getSeconds().toString() < 10 ? `0${new Date().getSeconds().toString()}` : new Date().getSeconds().toString();
        
        var thisDate = year.toString() + "-" + month.toString() + "-" + date.toString() + " " + hr.toString() + ":" + min.toString() + ":" + sec.toString()
        commit('storeDateTime', thisDate)
    },
    // base64 解碼
    decodeBase64({ commit }, contents) {
        let Base64 = require('js-base64').Base64;
        return Base64.decode(contents);
    },
    // 取得國籍
    getCitizenship({ commit }, contents) {
        const apiUrl = `https://restcountries.com/v3.1/all`;
        return cityAxios.get(apiUrl).then((res) => {
          return res;
        });
    },
};
const mutations = {
    storeDateTime(state, date) {
        state.thisDateTime = date
    },
};

export default {
    state, getters, mutations, actions
}
