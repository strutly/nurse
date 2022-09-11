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
      show: true
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
        let result = datas.replaceAll("；", ";");
        let name = result.substring(result.indexOf('姓名') + 3, result.indexOf('科别'));
        let gender = result.substring(result.indexOf('性别') + 3, result.indexOf('年龄'));
        let age = result.substring(result.indexOf('年龄') + 3, result.indexOf('入院时间'));
        let admissionDiagnosis = result.substring(result.indexOf('入院诊断') + 5, result.indexOf(('出院诊断')));
        let dischargeDiagnosis = result.substring(result.indexOf('出院诊断') + 5, result.indexOf('入院情况'));
        let height = result.substring(result.indexOf('身高') + 3, result.indexOf('体重') - 1).replace("cm", "");
        let widget = result.substring(result.indexOf('体重') + 3, result.indexOf('BMI') - 1).replace("kg", "");
        let bmi = result.substring(result.indexOf('BMI') + 3, result.indexOf('m2') + 2);

        console.log(datas);
        app.globalData.scanData = { 'BMI': bmi, '姓名': name, '性别': gender, '年龄': age, '入院诊断': admissionDiagnosis, '出院诊断': dischargeDiagnosis, '身高': height, '体重': widget };
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
