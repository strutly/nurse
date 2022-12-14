var that;
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
CustomPage({
  data: {
    notice: {}
  },
  async onLoad(options) {
    that = this;
    try {
      console.log(options)
      let res = await Api.detailReport(options);
      that.setData({
        notice: res.data
      })
    } catch (error) {
      that.setData({
        notice: {}
      })
    }
  }
})