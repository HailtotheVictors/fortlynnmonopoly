var cash = 1e6;
var getOutOfJailFree = 0;
var currentPos = 0;
var inJail = false;
var inLava = false;
var turnsStuck = 0;
var onMainTrack = true;
var roads = [];
var btnAdd, track;
roads[0] = {id:9,pos:22};
roads[1] = {id:24,pos:34};
roads[2] = {id:312,pos:10};
window.onload = function() {
  makeAllRows(); //run first
  installBtn = document.getElementById("installBtn");
  console.log(installBtn);
  addPromptListener();
  addInstallBtnListener();
  track = route.slice(0);
}

function makeAllRows() {
  var interstates = [];
  for (var i = 0; i < route.length; i++) {
    if (route[i].type == "prop") {
      makePropRow(route[i]);
    } else if (route[i].type == "inter") {
      interstates.push(route[i]);
    }
  }
  for (var j = 0; j < interstates.length; j++) {
    makePropRow(interstates[j]);
  }
}

function makePropRow(prop) {
  var newRow = document.createElement("DIV");
  newRow.classList.add("propRow");
  //add color group
  var newColor = document.createElement("DIV");
  newColor.classList.add("propGroup");
  newColor.style.background = prop.color;
  newRow.append(newColor);
  //add prop name
  var newName = document.createElement("DIV");
  newName.classList.add("propName");
  newName.innerHTML = prop.title;
  newRow.append(newName);
  //add svg
  var newSVG = document.createElementNS("http://www.w3.org/2000/svg","svg");
  newSVG.setAttribute("viewBox", "0 0 24 24");
  newSVG.setAttribute("role","button");
  newSVG.addEventListener("click",function() { toggleInfo(this) });
  newSVG.style.background = prop.color;
  var newPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  newPath.setAttribute("d","M7,10L12,15L17,10H7Z");
  newSVG.appendChild(newPath);
  newRow.appendChild(newSVG);
  //final appendage
  document.getElementsByClassName("card")[0].append(newRow);
}

function toggleInfo(elem) {
  var path = elem.children[0];
  var d = path.getAttribute("d");
  if (d == "M7,10L12,15L17,10H7Z") {
    path.setAttribute("d","M7,15L12,10L17,15H7Z");
  } else {
    path.setAttribute("d","M7,10L12,15L17,10H7Z");
  }
}

function rollDie() {
  var count = 0;
  var rolling = setInterval(function() {
    count++;
    var roll = Math.floor(Math.random() * 13);
    die.innerHTML = roll;
    if (count == 10) {
      clearInterval(rolling);
      rollDieTwo();
    }
  }, 100);
}

function rollDieTwo() {
  var roll = Math.floor(Math.random() * 50);
  var die = document.getElementById("die");
  if (onMainTrack === true) {
    if (roll < 49) {
      let distance = convertDieRoll(roll);
      let go = false;
      if (currentPos + distance > route.length - 1 || checkOverflow(currentPos + distance,route.length) == 0) {
        passedGo();
        go = true;
      }
      currentPos = checkOverflow(currentPos + distance,route.length);
      //check for new track
      if (currentPos == 6) {
        inJail = true;
        onMainTrack = 0;
        currentPos = 0;
        if (go == true) {
          setTimeout(function() { toJail(); }, 2500);
        } else {
          toJail();
        }
      } else if (currentPos == 24) {
        toLava();
      } else if (currentPos == 30) {
        onMainTrack = 1;
        currentPos = 0;
        document.getElementById("newSpace").innerHTML = "Go to Life";
      } else {
        document.getElementById("newSpace").innerHTML = "Go to " + route[currentPos].title;
      }
      die.innerHTML = distance;
    } else {
      var sel = Math.floor(Math.random() * 3);
      die.innerHTML = "I-" + roads[sel].id;
      var distance = currentPos - roads[sel].pos;
      if (distance < 0) {
        distance = distance + route.length;
      }
      if (distance > route.length - 1) {
        passedGo();
      }
      currentPos = roads[sel].pos;
      document.getElementById("newSpace").innerHTML = "Go to " + route[currentPos].title;
    }
    console.log(currentPos);
  } else {
    //on different track
    console.log('diff track');
    if (inJail === true || inLava === true) {
      //if stuck
      if (inJail === true && (convertDieRoll(roll) == 3 || convertDieRoll(roll) == 9)) {
        //freed from jail
        inJail = false;
        currentPos = 1;
      } else if (inLava === true && convertDieRoll(roll) > 8) {
        inLava = false;
        currentPos = 1;
      } else {
        //still stuck
        turnsStuck++;
        //if kicked out
        if (turnsStuck == 2) {
          if (inLava === true) {
            onBail();
          } else {
            changeBalance(-60000);
            currentPos = 1;
            inJail = false;
            document.getElementById("rollButton").style.width = "90%";
            document.getElementById("rollButton").innerHTML = "Roll Die";
            document.getElementById("payToLeave").style.display = "none";
          }
        }
      }
    } else {
      //if free
      var enterances = [10,22,34];
      var newPos = currentPos + convertDieRoll(roll);
      if (newPos > detours[onMainTrack].length - 1) {
        currentPos = checkOverflow(currentPos + convertDieRoll(roll) + enterances[onMainTrack] - detours[onMainTrack].length,route.length);
        document.getElementById("newSpace").innerHTML = "Go to " + route[currentPos].title;
        onMainTrack = true;
      } else {
        currentPos += convertDieRoll(roll);
        document.getElementById("newSpace").innerHTML = "Go to " + detours[onMainTrack][currentPos].title;
      }
    }
    die.innerHTML = convertDieRoll(roll);
  }
}

