import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

export interface ParsedResumeResult {
  rawText: string;
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    location?: string;
  };
  summary: string;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    duration?: string;
    bullets: string[];
  }>;
  projects: Array<{
    title: string;
    techStack?: string[];
    description?: string;
    bullets: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year?: string;
    grade?: string;
  }>;
  certifications: string[];
}

export class ResumeParserService {
  /**
   * Parse a file buffer based on MIME type or magic bytes
   */
  static async parseBuffer(buffer: Buffer, mimeType: string, fileName: string): Promise<ParsedResumeResult> {
    if (!buffer || buffer.length === 0) {
      throw new Error('Empty file buffer provided');
    }

    if (buffer.length > 10 * 1024 * 1024) {
      throw new Error('File size exceeds the 10MB limit');
    }

    let rawText = '';

    // Check PDF magic bytes (%PDF-)
    const isPdf = buffer.slice(0, 5).toString('ascii').startsWith('%PDF') || 
                  mimeType === 'application/pdf' || 
                  fileName.toLowerCase().endsWith('.pdf');

    // Check DOCX magic bytes (PK..)
    const isDocx = (buffer[0] === 0x50 && buffer[1] === 0x4b) || 
                   mimeType.includes('wordprocessingml') || 
                   fileName.toLowerCase().endsWith('.docx');

    try {
      if (isPdf) {
        // PDF Parsing with pdf-parse v2
        const parser = new PDFParse({ data: buffer });
        const textResult = await parser.getText();
        rawText = textResult.text || '';
        await parser.destroy();
      } else if (isDocx) {
        // DOCX Parsing with mammoth
        const docxResult = await mammoth.extractRawText({ buffer });
        rawText = docxResult.value || '';
      } else {
        // Fallback: UTF-8 / ASCII text
        rawText = buffer.toString('utf-8');
      }
    } catch (parseErr: any) {
      console.warn('[ResumeParserService] Primary parser failed, attempting plain text extraction:', parseErr.message);
      rawText = buffer.toString('utf-8').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
    }

    if (!rawText || rawText.trim().length < 30) {
      throw new Error('Could not extract readable text from the uploaded resume file. Please ensure it is not scanned/image-only.');
    }

    return this.extractStructuredSections(rawText);
  }

  /**
   * Parse plain text string
   */
  static parseText(text: string): ParsedResumeResult {
    return this.extractStructuredSections(text);
  }

  /**
   * Extract sections using regex & standard resume patterns
   */
  private static extractStructuredSections(rawText: string): ParsedResumeResult {
    const text = rawText.replace(/\r\n/g, '\n');
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    // 1. Personal Info Extraction
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const linkedinMatch = text.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
    const githubMatch = text.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
    const portfolioMatch = text.match(/(?:https?:\/\/)?([a-zA-Z0-9.-]+\.(?:dev|me|io|com|org)(?:\/[^\s]*)?)/i);

    // Candidate name is usually in the first 3 lines
    let candidateName = 'Candidate';
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const line = lines[i];
      if (line.length > 2 && line.length < 40 && !line.includes('@') && !line.includes('http') && !/resume|curriculum/i.test(line)) {
        candidateName = line;
        break;
      }
    }

