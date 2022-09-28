var that;
const app = getApp()
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
import orc from '../../config/orc';
CustomPage({
  data: {
    domain: Api.domain,
    typeArr: ['1型', '2型', '未知'],
    tabs: [{ title: '今日随访', num: 0 }, { title: '患者动态', num: 3 }],
    tabIndex: 0,
    show: false,
    scanImages: []
  },
  onLoad() {
    that = this;
  },
  async getHomeData() {
    let res = await Api.homeData();
    console.log(res);
    that.setData({
      datas: res.data
    })
  },
  onReady() {
    getApp().watch(function (value) {
      console.log(value);
      /*
        登录成功,并且授权成功 ,获取首页数据
      */
      if (value.login && value.auth) {
        that.showTips('登录成功', 'success');
        that.setData({
          authModal: false
        })
        that.getHomeData();
      }
      /**
       * 登录成功,授权失败,提示授权
       */
      else if (value.login && !value.auth) {
        that.setData({
          authModal: true
        })
      }
      /**
       * 登录不成功等提示错误信息
       */
      else {
        that.showTips(app.globalData.msg);
      }
      that.setData({

        authSuccess: value.auth,
        loginMsg: app.globalData.msg,
        userInfo: wx.getStorageSync('userInfo')
      })
    })
  },
  follow(e) {
    console.log(e);
    let datas = that.data.datas;
    let data = datas[e.currentTarget.dataset.index];
    that.setData({
      patient: data.patient,
      modalfollow: true
    })
  },

  async scan() {
    let scanImages = that.data.scanImages;
    if (!scanImages || scanImages.length == 0) return that.showTips("请先添加病历图片");
    let result = await orc.getOrcResult(scanImages);
    app.globalData.scanData = result;
    wx.navigateTo({
      url: '/pages/patient/scanResult',
    })
  },
  hideModal(e) {
    that.setData({
      authModal: false
    })
  },
  hiddenModal() {
    that.setData({
      show: false
    })
  },
  async getPhoneNumber(e) {
    console.log(e);
    if (e.detail.errMsg === "getPhoneNumber:ok") {
      let code = await Api.getCode();
      let res = await Api.phone({
        encryptedData: e.detail.encryptedData,
        code: code,
        iv: e.detail.iv
      })
      console.log(res);
      if (res.code == 0) {
        if (res.data.login) {
          wx.setStorageSync('token', res.data.token);
          wx.setStorageSync('userInfo', res.data.info);
        } else {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
        }
        app.globalData.msg = res.data.msg;
        app.globalData.status = { login: res.data.login, auth: res.data.auth };
      } else {
        wx.removeStorageSync('code');
        that.showTips(res.msg)
      }
    } else {
      that.showTips('您已拒绝授权获取手机号~')
    }
  },
  add() {
    wx.chooseMedia({
      mediaType: ['image'],
      success(res) {
        console.log(res);
        let tempFiles = res.tempFiles;
        let scanImages = that.data.scanImages;
        scanImages = scanImages.concat(tempFiles);
        console.log(scanImages)
        that.setData({
          scanImages: scanImages
        })
      }
    })
  },
  down(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let scanImages = that.data.scanImages;
    [scanImages[index + 1], scanImages[index]] = [scanImages[index], scanImages[index + 1]];
    that.setData({
      scanImages: scanImages
    })
  },
  remove(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let scanImages = that.data.scanImages;
    scanImages.splice(index, 1);
    that.setData({
      scanImages: scanImages
    })
  }
})
