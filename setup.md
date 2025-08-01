# Setup Instructions for Candle TV Mascot Creator

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create Environment File**
   Create a file named `.env.local` in the root directory with:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_APP_NAME=Candle TV Mascot Creator
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to http://localhost:3000

## OpenAI API Setup for Image Generation

### 1. Get Your API Key
- Visit [OpenAI Platform](https://platform.openai.com/)
- Sign up or log in to your account
- Navigate to "API Keys" section
- Create a new API key
- **IMPORTANT**: Save it securely - you won't see it again

### 2. Add Credit to Your Account
- Go to "Billing" in your OpenAI dashboard
- Add payment method (credit card required)
- Add $30 credit to your account
- Set up usage limits to prevent overages

### 3. API Pricing (DALL-E 3)
- **1024×1024 images**: $0.040 per image
- **1024×1792 or 1792×1024 images**: $0.080 per image
- **With $30 budget**: 750 images (1024×1024) or 375 images (higher resolution)

### 4. Usage Limits Setup
- Go to "Usage Limits" in your OpenAI dashboard
- Set daily spending limit to $1-2 to stay within budget
- Set monthly limit to $30

## Features Included

✅ **Complete Mascot Customization System**
- Head, eyes, glasses, shirt, pants, shoes, accessories
- Real-time preview with SVG rendering
- Color customization for all parts

✅ **AI-Powered Generation**
- OpenAI API integration (GPT-3.5-turbo for text-to-traits)
- DALL-E 3 integration for image generation
- Text-to-mascot generation
- Smart trait mapping from descriptions

✅ **Save & Load System**
- Save custom mascots with names
- Load previously created mascots
- Delete unwanted designs

✅ **Download Functionality**
- PNG export of mascots
- Named file downloads
- High-quality SVG-based rendering

✅ **Candle TV Branding**
- Orange color scheme throughout
- Candle TV logo integration
- Social media links (X, Chart, Contract)

✅ **Modern UI/UX**
- Responsive design
- Tabbed interface
- Smooth animations
- Professional styling

## File Structure Created

```
SOLMASCOTS/
├── app/
│   ├── api/generate-mascot/route.ts
│   ├── api/generate-image/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── MascotCanvas.tsx
│   ├── TraitSelector.tsx
│   ├── AIGenerator.tsx
│   ├── ImageGenerator.tsx
│   └── SavedMascots.tsx
├── types/
│   └── mascot.ts
├── package.json
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
├── postcss.config.js
└── README.md
```

## Next Steps

1. Add your OpenAI API key to `.env.local`
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the server
4. Customize the social links in `components/Header.tsx`
5. Deploy to your preferred platform

The application is now ready to use! 🎉

## Budget Management Tips

- **Start Small**: Begin with 1024×1024 images to maximize your budget
- **Monitor Usage**: Check your OpenAI dashboard regularly
- **Set Limits**: Use usage limits to prevent unexpected charges
- **Test Prompts**: Use the playground to test prompts before implementing
- **Batch Processing**: Consider generating multiple images at once for efficiency 