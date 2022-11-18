var that;
import WxValidate from "../../../utils/WxValidate";
import CustomPage from '../../../CustomPage';
CustomPage({
  data: {
    questions:["休息", "您自己按照习惯的步点走路", "与您的同龄人一起走路", "爬山", "爬楼梯", "吃饭", "从椅子上坐起来", "刷牙", "剃须或者梳头", "洗澡", "穿衣", "收拾屋子", "洗碟子", "扫地、吸尘", "叠被子", "购物", "洗衣服", "洗车", "修剪草坪", "给草坪浇水", "性生活", "气短", "害怕因用力过猛而导致伤害", "害怕会气短"],
    max:6,
    score:[]
  },

  onLoad(options) {
    that = this;
    that.initValidate();
  },
  initValidate() {
    let questions = that.data.questions;
    let rules = {},messages = {};
    questions.forEach((question,i)=>{
      rules[i]={
        required: true
      };
      messages[i]={
        required: "请选择[ "+question+" ]的答案"
      };
    })
    that.WxValidate = new WxValidate(rules, messages);
  },
  choose(e){
    console.log(e);
    let q = e.currentTarget.dataset.q;
    let s = e.currentTarget.dataset.score;
    let score = that.data.score;
    score[q] = s;
    that.setData({
      score:score
    })
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
    console.log({result:data,sum:sum});
    
    var pages = getCurrentPages();
    var previousPage = pages[pages.length - 2]; //上一个页面
    previousPage.setData({
      [that.data.options.type]: {result:data,sum:sum}
    })
    wx.navigateBack({
      delta: 1
    })
  }
  
})