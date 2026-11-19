class StaffUser {
  final String id;
  final String name;
  final String email;
  final String role;
  final String? adminRole;
  final String? token;

  const StaffUser({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.adminRole,
    this.token,
  });

  factory StaffUser.fromJson(Map<String, dynamic> json, {String? token}) {
    return StaffUser(
      id: json['id'] ?? json['_id'] ?? '',
      name: json['name'] ?? 'Staff Agent',
      email: json['email'] ?? '',
      role: json['role'] ?? 'staff',
      adminRole: json['adminRole'],
      token: token ?? json['token'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role,
      'adminRole': adminRole,
      if (token != null) 'token': token,
    };
  }

  bool get isSuperAdmin => adminRole == 'super_admin' || role == 'admin';

  String get displayName {
    if (name.isNotEmpty) return name;
    final parts = email.split('@');
    return parts.isNotEmpty ? parts[0] : 'Staff';
  }
}
