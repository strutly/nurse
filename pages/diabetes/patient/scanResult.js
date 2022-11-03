var that;
const app = getApp();
import WxValidate from "../../../utils/WxValidate";
import CustomPage from '../../../CustomPage';
import ocr from '../../../config/ocr';
CustomPage({
  data: {
    pics: [],
    scanImages: [],
    reviews: [],
    allline:{}
  },
  onLoad(options) {
    that = this;
    console.log(app.globalData)
    that.setData({
      patientData: app.globalData.scanData,
      scanData: app.globalData.scanData,
      pics: app.globalData.pics
    })
    that.initValidate();
  },
  initValidate() {
    let rules = {
      name: {
        required: true
      },
      gender: {
        required: true
      },
      birthOfYear: {
        required: true
      },
      hospitalId: {
        required: true
      },
      admissionDate: {
        required: true
      },
      dischargeDate: {
        required: true
      }
    }, messages = {
      name: {
        required: "请输入姓名"
      },
      gender: {
        required: "请输入性别"
      },
      birthOfYear: {
        required: "请选择出生年份"
      },

      hospitalId: {
        required: "请输入住院ID"
      },
      admissionDate: {
        required: "请选择入院时间"
      },
      dischargeDate: {
        required: "请选择出院时间"
      }
    };
    that.WxValidate = new WxValidate(rules, messages);
  },
  async scan() {
    let scanImages = that.data.scanImages;
    if (!scanImages || scanImages.length == 0) return that.showTips("请先添加病历图片");
    let res = await ocr.getOcrResult(scanImages);
    console.log(res);
    app.globalData.scanData = res.scanData;
    app.globalData.pics = res.pics;
    that.setData({
      patientData: res.scanData,
      scanData: res.scanData,
      pics: res.pics,
      modalscan: false
    })
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
  },
  addReview() {
    let reviews = that.data.reviews;
    reviews.push({});
    that.setData({
      reviews: reviews
    })
  },
  reviewChange(e) {
    console.log(e);
    let dataset = e.currentTarget.dataset;
    let reviews = that.data.reviews;
    reviews[dataset.index][dataset.type] = e.detail.value;
    that.setData({
      reviews: reviews
    })
  },
  reviewRemove(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let reviews = that.data.reviews;
    reviews = reviews.splice(0, index);
    that.setData({
      reviews: reviews
    })
  },
  submit(e) {
    let data = e.detail.value;
    console.log(data);
    if (!that.WxValidate.checkForm(data)) {
      console.log(that.WxValidate)
      let error = that.WxValidate.errorList[0]
      that.showTips(error.msg)
      return false;
    }
    let reviews = that.data.reviews;
    for (let i = 0; i < reviews.length; i++) {
      if (!reviews[i].title || !reviews[i].time) {
        that.showTips("复查项目请输入完整信息");
        return;
      }
    }
    data.reviews = reviews;
    app.globalData.patientData = data;
    app.globalData.scanData = that.data.patientData;
    wx.navigateTo({
      url: '/pages/diabetes/patient/saveResult',
    })
  },
  pickerChange(e) {
    console.log(e);
    let name = e.currentTarget.dataset.name;
    that.setData({
      ['patientData.' + name]: e.detail.value
    })
  },
  inputChange(e) {
    console.log(e);
    let name = e.currentTarget.dataset.name;
    that.setData({
      ['patientData.' + name]: e.detail.value
    })
  },
  showAll(e){
    console.log(e);
    let type = e.currentTarget.dataset.type;
    let allline = that.data.allline;
    allline[type] = !allline[type];
    that.setData({
      allline:allline
    })
  }
})