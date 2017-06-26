// filter可以全局被调用，即 组件 和 Vue 皆可调用
Vue.filter('currency', function(value) {
  return '¥' + value
})

// ------------组件-----------------
// -----菜谱------
Vue.component('cookbook_component',{
    props:['myList'],
    template:`<div class="site-left-out">
    			<div class="title">
    				<h1>菜谱</h1>
    			</div>
    			<ul class="site-left">
    				<li v-for="item in myList" v-on:click="addells(item)" v-bind:class="{ select: isselect(item)}">{{ item.name }}</li>
    			</ul>
    		</div>`,
    methods:{
        addells(item){
            this.$emit('addells', item) // 和父组件产生数据交互
        },
        isselect(item){
            this.$emit('isselect', item)
        }
    }
})
// -----原料表------
Vue.component('material_component',{
    props:['myElls'],
    template: `<div class="site-center-out">
    			<div class="title">
    				<h1>原料表</h1>
    			</div>
    			<ul class="site-center">
    				<li v-for="ell in myElls" v-on:click="togglebought(ell)" v-bind:class="{ default: !ell.isBought,bought: ell.isBought }">
    					<span>{{ ell.food }}</span>
    					<span>¥ {{ ell.price }}</span>
    				</li>
    			</ul>
    		</div>`,
    methods:{
        togglebought(ell){
            this.$emit('togglebought',ell)
        }
    }
})
// -----购物车------
Vue.component('cart_component',{
    props:['myShops','totalPrice'],
    template:`<div class="site-right-out">
    			<div class="title">
    				<h1>购物车</h1>
    			</div>
    			<ul class="site-right">
    				<li v-for="shop in myShops" v-on:click="togglebuy(shop)" v-bind:class="{buy: shop.isBought}">
    					<span>{{ shop.food }}</span>
    					<span>¥ {{ shop.price }}</span>
    				</li>
    			</ul>
    			<div class="site-footer">

    				<div class="total">共计 <span>{{totalPrice | currency}}</span></div>
    			</div>
    		</div>`,
    methods:{
        togglebuy(shop){
            this.$emit('togglebuy',shop)
        },
        clearcart(){
            this.$emit('clearcart')
        }
    }
})

// ------------实例-----------------
let app = new Vue({
  el: '#app',
  data: {
    list: [{
      name: '', //这里只是个形式
      ellipsis: [{
        food: '',
        price: '',
        isBought: ''
      }]
    }],
    ells: [{
      name: '',
      ellipsis: [{
        //  food:'',
        //  price:'',
        //  isBought:''
      }]
    }], //为这个点击事件 v-on:click="ells=item.ellipsis" 存储内容
    eLLS: [], //存放原料表的内容
    shops: [] //存放购物车里的内容
  },
  mounted() { //mounted: function () {}的简写
    let that = this
    axios.get('../app.json').then(function(data) {
      that.list = data.data.list
    })
  },
  methods: {
      addElls_toggleSelect(item) {
        var index = this.ells.indexOf(item) //this.ells为空数组，不包含item 值为 -1
        if (index === -1) { // 如果不存在 ，就向li标签里添加 sold 类
          this.ells = [];
          this.ells.push(item)
        } else {
          this.ells.splice(index, 1) // 如果存在 ，就删除li标签里的 sold 类
        }

        this.eLLS = item.ellipsis;
      },
      isSelect(item) {
        return (this.ells.indexOf(item) !== -1)//返回值为true时，表示新数据已加入，那么菜谱标签被选中
    },
    //下面为购物车函数
    toggleBought(ell) {
      ell.isBought = !ell.isBought;
      var index = this.shops.indexOf(ell)
      if (index === -1) { // 如果不存在 ，就向li标签里添加 sold 类
        this.shops.push(ell);
      }
      if (ell.isBought !== false) {
        this.shops.splice(index, 1);
      }
      console.log(this.shops)
      /*下面的for循环是去重数组*/
      for (var i = 0; i < this.shops.length; i++) {
        for (var j = i + 1; j < this.shops.length; j++) {
          if (this.shops[i].food == this.shops[j].food) {
            this.shops.splice(j, 1);
          }
        }
      }
      console.log(this.shops)
    },
    toggleBuy(shop) {
      shop.isBought = !shop.isBought;
    },
    clearCart() {
      this.shops = [];
    //   this.eLLS = [];
    //   console.log(this.eLLS);
    //   <div class="clear" v-on:click="clearcart">清空购物车</div>
    }
  },
  computed: {
    totalPrice() {
      var total = 0
      this.shops.forEach(function(ell) {
        if (ell.isBought == false) { //因为点击某个原料时，isBought 变成 false
          total += Number(ell.price)
        }
      })
      return total.toFixed(2)
    }
  }
})
