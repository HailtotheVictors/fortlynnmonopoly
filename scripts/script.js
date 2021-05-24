window.onload = () => {
  alert('V1.3.3');
  document.getElementById('landing').style.height = `${window.innerHeight}px`;
  document.getElementsByTagName('main')[0].style.height = `${window.innerHeight - 60}px`;
}

window.onresize = () => {
  document.getElementById('landing').style.height = `${window.innerHeight}px`;
  document.getElementsByTagName('main')[0].style.height = `${window.innerHeight - 60}px`;
}

var players = [];
var gameSet = false;
var initBalance = 1e6;

function loadAssets() {
  buildAssets(mainProperties);
  if (document.getElementsByName('expansions')[0].checked) {
    buildAssets(planesAndTrains);
  }
  if (document.getElementsByName('expansions')[1].checked) {
    buildAssets(space);
  }
  if (document.getElementsByName('expansions')[2].checked) {
    buildAssets(america);
  }
}

function buildAssets(list) {
  for (let p of list) {
    let cont = buildElem('DIV','propCont',undefined,document.getElementsByClassName('page')[2]);
    cont.id = `prop${p.id}`;
    let top = buildElem('DIV','propTop',undefined,cont);
    let group = buildElem('DIV','propGroup',undefined,top);
    group.style.backgroundColor = p.color;
    buildElem('DIV','propName',p.name,top);
    let d = 'M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z';
    let more = buildElem('SVG','propMore','0 0 24 24',top);
    more.addEventListener('click',function() { this.parentElement.nextElementSibling.classList.toggle('show'); } );
    buildElem('PATH',undefined,d,more);
    let grid = buildElem('DIV','propGrid',undefined,cont);
    if (p.house && p.hotel) {
      var titles = ['Group:','Price:','House:','Hotel:'];
      var values = [p.group,rt(p.price),rt(p.house),rt(p.hotel)];
    } else {
      var titles = ['Group:','Price:'];
      var values = [p.group,rt(p.price)];
    }
    if (p.rent) {
      titles = titles.concat(['Rent:','1 House:','2 Houses:','3 Houses:','4 Houses:','Hotel:']);
      values = values.concat([rt(p.rent[0]),rt(p.rent[1]),rt(p.rent[2]),rt(p.rent[3]),rt(p.rent[4]),rt(p.rent[5])]);
    }
    for (let i = 0; i < titles.length; i++) {
      buildElem('DIV','propCell',titles[i],grid);
      buildElem('DIV','propCell',values[i],grid);
    }
  }
}

function set() {
  gameSet = true;
  for (let e of document.getElementsByName('expansions')) {
    if (e.checked) {
      initBalance += Number(e.value);
    }
  }
  alert(initBalance);
}

async function addPlayer() {
  if (!gameSet) {
    return;
  }
  document.getElementById('addPlayer').style.backgroundColor = 'steelblue';
  setTimeout(() => {
    document.getElementById('addPlayer').style.backgroundColor = 'rgb(234,234,234)';
  },500);
  if ('NDEFReader' in window) {
    let ndef = new NDEFReader();
    await ndef.scan();
    ndef.onreading = async event => {
      let decoder = new TextDecoder();
      for (let record of event.message.records) {
        card = JSON.parse(decoder.decode(record.data));
        alert(JSON.stringify(card));
        if (players.indexOf(card.id) != -1) {
          return;
        }
        players.push(card.id);
        document.getElementById('addPlayer').textContent = `addPlayer (${players.length})`;
      }
    }
  } else {
    alert('WTF');
  }
}

async function scanCard() {
  if ('NDEFReader' in window) {
    let ndef = new NDEFReader();
    await ndef.scan();
    ndef.onreading = async event => {
      let decoder = new TextDecoder();
      for (let record of event.message.records) {
        card = JSON.parse(decoder.decode(record.data));
        alert(JSON.stringify(card));
        if (card.id) {
          alert(card.balance);
          document.getElementById('scanId').textContent = capFirst(card.id);
          document.getElementById('scanBalance').textContent = `$${numberWithCommas(card.balance)}`;
        } else if (card.abbr) {
          page(2);
          document.getElementById(`prop${card.abbr}`).scrollIntoView();
          document.getElementById(`prop${card.abbr}`).children[1].classList.add('show');
        }
      }
    }
  } else {
    alert('WTF');
  }
}

async function setBalance() {
  card.balance = initBalance;
  if ('NDEFReader' in window) {
    let ndef = new NDEFReader();
    try {
      await ndef.write(JSON.stringify(card));
      alert(JSON.stringify(card));
      card = null;
    } catch (error) {
      alert(error);
      card = null;
    }
  } else {
    alert('WTF');
  }
}

function startGame() {
  var start = prompt('Start Game?');
  if (start != null && start != '') {
    document.getElementById('landing').style.display = 'none';
    loadAssets();
  }
}

async function scan() {
  if ('NDEFReader' in window) {
    let ndef = new NDEFReader();
    try {
      await ndef.scan();
      ndef.onreading = event => {
        let decoder = new TextDecoder();
        for (let record of event.message.records) {
          log('Record type:' + record.recordType);
          log('Data:' + decoder.decode(record.data));
        }
      }
    } catch(error) {
      log(error);
    }
  } else {
    log('Web NFC is not supported.');
  }
}

async function writex() {
  if ('NDEFReader' in window) {
    let ndef = new NDEFReader();
    try {
      await ndef.write('What Web Can Do Today');
      log('NDEF message written!');
    } catch(error) {
      log(error);
    }
  } else {
    log('Web NFC is not supported.');
  }
}

function log(str) {
  let span = document.createElement('SPAN');
  span.textContent = str;
  span.style.color = 'white';
  document.body.append(span);
  document.body.append(document.createElement('BR'));
}

function uniq(a) {
  var prims = {'boolean':{},'number':{},'string':{}}, objs = [];
  return a.filter(function(item) {
    var type = typeof item;
    if (type in prims) {
      return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
    } else {
      return objs.indexOf(item) >= 0 ? false : objs.push(item);
    }
  });
}

function page(num) {
  var pages = document.getElementsByClassName('page');
  for (let e of pages) {
    e.style.display = 'none';
  }
  pages[num].style.display = 'block';
}

function buildElem(tag,group,text,parent) {
  tag = tag.toLowerCase();
  var ns = false;
  if (tag == 'svg' || tag == 'path' || tag == 'title') {
    ns = true;
    var elem = document.createElementNS('http://www.w3.org/2000/svg',tag.toLowerCase());
    if (tag == 'svg' && text) {
      elem.setAttribute('viewBox',text);
    } else if (tag == 'path') {
      elem.setAttribute('d',text);
    } else {
      elem.textContent = text;
    }
  } else {
    var elem = document.createElement(tag);
  }
  if (group) {
    if (typeof group == 'string') {
      elem.classList.add(group);
    } else {
      for (let g of group) {
        elem.classList.add(g);
      }
    }
  }
  if (text != undefined && tag != 'img' && !ns) {
    elem.textContent = text;
  } else if (text && !ns) {
    elem.src = text;
  }
  if (parent) {
    parent.append(elem);
  }
  return elem;
}

function rt(num) {
  if (num < 1000) {
    return `$${num}K`;
  }
  return `$${num/1000}M`;
}

function capFirst(str) {
  return str.substring(0,1).toUpperCase() + str.substring(1,str.length);
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
}
