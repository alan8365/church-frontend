import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "ant-design-vue/dist/antd.less";
import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
import './css/theme/index.css';
import { ConfigProvider } from 'ant-design-vue';

// FontAwesomeIcon
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 上傳圖片
import ImgInputer from "vue-img-inputer";
import "vue-img-inputer/dist/index.css";


import {
  Button,
  Layout,
  Menu,
  Icon,
  Row,
  Col,
  Cascader,
  Calendar,
  Spin,
  Carousel,
  TimePicker,
  Tabs,
  Table,
  Select,
  Radio,
  Modal,
  Input,
  Avatar,
  Dropdown,
  Checkbox,
  Tooltip,
  Popover,
  Pagination,
  Badge,
  DatePicker,
  InputNumber,
  // Image,
} from "ant-design-vue";

Vue.config.productionTip = false
Vue.component(Button.name, Button);
Vue.component(Layout.name, Layout);
Vue.component(Layout.Header.name, Layout.Header);
Vue.component(Layout.Content.name, Layout.Content);
Vue.component(Layout.Footer.name, Layout.Footer);
Vue.component(Layout.Sider.name, Layout.Sider);
Vue.component(Menu.name, Menu);
Vue.component(Menu.Item.name, Menu.Item);
Vue.component(Menu.SubMenu.name, Menu.SubMenu);
Vue.component(Icon.name, Icon);
Vue.component(Row.name, Row);
Vue.component(Col.name, Col);
Vue.component(Cascader.name, Cascader);
Vue.component(Calendar.name, Calendar);
Vue.component(Spin.name, Spin);
Vue.component(Carousel.name, Carousel);
Vue.component(TimePicker.name, TimePicker);
Vue.component(Tabs.name, Tabs);
Vue.component(Tabs.TabPane.name, Tabs.TabPane);
Vue.component(Table.name, Table);
Vue.component(Select.name, Select);
Vue.component(Select.Option.name, Select.Option);
Vue.component(Radio.name, Radio);
Vue.component(Radio.Group.name, Radio.Group);
Vue.component(Radio.Button.name, Radio.Button);
Vue.component(Input.name, Input);
Vue.component(Input.Search.name, Input.Search);
Vue.component(Input.Password.name, Input.Password);
Vue.component(Input.TextArea.name, Input.TextArea);
Vue.component(InputNumber.name, InputNumber);
Vue.component(Avatar.name, Avatar);
Vue.component(Dropdown.name, Dropdown);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Tooltip.name, Tooltip);
Vue.component(Popover.name, Popover);
Vue.component(Pagination.name, Pagination);
Vue.component(Badge.name, Badge);
Vue.component(Modal.name, Modal)
Vue.component(DatePicker.name, DatePicker)
Vue.component(DatePicker.MonthPicker.name, DatePicker.MonthPicker)
Vue.component(DatePicker.RangePicker.name, DatePicker.RangePicker)
Vue.component(ConfigProvider.name, ConfigProvider)
Vue.component("ImgInputer", ImgInputer);

library.add(faUser, faEnvelope)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(Modal);
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
