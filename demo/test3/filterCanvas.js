/*
 * @Author: mcdowell
 * @Date: 2020-05-25 15:05:18
 * @LastEditors: mcdowell
 * @LastEditTime: 2020-05-25 15:23:20
 */
//灰度效果
function copy1(canvasContext, width, height) {
  //获取ImageData的属性：width，height，data（包含 R G B A 四个值）；
  var imgdata = canvasContext.getImageData(0, 0, width, height)
  for (var i = 0; i < imgdata.data.length; i += 4) {
    //计算获取单位元素的RBG然后取平均值 然后复制给自身得到灰色的图像
    var avg = (imgdata.data[i] + imgdata.data[i + 1] + imgdata.data[i + 2]) / 3
    imgdata.data[i] = avg
    imgdata.data[i + 1] = avg
    imgdata.data[i + 2] = avg
  }
  //将图像信息绘制第二个canvas中，注：一般只能在服务下运行
  canvasContext.putImageData(imgdata, 0, 0)
}
//底片效果
function copy2(canvasContext, width, height) {
  //获取ImageData的属性：width，height，data（包含 R G B A 四个值）；
  var imgdata = canvasContext.getImageData(0, 0, width, height)
  for (var i = 0; i < imgdata.data.length; i += 4) {
    //将所有的RGB值重新赋值（底片效果 = 255 - 当前的RGB值）
    imgdata.data[i] = 255 - imgdata.data[i]
    imgdata.data[i + 1] = 255 - imgdata.data[i + 1]
    imgdata.data[i + 2] = 255 - imgdata.data[i + 2]
  }
  //将图像信息绘制第二个canvas中，注：一般只能在服务下运行
  canvasContext.putImageData(imgdata, 0, 0)
}

//黑白效果
function copy3(canvasContext, width, height) {
  //获取ImageData的属性：width，height，data（包含 R G B A 四个值）；
  var imgdata = canvasContext.getImageData(0, 0, width, height)
  for (var i = 0; i < imgdata.data.length; i += 4) {
    //计算获取单位元素的RBG然后取平均值
    var avg = (imgdata.data[i] + imgdata.data[i + 1] + imgdata.data[i + 2]) / 3
    imgdata.data[i] = avg > 128 ? 255 : 0
    imgdata.data[i + 1] = avg > 128 ? 255 : 0
    imgdata.data[i + 2] = avg > 128 ? 255 : 0
  }
  //将图像信息绘制第二个canvas中，注：一般只能在服务下运行
  canvasContext.putImageData(imgdata, 0, 0)
}

//浮雕效果
function copy4(canvasContext, width, height) {
  //获取ImageData的属性：width，height，data（包含 R G B A 四个值）；
  var imgdata = canvasContext.getImageData(0, 0, width, height)
  for (var i = 0; i < imgdata.data.length; i += 4) {
    //浮雕效果的算法：当前RGB减去相邻的GRB得到的值再加上128
    imgdata.data[i] = imgdata.data[i] - imgdata.data[i + 4] + 128
    imgdata.data[i + 1] = imgdata.data[i + 1] - imgdata.data[i + 5] + 128
    imgdata.data[i + 2] = imgdata.data[i + 2] - imgdata.data[i + 6] + 128
    //计算获取单位元素的RBG然后取平均值  再次灰度，优化浮雕的效果
    var avg = (imgdata.data[i] + imgdata.data[i + 1] + imgdata.data[i + 2]) / 3
    imgdata.data[i] = avg
    imgdata.data[i + 1] = avg
    imgdata.data[i + 2] = avg
  }
  //将图像信息绘制第二个canvas中，注：一般只能在服务下运行
  canvasContext.putImageData(imgdata, 0, 0)
}

