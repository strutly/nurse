var that;
import CustomPage from "../../CustomPage";
import Api from "../../config/api";
CustomPage({
  data: {
    notices: []
  },
  onLoad(options) {
    that = this;
    that.getList(1);
  },
  async getList(pageNo) {
    let param = that.data.options;
    console.log(param)
    param.pageNum = pageNo;
    param.pageSize = 10;
    try {
      let res = await Api.reportNoticePage(param);
      console.log(res);
      let notices = that.data.notices;
      that.setData({
        notices: notices.concat(res.data.content),
        endline: res.data.last,
        pageNo: pageNo
      })
    } catch (error) {
      console.log(error)
    }
  },
  onReachBottom() {
    let endline = that.data.endline;
    if (!endline) {
      let pageNo = that.data.pageNo + 1;
      that.getList(pageNo);
    }
  },
})