/*
 *每个卡片项目对应的类名数组 cardsClassNameArray
 */
var cardsClassNameArray = [
  'fa-anchor',
  'fa-anchor',
  'fa-bicycle',
  'fa-bicycle',
  'fa-bolt',
  'fa-bolt',
  'fa-bomb',
  'fa-bomb',
  'fa-cube',
  'fa-cube',
  'fa-diamond',
  'fa-diamond',
  'fa-leaf',
  'fa-leaf',
  'fa-paper-plane-o',
  'fa-paper-plane-o'
];

/*
 *获取DOM
 */
const moves = document.getElementsByClassName('moves');
const seconds = document.getElementsByClassName('seconds');
const restart = document.getElementsByClassName('restart');

let cards = document.getElementsByClassName('card');
let stars = document.getElementsByClassName('stars');
let stars1 = stars[0];
let stars2 = stars[1];

const deck = document.getElementsByClassName('deck');

const finalShow = document.getElementsByClassName('finalShow');
const playAgain = document.getElementsByClassName('play-again');

let currentClick = 0; // 当前游戏局中点击卡片的次数
let bothCardsIn = []; // 用来暂时存放当前需要对比的两张卡片的数组
let cardMates = 0; // 匹配成功的对数

let sivId; //计时器setInterval的ID

/*
 *页面载入后立即执行事件
 *及
 *0级事件
 */
resetAll();
cardClick();
// 点击restart重置游戏
restart[0].onclick = resetAll;
// 点击再玩一次按钮
playAgain[0].onclick = fnPlayAgain;

/*
 *封装的方法
 */
// addClass-添加类
function addClass(ele, cls) {
  if (!ele.className.includes(cls)) {
    ele.className = ele.className == ''
      ? cls
      : ele.className + ' ' + cls;
  }
}
// removeClass-移除类
function removeClass(ele, cls) {
  if (ele.className.includes(cls)) {
    let thisClassName = ele.className.split('');
    if (ele.className.indexOf(cls) != 0) {
      thisClassName.splice(ele.className.indexOf(cls) - 1, cls.length + 1);
    } else {
      thisClassName.splice(ele.className.indexOf(cls), cls.length);
    }
    ele.className = thisClassName.join('');
  }
}
// 移除星星
function removeStar(star) {
  star.removeChild(star.childNodes[0]);
};

/*
 *Shuffle-洗牌
 */
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

/*
 *resetAll重置游戏
 */
function resetAll() {
  // 洗牌
  shuffle(cardsClassNameArray);

  // 步数重置为0
  moves[0].innerText = 0;
  moves[1].innerText = 0;
  // 时间重置为0
  seconds[0].innerText = 0;
  seconds[1].innerText = 0;
  // 清除计时器
  if (sivId) {
    clearInterval(sivId);
  }

  //卡片内子项重置
  for (var i = 0; i < cards.length; i++) {
    cards[i].innerHTML = `<i class="fa ${cardsClassNameArray[i]}"></i>`;
    cards[i].className = "card";
  }

  currentClick = 0; // 点击次数重置为0
  bothCardsIn = []; // 匹配队列清空
  cardMates = 0; // 匹配成功对数重置为0

  // 计分栏和游戏结算页面的星星均重置为3颗
  stars1.innerHTML = "<li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li>";
  stars2.innerHTML = "<li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li>";
}

/*
 *游戏结束后，点击弹出框中的“再玩一次”触发的方法
 */
function fnPlayAgain() {
  resetAll();
  finalShow[0].className = "finalShow finalShowOutUI";
  setTimeout(function() {
    finalShow[0].className = "finalShow";
    finalShow[0].style.top = "-2000px";
  }, 1000);
}

/*
 *点击卡片(实现游戏逻辑最主要的方法)
 */
function cardClick() {
  let card1,
    card2; // 两张所需对比的卡片
  let classIn1,
    classIn2; // 存放所需判定卡片的对应的类名
  for (var i = 0; i < cards.length; i++) {
    cards[i].onclick = function() {
      // 当卡片不处于被翻开或者已判定为匹配的时候才能被点击触发事件
      // if (!this.className.includes("show") && !this.className.includes("open") && !this.className.includes("match") && !this.className.includes("dismatch"))
      if (this.className === "card") {
        currentClick++; //点击次数计数+1

        // 点击次数由0变为1时，开始计时
        if (currentClick == 1) {
          sivId = setInterval(function() {
            seconds[0].innerText++;
          }, 1000)
        }
        // 14步以下完成为3星，14步（含14步）至20步（不含20步）为2星，20步及以上为1星
        if (currentClick == 28) {
          // stars[0].removeChild(stars[0].childNodes[1]);
          // stars[1].removeChild(stars[1].childNodes[1]);
          removeStar(stars[0]);
          removeStar(stars[1]);
        } else if (currentClick == 40) {
          // stars[0].removeChild(stars[0].childNodes[1]);
          // stars[1].removeChild(stars[1].childNodes[1]);
          removeStar(stars[0]);
          removeStar(stars[1]);
        }

        addClass(this, "show");
        addClass(this, "open");
        // 用来对比的列表满了2张则清空，准备下一次存放匹配卡片
        if (bothCardsIn.length == 2) {
          bothCardsIn = [];
        }

        // 两次点击为1次move
        if (currentClick % 2 == 0) {
          moves[0].innerText = currentClick / 2;
          moves[1].innerText = currentClick / 2;
        }

        bothCardsIn[(currentClick + 1) % 2] = this.childNodes[0];

        // 点击次数为偶数时，开始判定
        if (bothCardsIn.length == 2) {
          card2 = this;
          classIn2 = this.childNodes[0].className.substr(3);
          if (classIn1 == classIn2) {
            // 匹配成功
            removeClass(card1, "open");
            removeClass(card2, "open");
            addClass(card1, "match");
            addClass(card2, "match");

            // 匹配成功对数计数加1
            cardMates++;
            // 确认是否完成游戏（是否全部匹配完成，匹配成功的对数为卡片数量的1/2时完成游戏）
            if (cardMates == cardsClassNameArray.length / 2) {
              // 游戏完成时，计时器暂停运行
              if (sivId) {
                clearInterval(sivId);
                //将计分栏的时间赋值到游戏最终得分界面的时间结算
                seconds[1].innerText = seconds[0].innerText;
              }
              setTimeout(function() {
                finalShow[0].className = "finalShow finalShowUI";
                finalShow[0].style.top = "50%";
              }, 500);
            }
          } else {
            // 匹配失败
            removeClass(card1, "open");
            removeClass(card2, "open");
            addClass(card1, "dismatch");
            addClass(card2, "dismatch");
            // 不匹配，让卡片复原
            if (this.className.includes("show") || this.className.includes("dismatch")) {
              let timeOutCard1 = card1;
              let timeOutCard2 = card2;
              setTimeout(function() {
                removeClass(timeOutCard1, "dismatch");
                removeClass(timeOutCard2, "dismatch");
                removeClass(timeOutCard1, "show");
                removeClass(timeOutCard2, "show");
              }, 1000)
            }
          }
        } else if (bothCardsIn.length == 1) {
          // 点击次数为奇数时
          card1 = this;
          classIn1 = this.childNodes[0].className.substr(3);
        }
      }
    }
  }
}
