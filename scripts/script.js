window.onload = () => {
  alert('V1.3.9');
  document.getElementsByTagName('main')[0].style.height = `${window.innerHeight - 60}px`;
}

window.onresize = () => {
  document.getElementsByTagName('main')[0].style.height = `${window.innerHeight - 60}px`;
}

var players = [];
var gameSet = false;
var initBalance = 1e6;
var bankCard;
var propsLoaded = false;

function loadAssets(arr) {
  buildAssets(mainProperties);
  if (arr[0]) {
    buildAssets(planesAndTrains);
  }
  if (arr[1]) {
    buildAssets(space);
  }
  if (arr[2]) {
    buildAssets(america);
  }
}

function buildAssets(list) {
  for (let p of list) {
    let cont = buildElem('DIV','propCont',undefined,document.getElementsByClassName('page')[2]);
    cont.id = `prop${p.abbr}`;
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
  document.getElementById('set').style.backgroundColor = 'rgb(64,64,64)';
}

async function scanCard() {
  if ('NDEFReader' in window) {
    let ndef = new NDEFReader();
    await ndef.scan();
    ndef.onreading = async event => {
      let decoder = new TextDecoder();
      for (let record of event.message.records) {
        let card = JSON.parse(decoder.decode(record.data));
        if (card.id == 'bank') {
          try {
            let key = prompt('Enter Code:');
            if (key == cipher(card.key)) {
              document.getElementsByClassName('tab')[4].style.display = 'flex';
              document.getElementsByClassName('tab')[5].style.display = 'flex';
            } else {
              alert('Incorrect Code');
            }
          } catch (error) {
            alert(error);
          }
        } else if (card.id) {
          document.getElementById('scanId').textContent = capFirst(card.id);
          document.getElementById('scanBalance').textContent = `$${numberWithCommas(card.balance)}`;
          if (!propsLoaded) {
            propsLoaded = true;
            loadAssets([card.planes,card.space,card.america]);
          }
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

async function initCard() {
  if ('NDEFReader' in window) {
    let ndef = new NDEFReader();
    await ndef.scan();
    ndef.onreading = async event => {
      let decoder = new TextDecoder();
      if (!gameSet) {
        return;
      }
      for (let record of event.message.records) {
        bankCard = JSON.parse(decoder.decode(record.data));
        bankCard.planes = document.getElementsByName('expansions')[0].checked;
        bankCard.space = document.getElementsByName('expansions')[1].checked;
        bankCard.america = document.getElementsByName('expansions')[2].checked;
        let d = new Date();
        bankCard.unix = d.getTime();
      }
    }
  } else {
    alert('WTF');
  }
}

async function finalizeCard() {
  if ('NDEFReader' in window) {
    let ndef = new NDEFReader();
    try {
      await ndef.write(JSON.stringify(bankCard));
      bankCard = null;
    } catch(error) {
      alert(error);
    }
  } else {
    alert('WTF');
  }
}

//resources

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

function hexToDec(s) {
  var i, j, digits = [0], carry;
  for (i = 0; i < s.length; i ++) {
    carry = parseInt(s.charAt(i), 16);
    for (j = 0; j < digits.length; j ++) {
      digits[j] = digits[j] * 16 + carry;
      carry = digits[j] / 10 | 0;
      digits[j] %= 10;
    }
    while (carry > 0) {
      digits.push(carry % 10);
      carry = carry / 10 | 0;
    }
  }
  return Number(digits.reverse().join(''));
}

function cipher(key) {
  var d = new Date();
  var t = Math.round(d.getTime() / 1e4);
  var s = SHA256(t + key);
  return hexToDec(s) % 1e6;
}
