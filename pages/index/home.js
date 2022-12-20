var that;
const app = getApp()
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
import pinyin from '../../utils/pinyin';
import ocr from '../../config/ocr';
CustomPage({
  data: {
    domain: Api.domain,
    checkIndex: 0,
    typeArr: ['1型', '2型', '未知'],
    tabs: [{ title: '今日随访', num: 0 }, { title: '患者动态', num: 3 }],
    tabIndex: 0,
    show: false,
    scanImages: [],
    scanBtn: {
      ip: true,
      op: true
    }
  },
  onLoad(options) {
    that = this;

  },
  onReady() {
    console.log("onReady")
    getApp().watch(function (value) {
      console.log(value);
      /*
        登录成功,并且授权成功 ,获取首页数据
      */
      if (value.login && value.auth) {
        that.showTips('登录成功', 'success');
        that.setData({
          modalauth: false
        })
        let userInfo = wx.getStorageSync('userInfo');
        let diseaseId = wx.getStorageSync('diseaseId');
        if (userInfo.tags.length > 0) {
          that.getHomeData(diseaseId || userInfo.tags[0].caregiverTag.diseaseId)
        }
      }
      /**
       * 登录成功,授权失败,提示授权
       */
      else if (value.login && !value.auth) {
        that.setData({
          modalauth: true
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
  onShow() {
    console.log("onshow")
    getApp().watch(function (value) {
      if (value.login && value.auth) {
        let diseaseId = wx.getStorageSync('diseaseId');
        let userInfo = wx.getStorageSync('userInfo');
        if (userInfo.tags.length > 0) {
          that.getHomeData(diseaseId || userInfo.tags[0].caregiverTag.diseaseId)
        }
      }
    })
  },


  tagChange(e) {
    console.log(e);
    let diseaseId = e.currentTarget.dataset.diseaseId;
    let checkIndex = that.data.diseaseId;
    if (diseaseId == checkIndex) return;
    that.setData({
      diseaseId: diseaseId
    })

    that.getHomeData(diseaseId)

  },
  async getHomeData(diseaseId) {
    try {
      let res = await Api.homeData({
        diseaseId: diseaseId
      });
      console.log(res);
      let datas = res.data.map(item => {
        console.log(item)
        item.first = pinyin.getFirstCamelChars(item.patient.name || "未知");
        return item;
      })
      that.setData({
        datas: datas,
        diseaseId: diseaseId
      })
      wx.setStorageSync('diseaseId', diseaseId);
    } catch (error) {
      console.log(error)
    }
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

  async scan(e) {
    console.log(e);
    let types = { 'ip': { type: 1, url: 'scanResult' }, 'op': { type: 0, url: 'outpatient' } };
    let diseaseIds = { 'diabetes': 1, 'respiratory': 2 };
    let dataset = e.currentTarget.dataset;
    if (!diseaseIds[dataset.d]) return that.showTips("该病种病历扫描开发中");
    let scanImages = that.data.scanImages;
    if (!scanImages || scanImages.length == 0) return that.showTips("请先添加病历图片");
    let res = await ocr.getOcrResult({
      imgs: scanImages,
      type: dataset.type,
      d: dataset.d
    });
    console.log(res);
    app.globalData.scanData = res.scanData;
    app.globalData.pics = res.pics;
    console.log('/pages/' + dataset.d + '/patient/' + types[dataset.type].url + '?diseaseId=' + diseaseIds[dataset.d] + '&type=' + types[dataset.type].type)
    wx.navigateTo({
      url: `/pages/${dataset.d}/patient/${types[dataset.type].url}?diseaseId=${diseaseIds[dataset.d]}&type=${types[dataset.type].type}`
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
        if (res.data.auth && res.data.login) {
          wx.setStorageSync('token', res.data.token);
          wx.setStorageSync('userInfo', res.data.info);
        } else {
          wx.removeStorageSync('code');
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          that.showTips(res.data.msg);
          that.setData({
            authModal: false
          })
        }
        app.globalData.msg = res.data.msg;
        app.globalData.status = { login: res.data.login, auth: res.data.auth };
      } else {
        wx.removeStorageSync('code');
        that.showTips(res.msg);
        that.setData({
          authModal: false
        })
      }
    } else {
      that.showTips('您已拒绝授权获取手机号~');
      that.setData({
        authModal: false
      })
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