# Shadow Drive Filename Fix

## 🐛 **Problem Identified**

The metadata URL was showing "file not found" because:
- Filename contained special characters (`#`, spaces)
- URL encoding was causing issues (`#` became `%23`)
- Shadow Drive URLs need clean, URL-safe filenames

## ✅ **Solution Implemented**

### **1. Filename Cleaning Function**
```javascript
const cleanName = (name || 'metadata').replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
```

### **2. Clean Filename Examples**

**Before:**
```
"Candle Mascot #1754363321586" → "Candle Mascot #1754363321586.json"
URL: https://shdw-drive.genesysgo.net/.../Candle%20Mascot%20%231754363321586.json
```

**After:**
```
"Candle Mascot #1754363321586" → "Candle-Mascot-1754363321586-1754363482238.json"
URL: https://shdw-drive.genesysgo.net/.../Candle-Mascot-1754363321586-1754363482238.json
```

### **3. Added File Accessibility Verification**
- 2-second wait after upload
- Verification that file is accessible
- Better error handling and logging

## 🎯 **Benefits**

1. **✅ Clean URLs** - No URL encoding issues
2. **✅ Unique filenames** - Timestamp prevents conflicts
3. **✅ Better accessibility** - Files are verified after upload
4. **✅ Consistent naming** - Both images and metadata use same pattern

## 🧪 **Testing**

Run the test script to verify clean filename generation:
```bash
node test-clean-filenames.js
```

## 📁 **Files Modified**

1. **`app/api/upload-to-shadow-drive/route.ts`** - Added filename cleaning and verification
2. **`test-clean-filenames.js`** - Test script for filename cleaning
3. **`test-metadata-upload.js`** - Updated to use clean names

## 🚀 **Next Steps**

1. **Test the new implementation** by minting an NFT
2. **Verify the metadata URL** is accessible
3. **Check that the NFT metadata** loads correctly

The metadata URLs should now be clean and accessible without URL encoding issues! 