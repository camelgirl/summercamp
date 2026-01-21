// Netlify Serverless Function for camps data using Neon database with JSON fallback
const { neon } = require('@netlify/neon');
const { readFileSync } = require('fs');
const { join } = require('path');

exports.handler = async (event, context) => {
  try {
    // Try to get data from database first (if NETLIFY_DATABASE_URL is set)
    if (process.env.NETLIFY_DATABASE_URL) {
      try {
        // Initialize Neon client (automatically uses NETLIFY_DATABASE_URL)
        const sql = neon();
        
        // Query camps from database
        const camps = await sql`
          SELECT 
            id,
            name,
            website,
            ages,
            dates,
            registration_date as "registrationDate",
            cost,
            location,
            type,
            district,
            notes
          FROM camps
          WHERE category = 'community'
          ORDER BY name ASC
        `;
        
        // Transform to match original JSON format
        const campsData = camps.map(camp => ({
          name: camp.name,
          website: camp.website,
          ages: camp.ages,
          dates: camp.dates,
          registrationDate: camp.registrationDate,
          cost: camp.cost,
          location: camp.location,
          type: camp.type,
          district: camp.district,
          notes: camp.notes,
        }));
        
        console.log(`✅ Loaded ${campsData.length} camps from database`);
        
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify(campsData),
        };
      } catch (dbError) {
        // If database fails, fall back to JSON file
        console.warn('⚠️ Database query failed, falling back to JSON file:', dbError.message);
      }
    } else {
      console.log('ℹ️ NETLIFY_DATABASE_URL not set, using JSON file');
    }
    
    // Fallback: Read from JSON file
    const jsonPath = join(__dirname, 'camps-data.json');
    const campsData = JSON.parse(readFileSync(jsonPath, 'utf8'));
    
    console.log(`✅ Loaded ${campsData.length} camps from JSON file`);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(campsData),
    };
  } catch (error) {
    console.error('❌ Error fetching camps:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Failed to load camps data',
        message: error.message 
      }),
    };
  }
};
