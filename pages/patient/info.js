var that;
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
CustomPage({
  data: {
    info:{}
  },
  async onLoad(options) {
    console.log(options)
    that = this;
    let res = await Api.detailPatient({
      id:options.id
    });
    console.log(res);
    that.setData({
      info:res.data.patient,
      nums:res.data.nums
    })
  },
})