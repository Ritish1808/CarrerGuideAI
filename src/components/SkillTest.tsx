import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, ArrowRight, Brain } from "lucide-react";

interface Question {
  id: string;
  text: string;
  category: "Skill" | "Interest" | "Personality";
  options: { value: string; label: string }[];
}

const questions: Question[] = [
  {
    id: "q1",
    text: "How much do you enjoy solving complex logical puzzles or coding challenges?",
    category: "Skill",
    options: [
      { value: "high", label: "I love it, it's my favorite thing" },
      { value: "medium", label: "I enjoy it occasionally" },
      { value: "low", label: "Not really my thing" },
    ],
  },
  {
    id: "q2",
    text: "Do you prefer working with people or working independently on technical tasks?",
    category: "Personality",
    options: [
      { value: "people", label: "Working with people" },
      { value: "independent", label: "Working independently" },
      { value: "balanced", label: "A mix of both" },
    ],
  },
  {
    id: "q3",
    text: "Which of these activities sounds most exciting to you?",
    category: "Interest",
    options: [
      { value: "creative", label: "Designing a beautiful interface" },
      { value: "analytical", label: "Analyzing a large dataset" },
      { value: "leadership", label: "Leading a team to success" },
      { value: "technical", label: "Building a complex system" },
    ],
  },
  {
    id: "q4",
    text: "How comfortable are you with public speaking or presenting ideas?",
    category: "Skill",
    options: [
      { value: "high", label: "Very comfortable" },
      { value: "medium", label: "Somewhat comfortable" },
      { value: "low", label: "I'd rather avoid it" },
    ],
  },
];

interface SkillTestProps {
  onComplete: (results: { skillLevel: string; interestType: string; answers: Record<string, string> }) => void;
}

export function SkillTest({ onComplete }: SkillTestProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[currentStep].id]: value };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Simple logic to determine skill level and interest type
      const skillLevel = newAnswers.q1 === "high" ? "Advanced Technical" : "Generalist";
      const interestType = newAnswers.q3;
      onComplete({ skillLevel, interestType, answers: newAnswers });
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-brand-500" />
            Skill & Interest Test
          </h2>
          <span className="text-sm font-bold text-dark-muted">
            Question {currentStep + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full h-2 bg-dark-surface rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-brand-600"
          />
        </div>
      </div>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-dark-surface p-8 md:p-12 rounded-[2rem] shadow-xl border border-dark-border"
      >
        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-brand-500/10 text-brand-500 mb-4">
          {questions[currentStep].category}
        </span>
        <h3 className="text-xl md:text-2xl font-bold text-white mb-8 leading-tight">
          {questions[currentStep].text}
        </h3>

        <div className="space-y-4">
          {questions[currentStep].options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className="w-full p-5 text-left bg-dark-bg hover:bg-brand-500/10 border border-dark-border hover:border-brand-500/50 rounded-2xl transition-all group flex items-center justify-between"
            >
              <span className="font-semibold text-dark-muted group-hover:text-brand-500">
                {option.label}
              </span>
              <ArrowRight className="w-5 h-5 text-dark-muted/30 group-hover:text-brand-500 transition-colors" />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
