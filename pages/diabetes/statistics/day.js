var that;
import Api from '../../../config/api';
import Util from '../../../utils/util';
import CustomPage from '../../../CustomPage';
CustomPage({
  data: {
    time: "2023-01-01",
    tab: 0,
    open: -1,
    list: []
  },
  onLoad(options) {
    that = this;
    let date = Util.dateFormat(new Date().toString(), 'yyyy-MM-dd');
    that.setData({
      time: date,
      date: new Date()
    })

  },
  onReady() {
    getApp().watch(function (value) {
      console.log(value);
      if (value.login && value.auth) {
        let date = that.data.time;
        that.showData(date);
      }
    })
  },
  async showData(date) {
    let res = await Api.patientDayStatistics({
      dateMonth: date
    })
    console.log(res);
    if (res.code == 0) {
      that.setData({
        list: res.data
      })
    } else {
      that.showTips(res.msg);
    }
  },
  dayChange(e) {
    let date = that.data.date;
    console.log(date);
    let day = date.getDate();
    let add = e.currentTarget.dataset.add;
    date.setDate(day + parseInt(add));
    console.log(date);
    if (date > new Date()) {
      date.setDate(day);
      return that.showToast('日期超出范围~');
    }
    that.setData({
      time: Util.dateFormat(date.toString(), 'yyyy-MM-dd'),
      date: date,
      open: -1
    })
    that.showData(date);
  },
  tabChange(e) {
    that.setData({
      tab: e.currentTarget.dataset.index
    })
  },
  async open(e) {
    let open = that.data.open;
    let index = e.currentTarget.dataset.index;
    if (open == index) index = -1;
    let list = that.data.list;
    let report = list[index];
    console.log(report)
    if (index > -1) {
      if (report && report.confirm == 0 && report.canConfirm) {
        let res = await Api.updateReport({
          id: report.id
        })
        if (res.code == 0) {
          report.confirm = 1;
          that.setData({
            open: index,
            list: list
          })
        } else {
          that.showTips(res.msg);
        }
      } else{
        that.setData({
          open: index
        })
      }
    } else {
      that.setData({
        open: -1
      })
    }



  }
})