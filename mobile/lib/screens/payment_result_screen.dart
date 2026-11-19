import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/payment_model.dart';
import '../services/payment_service.dart';
import '../utils/app_constants.dart';
import '../widgets/payment_button.dart';

class PaymentResultScreen extends StatefulWidget {
  final PaymentResult result;

  const PaymentResultScreen({
    super.key,
    required this.result,
  });

  @override
  State<PaymentResultScreen> createState() => _PaymentResultScreenState();
}

class _PaymentResultScreenState extends State<PaymentResultScreen> {
  late PaymentResult _currentResult;
  final PaymentService _paymentService = PaymentService();
  bool _isRechecking = false;
  final NumberFormat _currencyFormat = NumberFormat.currency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 2,
  );

  @override
  void initState() {
    super.initState();
    _currentResult = widget.result;
  }

  Future<void> _recheckStatus() async {
    if (_currentResult.razorpayOrderId == null) return;

    setState(() => _isRechecking = true);
    try {
      final updated = await _paymentService.checkStatus(
        orderId: _currentResult.razorpayOrderId!,
        customerName: _currentResult.customerName,
        customerPhone: _currentResult.customerPhone,
        amount: _currentResult.amountPaid,
      );

      if (mounted) {
        setState(() => _currentResult = updated);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to recheck status: ${e.toString()}'),
            backgroundColor: AppConstants.statusError,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isRechecking = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        Navigator.pop(context, true); // return true to reset form
        return false;
      },
      child: Scaffold(
        backgroundColor: AppConstants.backgroundWhite,
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            child: Column(
              children: [
                const Spacer(),

                // Status Icon & Title
                if (_currentResult.isSuccess) ...[
                  _buildSuccessCard(),
                ] else if (_currentResult.isFailed) ...[
                  _buildFailedCard(),
                ] else ...[
                  _buildPendingCard(),
                ],

                const Spacer(),

                // Bottom Action Button
                if (_currentResult.isSuccess) ...[
                  PaymentButton(
                    text: 'Done — Next Collection',
                    onPressed: () {
                      Navigator.pop(context, true); // resets form
                    },
                    icon: Icons.check_circle_outline_rounded,
                  ),
                ] else if (_currentResult.isFailed) ...[
                  PaymentButton(
                    text: 'Retry Payment',
                    backgroundColor: AppConstants.statusError,
                    onPressed: () {
                      Navigator.pop(context, false); // allows retry with existing details
                    },
                    icon: Icons.replay_rounded,
                  ),
                  const SizedBox(height: 12),
                  TextButton(
                    onPressed: () => Navigator.pop(context, true),
                    child: const Text(
                      'Cancel and Reset Form',
                      style: TextStyle(color: AppConstants.textSecondary),
                    ),
                  ),
                ] else ...[
                  PaymentButton(
                    text: 'Re-verify Payment Status',
                    isLoading: _isRechecking,
                    loadingText: 'Querying Gateway...',
                    backgroundColor: AppConstants.statusPending,
                    onPressed: _recheckStatus,
                    icon: Icons.sync_rounded,
                  ),
                  const SizedBox(height: 12),
                  TextButton(
                    onPressed: () => Navigator.pop(context, true),
                    child: const Text(
                      'Return to Payment Screen',
                      style: TextStyle(color: AppConstants.textSecondary),
                    ),
                  ),
                ],
                const SizedBox(height: 8),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSuccessCard() {
    final formattedDate = DateFormat('dd MMM yyyy, hh:mm a').format(_currentResult.timestamp);

    return Column(
      children: [
        // Green Animated Check Badge
        Container(
          width: 90,
          height: 90,
          decoration: BoxDecoration(
            color: AppConstants.statusSuccessLight,
            shape: BoxShape.circle,
            border: Border.all(color: AppConstants.statusSuccess.withOpacity(0.3), width: 3),
            boxShadow: [
              BoxShadow(
                color: AppConstants.statusSuccess.withOpacity(0.2),
                blurRadius: 24,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: const Icon(
            Icons.check_rounded,
            size: 50,
            color: AppConstants.statusSuccess,
          ),
        ),
        const SizedBox(height: 24),

        const Text(
          'Payment Successful',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w800,
            color: AppConstants.textPrimary,
            letterSpacing: -0.3,
          ),
        ),
        const SizedBox(height: 6),
        const Text(
          'Transaction confirmed and verified with Razorpay',
          style: TextStyle(
            fontSize: 13,
            color: AppConstants.textSecondary,
          ),
        ),

        const SizedBox(height: 28),

        // Receipt Summary Card
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppConstants.backgroundOffWhite,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppConstants.inputBorder),
          ),
          child: Column(
            children: [
              // Amount
              Text(
                _currencyFormat.format(_currentResult.amountPaid),
                style: const TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.w900,
                  color: AppConstants.primaryPurple,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 16),
              const Divider(color: AppConstants.inputBorder, height: 1),
              const SizedBox(height: 16),

              _buildDetailRow('Customer Name', _currentResult.customerName),
              const SizedBox(height: 12),
              _buildDetailRow('Phone Number', _currentResult.customerPhone),
              const SizedBox(height: 12),
              if (_currentResult.razorpayPaymentId != null) ...[
                _buildDetailRow('Payment ID', _currentResult.razorpayPaymentId!),
                const SizedBox(height: 12),
              ],
              if (_currentResult.razorpayOrderId != null) ...[
                _buildDetailRow('Order ID', _currentResult.razorpayOrderId!),
                const SizedBox(height: 12),
              ],
              _buildDetailRow('Date & Time', formattedDate),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildFailedCard() {
    return Column(
      children: [
        Container(
          width: 90,
          height: 90,
          decoration: BoxDecoration(
            color: AppConstants.statusErrorLight,
            shape: BoxShape.circle,
            border: Border.all(color: AppConstants.statusError.withOpacity(0.3), width: 3),
          ),
          child: const Icon(
            Icons.close_rounded,
            size: 50,
            color: AppConstants.statusError,
          ),
        ),
        const SizedBox(height: 24),

        const Text(
          'Payment Failed',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w800,
            color: AppConstants.statusError,
            letterSpacing: -0.3,
          ),
        ),
        const SizedBox(height: 8),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Text(
            _currentResult.errorMessage ??
                'The transaction was cancelled or declined by the bank.',
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 14,
              color: AppConstants.textSecondary,
            ),
          ),
        ),

        const SizedBox(height: 24),

        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: AppConstants.backgroundOffWhite,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppConstants.inputBorder),
          ),
          child: Column(
            children: [
              _buildDetailRow('Customer Name', _currentResult.customerName),
              const SizedBox(height: 10),
              _buildDetailRow('Attempted Amount', _currencyFormat.format(_currentResult.amountPaid)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildPendingCard() {
    return Column(
      children: [
        Container(
          width: 90,
          height: 90,
          decoration: BoxDecoration(
            color: AppConstants.statusPendingLight,
            shape: BoxShape.circle,
            border: Border.all(color: AppConstants.statusPending.withOpacity(0.3), width: 3),
          ),
          child: const Icon(
            Icons.access_time_rounded,
            size: 50,
            color: AppConstants.statusPending,
          ),
        ),
        const SizedBox(height: 24),

        const Text(
          'Verification Pending',
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.w800,
            color: AppConstants.statusPending,
          ),
        ),
        const SizedBox(height: 8),
        const Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Text(
            'We are waiting for authoritative confirmation from Razorpay. Tap below to re-query gateway status.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 13,
              color: AppConstants.textSecondary,
            ),
          ),
        ),

        const SizedBox(height: 24),

        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: AppConstants.backgroundOffWhite,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppConstants.inputBorder),
          ),
          child: Column(
            children: [
              _buildDetailRow('Customer Name', _currentResult.customerName),
              const SizedBox(height: 10),
              _buildDetailRow('Amount', _currencyFormat.format(_currentResult.amountPaid)),
              if (_currentResult.razorpayOrderId != null) ...[
                const SizedBox(height: 10),
                _buildDetailRow('Order ID', _currentResult.razorpayOrderId!),
              ],
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 13,
            color: AppConstants.textSecondary,
            fontWeight: FontWeight.w500,
          ),
        ),
        Flexible(
          child: Text(
            value,
            textAlign: TextAlign.right,
            style: const TextStyle(
              fontSize: 13,
              color: AppConstants.textPrimary,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    );
  }
}
