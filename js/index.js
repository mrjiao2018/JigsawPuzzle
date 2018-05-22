/**
 * 声明全局变量boxNumber, 用于控制生成几宫格，此后基本每个函数都要用到boxNumber，因此声明为全局变量
 */
var boxNumber;

/**
 * 声明全局变量boxPosition，为数组，用于记录每个Box的位置
 */
var boxPosition;

/**
 * 下拉框绑定函数，设置boxNumber并生成游戏界面
 */
function start() {
    var $select = $("select");
    $select.change(function() {
        //初始化BoxNumber
        var selectText = $("select option:selected").text();
        boxNumber = parseInt(selectText);
        //初始化BoxPosition数组
        boxPosition = new Array(boxNumber);
        for(var i = 0; i < boxNumber; ++i) {
            boxPosition[i] = i;
        }
        //生成宫格
        generate();
    });
    
}

/**
 * 生成游戏界面
 */
function generate() {
    remove();
    generateInOrder();
    arrangeAtRandom();
}

/**
 * 删除之前container中所有的Box
 */
function remove() {
    var $container = $("#container");
    $container.empty();
}

/**
 * 按照次序生成宫格
 */
function generateInOrder() {
    var $container = $("#container");
    var sideLength = getSideLength();                                 //获得box的边长，确定boxNumber的情况下加载一次即可
    for (var i = 0; i < boxNumber; ++i) {
        var $div;
        var x = parseInt(i / Math.sqrt(boxNumber));                   //获得box的x轴坐标
        var y = i % Math.sqrt(boxNumber);                             //获得box的y轴坐标
        $div = $("<div class=\"box\">" + (i + 1) + "</div>");
        $div.css({ "height": sideLength + "%", "width": sideLength + "%" });
        $div.css({ "top": getTopAndLeft(x, y, sideLength)[0] + "%", "left": getTopAndLeft(x, y, sideLength)[1] + "%" });
        $container.append($div);
    }
    //将最后一个宫格隐藏，用于位置交换
    $(".box:last").attr("id", "specialBox");
}

/**
 * 获取每个box的top值和left值
 */
function getTopAndLeft(x, y, sideLength) {
    var top = x * sideLength + 2 * (x + 1);
    var left = y * sideLength + 2 * (y + 1);
    return [top, left];
}

/**
 * 根据boxNumber获取每个宫格的边长
 */
function getSideLength() {
    var sqrt = parseInt(Math.sqrt(boxNumber));
    var boxInterval = sqrt + 1;
    var sideLength = parseFloat((100 - (boxInterval * 2))/sqrt);
    return sideLength;
}

/**
 * 将宫格随机打乱
 */
function arrangeAtRandom() {

}

/**
 * 在用户的点击下移动box
 */
function moveWhenClick() {

}

/**
 * 判断指定box是否可以移动在可以移动的情况下移动box
 * 
 * @param $moveBox 要移动的box对象; isClicked 是否是用户点击
 */
function move($moveBox, isClicked) {
    var moveDirectionNumber = getMoveDirection($moveBox);       //获得移动方向
    if (moveDirectionNumber) {                              //根据移动方向的值检查是否满足移动条件
        var specialBox = $("#specialBox").get(0);           //获取特殊占位box
        var top = parseInt($moveBox.get(0).style.top);                 //获取当前点击的box的相关属性
        var left = parseInt($moveBox.get(0).style.left);
        var sideLength = parseInt($moveBox.get(0).style.width);

        //根据不同的移动方向来移动元素
        if (moveDirectionNumber == 1)
            top = top - sideLength - 2;
        else if (moveDirectionNumber == 2)
            left = left + sideLength + 2;
        else if (moveDirectionNumber == 3)
            top = top + sideLength + 2;
        else
            left = left - sideLength - 2;
        $moveBox.get(0).style.top = top + "%";
        $moveBox.get(0).style.left = left + "%";

        //在数组中将两个box交换位置

        if (isClicked) {                 //判断是否是用户点击
            //记录移动步数
            ++moveCount;
            showSteps(moveCount);
            //检查最终结果
            check(moveCount);
        }
    }
}

/**
 * 获取当前元素可以移动的方向
 * 
 * @param $moveBox 移动的盒元素
 * @return 0，1，2，3，4 分别代表不能移动、上、右、下、左
 */
function getMoveDirection($moveBox) {
    //获取到指定moveBox的索引

    //获取指定movebox上右下左box中的数字

    //将surroundBoxIndex中的值与specialBox比较，若相等则代表当前$moveBox可以移动，返回移动方向

    return 0;
}

/**
 * 检查移动结果
 */
function check() {
    for(var i = 0; i < boxNumber; ++i) {
        if(boxPosition[i] != i)
            return false;
    }
    return true;
}

/**
 * 展示移动函数
 */
function showSteps() {

}

/**
 * 测试函数
 */
function runTest() {
    //首次加载时，默认生成九宫格
    boxNumber = 9;
    generate();
    //用户改变select值
    start();
}

/**
 * 启动函数
 */
$(document).ready(function() {
    runTest();
});