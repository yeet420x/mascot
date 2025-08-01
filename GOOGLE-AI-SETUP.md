# Google AI Studio Setup Guide

## 🎯 **Why Google AI Studio?**

- ✅ **Better payment acceptance** - Google's payment system is more reliable
- ✅ **Competitive pricing** - Often cheaper than OpenAI
- ✅ **Excellent quality** - Gemini Pro Vision + Imagen 4.0
- ✅ **Good international support** - Works in more countries
- ✅ **Free tier available** - $0 cost for testing

## 🚀 **Quick Setup Steps**

### **Step 1: Sign Up for Google AI Studio**

1. **Go to Google AI Studio:**
   ```
   https://aistudio.google.com
   ```

2. **Sign in with your Google account**

3. **Complete the setup:**
   - Add payment method (Google Pay often works better than cards)
   - Set up billing
   - Get your API key

### **Step 2: Get Your API Key**

1. **In Google AI Studio:**
   - Click on your profile
   - Go to "API Keys"
   - Create a new API key

2. **Copy the API key** (starts with `AIza...`)

### **Step 3: Add to Your Project**

1. **Create/update `.env.local`:**
   ```env
   GOOGLE_AI_KEY=your_google_ai_key_here
   ```

2. **Replace `your_google_ai_key_here` with your actual API key**

3. **Install the official SDK:**
   ```bash
   npm install @google/genai
   ```

## 🔧 **Available Endpoints**

I've created two Google AI endpoints using the official SDK:

### **1. Simple Image Generation**
- **Endpoint**: `/api/generate-image-gemini`
- **Model**: Imagen 4.0 (latest)
- **Use**: Direct text-to-image generation
- **Cost**: ~$0.02-0.03 per image

### **2. Advanced Mascot Assembly**
- **Endpoint**: `/api/assemble-mascot-gemini`
- **Models**: Gemini 1.5 Pro Vision + Imagen 4.0
- **Use**: Analyzes base images + generates custom mascot
- **Cost**: ~$0.03-0.04 per mascot

## 🎨 **How to Use in Your App**

### **Option 1: Simple Generation**
```typescript
// In your component, change the fetch URL:
const response = await fetch('/api/generate-image-gemini', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'your prompt here' })
})
```

### **Option 2: Advanced Assembly**
```typescript
// In AIImageGenerator.tsx, change the fetch URL:
const response = await fetch('/api/assemble-mascot-gemini', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ traits })
})
```

## 💰 **Pricing Comparison**

| Service | Cost per Image | Cost per Mascot | Quality |
|---------|----------------|-----------------|---------|
| **OpenAI** | $0.04 | $0.05 | ⭐⭐⭐⭐⭐ |
| **Google AI** | $0.02-0.03 | $0.03-0.04 | ⭐⭐⭐⭐ |
| **Stability AI** | $0.01-0.02 | $0.02-0.03 | ⭐⭐⭐⭐ |
| **Hugging Face** | FREE | FREE | ⭐⭐⭐ |

## 🎯 **Benefits of Google AI**

### **Payment Advantages:**
- ✅ **Google Pay support** - Often works when cards fail
- ✅ **Better international support**
- ✅ **Multiple payment methods**
- ✅ **Reliable billing system**

### **Technical Advantages:**
- ✅ **Gemini 1.5 Pro Vision** - Excellent image analysis
- ✅ **Imagen 4.0** - Latest high-quality image generation
- ✅ **Official SDK** - Better reliability and support
- ✅ **Fast response times**

## 🚨 **Troubleshooting**

### **If API Key Doesn't Work:**
1. **Check the key format** - Should start with `AIza`
2. **Verify billing** - Make sure billing is set up
3. **Check quotas** - Ensure you have available quota

### **If Payment Still Fails:**
1. **Try Google Pay** - Often more reliable
2. **Use a different Google account**
3. **Contact Google support**

### **Common Error Messages:**
```
"API key not valid" → Check your API key format
"Billing not set up" → Add payment method in Google AI Studio
"Quota exceeded" → Wait or upgrade plan
```

## 📞 **Google AI Studio Support**

- **Documentation**: https://ai.google.dev/
- **Support**: https://ai.google.dev/support
- **Community**: https://ai.google.dev/community

## 🎉 **Ready to Test!**

Once you have your Google AI API key:

1. **Add it to `.env.local`**
2. **Install the SDK:**
   ```bash
   npm install @google/genai
   ```
3. **Start your development server:**
   ```bash
   npm run dev
   ```
4. **Test the AI Image Generator**
5. **Try both endpoints to see which works better**

Google AI Studio is often much more reliable for payments than OpenAI/Anthropic! 🚀 