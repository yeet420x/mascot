# Candle TV Mascot Creator

A modern web application for creating and customizing Candle TV mascots with AI-powered generation capabilities.

## Features

- 🎨 **Interactive Mascot Customization**: Customize head, eyes, glasses, shirt, pants, shoes, and accessories
- 🤖 **AI-Powered Generation**: Use OpenAI API to generate mascots from text descriptions
- 🖼️ **DALL-E 3 Image Generation**: Generate actual mascot images using OpenAI's DALL-E 3
- 💾 **Save & Load**: Save your custom mascots and load them later
- 📥 **Download**: Download your mascots as PNG images
- 🎯 **Candle TV Branding**: Orange color scheme and Candle TV logo integration
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI API (GPT-3.5-turbo for text generation, DALL-E 3 for image generation)
- **Icons**: Lucide React
- **Canvas**: SVG-based rendering

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd candle-mascot-creator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_APP_NAME=Candle TV Mascot Creator
   ```

   Replace `your_openai_api_key_here` with your actual OpenAI API key.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

### Manual Customization

1. Use the **Customize** tab to manually select traits
2. Choose from different categories: Head, Eyes, Glasses, Shirt, Pants, Shoes, Accessories
3. Each category has multiple color/style options
4. Your mascot updates in real-time as you make selections

### AI Generation

1. Switch to the **AI Generate** tab
2. Enter a description of your ideal mascot
3. Click "Generate Mascot" to use AI to create traits
4. The AI will analyze your description and apply appropriate traits

### Image Generation (DALL-E 3)

1. Switch to the **Image Gen** tab
2. Enter a detailed description of your mascot
3. Click "Generate Image" to create an actual mascot image
4. The DALL-E 3 AI will generate a high-quality mascot image
5. Download the generated image directly
6. **Note**: Each image generation costs $0.040

### Saving and Loading

1. Enter a name for your mascot
2. Click "Save Mascot" to store it
3. Use the **Saved** tab to view all your saved mascots
4. Load, download, or delete saved mascots as needed

### Downloading

1. Click the "Download Mascot" button below the canvas
2. Your mascot will be saved as a PNG file
3. The filename will include the mascot's name

## Project Structure

```
candle-mascot-creator/
├── app/
│   ├── api/
│   │   └── generate-mascot/
│   │       └── route.ts          # OpenAI API integration
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── components/
│   ├── Header.tsx                # Header with logo and social links
│   ├── MascotCanvas.tsx          # SVG mascot renderer
│   ├── TraitSelector.tsx         # Trait customization interface
│   ├── AIGenerator.tsx           # AI generation interface
│   └── SavedMascots.tsx         # Saved mascots management
├── types/
│   └── mascot.ts                 # TypeScript type definitions
├── package.json                  # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
└── README.md                    # This file
```

## Customization

### Adding New Traits

1. Update the `TraitCategory` type in `types/mascot.ts`
2. Add new options to the `traitCategories` array in `TraitSelector.tsx`
3. Update the rendering logic in `MascotCanvas.tsx`

### Changing Colors

The color scheme is defined in `tailwind.config.js`:
- `candle-orange`: Primary orange (#FF6B35)
- `candle-dark`: Dark brown (#2C1810)
- `candle-light`: Light orange (#FFE4D6)
- `candle-accent`: Accent orange (#FF8C42)

### Social Links

Update the social links in `components/Header.tsx`:
- X (Twitter) link
- Chart link
- Contract address link

## API Configuration

### Text Generation (GPT-3.5-turbo)
The AI generation uses OpenAI's GPT-3.5-turbo model. The prompt is designed to:

1. Analyze user descriptions for colors and accessories
2. Map descriptions to available trait options
3. Default to Candle TV branding (orange/black) when no specific colors mentioned
4. Return structured JSON with trait selections

### Image Generation (DALL-E 3)
The image generation uses OpenAI's DALL-E 3 model:

1. **Pricing**: $0.040 per 1024×1024 image
2. **Quality**: High-quality, professional mascot images
3. **Style**: Cute, cartoon-style characters with Candle TV branding
4. **Features**: Automatic background handling and consistent character design

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `OPENAI_API_KEY` to Vercel environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue on GitHub or contact the development team.

---

**Candle TV Mascot Creator** - Create your perfect mascot with AI-powered customization! 