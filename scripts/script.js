window.onload = () => {
  alert('V1.1.9');
  if (getCookie('players') == '') {
    document.getElementById('addPlayer').textContent = 'Add Player (0)';
  } else {
    document.getElementById('addPlayer').textContent = `Add Player (${JSON.parse(getCookie('players')).length})`;
  }
}

var players = [];
var gameSet = false;
var initBalance = 1e6;

function set() {
  gameSet = true;
  for (let e of document.getElementsByName('expansions')) {
    if (e.checked) {
      initBalance += Number(e.value);
    }
  }
  document.cookie = `init=${initBalance}`;
}

async function addPlayer() {
  if (!gameSet) {
    return;
  }
  document.getElementById('addPlayer').style.backgroundColor = 'steelblue';
  setTimeout(() => {
    document.getElementById('addPlayer').style.backgroundColor = 'rgb(149,149,149)';
  },500);
  if ('NDEFReader' in window) {
    let ndef = new NDEFReader();
      await ndef.scan();
      ndef.onreading = async event => {
        let decoder = new TextDecoder();
        for (let record of event.message.records) {
          let card = JSON.parse(decoder.decode(record.data));
          alert(JSON.stringify(card));
          if (players.indexOf(card.id) != -1) {
            return;
          }
          players.push(card.id);
          document.cookie = `players=${JSON.stringify(players)}`;
          alert(getCookie('players'));
          document.getElementById('addPlayer').textContent = `Add Player (${JSON.parse(getCookie('players')).length})`;
          card.balance = initBalance;
          alert(JSON.stringify(card));
          try {
            await ndef.write(JSON.stringify(card));
            alert(JSON.stringify(card));
            document.cookie = `${card.id}=${JSON.stringify(card)}`;
          } catch(error) {
            alert(error);
          }
        }
      }
  } else {
    alert('WTF');
  }
}

function clear() {
  document.cookie = 'players=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'init=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  if (getCookie('players') == '') {
    document.getElementById('addPlayer').textContent = 'Add Player (0)';
  } else {
    document.getElementById('addPlayer').textContent = `Add Player (${JSON.parse(getCookie('players')).length})`;
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

function getCookie(cname) {
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length,c.length);
    }
  }
  return "";
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
