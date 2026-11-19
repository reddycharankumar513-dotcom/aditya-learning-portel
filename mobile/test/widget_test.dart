import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:learnova_pay/widgets/payment_button.dart';

void main() {
  testWidgets('PaymentButton renders text and handles tap correctly', (WidgetTester tester) async {
    bool tapped = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: PaymentButton(
            text: 'Pay ₹1,499',
            onPressed: () {
              tapped = true;
            },
          ),
        ),
      ),
    );

    expect(find.text('Pay ₹1,499'), findsOneWidget);
    await tester.tap(find.text('Pay ₹1,499'));
    expect(tapped, true);
  });

  testWidgets('PaymentButton shows loading indicator when isLoading is true', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: PaymentButton(
            text: 'Pay ₹1,499',
            isLoading: true,
            onPressed: () {},
          ),
        ),
      ),
    );

    expect(find.byType(CircularProgressIndicator), findsOneWidget);
  });
}
