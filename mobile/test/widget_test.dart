import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:learnova_pay/app.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  testWidgets('LearnovaPayApp smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const LearnovaPayApp());
    await tester.pumpAndSettle();

    expect(find.text('Learnova Pay'), findsOneWidget);
  });
}
