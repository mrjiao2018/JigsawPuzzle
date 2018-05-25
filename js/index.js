/**
 * 声明全局变量boxNumber, 用于控制生成几宫格，gameDifficulty游戏难度，gamePattern游戏模式
 */
var boxNumber = 9, gameDifficulty = "easy", gamePattern = "number";

/**
 * 声明全局变量boxPosition，为数组，用于记录每个Box的位置
 */
var boxPosition;

/**
 * 声明全局变量moveCount，用于记录步数
 */
var moveCount = 0;

/**
 * 下拉框绑定函数，设置boxNumber并生成游戏界面
 */
function selectChange() {
    var $select = $("select");
    $select.change(function() {
        //初始化BoxNumber
        boxNumber = parseInt($select.eq(0).find("option:selected").val());
        gameDifficulty = $select.eq(1).find("option:selected").val();
        //生成宫格
        generate();
    });
    
}

/**
 * 生成游戏界面
 * 
 */
function generate() {
    remove();
    generateBoxPositionArr();
    generateInOrder();
    setTimeout(function(){
        arrangeAtRandom();
        moveWhenClick();
    }, 100);
}

/**
 * 删除之前container中所有的Box
 */
function remove() {
    var $container = $("#container");
    $container.empty();
}

/**
 * 初始化boxPosition数组
 */
