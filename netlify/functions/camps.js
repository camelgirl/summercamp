// Netlify Serverless Function for camps data
exports.handler = async (event, context) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Try local file first (in functions folder), then fallback to root
    let campsData;
    try {
      campsData = JSON.parse(
        fs.readFileSync(path.join(__dirname, 'camps-data.json'), 'utf8')
      );
    } catch (e) {
      campsData = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../../camps-data.json'), 'utf8')
      );
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(campsData),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Failed to load camps data' }),
    };
  }
};
