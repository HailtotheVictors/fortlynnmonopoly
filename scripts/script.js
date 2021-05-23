window.onload = () => {
  alert('V1.1.3');
  if (getCookie('players') == '') {
    document.getElementById('addPlayer').textContent = 'Add Player (0)';
  } else {
    document.getElementById('addPlayer').textContent = `Add Player (${JSON.parse(getCookie('players')).length})`;
  }
}

var players = [];

async function addPlayer() {
  if ('NDEFReader' in window) {
    let ndef = new NDEFReader();
      await ndef.scan();
      ndef.onreading = event => {
        let decoder = new TextDecoder();
        for (let record of event.message.records) {
          players.push(JSON.parse(decoder.decode(record.data)).id);
          players = uniq(players);
          document.cookie = `players=${JSON.stringify(players)}`;
          alert(getCookie('players'));
          document.getElementById('addPlayer').textContent = `Add Player (${JSON.parse(getCookie('players')).length})`;
        }
      }
  } else {
    alert('WTF');
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
