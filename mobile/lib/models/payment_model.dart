class PaymentOrder {
  final String orderId;
  final int amountInPaise;
  final double amountRupees;
  final String currency;
  final String keyId;
  final String customerName;
  final String customerPhone;
  final String? receipt;
  final String? paymentId;

  const PaymentOrder({
    required this.orderId,
    required this.amountInPaise,
    required this.amountRupees,
    required this.currency,
    required this.keyId,
    required this.customerName,
    required this.customerPhone,
    this.receipt,
    this.paymentId,
  });

  factory PaymentOrder.fromJson(Map<String, dynamic> json) {
    final order = json['order'] ?? json;
    final int amountPaise = (order['amount'] is num)
        ? (order['amount'] as num).toInt()
        : int.tryParse(order['amount'].toString()) ?? 0;

    final double priceRupees = (order['priceRupees'] is num)
        ? (order['priceRupees'] as num).toDouble()
        : (amountPaise / 100.0);

    return PaymentOrder(
      orderId: order['id'] ?? order['razorpayOrderId'] ?? '',
      amountInPaise: amountPaise,
      amountRupees: priceRupees,
      currency: order['currency'] ?? 'INR',
      keyId: order['keyId'] ?? '',
      customerName: order['customerName'] ?? '',
      customerPhone: order['customerPhone'] ?? '',
      receipt: order['receipt'],
      paymentId: json['paymentId']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'orderId': orderId,
      'amountInPaise': amountInPaise,
      'amountRupees': amountRupees,
      'currency': currency,
      'keyId': keyId,
      'customerName': customerName,
      'customerPhone': customerPhone,
      'receipt': receipt,
      'paymentId': paymentId,
    };
  }
}

enum PaymentStatus {
  success,
  failed,
  pending,
}

class PaymentResult {
  final PaymentStatus status;
  final String? razorpayPaymentId;
  final String? razorpayOrderId;
  final String? razorpaySignature;
  final String customerName;
  final String customerPhone;
  final double amountPaid;
  final String currency;
  final DateTime timestamp;
  final String? errorMessage;
  final String? receiptId;

  const PaymentResult({
    required this.status,
    this.razorpayPaymentId,
    this.razorpayOrderId,
    this.razorpaySignature,
    required this.customerName,
    required this.customerPhone,
    required this.amountPaid,
    this.currency = 'INR',
    required this.timestamp,
    this.errorMessage,
    this.receiptId,
  });

  bool get isSuccess => status == PaymentStatus.success;
  bool get isFailed => status == PaymentStatus.failed;
  bool get isPending => status == PaymentStatus.pending;

  factory PaymentResult.fromJson(Map<String, dynamic> json, {
    required String fallbackName,
    required String fallbackPhone,
    required double fallbackAmount,
  }) {
    final payment = json['payment'] ?? json;
    final rawStatus = (payment['status'] ?? 'pending').toString().toLowerCase();

    PaymentStatus parsedStatus;
    if (rawStatus == 'success' || rawStatus == 'captured') {
      parsedStatus = PaymentStatus.success;
    } else if (rawStatus == 'failed') {
      parsedStatus = PaymentStatus.failed;
    } else {
      parsedStatus = PaymentStatus.pending;
    }

    final double amount = (payment['amount'] is num)
        ? (payment['amount'] as num).toDouble()
        : fallbackAmount;

    return PaymentResult(
      status: parsedStatus,
      razorpayPaymentId: payment['razorpayPaymentId'] ?? json['razorpayPaymentId'],
      razorpayOrderId: payment['razorpayOrderId'] ?? json['razorpayOrderId'],
      razorpaySignature: payment['razorpaySignature'],
      customerName: payment['customerName'] ?? fallbackName,
      customerPhone: payment['customerPhone'] ?? fallbackPhone,
      amountPaid: amount,
      currency: payment['currency'] ?? 'INR',
      timestamp: payment['paidAt'] != null
          ? DateTime.tryParse(payment['paidAt'].toString()) ?? DateTime.now()
          : DateTime.now(),
      errorMessage: json['message'] ?? json['error'],
      receiptId: payment['receiptId'],
    );
  }
}
