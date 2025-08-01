# Base Images for Mascot Assembly

This folder should contain two JPG files that will be used as the base for mascot assembly:

## Required Files:

1. **`head.svg`** - The base head image for the mascot (SVG format for perfect scaling)
2. **`body.jpg`** - The base body image for the mascot

## How it works:

- The AI assembly process reads these two images
- GPT-4V analyzes both images and provides assembly instructions
- DALL-E 3 generates the final combined mascot with customizations
- Users can customize colors, accessories, and other traits

## File Requirements:

- **Head**: SVG format (vector-based, perfect scaling)
- **Body**: JPG/JPEG format
- **Size**: Recommended 512x512 or larger
- **Style**: Should match the Candle TV branding theme
- **Quality**: High quality, clear images

## Placeholder Files:

Until you add your actual images, you can create simple placeholder files:

```bash
# Create placeholder files (you can replace these with your actual images)
echo '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="orange"/><text x="50" y="55" text-anchor="middle" fill="white" font-size="24">C</text></svg>' > head.svg
echo "Placeholder for body.jpg" > body.jpg
```

## Usage:

Once the images are in place, the AI Image Generator will:
1. Read these base images automatically
2. Apply user customizations (colors, accessories, etc.)
3. Generate a new mascot combining both images with the customizations
4. Allow downloading of the final result

The assembly happens entirely in the background - users just see a simple interface to customize traits and generate their mascot! 