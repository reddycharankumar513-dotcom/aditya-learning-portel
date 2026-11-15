import { Request, Response } from 'express';
import multer from 'multer';
import { Resume } from '../models/Resume.js';
import { ResumeAnalysis } from '../models/ResumeAnalysis.js';
import { User } from '../models/User.js';
import { ResumeParserService } from '../services/resumeParserService.js';
import { AIService } from '../services/ai/AIService.js';

// Multer memory storage (files kept in memory buffer for security & instant parsing)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(pdf|docx|doc|txt)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only PDF, DOCX, and TXT files are supported.'));
    }
  },
});

export const resumeUploadMiddleware = upload.single('resume');

export const resumeController = {
  /**
   * POST /api/ai/resumes/upload
   * Handles multipart resume file upload OR json raw text, parses it, and runs AI analysis
   */
  async uploadAndAnalyze(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?._id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      let rawText = '';
      let fileName = 'resume.pdf';
      let fileSize = 0;
      let mimeType = 'application/pdf';

      if (req.file) {
        fileName = req.file.originalname;
        fileSize = req.file.size;
        mimeType = req.file.mimetype;

        const parsed = await ResumeParserService.parseBuffer(req.file.buffer, mimeType, fileName);
        rawText = parsed.rawText;
      } else if (req.body.resumeText && req.body.resumeText.trim().length >= 30) {
        rawText = req.body.resumeText.trim();
        fileName = req.body.fileName || 'Pasted_Resume.txt';
        fileSize = Buffer.byteLength(rawText, 'utf8');
        mimeType = 'text/plain';
      } else {
        return res.status(400).json({
          success: false,
          message: 'Please provide either a valid resume file (PDF/DOCX) or paste resume text (min 30 characters).',
        });
      }

      const targetRole = req.body.targetRole || 'Full Stack Developer';
      const targetJobDescription = req.body.targetJobDescription || '';

      // Parse structured sections
      const parsedData = ResumeParserService.parseText(rawText);

      // Run AI analysis
      const analysisData = await AIService.analyzeResume({
        resumeText: rawText,
        targetRole,
        targetJobDescription,
        userId: userId.toString(),
      });

      // Create Resume Analysis record
      const analysisRecord = await ResumeAnalysis.create({
        user: userId,
        fileName,
        targetRole,
        targetJobDescription,
        overallScore: analysisData.overallScore,
        atsScore: analysisData.overallScore,
        sectionScores: analysisData.sectionScores,
        matchPercentage: targetJobDescription ? 75 : 85,
        extractedSkills: analysisData.extractedSkills,
        missingKeywords: analysisData.missingSkills,
        strengths: analysisData.strengths,
        improvements: analysisData.improvementRecommendations,
        weaknesses: analysisData.weaknesses,
        bulletPointSuggestions: analysisData.bulletPointSuggestions,
        tailoringRecommendations: analysisData.improvementRecommendations,
        experienceSummary: `${parsedData.experience.length} experience item(s) detected.`,
        educationSummary: `${parsedData.education.length} academic credential(s) detected.`,
      });

      // Create or update Resume document
      const resumeRecord = await Resume.create({
        user: userId,
        fileName,
        fileSize,
        mimeType,
        rawText,
        targetRole,
        targetJobDescription,
        parsedSections: {
          personalInfo: parsedData.personalInfo,
          summary: parsedData.summary,
          skills: parsedData.skills,
          experience: parsedData.experience,
          projects: parsedData.projects,
          education: parsedData.education,
          certifications: parsedData.certifications,
        },
        improvedContent: {
          summary: parsedData.summary,
          projects: parsedData.projects.map((p) => ({
            title: p.title,
            bullets: p.bullets,
          })),
        },
        latestAnalysis: analysisRecord._id,
      });

      analysisRecord.resume = resumeRecord._id as any;
      await analysisRecord.save();

      // Update student's career readiness resume score
      await User.findByIdAndUpdate(userId, {
        $set: {
          'readinessBreakdown.resumeScore': analysisData.overallScore,
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Resume parsed and analyzed successfully',
        resume: resumeRecord,
        analysis: analysisRecord,
      });
    } catch (err: any) {
      console.error('[ResumeController] Upload error:', err);
      return res.status(500).json({
        success: false,
        message: err.message || 'Error processing resume upload',
      });
    }
  },

  /**
   * GET /api/ai/resumes
   * Lists all uploaded resumes for the current student
   */
  async getResumes(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?._id;
      const resumes = await Resume.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate('latestAnalysis');

      return res.status(200).json({ success: true, resumes });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/ai/resumes/:id
   * Retrieves single resume by ID
   */
  async getResumeById(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?._id;
      const { id } = req.params;

      const resume = await Resume.findById(id).populate('latestAnalysis');
      if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume not found' });
      }

      if (resume.user.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      return res.status(200).json({ success: true, resume });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/ai/resumes/:id/match-job
   * Deep semantic comparison against target job description
   */
  async matchJobDescription(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?._id;
      const { id } = req.params;
      const { jobDescription } = req.body;

      if (!jobDescription || jobDescription.trim().length < 20) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid job description (at least 20 characters).',
        });
      }

      const resume = await Resume.findById(id);
      if (!resume || resume.user.toString() !== userId.toString()) {
        return res.status(404).json({ success: false, message: 'Resume not found' });
      }

      const matchData = await AIService.matchJobDescription({
        resumeText: resume.rawText,
        jobDescription: jobDescription.trim(),
        userId: userId.toString(),
      });

      resume.targetJobDescription = jobDescription;
      await resume.save();

      return res.status(200).json({
        success: true,
        match: matchData,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/ai/resumes/:id/improve
   * Generates AI recommendations and Google XYZ bullet rewrites
   */
  async improveResume(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?._id;
      const { id } = req.params;

      const resume = await Resume.findById(id);
      if (!resume || resume.user.toString() !== userId.toString()) {
        return res.status(404).json({ success: false, message: 'Resume not found' });
      }

      const improvements = await AIService.improveResumeSections({
        resumeText: resume.rawText,
        targetRole: resume.targetRole,
        targetJobDescription: resume.targetJobDescription,
        userId: userId.toString(),
      });

      return res.status(200).json({
        success: true,
        improvements,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * PUT /api/ai/resumes/:id/sections
   * Applies approved AI suggestions or manual edits to the resume builder state
   */
  async updateSections(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?._id;
      const { id } = req.params;
      const { summary, projects, skills, acceptedSuggestion } = req.body;

      const resume = await Resume.findById(id);
      if (!resume || resume.user.toString() !== userId.toString()) {
        return res.status(404).json({ success: false, message: 'Resume not found' });
      }

      if (!resume.improvedContent) {
        resume.improvedContent = { acceptedSuggestions: [] };
      }

      if (summary) {
        resume.improvedContent.summary = summary;
      }
      if (projects) {
        resume.improvedContent.projects = projects;
      }
      if (skills && Array.isArray(skills)) {
        resume.parsedSections.skills = skills;
      }
      if (acceptedSuggestion) {
        resume.improvedContent.acceptedSuggestions = Array.from(
          new Set([...(resume.improvedContent.acceptedSuggestions || []), acceptedSuggestion])
        );
      }

      await resume.save();

      return res.status(200).json({
        success: true,
        message: 'Resume updated successfully',
        resume,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/ai/resumes/:id/export
   * Exports improved resume in clean formatted markdown and HTML
   */
  async exportResume(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?._id;
      const { id } = req.params;

      const resume = await Resume.findById(id);
      if (!resume || resume.user.toString() !== userId.toString()) {
        return res.status(404).json({ success: false, message: 'Resume not found' });
      }

      const p = resume.parsedSections?.personalInfo || {};
      const summary = resume.improvedContent?.summary || resume.parsedSections?.summary || '';
      const skills = resume.parsedSections?.skills || [];
      const projects = resume.improvedContent?.projects || resume.parsedSections?.projects || [];
      const experience = resume.parsedSections?.experience || [];
      const education = resume.parsedSections?.education || [];

      // Generate clean Markdown output
      let md = `# ${p.name || 'Candidate'}\n`;
      const contactBits = [p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean);
      if (contactBits.length) md += `${contactBits.join(' | ')}\n\n`;

      if (summary) {
        md += `## Professional Summary\n${summary}\n\n`;
      }

      if (skills.length) {
        md += `## Technical Skills\n${skills.join(', ')}\n\n`;
      }

      if (experience.length) {
        md += `## Professional Experience\n`;
        for (const exp of experience) {
          md += `### ${exp.title} — ${exp.company}\n`;
          for (const b of exp.bullets || []) {
            md += `- ${b}\n`;
          }
          md += `\n`;
        }
      }

      if (projects.length) {
        md += `## Technical Projects\n`;
        for (const proj of projects) {
          md += `### ${proj.title}\n`;
          for (const b of proj.bullets || []) {
            md += `- ${b}\n`;
          }
          md += `\n`;
        }
      }

      if (education.length) {
        md += `## Education\n`;
        for (const edu of education) {
          md += `- **${edu.degree}** — ${edu.institution}\n`;
        }
      }

      return res.status(200).json({
        success: true,
        fileName: `${(p.name || 'Resume').replace(/\s+/g, '_')}_Learnova_Improved.md`,
        contentMarkdown: md,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/ai/resumes/history (Backwards compatibility)
   */
  async getResumeAnalyses(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?._id;
      const analyses = await ResumeAnalysis.find({ user: userId }).sort({ createdAt: -1 });

      return res.json({
        success: true,
        analyses,
      });
    } catch (err: any) {
      return res.status(500).json({ message: 'Error fetching analyses', error: err.message });
    }
  },
};

// Aliases for legacy imports
export const analyzeResume = resumeController.uploadAndAnalyze;
export const getResumeAnalyses = resumeController.getResumeAnalyses;