//绿色滤镜
function copy5(canvasContext, width, height) {
  //获取ImageData的属性：width，height，data（包含 R G B A 四个值）；
  var imgdata = canvasContext.getImageData(0, 0, width, height)
  for (var i = 0; i < imgdata.data.length; i += 4) {
    //绿色滤镜的算法：当前绿色通道值G*1.4得到绿色滤镜
    var g = imgdata.data[i + 1] * 1.4
    //注：当前值大于255时将其赋值255
    imgdata.data[i + 1] = g > 255 ? 255 : g
  }
  //将图像信息绘制第二个canvas中，注：一般只能在服务下运行
  canvasContext.putImageData(imgdata, 0, 0)
}
//蓝色滤镜
function copy6(canvasContext, width, height) {
  //获取ImageData的属性：width，height，data（包含 R G B A 四个值）；
  var imgdata = canvasContext.getImageData(0, 0, width, height)
  for (var i = 0; i < imgdata.data.length; i += 4) {
    //蓝色滤镜的算法：当前蓝色通道值变为原来的1.6得到蓝色滤镜
    var b = imgdata.data[i + 2] * 1.6
    //注：当前值大于255时将其赋值255
    imgdata.data[i + 2] = b > 255 ? 255 : b
  }
  //将图像信息绘制第二个canvas中，注：一般只能在服务下运行
  canvasContext.putImageData(imgdata, 0, 0)
}

//红色滤镜
function copy7(canvasContext, width, height) {
  //获取ImageData的属性：width，height，data（包含 R G B A 四个值）；
  var imgdata = canvasContext.getImageData(0, 0, width, height)
  for (var i = 0; i < imgdata.data.length; i += 4) {
    //红色滤镜的算法：当前红色通道值变为原来的2得到红色滤镜
    var r = imgdata.data[i] * 2
    //注：当前值大于255时将其赋值255
    imgdata.data[i] = r > 255 ? 255 : r
  }
  //将图像信息绘制第二个canvas中，注：一般只能在服务下运行
  canvasContext.putImageData(imgdata, 0, 0)
}

//黄色滤镜
function copy8(canvasContext, width, height) {
  //获取ImageData的属性：width，height，data（包含 R G B A 四个值）；
  var imgdata = canvasContext.getImageData(0, 0, width, height)
  for (var i = 0; i < imgdata.data.length; i += 4) {
    //黄色滤镜的算法：红色通道值和绿色通道值增加50（红色+绿色 = 黄色）
    var r = imgdata.data[i] + 50
    var g = imgdata.data[i + 1] + 50
    //注：当前值大于255时将其赋值255
    imgdata.data[i] = r > 255 ? 255 : r
    imgdata.data[i + 1] = g > 255 ? 255 : g
  }
  //将图像信息绘制第二个canvas中，注：一般只能在服务下运行
  canvasContext.putImageData(imgdata, 0, 0)
}
//紫色滤镜
function copy9(canvasContext, width, height) {
  //获取ImageData的属性：width，height，data（包含 R G B A 四个值）；
  var imgdata = canvasContext.getImageData(0, 0, width, height)
  for (var i = 0; i < imgdata.data.length; i += 4) {
    //紫色滤镜的算法：红色通道值和蓝色通道值增加50（红色+蓝色 = 紫色）
    var r = imgdata.data[i] + 50
    var b = imgdata.data[i + 2] + 50
    //注：当前值大于255时将其赋值255
    imgdata.data[i] = r > 255 ? 255 : r
    imgdata.data[i + 2] = b > 255 ? 255 : b
  }
  //将图像信息绘制第二个canvas中，注：一般只能在服务下运行
  canvasContext.putImageData(imgdata, 0, 0)
}
//青色滤镜
function copy10(canvasContext, width, height) {
  //获取ImageData的属性：width，height，data（包含 R G B A 四个值）；
  var imgdata = canvasContext.getImageData(0, 0, width, height)
  for (var i = 0; i < imgdata.data.length; i += 4) {
    //青色滤镜的算法：绿色通道值和蓝色通道值增加50（绿色+蓝色 = 青色）
    var g = imgdata.data[i + 1] + 50
    var b = imgdata.data[i + 2] + 50
    //注：当前值大于255时将其赋值255
    imgdata.data[i + 1] = g > 255 ? 255 : g
    imgdata.data[i + 2] = b > 255 ? 255 : b
  }
  //将图像信息绘制第二个canvas中，注：一般只能在服务下运行
  canvasContext.putImageData(imgdata, 0, 0)
}
