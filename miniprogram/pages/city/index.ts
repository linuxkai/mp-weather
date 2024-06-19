// pages/city/index.ts
import HefengApi from "../../apis/hefeng"
import * as storage from "../../utils/storage"
var hefeng = new HefengApi()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startX: 0,
    startY: 0,
    currCity: app.globalData.currCity,
    cityList: <any>[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.init()

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

  async init() {
    //  获取当前城市天气
    const currentRes = await hefeng.getCurrentDayWeather(this.data.currCity.id)
    this.data.currCity.temp = currentRes.temp
    this.data.currCity.tempMax = currentRes.tempMax
    this.data.currCity.tempMin = currentRes.tempMin
    this.data.currCity.text = currentRes.text

    // 读取存储
    var citys = storage.getStorageSync('addedCityList')
    // 获取列表城市的天气情况
    console.log("citys: ", citys)
    for (let i = 0; i < citys.length; i++) {
      const res = await hefeng.getCurrentDayWeather(citys[i].id)
      console.log("111111111111111res:", res)
      citys[i].temp = res.temp
      citys[i].tempMax = res.tempMax
      citys[i].tempMin = res.tempMin
      citys[i].text = res.text
    }
    this.setData({
      cityList: citys,
      currCity: this.data.currCity
    })
  },

  touchStart: function (event: any) {
    const index = event.currentTarget.dataset.index
    //开始触摸时 重置所有删除
    this.data.cityList.forEach(function (v, i) {
      if (i !== index) {
        v.xmove = 0
      }
    })
    this.setData({
      startX: event.changedTouches[0].clientX,
      startY: event.changedTouches[0].clientY,
      addedCityList: this.data.cityList
    })

  },

  delCity: function (event: any) {
    const index = event.currentTarget.dataset.index;
    this.data.cityList.splice(index, 1)
    storage.setStorageSync("addedCityList", this.data.cityList)
    this.setData({
      cityList: this.data.cityList
    })
  },

  goToCityAdd: function () {
    wx.navigateTo({
      url: './add'
    });
  },
})

