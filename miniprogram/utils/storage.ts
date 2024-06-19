export const getStorageSync = (key: string) => {
  var resp = []
  try {
    var value = wx.getStorageSync(key)
    if (value) {
      resp =  value
    }
  } catch (e) {
    console.log(e)
  }
  return resp
}

export const setStorageSync = (key: string, value: string) => {
  try {
    wx.setStorageSync(key, value)
  } catch (e) {
    console.log(e)
  }
}

export const removeStorageSync = (key: string) => {
  try {
    wx.removeStorageSync(key)
  } catch (e) {
    console.log(e)
  }
}

export const clearStorageSync = () => {
  try {
    wx.clearStorageSync()
  } catch (e) {
    console.log(e)
  }
}