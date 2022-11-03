var that;
const app = getApp()
import Api from '../../config/api';
import CustomPage from '../../CustomPage';
import pinyin from '../../utils/pinyin';
import ocr from '../../config/ocr';
CustomPage({

  data: {
    checkIndex:0
  },
  onLoad(options) {
    that = this;
  },
  
  tagChange(e){
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let checkIndex = that.data.checkIndex;
    if(index == checkIndex) return;
    that.setData({
      checkIndex:index
    })
  }

})