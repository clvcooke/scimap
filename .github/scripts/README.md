# Google Sheets News Updater

This GitHub Action automatically fetches news items from a Google Sheet and updates the `About.tsx` file every night.

## Setup Instructions

### 1. Create a Google Sheet

Create a Google Sheet with three columns:

- **Column A (Date)**: Date in `dd/mm/YYYY` format (e.g., `15/09/2025`) or the text `Ongoing`
- **Column B (Link)**: Full URL to the news article
- **Column C (Title)**: Title of the news article

Example:

```
Date          | Link                                      | Title
15/09/2025    | https://example.com/article1             | Example Article Title
Ongoing       | https://example.com/ongoing              | Ongoing Project
23/07/2025    | https://example.com/article2             | Another Article
```

### 2. Get Google Sheets API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. Create an API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key
5. Make your Google Sheet publicly readable:
   - Open your Google Sheet
   - Click "Share" > "Change to anyone with the link"
   - Set permissions to "Viewer"

### 3. Get Google Sheet ID

The Sheet ID is found in the URL of your Google Sheet:

```
https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
```

### 4. Create Slack Incoming Webhook (Optional)

1. Go to your Slack workspace
2. Navigate to Apps and search for "Incoming Webhooks"
3. Add to your workspace and select a channel
4. Copy the Webhook URL

### 5. Add GitHub Secrets

Add the following secrets to your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to Settings > Secrets and variables > Actions
3. Add these secrets:
   - `GOOGLE_SHEETS_API_KEY`: Your Google Sheets API key
   - `GOOGLE_SHEET_ID`: Your Google Sheet ID
   - `SLACK_WEBHOOK_URL`: Your Slack webhook URL (optional)

### 6. Run the Action

The action will run automatically every night at 2 AM UTC. You can also:

- Trigger it manually from the Actions tab in GitHub
- Modify the schedule in `.github/workflows/update-news.yml`

## How It Works

1. **Fetch Data**: The action fetches data from your Google Sheet using the Google Sheets API
2. **Validate Data**: Each row is validated:
   - Date must be in `dd/mm/YYYY` format or "Ongoing"
   - Link must be a valid URL
   - Title must not be empty
3. **Error Handling**: If validation fails, errors are posted to Slack with specific details
4. **Update File**: Valid news items are written to `About.tsx`
5. **Commit Changes**: If changes are detected, they're committed and pushed to the repository

## Data Format

### Input (Google Sheet)

```
Date          | Link                      | Title
15/09/2025    | https://example.com       | Example Title
```

### Output (About.tsx)

```typescript
{
    date: "September 15th, 2025",
    title: "Example Title",
    url: "https://example.com"
}
```

## Troubleshooting

### Action fails with "Failed to fetch Google Sheet data"

- Verify your Google Sheets API key is correct
- Ensure the Google Sheets API is enabled in Google Cloud Console
- Confirm the Google Sheet is publicly readable

### No Slack notifications

- Verify the `SLACK_WEBHOOK_URL` secret is set correctly
- Check that the webhook is active in your Slack workspace

### Changes not committed

- Ensure the `GITHUB_TOKEN` has write permissions
- Check the Actions logs for git-related errors

## Testing Locally

To test the script locally:

```bash
# Install dependencies
npm install googleapis

# Set environment variables
export GOOGLE_SHEETS_API_KEY="your-api-key"
export GOOGLE_SHEET_ID="your-sheet-id"
export SLACK_WEBHOOK_URL="your-webhook-url"

# Run the script
node .github/scripts/update-news.js
```
