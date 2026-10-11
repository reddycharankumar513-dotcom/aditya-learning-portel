import { ENV } from '../config/env.js';

interface MessageParam {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeRequestOptions {
  messages: MessageParam[];
  skillLevel?: string;
  topicContext?: string;
}

export const claudeService = {
  async askTutor(options: ClaudeRequestOptions): Promise<{ content: string; source: 'claude' | 'fallback' }> {
    const { messages, skillLevel = 'Intermediate', topicContext = '' } = options;
    const lastUserMessage = messages[messages.length - 1]?.content || '';

    // If API key is configured, invoke the official Anthropic Claude Messages API
    if (ENV.ANTHROPIC_API_KEY && ENV.ANTHROPIC_API_KEY.trim().length > 10) {
      try {
        const systemPrompt = `You are ADITYA AI Tutor, an elite interactive computer science and engineering mentor on the ADITYA platform.
Your mission is to teach programming, Artificial Intelligence, Machine Learning, Data Science, Cloud Computing, and Software Engineering.
Guidelines:
1. Student skill depth: ${skillLevel}. Adapt vocabulary and complexity accordingly.
2. Structure your answer with clear headers, code blocks (with language specified, e.g. \`\`\`python), and practical real-world intuition.
3. For debugging questions: Identify the bug, explain WHY it occurred, and show the corrected code with explanatory comments.
4. For conceptual questions: Provide a high-level analogy first, then technical mechanics, then a practical code illustration.
5. Provide helpful hints before giving complete answers when the student asks for practice.
${topicContext ? `Contextual Course Topic: ${topicContext}` : ''}
Include a brief educational disclaimer when appropriate.`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ENV.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1500,
            system: systemPrompt,
            messages: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (response.ok) {
          const data: any = await response.json();
          const text = data?.content?.[0]?.text;
          if (text) {
            return { content: text, source: 'claude' };
          }
        } else {
          const errData: any = await response.json().catch(() => ({}));
          console.warn('[Claude API Error]:', response.status, errData);
        }
      } catch (err: any) {
        console.warn('[Claude API Exception, using pedagogical engine]:', err.message);
      }
    }

    // Intelligent pedagogical fallback responses tailored to computer science and AI inquiries
    const reply = generatePedagogicalResponse(lastUserMessage, skillLevel);
    return { content: reply, source: 'fallback' };
  },
};

function generatePedagogicalResponse(prompt: string, skillLevel: string): string {
  const p = prompt.toLowerCase();

  if (p.includes('neural network') || p.includes('deep learning')) {
    return `### Understanding Artificial Neural Networks (${skillLevel} Level)

An **Artificial Neural Network (ANN)** is a computational architecture inspired by biological neurons in the human brain. It learns to approximate complex nonlinear mappings from inputs $X$ to outputs $Y$.

#### 1. Core Anatomy
1. **Input Layer:** Receives raw features (e.g., pixel intensities, tabular values).
2. **Hidden Layers:** Transforms representations using affine combinations followed by nonlinear activations:
   $$z = W \\cdot x + b$$
   $$a = \\sigma(z)$$
3. **Activation Function:** Non-linearities such as **ReLU** ($f(x) = \\max(0, x)$) or **GELU** allow networks to learn non-linear boundaries.
4. **Loss Function:** Measures discrepancy between predictions $\\hat{y}$ and true labels $y$ (e.g., Cross-Entropy or Mean Squared Error).
5. **Backpropagation:** Computes gradients $\\frac{\\partial L}{\\partial W}$ via the multivariable chain rule to update weights via gradient descent.

#### PyTorch Architecture Example:
\`\`\`python
import torch
import torch.nn as nn

class FeedForwardClassifier(nn.Module):
    def __init__(self, in_features=784, hidden_dim=128, num_classes=10):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(in_features, hidden_dim),
            nn.BatchNorm1d(hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_dim, num_classes)
        )
        
    def forward(self, x):
        return self.network(x)

# Instantiate model & test forward pass
model = FeedForwardClassifier()
x_sample = torch.randn(32, 784)
logits = model(x_sample)
print(f"Batch logits shape: {logits.shape}") # [32, 10]
\`\`\`

> **Key takeaway:** Deeper layers compose lower-level primitives into high-level semantic representations.

*(To connect live Claude API inference, configure \`ANTHROPIC_API_KEY\` in your server \`.env\` file).*`;
  }

  if (p.includes('binary search') || p.includes('search algorithm')) {
    return `### Binary Search Explained (${skillLevel} Level)

**Binary Search** is an efficient divide-and-conquer algorithm for finding an element in a **sorted array**. Instead of checking each element sequentially in $O(N)$ time, it halves the search interval each step in $O(\\log N)$ time.

#### Algorithmic Principle:
1. Maintain two pointers: \`left\` and \`right\`.
2. Compute the midpoint: \`mid = left + (right - left) // 2\` (avoids integer overflow).
3. If \`target == arr[mid]\`, return index.
4. If \`target < arr[mid]\`, eliminate the right half: \`right = mid - 1\`.
5. If \`target > arr[mid]\`, eliminate the left half: \`left = mid + 1\`.

#### Clean Implementation with Tests:
\`\`\`python
def binary_search(arr: list[int], target: int) -> int:
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1  # Target element not found

# Verification
numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
idx = binary_search(numbers, 23)
print(f"Element 23 found at index: {idx}") # Output: 5
\`\`\`

> **Complexity:**
> - **Time Complexity:** $O(\\log N)$
> - **Space Complexity:** $O(1)$ iterative memory.

*(To connect live Claude API inference, configure \`ANTHROPIC_API_KEY\` in your server \`.env\` file).*`;
  }

  if (p.includes('python') && (p.includes('beginning') || p.includes('start') || p.includes('learn'))) {
    return `### Python from Scratch: Quickstart Foundations

Python is a high-level, interpreted programming language celebrated for readability, expressive syntax, and comprehensive scientific libraries.

#### Step 1: Fundamental Data Structures
\`\`\`python
# 1. Variables & Basic Types
student_name = "Alex"
active_modules = 4
gpa = 3.85
is_enrolled = True

# 2. Lists (Ordered, mutable collection)
technologies = ["Python", "PyTorch", "React", "Docker"]
technologies.append("FastAPI")

# 3. Dictionaries (Key-Value hash maps)
course_meta = {
    "title": "Machine Learning Fundamentals",
    "weeks": 8,
    "prerequisites": ["Python", "Linear Algebra"]
}

# 4. Iteration & Comprehensions
squared_numbers = [x**2 for x in range(6)]
print("Squares:", squared_numbers)  # [0, 1, 4, 9, 16, 25]
\`\`\`

#### Step 2: Functions & Error Handling
\`\`\`python
def calculate_progress(completed: int, total: int) -> float:
    if total <= 0:
        raise ValueError("Total modules must be positive.")
    return round((completed / total) * 100, 2)

try:
    print(f"Progress: {calculate_progress(3, 5)}%")  # 60.0%
except ValueError as err:
    print("Error:", err)
\`\`\`

> **Next Practice Step:** Enroll in ADITYA's **Python for AI** course on the Courses catalog page to practice interactive module exercises!`;
  }

  if (p.includes('study plan') || p.includes('machine learning')) {
    return `### Recommended Machine Learning Study Plan

Here is a structured, practical 8-week curriculum path recommended for your technical development:

#### Weeks 1–2: Mathematical & Computational Foundations
- Linear algebra: Matrix operations, eigenvalues, singular value decomposition (SVD).
- Multivariable calculus: Gradients, partial derivatives, Jacobian matrices.
- Python tools: NumPy arrays, vectorization, Pandas exploratory analysis.

#### Weeks 3–4: Classical Supervised & Unsupervised Learning
- Linear & Logistic Regression, regularization (Lasso & Ridge).
- Decision Trees, Random Forests, Gradient Boosted Trees (XGBoost).
- Unsupervised learning: K-Means clustering, Principal Component Analysis (PCA).

#### Weeks 5–6: Deep Learning Foundations
- Multi-layer perceptrons, activation functions, loss functions.
- Convolutional Neural Networks (CNN) for computer vision tasks.
- PyTorch mechanics: \`Dataset\`, \`DataLoader\`, forward pass, and autograd.

#### Weeks 7–8: Modern Generative AI & Capstone Project
- Sequence modeling and Transformer attention mechanisms.
- Building a full-stack RAG (Retrieval Augmented Generation) pipeline with Claude and Vector DB.
- Deploying the inference pipeline as a containerized REST API with Docker and FastAPI.`;
  }

  if (p.includes('project idea') || (p.includes('react') && p.includes('node'))) {
    return `### Production Project Idea: Distributed AI Code Reviewer

A high-impact portfolio artifact demonstrating full-stack engineering and AI integration:

#### 1. Architecture Overview
- **Frontend (React + TypeScript + Tailwind):** Monaco code editor or Prism.js highlighting, diff comparison view, and interactive comments sidebar.
- **Backend (Node.js + Express + TypeScript):** REST API with JWT authentication, webhook receiver for GitHub pull requests, and rate limiting.
- **AI Integration (Claude API):** Sends code diffs with custom prompts to detect memory leaks, race conditions, and security anti-patterns.
- **Database (MongoDB):** Stores user reviews, repository snapshots, and review analytics.

#### 2. Key Technical Highlights to Showcase on Resume:
- Asynchronous queuing with Redis / BullMQ for long-running code reviews.
- Streaming responses from Claude via Server-Sent Events (SSE).
- WebSocket notifications when analysis completes.
- Unit testing with Vitest/Jest and containerized deployment with Docker.

> **Next Step:** You can log this project in your **Student Dashboard -> Project Portfolio** manager right here on ADITYA!`;
  }

  // Generic technical assistant fallback
  return `### ADITYA AI Tutor Explanation (${skillLevel} Level)

Thank you for your question: *"${prompt}"*

#### Technical Breakdown:
1. **Core Concept:** When approaching software engineering or artificial intelligence problems, decompose the problem into input constraints, computational guarantees, and edge condition handling.
2. **Best Practices:**
   - Write clean, modular, and test-driven code.
   - Profile algorithms for time complexity $O(f(n))$ and memory overhead.
   - Use strongly typed interfaces (such as TypeScript or Python type annotations) to catch runtime errors early.

\`\`\`python
# Example: Modular Engineering Pattern
def solve_problem(data: list) -> dict:
    """Processes input data and returns structured metrics."""
    clean_data = [x for x in data if x is not None]
    return {
        "count": len(clean_data),
        "unique": len(set(clean_data))
    }
\`\`\`

Feel free to ask follow-up questions, request step-by-step debugging hints, or ask for exercises on this topic!

*(To enable live Claude API generation, ensure \`ANTHROPIC_API_KEY\` is configured in your server \`.env\` file).*`;
}
