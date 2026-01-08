# Potato Disease Detection App 🥔🔬

A mobile application built with React Native (Expo) and FastAPI that uses machine learning to detect potato leaf diseases. The app can identify Early Blight, Late Blight, or determine if the plant is healthy, providing actionable treatment and prevention recommendations.

## 🌟 Features

- **Real-time Disease Detection**: Upload or capture potato leaf images for instant analysis
- **AI-Powered Classification**: Uses EfficientNetV2 TensorFlow Lite model for accurate predictions
- **Detailed Recommendations**: Get specific treatment and prevention advice for each disease
- **Confidence Scores**: View prediction confidence and all class probabilities
- **Cross-Platform**: Works on iOS and Android devices

## 📋 Prerequisites

### Backend Requirements
- Python 3.8+
- TensorFlow 2.x
- FastAPI
- Uvicorn
- PIL (Pillow)
- NumPy

### Frontend Requirements
- Node.js 14+
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device with Expo Go)

## 🚀 Installation

### 1. Backend Setup

```bash
# Install Python dependencies
pip install fastapi uvicorn tensorflow pillow numpy python-multipart

# Place your trained model file
# Ensure 'potato_leaf_efficientnetv2.tflite' is in the project root
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Install required Expo packages (if not already included)
npx expo install expo-image-picker expo-camera
```

## ⚙️ Configuration

### Backend Configuration (`backend.py`)

Update these variables if needed:

```python
MODEL_PATH = "potato_leaf_efficientnetv2.tflite"  # Path to your TFLite model
IMG_SIZE = 224  # Input image size for the model
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]  # Disease classes
```

### Frontend Configuration (`api.js`)

Update the API base URL with your backend server address:

```javascript
export const API_BASE_URL = 'http://YOUR_IP_ADDRESS:8000';
```

**Finding Your IP Address:**
- **Windows**: Run `ipconfig` in Command Prompt, look for IPv4 Address
- **Mac/Linux**: Run `ifconfig` or `ip addr`, look for your local network IP
- **Important**: Your mobile device must be on the same network as your backend server

## 🏃 Running the Application

### Start the Backend Server

```bash
# Run from the project directory
python backend.py

# Server will start at http://0.0.0.0:8000
# API documentation available at http://localhost:8000/docs
```

### Start the Frontend App

```bash
# Start the Expo development server
npx expo start

# Then choose your platform:
# - Press 'a' for Android emulator
# - Press 'i' for iOS simulator
# - Scan QR code with Expo Go app on your phone
```

## 📡 API Endpoints

### Health Check
```
GET /
GET /health
```
Returns API status and model loading state.

### Disease Prediction
```
POST /predict
Content-Type: multipart/form-data
Body: file (image file)
```
Accepts an image and returns disease prediction with recommendations.

**Response Format:**
```json
{
  "success": true,
  "prediction": {
    "disease": "Early Blight",
    "confidence": 95.67,
    "all_predictions": {
      "Early Blight": 95.67,
      "Late Blight": 3.21,
      "Healthy": 1.12
    }
  },
  "recommendation": {
    "description": "Disease description...",
    "treatment": ["Treatment step 1", "Treatment step 2"],
    "prevention": ["Prevention step 1", "Prevention step 2"]
  }
}
```

### Get Disease Classes
```
GET /classes
```
Returns available disease classification classes.

## 🗂️ Project Structure

```
potato-disease-detection/
│
├── backend.py                 # FastAPI backend server
├── api.js                     # Frontend API configuration
├── potato_leaf_efficientnetv2.tflite  # Trained ML model
├── app/                       # Expo app directory
│   ├── (tabs)/               # Tab navigation screens
│   └── index.js              # Main app entry
├── package.json              # Node dependencies
└── README.md                 # This file
```

## 🧪 Testing the API

You can test the backend independently using cURL or the automatic API documentation:

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test prediction with an image
curl -X POST "http://localhost:8000/predict" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@potato_leaf.jpg"

