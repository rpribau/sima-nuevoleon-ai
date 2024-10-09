// app/api/stations/route.ts
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('dataUrl');

    if (!url) {
        return NextResponse.json({ error: "Missing dataUrl parameter" }, { status: 400 });
    }

    try {
        // Launch Puppeteer with headless mode, bypassing CSP, disabling sandbox, and preventing the creation of an initial window
        const browser = await puppeteer.launch({
            headless: true, // Run Puppeteer in headless mode (without GUI)
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--no-startup-window', // Prevent Puppeteer from opening an initial window
                '--no-first-run', // Prevent the first run configuration from opening any page
            ],
            waitForInitialPage: false, // Don't wait for an initial page to open
            defaultViewport: null, // Avoid creating a default window size or viewport
        });

        const page = await browser.newPage();

        // Set the User-Agent to mimic a real browser
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 OPR/113.0.0.0');

        // Disable any attempts to open popups or new windows/tabs
        page.on('popup', (popup) => {
            popup.close();  // Close any popup window that opens
        });

        // Avoid page redirections that might open new windows/tabs
        await page.setBypassCSP(true);

        // Navigate to the page where the JSON data is dynamically loaded
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Wait for the table to be populated with the required data
        await page.waitForFunction(() => {
            const tbody = document.querySelector('#tablaIMK_wrapper tbody');
            return tbody && tbody.innerText.trim().length > 0 && !tbody.innerText.includes('No datos');
        });

        // Extract the data from the page
        const jsonData = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('#tablaIMK_wrapper tbody tr'));
            return rows.map(row => {
                const cells = row.querySelectorAll('td');
                return Array.from(cells).map(cell => cell.innerText.trim());  // Get the text of each cell
            });
        });

        // Close the browser after the scraping is complete
        await browser.close();

        // Return the scraped data as JSON
        return NextResponse.json(jsonData);

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
