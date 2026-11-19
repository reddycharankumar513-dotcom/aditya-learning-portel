import 'package:flutter_test/flutter_test.dart';
import 'package:learnova_pay/utils/validators.dart';

void main() {
  group('Validators Test Suite', () {
    test('Amount Validator: Rejects empty or null', () {
      expect(Validators.validateAmount(null), isNotNull);
      expect(Validators.validateAmount(''), isNotNull);
      expect(Validators.validateAmount('   '), isNotNull);
    });

    test('Amount Validator: Rejects non-numeric values', () {
      expect(Validators.validateAmount('abc'), isNotNull);
      expect(Validators.validateAmount('12a'), isNotNull);
    });

    test('Amount Validator: Rejects zero and negative amounts', () {
      expect(Validators.validateAmount('0'), isNotNull);
      expect(Validators.validateAmount('-100'), isNotNull);
      expect(Validators.validateAmount('0.00'), isNotNull);
    });

    test('Amount Validator: Accepts valid positive amounts and decimals', () {
      expect(Validators.validateAmount('100'), isNull);
      expect(Validators.validateAmount('499.50'), isNull);
      expect(Validators.validateAmount('1'), isNull);
      expect(Validators.validateAmount('500000'), isNull);
    });

    test('Amount Validator: Rejects more than 2 decimal places', () {
      expect(Validators.validateAmount('199.999'), isNotNull);
      expect(Validators.validateAmount('10.123'), isNotNull);
    });

    test('Amount Validator: Rejects amounts exceeding limit', () {
      expect(Validators.validateAmount('500001'), isNotNull);
      expect(Validators.validateAmount('1000000'), isNotNull);
    });

    test('Customer Name Validator: Validates length and characters', () {
      expect(Validators.validateCustomerName(''), isNotNull);
      expect(Validators.validateCustomerName('A'), isNotNull);
      expect(Validators.validateCustomerName('Charan Kumar'), isNull);
      expect(Validators.validateCustomerName('Dr. K. Sharma'), isNull);
      expect(Validators.validateCustomerName('John-Doe'), isNull);
      expect(Validators.validateCustomerName('User123!@#'), isNotNull);
    });

    test('Phone Validator: Enforces 10-digit Indian phone numbers', () {
      expect(Validators.validateCustomerPhone(''), isNotNull);
      expect(Validators.validateCustomerPhone('9876543210'), isNull);
      expect(Validators.validateCustomerPhone('+919876543210'), isNull);
      expect(Validators.validateCustomerPhone('09876543210'), isNull);
      expect(Validators.validateCustomerPhone('1234567890'), isNotNull); // doesn't start with 6-9
      expect(Validators.validateCustomerPhone('987654321'), isNotNull); // 9 digits
      expect(Validators.validateCustomerPhone('98765432100'), isNotNull); // 11 digits
    });

    test('Phone Normalizer: Strips +91 and leading zero correctly', () {
      expect(Validators.normalizePhone('+91 98765 43210'), '9876543210');
      expect(Validators.normalizePhone('09876543210'), '9876543210');
      expect(Validators.normalizePhone('9876543210'), '9876543210');
    });
  });
}
