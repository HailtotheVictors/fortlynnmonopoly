window.onload = function() {
  document.getElementById('container').style.height = `${window.innerHeight - 100}px`;
  props = props.concat(mainProperties);
  if (getCookie('expansions')) {
    var u = JSON.parse(getCookie('expansions'));
    initGame(u);
  }
  if (getCookie('init')) {
    initBal = getCookie('init');
  }
  if (getCookie('players')) {
    var list = JSON.parse(getCookie('players'));
    for (let player of list) {
      makePlayerRow(player);
      players.push(player);
    }
  }
  if (getCookie('launched') == 'true') {
    document.cookie = 'launched=true';
    launched = 'true';
    document.getElementById('gameBtn').style.color = 'red';
  }
  add();
}

window.onresize = function() {
  document.getElementById('container').style.height = `${window.innerHeight - 100}px`;
}

var players = [];
var props = [];
var houses = [];
var expansions = [];
var initBal = 0;
var playerLim = 8;
var launched = 'false';
houses[0] = 'M11,10H13V16H11V10M22,12H19V20H5V12H2L12,3L22,12M15,10A2,2 0 0,0 13,8H11A2,2 0 0,0 9,10V16A2,2 0 0,0 11,18H13A2,2 0 0,0 15,16V10Z';
houses[1] = 'M12,3L2,12H5V20H19V12H22L12,3M10,8H14V18H12V10H10V8Z';
houses[2] = 'M12,3L2,12H5V20H19V12H22L12,3M9,8H13A2,2 0 0,1 15,10V12A2,2 0 0,1 13,14H11V16H15V18H9V14A2,2 0 0,1 11,12H13V10H9V8Z';
houses[3] = 'M12,3L22,12H19V20H5V12H2L12,3M15,11.5V10C15,8.89 14.1,8 13,8H9V10H13V12H11V14H13V16H9V18H13A2,2 0 0,0 15,16V14.5A1.5,1.5 0 0,0 13.5,13A1.5,1.5 0 0,0 15,11.5Z';
houses[4] = 'M12,3L2,12H5V20H19V12H22L12,3M11,8H15V10H11V16H13V12H15V16C15,17.11 14.1,18 13,18H11A2,2 0 0,1 9,16V10C9,8.89 9.9,8 11,8Z';
houses[5] = 'M12,3L2,12H5V20H19V12H22L12,3M9,8H11V16H15V18H9V8Z';

//nfc

function add() {
  document.getElementById('scanBtn').addEventListener("click", async () => {
    log("User clicked scan button");
    try {
      const ndef = new NDEFReader();
      await ndef.scan();
      log("> Scan started");
      ndef.addEventListener("readingerror", () => {
        log("Argh! Cannot read data from the NFC tag. Try another one?");
      });
      ndef.addEventListener("reading", ({ message, serialNumber }) => {
        log(`> Serial Number: ${serialNumber}`);
        log(`> Records: (${message.records.length})`);
      });
    } catch (error) {
      log("Argh! " + error);
    }
  });
  // writeButton.addEventListener("click", async () => {
  //   log("User clicked write button");
  
  //   try {
  //     const ndef = new NDEFReader();
  //     await ndef.write("Hello world!");
  //     log("> Message written");
  //   } catch (error) {
  //     log("Argh! " + error);
  //   }
  // });
}

async function initScan() {
  if (document.getElementById('playerName').value == '') {
    return;
  }
  log('V1.1.4');
  try {
    const ndef = new NDEFReader();
    await ndef.scan();
    log("> Scan started");
    ndef.addEventListener("readingerror", () => {
      log("Argh! Cannot read data from the NFC tag. Try another one?");
    });
    ndef.addEventListener("reading", ({ message, serialNumber }) => {
      log(`> Serial Number: ${serialNumber}`);
      log(`> Records: (${message.records.length})`);
      initScanB(message);
    });
  } catch (error) {
    log("Argh! " + error);
  }
}

async function initScanB(data) {
  log(JSON.stringify(data));
  log(JSON.stringify(data.records[0]));
  //console.log(data);
  try {
    const ndef = new NDEFReader();
    let id = secStr();
    let newPlayer = new Player(document.getElementById('playerName').value,id,data.color);
    log(JSON.stringify(newPlayer));
    players.push(newPlayer);
    let obj = {color:data.color,id:id};
    log(`obj:${JSON.stringify(obj)}`);
    await ndef.write(JSON.stringify(obj));
    log("> Message written");
  } catch (error) {
    log("Arghx! " + error);
  }
}

async function initScanC() {
  //console.log(data);
  try {
    const ndef = new NDEFReader();
    await ndef.write('hello');
    log("> Message written");
  } catch (error) {
    log("Arghx! " + error);
  }
}

async function test() {
  await sleep(2000);
  console.log('t');
  testB();
}

