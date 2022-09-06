var that;
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
import WxValidate from '../../utils/WxValidate';
CustomPage({
  data: {

  },
  async onLoad(options) {
    that = this;
    console.log(options)
    let res = await Api.detailReport(options);
    console.log(res);
    that.setData({
      reportForm:res.data.report,
      patient:res.data.patient
    })
    that.initValidate();
  },
  initValidate() {
    let rules = {
      'content.sugarBefore': {
        required: true
      },
      'content.sugarAfter': {
        required: true
      },
      'content.diastolicPressure': {
        required: true
      },
      'content.systolicPressure': {
        required: true
      },
    }, messages = {
      'content.sugarBefore': {
        required: '请输入餐前血糖'
      },
      'content.sugarAfter': {
        required: '请输入餐后血糖'
      },
      'content.diastolicPressure': {
        required: '请输入收缩压'
      },
      'content.systolicPressure': {
        required: '请输入舒张压'
      }
    };
    that.WxValidate = new WxValidate(rules, messages);
  },
  checkboxChange(e){
    console.log(e);
    that.setData({
      ['reportForm.content.'+e.currentTarget.dataset.type]:e.detail.value[0]||0
    })
  },
  async addImg(e){
    console.log(e);
    let type = e.currentTarget.dataset.type;

    let imgRes = await wx.chooseMedia({
      sourceType:['album'],
      mediaType:['image'],
      count:1
    });
    console.log(imgRes)
    let res = await Api.uploadFile(imgRes.tempFiles[0].tempFilePath,true);
    that.setData({
      ['reportForm.content.'+type]:res.data
    })


  },
  removeImg(e){
    let type = e.currentTarget.dataset.type;
    that.setData({
      ['reportForm.content.'+type]:''
    })
  },
  call(){
    wx.makePhoneCall({
      phoneNumber: that.data.patient.phone
    })
  },
  async submit(e){
    console.log(e);
    let data = e.detail.value;
    if (!that.WxValidate.checkForm(data)) {
      console.log(that.WxValidate)
      let error = that.WxValidate.errorList[0]
      that.showTips(error.msg)
      return false;
    }

    Object.keys(data).map(key => {
      console.log(key)
      if (key.indexOf(".") > -1) {
        let s = key.split(".");
        if (!data[s[0]]) data[s[0]] = {};
        data[s[0]][s[1]] = data[key];
        delete data[key];
      }
    })
    console.log(data)
    let res = await Api.updateReport(data);
    console.log(res);
    if(res.code==0){
      that.showTips('修改成功','success')
    }else{
      that.showTips(res.msg);
    }

  }

})