# Neon Database Migration Guide

This guide will help you migrate your camp data from JSON files to a Neon PostgreSQL database.

## Prerequisites

1. A Neon database account (sign up at https://neon.tech)
2. Node.js installed locally
3. Your Neon database connection string

## Step 1: Set Up Neon Database

1. **Create a Neon project** at https://console.neon.tech
2. **Get your connection string** from the Neon dashboard
   - It should look like: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
3. **Set up Netlify integration** (if not already done):
   - In Netlify dashboard, go to your site settings
   - Navigate to "Environment variables"
   - Add `NETLIFY_DATABASE_URL` with your Neon connection string
   - Or use Netlify's built-in Neon integration

## Step 2: Install Dependencies

Install the Neon package in your project root:

```bash
npm install @netlify/neon
```

## Step 3: Set Environment Variable Locally

Create a `.env` file in the project root (if it doesn't exist):

```bash
NETLIFY_DATABASE_URL=your_neon_connection_string_here
```

**Important**: Add `.env` to your `.gitignore` to keep your credentials safe!

## Step 4: Run the Migration

Run the migration script to import your JSON data:

```bash
node database/migrate-to-neon.js
```

The script will:
- ✅ Create the database schema (tables, indexes, triggers)
- ✅ Import community camps from `camps-data.json`
- ✅ Import school district camps from `school-district-camps.json`
- ✅ Show a summary of imported data

## Step 5: Verify the Migration

After migration, you can verify the data:

1. Check your Neon dashboard to see the `camps` table
2. Or query directly:
   ```sql
   SELECT COUNT(*) FROM camps;
   SELECT COUNT(*) FROM camps WHERE category = 'community';
   SELECT COUNT(*) FROM camps WHERE category = 'school-district';
   ```

## Step 6: Deploy to Netlify

1. **Add the package to your Netlify Functions**:
   - The functions already use `@netlify/neon`
   - Make sure `@netlify/neon` is in your `package.json` dependencies

2. **Set the environment variable in Netlify**:
   - Go to Site settings → Environment variables
   - Add `NETLIFY_DATABASE_URL` with your Neon connection string
   - Or use Netlify's Neon integration (recommended)

3. **Deploy**:
   ```bash
   git add .
   git commit -m "Migrate to Neon database"
   git push
   ```

## Database Schema

The `camps` table has the following structure:

- `id` - Auto-incrementing primary key
- `name` - Camp name (required)
- `website` - Camp website URL
- `ages` - Age range
- `dates` - Camp dates
- `registration_date` - Registration dates
- `cost` - Camp cost
- `location` - Camp location
- `type` - Camp type (Day Camp, Overnight Camp, etc.)
- `district` - School district (for school district camps)
- `notes` - Additional notes
- `category` - Either 'community' or 'school-district'
- `created_at` - Timestamp when record was created
- `updated_at` - Timestamp when record was last updated

## Adding New Camps

After migration, you can add new camps directly to the database:

```sql
INSERT INTO camps (name, website, ages, dates, cost, location, type, category)
VALUES (
  'Camp Name',
  'https://example.com',
  '5-12',
  'June 1 - August 31, 2026',
  '$200/week',
  'Austin, TX',
  'Day Camp',
  'community'
);
```

Or use the "Add a Camp" form on your website - submissions will go to Netlify Forms, and you can manually add them to the database.

## Troubleshooting

### Migration fails with "connection refused"
- Check that your `NETLIFY_DATABASE_URL` is correct
- Ensure your Neon database is running
- Verify your IP is allowed (Neon allows all IPs by default)

### Migration fails with "relation already exists"
- This is normal if you've run the migration before
- The script will skip creating existing tables

### Functions return errors after deployment
- Verify `NETLIFY_DATABASE_URL` is set in Netlify environment variables
- Check that `@netlify/neon` is in your `package.json`
- Review Netlify function logs for specific error messages

## Benefits of Using Neon

✅ **Scalable**: Handle more data as your camp directory grows  
✅ **Fast**: Optimized queries with indexes  
✅ **Reliable**: Automatic backups and high availability  
✅ **Easy Integration**: Works seamlessly with Netlify  
✅ **Real-time**: Update data without redeploying  

## Next Steps

- Set up automated backups in Neon dashboard
- Consider adding a search/filter API endpoint
- Add admin interface for managing camps
- Set up webhooks to auto-add camps from form submissions
