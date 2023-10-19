import Vue from 'vue'
import VueRouter from 'vue-router'

// 樣板
import LoginLayout from "../layout/LoginLayout.vue";
import IndexLayout from "../layout/IndexLayout.vue";

// 資料管理頁 -------------------------------------------------------
import ManagementPage from "../views/Management/ManagementPage.vue";
// 教友資料
import ProfileData from "../views/Management/ProfileData/ProfileData.vue";
// 新增-教友資料
import AddProfileData from "../views/Management/ProfileData/AddProfileData.vue";
// 新增-編輯資料
import EditProfileData from "../views/Management/ProfileData/EditProfileData.vue";
// 教友資料詳情
import ProfileContentData from "../views/Management/ProfileData/ProfileContentData.vue";

// 領洗資料
import BaptizedData from "../views/Management/BaptizedData/BaptizedData.vue";
// 新增-領洗資料
import AddBaptizedData from "../views/Management/BaptizedData/AddBaptizedData.vue";
// 編輯-領洗資料
import EditBaptizedData from "../views/Management/BaptizedData/EditBaptizedData.vue";

// 堅振資料
import ConfirmationData from "../views/Management/ConfirmationData/ConfirmationData.vue";
// 新增-堅振資料
import AddConfirmationData from "../views/Management/ConfirmationData/AddConfirmationData.vue";
// 編輯-堅振資料
import EditConfirmationData from "../views/Management/ConfirmationData/EditConfirmationData.vue";

// 婚姻資料
import MarriageData from "../views/Management/MarriageData/MarriageData.vue";
// 新增-婚姻資料
import AddMarriageData from "../views/Management/MarriageData/AddMarriageData.vue";
// 編輯-婚姻資料
import EditMarriageData from "../views/Management/MarriageData/EditMarriageData.vue";
// 婚姻資料詳情
import MarriageContentData from "../views/Management/MarriageData/MarriageContentData.vue";

// 初領聖體資料
import EucharistData from "../views/Management/EucharistData/EucharistData.vue";
// 新增-初領聖體資料
import AddEucharistData from "../views/Management/EucharistData/AddEucharistData.vue";
// 編輯-初領聖體資料
import EditEucharistData from "../views/Management/EucharistData/EditEucharistData.vue";

// 封存資料
import ArchiveData from "../views/Management/ArchiveData/ArchiveData.vue";
// 新增-封存資料
import AddArchiveData from "../views/Management/ArchiveData/AddArchiveData.vue";
// 編輯-封存資料
import EditArchiveData from "../views/Management/ArchiveData/EditArchiveData.vue";

// 訪客家號
import SpecialHomeNumData from "../views/Management/SpecialHomeNumData/SpecialHomeNumData.vue";
// 新增-訪客家號
import AddSpecialHomeNumData from "../views/Management/SpecialHomeNumData/AddSpecialHomeNumData.vue";
// 編輯-訪客家號
import EditSpecialHomeNumData from "../views/Management/SpecialHomeNumData/EditSpecialHomeNumData.vue";

// 管理教友家號
import HomeNumData from "../views/Management/HomeNumData/HomeNumData.vue";

// 奉獻紀錄頁 -------------------------------------------------------
import DedicationPage from "../views/Dedication/DedicationPage.vue";
// 主日奉獻
import SundayDedication from "../views/Dedication/SundayDedication/SundayDedication.vue";
// 新增-主日奉獻
import AddSundayDedication from "../views/Dedication/SundayDedication/AddSundayDedication.vue";
// 編輯-主日奉獻
import EditSundayDedication from "../views/Dedication/SundayDedication/EditSundayDedication.vue";

// 特殊奉獻
import SpecialDedication from "../views/Dedication/SpecialDedication/SpecialDedication.vue";
// 新增-特殊奉獻
import AddSpecialDedication from "../views/Dedication/SpecialDedication/AddSpecialDedication.vue";
// 編輯-特殊奉獻
import EditSpecialDedication from "../views/Dedication/SpecialDedication/EditSpecialDedication.vue";
// 特殊奉獻細項
import SpecialDedicationContent from "../views/Dedication/SpecialDedication/SpecialDedicationContent.vue";
// 新增-特殊奉獻細項
import AddSpecialDedicationContent from "../views/Dedication/SpecialDedication/AddSpecialDedicationContent.vue";
// 編輯-特殊奉獻細項
import EditSpecialDedicationContent from "../views/Dedication/SpecialDedication/EditSpecialDedicationContent.vue";