function onBail() {
  if (inJail === true) {
    changeBalance(-30000);
    currentPos = 1;
    inJail = false;
  } else if (inLava === true) {
    changeBalance(-50000);
    currentPos = 1;
    inLava = false;
  }
  document.getElementById("rollButton").style.width = "90%";
  document.getElementById("rollButton").innerHTML = "Roll Die";
  document.getElementById("payToLeave").style.display = "none";
}

function toJail() {
  document.getElementById("newSpace").innerHTML = "You're in Jail";
  document.getElementById("rollButton").style.width = "42.5%";
  document.getElementById("rollButton").innerHTML = "Roll to Leave";
  document.getElementById("payToLeave").style.display = "block";
  //announcement
  var parent = document.getElementById("goCeleb");
  var kids = parent.children;
  var text = ["You're","In","Jail!"];
  for (var i = 0; i < kids.length; i++) {
    kids[i].style.display = "none";
    kids[i].innerHTML = text[i];
  }
  announce();
}

function toLava() {
  inLava = true;
  onMainTrack = 2;
  currentPos = 0;
  document.getElementById("newSpace").innerHTML = "Go to Lava Pit";
  document.getElementById("rollButton").style.width = "42.5%";
  document.getElementById("rollButton").innerHTML = "Roll to Leave";
  document.getElementById("payToLeave").style.display = "block";
  //announcement
  var parent = document.getElementById("goCeleb");
  var kids = parent.children;
  var text = ["You're","In","Lava!"];
  for (var i = 0; i < kids.length; i++) {
    kids[i].style.display = "none";
    kids[i].innerHTML = text[i];
  }
  announce();
}

function passedGo() {
  changeBalance(1e6 / 10);
  var parent = document.getElementById("goCeleb");
  var kids = parent.children;
  var text = ["You","Passed","Go!"];
  for (var i = 0; i < kids.length; i++) {
    kids[i].style.display = "none";
    kids[i].innerHTML = text[i];
  }
  announce();
}

function announce() {
  var parent = document.getElementById("goCeleb");
  parent.style.display = "block";
  var kids = parent.children;
  var iter = 0;
  var show = setInterval(function() {
    kids[iter].style.display = "block";
    iter++;
    if (iter == 3) {
      clearInterval(show);
      setTimeout(function() {
        parent.style.display = "none";
      }, 1300);
    }
  }, 400);
}

function changeBalance(amount) {
  cash += amount;
  var bal = document.getElementById("balance").children[0];
  var iter = -1;
  var animate = setInterval(function() {
    iter++;
    if (iter < 10) {
      bal.style.opacity = 1 - 0.1 * iter;
    } else if (iter == 10) {
      bal.innerHTML = convertDollars(cash)
    } else {
      bal.style.opacity = 0.1 * iter;
    }
    if (iter == 20) {
      clearInterval(animate);
    }
  }, 35);
}

//resources

function convertDieRoll(num) {
  if (num <= 12) {
    return num % 13;
  } else if (num <= 23) {
    return preventZero((num - 12) % 11,11);
  } else if (num <= 32) {
    return preventZero((num - 23) % 9,9) + 1;
  } else if (num <= 39) {
    return preventZero((num - 32) % 7,7) + 2;
  } else if (num <= 44) {
    return preventZero((num - 39) % 5,5) + 3;
  }  else if (num <= 47) {
    return preventZero((num - 44) % 3,3) + 4;
  }
  return 6;
}

function preventZero(num,fall) {
  if (num == 0) {
    return fall;
  }
  return num;
}

function checkOverflow(num,lim) {
  if (num >= lim) {
    return num - lim;
  } else if (num < 0) {
    return 0;
  }
  return num;
}

function convertDollars(num) {
  if (num < 1000) {
    return "$" + num;
  } else if (num < 1e6) {
    return "$" + Math.round(num / 1e3) + "K";
  } else {
    return "$" + (num / 1e6).toFixed(3) + "M";
  }
}

function goTo(num,name) {
  var cards = document.getElementsByClassName(name);
  for (var i = 0; i < cards.length; i++) {
    if (i == num) {
      cards[i].style.display = "block";
    } else {
      cards[i].style.display = "none";
    }
  }
}
