# Austin Summer Camps 2026

A modern, responsive website showcasing summer camp options in Austin, Texas for 2026.

## Features

- **Search Functionality**: Search camps by name, type, or location
- **Age Filtering**: Filter camps by minimum age requirement
- **Type Filtering**: Filter by camp type (Day Camp, Overnight Camp, etc.)
- **Map View**: Interactive map showing all camp locations with markers
  - Click markers to see camp details
  - Map automatically adjusts to show all filtered camps
  - Toggle between List View and Map View
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices
- **Modern UI**: Clean, modern interface with smooth animations and hover effects
- **Camp Details**: View comprehensive information including:
  - Camp name and type
  - Website links
  - Age requirements
  - Camp dates
  - Registration dates
  - Cost information
  - Location
  - Additional notes

## Getting Started

### Option 1: Simple Local Server (Recommended)

Since the website uses JavaScript fetch to load the JSON data, you'll need to run it through a local server to avoid CORS issues.

#### Using Python 3:
```bash
cd /Users/yinyanhe/Documents/summercamp
python3 -m http.server 8000
```

Then open your browser and navigate to:
```
http://localhost:8000
```

#### Using Node.js (if you have it installed):
```bash
cd /Users/yinyanhe/Documents/summercamp
npx http-server -p 8000
```

Then open your browser and navigate to:
```
http://localhost:8000
```

### Option 2: Direct File Opening

You can also open `index.html` directly in your browser, but note that some browsers may block loading the JSON file due to CORS restrictions. If you encounter issues, use Option 1.

## File Structure

```
summercamp/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality (includes map features)
├── camps-data.json     # Camp data in JSON format
└── README.md           # This file
```

## Map Features

The website includes an interactive map powered by [Leaflet.js](https://leafletjs.com/) and OpenStreetMap:

- **Automatic Geocoding**: Camp locations are automatically geocoded from addresses
- **Interactive Markers**: Click on any marker to see camp details
- **Smart Filtering**: Map updates automatically when you apply search or filters
- **Responsive**: Map works on all device sizes
- **No API Key Required**: Uses free OpenStreetMap tiles

The map view can be toggled using the "Map View" button in the search section.

## Data Source

The camp information is consolidated from the [Austin Summer Camps Google Sheet](https://docs.google.com/spreadsheets/d/1DhxQB_DwgOj8TuCl3aMBb1WPKMzA3lZ5NFZjG-mjfNg/edit?usp=sharing) and enriched with additional data from camp websites and directories.

## Camp Listings

The website currently features **36 summer camps** in and around Austin, Texas, including:

- **Day Camps**: Traditional day camps, specialty camps (STEM, arts, sports, theater)
- **Overnight Camps**: Full overnight camp experiences
- **Free/Low-Cost Options**: Including Austin Sunshine Camps (free for qualifying families)
- **City Programs**: Austin Parks & Recreation camps with resident/non-resident pricing
- **Specialty Camps**: STEM, arts, theater, sports, nature, and more

All camp information has been enriched with details from official websites including dates, costs, age ranges, locations, and registration information.

## Customization

### Adding New Camps

Edit `camps-data.json` and add a new camp object following this structure:

```json
{
  "name": "Camp Name",
  "website": "https://example.com",
  "notes": "Additional information",
  "ages": "5-12 yrs",
  "dates": "June 1-5",
  "registrationDate": "Open now",
  "cost": "$500",
  "location": "Austin, TX",
  "type": "Day Camp"
}
```

### Styling

Modify `styles.css` to customize colors, fonts, and layout. The CSS uses CSS variables for easy theming:

- `--primary-color`: Main brand color
- `--secondary-color`: Secondary/accent color
- `--accent-color`: Highlight color
- `--bg-color`: Background color
- `--card-bg`: Card background color

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

Want to host this website online? See **[DEPLOYMENT.md](DEPLOYMENT.md)** for easy, free hosting options including:
- Netlify (drag-and-drop, easiest)
- GitHub Pages
- Vercel
- And more!

## License

This project is for informational purposes. Camp information is sourced from publicly available data.