# Or visit http://localhost:8000/docs for interactive API testing
```

## 🎯 Disease Information

### Early Blight
- **Cause**: Fungus *Alternaria solani*
- **Symptoms**: Dark brown spots with concentric rings on older leaves
- **Treatment**: Fungicides (chlorothalonil, mancozeb), remove infected debris
- **Prevention**: Crop rotation, disease-resistant varieties, proper spacing

### Late Blight
- **Cause**: *Phytophthora infestans*
- **Symptoms**: Water-soaked spots turning brown, rapid spread in cool/wet conditions
- **Treatment**: Copper-based fungicides, immediate removal of infected plants
- **Prevention**: Certified disease-free seeds, resistant varieties, monitoring

### Healthy
- **Status**: No disease detected
- **Maintenance**: Continue regular monitoring and good agricultural practices

## 🔧 Troubleshooting

### Backend Issues

**Model not loading:**
- Verify `potato_leaf_efficientnetv2.tflite` exists in the correct path
- Check file permissions
- Ensure TensorFlow is properly installed

**CORS errors:**
- Backend already configured with permissive CORS for development
- For production, restrict `allow_origins` to specific domains

### Frontend Issues

**Cannot connect to backend:**
- Verify backend is running (`http://YOUR_IP:8000` in browser)
- Update `API_BASE_URL` in `api.js` with correct IP address
- Ensure mobile device and backend are on same WiFi network
- Check firewall settings aren't blocking port 8000

**Image upload fails:**
- Check camera/photo library permissions in device settings
- Verify image format is supported (JPEG, PNG)
- Check image file size (very large files may timeout)

## 📱 Mobile Permissions

The app requires the following permissions:
- **Camera**: To capture photos of potato leaves
- **Photo Library**: To upload existing images

These will be requested automatically when needed.

## 📱 Building and Distributing APK

### Building Android APK

There are two main ways to build an APK for your Expo app:

#### Option 1: Using EAS Build (Recommended)

EAS (Expo Application Services) is the modern way to build Expo apps.

**Step 1: Install EAS CLI**
```bash
npm install -g eas-cli
```

**Step 2: Login to Expo**
```bash
eas login
```

**Step 3: Configure EAS Build**
```bash
# Initialize EAS in your project
eas build:configure
```

**Step 4: Build APK**
```bash
# Build APK for Android
eas build --platform android --profile preview

# For production build
eas build --platform android --profile production
```

The build will happen in the cloud and you'll get a download link for your APK when it's done.

#### Option 2: Local Build (Classic Method)

**Step 1: Install Expo CLI**
```bash
npm install -g expo-cli
```

**Step 2: Build APK Locally**
```bash
# This requires Android Studio and SDK installed
npx expo run:android --variant release
```

**Step 3: Find Your APK**
The APK will be located at:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Configuring app.json for Production

Update your `app.json` file before building:

```json
{
  "expo": {
    "name": "Potato Disease Detection",
    "slug": "potato-disease-detection",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "android": {
      "package": "com.yourcompany.potatodisease",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

### Creating eas.json Configuration

Create `eas.json` in your project root:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

## 🌐 Distributing Your APK on the Internet

### Method 1: Direct APK Distribution (Easiest)

#### A. Using File Hosting Services

**Google Drive:**
1. Upload your APK to Google Drive
2. Right-click → Share → Change to "Anyone with the link"
3. Copy the share link
4. Share the link with users

**Dropbox:**
1. Upload APK to Dropbox
2. Create a share link
3. Change `dl=0` to `dl=1` in the URL for direct download

**MediaFire / Mega:**
1. Upload APK
2. Get public download link
3. Share with users

#### B. Using GitHub Releases (Free and Professional)

1. **Push your code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/potato-disease-app.git
git push -u origin main
```

2. **Create a Release**
   - Go to your GitHub repository
   - Click "Releases" → "Create a new release"
   - Tag: `v1.0.0`
   - Title: "Potato Disease Detection v1.0.0"
   - Upload your APK file
   - Click "Publish release"

3. **Share the Download Link**
   - Users can download from: `https://github.com/yourusername/potato-disease-app/releases`

#### C. Using Firebase App Distribution (Free)

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
firebase login
```

2. **Initialize Firebase**
```bash
firebase init
# Select "App Distribution"
```

3. **Upload APK**
```bash
firebase appdistribution:distribute app-release.apk \
  --app YOUR_APP_ID \
  --groups "testers" \
  --release-notes "Initial release of Potato Disease Detection"
