# DALL-E 3 Setup Guide for Candle TV Mascot Creator

## Overview

This guide will help you set up OpenAI's DALL-E 3 for image generation in your Candle TV Mascot Creator application. DALL-E 3 is the latest and most advanced image generation model from OpenAI, perfect for creating high-quality mascot images.

## Why DALL-E 3?

### Advantages:
- **Superior Quality**: Best-in-class image generation
- **Better Understanding**: More accurate interpretation of complex prompts
- **Consistent Style**: Better at maintaining character consistency
- **Professional Results**: Suitable for branding and commercial use

### Pricing (as of 2024):
- **1024×1024 images**: $0.040 per image
- **1024×1792 or 1792×1024 images**: $0.080 per image
- **With $30 budget**: 750 images (1024×1024) or 375 images (higher resolution)

## Step-by-Step Setup

### 1. Create OpenAI Account

1. **Visit OpenAI Platform**
   - Go to [https://platform.openai.com/](https://platform.openai.com/)
   - Click "Sign Up" or log in to existing account

2. **Complete Account Setup**
   - Verify your email address
   - Add a phone number for security
   - Complete any required verification steps

### 2. Get Your API Key

1. **Navigate to API Keys**
   - Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Click "Create new secret key"

2. **Create API Key**
   - Give your key a descriptive name (e.g., "Candle TV Mascot Creator")
   - Click "Create secret key"
   - **IMPORTANT**: Copy the key immediately - you won't see it again!

3. **Store Securely**
   - Save the key in a secure password manager
   - Never share it publicly or commit it to version control

### 3. Add Credit to Your Account

1. **Access Billing**
   - Go to [https://platform.openai.com/account/billing](https://platform.openai.com/account/billing)
   - Click "Add payment method"

2. **Add Payment Method**
   - Enter your credit card information
   - Verify your payment method

3. **Add Credit**
   - Click "Add credit"
   - Add $30 to your account
   - This will give you 750 image generations at 1024×1024 resolution

### 4. Set Usage Limits

1. **Configure Limits**
   - Go to [https://platform.openai.com/account/limits](https://platform.openai.com/account/limits)
   - Set daily spending limit to $1-2
   - Set monthly limit to $30
   - This prevents unexpected charges

2. **Monitor Usage**
   - Check your usage dashboard regularly
   - Track spending to stay within budget

### 5. Update Your Application

1. **Environment Variables**
   ```env
   OPENAI_API_KEY=your_api_key_here
   ```

2. **Test the Integration**
   - Run your application
   - Try generating a test image
   - Verify the API key is working correctly

## Usage Guidelines

### Budget Management

**With $30 budget, you can generate:**
- **750 images** at 1024×1024 resolution
- **375 images** at higher resolution (1792×1024)

**Recommended approach:**
- Start with 1024×1024 images to maximize your budget
- Use higher resolution only for final, important designs
- Monitor usage regularly

### Best Practices

1. **Prompt Engineering**
   - Be specific about colors, clothing, accessories
   - Include "cute" or "friendly" for better character style
   - Mention "cartoon" or "mascot" for appropriate style
   - Keep descriptions clear and concise

2. **Quality Optimization**
   - Use detailed descriptions for better results
   - Include specific color schemes (orange/black for Candle TV)
   - Mention character personality traits
   - Specify clothing and accessory details

3. **Cost Control**
   - Test prompts in OpenAI playground first
   - Batch generate multiple variations
   - Save successful prompts for reuse
   - Set up usage alerts

### Example Prompts

**Good prompts:**
- "A cute orange mascot with black eyes, wearing a blue shirt and black pants, cartoon style"
- "A friendly cartoon character with round glasses, orange hat, and a bowtie, mascot design"
- "A cute mascot with green eyes, purple shirt, and a crown accessory, simple background"

**Avoid:**
- Vague descriptions like "a mascot"
- Complex backgrounds or scenes
- Multiple characters in one image
- Text or logos in the image

## Troubleshooting

### Common Issues

1. **API Key Errors**
   - Verify the key is correct and complete
   - Check that the key has proper permissions
   - Ensure the key is properly set in environment variables

2. **Billing Issues**
   - Check your account balance
   - Verify payment method is active
   - Contact OpenAI support if needed

3. **Content Policy Violations**
   - Avoid inappropriate or copyrighted content
   - Keep prompts family-friendly
   - Don't request specific brand logos or trademarks

4. **Rate Limits**
   - DALL-E 3 has rate limits per minute
   - Implement proper error handling
   - Add delays between requests if needed

### Error Handling

The application includes error handling for:
- Billing issues (402 status)
- Content policy violations (400 status)
- Network errors (500 status)
- Invalid API keys (401 status)

## Monitoring and Analytics

### Track Usage
- Monitor your OpenAI dashboard regularly
- Set up usage alerts
- Track cost per image generation
- Analyze which prompts work best

### Performance Metrics
- Success rate of image generation
- User satisfaction with generated images
- Cost per successful generation
- Most popular prompt types

## Security Considerations

1. **API Key Security**
   - Never expose API keys in client-side code
   - Use environment variables
   - Rotate keys regularly
   - Monitor for unauthorized usage

2. **Rate Limiting**
   - Implement proper rate limiting
   - Add delays between requests
   - Handle rate limit errors gracefully

3. **Content Filtering**
   - Validate user inputs
   - Filter inappropriate content
   - Implement content moderation

## Next Steps

1. **Test the Integration**
   - Generate a few test images
   - Verify the quality meets your needs
   - Adjust prompts as needed

2. **Optimize for Your Use Case**
   - Refine prompts for Candle TV branding
   - Create prompt templates
   - Build a library of successful prompts

3. **Scale Responsibly**
   - Monitor costs closely
   - Implement user limits if needed
   - Consider premium features for advanced users

## Support Resources

- **OpenAI Documentation**: [https://platform.openai.com/docs](https://platform.openai.com/docs)
- **DALL-E 3 Guide**: [https://platform.openai.com/docs/guides/images](https://platform.openai.com/docs/guides/images)
- **API Reference**: [https://platform.openai.com/docs/api-reference/images](https://platform.openai.com/docs/api-reference/images)
- **Community Forum**: [https://community.openai.com/](https://community.openai.com/)

---

**Remember**: Start small, monitor usage, and optimize your prompts for the best results within your budget! 