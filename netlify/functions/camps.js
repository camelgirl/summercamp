// Netlify Serverless Function for camps data
// Uses JSON file directly for immediate updates, with optional database fallback
const { readFileSync } = require('fs');
const { join } = require('path');

exports.handler = async (event, context) => {
  try {
    // Read directly from JSON file for immediate updates
    // This ensures new camps appear immediately without needing database migration
    const jsonPath = join(__dirname, 'camps-data.json');
    const campsData = JSON.parse(readFileSync(jsonPath, 'utf8'));
    
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
