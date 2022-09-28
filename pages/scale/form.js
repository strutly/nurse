var that;
import jsonData from "../../utils/json";
import WxValidate from "../../utils/WxValidate";
import CustomPage from "../../CustomPage";
import Api from "../../config/api";
CustomPage({
  data: {
  },
  onLoad(options) {
    console.log(jsonData)
    that = this;
    that.setData({
      scaleForm:jsonData.scaleFormData[options.type]
    });
    that.initValidate(jsonData.scaleFormData[options.type].questions)
  },
  initValidate(questions) {
    let rules = {},messages = {};
    questions.forEach((question,i)=>{
      console.log(question)
      rules[i]={
        required: true
      };
      messages[i]={
        required: "请选择[ "+question.title+" ]的答案"
      };
    })
    that.WxValidate = new WxValidate(rules, messages);
  },
  getResult(sum){
    let scaleForm = that.data.scaleForm;
    let result = ""
    scaleForm.judges.forEach(judge=>{
      switch(judge.type){
        case 'LE':
          if(sum<=judge.max){
            result = judge.result;
            break;
          }         
        case 'BT':
          if(judge.min<=sum && sum<=judge.max){
            result = judge.result;
            break;
          }
        case 'GT':
          if(judge.min<=sum){
            result = judge.result;
            break;
          }     
      }       
    })
    return result;
  },
  submit(e){
    console.log(e);
    let data = e.detail.value;
    if (!that.WxValidate.checkForm(data)) {
      console.log(that.WxValidate)
      let error = that.WxValidate.errorList[0]
      that.showTips(error.msg)
      return false;
    }
    let sum = 0;
    Object.values(data).forEach(val=>{
      sum+=parseInt(val);
    })
    console.log(sum);
    console.log(that.getResult(sum));
    var pages = getCurrentPages();
    var previousPage = pages[pages.length - 2]; //上一个页面
    previousPage.setData({
      [that.data.options.type]: {score:sum,suggest:that.getResult(sum)}
    })
    wx.navigateBack({
      delta: 1
    })
  }
})