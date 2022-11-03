var that;
import Api from '../../../config/api';
import Util from '../../../utils/util';
import CustomPage from '../../../CustomPage';
CustomPage({
  data: {
    open:-1,
    daysData:{}
  },
  onLoad(options) {
    that = this;
    var mydate = new Date();
    var year = mydate.getFullYear();
    var month = mydate.getMonth();
    month = month + 1;   
    that.getMonthData(Util.dateFormat(year + "-" + month + "-1", 'yyyy-MM-dd'))   
  },
  async getMonthData(dateMonth) {
    try {
      let res = await Api.patientCalendar({
        id: that.data.options.id,
        dateMonth: dateMonth
      });
      console.log(res);
      if(res.code==0){
        that.setData({
          open:-1,
          dateMonth: dateMonth,
          daysData: res.data
        })
      }else{
        that.showTips(res.msg);
      }  
    } catch (error) {
      console.log(error)
    }
  },
  prevMonth() {
    let date = new Date(that.data.dateMonth);
    let month = date.getMonth();
    let year = date.getFullYear();

    if (month < 1) {
      year = year - 1;
      month = 12;
    }
    let minMonth = that.data.daysData.minMonth;
    if(month<minMonth) return that.showToast('日期超出范围~');
    that.getMonthData(Util.dateFormat(year + "-" + month + "-1", 'yyyy-MM-dd'));
  },
  nextMonth() {
    let date = new Date(that.data.dateMonth);
    let month = date.getMonth();
    if(month==new Date().getMonth()) return that.showToast('日期超出范围~');
    let year = date.getFullYear();
    if (month == 11) {
      year = year + 1;
      month = 0;
    }
    month = month + 2;
    that.getMonthData(Util.dateFormat(year + "-" + month + "-1", 'yyyy-MM-dd'));
  }
})