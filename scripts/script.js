window.onload = () => {
  alert('V1.0.11');
}

function scan() {
  const ndef = new NDEFReader();
ndef.scan().then(() => {
  log("Scan started successfully.");
  ndef.onreadingerror = () => {
    log("Cannot read data from the NFC tag. Try another one?");
  };
  ndef.onreading = event => {
    log(`NDEF message read. ${JSON.stringify(event.message)}`);
  };
}).catch(error => {
  log(`Error! Scan failed to start: ${error}.`);
});
}

async function writex() {
  try {
    const ndef = new NDEFReader();
    await ndef.write('Hello world!');
    log('> Message written');
  } catch (error) {
    log('Argh! ' + error);
  }
}

function log(str) {
  let span = document.createElement('SPAN');
  span.textContent = str;
  span.style.color = 'white';
  document.body.append(span);
  document.body.append(document.createElement('BR'));
}

// ndef.onreading = event => {
//   log('> Has started reading')
//   const message = event.message;
//   for (const record of message.records) {
//     log("Record type:  " + record.recordType);
//     log("MIME type:    " + record.mediaType);
//     log("Record id:    " + record.id);
//     switch (record.recordType) {
//       case "text":
//         // TODO: Read text record with record data, lang, and encoding.
//         break;
//       case "url":
//         // TODO: Read URL record with record data.
//         break;
//       default:
//         // TODO: Handle other records with record data.
//     }
//   }
// };
