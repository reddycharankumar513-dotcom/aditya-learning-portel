import { User } from '../models/User.js';
import { Course } from '../models/Course.js';
import { Internship } from '../models/Internship.js';
import { Project } from '../models/Project.js';
import { Enrollment } from '../models/Enrollment.js';
import { connectDB } from '../config/db.js';

export const seedDatabase = async (): Promise<void> => {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      console.log('[Seed] Database not connected. Skipping seeding.');
      return;
    }

    const courseCount = await Course.countDocuments();
    if (courseCount > 0) {
      console.log(`[Seed] Database already contains ${courseCount} courses. Seeding skipped.`);
      return;
    }

    console.log('[Seed] Seeding initial ADITYA database content...');

    // 1. Seed Demo Admin & Student Users
    import('bcryptjs').then(async (bcrypt) => {});
    const bcrypt = await import('bcryptjs');
    const adminHashedPassword = await bcrypt.default.hash('Admin@123456', 10);
    const studentHashedPassword = await bcrypt.default.hash('Student@123456', 10);

    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@aditya-ed.org' },
      {
        name: 'ADITYA Administrator',
        email: 'admin@aditya-ed.org',
        password: adminHashedPassword,
        role: 'admin',
        country: 'India',
        educationStatus: 'Platform Administrator',
        learningInterests: ['Artificial Intelligence & ML', 'Software Development'],
      },
      { upsert: true, new: true }
    );

    const studentUser = await User.findOneAndUpdate(
      { email: 'student@aditya-ed.org' },
      {
        name: 'Aditya Demo Student',
        email: 'student@aditya-ed.org',
        password: studentHashedPassword,
        role: 'student',
        country: 'India',
        educationStatus: 'College Student',
        learningInterests: ['Artificial Intelligence & ML', 'Software Development'],
        goals: 'Master Full-Stack Web Development and Deep Learning Systems',
      },
      { upsert: true, new: true }
    );

    // 2. Seed Rich Course Curriculums
    const initialCourses = [
      {
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
        enrolledCount: 14,
        featured: true,
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
        enrolledCount: 28,
        featured: true,
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
        enrolledCount: 19,
        featured: true,
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
        enrolledCount: 22,
        featured: true,
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
        enrolledCount: 31,
        featured: false,
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
        enrolledCount: 16,
        featured: false,
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

    const createdCourses = await Course.insertMany(initialCourses);
    console.log(`[Seed] Created ${createdCourses.length} initial courses.`);

    // 3. Create Sample Enrollments for Demo Student
    if (createdCourses.length >= 2) {
      await Enrollment.create([
        {
          user: studentUser._id,
          course: createdCourses[0]._id, // ML Fundamentals
          progress: 50,
          completedModules: ['m1'],
          status: 'active',
        },
        {
          user: studentUser._id,
          course: createdCourses[1]._id, // Full-Stack
          progress: 100,
          completedModules: ['fs-m1', 'fs-m2'],
          status: 'completed',
          completedAt: new Date(),
        },
      ]);
    }

    // 4. Seed Sample Portfolio Projects for Demo Student
    await Project.create([
      {
        user: studentUser._id,
        title: 'Distributed Task Queue System',
        description: 'High-throughput asynchronous job processor built with Node.js, Redis, and TypeScript with priority queues and exponential backoff retries.',
        techStack: ['Node.js', 'TypeScript', 'Redis', 'Docker'],
        status: 'Completed',
        repoUrl: 'https://github.com/aditya-ed/sample-task-queue',
        demoUrl: 'https://demo-queue.aditya-ed.org',
      },
      {
        user: studentUser._id,
        title: 'Vision Classifier with PyTorch',
        description: 'Fine-tuned ResNet model for industrial component defect inspection with Grad-CAM heatmap visualization of classification boundaries.',
        techStack: ['PyTorch', 'Torchvision', 'Python', 'FastAPI'],
        status: 'In Progress',
        repoUrl: 'https://github.com/aditya-ed/sample-vision-classifier',
      },
    ]);

    // 5. Seed Verified Technical Internship Opportunities
    await Internship.create([
      {
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
    ]);

    console.log('[Seed] Seeding completed successfully!');
  } catch (err: any) {
    console.error('[Seed Error]:', err.message);
  }
};

// Execute if run directly via CLI (tsx seedData.ts)
if (process.argv[1]?.includes('seedData')) {
  seedDatabase().then(() => {
    console.log('[Seed] Done. Exiting process.');
    process.exit(0);
  });
}
