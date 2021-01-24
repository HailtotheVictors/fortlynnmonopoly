window.onload = function() {
  document.getElementById('container').style.height = `${window.innerHeight - 100}px`;
}

var players = [];
var props = [];

class Player {
  constructor(name,card) {
    this.bal = 1e6;
    this.name = name;
    this.props = [];
    this.card = card;
  }
}

function initGame() {
  props = props.concat(mainProperties);
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