```

4. **Share with Testers**
   - Testers receive email with download link
   - They can install directly from browser

### Method 2: Self-Hosted Website

Create a simple download page:

**Create `index.html`:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Download Potato Disease Detection App</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
        }
        .download-btn {
            background-color: #4CAF50;
            color: white;
            padding: 15px 32px;
            text-decoration: none;
            font-size: 18px;
            border-radius: 8px;
            display: inline-block;
            margin-top: 20px;
        }
        .download-btn:hover {
            background-color: #45a049;
        }
        .warning {
            background-color: #fff3cd;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>🥔 Potato Disease Detection App</h1>
    <p>Detect potato leaf diseases using AI</p>
    
    <div class="warning">
        <strong>⚠️ Installation Note:</strong>
        <p>You need to enable "Install from Unknown Sources" in your Android settings to install this app.</p>
    </div>
    
    <a href="potato-disease-detection.apk" class="download-btn" download>
        📥 Download APK (v1.0.0)
    </a>
    
    <h2>Installation Instructions</h2>
    <ol style="text-align: left;">
        <li>Download the APK file</li>
        <li>Open the downloaded file</li>
        <li>If prompted, enable "Install from Unknown Sources"</li>
        <li>Tap "Install"</li>
        <li>Open the app and start detecting diseases!</li>
    </ol>
    
    <h2>Features</h2>
    <ul style="text-align: left;">
        <li>✅ Detect Early Blight</li>
        <li>✅ Detect Late Blight</li>
        <li>✅ Identify Healthy Plants</li>
        <li>✅ Get Treatment Recommendations</li>
        <li>✅ Prevention Tips</li>
    </ul>
</body>
</html>
```

**Deploy to Free Hosting:**

- **Netlify**: 
  ```bash
  # Install Netlify CLI
  npm install -g netlify-cli
  
  # Deploy
  netlify deploy --prod
  # Upload your HTML file and APK when prompted
  ```

- **Vercel**:
  ```bash
  npx vercel --prod
  ```

- **GitHub Pages**:
  ```bash
  # Create gh-pages branch
  git checkout -b gh-pages
  git add index.html potato-disease-detection.apk
  git commit -m "Add download page"
  git push origin gh-pages
  
  # Access at: https://yourusername.github.io/potato-disease-app
  ```

### Method 3: Google Play Store (Official)

For official distribution:

1. **Create Google Play Developer Account** ($25 one-time fee)
2. **Build App Bundle** (not APK)
   ```bash
   eas build --platform android --profile production
   ```
3. **Create App Listing**
   - Screenshots
   - Description
   - Privacy Policy
   - Content Rating
4. **Upload AAB File**
5. **Submit for Review**

### Method 4: Third-Party App Stores

Distribute on alternative stores:
- **APKPure** - Free submission
- **Aptoide** - Free app store
- **Amazon Appstore** - Reach Amazon device users
- **Samsung Galaxy Store** - For Samsung devices

## 📋 Installation Instructions for Users

Share these instructions with your APK:

### For Android Users:

1. **Enable Unknown Sources**
   - Go to Settings → Security
   - Enable "Unknown Sources" or "Install Unknown Apps"
   - Allow installation from your browser/file manager

2. **Download the APK**
   - Click the download link
   - Wait for download to complete

3. **Install the App**
   - Open Downloads folder
   - Tap on the APK file
   - Tap "Install"
   - Wait for installation

4. **Open and Use**
   - Find "Potato Disease Detection" in your app drawer
   - Grant Camera and Storage permissions
   - Start detecting diseases!

## ⚠️ Important Notes

### Security Warning
When users install your APK outside Google Play, Android will show a warning. This is normal. You can:
- Add a note explaining this is expected
- Consider code signing your APK for verification
- Eventually publish to Play Store for wider trust

### Backend Requirement
Remember to:
- ✅ Deploy your backend (see Backend Deployment section)
- ✅ Update API URL in `api.js` before building
- ✅ Test the complete flow before distributing

### Update Process
When releasing updates:
1. Increment `versionCode` in `app.json`
2. Update `version` string (e.g., "1.0.0" → "1.1.0")
3. Build new APK
4. Upload to same distribution channel
5. Notify users of update

## 🌐 Web Deployment

You can deploy this application to the web for easier access. Here's how:

### Option 1: Convert Expo App to Web

Expo supports web out of the box! To run your app on web:

