// components/calendar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    daysData:{
      type:Array,
      value:[]
    },
    open:{
      type:Number,
      value:-1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
    weekArr: [ '一', '二', '三', '四', '五', '六','日'],
  },
  attached: function () {
    var res = wx.getSystemInfoSync();    
    this.setData({
      param: res.windowHeight / 14,
    })    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    
    open(e){
      console.log(e);
      let index = e.currentTarget.dataset.index;
      let open = this.data.open||-1;
      if(index && open!=index){
        this.setData({
          open:index
        })
      }else{
        this.close()
      }      
    },
    close(){
      this.setData({
        open:-1
      })
    }
  }
})
