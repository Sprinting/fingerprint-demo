# 🔍 Incognito Fingerprint Tracker Demo

A  browser fingerprinting demonstration that reveals how websites can uniquely identify users even in Incognito/Private browsing mode, without using traditional cookies or local storage.

##  Live Demo

Open `index.html` in your browser to see the demo in action.

##  Overview

This project demonstrates advanced browser fingerprinting techniques that collect various browser and system characteristics to create a unique "fingerprint" for identification. The demo shows how your browser can be tracked across different sessions, even when using private/incognito mode.

##  Features

### Core Functionality
- **Stable Fingerprint ID**: Generates a SHA-256 hash from core browser attributes that remain consistent across normal and incognito sessions
- **Comprehensive Attribute Collection**: Gathers 12+ different browser characteristics
- **Real-time Comparison**: Compare fingerprints between different browsing sessions
- **Visual Feedback**: Color-coded results showing matches and mismatches

### Collected Attributes

#### Core Stable Attributes (used for Stable ID):
- **User Agent String**: Browser version and system information
- **Languages**: Browser language preferences
- **Screen Resolution & Color Depth**: Display characteristics
- **Timezone**: System timezone setting
- **Hardware Concurrency**: Number of CPU cores
- **Platform**: Operating system
- **WebGL Renderer & Vendor**: Graphics card information
- **Installed Fonts**: Detection of common system fonts

#### Additional Attributes (for similarity scoring):
- **Canvas Fingerprint**: Unique rendering characteristics
- **Audio Fingerprint**: Audio processing signature
- **Browser Plugins**: Installed browser extensions/plugins
- **Do Not Track**: Privacy setting status

##  How It Works

1. **Data Collection**: The script collects various browser and system attributes using JavaScript APIs
2. **Stable ID Generation**: Core attributes are combined and hashed using SHA-256 to create a consistent identifier
3. **Comparison Engine**: Uses weighted scoring to compare fingerprints and determine similarity
4. **Visual Analysis**: Results are displayed with color-coding and detailed breakdowns


### Browser Compatibility
- Modern browsers with Web Crypto API support
- WebGL-enabled browsers (most modern browsers)
- Audio Context support (Chrome, Firefox, Safari, Edge)

### Testing Across Sessions
1. **Normal to Incognito**: 
   - Copy your fingerprint in normal mode
   - Open an incognito/private window
   - Navigate to the demo and paste the fingerprint
   - Click "Compare Fingerprints" to see the results

2. **Different Browsers**:
   - Test the same process across different browsers
   - Compare results to see browser-specific differences

3. **Different Devices**:
   - Copy fingerprint data between devices
   - Analyze hardware and software differences

##  Understanding Results

### Stable Fingerprint ID
- **Matched**: Same core browser signature (high probability of same browser/system)
- **Mismatched**: Different core signatures (likely different browser/system)

### Similarity Scoring
- **95%+**: Very High Confidence Match
- **80-95%**: High Confidence Match  
- **60-80%**: Medium Confidence Match
- **40-60%**: Low Confidence Match
- **<40%**: Likely Different Browsers/Sessions

### Attribute Weights
Different attributes have varying importance in the scoring algorithm:
- WebGL (12 points): Most stable and unique
- Fonts (10 points): Highly distinctive
- Audio (8 points): Consistent across sessions
- User Agent (7 points): Detailed browser info
- Canvas (5 points): Can vary with rendering conditions
- Screen Info (5 points): Hardware-dependent
- Platform (5 points): Operating system
- Timezone (4 points): Geographic indicator
- Languages (3 points): User preferences
- Plugins (2 points): Can change frequently
- Hardware Concurrency (2 points): CPU cores
- Do Not Track (1 point): Privacy setting

##  Privacy Implications

### What This Demo Reveals
- **Incognito ≠ Anonymous**: Private browsing doesn't prevent fingerprinting
- **Persistent Tracking**: Users can be re-identified across sessions without cookies
- **Cross-Site Tracking**: Same fingerprint works across different websites
- **Device Fingerprinting**: Hardware characteristics are exposed

### Limitations
- **Network Changes**: VPNs don't affect browser fingerprinting
- **Browser Updates**: Major updates may change fingerprints
- **Privacy Tools**: Some extensions can modify or block fingerprinting
- **Deliberate Spoofing**: Advanced users can modify browser characteristics

##  Mitigation Strategies

### For Users
- Use browsers with fingerprinting protection (Firefox, Brave)
- Install privacy-focused extensions (uBlock Origin, Privacy Badger)
- Regularly update browsers to get latest privacy features
- Consider using Tor Browser for maximum anonymity

### For Developers
- Implement this responsibly and with user consent
- Consider privacy-by-design principles
- Provide clear privacy policies
- Offer opt-out mechanisms where possible

##  Ethical Considerations

This demo is created for **educational purposes** to raise awareness about browser fingerprinting and online privacy. 

### Responsible Use
- **Educational**: Help users understand privacy implications
- **Research**: Academic research on web privacy
- **Security Testing**: Assess fingerprinting vulnerabilities


**Disclaimer**: This tool is designed for educational and research purposes. Users should be aware of privacy implications and use responsibly. Always respect user privacy and comply with applicable privacy laws and regulations.
