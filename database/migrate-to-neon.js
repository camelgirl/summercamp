/**
 * Migration script to import JSON data into Neon database
 * 
 * Usage:
 * 1. Set NETLIFY_DATABASE_URL in your environment or .env file
 * 2. Run: node database/migrate-to-neon.js
 */

import { neon } from '@netlify/neon';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load .env file if it exists
const envPath = join(__dirname, '..', '.env');
if (existsSync(envPath)) {
  try {
    const envContent = readFileSync(envPath, 'utf8');
    const envLines = envContent.split('\n');
    for (const line of envLines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
          process.env[key.trim()] = value.trim();
        }
      }
    }
    console.log('📄 Loaded environment variables from .env file');
  } catch (error) {
    if (error.code === 'EPERM') {
      console.log('⚠️  Could not read .env file (permission denied). Using environment variables or command line argument.');
    } else {
      console.log(`⚠️  Could not read .env file: ${error.message}`);
    }
  }
}

// Get database URL from environment variable or command line argument
const dbUrl = process.argv[2] || process.env.NETLIFY_DATABASE_URL;

if (!dbUrl) {
  console.error('❌ Error: Database connection string is required');
  console.log('\nYou can provide it in one of these ways:');
  console.log('1. Set NETLIFY_DATABASE_URL environment variable:');
  console.log('   export NETLIFY_DATABASE_URL="your_connection_string"');
  console.log('   npm run migrate:neon');
  console.log('\n2. Pass it as an argument:');
  console.log('   npm run migrate:neon -- "your_connection_string"');
  console.log('\n3. Create a .env file with:');
  console.log('   NETLIFY_DATABASE_URL=your_connection_string');
  console.log('\n4. Use Netlify CLI (if you have it set up):');
  console.log('   netlify db init');
  console.log('   netlify db:list');
  process.exit(1);
}

// Initialize Neon client
const sql = neon(dbUrl);

async function createSchema() {
  console.log('📋 Creating database schema...');
  
  const schemaSQL = readFileSync(
    join(__dirname, 'schema.sql'),
    'utf8'
  );
  
  // Split by semicolons, but handle dollar-quoted strings properly
  const statements = [];
  let currentStatement = '';
  let inDollarQuote = false;
  let dollarTag = '';
  
  for (let i = 0; i < schemaSQL.length; i++) {
    const char = schemaSQL[i];
    currentStatement += char;
    
    // Check for dollar-quoted strings (e.g., $$ ... $$ or $tag$ ... $tag$)
    if (char === '$' && !inDollarQuote) {
      // Look ahead to find the dollar tag
      let tag = '$';
      let j = i + 1;
      while (j < schemaSQL.length && schemaSQL[j] !== '$') {
        tag += schemaSQL[j];
        j++;
      }
      if (j < schemaSQL.length) {
        tag += '$';
        dollarTag = tag;
        inDollarQuote = true;
        i = j;
        continue;
      }
    }
    
    // Check for end of dollar quote
    if (inDollarQuote && schemaSQL.substring(i).startsWith(dollarTag)) {
      currentStatement += dollarTag.substring(1); // Add the rest of the tag
      i += dollarTag.length - 1;
      inDollarQuote = false;
      dollarTag = '';
      continue;
    }
    
    // If we're not in a dollar quote and hit a semicolon, it's the end of a statement
    if (!inDollarQuote && char === ';') {
      const trimmed = currentStatement.trim();
      if (trimmed.length > 0) {
        statements.push(trimmed);
      }
      currentStatement = '';
    }
  }
  
  // Add any remaining statement
  if (currentStatement.trim().length > 0) {
    statements.push(currentStatement.trim());
  }
  
  for (const statement of statements) {
    try {
      await sql(statement);
    } catch (error) {
      // Ignore "already exists" errors
      if (!error.message.includes('already exists') && 
          !error.message.includes('does not exist')) {
        console.error('Schema error:', error.message);
      }
    }
  }
  
  console.log('✅ Schema created');
}

async function importCamps(filePath, category) {
  console.log(`\n📦 Importing ${category} camps from ${filePath}...`);
  
  const data = JSON.parse(
    readFileSync(join(__dirname, '..', filePath), 'utf8')
  );
  
  let imported = 0;
  let skipped = 0;
  
  for (const camp of data) {
    try {
      // Check if camp already exists (by name)
      const existing = await sql`
        SELECT id FROM camps WHERE name = ${camp.name} AND category = ${category}
      `;
      
      if (existing.length > 0) {
        // Update existing camp
        await sql`
          UPDATE camps SET
            website = ${camp.website || null},
            ages = ${camp.ages || null},
            dates = ${camp.dates || null},
            registration_date = ${camp.registrationDate || null},
            cost = ${camp.cost || null},
            location = ${camp.location || null},
            type = ${camp.type || null},
            district = ${camp.district || null},
            notes = ${camp.notes || null},
            updated_at = CURRENT_TIMESTAMP
          WHERE name = ${camp.name} AND category = ${category}
        `;
        console.log(`  ✓ Updated: ${camp.name}`);
      } else {
        // Insert new camp
        await sql`
          INSERT INTO camps (
            name, website, ages, dates, registration_date,
            cost, location, type, district, notes, category
          ) VALUES (
            ${camp.name},
            ${camp.website || null},
            ${camp.ages || null},
            ${camp.dates || null},
            ${camp.registrationDate || null},
            ${camp.cost || null},
            ${camp.location || null},
            ${camp.type || null},
            ${camp.district || null},
            ${camp.notes || null},
            ${category}
          )
        `;
        imported++;
        console.log(`  ✓ Imported: ${camp.name}`);
      }
    } catch (error) {
      console.error(`  ✗ Error importing ${camp.name}:`, error.message);
      skipped++;
    }
  }
  
  console.log(`\n✅ ${category} camps: ${imported} imported, ${skipped} skipped`);
  return { imported, skipped };
}

async function main() {
  try {
    console.log('🚀 Starting migration to Neon database...\n');
    
    // Database URL is already checked at the top
    
    // Create schema
    await createSchema();
    
    // Import community camps
    const communityResult = await importCamps('camps-data.json', 'community');
    
    // Import school district camps
    const districtResult = await importCamps('school-district-camps.json', 'school-district');
    
    // Summary
    console.log('\n📊 Migration Summary:');
    console.log(`   Community camps: ${communityResult.imported} imported`);
    console.log(`   School district camps: ${districtResult.imported} imported`);
    console.log(`   Total: ${communityResult.imported + districtResult.imported} camps`);
    
    // Verify counts
    const totalCamps = await sql`SELECT COUNT(*) as count FROM camps`;
    console.log(`\n✅ Total camps in database: ${totalCamps[0].count}`);
    
    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
