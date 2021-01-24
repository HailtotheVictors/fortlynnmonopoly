window.onload = function() {
  document.getElementById('container').style.height = `${window.innerHeight - 100}px`;
  props = props.concat(mainProperties);
  if (getCookie('expansions')) {
    var u = JSON.parse(getCookie('expansions'));
    var c = document.getElementsByName('expansion');
    for (let i = 0; i < c.length; i++) {
      if (u[i] == 0) {
        c[i].checked == true;
      }
    }
    initGame();
  }
}

var players = [];
var props = [];
var houses = [];
houses[0] = 'M11,10H13V16H11V10M22,12H19V20H5V12H2L12,3L22,12M15,10A2,2 0 0,0 13,8H11A2,2 0 0,0 9,10V16A2,2 0 0,0 11,18H13A2,2 0 0,0 15,16V10Z';
houses[1] = 'M12,3L2,12H5V20H19V12H22L12,3M10,8H14V18H12V10H10V8Z';
houses[2] = 'M12,3L2,12H5V20H19V12H22L12,3M9,8H13A2,2 0 0,1 15,10V12A2,2 0 0,1 13,14H11V16H15V18H9V14A2,2 0 0,1 11,12H13V10H9V8Z';
houses[3] = 'M12,3L22,12H19V20H5V12H2L12,3M15,11.5V10C15,8.89 14.1,8 13,8H9V10H13V12H11V14H13V16H9V18H13A2,2 0 0,0 15,16V14.5A1.5,1.5 0 0,0 13.5,13A1.5,1.5 0 0,0 15,11.5Z';
houses[4] = 'M12,3L2,12H5V20H19V12H22L12,3M11,8H15V10H11V16H13V12H15V16C15,17.11 14.1,18 13,18H11A2,2 0 0,1 9,16V10C9,8.89 9.9,8 11,8Z';
houses[5] = 'M12,3L2,12H5V20H19V12H22L12,3M9,8H11V16H15V18H9V8Z';

class Player {
  constructor(name,card) {
    this.bal = 1e6;
    this.name = name;
    this.props = [];
    this.card = card;
  }
}

function initGame() {
  var c = document.getElementsByName('expansion');
  var x = [planesAndTrainsProps,spaceProps,americaProps];
  var u = [0,0,0];
  for (let i = 0, p = x[0], e = c[0]; i < c.length; i++, p = x[i], e = c[i]) {
    if (e.checked) {
      props = props.concat(p);
      u[i] = 1;
    }
  }
  document.cookie = `expansions=${JSON.stringify(u)}`;
  document.getElementById('initGame').style.display = 'none';
  document.getElementById('initPlayers').style.display = 'block';
  for (let prop of props) {
    buildPropRow(prop);
  }
}

function addPlayer() {
  //nfc scan
}

function goToPage(num) {
  var pages = document.getElementsByClassName('page');
  for (let page of pages) {
    page.style.display = 'none';
  }
  pages[num].style.display = 'block';
  var par = document.getElementById('dock');
  for (let child of par.children) {
    child.classList.remove('viewing');
  }
  par.children[num].classList.add('viewing');
}

function buildPropRow(prop) {
  var newRow = buildElem('DIV','propRow',undefined,document.getElementsByClassName('page')[4]);
  var newTop = buildElem('DIV','propTop',undefined,newRow);
  var newColor = buildElem('DIV','propColor',undefined,newTop);
  newColor.style.backgroundColor = prop.color;
  buildElem('DIV','propName',prop.name,newTop);
  if (prop.interstate != true && prop.airport != true) {
    var newHouse = buildSVG(houses[0],'propBtn','Development',newTop);
    newHouse.classList.add('disabled');
  }
  var d = 'M3,6H21V18H3V6M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M7,8A2,2 0 0,1 5,10V14A2,2 0 0,1 7,16H17A2,2 0 0,1 19,14V10A2,2 0 0,1 17,8H7Z';
  var newRent = buildSVG(d,'propBtn','Charge Rent',newTop,true);
  var dx = 'M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z';
  var newInfo = buildSVG(dx,'propBtn','More Info',newTop,true);
  newInfo.addEventListener('click',function() { this.parentElement.nextElementSibling.classList.toggle('propTog'); } );
  var newBot = buildElem('DIV','propBot',undefined,newRow);
  newBot.classList.add('propTog');
  var newTable = buildElem('TABLE','propTable',undefined,newBot);
  var rows = [];
  if (prop.interstate != true && prop.airport != true) {
    rows[0] = ['Owner:','None','Price:',renderPrice(prop.price * 1e3)];
    rows[1] = ['Rent:',renderPrice(prop.rent[0] * 1e3),'1 House:',renderPrice(prop.rent[1] * 1e3)];
    rows[2] = ['2 Houses:',renderPrice(prop.rent[2] * 1e3),'3 Houses:',renderPrice(prop.rent[3] * 1e3)];
    rows[3] = ['4 Houses:',renderPrice(prop.rent[4] * 1e3),'Hotel:',renderPrice(prop.rent[5] * 1e3)];
    rows[4] = ['HC&MV:',renderPrice(prop.house * 1e3),'HTC:',renderPrice(prop.hotel * 1e3)];
    rows[5] = ['Group:',prop.group,'Abbr:',prop.abbr];
  } else {
    rows[0] = ['Owner:','None','Price:',renderPrice(prop.price * 1e3)];
    rows[1] = ['Group',prop.group,'Abbr:',prop.abbr];
  }
  for (let row of rows) {
    var newRow = newTable.insertRow();
    for (let cell of row) {
      var newCell = newRow.insertCell();
      newCell.textContent = cell;
    }
  }
}

//resources

function buildElem(tag,group,text,parent) {
  let elem = document.createElement(tag);
  if (group) {
    elem.classList.add(group);
  }
  if (text) {
    elem.textContent = text;
  }
  if (parent) {
    parent.append(elem);
  }
  return elem;
}

function buildSVG(d,g,t,par,btn) {
  var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  var path = document.createElementNS('http://www.w3.org/2000/svg','path');
  path.setAttribute('d',d);
  svg.append(path);
  if (t) {
    var title = document.createElementNS('http://www.w3.org/2000/svg','title');
    title.textContent = t;
    svg.append(title);
  }
  if (g) {
    svg.classList.add(g);
  }
  if (btn) {
    svg.setAttribute('role','button');
  }
  svg.setAttribute('viewBox','0 0 24 24');
  par.append(svg);
  return svg;
}

function ceilToPlace(num,place) {
  return Math.ceil(num / Math.pow(10,place - 1)) * Math.pow(10,place - 1);
}

function roundToPlace(num,place) {
  return Math.round(num / Math.pow(10,place - 1)) * Math.pow(10,place - 1);
}

function renderPrice(val) {
  if (val < 0) {
    val = Math.abs(val);
    if (val < 1e3) {
      return `-$${val}`;
    } else if (val < 1e6) {
      return `-$${Math.round(val/1e3)}K`;
    } else {
      return `-$${(val / 1e6).toFixed(3)}M`;
    }
  }
  if (val < 1e3) {
    return `$${val}`;
  } else if (val < 1e6) {
    return `$${Math.round(val/1e3)}K`;
  } else {
    return `$${(val / 1e6).toFixed(3)}M`;
  }
}

function getCookie(cname) {
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length,c.length);
    }
  }
  return '';
}

function secStr() {
  var str = '';
  for (let i = 0; i < 36; i++) {
    str += Math.floor(Math.random() * 36).toString(36);
  }
  return str;
}
