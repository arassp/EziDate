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

  const img = new Image();
  const reader = new FileReader();

  reader.onload = function (e) {
    img.onload = function () {
      const scale = 0.5;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Grayscale preprocessing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = gray;
      }
      ctx.putImageData(imageData, 0, 0);

      Tesseract.recognize(canvas, 'eng', {
        logger: m => console.log(m),
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      }).then(({ data: { text } }) => {
        console.log("RAW OCR:", text);
        scanStatus.textContent = "✅ Scan complete.";

        // Clean and correct OCR
        const ocrCorrections = {
          I: '1', Z: '2', S: '5', B: '8', O: '0',
          Q: '0', D: '0', G: '6', T: '7', L: '1'
        };

        const raw = text.toUpperCase().replace(/\s/g, '');

        function correctOCR(str) {
          const match = str.match(/[A-Z]\w{4}/);
          if (!match) return str;
          const chars = match[0].split('');
          for (let i = 1; i < chars.length; i++) {
            if (ocrCorrections[chars[i]]) {
              chars[i] = ocrCorrections[chars[i]];
            }
          }
          return chars.join('');
        }

        const cleaned = correctOCR(raw);
        console.log("CLEANED OCR:", cleaned);

        const match = cleaned.match(/[A-Z]\d{3}\d/);
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
        resultElem.textContent = "⚠️ Failed to process image.";
      });
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}
