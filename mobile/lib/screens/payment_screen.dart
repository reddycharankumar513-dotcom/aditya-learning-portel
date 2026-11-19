import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import '../models/payment_model.dart';
import '../models/staff_user_model.dart';
import '../services/auth_service.dart';
import '../services/payment_service.dart';
import '../utils/app_constants.dart';
import '../utils/validators.dart';
import '../widgets/payment_button.dart';
import '../widgets/payment_input.dart';
import 'login_screen.dart';
import 'payment_result_screen.dart';

class PaymentScreen extends StatefulWidget {
  final StaffUser staffUser;

  const PaymentScreen({
    super.key,
    required this.staffUser,
  });

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();

  final PaymentService _paymentService = PaymentService();
  final AuthService _authService = AuthService();

  late Razorpay _razorpay;
  bool _isProcessing = false;
  String _processingStep = 'Preparing Checkout...';
  String? _errorMessage;

  // Active transaction temporary state
  PaymentOrder? _activeOrder;
  double _currentAmount = 0.0;
  String _currentCustomerName = '';
  String _currentCustomerPhone = '';

  @override
  void initState() {
    super.initState();
    _initRazorpay();
  }

  void _initRazorpay() {
    _razorpay = Razorpay();
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
    _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
  }

  @override
  void dispose() {
    _razorpay.clear();
    _amountController.dispose();
    _nameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  /// Reset form fields for the next transaction
  void _resetForm() {
    setState(() {
      _amountController.clear();
      _nameController.clear();
      _phoneController.clear();
      _activeOrder = null;
      _errorMessage = null;
      _isProcessing = false;
    });
  }

  /// 1. Staff taps "Pay Now": Validate & create order on backend
  Future<void> _initiatePayment() async {
    if (_isProcessing) return; // Prevent repeated button taps
    if (!_formKey.currentState!.validate()) return;

    FocusScope.of(context).unfocus();

    setState(() {
      _isProcessing = true;
      _errorMessage = null;
      _processingStep = 'Creating Razorpay Order...';
    });

    try {
      _currentAmount = double.parse(_amountController.text.trim());
      _currentCustomerName = _nameController.text.trim();
      _currentCustomerPhone = Validators.normalizePhone(_phoneController.text.trim());

      // Create order via backend SDK
      final order = await _paymentService.createOrder(
        amount: _currentAmount,
        customerName: _currentCustomerName,
        customerPhone: _currentCustomerPhone,
      );

      _activeOrder = order;

      if (!mounted) return;
      setState(() {
        _processingStep = 'Opening Razorpay Gateway...';
      });

      // 2. Open Razorpay Standard Checkout
      _openRazorpayCheckout(order);
    } catch (e) {
      if (mounted) {
        setState(() {
          _isProcessing = false;
          _errorMessage = e.toString();
        });
      }
    }
  }

  /// Open Razorpay Standard Checkout Native Modal
  void _openRazorpayCheckout(PaymentOrder order) {
    final keyId = order.keyId.isNotEmpty ? order.keyId : AppConstants.defaultRazorpayKeyId;

    final Map<String, dynamic> options = {
      'key': keyId,
      'amount': order.amountInPaise,
      'name': AppConstants.merchantName,
      'description': 'Collection for $_currentCustomerName',
      'prefill': {
        'name': _currentCustomerName,
        'contact': _currentCustomerPhone,
      },
      'theme': {
        'color': '#8065FF',
      },
      'notes': {
        'staffId': widget.staffUser.id,
        'customerName': _currentCustomerName,
        'customerPhone': _currentCustomerPhone,
        'paymentSource': 'mobile',
      },
      'modal': {
        'confirm_close': true,
      },
    };

    if (order.orderId.isNotEmpty) {
      options['order_id'] = order.orderId;
    }

    try {
      _razorpay.open(options);
    } catch (e) {
      setState(() {
        _isProcessing = false;
        _errorMessage = 'Could not launch Razorpay: ${e.toString()}';
      });
    }
  }

  /// 3. Razorpay Success Callback: Send signature to backend for verification
  void _handlePaymentSuccess(PaymentSuccessResponse response) async {
    setState(() {
      _processingStep = 'Cryptographically Verifying Payment...';
    });

    final orderId = response.orderId ?? _activeOrder?.orderId ?? '';
    final paymentId = response.paymentId ?? '';
    final signature = response.signature ?? '';

    try {
      final result = await _paymentService.verifyPayment(
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        customerName: _currentCustomerName,
        customerPhone: _currentCustomerPhone,
        amount: _currentAmount,
      );

      _navigateToResult(result);
    } catch (e) {
      // If signature verification fails or timed out, display pending or failed
      _navigateToResult(
        PaymentResult(
          status: PaymentStatus.pending,
          razorpayPaymentId: paymentId,
          razorpayOrderId: orderId,
          customerName: _currentCustomerName,
          customerPhone: _currentCustomerPhone,
          amountPaid: _currentAmount,
          timestamp: DateTime.now(),
          errorMessage: 'Verification delayed. Status can be confirmed via backend gateway.',
        ),
      );
    } finally {
      if (mounted) setState(() => _isProcessing = false);
    }
  }

  /// 4. Razorpay Error Callback (Cancelled, Bank Failure, etc.)
  void _handlePaymentError(PaymentFailureResponse response) {
    if (!mounted) return;
    setState(() => _isProcessing = false);

    final errorMsg = response.message?.isNotEmpty == true
        ? response.message!
        : 'Payment cancelled or declined by customer bank.';

    _navigateToResult(
      PaymentResult(
        status: PaymentStatus.failed,
        razorpayOrderId: _activeOrder?.orderId,
        customerName: _currentCustomerName,
        customerPhone: _currentCustomerPhone,
        amountPaid: _currentAmount,
        timestamp: DateTime.now(),
        errorMessage: errorMsg,
      ),
    );
  }

  /// External Wallet Callback
  void _handleExternalWallet(ExternalWalletResponse response) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Selected external wallet: ${response.walletName}'),
        backgroundColor: AppConstants.primaryPurple,
      ),
    );
  }

  /// Navigate to Payment Result Screen
  void _navigateToResult(PaymentResult result) async {
    final shouldReset = await Navigator.push<bool>(
      context,
      MaterialPageRoute(
        builder: (_) => PaymentResultScreen(result: result),
      ),
    );

    if (shouldReset == true) {
      _resetForm();
    }
  }

  /// Staff Logout
  Future<void> _handleLogout() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Confirm Logout'),
        content: const Text('Are you sure you want to log out of Learnova Pay?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel', style: TextStyle(color: AppConstants.textSecondary)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppConstants.statusError,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Logout', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirm == true) {
      await _authService.logout();
      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const LoginScreen()),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppConstants.backgroundWhite,
      appBar: AppBar(
        backgroundColor: AppConstants.backgroundWhite,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        title: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppConstants.primaryPurple, AppConstants.accentCyan],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(
                Icons.account_balance_wallet_rounded,
                color: Colors.white,
                size: 20,
              ),
            ),
            const SizedBox(width: 10),
            const Text(
              AppConstants.appName,
              style: TextStyle(
                fontSize: 19,
                fontWeight: FontWeight.w800,
                color: AppConstants.textPrimary,
                letterSpacing: -0.3,
              ),
            ),
          ],
        ),
        actions: [
          // Staff Profile Badge
          Container(
            margin: const EdgeInsets.only(right: 8),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppConstants.primaryPurpleLight,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                const Icon(Icons.person_rounded, size: 14, color: AppConstants.primaryPurple),
                const SizedBox(width: 4),
                Text(
                  widget.staffUser.displayName,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppConstants.primaryPurple,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.logout_rounded, color: AppConstants.textSecondary, size: 20),
            tooltip: 'Staff Logout',
            onPressed: _handleLogout,
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Subheader
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: AppConstants.backgroundOffWhite,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppConstants.inputBorder),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: AppConstants.statusSuccess,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Text(
                        'Razorpay Live POS • Instant UPI, Cards, NetBanking',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: AppConstants.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Error Banner
                if (_errorMessage != null) ...[
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppConstants.statusErrorLight,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppConstants.statusError.withOpacity(0.3)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.error_outline_rounded, color: AppConstants.statusError, size: 20),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            _errorMessage!,
                            style: const TextStyle(
                              fontSize: 13,
                              color: AppConstants.statusError,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                ],

                // SECTION A: Amount to Collect
                PaymentInput(
                  label: 'A. Amount to Collect',
                  hintText: '0.00',
                  controller: _amountController,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  validator: Validators.validateAmount,
                  prefixText: '₹ ',
                  textStyle: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w800,
                    color: AppConstants.textPrimary,
                  ),
                  inputFormatters: [
                    FilteringTextInputFormatter.allow(RegExp(r'^\d+\.?\d{0,2}')),
                  ],
                ),

                const SizedBox(height: 22),

                // SECTION B: Customer Name
                PaymentInput(
                  label: 'B. Customer Name',
                  hintText: 'Enter student or customer full name',
                  controller: _nameController,
                  keyboardType: TextInputType.name,
                  validator: Validators.validateCustomerName,
                  prefixIcon: const Icon(Icons.person_outline_rounded, color: AppConstants.primaryPurple, size: 22),
                  inputFormatters: [
                    FilteringTextInputFormatter.allow(RegExp(r"[a-zA-Z\s\.\-']")),
                  ],
                ),

                const SizedBox(height: 22),

                // SECTION C: Phone Number
                PaymentInput(
                  label: 'C. Phone Number',
                  hintText: '10-digit mobile number (e.g. 9876543210)',
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  validator: Validators.validateCustomerPhone,
                  prefixIcon: const Icon(Icons.phone_iphone_rounded, color: AppConstants.primaryPurple, size: 22),
                  inputFormatters: [
                    FilteringTextInputFormatter.digitsOnly,
                    LengthLimitingTextInputFormatter(10),
                  ],
                ),

                const SizedBox(height: 36),

                // SECTION D: Pay Now Button
                PaymentButton(
                  text: 'Pay Now',
                  onPressed: _isProcessing ? null : _initiatePayment,
                  isLoading: _isProcessing,
                  loadingText: _processingStep,
                  icon: Icons.shield_rounded,
                ),

                const SizedBox(height: 20),

                // Minimal Security Footer
                const Center(
                  child: Text(
                    'Connected to Learnova Secured Gateway • PCI-DSS Level 1',
                    style: TextStyle(
                      fontSize: 11,
                      color: AppConstants.textMuted,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
