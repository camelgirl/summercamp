# Database Troubleshooting Guide

## Why Your Database Might Not Be Working

### Issue 1: Environment Variable Not Set in Netlify

**Problem:** `NETLIFY_DATABASE_URL` is not configured in Netlify.

**Solution:**
1. Go to your Netlify dashboard
2. Navigate to: **Site settings → Environment variables**
3. Click **Add variable**
4. Name: `NETLIFY_DATABASE_URL`
5. Value: Your Neon database connection string (e.g., `postgresql://user:password@host.neon.tech/dbname?sslmode=require`)
6. Click **Save**
7. Redeploy your site

### Issue 2: Database Migration Not Run

**Problem:** The database exists but has no data.

**Solution:**
Run the migration script locally:

```bash
# Option 1: Set environment variable
export NETLIFY_DATABASE_URL="your_connection_string"
npm run migrate:neon

# Option 2: Create .env file
echo "NETLIFY_DATABASE_URL=your_connection_string" > .env
npm run migrate:neon

# Option 3: Pass as argument
npm run migrate:neon -- "your_connection_string"
```

### Issue 3: Database Connection String Incorrect

**Problem:** The connection string format is wrong.

**Solution:**
- Get your connection string from Neon dashboard
- Format: `postgresql://username:password@host.neon.tech/database?sslmode=require`
- Make sure there are no extra spaces or quotes

### Issue 4: Database Schema Not Created

**Problem:** The tables don't exist in the database.

**Solution:**
The migration script automatically creates the schema. If it fails:
1. Check your Neon dashboard to see if the `camps` table exists
2. If not, run the migration script again
3. Check the console for any error messages

### Issue 5: Netlify Function Can't Access Database

**Problem:** The function is trying to use the database but failing.

**Current Behavior:**
- The function now tries the database first
- If it fails, it automatically falls back to JSON files
- Check Netlify function logs to see which source is being used

**To Check Logs:**
1. Go to Netlify dashboard
2. Navigate to: **Functions** tab
3. Click on the `camps` function
4. Check the logs for:
   - `✅ Loaded X camps from database` (database working)
   - `⚠️ Database query failed, falling back to JSON file` (database failed, using JSON)
   - `ℹ️ NETLIFY_DATABASE_URL not set, using JSON file` (env var not set)

## Quick Diagnostic Steps

1. **Check if environment variable is set:**
   - Netlify Dashboard → Site settings → Environment variables
   - Look for `NETLIFY_DATABASE_URL`

2. **Check database connection:**
   - Go to Neon dashboard
   - Verify your database is active
   - Test the connection string

3. **Check if data exists:**
   - Run this in Neon SQL editor:
   ```sql
   SELECT COUNT(*) FROM camps;
   ```
   - Should return a number > 0

4. **Check function logs:**
   - Netlify Dashboard → Functions → camps
   - Look for error messages or warnings

## Current Setup

The `camps.js` function now:
1. ✅ Tries to use the database if `NETLIFY_DATABASE_URL` is set
2. ✅ Falls back to JSON files if database fails
3. ✅ Logs which source it's using

This means your site will work even if the database isn't set up, but you'll get the latest data from JSON files.

## To Fully Enable Database

1. Set `NETLIFY_DATABASE_URL` in Netlify environment variables
2. Run the migration script to populate the database
3. Redeploy your site
4. Check function logs to confirm it's using the database
