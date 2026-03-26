import { motion } from "motion/react";
import { CareerSuggestion } from "../types";
import { ArrowLeft, CheckCircle2, Clock, Flag, MapPin, GraduationCap, ArrowRight, Building2, Globe, Briefcase, ExternalLink } from "lucide-react";

interface RoadmapProps {
  suggestion: CareerSuggestion;
  onBack: () => void;
}

export function Roadmap({ suggestion, onBack }: RoadmapProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-dark-muted hover:text-brand-500 transition-colors mb-8 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to suggestions
      </button>

      <div className="bg-dark-surface rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-dark-border mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-4xl font-bold font-display text-white mb-3">{suggestion.title}</h2>
            <p className="text-dark-muted max-w-xl">{suggestion.description}</p>
          </div>
          <div className="bg-brand-600 text-white p-6 rounded-3xl text-center min-w-[140px]">
            <p className="text-4xl font-bold">{suggestion.matchScore}%</p>
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">Match</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Flag className="w-5 h-5 text-brand-500" />
              The Roadmap
            </h3>
            
            <div className="relative space-y-12 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-dark-border">
              {suggestion.roadmap.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-12"
                >
                  <div className="absolute left-0 top-1 w-8 h-8 bg-dark-surface border-2 border-brand-500 rounded-full flex items-center justify-center z-10">
                    <span className="text-xs font-bold text-brand-500">{step.step}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-500 uppercase tracking-widest mb-1">
                    <Clock className="w-3 h-3" />
                    {step.duration}
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-dark-muted text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-brand-500" />
                  Learning Resources
                </h3>
                <div className="space-y-4">
                  {suggestion.courses.map((course, i) => (
                    <div key={i} className="p-5 bg-dark-bg rounded-2xl border border-dark-border hover:border-brand-500/50 transition-all group">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-500/10 text-brand-500 rounded-full uppercase">
                          {course.type}
                        </span>
                      </div>
                      <h4 className="font-bold text-white mb-1 group-hover:text-brand-500 transition-colors">{course.title}</h4>
                      <p className="text-sm text-dark-muted mb-4">{course.provider}</p>
                      <a 
                        href={course.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-brand-500 flex items-center gap-1 hover:underline"
                      >
                        View Course <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-brand-500" />
                  College Suggestions
                </h3>
                <div className="space-y-4">
                  {suggestion.colleges?.map((college, i) => (
                    <div key={i} className="p-5 bg-dark-bg border border-dark-border rounded-2xl shadow-sm hover:shadow-md transition-all">
                      <h4 className="font-bold text-white mb-1">{college.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-dark-muted mb-3">
                        <MapPin className="w-3 h-3" /> {college.location}
                      </div>
                      <p className="text-xs text-dark-muted mb-4">{college.reputation}</p>
                      {college.link && (
                        <a href={college.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-brand-500 flex items-center gap-1 hover:underline">
                          Visit Website <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-brand-500" />
                  Study Abroad
                </h3>
                <div className="space-y-4">
                  {suggestion.abroadStudy?.map((study, i) => (
                    <div key={i} className="p-5 bg-brand-500/10 rounded-2xl border border-brand-500/20">
                      <h4 className="font-bold text-brand-500 mb-2">{study.country}</h4>
                      <div className="space-y-2 mb-4">
                        <p className="text-[10px] font-bold text-brand-500/50 uppercase tracking-widest">Top Universities</p>
                        <div className="flex flex-wrap gap-1">
                          {study.topUniversities.map((uni, j) => (
                            <span key={j} className="text-[10px] px-2 py-0.5 bg-dark-surface text-brand-500 rounded-full border border-brand-500/20 font-medium">{uni}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-dark-muted mb-2 leading-relaxed">{study.benefits}</p>
                      <p className="text-xs font-bold text-white">Est. Cost: {study.averageCost}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-500" />
                  Real Job Links
                </h3>
                <div className="space-y-4">
                  {suggestion.realJobLinks?.map((job, i) => (
                    <div key={i} className="p-5 bg-dark-bg border border-dark-border rounded-2xl shadow-sm hover:shadow-md transition-all group">
                      <h4 className="font-bold text-white mb-1 group-hover:text-brand-500 transition-colors">{job.title}</h4>
                      <p className="text-sm text-dark-muted mb-1">{job.company}</p>
                      <div className="flex items-center gap-2 text-xs text-dark-muted/50 mb-4">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </div>
                      <a href={job.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-brand-500 flex items-center gap-1 hover:underline">
                        Apply Now <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand-500" />
                Potential Job Roles
              </h3>
              <div className="flex flex-wrap gap-3">
                {suggestion.jobRoles.map((role, i) => (
                  <div key={i} className="px-4 py-2 bg-brand-500/10 text-brand-500 rounded-xl text-sm font-semibold border border-brand-500/20 flex items-center gap-2">
                    {role.title}
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                      role.difficulty === "Easy" ? "bg-green-500/20 text-green-400" : 
                      role.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"
                    }`}>
                      {role.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
