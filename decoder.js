function getYearFromLetter(letter) {
  if (letter.length === 1 && /[A-Z]/i.test(letter)) {
    const year = letter.toUpperCase().charCodeAt(0) + 1935;
    const currentYear = new Date().getFullYear();
    if (year >= 2015 && year <= currentYear) {
      return year;
    }
  }
  return null;
}

function decodeLot() {
  const code = document.getElementById("lotInput").value.toUpperCase().trim();
  const resultElem = document.getElementById("result");

  if (code.length !== 5 || isNaN(code.slice(1, 4)) || isNaN(code[4])) {
    resultElem.textContent = "❌ Invalid format. Example: R1234";
    return;
  }

  const year = getYearFromLetter(code[0]);
  if (!year) {
    resultElem.textContent = "❌ Invalid year code.";
    return;
  }

  const doy = parseInt(code.slice(1, 4), 10);
  const offset = parseInt(code[4], 10);
  let finalDay = doy + offset;

  const isLeap = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
  if (finalDay > (isLeap ? 366 : 365)) {
    finalDay -= isLeap ? 366 : 365;
    year += 1;
  }

  const date = new Date(year, 0);
  date.setDate(finalDay);
  resultElem.textContent = "📅 Production Date: " + date.toDateString();
}

function handleImage(input) {
  const file = input.files[0];
  const scanStatus = document.getElementById("scanStatus");
  const resultElem = document.getElementById("result");

  if (!file) return;

  scanStatus.textContent = "📷 Processing image...";
  resultElem.textContent = "";

  Tesseract.recognize(
    file,
    'eng',
    { logger: m => console.log(m) }
  ).then(({ data: { text } }) => {
    scanStatus.textContent = "✅ Scan complete.";
    const match = text.toUpperCase().match(/\b[A-Z]\d{3}\d\b/);
    if (match) {
      const code = match[0];
      document.getElementById("lotInput").value = code;
      resultElem.textContent = `🔍 Detected code: ${code}`;
      decodeLot();
    } else {
      resultElem.textContent = "❌ No valid lot code detected. Try a clearer photo.";
    }
  }).catch(() => {
    scanStatus.textContent = "";
    resultElem.textContent = "⚠️ Failed to process image. Try again.";
  });
}
