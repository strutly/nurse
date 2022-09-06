var that;
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
CustomPage({

  data: {

  },

  async onLoad(options) {
    that = this;
    console.log(options)
    let res = await Api.detailReport(options);
    console.log(res);
    that.setData({
      reportForm:res.data.report
    })
  },

})