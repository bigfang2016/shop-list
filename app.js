let express = require('express') // express 是node_modules里的一个包
let fs = require("fs") //file system -node内置的核心模块
let app = express()

let data = fs.readFileSync('data.json')

//console.log(data)//会在终端显示，以作检验

app.get('/app.json', function(req, res) {
  var result = {}
  var jsonContent = JSON.parse(data); //此处转化的意义何在？为何不能直接取data.json 里的数据？
  result = jsonContent
  console.log(result);
  result.list.forEach(function(s) { //对 list 数组里面的每个对象进行遍历
    var arr = [] //用来存放原data.json 里 ellipsis 数组里的数据
    s.ellipsis.forEach(function(j) { //对 每一个 ellipsis 数组里 进行遍历
      var random = (Math.random() * 30).toFixed(2)
      j = {
        'food': `${j}`,
        'price': `${random}`,
        'isBought': 'false'
      }
      arr.push(j)
    })
    s.ellipsis = arr
  })
  res.send(result)
  // res.send({ name: "mimi", age: 2})
})

app.use('/static', express.static('public'))
app.listen(3000)
//  app.listen(3000, function () {
// console.log('Example app listening on port 3000!')
// })