function generateBoxPositionArr() {
    //初始化BoxPosition数组
    boxPosition = new Array(boxNumber);
    for(var i = 0; i < boxNumber; ++i) {
        boxPosition[i] = i;
    }
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
 * 
 * @return [top, left] 每个box的top值和left值
 */
function getTopAndLeft(x, y, sideLength) {
    var top = x * sideLength + 2 * (x + 1);
    var left = y * sideLength + 2 * (y + 1);
    return [top, left];
}

/**
 * 根据boxNumber获取每个宫格的边长
 * 
 * @return sideLength 边长
 */
function getSideLength() {
    var sqrt = parseInt(Math.sqrt(boxNumber));
    var boxInterval = sqrt + 1;
    var sideLength = parseFloat((100 - (boxInterval * 2))/sqrt);
    return sideLength;
}

/**
 * 将宫格随机打乱
 * 
 */
function arrangeAtRandom() {
    var difficulty;
    if(gameDifficulty == "easy")
        difficulty = 10;
    else if(gameDifficulty == "simple")
        difficulty = 50;
    else if(gameDifficulty == "hard")
        difficulty = 200;
    for(var i = 0; i < difficulty; ++i) {
        //获取当前可移动的box
        var $specialBox = $("#specialBox");
        var specialBoxIndexInHtml = $(".box").index($specialBox);
        var specialBoxIndexInArr = boxPosition[specialBoxIndexInHtml];
        var surroundBoxIndex = new Array(4);
        var sqrt = parseInt(Math.sqrt(boxNumber));
        surroundBoxIndex[0] = (specialBoxIndexInArr >= sqrt) ? (specialBoxIndexInArr - sqrt) : (-1);          //具体解释见getMoveDirection()函数
        surroundBoxIndex[1] = ((specialBoxIndexInArr + 1) % sqrt != 0) ? (specialBoxIndexInArr + 1) : (-1);
        surroundBoxIndex[2] = (specialBoxIndexInArr <= (boxNumber - sqrt)) ? (specialBoxIndexInArr + sqrt) : (-1);
        surroundBoxIndex[3] = (specialBoxIndexInArr % sqrt != 0) ? (specialBoxIndexInArr - 1) : (-1);
        //随机选取一个移动
        var randomIndexInArr = -1, randomIndexInHtml;
        while (randomIndexInArr == -1) {
            var random = parseInt(Math.random() * surroundBoxIndex.length);
            randomIndexInArr = surroundBoxIndex[random];
        }
        for (var j = 0; j < boxNumber; ++j)
            if(randomIndexInArr == boxPosition[j])
                randomIndexInHtml = j;
        move($(".box").eq(randomIndexInHtml), false);
    }
}

/**
 * 在用户的点击下移动box
 */
function moveWhenClick() {
    var $box = $(".box");
    for (var i = 0; i < boxNumber; ++i) {
        var moveBox = $box[i];
        //触发点击事件
        moveBox.onclick = function () {
            move($(this), true);
        }
    }
}

/**
 * 判断指定box是否可以移动在可以移动的情况下移动box
 * 
 * @param $moveBox 要移动的box对象; isClicked 是否是用户点击
 */
function move($moveBox, isClicked) {
    var moveDirectionNumber = getMoveDirection($moveBox);               //获得移动方向
    if (moveDirectionNumber) {                                          //根据移动方向的值检查是否满足移动条件
        var specialBox = $("#specialBox").get(0);                       //获取特殊占位box
        var top = parseFloat($moveBox.get(0).style.top);                  //获取当前点击的box的相关属性
        var left = parseFloat($moveBox.get(0).style.left);
        var sideLength = parseFloat($moveBox.get(0).style.width);

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
        var boxIndexInHtml = $(".box").index($moveBox);
        var boxIndexInArr = boxPosition[boxIndexInHtml];
        var specialBoxIndexInHtml = $(".box").index($("#specialBox"));
        var specialBoxIndexInArr = boxPosition[specialBoxIndexInHtml];
        boxPosition[boxIndexInHtml] = specialBoxIndexInArr;
        boxPosition[specialBoxIndexInHtml] = boxIndexInArr;

        //对用户点击进行处理
        if (isClicked) {                 
            //记录移动步数
            ++moveCount;
            showSteps();
            //检查最终结果
            check();
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
    //获取到指定moveBox在html中和在数组中的位置索引
    var boxIndexInHtml = $(".box").index($moveBox);
    var boxIndexInArr = boxPosition[boxIndexInHtml];
    //获取指定movebox上右下左box中的数字
    var surroundBoxIndex = new Array(4);
    var sqrt = parseInt(Math.sqrt(boxNumber));
    surroundBoxIndex[0] = (boxIndexInArr >= sqrt) ? (boxIndexInArr - sqrt) : (-1);              //若moveBox在第一行，则不可以向上移动
    surroundBoxIndex[1] = ((boxIndexInArr + 1) % sqrt != 0) ? (boxIndexInArr + 1) : (-1);       //若moveBox在最后一列，则不可以向右移动
    surroundBoxIndex[2] = (boxIndexInArr <= (boxNumber - sqrt)) ? (boxIndexInArr + sqrt) : (-1);    //若moveBox在最后一行，则不可以向下移动
    surroundBoxIndex[3] = (boxIndexInArr % sqrt != 0) ? (boxIndexInArr - 1) : (-1);             //若moveBox在第一列，则不可以向左移动
    //将surroundBoxIndex中的值与specialBox比较，若相等则代表当前$moveBox可以移动，返回移动方向
    for (var i = 0; i < 4; ++i) {
        if (surroundBoxIndex[i] != -1) {                                //判断surroundBoxIndex是否越界
            var specialBoxIndexInHtml = $(".box").index($("#specialBox"));
            var specialBoxIndexInArr = boxPosition[specialBoxIndexInHtml];
            if (surroundBoxIndex[i] == specialBoxIndexInArr) {          //判断周围box是否为specialBox
                return i + 1;
            }
        }
    }
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
    playVoice("media/1.mp3");
    setTimeout(function(){
        alert("Congradulation！！！You succeed!!! Your steps is " + moveCount);
        moveCount = 0;
    }, 200);
}

function playVoice(file) {
    $('#voice').html('<audio controls="controls" id="audio_player" style="display:none;"> <source src="' + file + '" > </audio><embed id="MPlayer_Alert" src="' + file + '" loop="false" width="0px" height="0px" /></embed>');
}

/**
 * 重置函数
 */
function reset() {
    var $resetButton = $("#reset");
    var $randomResetBotton = $("#randomReset");
    $resetButton.click(function() {
        //todo
        runTest();
        moveCount = 0;
        showSteps();
    });
    $randomResetBotton.click(function() {
        var boxNumberArr = [9, 16, 25];
        var gameDifficultyArr = ["easy", "simple", "hard"];
        var gamePatternArr = ["number", "img"];
        var random1, random2, random3;
        random1 = parseInt(Math.random()*3);
        random2 = parseInt(Math.random()*3);
        random3 = parseInt(Math.random()*2);
        boxNumber = boxNumberArr[random1];
        gameDifficulty = gameDifficultyArr[random2];
        gamePattern = gamePatternArr[random3];
        runTest();
        moveCount = 0;
        showSteps();
        var $select = $("select");
        //todo
    });
}

/**
 * 展示移动步数函数
 */
function showSteps() {
    var moveCountSpan = $("#showSteps span");
    moveCountSpan.text(moveCount);
}

/**
 * 测试函数
 */
function runTest() {
    //首次加载时，默认生成数字模式九宫格简单难度
    generate();

    //用户改变select值
    selectChange();

    //用户重置
    reset();
}

/**
 * 启动函数
 */
$(document).ready(function() {
    runTest();
});