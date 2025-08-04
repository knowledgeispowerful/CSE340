# Online Vacation Class Registration System

A modern, responsive web application for registering students in vacation classes with integrated payment processing via Flutterwave.

## Features

### 📚 **Subject Selection**
- 14 available subjects including:
  - English Language, Mathematics, Integrated Science
  - Social Studies, Literature in English, Government
  - History, Economics, Geography, French
  - Christian Religious Studies (CRS), Accounting
  - Business Management, Principles of Cost Accounting

### 💰 **Dynamic Pricing**
- Flexible pricing structure based on number of subjects:
  - 1 Subject: GH₵200
  - 2 Subjects: GH₵300
  - 3 Subjects: GH₵400
  - 4 Subjects: GH₵450
  - 5 Subjects: GH₵550
  - 6 Subjects: GH₵600
  - 7+ Subjects: GH₵700

### 👨‍👩‍👧‍👦 **Comprehensive Registration**
- Student information collection
- Parent/Guardian details
- Grade/Class selection (Primary 1 - SSS 3)
- Contact information and address

### 💳 **Payment Integration**
- **Card Payments**: Visa, Mastercard
- **Mobile Money**: MTN, Vodafone, AirtelTigo
- Powered by Flutterwave payment gateway
- Secure transaction processing

### ✨ **Modern UI/UX**
- Responsive design for all devices
- Beautiful gradient backgrounds
- Interactive form elements
- Real-time validation
- Smooth animations and transitions

## Setup Instructions

### 1. **File Structure**
```
vacation-class-registration/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md          # Documentation
```

### 2. **Flutterwave Configuration**

To enable payment processing, you need to configure Flutterwave:

1. **Sign up** at [Flutterwave](https://flutterwave.com/)
2. **Get your API keys** from the dashboard
3. **Update the public key** in `script.js`:

```javascript
// Replace this line in script.js (around line 200)
public_key: "FLWPUBK_TEST-XXXXXXXXXXXXXXXXXXXXXXXXXXXX-X",
// With your actual public key:
public_key: "FLWPUBK_TEST-your-actual-public-key-here",
```

### 3. **Testing Payments**

For testing purposes, use Flutterwave's test credentials:
- **Test Card**: 4187427415564246
- **CVV**: 828
- **Expiry**: 09/32
- **PIN**: 3310

For mobile money testing, use test phone numbers provided in Flutterwave documentation.

### 4. **Deployment**

#### **Option 1: Local Development**
1. Clone or download the files
2. Open `index.html` in a web browser
3. Start registering students!

#### **Option 2: Web Hosting**
1. Upload all files to your web hosting provider
2. Ensure HTTPS is enabled (required for payment processing)
3. Update Flutterwave settings to use production keys

## Configuration Options

### **Pricing Structure**
To modify pricing, edit the `pricingStructure` object in `script.js`:

```javascript
const pricingStructure = {
    1: 200,    // 1 subject price
    2: 300,    // 2 subjects price
    3: 400,    // 3 subjects price
    4: 450,    // 4 subjects price
    5: 550,    // 5 subjects price
    6: 600,    // 6 subjects price
    7: 700     // 7+ subjects price
};
```

### **Adding/Removing Subjects**
To modify available subjects, edit the subjects grid in `index.html`:

```html
<div class="subject-item">
    <input type="checkbox" id="new-subject" name="subjects" value="New Subject Name">
    <label for="new-subject">New Subject Name</label>
</div>
```

### **Customizing Appearance**
- **Colors**: Modify CSS variables in `styles.css`
- **Fonts**: Update the font-family in the body selector
- **Logo**: Replace the logo URL in the Flutterwave configuration

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Security Features

- ✅ Form validation (client-side and server-side ready)
- ✅ Secure payment processing via Flutterwave
- ✅ XSS protection through proper input handling
- ✅ HTTPS enforcement for payment processing

## API Integration

The system is designed to easily integrate with a backend API. Key integration points:

### **Registration Data Structure**
```javascript
{
    studentName: "John Doe",
    age: 15,
    grade: "sss1",
    parentName: "Jane Doe", 
    relationship: "parent",
    email: "jane@example.com",
    phone: "+233123456789",
    address: "123 Main St, Accra",
    subjects: ["Mathematics", "English Language"],
    totalAmount: 300,
    paymentReference: "VCS-1234567890-123",
    paymentId: "flw_tx_ref_123",
    paymentStatus: "successful",
    registrationDate: "2024-01-15T10:30:00.000Z"
}
```

### **Webhook Handling**
For production use, implement webhook handling to verify payments:

```javascript
// Example webhook endpoint
app.post('/webhook/flutterwave', (req, res) => {
    const signature = req.headers['verif-hash'];
    const payload = req.body;
    
    // Verify webhook signature
    // Update registration status
    // Send confirmation email
});
```

## Troubleshooting

### **Payment Issues**
- Ensure you're using the correct Flutterwave public key
- Check that HTTPS is enabled for production
- Verify test credentials for development

### **Form Validation**
- All required fields must be filled
- Email must be in valid format
- Phone number must be at least 10 digits
- At least one subject must be selected

### **Mobile Display**
- The system is fully responsive
- Test on various screen sizes
- Ensure touch targets are appropriate

## Support

For technical support or questions:
- Check the browser console for error messages
- Verify Flutterwave configuration
- Ensure all files are properly uploaded
- Test with different browsers

## License

This project is open source and available under the MIT License.

---

**Note**: Remember to replace the test Flutterwave public key with your actual production key before going live!