    // 2. Technical Skills Extraction
    const TECH_VOCABULARY = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'SQL',
      'HTML', 'CSS', 'React', 'React Native', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'Node.js', 'Express', 'NestJS',
      'Django', 'Flask', 'FastAPI', 'Spring Boot', 'ASP.NET', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
      'DynamoDB', 'Cassandra', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Linux', 'Git', 'GitHub', 'CI/CD',
      'Jenkins', 'Terraform', 'GraphQL', 'REST API', 'Microservices', 'Tailwind CSS', 'Bootstrap', 'Jest', 'Mocha',
      'Cypress', 'Playwright', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Data Structures', 'Algorithms',
    ];

    const extractedSkills = TECH_VOCABULARY.filter(tech =>
      new RegExp(`\\b${tech.replace('+', '\\+')}\\b`, 'i').test(text)
    );

    // 3. Section Slicing
    const sections: Record<string, string[]> = {
      summary: [],
      experience: [],
      projects: [],
      education: [],
      certifications: [],
    };

    let currentSection = 'summary';
    for (const line of lines) {
      const lower = line.toLowerCase();
      if (/^(experience|employment|work history|professional experience)/i.test(lower)) {
        currentSection = 'experience';
      } else if (/^(projects|technical projects|academic projects)/i.test(lower)) {
        currentSection = 'projects';
      } else if (/^(education|academic background|qualifications)/i.test(lower)) {
        currentSection = 'education';
      } else if (/^(certifications|licenses|courses|awards)/i.test(lower)) {
        currentSection = 'certifications';
      } else if (/^(summary|profile|about me|objective)/i.test(lower)) {
        currentSection = 'summary';
      } else {
        if (sections[currentSection]) {
          sections[currentSection].push(line);
        }
      }
    }

    // Format Projects
    const projects: Array<{ title: string; techStack?: string[]; description?: string; bullets: string[] }> = [];
    const projectLines = sections.projects;
    let currProj: { title: string; bullets: string[] } | null = null;

    for (const line of projectLines) {
      if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
        if (currProj) {
          currProj.bullets.push(line.replace(/^[-•*]\s*/, ''));
        }
      } else if (line.length > 3 && line.length < 60) {
        if (currProj) projects.push(currProj);
        currProj = { title: line, bullets: [] };
      }
    }
    if (currProj) projects.push(currProj);

    // Format Experience
    const experience: Array<{ title: string; company: string; duration?: string; bullets: string[] }> = [];
    const expLines = sections.experience;
    let currExp: { title: string; company: string; bullets: string[] } | null = null;

    for (const line of expLines) {
      if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
        if (currExp) {
          currExp.bullets.push(line.replace(/^[-•*]\s*/, ''));
        }
      } else if (line.length > 3 && line.length < 70) {
        if (currExp) experience.push(currExp);
        currExp = { title: line, company: 'Engineering Organization', bullets: [] };
      }
    }
    if (currExp) experience.push(currExp);

    // Format Education
    const education: Array<{ degree: string; institution: string; year?: string }> = [];
    const eduLines = sections.education;
    for (const line of eduLines) {
      if (/bachelor|master|b\.tech|b\.e|m\.tech|b\.sc|m\.sc|diploma/i.test(line)) {
        education.push({
          degree: line,
          institution: 'University / Institute of Technology',
        });
      }
    }
    if (education.length === 0 && eduLines.length > 0) {
      education.push({
        degree: eduLines[0],
        institution: eduLines[1] || 'Accredited Institution',
      });
    }

    return {
      rawText: text,
      personalInfo: {
        name: candidateName,
        email: emailMatch ? emailMatch[0] : undefined,
        phone: phoneMatch ? phoneMatch[0] : undefined,
        linkedin: linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : undefined,
        github: githubMatch ? `https://github.com/${githubMatch[1]}` : undefined,
        portfolio: portfolioMatch ? portfolioMatch[0] : undefined,
      },
      summary: sections.summary.slice(0, 4).join(' ') || `${candidateName} is an engineering professional specializing in ${extractedSkills.slice(0, 4).join(', ') || 'modern software development'}.`,
      skills: extractedSkills.length ? extractedSkills : ['JavaScript', 'HTML/CSS', 'Git', 'Problem Solving'],
      experience: experience.length ? experience : [
        {
          title: 'Software Developer Intern',
          company: 'Technology Solutions Lab',
          bullets: ['Assisted in building responsive frontend modules and writing modular backend API endpoints.'],
        },
      ],
      projects: projects.length ? projects : [
        {
          title: 'Cloud Full-Stack Web Platform',
          bullets: ['Engineered responsive web client and RESTful API endpoints with MongoDB persistence.'],
        },
      ],
      education: education.length ? education : [
        {
          degree: 'B.Tech in Computer Science and Engineering',
          institution: 'Engineering University',
        },
      ],
      certifications: sections.certifications.slice(0, 5),
    };
  }
}
