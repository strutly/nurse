var that;
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
CustomPage({

  data: {
    notices:[]
  },
  onLoad(options) {
    that = this;
    console.log(options)
    that.getList(1)
  },
  async getList(pageNo){
    let param = that.data.options;
    console.log(param)
    param.pageNo = pageNo;
    let res = await Api.reportNoticePage(param);
    console.log(res);
    let notices = that.data.notices;
    that.setData({
      notices:notices.concat(res.data.content),
      endline:res.data.last,
      pageNo: pageNo
    })    
  },
  onReachBottom() {
    let endline = that.data.endline;
    if(!endline){
      let pageNo = that.data.pageNo + 1;
      that.getList(pageNo);
    }
  },

  
})