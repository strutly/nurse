var that;
const app = getApp()
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
CustomPage({

  data: {
    qs: [
      "在过去7天中，有多少天，按照健康的饮食计划来进食",
      "近1个月您平均每周有多少天按糖尿病饮食要求合理安排饮食",
      "在过去7天中，有多少天，一天所吃的蔬菜水果加起来超过5份（如 吃蔬菜3碟、水果两个（水果一份约 橘子一个，木瓜1/3个等;蔬菜一份 100公克，约1碟）",
      "在过去7天中，有多少天吃油脂多的食物（如:油炸食物、肥肉、鸡皮等）",
      "在过去7天中，有多少天，有做30分钟以上的活动（指身体持续活动超过30分钟，包括走路、做家事）",
      "在过去7天中，除了工作及做家事以外，有多少天，有另外拨时间去做运动（如:慢跑、爬山、太极拳、 土风舞等）",
      "在过去7天中，有多少天，在家自己（或家人帮忙）量血糖",
      "在过去7天中，有多少天，依照医师指示的血糖测量标准次数（例如1天量血糖两次）在家按时自己（或家人帮忙）量血糖",
      "在过去7天中，有多少天，检查您的双脚（包括脚趾、脚板与脚底）",
      "在过去7天中，有多少天，在穿鞋之前有先检查鞋内的情形（如:鞋 内有无小石头、是否平整、有无破损 或潮湿等）",
      "在过去7天中，有多少天，按照医生要求正确服用药物或胰岛素"
    ],
    vals: [0, 1, 2, 3, 4, 5, 6, 7],
    value: {}
  },
  onLoad(options) {
    that = this;
    that.setData({
      value: app.globalData.formAnswer[options.patientId] || {}
    })
  },
  pickerChange(e) {
    console.log(e);
    let value = that.data.value;
    value["sum" + (e.currentTarget.dataset.index + 1)] = e.detail.value;
    that.setData({
      value: value
    })
  },
  submit(e) {
    console.log(e);
    let value = e.detail.value;
    let flag = true;
    let score = 0;
    for (const key in value) {
      if (!value[key]) {
        that.showTips("请完整选择本表单")
        flag = false;
        break;
      }
      score += parseInt(value[key]);
    }

    console.log(score);
    if (flag) {
      console.log("提交表单");
      Api.addReport(JSON.stringify({
        patientId: that.data.options.patientId,
        type: 2,
        content: value
      })).then(res => {
        if (res.code == 0) {
          app.globalData.formAnswer[that.data.options.patientId] = value;
          var pages = getCurrentPages();
          
          var previousPage = pages[pages.length - 2]; //上一个页面
          
          previousPage.setData({
            formAnswer: {score:score,value:value}
          })
          wx.navigateBack({
            delta: 1
          })
        }else{
          that.showTips(res.msg)
        }
      })
    }
  }
})