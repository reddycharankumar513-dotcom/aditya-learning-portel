import 'package:flutter_test/flutter_test.dart';
import 'package:learnova_pay/app.dart';

void main() {
  testWidgets('LearnovaPayApp smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const LearnovaPayApp());
    await tester.pumpAndSettle();

    // Verify Learnova Pay branding exists
    expect(find.text('Learnova Pay'), findsOneWidget);
  });
}
