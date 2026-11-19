import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/app_constants.dart';

class ApiException implements Exception {
  final int statusCode;
  final String message;
  final dynamic data;

  ApiException(this.statusCode, this.message, [this.data]);

  @override
  String toString() => message;
}

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  final http.Client _client = http.Client();
  final Duration _timeout = const Duration(seconds: 15);

  /// Gets active backend base URL
  Future<String> getBaseUrl() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(AppConstants.keyApiUrl) ?? AppConstants.defaultApiUrl;
  }

  /// Sets custom backend base URL
  Future<void> setBaseUrl(String url) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(AppConstants.keyApiUrl, url.trim().replaceAll(RegExp(r'/+$'), ''));
  }

  /// Retrieves stored JWT token
  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(AppConstants.keyAuthToken);
  }

  /// Helper to build headers
  Future<Map<String, String>> _buildHeaders([bool requiresAuth = true]) async {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Client-Platform': 'Learnova-Pay-Android',
    };

    if (requiresAuth) {
      final token = await _getToken();
      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  /// HTTP GET
  Future<dynamic> get(String endpoint, {bool requiresAuth = true}) async {
    final baseUrl = await getBaseUrl();
    final uri = Uri.parse('$baseUrl$endpoint');

    try {
      final headers = await _buildHeaders(requiresAuth);
      final response = await _client.get(uri, headers: headers).timeout(_timeout);
      return _handleResponse(response);
    } on SocketException {
      throw ApiException(503, 'Network unavailable. Please check your internet connection.');
    } on TimeoutException {
      throw ApiException(408, 'Connection timed out. Please try again.');
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException(500, 'Network request failed: ${e.toString()}');
    }
  }

  /// HTTP POST
  Future<dynamic> post(String endpoint, Map<String, dynamic> body, {bool requiresAuth = true}) async {
    final baseUrl = await getBaseUrl();
    final uri = Uri.parse('$baseUrl$endpoint');

    try {
      final headers = await _buildHeaders(requiresAuth);
      final response = await _client
          .post(uri, headers: headers, body: jsonEncode(body))
          .timeout(_timeout);
      return _handleResponse(response);
    } on SocketException {
      throw ApiException(503, 'Network unavailable. Please check your internet connection.');
    } on TimeoutException {
      throw ApiException(408, 'Connection timed out. Please try again.');
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException(500, 'Network request failed: ${e.toString()}');
    }
  }

  /// Response processor
  dynamic _handleResponse(http.Response response) {
    dynamic jsonBody;
    try {
      if (response.body.isNotEmpty) {
        jsonBody = jsonDecode(response.body);
      }
    } catch (_) {
      jsonBody = null;
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return jsonBody ?? {'success': true};
    }

    final errorMessage = (jsonBody is Map && jsonBody['message'] != null)
        ? jsonBody['message'].toString()
        : 'Request failed with status code ${response.statusCode}';

    throw ApiException(response.statusCode, errorMessage, jsonBody);
  }
}
