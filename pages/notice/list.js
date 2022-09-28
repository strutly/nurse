var that;
import CustomPage from "../../CustomPage";
import Api from "../../config/api";
CustomPage({

  data: {

  },
  onLoad(options) {
    that = this;
    that.getList(1);
  },
  async getList(pageNo){
    let param = that.data.options;
    console.log(param)
    param.pageNo = pageNo;
    let res = await Api.reportNoticePage(param);
    let reports = that.data.reports;
    that.setData({
      reports:reports.concat(res.data.content),
      endline:res.data.last,
      pageNo: pageNo
    })
    console.log(res);
  },
  onReachBottom() {
    let endline = that.data.endline;
    if(!endline){
      let pageNo = that.data.pageNo + 1;
      that.getList(pageNo);
    }
  },
})