import Vue from 'vue'
import Vuex from 'vuex'
import user from './user';
// 日期、國籍等共用工具
import tool from './tool';
// 教友資料
import parishioner from './parishioner';
// 家號
import households from './households';
// 領洗
import baptism from './baptism';
// 堅陣
import confirmation from './confirmation';
// 初領聖體
import eucharist from './eucharist';
// 婚姻
import marriage from './marriage'
// 主日奉獻
import sundayDedication from './sundayDedication'
// 特殊奉獻
import specialDedication from './specialDedication'
// 匯出
import report from './report'

Vue.use(Vuex)

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
      user, tool, parishioner, 
      households, baptism, confirmation, 
      eucharist, marriage, sundayDedication,
      specialDedication, report
    },
});

export default store;
