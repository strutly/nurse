var that;
const app = getApp();
import WxValidate from "../../utils/WxValidate";
import CustomPage from "../../CustomPage";
import orc from '../../config/orc';
CustomPage({
  data: {
    scanImages:[]
  },
  onLoad(options) {
    that = this; 
    that.setData({
      patientData:app.globalData.scanData,
      scanData:app.globalData.scanData
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
      age: {
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
      age: {
        required: "请输入年龄"
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
    let result = await orc.getOrcResult(scanImages);
    console.log(result);
    app.globalData.scanData = result;
    that.setData({
      patientData:result,
      scanData:result,
      modalscan:false
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

  submit(e) {
    let data = e.detail.value;
    if (!that.WxValidate.checkForm(data)) {
      console.log(that.WxValidate)
      let error = that.WxValidate.errorList[0]
      that.showTips(error.msg)
      return false;
    }
    app.globalData.patientData = data;
    wx.navigateTo({
      url: '/pages/patient/saveResult',
    })
  },
  pickerChange(e){
    console.log(e);
    let name = e.currentTarget.dataset.name;
    that.setData({
      ['patientData.'+name]:e.detail.value
    })
  },
  inputChange(e){
    console.log(e);
    let name = e.currentTarget.dataset.name;
    that.setData({
      ['patientData.'+name]:e.detail.value
    })
  }
  

})