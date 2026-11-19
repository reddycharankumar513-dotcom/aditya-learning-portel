import 'package:flutter/material.dart';

class AppConstants {
  // App Identity
  static const String appName = 'Learnova Pay';
  static const String appTagline = 'Instant Payment Collection';
  static const String appVersion = '1.0.0';

  // Backend API Base URL
  // Default points to live deployed Learnova backend, with localhost fallback for local testing
  static const String defaultApiUrl = 'https://aditya-learning-portel.vercel.app';
  static const String localApiUrl = 'http://10.0.2.2:5000'; // Standard Android Emulator localhost

  // Endpoints
  static const String endpointStaffLogin = '/api/staff/login';
  static const String endpointCreateOrder = '/api/payments/create-order';
  static const String endpointVerifyPayment = '/api/payments/verify';
  static const String endpointPaymentStatus = '/api/payments';
  static const String endpointStaffProfile = '/api/staff/profile';

  // Razorpay Configuration
  static const String defaultRazorpayKeyId = 'rzp_live_U1gvxxE66eARkT';
  static const String merchantName = 'LEARNOVA';
  static const String currencyINR = 'INR';

  // Brand Colors (Material 3 Learnova Palette)
  static const Color primaryPurple = Color(0xFF8065FF);
  static const Color primaryPurpleDark = Color(0xFF6C5CE7);
  static const Color primaryPurpleLight = Color(0xFFF3F0FF);
  static const Color accentCyan = Color(0xFF32C8F5);

  static const Color backgroundWhite = Color(0xFFFFFFFF);
  static const Color backgroundOffWhite = Color(0xFFF9FAFB);
  static const Color cardBackground = Color(0xFFFFFFFF);

  static const Color textPrimary = Color(0xFF1E2238);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color textMuted = Color(0xFF9CA3AF);

  static const Color inputBorder = Color(0xFFE5E7EB);
  static const Color inputBorderFocused = Color(0xFF8065FF);
  static const Color inputFill = Color(0xFFF9FAFB);

  static const Color statusSuccess = Color(0xFF10B981);
  static const Color statusSuccessLight = Color(0xFFECFDF5);
  static const Color statusError = Color(0xFFEF4444);
  static const Color statusErrorLight = Color(0xFFFEF2F2);
  static const Color statusPending = Color(0xFFF59E0B);
  static const Color statusPendingLight = Color(0xFFFFFBEB);

  // Storage Keys
  static const String keyAuthToken = 'learnova_staff_token';
  static const String keyStaffUser = 'learnova_staff_user';
  static const String keyApiUrl = 'learnova_api_url';
  static const String keyRazorpayKeyId = 'learnova_razorpay_key_id';

  // Validation Limits
  static const double minAmount = 1.0;
  static const double maxAmount = 500000.0;
  static const int phoneLength = 10;
}
