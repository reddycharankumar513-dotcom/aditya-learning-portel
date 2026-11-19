# LEARNOVA PAY — Mobile Payment Collection Application

**Learnova Pay** is a standalone, production-ready Android mobile application built with **Flutter**, **Dart**, and **Material Design 3** for authorized Learnova staff to collect in-person or on-the-spot payments.

It reuses the existing **Learnova** backend infrastructure, live Razorpay credentials (`rzp_live_U1gvxxE66eARkT`), server-side cryptographic HMAC-SHA256 verification, and MongoDB database.

---

## 1. Features & Architecture

- **Staff Authentication**:
  - Secure JWT session management.
  - Role-based authorization (`staff`, `admin`, `finance_admin`).
  - No public registration; strictly restricted to authorized staff accounts.
- **Main Payment Screen (Hand-Drawn UI Reference)**:
  - **A. Amount to Collect**: Currency symbol (₹), numeric input with decimal support (up to 2 places), bounds validation (₹1 to ₹5,00,000).
  - **B. Customer Name**: Clean text input with validation.
  - **C. Phone Number**: Indian 10-digit mobile number validation (`[6-9]\d{9}`).
  - **D. Pay Now**: Full-width brand purple button (`#8065FF`) with debounce and loading progress.
- **Razorpay Standard Checkout**:
  - Native Android checkout modal supporting **UPI (GPay, PhonePe, Paytm)**, **QR Code**, **Cards**, and **NetBanking**.
- **Server-Side Verification**:
  - Frontend receives Razorpay callback and posts payment ID, order ID, and signature to backend.
  - Backend verifies HMAC-SHA256 signature using `ENV.RAZORPAY_KEY_SECRET`.
  - Transaction recorded with `staffId`, `customerName`, `customerPhone`, and `paymentSource: 'mobile'`.
- **Payment Result Screen**:
  - Displays Verified Success, Failure, or Pending status with customer details and timestamp.
  - **Done** button resets form for the next payment collection.

---

## 2. Project Structure

```
mobile/
├── pubspec.yaml                 # Dependencies (razorpay_flutter, http, shared_preferences, intl)
├── analysis_options.yaml        # Flutter linter configuration
├── README.md                    # Setup and deployment documentation
├── android/
│   ├── app/
│   │   ├── build.gradle         # applicationId: com.learnova.pay, minSdk: 21, targetSdk: 34
│   │   ├── proguard-rules.pro   # Proguard obfuscation rules for Razorpay SDK
│   │   └── src/main/
│   │       ├── AndroidManifest.xml # Internet permissions & Razorpay Activity
│   │       └── kotlin/com/learnova/pay/MainActivity.kt
│   ├── build.gradle
│   ├── settings.gradle
│   └── gradle.properties
├── lib/
│   ├── main.dart                # App entrypoint & orientation lock
│   ├── app.dart                 # MaterialApp & Material 3 Theme (#8065FF)
│   ├── models/
│   │   ├── staff_user_model.dart # Staff user model & serialization
│   │   └── payment_model.dart    # PaymentOrder & PaymentResult models
│   ├── screens/
│   │   ├── login_screen.dart     # Staff login portal
│   │   ├── payment_screen.dart   # Main payment collection form
│   │   └── payment_result_screen.dart # Verified transaction receipt
│   ├── services/
│   │   ├── api_service.dart      # HTTP client with Bearer auth & timeout handling
│   │   ├── auth_service.dart     # Staff login/logout and session persistence
│   │   └── payment_service.dart  # Razorpay order creation & server verification
│   ├── utils/
│   │   ├── app_constants.dart    # Colors, endpoints, and storage keys
│   │   └── validators.dart       # Form validators (amount, name, Indian mobile)
│   └── widgets/
│       ├── payment_input.dart    # Material 3 rounded text inputs
│       └── payment_button.dart   # Full-width action button with spinner
└── test/
    ├── validators_test.dart      # Unit tests for input validation
    ├── payment_model_test.dart   # Unit tests for JSON serialization
    └── widget_test.dart          # Smoke tests
```

---

## 3. Backend Endpoints Reused & Added

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/staff/login` | Staff authentication with email/username & password | No |
| `POST` | `/api/payments/create-order` | Creates order on Razorpay for custom amount | Yes (JWT) |
| `POST` | `/api/payments/verify` | Cryptographically verifies HMAC-SHA256 signature | Yes (JWT) |
| `GET` | `/api/payments/:id/status` | Reconciles status by order ID or payment ID | Yes (JWT) |
| `POST` | `/api/webhooks/razorpay` | Razorpay webhook event processor | Webhook Secret |

---

## 4. How to Run Locally

### Prerequisites
- Flutter SDK `>= 3.0.0`
- Android Studio or Android SDK commandline-tools
- Java JDK 17

### Commands
```bash
# Navigate to mobile project
cd mobile

# Install dependencies
flutter pub get

# Run tests
flutter test

# Run on connected Android device or emulator
flutter run
```

---

## 5. How to Build Android APK & AppBundle

```bash
# Clean previous builds
flutter clean
flutter pub get

# Build Debug APK (for instant testing)
flutter build apk --debug
# Output: build/app/outputs/flutter-apk/app-debug.apk

# Build Release APK (for production distribution)
flutter build apk --release
# Output: build/app/outputs/flutter-apk/app-release.apk

# Build Android AppBundle (for Google Play Store)
flutter build appbundle --release
# Output: build/app/outputs/bundle/release/app-release.aab
```

---

## 6. Default Demo Staff Credentials

- **Email:** `staff@learnova.in`
- **Password:** `Staff@123456`
- **Admin Email:** `admin@aditya-ed.org`
- **Admin Password:** `Admin@123456`
