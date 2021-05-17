window.onload = () => {
  alert('V1.0.5');
}

async function scan() {
  console.log('zx');
  try {
    const ndef = new NDEFReader();
    await ndef.scan();
    log("> Scan started");
    ndef.addEventListener("readingerror", () => {
      log("Argh! Cannot read data from the NFC tag. Try another one?");
    });
    ndef.addEventListener("reading", ({ message, serialNumber }) => {
      log(`> Serial Number: ${serialNumber}`);
      log(`> Records: (${message.records.length},${JSON.stringify(message.records)})`);
    });
  } catch (error) {
    log("Argh! " + error);
  }
}

async function writex() {
  try {
    const ndef = new NDEFReader();
    await ndef.write("Hello world!");
    log("> Message written");
  } catch (error) {
    log("Argh! " + error);
  }
}

function log(str) {
  let span = document.createElement('SPAN');
  span.textContent = str;
  span.style.color = 'white';
  document.body.append(span);
}
