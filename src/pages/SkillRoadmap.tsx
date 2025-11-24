import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Home, CheckCircle2, Circle, ExternalLink, Zap, Code, Cpu, BookOpen, Target, TrendingUp, Lightbulb } from "lucide-react";
import { roadmaps, type CareerRoadmap } from "../data/roadmaps";

export default function SkillRoadmap() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const careerName = searchParams.get("career");
  const subTrack = searchParams.get("sub");

  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(new Set(["foundations"]));
  const [completedMilestones, setCompletedMilestones] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"roadmap" | "skills" | "insights">("roadmap");

  useEffect(() => {
    if (careerName) {
      const foundRoadmap = roadmaps[careerName];
      setRoadmap(foundRoadmap);
    }
  }, [careerName]);

  const toggleMilestone = (id: string) => {
    const newExpanded = new Set(expandedMilestones);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedMilestones(newExpanded);
  };

  const toggleComplete = (id: string) => {
    const newCompleted = new Set(completedMilestones);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedMilestones(newCompleted);
  };

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ABE6C4] mx-auto mb-4"></div>
          <p className="text-lg text-gray-400">Loading your personalized roadmap...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = (completedMilestones.size / roadmap.milestones.length) * 100;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 border border-gray-700"
          >
            <Home size={20} />
            <span className="text-sm font-['Poppins']">Back to Home</span>
          </button>

          {/* Progress indicator */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 font-['Poppins']">
              {completedMilestones.size} / {roadmap.milestones.length} milestones
            </span>
            <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-[#ABE6C4] rounded-full"></div>
            <span className="text-sm text-[#ABE6C4] font-['Poppins'] uppercase tracking-wide">Your Learning Path</span>
          </div>
          <h1 className="text-5xl font-['Questrial'] mb-4">
            {roadmap.career}
            {subTrack && <span className="text-gray-400"> — {subTrack}</span>}
          </h1>
          <p className="text-xl text-gray-400 font-['Poppins'] leading-relaxed max-w-3xl">
            {roadmap.overview}
          </p>
          <div className="mt-6 inline-block px-6 py-3 bg-gray-800/50 rounded-full border border-gray-700">
            <span className="text-sm text-gray-300 font-['Poppins']">
              ⏱️ Estimated Time: <span className="text-[#ABE6C4]">{roadmap.totalDuration}</span>
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          {[
            { id: "roadmap", label: "Learning Roadmap" },
            { id: "skills", label: "Key Skills" },
            { id: "insights", label: "Industry Insights" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-6 py-3 font-['Poppins'] text-sm transition-all duration-200 relative ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ABE6C4]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "roadmap" && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Milestones Timeline */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-800"></div>

                {roadmap.milestones.map((milestone, index) => {
                  const isExpanded = expandedMilestones.has(milestone.id);
                  const isCompleted = completedMilestones.has(milestone.id);

                  return (
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative mb-8 last:mb-0"
                    >
                      {/* Milestone Card */}
                      <div className="ml-16">
                        <div
                          className={`rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                            isCompleted
                              ? "bg-gradient-to-br from-[#0f0f0f] to-black border-[#ABE6C4]/40 shadow-lg shadow-[#ABE6C4]/10"
                              : "bg-gradient-to-br from-black/60 to-black/40 border-gray-800 hover:border-gray-700"
                          }`}
                        >
                          {/* Side gradient bar */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#ABE6C4] to-[#7CC9A9] transition-opacity duration-300 ${isCompleted ? 'opacity-100' : 'opacity-20'}`}></div>

                          {/* Header */}
                          <div
                            className="p-6 cursor-pointer"
                            onClick={() => toggleMilestone(milestone.id)}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 pl-3">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ABE6C4]/10 to-[#7CC9A9]/10 border border-[#ABE6C4]/20">
                                    <div className="w-2 h-2 rounded-full bg-[#ABE6C4]"></div>
                                    <span className="text-xs text-[#ABE6C4] font-['Poppins'] font-semibold">
                                      PHASE {index + 1}
                                    </span>
                                  </div>
                                  <div className="h-1 w-8 bg-gradient-to-r from-[#ABE6C4]/30 to-transparent rounded-full"></div>
                                  <span className="text-xs text-gray-400 font-['Poppins']">
                                    {milestone.duration}
                                  </span>
                                </div>
                                <h3 className="text-2xl font-['Questrial'] mb-2 text-white">
                                  {milestone.title}
                                </h3>
                                <p className="text-gray-400 font-['Poppins'] text-sm leading-relaxed">
                                  {milestone.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleComplete(milestone.id);
                                  }}
                                  className={`p-2.5 rounded-xl transition-all duration-200 ${
                                    isCompleted
                                      ? "bg-gradient-to-br from-[#ABE6C4] to-[#7CC9A9] text-black shadow-lg shadow-[#ABE6C4]/30"
                                      : "bg-gray-800/50 text-gray-500 hover:bg-gray-700/50 border border-gray-700"
                                  }`}
                                >
                                  {isCompleted ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                                </button>
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <ChevronDown size={22} className="text-gray-500" />
                                </motion.div>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Content */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-6 space-y-6">
                                  {/* Skills to Learn */}
                                  <div>
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="h-0.5 w-10 bg-gradient-to-r from-[#ABE6C4] to-transparent rounded-full"></div>
                                      <h4 className="text-sm font-['Poppins'] text-[#ABE6C4] uppercase tracking-wider font-semibold">
                                        Skills to Master
                                      </h4>
                                    </div>
                                    <div className="space-y-2">
                                      {milestone.skills.map((skill, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-start gap-3 p-3 rounded-xl bg-transparent border border-[#ABE6C4]/20"
                                        >
                                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#ABE6C4] to-[#7CC9A9] flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckCircle2 size={14} className="text-black" />
                                          </div>
                                          <span className="text-sm text-white font-['Poppins'] leading-relaxed">
                                            {skill}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Resources */}
                                  <div>
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="h-0.5 w-10 bg-gradient-to-r from-[#7CC9A9] to-transparent rounded-full"></div>
                                      <h4 className="text-sm font-['Poppins'] text-[#7CC9A9] uppercase tracking-wider font-semibold">
                                        Recommended Resources
                                      </h4>
                                    </div>
                                    <div className="space-y-2">
                                      {milestone.resources.map((resource, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-start gap-3 p-3 rounded-xl bg-transparent border border-[#7CC9A9]/20"
                                        >
                                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#7CC9A9] to-[#ABE6C4] flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <ExternalLink size={14} className="text-black" />
                                          </div>
                                          <span className="text-sm text-white font-['Poppins'] leading-relaxed">
                                            {resource}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Timeline marker */}
                        <div
                          className={`absolute left-0 top-6 w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                            isCompleted
                              ? "bg-gradient-to-br from-[#ABE6C4] to-[#7CC9A9] border-[#ABE6C4]/50 shadow-lg shadow-[#ABE6C4]/30"
                              : "bg-[#1a1a1a] border-gray-800"
                          }`}
                        >
                          <span
                            className={`text-sm font-bold font-['Poppins'] ${
                              isCompleted ? "text-black" : "text-gray-500"
                            }`}
                          >
                            {index + 1}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === "skills" && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-0.5 w-10 bg-gradient-to-r from-[#ABE6C4] to-transparent rounded-full"></div>
                <h4 className="text-sm font-['Poppins'] text-[#ABE6C4] uppercase tracking-wider font-semibold">
                  Key Skills
                </h4>
              </div>

              <div className="grid grid-cols-3 gap-8">
                {/* Column 1 - First half of skills */}
                <div className="space-y-4">
                  {roadmap.keySkills.slice(0, Math.ceil(roadmap.keySkills.length / 2)).map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="flex items-start gap-3 p-5 rounded-xl bg-gradient-to-r from-black/40 to-black/20 border border-gray-800"
                    >
                      {/* Dot indicator */}
                      <div className="w-2 h-2 rounded-full bg-[#ABE6C4] flex-shrink-0 mt-2.5"></div>

                      {/* Skill text */}
                      <p className="text-white font-['Poppins'] text-base leading-relaxed">
                        {skill}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Column 2 - Second half of skills */}
                <div className="space-y-4">
                  {roadmap.keySkills.slice(Math.ceil(roadmap.keySkills.length / 2)).map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index + Math.ceil(roadmap.keySkills.length / 2)) * 0.08 }}
                      className="flex items-start gap-3 p-5 rounded-xl bg-gradient-to-r from-black/40 to-black/20 border border-gray-800"
                    >
                      {/* Dot indicator */}
                      <div className="w-2 h-2 rounded-full bg-[#ABE6C4] flex-shrink-0 mt-2.5"></div>

                      {/* Skill text */}
                      <p className="text-white font-['Poppins'] text-base leading-relaxed">
                        {skill}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Column 3 - Illustration */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-black/40 to-black/20 border-2 border-[#ABE6C4]/20 p-10 relative overflow-hidden"
                >
                  {/* Decorative background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `linear-gradient(#ABE6C4 1px, transparent 1px), linear-gradient(90deg, #ABE6C4 1px, transparent 1px)`,
                      backgroundSize: '30px 30px'
                    }}></div>
                  </div>

                  <img
                    src="/assets/keyskills.png"
                    alt="Key Skills Illustration"
                    className="w-full h-auto object-contain relative z-10 scale-110"
                  />
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === "insights" && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-0.5 w-10 bg-gradient-to-r from-[#ABE6C4] to-transparent rounded-full"></div>
                <h4 className="text-sm font-['Poppins'] text-[#ABE6C4] uppercase tracking-wider font-semibold">
                  Industry Insights
                </h4>
              </div>
              <div className="space-y-3">
                {roadmap.industryInsights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-5 rounded-xl bg-transparent border border-[#ABE6C4]/20"
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#ABE6C4] to-[#7CC9A9] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Lightbulb size={14} className="text-black" />
                    </div>
                    <p className="text-base text-white font-['Poppins'] leading-relaxed">
                      {insight}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-[#0f0f0f] to-black border-2 border-[#ABE6C4]/30 relative overflow-hidden"
        >
          {/* Decorative corner accents */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#ABE6C4]/10 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#7CC9A9]/10 to-transparent rounded-tr-full"></div>

          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(#ABE6C4 1px, transparent 1px), linear-gradient(90deg, #ABE6C4 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="max-w-2xl relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-1 w-12 bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] rounded-full"></div>
              <span className="text-xs text-[#ABE6C4] font-['Poppins'] uppercase tracking-wider font-semibold">Next Steps</span>
            </div>

            <h3 className="text-2xl font-['Questrial'] mb-3 text-white">Ready to Start Your Journey?</h3>
            <p className="text-gray-300 font-['Poppins'] mb-6 leading-relaxed">
              Remember: This roadmap is a guide, not a strict rule. Everyone's learning journey is unique.
              Adapt it to your pace, explore detours that interest you, and most importantly — start building!
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/results?assessmentId=" + searchParams.get("assessmentId"))}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ABE6C4] to-[#7CC9A9] text-black font-['Poppins'] font-semibold hover:shadow-lg hover:shadow-[#ABE6C4]/30 transition-all duration-200"
              >
                View Results Again
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded-xl bg-gray-800/50 text-white font-['Poppins'] font-semibold hover:bg-gray-700/50 transition-all duration-200 border-2 border-gray-700 hover:border-[#ABE6C4]/30"
              >
                Go to Home
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
