import 'package:flutter_test/flutter_test.dart';
import 'package:learnova_pay/models/payment_model.dart';

void main() {
  group('Payment Model Test Suite', () {
    test('PaymentOrder.fromJson parses backend payload correctly', () {
      final json = {
        'success': true,
        'order': {
          'id': 'order_NqX123456789',
          'amount': 149900,
          'currency': 'INR',
          'keyId': 'rzp_live_U1gvxxE66eARkT',
          'customerName': 'Aarav Patel',
          'customerPhone': '9845123456',
          'priceRupees': 1499.0,
        },
        'paymentId': '673e21f4a9b1c2001',
      };

      final order = PaymentOrder.fromJson(json);

      expect(order.orderId, 'order_NqX123456789');
      expect(order.amountInPaise, 149900);
      expect(order.amountRupees, 1499.0);
      expect(order.currency, 'INR');
      expect(order.keyId, 'rzp_live_U1gvxxE66eARkT');
      expect(order.customerName, 'Aarav Patel');
      expect(order.customerPhone, '9845123456');
    });

    test('PaymentResult parses success response', () {
      final json = {
        'success': true,
        'message': 'Payment verified successfully and transaction recorded.',
        'payment': {
          'id': '673e21f4a9b1c2001',
          'razorpayOrderId': 'order_NqX123456789',
          'razorpayPaymentId': 'pay_NqY987654321',
          'customerName': 'Aarav Patel',
          'customerPhone': '9845123456',
          'amount': 1499.0,
          'status': 'success',
          'paidAt': '2026-11-19T10:00:00.000Z',
        },
      };

      final result = PaymentResult.fromJson(
        json,
        fallbackName: 'Fallback',
        fallbackPhone: '9999999999',
        fallbackAmount: 0,
      );

      expect(result.isSuccess, true);
      expect(result.razorpayPaymentId, 'pay_NqY987654321');
      expect(result.customerName, 'Aarav Patel');
      expect(result.amountPaid, 1499.0);
    });

    test('PaymentOrder handles direct checkout mode without orderId', () {
      final order = PaymentOrder(
        orderId: '',
        amountInPaise: 49900,
        amountRupees: 499.0,
        currency: 'INR',
        keyId: 'rzp_live_U1gvxxE66eARkT',
        customerName: 'Priya Sharma',
        customerPhone: '9876543210',
      );

      expect(order.orderId, isEmpty);
      expect(order.amountInPaise, 49900);
      expect(order.amountRupees, 499.0);
      expect(order.keyId, 'rzp_live_U1gvxxE66eARkT');
    });
  });
}
