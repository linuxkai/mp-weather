// pages/setting/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const query = wx.createSelectorQuery()
    query.select('#myCanvas3')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        var width = res[0].width
        var height = res[0].height
        console.log(width, height)
        const ctx = canvas.getContext('2d');
        const dpr = wx.getWindowInfo().pixelRatio
        const dpr1 = wx.getSystemInfoSync().pixelRatio
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
        console.log(width, height, dpr, dpr1)
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'red';
        console.log(width/2,height/2, Math.min(width, height) /2)
        ctx.arc(width /2, height/2, height/2-20, 0, 2 * Math.PI, true);
        ctx.stroke();
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

  }
})