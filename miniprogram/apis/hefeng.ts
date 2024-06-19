import { requestSync } from "./common"

export default class HefengApi {
  apiArr = ['ec066a499fab4a2088f49b6ad1789bc4', '1b61768b723a4d2c876dd914dce1ef8e']
  index = Math.floor((Math.random() * this.apiArr.length))
  apiKey = this.apiArr[this.index]

  // apiKey = "YOURAPIKEY"
  baseUrl = "https://devapi.qweather.com"
  cityUrl = "https://geoapi.qweather.com"

  /*** 实时天气预报
   * @param: localtion 可以是LocationID;也可以是坐标，以英文逗号分隔的经度,纬度坐标（十进制，最多支持小数点后两位）
   * @return: {}
   */
  async getNowWeather(location: string) {
    const _url = this.baseUrl + '/v7/weather/now?'
    let resp = {}

    await requestSync({
      url: _url,
      data: {
        "key": this.apiKey,
        "location": location
      },
    }).then((res: any) => {
      if (res.code === "200") {
        resp = res
      } else {
        console.log(statusCode[res.code])
      }
    })
    return resp
  }

  /*** 逐小时天气预报
   * @param: localtion 可以是LocationID;也可以是坐标，以英文逗号分隔的经度,纬度坐标（十进制，最多支持小数点后两位）
   * @param: hour  24h | 48h | 72h
   * @return: {}
   */
  async getHourWeather(location: string, hour = '24h') {
    const _url = `${this.baseUrl}/v7/weather/${hour}?`
    let resp = <any>[]

    await requestSync({
      url: _url,
      data: {
        "key": this.apiKey,
        "location": location
      },
    }).then((res: any) => {
      if (res.code === "200") {
        resp = res.hourly
      } else {
        console.log(statusCode[res.code])
      }
    })
    return resp
  }

  /*** 多日天气预报
 * @param: localtion 可以是LocationID;也可以是坐标，以英文逗号分隔的经度,纬度坐标（十进制，最多支持小数点后两位）
 * @param: hour  3d | 7d | 10d | 15d | 30d
 * @return: {}
 */
  async getDayWeather(location: string, day = '7d') {
    const _url = `${this.baseUrl}/v7/weather/${day}?`
    let resp = {}

    await requestSync({
      url: _url,
      data: {
        "key": this.apiKey,
        "location": location
      },
    }).then((res: any) => {
      if (res.code === "200") {
        resp = res.daily
      } else {
        console.log(statusCode[res.code])
      }
    })
    return resp
  }

  /**
   * 生活指数
   * @param location 可以是LocationID;也可以是坐标，以英文逗号分隔的经度,纬度坐标（十进制，最多支持小数点后两位）
   * @param day  1d | 3d
   * @param type 生活指数的类型ID, 例如 type=3,5 
   */
  async getLifeIndics(location: string, type = 0, day = '1d') {
    const _url = `${this.baseUrl}/v7/indices/${day}?`
    let resp = {}

    await requestSync({
      url: _url,
      data: {
        "key": this.apiKey,
        "location": location,
        "type": type,
      },
    }).then((res:any) => {
      if (res.code === "200") {
        resp = res
      } else {
        console.log(statusCode[res.code])
      }
    })
    return resp
  }

  /**
 * 获取日出日落
 * @param location 可以是LocationID;也可以是英文逗号分隔的经度,纬度坐标（十进制，最多支持小数点后两位）
 */
  async getNowAQI(location: string) {
    const _url = this.baseUrl + "/v7/air/now?"
    var resp = {}
    await requestSync({
      url: _url,
      data: {
        "key": this.apiKey,
        "location": location
      }
    }).then((res: any) => {
      if (res.code === "200") {
        resp = res
      } else {
        console.log(statusCode[res.code])
      }
    })
    return resp
  }
  /**
   * 获取热门城市列表
   */
  async getHotCityList() {
    const _url = this.cityUrl + "/v2/city/top?"
    var resp: never[] = [];
    await requestSync({
      url: _url,
      data: {
        "key": this.apiKey,
        "range": "cn",
        "number": 20,
      }
    }).then((res: any) => {
      if (res.code === "200") {
        resp = res.topCityList
      } else {
        console.log(statusCode[res.code])
      }
    })
    return resp
  }

  /**
   * 
   * @param localtion 可以是具体经、伟坐标，也可以是LocationID或Adcode，也可以是文字，字母进行模糊搜索
   * @param adm 可选参数，城市的上级行政区划，可设定只在某个行政区划范围内进行搜索，用于排除重名城市或对结果进行过滤
   */
  async searchCity(location: string, adm?: string, range?: string, number?: number) {
    const _url = this.cityUrl + "/v2/city/lookup?"
    let resp = <any>[]
    var data = {
      "key": this.apiKey,
      "location": location,
      "adm": '',
      "range": 'cn',
      "number": 10
    }
    if (adm) {
      data.adm = adm
    }
    if (range) {
      data.range = range
    }
    if (number) {
      data.number = number
    }

    await requestSync({
      url: _url,
      data: data,
    }).then((res: any) => {
      if (res.code === "200") {
        resp = res.location
      } else {
        console.log(statusCode[res.code])
      }
    })
    return resp
  }

  async getCurrentDayWeather(locationID: string) {
    var weather = {}
    const nowResp = await this.getNowWeather(locationID)
    const dayResp = await this.getDayWeather(locationID, "3d")
    console.log("121212121:", nowResp, dayResp)
    weather.id = locationID
    weather.temp = nowResp.now.temp
    weather.text = nowResp.now.text
    weather.tempMax = dayResp[0].tempMax
    weather.tempMin = dayResp[0].tempMin

    return weather
  }

}


const statusCode = {
  200: "请求成功",
  204: "请求成功，但你查询的地区暂时没有你需要的数据。",
  400: "请求错误，可能包含错误的请求参数或缺少必选的请求参数。",
  401: "认证失败，可能使用了错误的KEY、数字签名错误、KEY的类型错误（如使用SDK的KEY去访问Web API）。",
  402: "超过访问次数或余额不足以支持继续访问服务，你可以充值、升级访问量或等待访问量重置。",
  403: "无访问权限，可能是绑定的PackageName、BundleID、域名IP地址不一致，或者是需要额外付费的数据。",
  404: "查询的数据或地区不存在。",
  429: "超过限定的QPM（每分钟访问次数），请参考QPM说明",
  500: "无响应或超时，接口服务异常。",
}