import { getMockDb, generateMockAiResponse } from './mockData';
import { ApiError } from './api';
import { User, Course, Enrollment, StudentProject, Internship, InternshipApplication, ContactInquiry } from '../types';

export function handleMockApiRequest<T>(endpoint: string, options: RequestInit = {}): T {
  const method = (options.method || 'GET').toUpperCase();
  const db = getMockDb();

  // Extract query string
  const [path, queryString] = endpoint.split('?');
  const params = new URLSearchParams(queryString || '');

  // Helper to parse body
  const body = options.body ? JSON.parse(options.body as string) : {};

  // Extract auth user if token present
  const authHeader = (options.headers as Record<string, string>)?.[
    'Authorization'
  ] || localStorage.getItem('aditya_auth_token');
  const token = authHeader ? authHeader.replace('Bearer ', '') : '';
  
  let currentUser: (User & { passwordHash: string }) | undefined;
  if (token) {
    const userId = token.replace('aditya_mock_token_', '');
    currentUser = db.users.find(u => u._id === userId) || db.users[1]; // fallback to student
  }

  const sanitizeUser = (u: any): User => {
    const { passwordHash, ...rest } = u;
    return rest as User;
  };

  // -------------------------------------------------------------
  // AUTHENTICATION
  // -------------------------------------------------------------
  if (path === '/api/auth/login' && method === 'POST') {
    const { email, password } = body;
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.passwordHash !== password) {
      throw new ApiError(401, 'Invalid email or password credentials. Please verify your credentials.');
    }

    return {
      token: `aditya_mock_token_${user._id}`,
      user: sanitizeUser(user),
      message: 'Authentication successful',
    } as unknown as T;
  }

  if (path === '/api/auth/register' && method === 'POST') {
    const { name, email, password, country, educationStatus, learningInterests } = body;
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      throw new ApiError(400, 'An account with this email address already exists.');
    }

    const newUser = {
      _id: `usr_${Date.now()}`,
      name,
      email,
      passwordHash: password,
      role: 'student' as const,
      country: country || 'Worldwide',
      educationStatus: educationStatus || 'Student',
      learningInterests: learningInterests || [],
      goals: 'Master future-ready technology skills with ADITYA',
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    db.save();

    return {
      token: `aditya_mock_token_${newUser._id}`,
      user: sanitizeUser(newUser),
      message: 'Student account registered successfully',
    } as unknown as T;
  }

  if (path === '/api/auth/me' && method === 'GET') {
    if (!currentUser) {
      throw new ApiError(401, 'Unauthorized session. Please sign in.');
    }
    return { user: sanitizeUser(currentUser) } as unknown as T;
  }

  if (path === '/api/auth/profile' && method === 'PATCH') {
    if (!currentUser) {
      throw new ApiError(401, 'Unauthorized session.');
    }
    Object.assign(currentUser, body);
    db.save();
    return { user: sanitizeUser(currentUser) } as unknown as T;
  }

  if (path === '/api/auth/forgot-password' && method === 'POST') {
    return {
      message: 'If an account exists with this email, password reset instructions have been generated.',
      resetToken: 'mock_reset_token_verified',
    } as unknown as T;
  }

  if (path === '/api/auth/reset-password' && method === 'POST') {
    return { message: 'Password has been reset successfully.' } as unknown as T;
  }

  // -------------------------------------------------------------
  // COURSES
  // -------------------------------------------------------------
  if (path === '/api/courses' && method === 'GET') {
    let filtered = [...db.courses];
    const category = params.get('category');
    const difficulty = params.get('difficulty');
    const search = params.get('search')?.toLowerCase();

    if (category && category !== 'All Categories') {
      filtered = filtered.filter(c => c.category === category);
    }
    if (difficulty && difficulty !== 'All Levels') {
      filtered = filtered.filter(c => c.difficulty.toLowerCase() === difficulty.toLowerCase());
    }
    if (search) {
      filtered = filtered.filter(
        c =>
          c.title.toLowerCase().includes(search) ||
          c.shortDescription.toLowerCase().includes(search) ||
          c.category.toLowerCase().includes(search)
      );
    }

    return { courses: filtered } as unknown as T;
  }

  if (path === '/api/courses/featured' && method === 'GET') {
    return { courses: db.courses.filter(c => c.featured) } as unknown as T;
  }

  if (path.startsWith('/api/courses/') && method === 'GET') {
    const slug = path.replace('/api/courses/', '');
    const course = db.courses.find(c => c.slug === slug || c._id === slug);
    if (!course) {
      throw new ApiError(404, 'Course not found');
    }
    return { course } as unknown as T;
  }

  // -------------------------------------------------------------
  // ENROLLMENTS
  // -------------------------------------------------------------
  if (path.startsWith('/api/enrollments/') && path.endsWith('/enroll') && method === 'POST') {
    const courseId = path.split('/')[3];
    const course = db.courses.find(c => c._id === courseId || c.slug === courseId);
    if (!course) {
      throw new ApiError(404, 'Course not found');
    }

    const userId = currentUser?._id || 'usr_student_1';
    let enrollment = db.enrollments.find(e => e.userId === userId && (e.courseId === course._id || e.course._id === course._id));

    if (!enrollment) {
      enrollment = {
        _id: `enr_${Date.now()}`,
        userId,
        courseId: course._id,
        course,
        progress: 0,
        completedModules: [],
        status: 'active',
        enrolledAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
      };
      db.enrollments.push(enrollment);
      db.save();
    }

    return { message: 'Enrolled successfully', enrollment } as unknown as T;
  }

  if (path === '/api/enrollments/me' && method === 'GET') {
    const userId = currentUser?._id || 'usr_student_1';
    const myEnrollments = db.enrollments.filter(e => e.userId === userId);
    return { enrollments: myEnrollments } as unknown as T;
  }

  if (path.startsWith('/api/enrollments/check/') && method === 'GET') {
    const courseId = path.replace('/api/enrollments/check/', '');
    const userId = currentUser?._id || 'usr_student_1';
    const enrollment = db.enrollments.find(e => e.userId === userId && (e.courseId === courseId || e.course?._id === courseId || e.course?.slug === courseId));
    return {
      enrollment: enrollment || null,
      isEnrolled: !!enrollment,
    } as unknown as T;
  }

  if (path.startsWith('/api/enrollments/') && path.endsWith('/progress') && method === 'PATCH') {
    const courseId = path.split('/')[3];
    const userId = currentUser?._id || 'usr_student_1';
    let enrollment = db.enrollments.find(e => e.userId === userId && (e.courseId === courseId || e.course?._id === courseId || e.course?.slug === courseId));

    if (!enrollment) {
      const course = db.courses.find(c => c._id === courseId || c.slug === courseId) || db.courses[0];
      enrollment = {
        _id: `enr_${Date.now()}`,
        userId,
        courseId: course._id,
        course,
        progress: 0,
        completedModules: [],
        status: 'active',
        enrolledAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
      };
      db.enrollments.push(enrollment);
    }

    const { moduleId, completed } = body;
    if (completed) {
      if (!enrollment.completedModules.includes(moduleId)) {
        enrollment.completedModules.push(moduleId);
      }
    } else {
      enrollment.completedModules = enrollment.completedModules.filter(m => m !== moduleId);
    }

    const totalModules = enrollment.course.modules?.length || 1;
    enrollment.progress = Math.min(100, Math.round((enrollment.completedModules.length / totalModules) * 100));
    enrollment.status = enrollment.progress >= 100 ? 'completed' : 'active';
    enrollment.lastActivityAt = new Date().toISOString();
    db.save();

    return { enrollment } as unknown as T;
  }

  // -------------------------------------------------------------
  // DASHBOARD & LEARNING
  // -------------------------------------------------------------
  if (path === '/api/learning/dashboard' && method === 'GET') {
    const userId = currentUser?._id || 'usr_student_1';
    const myEnrollments = db.enrollments.filter(e => e.userId === userId);
    const myProjects = db.projects.filter(p => !p.userId || p.userId === userId);

    const completed = myEnrollments.filter(e => e.status === 'completed');
    const inProgress = myEnrollments.filter(e => e.status === 'active');

    const recommendations = db.courses.slice(0, 3).map(c => ({
      course: c,
      reason: `Matches your primary focus in ${c.category}`,
      matchScore: 95,
    }));

    return {
      stats: {
        enrolledCount: myEnrollments.length,
        inProgressCount: inProgress.length,
        completedCount: completed.length,
        learningHoursEstimate: myEnrollments.length * 18,
        projectsCount: myProjects.length,
      },
      recentEnrollments: myEnrollments,
      recommendations,
      projects: myProjects,
    } as unknown as T;
  }

  if (path === '/api/learning/recommendations' && method === 'GET') {
    const recommendations = db.courses.slice(0, 3).map(c => ({
      course: c,
      reason: `Aligns with your learning path in ${c.category}`,
      matchScore: 92,
    }));
    return { recommendations } as unknown as T;
  }

  if (path === '/api/learning/projects' && method === 'GET') {
    const userId = currentUser?._id || 'usr_student_1';
    const projects = db.projects.filter(p => !p.userId || p.userId === userId);
    return { projects } as unknown as T;
  }

  if (path === '/api/learning/projects' && method === 'POST') {
    const userId = currentUser?._id || 'usr_student_1';
    const newProject: StudentProject = {
      _id: `prj_${Date.now()}`,
      userId,
      title: body.title,
      description: body.description,
      techStack: body.techStack || [],
      status: body.status || 'Planning',
      repoUrl: body.repoUrl,
      demoUrl: body.demoUrl,
      createdAt: new Date().toISOString(),
    };

    db.projects.push(newProject);
    db.save();

    return { project: newProject } as unknown as T;
  }

  if (path.startsWith('/api/learning/projects/') && method === 'DELETE') {
    const prjId = path.replace('/api/learning/projects/', '');
    db.projects = db.projects.filter(p => p._id !== prjId);
    db.save();
    return { message: 'Project removed successfully' } as unknown as T;
  }

  // -------------------------------------------------------------
  // AI TUTOR
  // -------------------------------------------------------------
  if (path === '/api/ai/chat' && method === 'POST') {
    const { message, conversationId, skillLevel, topicContext } = body;
    const convId = conversationId || `conv_${Date.now()}`;

    const aiContent = generateMockAiResponse(message, skillLevel, topicContext);
    const aiMsg = {
      role: 'assistant' as const,
      content: aiContent,
      timestamp: new Date().toISOString(),
    };

    let conv = db.conversations.find(c => c._id === convId);
    if (!conv) {
      conv = {
        _id: convId,
        userId: currentUser?._id || 'usr_student_1',
        title: message.slice(0, 40) + '...',
        messages: [
          { role: 'user', content: message, timestamp: new Date().toISOString() },
          aiMsg,
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.conversations.push(conv);
    } else {
      conv.messages.push({ role: 'user', content: message, timestamp: new Date().toISOString() });
      conv.messages.push(aiMsg);
      conv.updatedAt = new Date().toISOString();
    }
    db.save();

    return {
      message: aiMsg,
      conversationId: convId,
      source: 'fallback',
    } as unknown as T;
  }

  if (path === '/api/ai/conversations' && method === 'GET') {
    return { conversations: db.conversations } as unknown as T;
  }

  if (path.startsWith('/api/ai/conversations/') && method === 'GET') {
    const convId = path.replace('/api/ai/conversations/', '');
    const conv = db.conversations.find(c => c._id === convId);
    if (!conv) {
      throw new ApiError(404, 'Conversation not found');
    }
    return { conversation: conv } as unknown as T;
  }

  if (path.startsWith('/api/ai/conversations/') && method === 'DELETE') {
    const convId = path.replace('/api/ai/conversations/', '');
    db.conversations = db.conversations.filter(c => c._id !== convId);
    db.save();
    return { message: 'Conversation deleted' } as unknown as T;
  }

  // -------------------------------------------------------------
  // INTERNSHIPS
  // -------------------------------------------------------------
  if (path === '/api/internships' && method === 'GET') {
    const userId = currentUser?._id || 'usr_student_1';
    const userAppInternshipIds = new Set(
      db.applications.filter(a => a.userId === userId).map(a => a.internshipId)
    );

    const internshipsWithApplied = db.internships.map(i => ({
      ...i,
      hasApplied: userAppInternshipIds.has(i._id),
    }));

    return { internships: internshipsWithApplied } as unknown as T;
  }

  if (path.startsWith('/api/internships/') && path.endsWith('/apply') && method === 'POST') {
    const internshipId = path.split('/')[3];
    const internship = db.internships.find(i => i._id === internshipId);
    if (!internship) {
      throw new ApiError(404, 'Internship not found');
    }

    const userId = currentUser?._id || 'usr_student_1';
    const app: InternshipApplication = {
      _id: `app_${Date.now()}`,
      userId,
      internshipId,
      internship,
      status: 'Submitted',
      appliedAt: new Date().toISOString(),
      resumeUrl: body.resumeUrl || 'https://aditya-ed.org/portfolio',
      notes: body.notes || 'Applied via ADITYA Portal',
      user: {
        name: currentUser?.name || 'Aditya Student',
        email: currentUser?.email || 'student@aditya-ed.org',
      },
    };

    db.applications.push(app);
    db.save();

    return { message: 'Application submitted successfully', application: app } as unknown as T;
  }

  if (path === '/api/internships/my-applications' && method === 'GET') {
    const userId = currentUser?._id || 'usr_student_1';
    const apps = db.applications.filter(a => a.userId === userId);
    return { applications: apps } as unknown as T;
  }

  // -------------------------------------------------------------
  // CONTACT
  // -------------------------------------------------------------
  if (path === '/api/contact' && method === 'POST') {
    const inquiry: ContactInquiry = {
      _id: `inq_${Date.now()}`,
      name: body.name,
      email: body.email,
      subject: body.subject,
      category: body.category || 'General Inquiry',
      message: body.message,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    db.inquiries.push(inquiry);
    db.save();

    return { message: 'Thank you! Your message has been received.', inquiry } as unknown as T;
  }

  // -------------------------------------------------------------
  // ADMIN PORTAL
  // -------------------------------------------------------------
  if (path === '/api/admin/metrics' && method === 'GET') {
    return {
      metrics: {
        totalUsers: db.users.length,
        totalStudents: db.users.filter(u => u.role === 'student').length,
        totalCourses: db.courses.length,
        totalEnrollments: db.enrollments.length,
        totalApplications: db.applications.length,
        totalInquiries: db.inquiries.length,
      },
    } as unknown as T;
  }

  if (path === '/api/admin/courses' && method === 'GET') {
    return { courses: db.courses } as unknown as T;
  }

  if (path === '/api/admin/courses' && method === 'POST') {
    const newCourse: Course = {
      _id: `crs_${Date.now()}`,
      slug: (body.title || 'new-course').toLowerCase().replace(/[^a-z0-9]/g, '-'),
      title: body.title,
      shortDescription: body.shortDescription || '',
      description: body.description || '',
      category: body.category || 'Software Development',
      difficulty: body.difficulty || 'Intermediate',
      duration: body.duration || '6 Weeks',
      iconName: body.iconName || 'Code2',
      isPublished: true,
      learningObjectives: body.learningObjectives || [],
      prerequisites: body.prerequisites || [],
      modules: body.modules || [],
    };
    db.courses.push(newCourse);
    db.save();
    return { course: newCourse } as unknown as T;
  }

  if (path.startsWith('/api/admin/courses/') && method === 'PATCH') {
    const courseId = path.replace('/api/admin/courses/', '');
    const course = db.courses.find(c => c._id === courseId);
    if (!course) throw new ApiError(404, 'Course not found');
    Object.assign(course, body);
    db.save();
    return { course } as unknown as T;
  }

  if (path.startsWith('/api/admin/courses/') && method === 'DELETE') {
    const courseId = path.replace('/api/admin/courses/', '');
    db.courses = db.courses.filter(c => c._id !== courseId);
    db.save();
    return { message: 'Course deleted successfully' } as unknown as T;
  }

  if (path === '/api/admin/internships' && method === 'GET') {
    return { internships: db.internships } as unknown as T;
  }

  if (path === '/api/admin/internships' && method === 'POST') {
    const newInt: Internship = {
      _id: `int_${Date.now()}`,
      title: body.title,
      type: body.type || 'Technical Internship',
      description: body.description || '',
      skills: body.skills || [],
      eligibility: body.eligibility || 'All students',
      duration: body.duration || '8 Weeks',
      location: body.location || 'Remote',
      deadline: body.deadline || 'Rolling',
      isPublished: true,
    };
    db.internships.push(newInt);
    db.save();
    return { internship: newInt } as unknown as T;
  }

  if (path.startsWith('/api/admin/internships/') && method === 'PATCH') {
    const intId = path.replace('/api/admin/internships/', '');
    const internship = db.internships.find(i => i._id === intId);
    if (!internship) throw new ApiError(404, 'Internship not found');
    Object.assign(internship, body);
    db.save();
    return { internship } as unknown as T;
  }

  if (path.startsWith('/api/admin/internships/') && method === 'DELETE') {
    const intId = path.replace('/api/admin/internships/', '');
    db.internships = db.internships.filter(i => i._id !== intId);
    db.save();
    return { message: 'Internship deleted successfully' } as unknown as T;
  }

  if (path === '/api/admin/users' && method === 'GET') {
    return { users: db.users.map(sanitizeUser) } as unknown as T;
  }

  if (path.includes('/api/admin/users/') && path.endsWith('/role') && method === 'PATCH') {
    const userId = path.split('/')[4];
    const user = db.users.find(u => u._id === userId);
    if (!user) throw new ApiError(404, 'User not found');
    user.role = body.role;
    db.save();
    return { user: sanitizeUser(user) } as unknown as T;
  }

  if (path === '/api/admin/applications' && method === 'GET') {
    return { applications: db.applications } as unknown as T;
  }

  if (path.startsWith('/api/admin/applications/') && method === 'PATCH') {
    const appId = path.replace('/api/admin/applications/', '');
    const app = db.applications.find(a => a._id === appId);
    if (!app) throw new ApiError(404, 'Application not found');
    app.status = body.status;
    db.save();
    return { application: app } as unknown as T;
  }

  if (path === '/api/admin/inquiries' && method === 'GET') {
    return { inquiries: db.inquiries } as unknown as T;
  }

  if (path.startsWith('/api/admin/inquiries/') && method === 'PATCH') {
    const inqId = path.replace('/api/admin/inquiries/', '');
    const inquiry = db.inquiries.find(i => i._id === inqId);
    if (!inquiry) throw new ApiError(404, 'Inquiry not found');
    inquiry.status = body.status;
    db.save();
    return { inquiry } as unknown as T;
  }

  if (path === '/api/admin/settings' && method === 'GET') {
    return { settings: db.settings } as unknown as T;
  }

  if (path === '/api/admin/settings/keys' && method === 'PATCH') {
    Object.assign(db.settings, {
      hasAnthropicKey: !!body.anthropicApiKey || db.settings.hasAnthropicKey,
      maskedAnthropicKey: body.anthropicApiKey ? 'sk-ant-api03-••••••••••••••••••••••••' : db.settings.maskedAnthropicKey,
      hasMongoDbUri: !!body.mongodbUri || db.settings.hasMongoDbUri,
    });
    db.save();
    return { message: 'Settings saved successfully', settings: db.settings } as unknown as T;
  }

  if (path === '/api/admin/settings/test-ai' && method === 'POST') {
    return {
      success: true,
      message: 'Anthropic Claude model latency test succeeded in 128ms.',
      latencyMs: 128,
      responseSample: 'ADITYA AI Tutor online: Claude 3.5 Sonnet connected successfully.',
    } as unknown as T;
  }

  throw new ApiError(404, `Endpoint ${method} ${path} not found.`);
}
