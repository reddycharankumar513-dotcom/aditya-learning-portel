import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../utils/app_constants.dart';

class PaymentInput extends StatelessWidget {
  final String label;
  final String hintText;
  final TextEditingController controller;
  final TextInputType keyboardType;
  final String? Function(String?)? validator;
  final Widget? prefixIcon;
  final String? prefixText;
  final Widget? suffixIcon;
  final List<TextInputFormatter>? inputFormatters;
  final bool obscureText;
  final bool autofocus;
  final ValueChanged<String>? onChanged;
  final FocusNode? focusNode;
  final TextStyle? textStyle;

  const PaymentInput({
    super.key,
    required this.label,
    required this.hintText,
    required this.controller,
    this.keyboardType = TextInputType.text,
    this.validator,
    this.prefixIcon,
    this.prefixText,
    this.suffixIcon,
    this.inputFormatters,
    this.obscureText = false,
    this.autofocus = false,
    this.onChanged,
    this.focusNode,
    this.textStyle,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: AppConstants.textPrimary,
            letterSpacing: 0.2,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          validator: validator,
          inputFormatters: inputFormatters,
          obscureText: obscureText,
          autofocus: autofocus,
          onChanged: onChanged,
          focusNode: focusNode,
          style: textStyle ??
              const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: AppConstants.textPrimary,
              ),
          decoration: InputDecoration(
            hintText: hintText,
            hintStyle: const TextStyle(
              fontSize: 15,
              color: AppConstants.textMuted,
              fontWeight: FontWeight.w400,
            ),
            filled: true,
            fillColor: AppConstants.inputFill,
            prefixIcon: prefixIcon,
            prefixText: prefixText,
            prefixStyle: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: AppConstants.primaryPurple,
            ),
            suffixIcon: suffixIcon,
            contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: AppConstants.inputBorder, width: 1.2),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: AppConstants.inputBorder, width: 1.2),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: AppConstants.inputBorderFocused, width: 2.0),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: AppConstants.statusError, width: 1.2),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: AppConstants.statusError, width: 2.0),
            ),
            errorStyle: const TextStyle(
              fontSize: 12,
              color: AppConstants.statusError,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ],
    );
  }
}
