import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Download, Plus, Trash2, User, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Settings, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { UserProfile } from "../types";
import { jsPDF } from "jspdf";
import { domToCanvas } from "modern-screenshot";

interface ResumeBuilderProps {
  profile: UserProfile;
}

export function ResumeBuilder({ profile }: ResumeBuilderProps) {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: profile.name,
      email: profile.email || "kannurritish@gmail.com",
      phone: "+91 91102 12345",
      location: "Pune, India",
      github: "github.com/ritishk",
      portfolio: "ritishk.dev",
      linkedin: "linkedin.com/in/ritishk",
      summary: profile.goal || "Software Engineer with a focus on building scalable backend systems and machine learning applications."
    },
    experience: [
      { id: "1", title: "Software Engineer III", company: "Walmart", duration: "Feb 2023 - Present", description: "Engineered scalable backend services in Planner, a Java SpringBoot and REST API-based framework, to batch millions of express and scheduled orders into optimized last-mile delivery trips across 500+ locations.\nOptimized carrier, van, and driver assignment algorithms, reducing average route time by 18% and improving delivery success rates in high-volume, time-sensitive environments." }
    ],
    education: [
      { id: "1", degree: "M.S. in Computer Science (Specialization: Machine Learning)", school: "Georgia Institute of Technology, Atlanta, GA", year: "Aug 2021 - Dec 2022", gpa: "3.9/4", coursework: "Data Structures, Machine Learning, AI, Computer Vision, Big Data" },
      { id: "2", degree: "B.E. in Computer Engineering (Gold Medalist)", school: "University of Pune (SPPU)", year: "Jul 2015 - May 2019", gpa: "9.48/10", coursework: "Operating Systems, Database Management, Algorithms" }
    ],
    skills: {
      languages: "Python, Java, C/C++, JavaScript, SpringBoot, Node.js, TensorFlow, PyTorch",
      cloud: "AWS, Microsoft Azure, Google Cloud Platform (GCP), Firebase",
      devops: "Docker, Kubernetes, Jenkins, Git, CI/CD, IntelliJ, VS Code, JIRA, Postman, Grafana",
      databases: "MySQL, Elasticsearch, SQLite"
    },
    projects: [
      { id: "1", title: "Visual Reasoning for the Visually Impaired", duration: "Sep 2021 - Dec 2021", description: "Developed a deep learning model using PyTorch and TensorFlow to assist blind users in querying their environment via image-based question answering.\nIntegrated CNNs for object detection and applied BERT for natural language query understanding.\nAchieved 82% accuracy on a custom dataset of 1,000 real-world scenarios." }
    ],
    publications: [
      { id: "1", title: "Bharatia D, Smart E-Stick for Visually Impaired using Video Intelligence API, IEEE IBSSC 2019." }
    ],
    honors: [
      { id: "1", title: "University Gold Medalist and Overall Topper and all-rounder of the Computer Department for 4 years." }
    ]
  });

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [template, setTemplate] = useState<"modern" | "classic">("classic");
  const [isGenerating, setIsGenerating] = useState(false);

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, { id: Date.now().toString(), title: "", company: "", duration: "", description: "" }]
    });
  };

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter(exp => exp.id !== id)
    });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, { id: Date.now().toString(), degree: "", school: "", year: "", gpa: "", coursework: "" }]
    });
  };

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id)
    });
  };

  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [...resumeData.projects, { id: Date.now().toString(), title: "", duration: "", description: "" }]
    });
  };

  const removeProject = (id: string) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.filter(p => p.id !== id)
    });
  };

  const addPublication = () => {
    setResumeData({
      ...resumeData,
      publications: [...resumeData.publications, { id: Date.now().toString(), title: "" }]
    });
  };

  const removePublication = (id: string) => {
    setResumeData({
      ...resumeData,
      publications: resumeData.publications.filter(p => p.id !== id)
    });
  };

  const addHonor = () => {
    setResumeData({
      ...resumeData,
      honors: [...resumeData.honors, { id: Date.now().toString(), title: "" }]
    });
  };

  const removeHonor = (id: string) => {
    setResumeData({
      ...resumeData,
      honors: resumeData.honors.filter(h => h.id !== id)
    });
  };

  const handleDownload = async () => {
    // Switch to preview mode if not already there
    if (activeTab !== "preview") {
      setActiveTab("preview");
      // Wait for DOM update and animation to finish
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const element = document.getElementById("resume-preview");
    if (!element) {
      console.error("Resume preview element not found");
      return;
    }

    setIsGenerating(true);
    try {
      // Temporarily remove shadow and border for better capture
      const originalStyle = element.style.cssText;
      element.style.boxShadow = "none";
      element.style.border = "none";
      element.style.borderRadius = "0";
      element.style.transform = "none"; // Disable any motion transforms

      const canvas = await domToCanvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        width: element.offsetWidth,
        height: element.offsetHeight
      });

      // Restore original style
      element.style.cssText = originalStyle;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      // Handle multi-page if content is too long
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${resumeData.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      // Fallback to print if jspdf fails
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold font-display text-white mb-2">Resume Builder</h1>
          <p className="text-dark-muted">Create a professional resume tailored to your career goals.</p>
        </div>
        <div className="flex bg-dark-surface p-1 rounded-2xl border border-dark-border shadow-sm">
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "edit" ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'text-dark-muted hover:text-brand-500'}`}
          >
            Edit Content
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "preview" ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'text-dark-muted hover:text-brand-500'}`}
          >
            Live Preview
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {activeTab === "edit" ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {/* Personal Info */}
                <section className="p-8 bg-dark-surface rounded-[2.5rem] border border-dark-border shadow-sm">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-brand-600" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-dark-muted uppercase tracking-widest ml-1">Full Name</label>
                      <input
                        type="text"
                        className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
                        value={resumeData.personalInfo.fullName}
                        onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, fullName: e.target.value } })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-dark-muted uppercase tracking-widest ml-1">Email Address</label>
                      <input
                        type="email"
                        className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, email: e.target.value } })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-dark-muted uppercase tracking-widest ml-1">Phone Number</label>
                      <input
                        type="tel"
                        className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, phone: e.target.value } })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-dark-muted uppercase tracking-widest ml-1">Location</label>
                      <input
                        type="text"
                        className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
                        value={resumeData.personalInfo.location}
                        onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, location: e.target.value } })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-dark-muted uppercase tracking-widest ml-1">GitHub Link</label>
                      <input
                        type="text"
                        className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
                        value={resumeData.personalInfo.github}
                        onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, github: e.target.value } })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-dark-muted uppercase tracking-widest ml-1">Portfolio Link</label>
                      <input
                        type="text"
                        className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
                        value={resumeData.personalInfo.portfolio}
                        onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, portfolio: e.target.value } })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-dark-muted uppercase tracking-widest ml-1">LinkedIn Link</label>
                      <input
                        type="text"
                        className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
                        value={resumeData.personalInfo.linkedin}
                        onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value } })}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-dark-muted uppercase tracking-widest ml-1">Professional Summary (Optional)</label>
                      <textarea
                        rows={4}
                        className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50 resize-none"
                        value={resumeData.personalInfo.summary}
                        onChange={(e) => setResumeData({ ...resumeData, personalInfo: { ...resumeData.personalInfo, summary: e.target.value } })}
                      />
                    </div>
                  </div>
                </section>

                {/* Skills Section */}
                <section className="p-8 bg-dark-surface rounded-[2.5rem] border border-dark-border shadow-sm">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-brand-500" />
                    Skills
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-dark-muted uppercase tracking-widest ml-1">Languages & Frameworks</label>
                      <input
                        type="text"
                        className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
                        value={resumeData.skills.languages}
                        onChange={(e) => setResumeData({ ...resumeData, skills: { ...resumeData.skills, languages: e.target.value } })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-dark-muted uppercase tracking-widest ml-1">Cloud Platforms</label>
                      <input
                        type="text"
                        className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
                        value={resumeData.skills.cloud}
                        onChange={(e) => setResumeData({ ...resumeData, skills: { ...resumeData.skills, cloud: e.target.value } })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-dark-muted uppercase tracking-widest ml-1">DevOps & Tools</label>
                      <input
                        type="text"
                        className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
                        value={resumeData.skills.devops}
                        onChange={(e) => setResumeData({ ...resumeData, skills: { ...resumeData.skills, devops: e.target.value } })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-dark-muted uppercase tracking-widest ml-1">Databases</label>
                      <input
                        type="text"
                        className="w-full p-4 bg-dark-bg border border-dark-border rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-white placeholder:text-dark-muted/50"
                        value={resumeData.skills.databases}
                        onChange={(e) => setResumeData({ ...resumeData, skills: { ...resumeData.skills, databases: e.target.value } })}
                      />
                    </div>
                  </div>
                </section>

                {/* Experience */}
                <section className="p-8 bg-dark-surface rounded-[2.5rem] border border-dark-border shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-brand-500" />
                      Work Experience
                    </h3>
                    <button onClick={addExperience} className="p-2 bg-brand-500/10 text-brand-500 rounded-xl hover:bg-brand-500/20 transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    {resumeData.experience.map((exp, index) => (
                      <div key={exp.id} className="p-6 bg-dark-bg rounded-3xl border border-dark-border relative group">
                        <button 
                          onClick={() => removeExperience(exp.id)}
                          className="absolute top-4 right-4 p-2 text-dark-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            placeholder="Job Title"
                            className="w-full p-3 bg-dark-surface border border-dark-border rounded-xl outline-none text-white placeholder:text-dark-muted/50"
                            value={exp.title}
                            onChange={(e) => {
                              const newExp = [...resumeData.experience];
                              newExp[index].title = e.target.value;
                              setResumeData({ ...resumeData, experience: newExp });
                            }}
                          />
                          <input
                            placeholder="Company Name"
                            className="w-full p-3 bg-dark-surface border border-dark-border rounded-xl outline-none text-white placeholder:text-dark-muted/50"
                            value={exp.company}
                            onChange={(e) => {
                              const newExp = [...resumeData.experience];
                              newExp[index].company = e.target.value;
                              setResumeData({ ...resumeData, experience: newExp });
                            }}
                          />
                          <input
                            placeholder="Duration (e.g. 2020 - Present)"
                            className="w-full p-3 bg-dark-surface border border-dark-border rounded-xl outline-none text-white placeholder:text-dark-muted/50"
                            value={exp.duration}
                            onChange={(e) => {
                              const newExp = [...resumeData.experience];
                              newExp[index].duration = e.target.value;
                              setResumeData({ ...resumeData, experience: newExp });
                            }}
                          />
                          <textarea
                            placeholder="Key Responsibilities"
                            rows={3}
                            className="w-full md:col-span-2 p-3 bg-dark-surface border border-dark-border rounded-xl outline-none resize-none text-white placeholder:text-dark-muted/50"
                            value={exp.description}
                            onChange={(e) => {
                              const newExp = [...resumeData.experience];
                              newExp[index].description = e.target.value;
                              setResumeData({ ...resumeData, experience: newExp });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Education */}
                <section className="p-8 bg-dark-surface rounded-[2.5rem] border border-dark-border shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-brand-500" />
                      Education
                    </h3>
                    <button onClick={addEducation} className="p-2 bg-brand-500/10 text-brand-500 rounded-xl hover:bg-brand-500/20 transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    {resumeData.education.map((edu, index) => (
                      <div key={edu.id} className="p-6 bg-dark-bg rounded-3xl border border-dark-border relative group">
                        <button 
                          onClick={() => removeEducation(edu.id)}
                          className="absolute top-4 right-4 p-2 text-dark-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            placeholder="Degree"
                            className="w-full md:col-span-1 p-3 bg-dark-surface border border-dark-border rounded-xl outline-none text-white placeholder:text-dark-muted/50"
                            value={edu.degree}
                            onChange={(e) => {
                              const newEdu = [...resumeData.education];
                              newEdu[index].degree = e.target.value;
                              setResumeData({ ...resumeData, education: newEdu });
                            }}
                          />
                          <input
                            placeholder="School/University"
                            className="w-full md:col-span-1 p-3 bg-dark-surface border border-dark-border rounded-xl outline-none text-white placeholder:text-dark-muted/50"
                            value={edu.school}
                            onChange={(e) => {
                              const newEdu = [...resumeData.education];
                              newEdu[index].school = e.target.value;
                              setResumeData({ ...resumeData, education: newEdu });
                            }}
                          />
                          <input
                            placeholder="Year"
                            className="w-full md:col-span-1 p-3 bg-dark-surface border border-dark-border rounded-xl outline-none text-white placeholder:text-dark-muted/50"
                            value={edu.year}
                            onChange={(e) => {
                              const newEdu = [...resumeData.education];
                              newEdu[index].year = e.target.value;
                              setResumeData({ ...resumeData, education: newEdu });
                            }}
                          />
                          <input
                            placeholder="GPA (e.g. 3.9/4)"
                            className="w-full md:col-span-1 p-3 bg-dark-surface border border-dark-border rounded-xl outline-none text-white placeholder:text-dark-muted/50"
                            value={edu.gpa}
                            onChange={(e) => {
                              const newEdu = [...resumeData.education];
                              newEdu[index].gpa = e.target.value;
                              setResumeData({ ...resumeData, education: newEdu });
                            }}
                          />
                          <textarea
                            placeholder="Relevant Coursework"
                            rows={2}
                            className="w-full md:col-span-2 p-3 bg-dark-surface border border-dark-border rounded-xl outline-none resize-none text-white placeholder:text-dark-muted/50"
                            value={edu.coursework}
                            onChange={(e) => {
                              const newEdu = [...resumeData.education];
                              newEdu[index].coursework = e.target.value;
                              setResumeData({ ...resumeData, education: newEdu });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Academic Projects */}
                <section className="p-8 bg-dark-surface rounded-[2.5rem] border border-dark-border shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-brand-500" />
                      Academic Projects
                    </h3>
                    <button onClick={addProject} className="p-2 bg-brand-500/10 text-brand-500 rounded-xl hover:bg-brand-500/20 transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    {resumeData.projects.map((proj, index) => (
                      <div key={proj.id} className="p-6 bg-dark-bg rounded-3xl border border-dark-border relative group">
                        <button 
                          onClick={() => removeProject(proj.id)}
                          className="absolute top-4 right-4 p-2 text-dark-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            placeholder="Project Title"
                            className="w-full p-3 bg-dark-surface border border-dark-border rounded-xl outline-none text-white placeholder:text-dark-muted/50"
                            value={proj.title}
                            onChange={(e) => {
                              const newProj = [...resumeData.projects];
                              newProj[index].title = e.target.value;
                              setResumeData({ ...resumeData, projects: newProj });
                            }}
                          />
                          <input
                            placeholder="Duration"
                            className="w-full p-3 bg-dark-surface border border-dark-border rounded-xl outline-none text-white placeholder:text-dark-muted/50"
                            value={proj.duration}
                            onChange={(e) => {
                              const newProj = [...resumeData.projects];
                              newProj[index].duration = e.target.value;
                              setResumeData({ ...resumeData, projects: newProj });
                            }}
                          />
                          <textarea
                            placeholder="Description (Use new lines for bullet points)"
                            rows={3}
                            className="w-full md:col-span-2 p-3 bg-dark-surface border border-dark-border rounded-xl outline-none resize-none text-white placeholder:text-dark-muted/50"
                            value={proj.description}
                            onChange={(e) => {
                              const newProj = [...resumeData.projects];
                              newProj[index].description = e.target.value;
                              setResumeData({ ...resumeData, projects: newProj });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Publications */}
                <section className="p-8 bg-dark-surface rounded-[2.5rem] border border-dark-border shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-brand-500" />
                      Publications
                    </h3>
                    <button onClick={addPublication} className="p-2 bg-brand-500/10 text-brand-500 rounded-xl hover:bg-brand-500/20 transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {resumeData.publications.map((pub, index) => (
                      <div key={pub.id} className="flex gap-2">
                        <input
                          placeholder="Publication Detail"
                          className="w-full p-3 bg-dark-bg border border-dark-border rounded-xl outline-none text-white placeholder:text-dark-muted/50"
                          value={pub.title}
                          onChange={(e) => {
                            const newPub = [...resumeData.publications];
                            newPub[index].title = e.target.value;
                            setResumeData({ ...resumeData, publications: newPub });
                          }}
                        />
                        <button onClick={() => removePublication(pub.id)} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Honors & Leadership */}
                <section className="p-8 bg-dark-surface rounded-[2.5rem] border border-dark-border shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-brand-500" />
                      Honors & Leadership
                    </h3>
                    <button onClick={addHonor} className="p-2 bg-brand-500/10 text-brand-500 rounded-xl hover:bg-brand-500/20 transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {resumeData.honors.map((honor, index) => (
                      <div key={honor.id} className="flex gap-2">
                        <input
                          placeholder="Honor/Leadership Detail"
                          className="w-full p-3 bg-dark-bg border border-dark-border rounded-xl outline-none text-white placeholder:text-dark-muted/50"
                          value={honor.title}
                          onChange={(e) => {
                            const newHonor = [...resumeData.honors];
                            newHonor[index].title = e.target.value;
                            setResumeData({ ...resumeData, honors: newHonor });
                          }}
                        />
                        <button onClick={() => removeHonor(honor.id)} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-dark-surface p-12 shadow-2xl min-h-[1056px] w-full max-w-[816px] mx-auto print:p-0 print:shadow-none print:border-none print:max-w-none ${template === 'classic' ? 'font-serif text-white' : 'rounded-[2.5rem] border border-dark-border'}`}
                id="resume-preview"
              >
                {template === 'classic' ? (
                  <div className="space-y-4">
                    {/* Classic Header */}
                    <div className="text-center space-y-1">
                      <h2 className="text-3xl font-bold text-white">{resumeData.personalInfo.fullName}</h2>
                      <div className="flex flex-wrap justify-center items-center gap-x-2 text-[11px] text-dark-muted">
                        <span>{resumeData.personalInfo.location}</span>
                        <span className="text-dark-border">|</span>
                        <span className="underline text-brand-400">{resumeData.personalInfo.email}</span>
                        <span className="text-dark-border">|</span>
                        <span>{resumeData.personalInfo.phone}</span>
                      </div>
                      <div className="flex flex-wrap justify-center items-center gap-x-2 text-[11px] text-dark-muted">
                        {resumeData.personalInfo.github && (
                          <>
                            <span className="underline text-brand-400">{resumeData.personalInfo.github}</span>
                            <span className="text-dark-border">|</span>
                          </>
                        )}
                        {resumeData.personalInfo.portfolio && (
                          <>
                            <span className="underline text-brand-400">{resumeData.personalInfo.portfolio}</span>
                            <span className="text-dark-border">|</span>
                          </>
                        )}
                        {resumeData.personalInfo.linkedin && (
                          <span className="underline text-brand-400">{resumeData.personalInfo.linkedin}</span>
                        )}
                      </div>
                    </div>

                    {/* Education */}
                    <section>
                      <h3 className="text-sm font-bold border-b border-dark-border pb-0.5 mb-2 text-white">Education</h3>
                      <div className="space-y-2">
                        {resumeData.education.map((edu) => (
                          <div key={edu.id} className="text-[11px] text-dark-muted">
                            <div className="flex justify-between font-bold text-white">
                              <span>{edu.school}</span>
                              <span>{edu.year}</span>
                            </div>
                            <div className="flex justify-between italic">
                              <span>{edu.degree}</span>
                              {edu.gpa && <span>GPA: {edu.gpa}</span>}
                            </div>
                            {edu.coursework && (
                              <p className="mt-0.5">
                                <span className="italic">Relevant Coursework:</span> {edu.coursework}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Skills */}
                    <section>
                      <h3 className="text-sm font-bold border-b border-dark-border pb-0.5 mb-2 text-white">Skills</h3>
                      <div className="space-y-1 text-[11px] text-dark-muted">
                        <p><span className="font-bold text-white">Languages & Frameworks:</span> {resumeData.skills.languages}</p>
                        <p><span className="font-bold text-white">Cloud Platforms:</span> {resumeData.skills.cloud}</p>
                        <p><span className="font-bold text-white">DevOps & Tools:</span> {resumeData.skills.devops}</p>
                        <p><span className="font-bold text-white">Databases:</span> {resumeData.skills.databases}</p>
                      </div>
                    </section>

                    {/* Experience */}
                    <section>
                      <h3 className="text-sm font-bold border-b border-dark-border pb-0.5 mb-2 text-white">Professional Experience</h3>
                      <div className="space-y-4">
                        {resumeData.experience.map((exp) => (
                          <div key={exp.id} className="text-[11px] text-dark-muted">
                            <div className="flex justify-between font-bold text-white">
                              <span>{exp.company}, {exp.title}</span>
                              <span>{exp.duration}</span>
                            </div>
                            <ul className="list-disc ml-5 space-y-1 mt-1">
                              {exp.description.split('\n').map((line, i) => (
                                <li key={i}>{line}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Projects */}
                    <section>
                      <h3 className="text-sm font-bold border-b border-dark-border pb-0.5 mb-2 text-white">Academic Projects</h3>
                      <div className="space-y-4">
                        {resumeData.projects.map((proj) => (
                          <div key={proj.id} className="text-[11px] text-dark-muted">
                            <div className="flex justify-between font-bold text-white">
                              <span>{proj.title}</span>
                              <span>{proj.duration}</span>
                            </div>
                            <ul className="list-disc ml-5 space-y-1 mt-1">
                              {proj.description.split('\n').map((line, i) => (
                                <li key={i}>{line}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Publications */}
                    <section>
                      <h3 className="text-sm font-bold border-b border-dark-border pb-0.5 mb-2 text-white">Publications</h3>
                      <ul className="list-disc ml-5 space-y-1 text-[11px] text-dark-muted">
                        {resumeData.publications.map((pub) => (
                          <li key={pub.id}>{pub.title}</li>
                        ))}
                      </ul>
                    </section>

                    {/* Honors */}
                    <section>
                      <h3 className="text-sm font-bold border-b border-dark-border pb-0.5 mb-2 text-white">Honors & Leadership</h3>
                      <ul className="list-disc ml-5 space-y-1 text-[11px] text-dark-muted">
                        {resumeData.honors.map((honor) => (
                          <li key={honor.id}>{honor.title}</li>
                        ))}
                      </ul>
                    </section>
                  </div>
                ) : (
                  <>
                    {/* Modern Template (Existing) */}
                    <header className="text-center border-b-2 border-dark-border pb-8 mb-8">
                      <h2 className="text-4xl font-bold text-white mb-4">{resumeData.personalInfo.fullName}</h2>
                      <div className="flex flex-wrap justify-center gap-6 text-sm text-dark-muted">
                        <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-500" /> {resumeData.personalInfo.email}</span>
                        <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-500" /> {resumeData.personalInfo.phone}</span>
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-500" /> {resumeData.personalInfo.location}</span>
                      </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                      <div className="md:col-span-2 space-y-10">
                        {resumeData.personalInfo.summary && (
                          <section>
                            <h3 className="text-lg font-bold text-white uppercase tracking-widest border-b border-dark-border pb-2 mb-4">Summary</h3>
                            <p className="text-dark-muted leading-relaxed">{resumeData.personalInfo.summary}</p>
                          </section>
                        )}

                        <section>
                          <h3 className="text-lg font-bold text-white uppercase tracking-widest border-b border-dark-border pb-2 mb-4">Experience</h3>
                          <div className="space-y-6">
                            {resumeData.experience.map((exp) => (
                              <div key={exp.id}>
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-bold text-white">{exp.title}</h4>
                                  <span className="text-sm text-dark-muted">{exp.duration}</span>
                                </div>
                                <p className="text-sm font-bold text-brand-500 mb-2">{exp.company}</p>
                                <ul className="list-disc ml-4 text-sm text-dark-muted space-y-1">
                                  {exp.description.split('\n').map((line, i) => (
                                    <li key={i}>{line}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </section>

                        <section>
                          <h3 className="text-lg font-bold text-white uppercase tracking-widest border-b border-dark-border pb-2 mb-4">Education</h3>
                          <div className="space-y-4">
                            {resumeData.education.map((edu) => (
                              <div key={edu.id} className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-bold text-white">{edu.degree}</h4>
                                  <p className="text-sm text-brand-500">{edu.school}</p>
                                  {edu.coursework && <p className="text-xs text-dark-muted mt-1">Coursework: {edu.coursework}</p>}
                                </div>
                                <div className="text-right">
                                  <span className="text-sm text-dark-muted block">{edu.year}</span>
                                  {edu.gpa && <span className="text-xs font-bold text-dark-muted/70">GPA: {edu.gpa}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>

                        {resumeData.projects.length > 0 && (
                          <section>
                            <h3 className="text-lg font-bold text-white uppercase tracking-widest border-b border-dark-border pb-2 mb-4">Projects</h3>
                            <div className="space-y-6">
                              {resumeData.projects.map((proj) => (
                                <div key={proj.id}>
                                  <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-white">{proj.title}</h4>
                                    <span className="text-sm text-dark-muted">{proj.duration}</span>
                                  </div>
                                  <ul className="list-disc ml-4 text-sm text-dark-muted space-y-1">
                                    {proj.description.split('\n').map((line, i) => (
                                      <li key={i}>{line}</li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </section>
                        )}
                      </div>

                      <div className="space-y-10">
                        <section>
                          <h3 className="text-lg font-bold text-white uppercase tracking-widest border-b border-dark-border pb-2 mb-4">Skills</h3>
                          <div className="space-y-4">
                            <div>
                              <p className="text-xs font-bold text-dark-muted/70 uppercase mb-2">Languages</p>
                              <p className="text-sm text-dark-muted">{resumeData.skills.languages}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-dark-muted/70 uppercase mb-2">Cloud</p>
                              <p className="text-sm text-dark-muted">{resumeData.skills.cloud}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-dark-muted/70 uppercase mb-2">DevOps</p>
                              <p className="text-sm text-dark-muted">{resumeData.skills.devops}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-dark-muted/70 uppercase mb-2">Databases</p>
                              <p className="text-sm text-dark-muted">{resumeData.skills.databases}</p>
                            </div>
                          </div>
                        </section>

                        {resumeData.publications.length > 0 && (
                          <section>
                            <h3 className="text-lg font-bold text-white uppercase tracking-widest border-b border-dark-border pb-2 mb-4">Publications</h3>
                            <div className="space-y-3">
                              {resumeData.publications.map((pub) => (
                                <div key={pub.id} className="flex items-start gap-2">
                                  <FileText className="w-4 h-4 text-brand-500 mt-1 shrink-0" />
                                  <p className="text-sm text-dark-muted">{pub.title}</p>
                                </div>
                              ))}
                            </div>
                          </section>
                        )}

                        <section>
                          <h3 className="text-lg font-bold text-white uppercase tracking-widest border-b border-dark-border pb-2 mb-4">Honors</h3>
                          <div className="space-y-2">
                            {resumeData.honors.map((honor) => (
                              <div key={honor.id} className="flex items-start gap-2">
                                <Award className="w-4 h-4 text-brand-500 mt-1 shrink-0" />
                                <p className="text-sm text-dark-muted">{honor.title}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-8 print-hide">
          <div className="p-8 bg-dark-surface rounded-[2.5rem] text-white shadow-2xl sticky top-24 border border-dark-border">
            <h3 className="text-xl font-bold mb-6">Resume Settings</h3>
            <div className="space-y-6">
              <div className="p-4 bg-dark-bg rounded-2xl border border-dark-border">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="w-5 h-5 text-brand-400" />
                  <h4 className="font-bold">Template Style</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setTemplate("modern")}
                    className={`p-3 rounded-xl text-xs font-bold transition-all ${template === "modern" ? "bg-brand-600 text-white" : "bg-dark-surface text-white hover:bg-dark-surface/80"}`}
                  >
                    Modern
                  </button>
                  <button 
                    onClick={() => setTemplate("classic")}
                    className={`p-3 rounded-xl text-xs font-bold transition-all ${template === "classic" ? "bg-brand-600 text-white" : "bg-dark-surface text-white hover:bg-dark-surface/80"}`}
                  >
                    Classic
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-dark-muted leading-relaxed">
                  Your resume is automatically saved to your profile. You can download it as a PDF for applications.
                </p>
                <button
                  disabled={isGenerating}
                  onClick={handleDownload}
                  className="w-full py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                  Download PDF
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 bg-brand-500/10 rounded-[2.5rem] border border-brand-500/20">
            <div className="w-12 h-12 bg-dark-surface rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-dark-border">
              <CheckCircle2 className="w-6 h-6 text-brand-500" />
            </div>
            <h4 className="font-bold text-white mb-2">Ready to apply?</h4>
            <p className="text-sm text-dark-muted mb-4 leading-relaxed">
              Use our Interview Practice module to sharpen your skills before your first application.
            </p>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'interview-practice' }))}
              className="text-sm font-bold text-brand-500 hover:underline flex items-center gap-1"
            >
              Start Practice <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
