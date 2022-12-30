var that;
import Api from '../../../config/api';
import CustomPage from '../../../CustomPage';
import WxValidate from '../../../utils/WxValidate';
CustomPage({
  data: {
    healthWays:['散步（低速50-60m/min）','散步（中速70-80m/min）','散步（快速90m/min）','广播体操','跳舞','自行车（平地中速）','自行车（登坡中速）','上下楼梯','乒乓球','羽毛球','游泳']
  },
  async onLoad(options) {
    that = this;
    console.log(options)
    let res = await Api.detailReport(options);
    console.log(res);
    let treats = JSON.parse(res.data.report.content.treats||'[]');
    that.setData({
      reportForm:res.data.report,
      treats:treats,
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
  add(e) {
    console.log(e);
    let type = e.currentTarget.dataset.type;
    console.log(type);
    let vals = that.data[type + "s"];
    console.log(vals);
    vals.push({});
    that.setData({
      [type + "s"]: vals
    })
  },
  remove(e) {
    console.log(e);
    let type = e.currentTarget.dataset.type;
    console.log(type);
    let vals = that.data[type + "s"];
    vals.splice(e.currentTarget.dataset.index, 1);
    console.log(vals)
    that.setData({
      [type + "s"]: vals
    })
  },
  pickerChange(e){
    console.log(e);
    let type = e.currentTarget.dataset.type;
    that.setData({
      ['reportForm.content.'+type]:e.detail.value
    })
  },
  inputChange(e) {
    let type = e.currentTarget.dataset.type;
    let index = e.currentTarget.dataset.index;
    let name = e.currentTarget.dataset.title;
    let vals = that.data[type + "s"];
    let val = vals[index];
    val[name] = e.detail.value;
    that.setData({
      [type + "s"]: vals
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
    console.log(data);
    data.content.treats = JSON.stringify(that.data.treats);
    let res = await Api.updateReport(data);
    console.log(res);
    if(res.code==0){
      that.showTips('修改成功','success')
    }else{
      that.showTips(res.msg);
    }

  }

})