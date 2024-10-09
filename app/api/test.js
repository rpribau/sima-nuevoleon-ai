const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set the User-Agent to mimic a real browser
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 OPR/113.0.0.0');
  
  // Navigate to the page where the JSON data is dynamically loaded
  await page.goto('http://aire.nl.gob.mx:81/SIMA2017reportes/ReporteDiariosimaIcars.php?estacion1=SURESTE2', {
    waitUntil: 'networkidle2',
  });
  
  // Wait for the <tbody> to have more than just the placeholder content (actual data should load)
  await page.waitForFunction(() => {
    const tbody = document.querySelector('#tablaIMK_wrapper tbody');
    return tbody && tbody.innerText.trim().length > 0 && !tbody.innerText.includes('No datos');
  });
  
  // Extract the content of the <tbody> once it is populated
  const jsonData = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('#tablaIMK_wrapper tbody tr'));
    return rows.map(row => {
      const cells = row.querySelectorAll('td');
      return Array.from(cells).map(cell => cell.innerText.trim());  // Get the text of each cell
    });
  });
  
  console.log(jsonData);  // Output the extracted data
  
  await browser.close();
})();