
var that;
const app = getApp();
import CustomPage from '../../CustomPage';
import Api from '../../config/api';
import WxValidate from "../../utils/WxValidate";
CustomPage({
  data: {
    tips: '请患者使用微信扫描下方二维码，关注公众号并绑定个人信息',
    typeArr: ['2型', '1型'],
    emotionArr: ['良好', '精神紧张', '焦虑', '抑郁'],
    medicationArr: ['按时按量', '未按时用药'],
    dietArr: ['清淡', '油腻'],
    motionArr: ['有', '无'],
    educationArr: ['一般', '良好'],
    occupationArr: ['无业', '脑力劳动者', '体力劳动者'],
    economyArr: ['一般', '良好'],
    internetArr: ['一般', '良好'],
    sugarArr: ['偶尔', '持续', '从不'],
    dietHabitArr: ['偏清淡', '偏油腻'],
    motionHabitArr: ['从不', '偶尔', '经常'],
    sleepArr: ['差', '一般', '良好'],
    smokeArr: ['有', '无'],
    wineArr: ['有', '无'],
    psychologyArr: ['良好', '焦虑'],
    complianceArr: ['低', '高'],
    injectionArr: ['有', '无'],
    liveAloneArr: ['是', '否'],
    disabled: false,
    complicationArr: ['糖尿病酮症','糖尿病酮症酸中毒','高血糖高渗综合征','糖尿病肾病','糖尿病眼病','糖尿病神经病变','低血糖','冠状动脉粥样硬化','脑梗塞','下肢血管疾病', '糖尿病足'],
    otherArr:['糖尿病自我管理知识缺乏','糖尿病自我管理态度消极','糖尿病自我管理行为差','经济困难','家庭支持系统差','用药依从性差'],
    doctorArr:[]
  },

  async onLoad(options) {
    that = this;
    that.initValidate();
    let res = await Api.doctorPage({
      type:1
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
      height: {
        required: true
      },
      weight: {
        required: true
      },
      doctorId: {
        required: true
      }
    }, messages = {
      phone: {
        required: "请输入正确的手机号",
        tel:"请输入正确的手机号"
      },
      height: {
        required: "请输入身高"
      },
      weight: {
        required: "请输入体重"
      },
      doctorId: {
        required: "请选择经管医生"
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