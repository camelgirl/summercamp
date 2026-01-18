// Netlify Serverless Function for school districts data using Neon database
const { neon } = require('@netlify/neon');

exports.handler = async (event, context) => {
  try {
    // Initialize Neon client (automatically uses NETLIFY_DATABASE_URL)
    const sql = neon();
    
    // Query school district camps from database
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
      WHERE category = 'school-district'
      ORDER BY district ASC, name ASC
    `;
    
    // Transform to match original JSON format
    const districtData = camps.map(camp => ({
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
      body: JSON.stringify(districtData),
    };
  } catch (error) {
    console.error('Error fetching school districts:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Failed to load school district data',
        message: error.message 
      }),
    };
  }
};
