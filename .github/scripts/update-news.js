const { google } = require('googleapis');
const fs = require('fs');
const https = require('https');

// Configuration
const GOOGLE_SHEETS_API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const NEWS_JSON_PATH = 'src/data/newsItems.json';

/**
 * Validates a date string in YYYY-MM-DD format
 */
function validateDate(dateStr) {
  // Check if the input string matches YYYY-MM-DD format (ISO 8601 date only)
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(dateStr)) {
    return { valid: false, error: `Invalid date format: "${dateStr}". Expected YYYY-MM-DD format.` };
  }

  const [year, month, day] = dateStr.split('-').map(Number);

  // Create date in local timezone by specifying components directly
  const date = new Date(year, month - 1, day);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return { valid: false, error: `Invalid date: "${dateStr}". Expected YYYY-MM-DD format.` };
  }

  // Verify the date components match what was parsed (prevents invalid dates like 2025-02-30)
  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
    return { valid: false, error: `Invalid date: "${dateStr}". Day/month combination is not valid.` };
  }

  return { valid: true, date };
}

/**
 * Validates a URL
 */
function validateUrl(url) {
  try {
    new URL(url);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: `Invalid URL: "${url}"` };
  }
}

/**
 * Converts YYYY-MM-DD to a readable format (e.g., "September 15th, 2025")
 */
function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Format to "Month Day, Year" and add ordinal suffix
  const formatted = formatter.format(date); // e.g., "September 15, 2025"

  // Add ordinal suffix to the day
  const ordinalRules = new Intl.PluralRules('en-US', { type: 'ordinal' });
  const suffixes = {
    one: 'st',
    two: 'nd',
    few: 'rd',
    other: 'th'
  };
  const suffix = suffixes[ordinalRules.select(day)];

  // Insert suffix after the day number
  return formatted.replace(/(\d+),/, `$1${suffix},`);
}

/**
 * Sends a message to Slack
 */
async function sendSlackNotification(message) {
  if (!SLACK_WEBHOOK_URL) {
    console.error('SLACK_WEBHOOK_URL not configured');
    return;
  }

  const payload = JSON.stringify({
    text: `🚨 *Google Sheets News Update Error*\n\n${message}`,
  });

  return new Promise((resolve, reject) => {
    const url = new URL(SLACK_WEBHOOK_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('Slack notification sent successfully');
          resolve();
        } else {
          reject(new Error(`Slack notification failed with status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

/**
 * Fetches data from Google Sheets
 */
async function fetchGoogleSheetData() {
  const sheets = google.sheets({ version: 'v4', auth: GOOGLE_SHEETS_API_KEY });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: 'A:C', // Columns A, B, C (Date, Link, Title)
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error('No data found in Google Sheet');
    }

    // Skip header row
    return rows.slice(1);
  } catch (error) {
    throw new Error(`Failed to fetch Google Sheet data: ${error.message}`);
  }
}

/**
 * Validates and processes sheet data
 */
function processSheetData(rows) {
  const newsItems = [];
  const errors = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2; // +2 because of 0-index and header row
    const [dateStr, link, title] = row;

    // Check for missing fields
    if (!dateStr || !link || !title) {
      errors.push(`Row ${rowNumber}: Missing required field(s). Date="${dateStr || 'MISSING'}", Link="${link || 'MISSING'}", Title="${title || 'MISSING'}"`);
      return;
    }

    // Validate date (allow "Ongoing" as special case)
    let formattedDate;
    let isOngoing = false;

    if (dateStr.trim().toLowerCase() === 'ongoing') {
      formattedDate = 'Ongoing';
      isOngoing = true;
    } else {
      const dateValidation = validateDate(dateStr.trim());
      if (!dateValidation.valid) {
        errors.push(`Row ${rowNumber}: ${dateValidation.error}`);
        return;
      }
      formattedDate = formatDate(dateStr.trim());
    }

    // Validate URL
    const urlValidation = validateUrl(link.trim());
    if (!urlValidation.valid) {
      errors.push(`Row ${rowNumber}: ${urlValidation.error}`);
      return;
    }

    // Validate title is not empty
    if (title.trim().length === 0) {
      errors.push(`Row ${rowNumber}: Title cannot be empty`);
      return;
    }

    newsItems.push({
      date: formattedDate,
      title: title.trim(),
      url: link.trim(),
      isOngoing: isOngoing || undefined,
    });
  });

  return { newsItems, errors };
}

/**
 * Updates the newsItems.json file with new news items
 */
function updateNewsItemsJson(newsItems) {
  // Clean up the newsItems - remove undefined values
  const cleanedItems = newsItems.map(item => {
    const cleaned = {
      date: item.date,
      title: item.title,
      url: item.url
    };
    if (item.isOngoing) {
      cleaned.isOngoing = true;
    }
    return cleaned;
  });

  fs.writeFileSync(NEWS_JSON_PATH, JSON.stringify(cleanedItems, null, 4), 'utf8');

  console.log(`Successfully updated ${NEWS_JSON_PATH} with ${newsItems.length} news items`);
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('Fetching data from Google Sheets...');
    const rows = await fetchGoogleSheetData();

    console.log('Processing and validating data...');
    const { newsItems, errors } = processSheetData(rows);

    if (errors.length > 0) {
      const errorMessage = `Found ${errors.length} error(s) in Google Sheet:\n\n${errors.map(e => `• ${e}`).join('\n')}`;
      console.error(errorMessage);
      await sendSlackNotification(errorMessage);
      process.exit(1);
    }

    if (newsItems.length === 0) {
      const message = 'No valid news items found in Google Sheet';
      console.error(message);
      await sendSlackNotification(message);
      process.exit(1);
    }

    console.log(`Found ${newsItems.length} valid news items`);
    updateNewsItemsJson(newsItems);

    console.log('✅ News items updated successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    await sendSlackNotification(`Unexpected error: ${error.message}`);
    process.exit(1);
  }
}

main();
