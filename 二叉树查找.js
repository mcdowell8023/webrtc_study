var value = process.argv[process.argv.length - 1]
// code start
var sum = []
var iNumber = 0
while (iNumber < 100) {
  iNumber++
  sum.push(iNumber)
}

var len = sum.length
function findNum() {
  var count = 0
  for (let i = 0; i < len; i++) {
    count++
    if (value == sum[i]) {
      console.log(count, 'count')
      console.log('简单查找--找到你说的数字了', i)
      break
    }
  }
  return null
}

/**
 * @description: 二分查找 （二叉树） 仅适用于 有序数列
 * 仅当列表是有序的时候，二分查找才管用。例如，电话簿中的名字是按字母顺序排列的， 因此可以使用二分查找来查找名字。
 * @param {type}
 * @return:
 */
function binarySearch(value, arr) {
  var min = 0
  var max = arr.length - 1
  var mid = 0
  var count = 0

  while (min <= max) {
    count++
    mid = parseInt((min + max) / 2)
    if (value < arr[mid]) {
      max = mid - 1
    } else if (value > arr[mid]) {
      min = mid + 1
    } else if (value == arr[mid]) {
      // console.log(count, '次，找到了这个数是：', arr[mid])
      return { count, value: arr[mid] }
      break
    }
  }
  return null
  // console.log('----')
}

console.log('结果：', binarySearch(value, sum))
