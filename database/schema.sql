-- Create camps table
CREATE TABLE IF NOT EXISTS camps (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    website TEXT,
    ages VARCHAR(100),
    dates TEXT,
    registration_date TEXT,
    cost TEXT,
    location TEXT,
    type VARCHAR(100),
    district VARCHAR(100),
    notes TEXT,
    category VARCHAR(50) DEFAULT 'community', -- 'community' or 'school-district'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_camps_name ON camps(name);
CREATE INDEX IF NOT EXISTS idx_camps_category ON camps(category);
CREATE INDEX IF NOT EXISTS idx_camps_district ON camps(district);
CREATE INDEX IF NOT EXISTS idx_camps_type ON camps(type);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_camps_updated_at BEFORE UPDATE ON camps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
