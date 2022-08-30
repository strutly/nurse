var that;
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
CustomPage({

  data: {

  },

  async onLoad(options) {
    let res = await Api.detailReport(options);
    console.log(res);
  },

})