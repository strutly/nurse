
var that;
const app = getApp();
import CustomPage from '../../CustomPage';
import Api from '../../config/api';
CustomPage({
  data: {
    tips: '请患者使用微信扫描下方二维码，关注公众号并绑定个人信息',
    typeArr:['1型','2型'],
    emotionArr: ['良好', '精神紧张', '焦虑', '抑郁'],
    medicationArr: ['按时按量', '未按时用药'],
    dietArr: ['清淡', '油腻'],
    motionArr: ['无', '适量', '过量'],
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
    disabled: false
  },

  onLoad(options) {
    that = this;
  },
  pickerChange(e) {
    console.log(e);
    that.setData({
      [e.currentTarget.dataset.name + 'Val']: e.detail.value
    })
  },
  otherChange(e) {
    that.setData({
      others: e.detail.value
    })
  },
  async submit(e) {
    console.log(e);
    let data = e.detail.value;
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
  async updateCode(){
    let res = await Api.codePatient({id:that.data.patientId});
    if(res.code==0){
      that.setData({
        tips: '请患者使用微信扫描下方二维码，关注公众号并绑定个人信息',
        codeUrl: res.data
      })
    }
  }
})