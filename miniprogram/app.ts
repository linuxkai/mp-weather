// app.ts
import { subNumber } from "./utils/util"
App({
  globalData: {
    // 当前经纬度
    latitude: 0,
    longitude: 0,
    // 当前定位城市天气
    currentCity: {}
  },

  onLaunch() {
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     console.log(res.code)
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   },
    // })
  }
})