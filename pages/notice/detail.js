var that;
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
CustomPage({
  data: {
    notice:{}
  },
  async onLoad(options) {
    that = this;
    console.log(options)
    let res = await Api.detailReport(options);
    that.setData({
      report:res.data
    })
  }
})