```bash
# Install web dependencies
npx expo install react-native-web react-dom @expo/webpack-config

# Run on web
npx expo start --web

# Build for web production
npx expo export:web
```

The web build will be in the `web-build` directory. Deploy this to any static hosting service:
- **Vercel**: `npx vercel --prod`
- **Netlify**: Drag and drop the `web-build` folder
- **GitHub Pages**: Push to gh-pages branch
- **Firebase Hosting**: `firebase deploy`

### Option 2: Create a Separate Web Interface

For a custom web interface, create a simple React app:

```bash
# Create new React app
npx create-react-app potato-disease-web
cd potato-disease-web

# Install dependencies
npm install axios
```

**Create a simple web UI** (`src/App.js`):

```javascript
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://your-backend-url.com'; // Update this

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>🥔 Potato Disease Detection</h1>
        <p>Upload a potato leaf image for disease analysis</p>
      </header>

      <main>
        <form onSubmit={handleSubmit}>
          <div className="upload-section">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="file-input"
            />
            <label htmlFor="file-input" className="upload-btn">
              Choose Image
            </label>
          </div>

          {preview && (
            <div className="preview">
              <img src={preview} alt="Preview" />
            </div>
          )}

          <button 
            type="submit" 
            disabled={!image || loading}
            className="analyze-btn"
          >
            {loading ? 'Analyzing...' : 'Analyze Image'}
          </button>
        </form>

        {result && (
          <div className="results">
            <h2>Results</h2>
            <div className="prediction">
              <h3>Disease: {result.prediction.disease}</h3>
              <p className="confidence">
                Confidence: {result.prediction.confidence}%
              </p>
            </div>

            <div className="recommendations">
              <h3>Description</h3>
              <p>{result.recommendation.description}</p>

              <h3>Treatment</h3>
              <ul>
                {result.recommendation.treatment.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>

              <h3>Prevention</h3>
              <ul>
                {result.recommendation.prevention.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
```

Then deploy with:
```bash
npm run build
# Deploy the 'build' folder to your hosting service
```

### Backend Deployment for Web

Deploy your FastAPI backend to a cloud service:

#### Option A: Render (Easiest - Free Tier Available)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and create a new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend:app --host 0.0.0.0 --port $PORT`
5. Add your `.tflite` model file to the repository
6. Deploy!

Create `requirements.txt`:
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
tensorflow==2.15.0
pillow==10.1.0
numpy==1.24.3
python-multipart==0.0.6
```

#### Option B: Railway

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Deploy: `railway up`
5. Add domain: `railway domain`

#### Option C: Google Cloud Run

```bash
# Create Dockerfile
cat > Dockerfile << EOF
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "backend:app", "--host", "0.0.0.0", "--port", "8080"]
EOF

# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT_ID/potato-disease
gcloud run deploy --image gcr.io/PROJECT_ID/potato-disease --platform managed
```

#### Option D: Heroku

```bash
# Create Procfile
echo "web: uvicorn backend:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy
heroku create potato-disease-api
git push heroku main
```

### Complete Web Deployment Checklist

- [ ] Deploy backend to cloud service (Render, Railway, etc.)
- [ ] Get backend URL (e.g., `https://your-app.onrender.com`)
- [ ] Update CORS settings in `backend.py` to allow your web domain
- [ ] Build web frontend with updated API URL
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Test end-to-end functionality
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS (usually automatic on these platforms)

### Environment Variables for Production

Update your backend for production:

```python
import os

# Use environment variable for production
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Set in your hosting platform:
- `ALLOWED_ORIGINS=https://your-frontend-domain.com`

## 🚀 Mobile App Deployment

### Backend Deployment
For production deployment, consider:
- Using a production ASGI server (Gunicorn with Uvicorn workers)
- Adding authentication and rate limiting
- Hosting on cloud platforms (AWS, Google Cloud, Azure, Heroku)
- Using environment variables for configuration

### Frontend Deployment
Build standalone apps:
```bash
# Build for production
npx expo build:android
npx expo build:ios

# Or use EAS Build
eas build --platform android
eas build --platform ios
```

## 📄 License

This project is provided as-is for educational and agricultural purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review FastAPI docs: https://fastapi.tiangolo.com
3. Review Expo docs: https://docs.expo.dev

---

**Built with ❤️ for farmers and agricultural professionals**