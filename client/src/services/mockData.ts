import { Course, Internship, StudentProject, User, Enrollment, AIConversation, ContactInquiry } from '../types';

export const INITIAL_MOCK_USERS: (User & { passwordHash: string })[] = [
  {
    _id: 'usr_admin_1',
    name: 'ADITYA Administrator',
    email: 'admin@aditya-ed.org',
    passwordHash: 'Admin@123456',
    role: 'admin',
    country: 'India',
    educationStatus: 'Platform Administrator',
    learningInterests: ['Artificial Intelligence & ML', 'Software Development'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'usr_student_1',
    name: 'Aditya Demo Student',
    email: 'student@aditya-ed.org',
    passwordHash: 'Student@123456',
    role: 'student',
    country: 'India',
    educationStatus: 'College Student',
    learningInterests: ['Artificial Intelligence & ML', 'Software Development'],
    goals: 'Master Full-Stack Web Development and Deep Learning Systems',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_MOCK_COURSES: Course[] = [
  {
    _id: 'crs_1',
    title: 'Machine Learning Fundamentals',
    slug: 'machine-learning-fundamentals',
    shortDescription: 'Supervised, unsupervised algorithms, regression, classification, clustering, model evaluation, and scikit-learn.',
    description: 'A comprehensive foundational curriculum in applied machine learning. Learn parametric and non-parametric algorithms, cost functions, gradient descent optimization, overfitting mitigation with L1/L2 regularization, and feature engineering with real-world datasets.',
    category: 'Artificial Intelligence & ML',
    difficulty: 'Intermediate',
    duration: '8 Weeks',
    iconName: 'Brain',
    instructorName: 'Dr. Vikram Malhotra',
    instructorRole: 'Principal ML Engineer & Academic Lead',
    enrolledCount: 142,
    featured: true,
    isPublished: true,
    learningObjectives: [
      'Master linear regression, logistic regression, decision trees, and ensemble methods.',
      'Understand mathematical derivations of cost functions and gradient descent.',
      'Perform rigorous cross-validation and hyperparameter tuning with GridSearchCV.',
      'Deploy scikit-learn classification models as a production REST API.',
    ],
    prerequisites: ['Python syntax basics', 'Fundamental linear algebra (vectors & matrices)'],
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Regression Models & Gradient Descent',
        description: 'Ordinary least squares, cost functions, learning rate schedules, and multivariate regression.',
        duration: '2 Weeks',
        lessons: [
          { id: 'l1-1', title: 'Linear Regression Cost Formulation', duration: '50 mins', type: 'lecture' },
          { id: 'l1-2', title: 'Vectorized Gradient Descent in Python', duration: '1.5 hours', type: 'exercise' },
          { id: 'l1-3', title: 'Feature Scaling & Normalization', duration: '40 mins', type: 'reading' },
        ],
        assignment: {
          id: 'a1',
          title: 'Housing Valuation Regressor',
          instructions: 'Implement multivariate linear regression from scratch using pure NumPy and benchmark against scikit-learn.',
        },
      },
      {
        id: 'm2',
        title: 'Module 2: Classification & Decision Boundaries',
        description: 'Logistic sigmoid activation, cross-entropy loss, decision thresholds, and ROC-AUC evaluation.',
        duration: '2 Weeks',
        lessons: [
          { id: 'l2-1', title: 'Binary & Multiclass Logistic Regression', duration: '1 hour', type: 'lecture' },
          { id: 'l2-2', title: 'Confusion Matrices, Precision, Recall, and F1', duration: '45 mins', type: 'lecture' },
          { id: 'l2-3', title: 'Decision Trees & Gini Impurity', duration: '1 hour', type: 'exercise' },
        ],
        assignment: {
          id: 'a2',
          title: 'Credit Risk Classification Pipeline',
          instructions: 'Train an ensemble random forest classifier with scikit-learn and compute ROC-AUC curves.',
        },
      },
    ],
  },
  {
    _id: 'crs_2',
    title: 'Full-Stack Web Development',
    slug: 'full-stack-web-development',
    shortDescription: 'Build production web applications with React.js, TypeScript, Tailwind, Node.js, Express, and MongoDB.',
    description: 'Comprehensive software engineering path covering modern client-server architecture. Develop responsive SPAs with React 19, TypeScript, and Tailwind, build authenticated RESTful APIs with Node.js and Express, and structure schemas in MongoDB.',
    category: 'Software Development',
    difficulty: 'Intermediate',
    duration: '12 Weeks',
    iconName: 'Code2',
    instructorName: 'Sarah Jenkins',
    instructorRole: 'Staff Full-Stack Architect',
    enrolledCount: 238,
    featured: true,
    isPublished: true,
    learningObjectives: [
      'Design modular React component architectures with TypeScript and custom hooks.',
      'Build secure Node.js & Express REST APIs with JWT tokens and bcrypt password hashing.',
      'Implement relational-style document relationships and indexing in MongoDB Atlas.',
      'Deploy full-stack web applications on cloud infrastructure.',
    ],
    prerequisites: ['Basic HTML, CSS, and modern JavaScript syntax (ES6+)'],
    modules: [
      {
        id: 'fs-m1',
        title: 'Module 1: Modern React 19 & TypeScript State Systems',
        description: 'Hooks, context API, form validation, and Tailwind CSS design systems.',
        duration: '3 Weeks',
        lessons: [
          { id: 'fs-l1', title: 'Component Composition & Strongly Typed Props', duration: '1 hour', type: 'lecture' },
          { id: 'fs-l2', title: 'State Machines & Custom Hooks', duration: '1.5 hours', type: 'exercise' },
        ],
        assignment: {
          id: 'fs-a1',
          title: 'Interactive Project Task Board',
          instructions: 'Create a drag-and-drop kanban board in React with local state persistence.',
        },
      },
      {
        id: 'fs-m2',
        title: 'Module 2: Express Backend APIs & MongoDB Mongoose',
        description: 'Route controllers, middleware, JWT sessions, and Mongoose schema models.',
        duration: '4 Weeks',
        lessons: [
          { id: 'fs-l3', title: 'REST Endpoint Conventions & Error Middleware', duration: '1 hour', type: 'lecture' },
          { id: 'fs-l4', title: 'JWT Authentication Flow & Password Hashing', duration: '2 hours', type: 'exercise' },
        ],
        assignment: {
          id: 'fs-a2',
          title: 'Authentication & Role-Based API',
          instructions: 'Build a secure token-based user authentication server with protected endpoints.',
        },
      },
    ],
  },
  {
    _id: 'crs_3',
    title: 'Deep Learning & Neural Networks',
    slug: 'deep-learning-neural-networks',
    shortDescription: 'Build multilayer perceptrons, CNNs for computer vision, and RNNs/LSTMs using PyTorch.',
    description: 'Explore the foundations of deep learning architectures. From computational graphs and backpropagation to Convolutional Neural Networks (CNNs) and transformer models using PyTorch.',
    category: 'Artificial Intelligence & ML',
    difficulty: 'Advanced',
    duration: '10 Weeks',
    iconName: 'Brain',
    instructorName: 'Dr. Elena Rostova',
    instructorRole: 'Deep Learning Research Scientist',
    enrolledCount: 119,
    featured: true,
    isPublished: true,
    learningObjectives: [
      'Implement deep neural networks from scratch and with PyTorch.',
      'Train Convolutional Neural Networks on real computer vision benchmarks.',
      'Apply transfer learning with pre-trained models (ResNet, EfficientNet).',
      'Optimize training pipelines with mixed-precision, learning rate warmups, and AdamW.',
    ],
    prerequisites: ['Proficiency in Python and basic Machine Learning fundamentals'],
    modules: [
      {
        id: 'dl-m1',
        title: 'Module 1: Computational Graphs & Autograd in PyTorch',
        description: 'Tensors, gradients, custom loss functions, and optimization loops.',
        duration: '2 Weeks',
        lessons: [
          { id: 'dl-l1', title: 'PyTorch Tensor Mechanics & GPU Acceleration', duration: '1 hour', type: 'lecture' },
          { id: 'dl-l2', title: 'Building an MLP for MNIST Classification', duration: '1.5 hours', type: 'exercise' },
        ],
        assignment: {
          id: 'dl-a1',
          title: 'Handwritten Digit Recognizer',
          instructions: 'Train an MLP achieving >98% accuracy on test split and plot training loss curves.',
        },
      },
    ],
  },
  {
    _id: 'crs_4',
    title: 'Generative AI & LLM Systems',
    slug: 'generative-ai-llm-applications',
    shortDescription: 'Prompt engineering, RAG pipelines, fine-tuning, embeddings, and building full-stack Claude & OpenAI agents.',
    description: 'Harness large language models to construct real-world intelligent software. Master prompt design, vector embeddings, chunking strategies, retrieval-augmented generation (RAG), and agentic workflows.',
    category: 'Artificial Intelligence & ML',
    difficulty: 'Advanced',
    duration: '6 Weeks',
    iconName: 'Sparkles',
    instructorName: 'Arjun Mehta',
    instructorRole: 'AI Systems Architect',
    enrolledCount: 184,
    featured: true,
    isPublished: true,
    learningObjectives: [
      'Build end-to-end RAG question answering engines over proprietary documents.',
      'Integrate Claude API and LangChain for structured reasoning loops.',
      'Index and query vector representations using Chroma and Pinecone.',
      'Evaluate retrieval accuracy and hallucination rates with benchmark datasets.',
    ],
    prerequisites: ['Python and REST API familiarity'],
    modules: [
      {
        id: 'gen-m1',
        title: 'Module 1: Embeddings, Vector Stores & Semantic Search',
        description: 'High-dimensional embeddings, cosine similarity, vector indexing, and hybrid retrieval.',
        duration: '2 Weeks',
        lessons: [
          { id: 'gen-l1', title: 'Vector Spaces & Text Embedding Models', duration: '50 mins', type: 'lecture' },
          { id: 'gen-l2', title: 'Building a Document Search Engine with Claude', duration: '1.5 hours', type: 'exercise' },
        ],
        assignment: {
          id: 'gen-a1',
          title: 'Technical Documentation Q&A Bot',
          instructions: 'Build a RAG script that indexes 10 technical PDF whitepapers and queries Claude for answers with page citations.',
        },
      },
    ],
  },
  {
    _id: 'crs_5',
    title: 'Python for Data Analysis',
    slug: 'python-data-analysis',
    shortDescription: 'Master Pandas, NumPy, statistical hypothesis testing, and automated exploratory data analysis pipelines.',
    description: 'Data wrangling, automated cleaning, vectorized computation, and exploratory analysis. Learn how to transform raw, messy datasets into clean dataframes and visualizations.',
    category: 'Data Science & Analytics',
    difficulty: 'Beginner',
    duration: '6 Weeks',
    iconName: 'BarChart3',
    instructorName: 'Priya Sharma',
    instructorRole: 'Senior Data Analytics Consultant',
    enrolledCount: 312,
    featured: false,
    isPublished: true,
    learningObjectives: [
      'Perform complex data slicing, grouping, and merging in Pandas.',
      'Clean null values, duplicate records, and corrupted data types efficiently.',
      'Visualize patterns with Seaborn, Matplotlib, and Plotly charts.',
      'Conduct statistical significance testing and cohort analysis.',
    ],
    prerequisites: ['Basic computer literacy and arithmetic foundations'],
    modules: [
      {
        id: 'da-m1',
        title: 'Module 1: Pandas DataFrames & Data Cleansing',
        description: 'Series, DataFrames, indexing, boolean filtering, and handling missing data.',
        duration: '2 Weeks',
        lessons: [
          { id: 'da-l1', title: 'DataFrame Ingestion & Inspection', duration: '45 mins', type: 'lecture' },
          { id: 'da-l2', title: 'Imputation & Feature Scaling in Pandas', duration: '1 hour', type: 'exercise' },
        ],
      },
    ],
  },
  {
    _id: 'crs_6',
    title: 'Cloud Computing & DevOps Fundamentals',
    slug: 'cloud-devops-fundamentals',
    shortDescription: 'AWS/GCP infrastructure, Docker containerization, CI/CD automated pipelines, and Kubernetes basics.',
    description: 'Understand modern cloud infrastructure and DevOps continuous integration. Containerize applications using Docker, automate unit testing and deployments with GitHub Actions, and understand cloud architecture.',
    category: 'Cloud & Emerging Technologies',
    difficulty: 'Intermediate',
    duration: '8 Weeks',
    iconName: 'Cloud',
    instructorName: 'David Chen',
    instructorRole: 'Cloud Infrastructure Lead',
    enrolledCount: 164,
    featured: false,
    isPublished: true,
    learningObjectives: [
      'Create multi-stage Dockerfiles and compose microservices with Docker Compose.',
      'Configure automated test and build workflows in GitHub Actions.',
      'Deploy services to cloud container registries and cloud VMs.',
      'Understand cloud security, IAM roles, and VPC networking basics.',
    ],
    prerequisites: ['Basic command line familiarity and web development understanding'],
    modules: [
      {
        id: 'cd-m1',
        title: 'Module 1: Containerization with Docker',
        description: 'Images, containers, volumes, networks, and Dockerfile optimization.',
        duration: '2 Weeks',
        lessons: [
          { id: 'cd-l1', title: 'Docker Architecture & Container Lifecycle', duration: '1 hour', type: 'lecture' },
          { id: 'cd-l2', title: 'Containerizing a Full-Stack React & Node App', duration: '2 hours', type: 'exercise' },
        ],
      },
    ],
  },
];

export const INITIAL_MOCK_INTERNSHIPS: Internship[] = [
  {
    _id: 'int_1',
    title: 'AI Systems Engineering Apprentice',
    type: 'Technical Internship',
    description: 'Join an active engineering project cycle to build scalable RAG microservices, benchmark prompt evaluation suites, and implement Claude-powered internal tooling.',
    skills: ['Python', 'Claude API', 'LangChain', 'FastAPI', 'Vector DBs'],
    eligibility: 'Completed at least one AI or Deep Learning course module on ADITYA',
    duration: '10 Weeks',
    location: 'Remote',
    deadline: 'Rolling',
    isPublished: true,
  },
  {
    _id: 'int_2',
    title: 'Full-Stack Software Engineering Apprentice',
    type: 'Apprenticeship',
    description: 'Hands-on project work developing responsive React user interfaces, TypeScript APIs, database schemas, and unit testing suites.',
    skills: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB'],
    eligibility: 'Demonstrated completion of Full-Stack Web Development curriculum',
    duration: '12 Weeks',
    location: 'Remote / Hybrid',
    deadline: 'Rolling',
    isPublished: true,
  },
  {
    _id: 'int_3',
    title: 'Data Science & BI Research Fellow',
    type: 'Research Fellow',
    description: 'Conduct quantitative exploratory analyses, build automated ETL pipelines in Pandas, and design executive business intelligence dashboards.',
    skills: ['Python', 'Pandas', 'SQL', 'Power BI', 'Statistics'],
    eligibility: 'Undergraduate or graduate students in quantitative or technical majors',
    duration: '8 Weeks',
    location: 'Remote',
    deadline: 'Rolling',
    isPublished: true,
  },
];

export const INITIAL_MOCK_PROJECTS: StudentProject[] = [
  {
    _id: 'prj_1',
    userId: 'usr_student_1',
    title: 'Distributed Task Queue System',
    description: 'High-throughput asynchronous job processor built with Node.js, Redis, and TypeScript with priority queues and exponential backoff retries.',
    techStack: ['Node.js', 'TypeScript', 'Redis', 'Docker'],
    status: 'Completed',
    repoUrl: 'https://github.com/aditya-ed/sample-task-queue',
    demoUrl: 'https://demo-queue.aditya-ed.org',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prj_2',
    userId: 'usr_student_1',
    title: 'Vision Classifier with PyTorch',
    description: 'Fine-tuned ResNet model for industrial component defect inspection with Grad-CAM heatmap visualization of classification boundaries.',
    techStack: ['PyTorch', 'Torchvision', 'Python', 'FastAPI'],
    status: 'In Progress',
    repoUrl: 'https://github.com/aditya-ed/sample-vision-classifier',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_MOCK_ENROLLMENTS: Enrollment[] = [
  {
    _id: 'enr_1',
    userId: 'usr_student_1',
    courseId: 'crs_1',
    course: INITIAL_MOCK_COURSES[0],
    progress: 50,
    completedModules: ['m1'],
    status: 'active',
    enrolledAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    lastActivityAt: new Date().toISOString(),
  },
  {
    _id: 'enr_2',
    userId: 'usr_student_1',
    courseId: 'crs_2',
    course: INITIAL_MOCK_COURSES[1],
    progress: 100,
    completedModules: ['fs-m1', 'fs-m2'],
    status: 'completed',
    enrolledAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    lastActivityAt: new Date().toISOString(),
  },
];

// Helper to get or initialize persistent mock database in localStorage
export function getMockDb() {
  const getStored = (key: string, defaultVal: any) => {
    try {
      const data = localStorage.getItem(`aditya_db_${key}`);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const users: (User & { passwordHash: string })[] = getStored('users', INITIAL_MOCK_USERS);
  const courses: Course[] = getStored('courses', INITIAL_MOCK_COURSES);
  const internships: Internship[] = getStored('internships', INITIAL_MOCK_INTERNSHIPS);
  const projects: StudentProject[] = getStored('projects', INITIAL_MOCK_PROJECTS);
  const enrollments: Enrollment[] = getStored('enrollments', INITIAL_MOCK_ENROLLMENTS);
  const applications: any[] = getStored('applications', []);
  const inquiries: ContactInquiry[] = getStored('inquiries', []);
  const conversations: AIConversation[] = getStored('conversations', []);
  const settings: any = getStored('settings', {
    hasAnthropicKey: true,
    maskedAnthropicKey: 'sk-ant-api03-••••••••••••••••••••••••',
    hasMongoDbUri: true,
    nodeEnv: 'production (browser fallback)',
  });

  const save = () => {
    localStorage.setItem('aditya_db_users', JSON.stringify(users));
    localStorage.setItem('aditya_db_courses', JSON.stringify(courses));
    localStorage.setItem('aditya_db_internships', JSON.stringify(internships));
    localStorage.setItem('aditya_db_projects', JSON.stringify(projects));
    localStorage.setItem('aditya_db_enrollments', JSON.stringify(enrollments));
    localStorage.setItem('aditya_db_applications', JSON.stringify(applications));
    localStorage.setItem('aditya_db_inquiries', JSON.stringify(inquiries));
    localStorage.setItem('aditya_db_conversations', JSON.stringify(conversations));
    localStorage.setItem('aditya_db_settings', JSON.stringify(settings));
  };

  return {
    users,
    courses,
    internships,
    projects,
    enrollments,
    applications,
    inquiries,
    conversations,
    settings,
    save,
  };
}

// Generate intelligent AI response when backend is offline
export function generateMockAiResponse(message: string, skillLevel = 'Intermediate', topicContext = 'General'): string {
  const q = message.toLowerCase();

  if (q.includes('gradient') || q.includes('loss') || q.includes('regression') || q.includes('machine learning') || q.includes('ml')) {
    return `### Understanding Gradient Descent & Loss Optimization

Gradient descent is the iterative optimization engine powering modern machine learning. Its goal is to minimize an empirical cost function $J(\\theta)$ by iteratively updating parameter vectors in the direction opposite to the gradient.

#### The Parameter Update Rule:
$$\\theta := \\theta - \\alpha \\nabla_{\\theta} J(\\theta)$$

Where:
* $\\theta$ represents the model weights.
* $\\alpha$ is the **learning rate** (hyperparameter).
* $\\nabla_{\\theta} J(\\theta)$ is the vector of partial derivatives with respect to each parameter.

\`\`\`python
import numpy as np

def gradient_descent(X, y, lr=0.01, epochs=1000):
    n_samples, n_features = X.shape
    weights = np.zeros(n_features)
    bias = 0.0

    for epoch in range(epochs):
        # Forward pass: linear prediction
        y_pred = np.dot(X, weights) + bias
        error = y_pred - y

        # Gradients
        dw = (1 / n_samples) * np.dot(X.T, error)
        db = (1 / n_samples) * np.sum(error)

        # Gradient update
        weights -= lr * dw
        bias -= lr * db

    return weights, bias
\`\`\`

**Key Takeaways for ${skillLevel} level:**
1. **Learning Rate Sensitivity:** If $\\alpha$ is too high, the cost diverges; if too low, convergence takes thousands of unnecessary epochs.
2. **Feature Scaling:** Always normalize features (e.g. Z-score scaling) so the error surface is spherical rather than elongated ellipses.`;
  }

  if (q.includes('react') || q.includes('hook') || q.includes('state') || q.includes('component') || q.includes('frontend')) {
    return `### React 19 State Management & Clean Architecture

When structuring modern React components with TypeScript, adhere to unidirectional data flow and clean separation of concerns.

\`\`\`tsx
import React, { useState, useEffect, useTransition } from 'react';

interface Task {
  id: string;
  title: string;
  isComplete: boolean;
}

export const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isPending, startTransition] = useTransition();

  const toggleTask = (id: string) => {
    startTransition(() => {
      setTasks(prev =>
        prev.map(t => (t.id === id ? { ...t, isComplete: !t.isComplete } : t))
      );
    });
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-2">Live Task Tracker</h3>
      <ul className="space-y-2">
        {tasks.map(t => (
          <li key={t.id} onClick={() => toggleTask(t.id)} className="cursor-pointer">
            <span className={t.isComplete ? 'line-through text-slate-400' : 'text-slate-800'}>
              {t.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
\`\`\`

**Best Practices:**
* Use \`useTransition\` for non-blocking UI updates in React 19.
* Leverage TypeScript interfaces for strict component prop contracts.
* Avoid redundant state: compute derived values during render instead of in effects.`;
  }

  if (q.includes('python') || q.includes('list') || q.includes('dict') || q.includes('loop')) {
    return `### Modern Python Idiomatic Programming

Python emphasizes readability, expressive data structures, and generator pipelines.

\`\`\`python
# Vectorized list comprehensions and dictionary mappings
raw_scores = [("Alice", 92), ("Bob", 84), ("Charlie", 96), ("Diana", 78)]

# Filtering and transforming with dictionary comprehension
honors_students = {
    name: score 
    for name, score in raw_scores 
    if score >= 85
}

print("Honors Students:", honors_students)
# Output: {'Alice': 92, 'Charlie': 96}
\`\`\`

**Recommended Next Step:**
Explore our **Python for Data Analysis** and **Machine Learning Fundamentals** courses in the ADITYA catalog to apply these concepts to high-dimensional datasets.`;
  }

  // Default intelligent response tailored to context
  return `### ADITYA AI Learning Assistant

Hello! I am your **ADITYA AI Tutor**, tailored to support your learning at the **${skillLevel}** level in **${topicContext}**.

Here is an analysis regarding your query:
> *"${message}"*

#### Core Conceptual Breakdown:
1. **Fundamental Principle:** In software engineering and AI architectures, clarity of abstraction and modularity are paramount. Break large systems into isolated, testable components.
2. **Applied Strategy:** When approaching this problem, first formulate the input-output contract, verify edge cases, and benchmark performance bottlenecks.
3. **Recommended Next Actions:**
   * Explore the interactive modules in your **ADITYA Courses** dashboard.
   * Test code snippets in your local development environment.
   * Ask me for a specific code demonstration or algorithmic deep-dive!

Feel free to ask a follow-up question or specify a language (Python, TypeScript, SQL, PyTorch) for an interactive code walk-through.`;
}
