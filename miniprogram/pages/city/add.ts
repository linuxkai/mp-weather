// pages/city/add.ts
import HefengApi from "../../apis/hefeng"
import * as storage from "../../utils/storage";
import * as util from "../../utils/util"
var hefeng = new HefengApi()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotCityList: [],
    searchResult: <any>[],
    historyCityList: <any>[],
    resultVisible: false,
    noResult: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getHotCity()
    // 加载storage里的搜索历史
    const history = storage.getStorageSync("historyCityList")
    this.setData({
      historyCityList: history
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 搜索城市
  searchCity: async function ({ detail }) {
    const value = detail.value
    if (!value) {
      console.log("value: ", value)
      this.setData({
        searchResult: [],
        resultVisible: false,
        noResult: false
      })
    } else {
      const res = await hefeng.searchCity(value)
      if (Object.keys(res).length > 0) {
        this.setData({
          searchResult: res,
          resultVisible: true
        })
      } else {
        this.setData({
          noResult: true,
          resultVisible: true
        })
      }
    }
  },

  // 获取热门城市
  getHotCity: async function () {
    const hotCity = await hefeng.getHotCityList()
    this.setData({
      hotCityList: hotCity
    })
    console.log("getHotCity:", hotCity)
  },

  addCity: function (event: any) {
    const id = event.currentTarget.dataset.id
    const name = event.currentTarget.dataset.name
    const isSearch = event.currentTarget.dataset.fromSearch
    console.log("isSearch: ", isSearch)
    var cityList = storage.getStorageSync("addedCityList")
    var history = storage.getStorageSync("historyCityList")

    // 如果已经添加，则不重复添加
    var isExist = false
    // 如果和当前城市id一样，则不添加
    if (app.globalData.currCity.id === id) {
      isExist = true
    }
    
    for (let i = 0; i < cityList.length; i++) {
      if (cityList[i].id === id) {
        isExist = true
        break
      }
    }

    if (isExist) {
      wx.showToast({
        title: "城市已经存在!",
        icon: "none",
        duration: 2000
      })
    } else {
      cityList.push({ "id": id, "name": name, 'xmove': 0 })
      history.push({ "id": id, "name": name, 'xmove': 0 })
      storage.setStorageSync("addedCityList", cityList)
      if (isSearch) {
        storage.setStorageSync("historyCityList", history)
      }
      wx.navigateTo({
        url: '../city/index'
      })
    }
  },
  clearHistory: function () {
    storage.removeStorageSync("historyCityList")
    this.setData({
      historyCityList: []
    })
  }
})