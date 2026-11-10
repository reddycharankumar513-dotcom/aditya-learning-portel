import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentService } from '../services/studentService';
import { User, UserSkill } from '../types';
import { 
  User as UserIcon, Save, Plus, Trash2, Award, 
  Code, Globe, Sparkles, CheckCircle2, AlertCircle 
} from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('');
  const [department, setDepartment] = useState('');
  const [graduationYear, setGraduationYear] = useState<number>(2026);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProf, setNewSkillProf] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [preferredRole, setPreferredRole] = useState('Full Stack Engineer');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [goals, setGoals] = useState('');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setCollege(user.college || 'National Institute of Technology');
      setDegree(user.degree || 'B.Tech');
      setDepartment(user.department || 'Computer Science and Engineering');
      setGraduationYear(user.graduationYear || 2026);
      setSkills(user.skills || [
        { name: 'JavaScript / TypeScript', proficiency: 'Advanced' },
        { name: 'React', proficiency: 'Advanced' },
        { name: 'Node.js & Express', proficiency: 'Intermediate' },
        { name: 'Python', proficiency: 'Intermediate' },
        { name: 'Data Structures & Algorithms', proficiency: 'Intermediate' },
      ]);
      setPreferredRole(user.preferredRoles?.[0] || 'Full Stack Engineer');
      setGithub(user.github || '');
      setLinkedin(user.linkedin || '');
      setPortfolio(user.portfolio || '');
      setGoals(user.goals || '');
    }
  }, [user]);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills([...skills, { name: newSkillName.trim(), proficiency: newSkillProf }]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);
      const res = await studentService.updateProfile({
        name,
        phone,
        college,
        degree,
        department,
        graduationYear,
        skills,
        preferredRoles: [preferredRole],
        github,
        linkedin,
        portfolio,
        goals,
      });

      if (res.profile) {
        updateUser(res.profile);
        setMessage('Profile updated successfully! Career readiness recalibrated.');
      }
    } catch (err: any) {
      setMessage(err?.message || 'Error saving profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B18] text-[#F5F7FF] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-card-dark flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8065FF]/20 text-[#A68BFF] text-xs font-semibold mb-2">
              <UserIcon className="w-3.5 h-3.5 text-[#32C8F5]" />
              <span>Verified Engineering Identity</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Student Career Profile
            </h1>
            <p className="text-xs sm:text-sm text-[#A6B0C8] mt-1">
              Your profile data directly influences your Career Readiness score and employer talent discovery.
            </p>
          </div>

          <div className="text-center sm:text-right flex-shrink-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#A6B0C8] block">
              Readiness Score
            </span>
            <span className="text-3xl font-heading font-black text-[#30D6A0]">
              {user?.careerReadinessScore || 78}%
            </span>
          </div>
        </div>

        {message && (
          <div className="p-4 rounded-2xl bg-[#30D6A0]/10 border border-[#30D6A0]/30 text-xs text-[#30D6A0] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Basic & Academic Information */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
            <h3 className="text-base font-heading font-bold text-white mb-2">
              Academic & Personal Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#A6B0C8] font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#10162A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8065FF]"
                />
              </div>

              <div>
                <label className="block text-[#A6B0C8] font-semibold mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#10162A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8065FF]"
                />
              </div>

              <div>
                <label className="block text-[#A6B0C8] font-semibold mb-1">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full bg-[#10162A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8065FF]"
                />
              </div>

              <div>
                <label className="block text-[#A6B0C8] font-semibold mb-1">Degree & Major</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full bg-[#10162A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8065FF]"
                />
              </div>

              <div>
                <label className="block text-[#A6B0C8] font-semibold mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#10162A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8065FF]"
                />
              </div>

              <div>
                <label className="block text-[#A6B0C8] font-semibold mb-1">Graduation Year</label>
                <input
                  type="number"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(parseInt(e.target.value, 10))}
                  className="w-full bg-[#10162A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8065FF]"
                />
              </div>
            </div>
          </div>

          {/* Technical Skills Inventory */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
            <h3 className="text-base font-heading font-bold text-white mb-2">
              Verified Technical Skills
            </h3>

            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((sk, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white"
                >
                  <span className="font-semibold">{sk.name}</span>
                  <span className="text-[10px] text-[#A68BFF]">({sk.proficiency})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    className="text-[#FF647C] hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Skill Row */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="text"
                placeholder="Skill name (e.g., Docker, GraphQL, Kubernetes)"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 bg-[#10162A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#8065FF]"
              />
              <select
                value={newSkillProf}
                onChange={(e) => setNewSkillProf(e.target.value as any)}
                className="bg-[#10162A] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#8065FF]"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>
          </div>

          {/* Professional Links */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
            <h3 className="text-base font-heading font-bold text-white mb-2">
              Portfolio & Engineering Profiles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[#A6B0C8] font-semibold mb-1 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" />
                  <span>GitHub Profile</span>
                </label>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full bg-[#10162A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8065FF]"
                />
              </div>

              <div>
                <label className="block text-[#A6B0C8] font-semibold mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>LinkedIn Profile</span>
                </label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-[#10162A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8065FF]"
                />
              </div>

              <div>
                <label className="block text-[#A6B0C8] font-semibold mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Personal Portfolio</span>
                </label>
                <input
                  type="text"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="https://portfolio.dev"
                  className="w-full bg-[#10162A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8065FF]"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-white font-bold text-xs shadow-glow-violet hover:opacity-95 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Update Career Profile'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
