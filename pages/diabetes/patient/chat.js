var that;
import Api from '../../../config/api';
import Util from '../../../utils/util';
import CustomPage from '../../../CustomPage';
CustomPage({
  data: {
    open: -1,
    domain: Api.domain,
    chats: [],
    daysData: {}
  },
  onLoad(options) {
    that = this;

  },
  onReady() {
    getApp().watch(function (value) {
      if (value.login && value.auth) {
        that.getList(1);
        setTimeout(() => {
          that.setData({
            intoView: "report0"
          })
        }, 1000);
      }else{
        that.showTips("出错了~");
      }
    })
  },


  async getList(pageNo) {
    let res = await Api.reportChat({
      pageNum: pageNo,
      pageSize: 8,
      patientId: that.data.options.id
    })
    if (res.code == 0) {
      let chats = that.data.chats;
      that.setData({
        chats: chats.concat(res.data.content),
        endline: res.data.last,
        pageNo: pageNo
      })
    }
  },
  addList() {
    console.log(1);
    if (!that.data.last) {
      that.getList(that.data.pageNo + 1);
    }
  }, onPulling(e) {
    console.log('onPulling:', e)
  },

  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    if (!that.data.last) {
      that.getList(that.data.pageNo + 1);
      setTimeout(() => {
        this.setData({
          triggered: false,
        })
        this._freshing = false
      }, 1000)
    }
  },

  onRestore(e) {
    console.log('onRestore:', e)
  },

  onAbort(e) {
    console.log('onAbort', e)
  },
  async notice(e) {
    console.log(e)
    let data = e.detail.value;
    if (!data.advice) return that.showTips("请输入通知内容~");
    let report = { type: 4, status: 0, createTime: Util.dateFormat(new Date().toUTCString(), "yyyy-MM-dd hh:mm:ss"), patientId: data.patientId, content: { advice: data.advice } }
    let res = await Api.addReport(report);
    if (res.code == 0) {
      that.showTips("发送成功", "success");
      let chats = that.data.chats;
      chats.unshift(report)
      that.setData({
        chats: chats
      })
    }


  }

})