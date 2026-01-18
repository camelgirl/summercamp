// Netlify Serverless Function for camps data using Neon database
const { neon } = require('@netlify/neon');

exports.handler = async (event, context) => {
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
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(campsData),
    };
  } catch (error) {
    console.error('Error fetching camps:', error);
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
