import '../models/payment_model.dart';
import '../utils/app_constants.dart';
import 'api_service.dart';

class PaymentService {
  static final PaymentService _instance = PaymentService._internal();
  factory PaymentService() => _instance;
  PaymentService._internal();

  final ApiService _api = ApiService();

  /// 1. Create Razorpay order on backend for mobile payment collection
  Future<PaymentOrder> createOrder({
    required double amount,
    required String customerName,
    required String customerPhone,
    String? notes,
  }) async {
    final response = await _api.post(
      AppConstants.endpointCreateOrder,
      {
        'amount': amount,
        'customerName': customerName.trim(),
        'customerPhone': customerPhone.trim(),
        'paymentSource': 'mobile',
        'itemType': 'mobile_collection',
        'notes': notes,
      },
      requiresAuth: true,
    );

    if (response is Map<String, dynamic> && response['success'] == true) {
      return PaymentOrder.fromJson(response);
    }

    throw ApiException(
      400,
      response['message'] ?? 'Failed to initiate Razorpay order on server.',
    );
  }

  /// 2. Verify payment signature with backend cryptographic HMAC
  Future<PaymentResult> verifyPayment({
    required String razorpayOrderId,
    required String razorpayPaymentId,
    required String razorpaySignature,
    required String customerName,
    required String customerPhone,
    required double amount,
  }) async {
    final response = await _api.post(
      AppConstants.endpointVerifyPayment,
      {
        'razorpayOrderId': razorpayOrderId,
        'razorpayPaymentId': razorpayPaymentId,
        'razorpaySignature': razorpaySignature,
      },
      requiresAuth: true,
    );

    if (response is Map<String, dynamic>) {
      return PaymentResult.fromJson(
        response,
        fallbackName: customerName,
        fallbackPhone: customerPhone,
        fallbackAmount: amount,
      );
    }

    throw ApiException(500, 'Invalid verification response from server.');
  }

  /// 3. Reconcile / check payment status on backend for uncertain transactions
  Future<PaymentResult> checkStatus({
    required String orderId,
    required String customerName,
    required String customerPhone,
    required double amount,
  }) async {
    final response = await _api.get(
      '${AppConstants.endpointPaymentStatus}/$orderId/status',
      requiresAuth: true,
    );

    if (response is Map<String, dynamic>) {
      return PaymentResult.fromJson(
        response,
        fallbackName: customerName,
        fallbackPhone: customerPhone,
        fallbackAmount: amount,
      );
    }

    throw ApiException(500, 'Could not retrieve payment status.');
  }
}
