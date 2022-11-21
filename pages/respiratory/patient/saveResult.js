
var that;
const app = getApp();
import Api from '../../../config/api';
import CustomPage from '../../../CustomPage';
import WxValidate from "../../../utils/WxValidate";
CustomPage({
  data: {
    tips: '请患者使用微信扫描下方二维码，关注公众号并绑定个人信息',
    
    disabled: false,
    
    doctorArr:[]
  },

  async onLoad(options) {
    that = this;
    that.initValidate();
    let res = await Api.doctorPage({
      type:2
    });
    that.setData({
      doctorArr:res.data
    })
    console.log(res);
  },
  initValidate() {
    let rules = {
      phone: {
        required: true,
        tel:true
      },
      doctorId: {
        required: true
      },
      lcq:{
        required: true
      },
      sobq: {
        required: true
      },
    }, messages = {
      phone: {
        required: "请输入正确的手机号",
        tel:"请输入正确的手机号"
      },
      doctorId: {
        required: "请选择经管医生"
      },
      lcq:{
        required: '请完成莱塞斯特咳嗽生命质量问卷'
      },
      sobq: {
        required: '请完成加利福利亚大学圣地亚哥分校气短问卷'
      }
    };
    that.WxValidate = new WxValidate(rules, messages);
  },
  pickerChange(e) {
    console.log(e);
    that.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    })
  },
  otherChange(e) {
    let name = e.currentTarget.dataset.name;
    that.setData({
      [name]: e.detail.value
    })
  },
  async submit(e) {
    console.log(e);
    
    let data = e.detail.value;
    if (!that.WxValidate.checkForm(data)) {
      console.log(that.WxValidate)
      let error = that.WxValidate.errorList[0]
      that.showTips(error.msg)
      return false;
    }


    that.setData({
      disabled: true
    })
    let patientData = app.globalData.patientData;
    patientData = Object.assign(patientData, data);
    Object.keys(patientData).map(key => {
      console.log(key)
      if (key.indexOf(".") > -1) {
        let s = key.split(".");
        if (!patientData[s[0]]) patientData[s[0]] = {};
        patientData[s[0]][s[1]] = patientData[key];
        delete patientData[key];
      }
    })
    patientData.scanData = app.globalData.scanData;

    console.log(patientData);
    let res = await Api.addPatient(patientData);
    console.log(res);
    if (res.code == 0) {
      that.setData({
        codeUrl: res.data.url,
        patientId: res.data.id,
        tips: res.data.url ? '请患者使用微信扫描下方二维码，关注公众号并绑定个人信息' : '二维码生成失败,点击重新生成二维码',
        show: true
      })
    } else {
      that.showTips(res.msg);
    }
  },
  async updateCode() {
    let res = await Api.codePatient({ id: that.data.patientId });
    if (res.code == 0) {
      that.setData({
        tips: '请患者使用微信扫描下方二维码，关注公众号并绑定个人信息',
        codeUrl: res.data
      })
    }
  }
})