import 'app_constants.dart';

class Validators {
  /// Validates payment amount: required, numeric, decimal up to 2 places, > 0, <= 500,000
  static String? validateAmount(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Please enter the amount to collect';
    }

    final trimmed = value.trim();
    final amount = double.tryParse(trimmed);

    if (amount == null) {
      return 'Please enter a valid numeric amount';
    }

    if (amount <= 0) {
      return 'Amount must be greater than ₹0';
    }

    if (amount < AppConstants.minAmount) {
      return 'Minimum collection amount is ₹${AppConstants.minAmount.toInt()}';
    }

    if (amount > AppConstants.maxAmount) {
      return 'Amount exceeds maximum limit of ₹5,00,000';
    }

    // Decimal validation: at most 2 decimal digits
    if (trimmed.contains('.')) {
      final parts = trimmed.split('.');
      if (parts.length > 2 || parts[1].length > 2) {
        return 'Maximum two decimal places allowed (e.g. 199.50)';
      }
    }

    return null;
  }

  /// Validates customer name: required, min 2 characters, valid letters/spaces
  static String? validateCustomerName(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Please enter customer name';
    }

    final trimmed = value.trim();
    if (trimmed.length < 2) {
      return 'Customer name must be at least 2 characters';
    }

    if (trimmed.length > 100) {
      return 'Customer name cannot exceed 100 characters';
    }

    // Only allow letters, spaces, dots, hyphens
    final nameRegex = RegExp(r"^[a-zA-Z\s\.\-']+$");
    if (!nameRegex.test(trimmed)) {
      return 'Customer name should only contain letters and spaces';
    }

    return null;
  }

  /// Validates Indian 10-digit mobile number: numeric, 10 digits, starts with 6-9
  static String? validateCustomerPhone(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Please enter customer mobile number';
    }

    final digitsOnly = value.replaceAll(RegExp(r'[^0-9]'), '');

    // Normalize if entered with +91 or leading 0
    String normalized = digitsOnly;
    if (digitsOnly.length == 12 && digitsOnly.startsWith('91')) {
      normalized = digitsOnly.substring(2);
    } else if (digitsOnly.length == 11 && digitsOnly.startsWith('0')) {
      normalized = digitsOnly.substring(1);
    }

    if (normalized.length != AppConstants.phoneLength) {
      return 'Mobile number must be exactly 10 digits';
    }

    final phoneRegex = RegExp(r'^[6-9]\d{9}$');
    if (!phoneRegex.test(normalized)) {
      return 'Please enter a valid Indian mobile number (starts with 6-9)';
    }

    return null;
  }

  /// Normalizes phone number into clean 10-digit format
  static String normalizePhone(String value) {
    final digitsOnly = value.replaceAll(RegExp(r'[^0-9]'), '');
    if (digitsOnly.length == 12 && digitsOnly.startsWith('91')) {
      return digitsOnly.substring(2);
    } else if (digitsOnly.length == 11 && digitsOnly.startsWith('0')) {
      return digitsOnly.substring(1);
    }
    return digitsOnly;
  }

  /// Validates staff login identifier (email or username)
  static String? validateStaffIdentifier(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Please enter staff email or username';
    }
    if (value.trim().length < 3) {
      return 'Identifier must be at least 3 characters';
    }
    return null;
  }

  /// Validates password
  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your password';
    }
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  }
}
