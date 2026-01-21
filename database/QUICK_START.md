# Quick Start: Migrate to Neon Database

## 🚀 Quick Migration Steps

### 1. Install the Neon package
```bash
npm install @netlify/neon
```

### 2. Set your database URL

**Option A: Environment variable**
```bash
export NETLIFY_DATABASE_URL="your_neon_connection_string"
npm run migrate:neon
```

**Option B: .env file**
Create a `.env` file in the project root:
```bash
NETLIFY_DATABASE_URL=your_neon_connection_string
```
Then run: `npm run migrate:neon`

**Option C: Pass as argument**
```bash
npm run migrate:neon -- "your_neon_connection_string"
```

**Option D: Netlify Dashboard**
- Go to Site settings → Environment variables
- Add `NETLIFY_DATABASE_URL` with your Neon connection string
- (This is for deployment, not local migration)

### 3. Run the migration
```bash
npm run migrate:neon
```

That's it! Your data will be imported into Neon.

## 📋 What Gets Migrated

- ✅ All community camps from `camps-data.json`
- ✅ All school district camps from `school-district-camps.json`
- ✅ Database schema (tables, indexes, triggers)

## 🔍 Verify Migration

After migration, check your Neon dashboard or run:
```sql
SELECT COUNT(*) FROM camps;
```

## 📝 Next Steps

1. **Set environment variable in Netlify** (if not using Netlify's Neon integration)
2. **Deploy** - Your functions will automatically use Neon instead of JSON files
3. **Test** - Visit your site and verify camps are loading from the database

## ⚠️ Important Notes

- The migration script will **update** existing camps if they have the same name
- Your JSON files remain unchanged (backup)
- After migration, the Netlify Functions will use Neon automatically
- Make sure `NETLIFY_DATABASE_URL` is set in Netlify environment variables

## 🆘 Need Help?

See `database/README.md` for detailed instructions and troubleshooting.