async function testB() {
  await sleep(2000);
  console.log('b');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function log(str) {
  var par = document.getElementById('logCont');
  var s = document.createElement('SPAN');
  s.textContent = str;
  par.append(s);
  par.append(document.createElement('BR'));
}

//game

class Player {
  constructor(name,card,color) {
    this.bal = 1e6;
    this.name = name;
    this.props = new List([{a:'JQG',d:0},{a:'SONL',d:0},{a:'I-312',d:0}]);
    this.stocks = new List(['QAR']);
    this.card = card;
    this.color = color;
    makePlayerRow(this);
  }
}
Player.prototype.updateBal = function(bal) {
  if (!bal) {
    return;
  }
  this.bal = bal;
  for (let row of document.getElementsByClassName('playerRow')) {
    if (row.getAttribute('data-card') == this.card) {
      row.children[1].textContent = renderPrice(bal);
      break;
    }
  }
}
Player.prototype.getIndex = function() {
  for (let i = 0, p = players[0]; i < players.length; i++, p = players[i]) {
    if (p.card == this.card) {
      return i;
    }
  }
}

class List {
  constructor(list) {
    this.arr = list;
  }
}
List.prototype.bubble = function(term) {
  var i = this.arr.indexOf(term);
  if (i > -1) {
    this.arr.splice(i,1);
  }
}
List.prototype.boop = function(abbr) {
  for (let i = 0, p = this.arr[0]; i < this.arr.length; i++, p = this.arr[i]) {
    if (p.a.toUpperCase() == abbr.toUpperCase()) {
      this.arr.splice(i,1);
    }
  }
}

function makePlayerRow(player) {
  var newRow = buildElem('DIV','playerRow',undefined,document.getElementsByClassName('page')[2]);
  newRow.setAttribute('data-card',player.card);
  var newTop = buildElem('DIV','playerTop',undefined,newRow);
  var newName = buildElem('DIV','playerName',player.name,newTop);
  newName.style.color = player.color;
  var dg = 'M3,6H21V18H3V6M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M7,8A2,2 0 0,1 5,10V14A2,2 0 0,1 7,16H17A2,2 0 0,1 19,14V10A2,2 0 0,1 17,8H7Z';
  var newGo = buildSVG(dg,'playerBtn','Passed $50K Go',newTop,true);
  var dm = 'M5,6H23V18H5V6M14,9A3,3 0 0,1 17,12A3,3 0 0,1 14,15A3,3 0 0,1 11,12A3,3 0 0,1 14,9M9,8A2,2 0 0,1 7,10V14A2,2 0 0,1 9,16H19A2,2 0 0,1 21,14V10A2,2 0 0,1 19,8H9M1,10H3V20H19V22H1V10Z';
  var newMax = buildSVG(dm,'playerBtn','Passed $100K Go',newTop,true);
  var dc = 'M15 4A8 8 0 1 1 7 12A8 8 0 0 1 15 4M3 12A6 6 0 0 0 7 17.65V19.74A8 8 0 0 1 7 4.26V6.35A6 6 0 0 0 3 12Z';
  var newCoin = buildSVG(dc,'playerBtn','Collect Dividends',newTop,true);
  buildElem('DIV','playerBal',renderPrice(player.bal),newRow);
  var newBot = buildElem('DIV','playerGrid',undefined,newRow);
  for (let p of player.props.arr) {
    let abbr = p.a;
    let prop = getPropFromAbbr(abbr);
    let newProp = buildElem('DIV','playerAsset',undefined,newBot);
    newProp.setAttribute('data-abbr',prop.abbr);
    let newColor = buildElem('DIV','playerAssetColor',undefined,newProp);
    newColor.style.backgroundColor = prop.color;
    buildElem('DIV','playerAssetAbbr',abbr,newProp);
  }
  var secBot = buildElem('DIV','playerGrid',undefined,newRow);
  secBot.style.borderTop = '1px solid #333';
  for (let abbr of player.stocks.arr) {
    let stock = getStockFromAbbr(abbr);
    let newProp = buildElem('DIV','playerAsset',undefined,secBot);
    newProp.setAttribute('data-abbr',stock.img.toUpperCase());
    let newColor = buildElem('DIV','playerAssetColor',undefined,newProp);
    newColor.style.backgroundColor = stock.accent;
    buildElem('DIV','playerAssetAbbr',abbr,newProp);
  }
  update();
}

function initGame(a) {
  var c = document.getElementsByName('expansion');
  var x = [planesAndTrainsProps,spaceProps,americaProps];
  if (a) {
    var u = a;
  } else {
    var u = [0,0,0];
    for (let i = 0, e = c[0]; i < c.length; i++, e = c[i]) {
      if (e.checked) {
        u[i] = 1;
      }
    }
  }
  for (let i = 0, p = x[0]; i < x.length; i++, p = x[i]) {
    if (u[i] == 1) {
      props = props.concat(p);
    }
  }
  expansions = u;
  document.cookie = `expansions=${JSON.stringify(u)}`;
  document.getElementById('initGame').style.display = 'none';
  document.getElementById('initPlayers').style.display = 'block';
  for (let prop of props) {
    buildPropRow(prop);
  }
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

function scanInitCard() {
  var player = new Player(document.getElementById('playerName').value,secStr(),'limegreen');
  players.push(player);
  document.getElementById('playerName').value = '';
}

function startGame() {
  if (players.length < 3 || players.length > playerLim) {
    return;
  }
  var supply = 5 * 1e6;
  var cap = [2 * 1e6,3 * 1e6,5 * 1e6];
  for (let i = 0, a = cap[0]; i < expansions.length; i++, a = cap[i]) {
    if (expansions[i] == 1) {
      supply += a;
    }
  }
  document.cookie = `init=${supply}`;
  var init = ceilToPlace(supply / players.length,6);
  for (let player of players) {
    player.bal = init;
  }
  update();
  autoUpdate();
  launched = 'true';
  document.cookie = 'launched=true';
  document.getElementById('gameBtn').style.color = 'red';
  for (let player of players) {
    player.updateBal(init);
  }
}

function autoUpdate() {
  setInterval(function() {
    update();
  }, 60 * 1000);
}

function update() {
  document.cookie = `players=${JSON.stringify(players)}`;
}

function reset() {
  document.cookie = 'expansions=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'players=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'init=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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

function getPropFromAbbr(abbr) {
  for (let prop of props) {
    if (prop.abbr == abbr) {
      return prop;
    }
  }
}

function getStockFromAbbr(abbr) {
  for (let stock of stocks) {
    if (stock.img == abbr.toLowerCase()) {
      return stock;
    }
  }
}