// 統計資料-年統計（個人奉獻）
import Statistics from "../views/Dedication/Statistics/Statistics.vue";
// 統計資料-月統計 （主日奉獻每月）
import MonthStatistics from "../views/Dedication/Statistics/MonthStatistics.vue";
// 統計資料-特殊統計（特殊奉獻）
import SpecialStatistics from "../views/Dedication/Statistics/SpecialStatistics.vue";
// 統計資料-年統計送公署（個人奉獻）
import AllDonations from "../views/Dedication/Statistics/AllDonations.vue";
// 統計資料-捐款收據名冊
import ReceiptStatistics from "../views/Dedication/Statistics/ReceiptStatistics.vue";
// 統計資料-特殊年統計
import SpecialYearStatistics from "../views/Dedication/Statistics/SpecialYearStatistics.vue";

// 工具箱頁 -------------------------------------------------------
import ToolPage from "../views/Tool/ToolPage.vue";
// 會員管理
import Authority from "../views/Tool/Authority/Authority.vue";
// 新增-會員資料
import AddAuthority from "../views/Tool/Authority/AddAuthority.vue";
// 編輯-會員資料
import EditAuthority from "../views/Tool/Authority/EditAuthority.vue";

// 列印教友證
import PrintProfileData from "../views/Tool/PrintProfileData.vue";
// 領洗證明
import PrintProfileCertificate from "../views/Tool/PrintProfileCertificate.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "UserLogin",
    component: LoginLayout,
  },
  {
    path: "/",
    component: IndexLayout,
    redirect: "/ManagementPage",
    children: [
      // 資料管理選單頁 -----------------------------------
      {
        path: "ManagementPage",
        name: "ManagementPage",
        component: ManagementPage,
      },
      // 教友資料  ---------------------
      {
        path: "ProfileData",
        name: "ProfileData",
        component: ProfileData,
      },
      // 新增-教友資料
      {
        path: "ProfileData/AddProfileData",
        name: "ProfileData/AddProfileData",
        component: AddProfileData,
      },
      // 編輯-教友資料
      {
        path: "ProfileData/EditProfileData",
        name: "ProfileData/EditProfileData",
        component: EditProfileData,
      },
      // 教友資料詳情
      {
        path: "ProfileData/ProfileContentData",
        name: "ProfileData/ProfileContentData",
        component: ProfileContentData,
      },

      // 領洗資料 ---------------------
      {
        path: "BaptizedData",
        name: "BaptizedData",
        component: BaptizedData,
      },
      // 新增-領洗資料
      {
        path: "BaptizedData/AddBaptizedData",
        name: "BaptizedData/AddBaptizedData",
        component: AddBaptizedData,
      },
      // 編輯-領洗資料
      {
        path: "BaptizedData/EditBaptizedData",
        name: "BaptizedData/EditBaptizedData",
        component: EditBaptizedData,
      },
      
      // 堅振資料 ---------------------
      {
        path: "ConfirmationData",
        name: "ConfirmationData",
        component: ConfirmationData,
      },
      // 新增-堅振資料
      {
        path: "ConfirmationData/AddConfirmationData",
        name: "ConfirmationData/AddConfirmationData",
        component: AddConfirmationData,
      },
      // 編輯-堅振資料
      {
        path: "ConfirmationData/EditConfirmationData",
        name: "ConfirmationData/EditConfirmationData",
        component: EditConfirmationData,
      },

      
      // 婚姻資料 ---------------------
      {
        path: "MarriageData",
        name: "MarriageData",
        component: MarriageData,
      },
      // 新增-婚姻資料
      {
        path: "MarriageData/AddMarriageData",
        name: "MarriageData/AddMarriageData",
        component: AddMarriageData,
      },
      // 編輯-婚姻資料
      {
        path: "MarriageData/EditMarriageData",
        name: "MarriageData/EditMarriageData",
        component: EditMarriageData,
      },
      // 婚姻資料詳情
      {
        path: "MarriageData/MarriageContentData",
        name: "MarriageData/MarriageContentData",
        component: MarriageContentData,
      },

      // 初領聖體資料 ---------------------
      {
        path: "EucharistData",
        name: "EucharistData",
        component: EucharistData,
      },
      // 新增-初領聖體資料
      {
        path: "EucharistData/AddEucharistData",
        name: "EucharistData/AddEucharistData",
        component: AddEucharistData,
      },
      // 編輯-初領聖體資料
      {
        path: "EucharistData/EditEucharistData",
        name: "EucharistData/EditEucharistData",
        component: EditEucharistData,
      },

      // 封存資料 ---------------------
      {
        path: "ArchiveData",
        name: "ArchiveData",
        component: ArchiveData,
      },
      // 新增-封存資料
      {
        path: "ArchiveData/AddArchiveData",
        name: "ArchiveData/AddArchiveData",
        component: AddArchiveData,
      },
      // 編輯-封存資料
      {
        path: "ArchiveData/EditArchiveData",
        name: "ArchiveData/EditArchiveData",
        component: EditArchiveData,
      },

      // 訪客家號 ---------------------
      {
        path: "SpecialHomeNumData",
        name: "SpecialHomeNumData",
        component: SpecialHomeNumData,
      },
      // 新增-訪客家號
      {
        path: "SpecialHomeNumData/AddSpecialHomeNumData",
        name: "SpecialHomeNumData/AddSpecialHomeNumData",
        component: AddSpecialHomeNumData,
      },
      // 編輯-訪客家號
      {
        path: "SpecialHomeNumData/EditSpecialHomeNumData",
        name: "SpecialHomeNumData/EditSpecialHomeNumData",
        component: EditSpecialHomeNumData,
      },
      // 教友家號管理
      {
        path: "HomeNumData",
        name: "HomeNumData",
        component: HomeNumData,
      },
      

      // 主日奉獻頁面 -----------------------------------
      {
        path: "DedicationPage",
        name: "DedicationPage",
        component: DedicationPage,
      },
      // 主日奉獻 ---------------------
      {
        path: "SundayDedication",
        name: "SundayDedication",
        component: SundayDedication,
      },
      // 新增-主日奉獻
      {
        path: "SundayDedication/AddSundayDedication",
        name: "SundayDedication/AddSundayDedication",
        component: AddSundayDedication,
      },
      // 編輯-主日奉獻
      {
        path: "SundayDedication/EditSundayDedication",
        name: "SundayDedication/EditSundayDedication",
        component: EditSundayDedication,
      },
      // 特殊奉獻 ---------------------
      {
        path: "SpecialDedication",
        name: "SpecialDedication",
        component: SpecialDedication,
      },
      // 新增-特殊奉獻
      {
        path: "SpecialDedication/AddSpecialDedication",
        name: "SpecialDedication/AddSpecialDedication",
        component: AddSpecialDedication,
      },
      // 編輯-特殊奉獻
      {
        path: "SpecialDedication/EditSpecialDedication",
        name: "SpecialDedication/EditSpecialDedication",
        component: EditSpecialDedication,
      },
      // 特殊奉獻細項
      {
        path: "SpecialDedication/SpecialDedicationContent",
        name: "SpecialDedication/SpecialDedicationContent",
        component: SpecialDedicationContent,
      },
      // 新增-特殊奉獻細項
      {
        path: "SpecialDedicationContent/AddSpecialDedicationContent",
        name: "SpecialDedicationContent/AddSpecialDedicationContent",
        component: AddSpecialDedicationContent,
      },
      // 新增-編輯奉獻細項
      {
        path: "SpecialDedicationContent/EditSpecialDedicationContent",
        name: "SpecialDedicationContent/EditSpecialDedicationContent",
        component: EditSpecialDedicationContent,
      },
      // 統計資料 ---------------------
      // 年統計
      {
        path: "Statistics",
        name: "Statistics",
        component: Statistics,
      },
      // 月統計
      {
        path: "MonthStatistics",
        name: "MonthStatistics",
        component: MonthStatistics,
      },
      // 特殊統計
      {
        path: "SpecialStatistics",
        name: "SpecialStatistics",
        component: SpecialStatistics,
      },
      // 送公署
      {
        path: "AllDonations",
        name: "AllDonations",
        component: AllDonations,
      },
      // 捐款收據名冊
      {
        path: "ReceiptStatistics",
        name: "ReceiptStatistics",
        component: ReceiptStatistics,
      },
      // 特殊年統計
      {
        path: "SpecialYearStatistics",
        name: "SpecialYearStatistics",
        component: SpecialYearStatistics,
      },

      // 工具箱頁面 -----------------------------------
      {
        path: "ToolPage",
        name: "ToolPage",
        component: ToolPage,
      },
      // 會員管理 ---------------------
      {
        path: "Authority",
        name: "Authority",
        component: Authority,
      },
      // 新增-會員資料
      {
        path: "Authority/AddAuthority",
        name: "Authority/AddAuthority",
        component: AddAuthority,
      },
      // 編輯-會員資料
      {
        path: "Authority/EditAuthority",
        name: "Authority/EditAuthority",
        component: EditAuthority,
      },
      // 列印教友證
      {
        path: "PrintProfileData",
        name: "PrintProfileData",
        component: PrintProfileData,
      },
      // 領洗證明
      {
        path: "PrintProfileCertificate",
        name: "PrintProfileCertificate",
        component: PrintProfileCertificate,
      },
    ]
  }
]

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
