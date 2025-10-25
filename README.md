# AYAB Pattern Viewer

A modern web viewer for browsing the [AYAB (All Yarns Are Beautiful) pattern collection](https://github.com/AllYarnsAreBeautiful/ayab-patterns).

## Features

- **Grid Gallery**: Browse all 408 patterns in a responsive grid layout
- **Search**: Find patterns by number (e.g., 001, 42, 100)
- **Grid Size Options**: Choose between small, medium, and large grid sizes
- **Sorting**: View patterns in ascending (1→408) or descending (408→1) order
- **Modal Viewer**: Click any pattern to view it full-size
- **Keyboard Navigation**: Use arrow keys to navigate between patterns in modal view
- **Direct Downloads**: Download individual pattern PNG files
- **GitHub Links**: Quick access to view patterns on the original repository
- **Dark Theme**: Easy-on-the-eyes dark mode interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## File Structure

```
ayab-viewer/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── script.js           # Pattern loading and interaction logic
└── README.md          # This file
```

## How It Works

The viewer loads pattern images directly from the GitHub repository using the GitHub raw content URL:
`https://raw.githubusercontent.com/AllYarnsAreBeautiful/ayab-patterns/main/StitchWorld/`

No build process or backend is required - it's a pure static site that can be hosted anywhere.

## Local Testing

To test locally, simply open `index.html` in a web browser:

```bash
# Option 1: Direct file open
open index.html

# Option 2: Simple HTTP server (recommended)
python3 -m http.server 8000
# Then visit http://localhost:8000

# Option 3: Using Node.js
npx serve
```

## Deploying to GitHub Pages

### Option 1: Deploy from this repository

1. Create a new repository on GitHub (or use an existing one)
2. Push these files to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AYAB pattern viewer"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

3. Enable GitHub Pages:
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "Deploy from a branch"
   - Select the `main` branch and `/ (root)` folder
   - Click "Save"

4. Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### Option 2: Deploy to the ayab-patterns repository

If you have write access to the original repository, you can add these files to a `docs/` or `viewer/` folder and enable GitHub Pages from there.

### Option 3: Fork and Deploy

1. Fork this repository
2. In your fork's settings, enable GitHub Pages as described above
3. Access at: `https://YOUR_USERNAME.github.io/ayab-viewer/`

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Change the Number of Patterns

Edit `script.js` line 2:
```javascript
const TOTAL_PATTERNS = 408; // Change this number
```

### Point to a Different Repository

Edit `script.js` line 1:
```javascript
const REPO_BASE_URL = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/FOLDER/';
```

### Customize Colors

Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --bg-color: #0f172a;
    /* ... etc ... */
}
```

## Credits

- Pattern collection: [AllYarnsAreBeautiful/ayab-patterns](https://github.com/AllYarnsAreBeautiful/ayab-patterns)
- AYAB Project: [All Yarns Are Beautiful](http://ayab-knitting.com/)

## License

This viewer is provided as-is. The pattern images belong to their respective creators in the AYAB project.
# ayab-patterns-webviewer
