import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/staff_user_model.dart';
import '../utils/app_constants.dart';
import 'api_service.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  final ApiService _api = ApiService();

  /// Authenticates staff with email or username and password
  Future<StaffUser> login(String identifier, String password) async {
    final response = await _api.post(
      AppConstants.endpointStaffLogin,
      {
        'email': identifier.trim(),
        'password': password,
      },
      requiresAuth: false,
    );

    if (response is Map<String, dynamic> && response['token'] != null) {
      final token = response['token'].toString();
      final userData = response['user'] as Map<String, dynamic>? ?? {};
      final staffUser = StaffUser.fromJson(userData, token: token);

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(AppConstants.keyAuthToken, token);
      await prefs.setString(AppConstants.keyStaffUser, jsonEncode(staffUser.toJson()));

      return staffUser;
    }

    throw ApiException(401, 'Invalid login response from server.');
  }

  /// Retrieves cached StaffUser
  Future<StaffUser?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userJson = prefs.getString(AppConstants.keyStaffUser);
    final token = prefs.getString(AppConstants.keyAuthToken);

    if (userJson != null && token != null) {
      try {
        final Map<String, dynamic> data = jsonDecode(userJson);
        return StaffUser.fromJson(data, token: token);
      } catch (_) {
        return null;
      }
    }
    return null;
  }

  /// Checks if staff session is active
  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(AppConstants.keyAuthToken);
    return token != null && token.isNotEmpty;
  }

  /// Logs out staff and clears session credentials
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AppConstants.keyAuthToken);
    await prefs.remove(AppConstants.keyStaffUser);
  }
}
