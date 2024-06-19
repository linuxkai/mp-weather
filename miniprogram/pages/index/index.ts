// pages/index/index.ts
import HefengApi from "../../apis/hefeng"
import * as util from "../../utils/util"
import * as storage from "../../utils/storage"
var hefeng = new HefengApi()
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    aqiCanvas: "aqiCanvas",
    sunCanvas: "sunCanvas",
    // 菜单显示开关
    menuVisible: false,
    windowInfo: {},
    // 经纬度
    latitude: 0,
    longitude: 0,
    currCity: app.globalData.currCity,
    // 获取实时天气
    nowWeather: {},
    hourWeather: {},
    dayWeather: {},
    weatherIndices: [],
    // 空气质量指数
    airIndices: {},
    //当天生活指数
    lifeIndices: {},
    // 当天日出日落、月出月落 信息
    sunMoonInfo: {},
    cityList: <any>[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 获取windowInfo 
    const windowInfo = wx.getWindowInfo()

    const that = this
    wx.getFuzzyLocation({
      type: 'wgs84',
      async success(res) {
        const latitude = util.subNumber(res.latitude, 2)
        const longitude = util.subNumber(res.longitude, 2)
        const location = `${longitude},${latitude}`
        const currentLocation = await hefeng.searchCity(location)

        app.globalData.currCity = {
          "id": currentLocation[0].id,
          "name": currentLocation[0].name
        }

        // 加载storage里添加的城市列表
        var citys = storage.getStorageSync("addedCityList")
        console.log("citys:", citys)
        citys.unshift({
          "id": currentLocation[0].id,
          "name": currentLocation[0].name,
          "xmove": 0
        })

        that.setData({
          latitude: latitude,
          longitude: longitude,
          aqiCanvas: "aqiCanvas-" + currentLocation[0].id,
          sunCanvas: "sunCanvas-" + currentLocation[0].id,
          windowInfo: windowInfo,
          cityList: citys,
          currCity: app.globalData.currCity
        })

        // storage.setStorageSync("addedCityList", citys)
        await that.init(currentLocation[0].id)
      },
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
    this.init(this.data.currCity.id)
    setTimeout(function(){
      wx.stopPullDownRefresh()
  }, 2000);
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

  swiperChange: function (event: any) {
    const index = event.detail.current
    const activeID = this.data.cityList[index].id
    // this.setData({
    //   activeID: activeID,
    //   aqiCanvas: "aqiCanvas-" + activeID,
    //   sunCanvas: "sunCanvas-" + activeID
    // })
    // console.log("canvas id:", this.data.activeID)
    this.init(activeID)
  },

  init: async function (locationID: string) {
    // const that = this
    // 实时天气
    const nowW = await hefeng.getNowWeather(locationID)
    // 获取小时天气
    const hourW = await hefeng.getHourWeather(locationID, "24h")
    // 多日天气
    const dayW = await hefeng.getDayWeather(locationID, '7d')
    // 实时空气质量指数
    const aqi = await hefeng.getNowAQI(locationID)

    // 临时存储天气指数信息
    var wIndices
    // 临时存储日出 月出等信息
    var smInfo
    // 处理fxTime,只显示HH:mm
    if (hourW instanceof Array) {
      hourW.forEach(element => {
        element.fxTime = this.getHourMinite(element.fxTime);
        return element;
      });
    }

    // 多日天气里添加week字段，显示星期几，最近三天会显示为 昨天、今天、明天
    if (dayW instanceof Array) {
      dayW.forEach((element, index) => {
        element.week = util.humenWeek(element.fxDate)
        // 组合天气指数数据
        if (index === 0) {
          smInfo = {
            "sunrise": element.sunrise,
            "sunset": element.sunset,
            "moonrise": element.moonrise,
            "moonset": element.moonset,
            "moonPhase": element.moonPhase,
            "moonPhaseIcon": element.moonPhaseIcon,
          }
          wIndices = [
            {
              "name": "相对湿度",
              "value": element.humidity,
              "icon": "2160-rain"
            },
            {
              "name": "风力",
              "value": {
                "day": element.windScaleDay,
                "night": element.windScaleNight
              },
              "icon": "1803-tropical-cyclone"
            },
            {
              "name": "风向",
              "value": {
                "day": element.windDirDay,
                "night": element.windDirNight
              },
              "icon": "2385-small-craft-advisory"
            },
            {
              "name": "紫外线",
              "value": element.uvIndex,
              "icon": "1010-heat-wave"
            },
            {
              "name": "大气压强",
              "value": element.pressure,
              "icon": "10001-pressure"
            },
            {
              "name": "能见度",
              "value": element.vis,
              "icon": "1060-low-visibility"
            },
            {
              "name": "云量",
              "value": element.cloud,
              "icon": "2412-hazardous-weather-outlook"
            }
          ]
        }
        // 组合当天日出日落、月出月落 信息

      });
    }

    this.setData({
      // currCity: currentLocation,
      nowWeather: nowW,
      hourWeather: hourW,
      dayWeather: dayW,
      weatherIndices: wIndices,
      sunMoonInfo: smInfo,
      airIndices: aqi,
    })
    this.aqiCicle(locationID)
    this.sunMoonRiseSet(locationID)
  },

  aqiCicle: function (locationID: string) {
    const query = wx.createSelectorQuery()
    const dpr = this.data.windowInfo.pixelRatio
    const category = this.data.airIndices.now.category
    const aqi = this.data.airIndices.now.aqi
    query.select("#aqiCanvas-" + locationID)
      .fields({ node: true, size: true })
      .exec((res) => {
        console.log("canvas id: ", locationID)
        console.log("aqiCicle res:", res)
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const width = res[0].width
        const height = res[0].height
        const x = width / 2
        const y = height / 2
        const radias = Math.min(width, height) / 2
        const lineWidth = 5

        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)

        // 画圆弧
        function drawArc(sAngle: number, eAngle: number, color: string) {
          ctx.save();
          ctx.lineWidth = lineWidth
          // ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.strokeStyle = color
          ctx.arc(x, y, radias - lineWidth, sAngle, eAngle, false)
          ctx.stroke()
          ctx.closePath()
          ctx.restore()

          // 设置中间文本
          // 设置文本样式
          ctx.font = '25px Arial';
          ctx.fillStyle = 'white';
          // 文本内容
          var text = category.substr(0, 2);
          // 测量文本宽度
          var metrics = ctx.measureText(text);
          var textWidth = metrics.width;
          // 计算文本的垂直居中位置
          var textHeight = 25; // 基于字体大小设定
          var v = y + textHeight / 2;
          // 计算文本的水平居中位置
          var h = x - textWidth / 2;
          // 绘制文本
          ctx.fillText(text, h, v);
        }

        // 画小圆点
        function drawDots(alpha: number, R: number) {
          let X = x + Math.cos(Math.PI * 2 / 360 * alpha) * (x - lineWidth),
            Y = y + Math.sin(Math.PI * 2 / 360 * alpha) * (x - lineWidth);
          // const X = x - (x - lineWidth) * Math.cos(alpha)
          // const Y = y - (x - lineWidth) * Math.sin(alpha)
          ctx.beginPath()
          ctx.arc(X, Y, R, 0, 2 * Math.PI)
          ctx.strokeStyle = "#fff"
          ctx.stroke()
          ctx.fillStyle = "#fff"
          ctx.fill()
        }

        const styleConfig = [
          [0.1, '#00e400'],
          [0.1, '#ffff00'],
          [0.1, '#ff7e00'],
          [0.1, '#ff0000'],
          [0.2, '#99004c'],
          [0.4, '#7e0023'],
        ]
        // 设置圆环开始位置 eg: 0.75 代表0.75PI
        var start = 0.75
        // 圆弧长度 1.5 表示1.5 PI
        var angleLen = 1.5
        for (var index in styleConfig) {
          const delta = Number(styleConfig[index][0])
          const color = styleConfig[index][1].toString()
          var end = Number((start + delta * angleLen).toFixed(2))
          if (end > 2) {
            end = end - 2
          }
          drawArc(start * Math.PI, end * Math.PI, color)
          start = end
        }
        var angle = 135 // 0.75π位置的角度，
        angle += aqi / 500 * 360
        drawDots(angle, 3)
      });
  },

  sunMoonRiseSet: function (locationID: string) {
    const sysInfo = wx.getWindowInfo()
    const dpr = this.data.windowInfo.pixelRatio
    const query = wx.createSelectorQuery()

    const sunriseTime = this.data.sunMoonInfo.sunrise
    const sunsetTime = this.data.sunMoonInfo.sunset
    const moonriseTime = this.data.sunMoonInfo.moonrise
    const mooonsetTime = this.data.sunMoonInfo.moonset

    const sunAngle = this.calcAngle(sunriseTime, sunsetTime)
    const moonAngle = this.calcAngle(moonriseTime, mooonsetTime)

    query.select("#sunCanvas-" + locationID)
      .fields({ node: true, size: true })
      .exec((res) => {
        console.log("sunMoonRiseSet res:", res)
        const canvas = res[0].node
        const width = sysInfo.windowWidth - (50 * 2 / dpr)
        const height = res[0].height
        const ctx = canvas.getContext('2d')
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
        const centerX = width / 2;
        const centerY = height;
        const radius = Math.min(centerX, centerY) - 15
        const startAngle = Math.PI
        const endAngle = Math.PI * 2
        const sunImage = canvas.createImage()
        const moonImage = canvas.createImage()
        sunImage.src = "../../images/sun.png"
        moonImage.src = "../../images/moon.png"

        //  画出背景半圆
        function circle(cx: number, cy: number, r: number, startAng: number, endAng: number) {
          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = 'rgba(236,236,236,0.5)';
          ctx.arc(cx, cy, r, startAng, endAng, false);
          ctx.stroke();
        }

        // 画出日出圆弧
        function sector(cx: number, cy: number, r: number, startAng: number, endAng: number) {
          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);

          ctx.strokeStyle = "#f76c1d";
          ctx.arc(cx, cy, r, startAng, endAng);
          ctx.stroke();
        }

        // 画出日、月实时轨迹
        function draw() {
          if (nowSunAngle >= 180) nowSunAngle = 180
          if (nowMoonAngle <= 0) nowMoonAngle = 0
          if (timeSun >= nowSunAngle) {
            clearInterval(sunLoading);
          }
          // 清除画布
          // ctx.clearRect(0, 0, centerX * 2, centerY * 2);
          ctx.clearRect(0, 0, centerX * 2, centerY * 2);

          // 太阳轨迹
          circle(centerX, centerY, radius, startAngle, endAngle);
          sector(centerX, centerY, radius, startAngle, Math.PI + timeSun * Math.PI / 180);
          var sunX = centerX + Math.cos(Math.PI * 2 / 360 * (timeSun + 180)) * radius;
          var sunY = centerY + Math.sin(Math.PI * 2 / 360 * (timeSun + 180)) * radius;
          ctx.drawImage(sunImage, sunX - 12.5, sunY - 12.5, 25, 25);
          timeSun += 1.8

          // 月亮轨迹
          var moonRadius = radius - 25
          circle(centerX, centerY, moonRadius, startAngle, endAngle);
          sector(centerX, centerY, moonRadius, startAngle, Math.PI + timeMoon * Math.PI / 180, false);
          var moonX = centerX + Math.cos(Math.PI * 2 / 360 * (timeMoon + 180)) * moonRadius;
          var moonY = centerY + Math.sin(Math.PI * 2 / 360 * (timeMoon + 180)) * moonRadius;
          ctx.drawImage(moonImage, moonX - 12.5, moonY - 12.5, 25, 25);
          timeMoon += (1.8 * nowMoonAngle / nowSunAngle)
        }

        var timeSun = 1, timeMoon = 1;
        var nowSunAngle = sunAngle
        var nowMoonAngle = moonAngle
        var sunLoading = setInterval(function () {
          draw();
        }, 30);
      })
  },

  // 计算太阳，月亮当前时刻的角度
  calcAngle: function (startTime: string, endTime: string) {
    var angle = 0

    var now = new Date()
    const nowTime = util.formatDate(now.toString(), 'HH:mm')

    const diff = util.calcDiff(startTime, nowTime, "minute")
    const totle = util.calcDiff(startTime, endTime, "minute")

    // 太阳当前时间的角度
    angle = Number((diff / totle).toFixed(2)) * 180
    // const moonAngle = Number((nowDiff / sunTotle).toFixed(2)) * 360
    return angle
  },

  handleGlobalTouchStart: function () {
    if (this.data.menuVisible) {
      this.hideMenu();
    }
  },

  showMenu: function () {

    this.setData({
      menuVisible: !this.data.menuVisible
    })
  },

  hideMenu: function () {
    this.setData({
      menuVisible: false,
    });
  },

  cityAdd: function () {
    wx.navigateTo({
      url: '../city/add'
    });
    this.hideMenu();
  },

  goToCity: function () {
    wx.navigateTo({
      url: '../city/index'
    });
    this.hideMenu();
  },

  goToSkin: function () {
    wx.navigateTo({
      url: '../skin/index'
    });
    this.hideMenu();
  },

  goToSetting: function () {
    wx.navigateTo({
      url: '../setting/index'
    });
    this.hideMenu();
  },

  getHourMinite: function (date: string) {
    return util.formatDate(date, "HH:mm")
  },
})