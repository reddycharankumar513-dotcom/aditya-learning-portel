import { Course, ICourse } from '../models/Course.js';
import { Enrollment } from '../models/Enrollment.js';
import { IUser } from '../models/User.js';

export interface RecommendationResult {
  course: ICourse;
  reason: string;
  matchScore: number;
}

export const recommendationService = {
  async getRecommendationsForUser(user: IUser): Promise<RecommendationResult[]> {
    // 1. Fetch user's enrollments
    const enrollments = await Enrollment.find({ user: user._id }).populate('course');
    const enrolledCourseIds = new Set(
      enrollments.map((e) => (e.course as any)?._id?.toString()).filter(Boolean)
    );

    // 2. Fetch all published courses
    const allCourses = await Course.find({ isPublished: true });

    // 3. Filter out courses student is already enrolled in
    const availableCourses = allCourses.filter(
      (c) => !enrolledCourseIds.has(c._id.toString())
    );

    const userInterests = user.learningInterests || [];
    const recommendations: RecommendationResult[] = [];

    for (const course of availableCourses) {
      let matchScore = 0;
      let reason = 'Featured foundational course in the curriculum';

      // Check if course matches student's primary interest
      const interestMatch = userInterests.some(
        (interest) =>
          course.category.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(course.category.toLowerCase())
      );

      if (interestMatch) {
        matchScore += 40;
        reason = `Directly matches your selected learning interest in "${course.category}"`;
      }

      // Check if user has enrolled in prerequisites or related tracks
      if (enrollments.length > 0) {
        const hasRelatedEnrollment = enrollments.some(
          (e) => (e.course as any)?.category === course.category
        );
        if (hasRelatedEnrollment) {
          matchScore += 30;
          reason = `Logical next step following your active coursework in ${course.category}`;
        }
      }

      // If user declared a goal mentioning terms
      if (user.goals && user.goals.toLowerCase().includes(course.category.toLowerCase())) {
        matchScore += 25;
        reason = `Aligned with your primary learning target: "${user.goals}"`;
      }

      // Boost beginner courses if user has few completed modules
      const totalCompletedModules = enrollments.reduce(
        (sum, e) => sum + (e.completedModules?.length || 0),
        0
      );
      if (totalCompletedModules === 0 && course.difficulty === 'Beginner') {
        matchScore += 15;
        reason = `Recommended beginner-friendly foundation to start your engineering track`;
      }

      recommendations.push({
        course,
        reason,
        matchScore,
      });
    }

    // Sort by match score descending
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    return recommendations.slice(0, 6);
  },
};
