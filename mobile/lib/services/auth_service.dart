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

  // Seeded credentials for fallback / offline / static-hosted environments
  static const Map<String, String> _seededStaff = {
    'staff@learnova.in': 'Staff@123456',
    'staff': 'Staff@123456',
    'admin@aditya-ed.org': 'Admin@123456',
    'admin': 'Admin@123456',
  };

  bool _isAuthorizedStaff(String identifier, String password) {
    final cleanId = identifier.trim().toLowerCase();
    final expectedPassword = _seededStaff[cleanId];
    return expectedPassword != null && expectedPassword == password;
  }

  StaffUser _createFallbackStaffUser(String identifier) {
    final cleanId = identifier.trim().toLowerCase();
    final isAdmin = cleanId.contains('admin');
    final role = isAdmin ? 'admin' : 'staff';
    final name = isAdmin ? 'Learnova Administrator' : 'Learnova Authorized Staff';
    final email = cleanId.contains('@') ? cleanId : (isAdmin ? 'admin@aditya-ed.org' : 'staff@learnova.in');

    return StaffUser(
      id: isAdmin ? 'usr_admin_seed_001' : 'usr_staff_seed_001',
      name: name,
      email: email,
      role: role,
      token: 'jwt_seeded_${role}_${DateTime.now().millisecondsSinceEpoch}',
    );
  }

  /// Authenticates staff with email or username and password
  Future<StaffUser> login(String identifier, String password) async {
    final cleanId = identifier.trim().toLowerCase();

    try {
      final response = await _api.post(
        AppConstants.endpointStaffLogin,
        {
          'email': cleanId,
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
    } on ApiException catch (e) {
      // 405 Method Not Allowed indicates a static hosting provider (like Vercel)
      // 404 or >= 500 indicates backend is unreachable or not yet deployed on that endpoint
      if (e.statusCode == 405 || e.statusCode == 404 || e.statusCode >= 500) {
        if (_isAuthorizedStaff(cleanId, password)) {
          final staffUser = _createFallbackStaffUser(cleanId);
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString(AppConstants.keyAuthToken, staffUser.token ?? '');
          await prefs.setString(AppConstants.keyStaffUser, jsonEncode(staffUser.toJson()));
          return staffUser;
        } else {
          throw ApiException(401, 'Invalid credentials. Staff account not found.');
        }
      }
      rethrow;
    } catch (_) {
      if (_isAuthorizedStaff(cleanId, password)) {
        final staffUser = _createFallbackStaffUser(cleanId);
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(AppConstants.keyAuthToken, staffUser.token ?? '');
        await prefs.setString(AppConstants.keyStaffUser, jsonEncode(staffUser.toJson()));
        return staffUser;
      }
      rethrow;
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
