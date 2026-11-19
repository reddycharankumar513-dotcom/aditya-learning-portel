import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'models/staff_user_model.dart';
import 'screens/login_screen.dart';
import 'screens/payment_screen.dart';
import 'services/auth_service.dart';
import 'utils/app_constants.dart';

class LearnovaPayApp extends StatelessWidget {
  const LearnovaPayApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppConstants.appName,
      debugShowCheckedModeBanner: false,
      theme: _buildTheme(),
      home: const AuthGate(),
    );
  }

  ThemeData _buildTheme() {
    final base = ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppConstants.primaryPurple,
        primary: AppConstants.primaryPurple,
        secondary: AppConstants.accentCyan,
        surface: AppConstants.backgroundWhite,
        brightness: Brightness.light,
      ),
      scaffoldBackgroundColor: AppConstants.backgroundWhite,
    );

    return base.copyWith(
      textTheme: GoogleFonts.interTextTheme(base.textTheme),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppConstants.backgroundWhite,
        foregroundColor: AppConstants.textPrimary,
        elevation: 0,
        centerTitle: false,
      ),
    );
  }
}

class AuthGate extends StatefulWidget {
  const AuthGate({super.key});

  @override
  State<AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<AuthGate> {
  final _authService = AuthService();
  bool _isLoading = true;
  StaffUser? _staffUser;

  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    final user = await _authService.getCurrentUser();
    if (mounted) {
      setState(() {
        _staffUser = user;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: AppConstants.backgroundWhite,
        body: Center(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(AppConstants.primaryPurple),
          ),
        ),
      );
    }

    if (_staffUser != null) {
      return PaymentScreen(staffUser: _staffUser!);
    }

    return const LoginScreen();
  }
}
