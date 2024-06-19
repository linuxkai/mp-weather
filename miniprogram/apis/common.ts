export const requestSync = (params: WechatMiniprogram.RequestOption) => {
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      success(response) {
        resolve(response.data)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}