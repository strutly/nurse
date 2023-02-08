var that;
import Api from '../../../config/api';
import CustomPage from '../../../CustomPage';
import WxValidate from '../../../utils/WxValidate';
CustomPage({
  data: {
    tab: 0,
    sugarArr:['餐前','餐后'],
    pressureArr:['收缩压','舒张压'],
    timeArr:[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],
    healthWays: ['散步（低速50-60m/min）', '散步（中速70-80m/min）', '散步（快速90m/min）', '广播体操', '跳舞', '自行车（平地中速）', '自行车（登坡中速）', '上下楼梯', '乒乓球', '羽毛球', '游泳']
  },
  async onLoad(options) {
    that = this;
    console.log(options)
    let res = await Api.detailReport(options);
    console.log(res);

    that.setData(res.data);
  },
  tabChange(e) {
    that.setData({
      tab: e.currentTarget.dataset.index
    })
  },
  medicAllChange(e) {
    console.log(e);
    let flag = e.detail.value.length > 0 ? true : false;
    let index = e.currentTarget.dataset.index;
    let report = that.data.report;
    report.medication[index].complete = flag;
    report.medication[index].medics.forEach(m => {
      m.complete = flag;
    })
    that.setData({
      report: report
    })
  },
  medicChange(e) {
    console.log(e)
    let i = e.currentTarget.dataset.i;
    let j = e.currentTarget.dataset.j;
    let flag = e.detail.value.length > 0 ? true : false;
    let report = that.data.report;
    let take = true;
    report.medication[i].medics.forEach((m,index)=>{
      if(index==j) m.complete = flag;
      if(!m.eat) take = false;
    })
    report.medication[i].complete = take;
    that.setData({
      report: report
    })
  },
  typeChange(e){
    console.log(e);
    let val = e.detail.value;
    let report = that.data.report;
    let dataset = e.currentTarget.dataset;
    let arr = dataset.type=='sugars'?that.data.sugarArr:that.data.pressureArr;
    console.log(arr)
    report[dataset.type][dataset.index].type = val;
    that.setData({
      report:report
    })
  },
  timeChange(e){
    console.log(e);
    let val = e.detail.value;
    let report = that.data.report;
    let dataset = e.currentTarget.dataset;
    let arr = that.data.timeArr;
    console.log(arr)
    report[dataset.type][dataset.index].time = arr[val];
    that.setData({
      report:report
    })
  },
  motionChange(e) {
    console.log(e);
    that.setData({
      ['report.motion.complete']: e.detail.value.length>0
    })
  },
  async addImg(e) {
    console.log(e);
    let type = e.currentTarget.dataset.type;

    let imgRes = await wx.chooseMedia({
      sourceType: ['album'],
      mediaType: ['image'],
      count: 1
    });
    console.log(imgRes)
    let res = await Api.uploadFile(imgRes.tempFiles[0].tempFilePath, true);
    that.setData({
      ['report.eat.' + type]: res.data
    })
  },
  removeImg(e) {
    console.log(e)
    let type = e.currentTarget.dataset.type;
    that.setData({
      ['report.eat.' + type]: ''
    })
  },
  add(e) {
    console.log(e);
    let type = e.currentTarget.dataset.type;
    let report = that.data.report;
    report[type] = report[type]||[];
    report[type].push({
      type:0,
      num:'',
      notice:false,
      time:5
    })
    that.setData({
      report:report
    })    
  },
  remove(e) {
    console.log(e);
    let type = e.currentTarget.dataset.type;
    console.log(type);
    let report = that.data.report;
    report[type].splice(e.currentTarget.dataset.index, 1);    
    that.setData({
      report:report
    })
  },

  inputChange(e) {
    let type = e.currentTarget.dataset.type;
    let index = e.currentTarget.dataset.index;
    let report = that.data.report;
    report[type][index].num = e.detail.value;
    that.setData({
      report: report
    })
  },
  async submit(e) {
    console.log(e);
    let report = that.data.report;
    console.log(report)
    let flag=true,msg="";
    let sugars = report.sugars||[],pressures = report.pressures||[];
    sugars.forEach(sugar=>{
      if(sugar.num==''){
        flag = false;
        msg = "请输入血糖值再提交";
      }
    })
    pressures.forEach(sugar=>{
      if(sugar.num==''){
        flag = false;
        msg = "请输入血压值再提交";
      }
    })
    if(!flag) return that.showTips(msg);
    let medics = [];
    report.medication.forEach(item=>{
      medics = medics.concat(item.medics);
    })
    report.medics = medics;

    let res = await Api.updateReport(JSON.stringify({
      id:that.data.id,
      content:report
    }));
    console.log(res);
    if (res.code == 0) {
      that.showTips('修改成功', 'success')
    } else {
      that.showTips(res.msg);
    }
  }

})