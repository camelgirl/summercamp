// Netlify Serverless Function for school districts data
exports.handler = async (event, context) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Try local file first (in functions folder), then fallback to root
    let districtData;
    try {
      districtData = JSON.parse(
        fs.readFileSync(path.join(__dirname, 'school-district-camps.json'), 'utf8')
      );
    } catch (e) {
      districtData = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../../school-district-camps.json'), 'utf8')
      );
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(districtData),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Failed to load school district data' }),
    };
  }
};
