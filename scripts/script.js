window.onload = () => {
  alert('V1.0.17');
}

async function scanold() {
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
      log(`> Records: (${JSON.stringify(message.records[0])})`);
    });
  } catch (error) {
    log("Argh! " + error);
  }
}

async function scan() {
  if ("NDEFReader" in window) {
    const ndef = new NDEFReader();
    try {
      await ndef.scan();
      ndef.onreading = event => {
        const decoder = new TextDecoder();
        for (const record of event.message.records) {
          consoleLog("Record type:  " + record.recordType);
          consoleLog("MIME type:    " + record.mediaType);
          consoleLog("=== data ===\n" + decoder.decode(record.data));
        }
      }
    } catch(error) {
      consoleLog(error);
    }
  } else {
    consoleLog("Web NFC is not supported.");
  }
}

async function writex() {
  if ("NDEFReader" in window) {
    const ndef = new NDEFReader();
    try {
      await ndef.write("What Web Can Do Today");
      consoleLog("NDEF message written!");
    } catch(error) {
      consoleLog(error);
    }
  } else {
    consoleLog("Web NFC is not supported.");
  }
}

async function writexold() {
  log("User clicked write button");

  try {
    const ndef = new NDEFReader();
    await ndef.write("Hello world!");
    log("> Message written");
  } catch (error) {
    log("Argh! " + error);
  }
}

function consoleLog(str) { log(str); }

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
