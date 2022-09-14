var that;
const app = getApp()
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
const fileManager = wx.getFileSystemManager();
CustomPage({
  data: {
    typeArr: ['1型', '2型', '未知'],
    tabs: [{ title: '今日随访', num: 0 }, { title: '患者动态', num: 3 }],
    tabIndex: 0,
    show: false
  },

  onLoad() {
    that = this;
    that.getHomeData();
  },

  async getHomeData() {
    let res = await Api.homeData();
    console.log(res);
    that.setData({
      datas: res.data
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
  async submit(e) {
    console.log(e);
    let data = e.detail.value;
    Object.keys(data).map(key => {
      console.log(key)
      if (key.indexOf(".") > -1) {
        let s = key.split(".");
        if (!data[s[0]]) data[s[0]] = {};
        data[s[0]][s[1]] = data[key];
        delete data[key];
      }
    })
    let res = await Api.addFollow(data);
    console.log(res);
    if (res.code == 0) {
      that.getHomeData();
      that.setData({
        show: false
      })
    } else {
      that.showTips(res.msg);
    }
  },
  async scan() {
    try {
      let res = await wx.chooseMedia({
        count: 9,
        sourceType: ['album'],
        mediaType: ["image"]
      });
      console.log(res);
      let datas = "";
      try {
        for (let i = 0; i < res.tempFiles.length; i++) {
          let file = res.tempFiles[i];
          let quality = 100;
          console.log(file.size)
          console.log(file.size > 6 * 1024 * 1024)
          if (file.size > 4 * 1024 * 1024) {//大于10兆压缩50%
            console.log(22)
            quality = ((4 * 1024 * 1024) / file.size) * 90;
            let newFile = await wx.compressImage({//压缩图片
              src: file.tempFilePath, // 图片路径
              quality: quality
            });
            console.log(newFile)
            file = newFile;
            console.log(file)
          }
          let base64 = 'data:image/jpg;base64,' + fileManager.readFileSync(file.tempFilePath, 'base64')

          let data = await Api.scanImageInfo(base64);
          datas += data;
        }
        console.log(datas);
        let sacaResult = Api.scanResult(datas);
        app.globalData.scanData = sacaResult;
        wx.showToast({
          title: '图片识别成功',
          icon: 'none'
        })
        wx.navigateTo({
          url: '/pages/patient/scanResult',
        })
      } catch (error) {        
        wx.showToast({
          title: '图片识别成功',
          icon: 'none'
        })
      }
    } catch (error) {
      console.log(error)
    }
  },
  hideModal(e) {
    that.setData({
      authModal: false
    })
  },
  hiddenModal(){
    that.setData({
      show:false
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
        that.setData({
          auth: true,
          authModal: false
        });
        wx.setStorageSync('auth', true);
      } else {
        wx.removeStorageSync('code');
        that.showTips(res.msg, 'error')
      }
    } else {
      that.showTips('您已拒绝授权获取手机号~', 'error')
    }
  }


})
