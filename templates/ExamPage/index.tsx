"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    Check,
    LayoutGrid,
    Loader2,
    Clock,
    Flag,
    Trophy,
    Zap,
    SendHorizonal,
    History,
    AlertCircle
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useStudyStore } from "@/store/useStudyStore";

import Layout from "@/components/Layout";
import { Progress } from "@/components/ui/progress";
import { COURSES } from "@/constants/study";
import { cn } from "@/lib/utils";

const ExamPage = () => {
    const searchParams = useSearchParams();
    const countParam = parseInt(searchParams.get("count") || "10");
    const moduleIds = useMemo(() => searchParams.get("modules")?.split(",") || [], [searchParams]);
    const useTimer = searchParams.get("timer") === "true";
    const durationParam = parseInt(searchParams.get("duration") || "30");

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [timeLeft, setTimeLeft] = useState(durationParam * 60);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [isGenerating, setIsGenerating] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);

    const addExamResult = useStudyStore(state => state.addExamResult);
    const router = useRouter();

    // Timer Logic
    useEffect(() => {
        if (!useTimer || showResults || isGenerating) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [useTimer, showResults, isGenerating]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    // AI Generation
    useEffect(() => {
        const generateQuestions = async () => {
            if (moduleIds.length === 0) {
                setError("No modules selected.");
                setIsGenerating(false);
                return;
            }

            try {
                const selectedModules = COURSES.flatMap(c => c.modules).filter(m => moduleIds.includes(m.id));
                const topics = selectedModules.map(m => m.title).join(", ");

                const API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
                if (!API_KEY) throw new Error("API Key missing");

                const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${API_KEY}`,
                    },
                    body: JSON.stringify({
                        messages: [
                            {
                                role: "system",
                                content: `You are an expert examiner. Generate exactly ${countParam} high-quality multiple choice questions for: ${topics}.
                                Return ONLY a raw JSON array of objects.
                                Each object MUST have: 
                                - "question": String
                                - "options": Array of 4 strings
                                - "correct": Integer (0-3 index of the correct option)
                                - "explanation": Short string explaining the answer
                                RULES:
                                1. Questions should be challenging but fair.
                                2. NO markdown, ONLY JSON array.`
                            }
                        ],
                        model: "llama-3.1-8b-instant",
                        temperature: 0.6,
                        max_tokens: 3000,
                    }),
                });

                if (!response.ok) throw new Error("Failed to connect to AI");

                const data = await response.json();
                const content = data.choices[0].message.content;
                const parsed = JSON.parse(content.trim().replace(/```json|```/g, ''));
                setQuestions(parsed);
            } catch (err) {
                console.error("Exam Gen Error:", err);
                setError("Failed to generate exam questions. Please try again.");
            } finally {
                setIsGenerating(false);
            }
        };

        generateQuestions();
    }, [moduleIds, countParam]);

    const handleSelectOption = (index: number) => {
        setSelectedAnswers(prev => ({ ...prev, [currentIndex]: index }));
    };

    const toggleFlag = () => {
        setFlaggedQuestions(prev =>
            prev.includes(currentIndex) ? prev.filter(i => i !== currentIndex) : [...prev, currentIndex]
        );
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        let correctCount = 0;
        questions.forEach((q, i) => {
            if (selectedAnswers[i] === q.correct) correctCount++;
        });

        const result = {
            id: Math.random().toString(36).substr(2, 9),
            score: correctCount,
            total: questions.length,
            accuracy: Math.round((correctCount / questions.length) * 100),
            timestamp: Date.now(),
            modules: moduleIds
        };

        await new Promise(r => setTimeout(r, 2000));

        addExamResult(result);
        setShowResults(true);
        setIsSubmitting(false);
    };

    const score = useMemo(() => {
        let correct = 0;
        questions.forEach((q, i) => {
            if (selectedAnswers[i] === q.correct) correct++;
        });
        return correct;
    }, [questions, selectedAnswers]);

    if (isGenerating) {
        return (
            <Layout classWrapper="flex items-center justify-center min-h-screen" hidePanelMessage={true}>
                <div className="flex flex-col items-center gap-6 text-center">
                    <Loader2 className="w-10 h-10 text-gray-200 animate-spin" strokeWidth={1.5} />
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-gray-900">Preparing Exam</h2>
                        <p className="text-gray-500 text-sm">Our AI is generating high-yield questions for you.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout classWrapper="flex items-center justify-center min-h-screen" hidePanelMessage={true}>
                <div className="flex flex-col items-center gap-6 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-gray-900">Generation Failed</h2>
                        <p className="text-gray-500 text-sm max-w-xs">{error}</p>
                    </div>
                    <button onClick={() => window.location.reload()} className="h-11 px-8 bg-gray-900 text-white rounded-xl font-bold text-sm uppercase tracking-widest">
                        Try Again
                    </button>
                </div>
            </Layout>
        );
    }

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <Layout classWrapper="flex flex-col min-h-screen bg-gray-25/50" hidePanelMessage={true}>
            <div className="max-w-4xl mx-auto w-full px-6 py-8 flex flex-col gap-10 flex-1">

                {/* Header (Minimal) */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <Link href="/exam-prep" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Terminate Session
                        </Link>

                        {useTimer && (
                            <div className={cn(
                                "flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold",
                                timeLeft < 60 ? "bg-red-50 border-red-100 text-red-600 animate-pulse" : "bg-white border-gray-100 text-gray-900"
                            )}>
                                <Clock className="w-4 h-4" />
                                <span>{formatTime(timeLeft)}</span>
                            </div>
                        )}

                        <button onClick={handleSubmit} className="text-[10px] font-bold text-gray-900 uppercase tracking-widest border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
                            Submit Exam
                        </button>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-end text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                            <span>Question {currentIndex + 1} of {questions.length}</span>
                            <span>{Math.round(progress)}% Complete</span>
                        </div>
                        <Progress value={progress} className="h-1.5 bg-gray-100" />
                    </div>
                </div>

                {/* Main Question Area (Standard Card) */}
                <div className="flex-1 flex flex-col gap-6">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col gap-10"
                    >
                        <div className="flex items-start justify-between gap-6">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                                {currentQuestion.question}
                            </h2>
                            <button
                                onClick={toggleFlag}
                                className={cn(
                                    "p-2 rounded-lg border transition-all",
                                    flaggedQuestions.includes(currentIndex)
                                        ? "bg-yellow-50 text-yellow-500 border-yellow-100 shadow-sm shadow-yellow-500/10"
                                        : "bg-white text-gray-200 border-gray-100 hover:text-gray-400"
                                )}
                            >
                                <Flag className={cn("w-5 h-5", flaggedQuestions.includes(currentIndex) && "fill-current")} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {currentQuestion.options.map((option: string, i: number) => {
                                const isSelected = selectedAnswers[currentIndex] === i;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleSelectOption(i)}
                                        className={cn(
                                            "flex items-center gap-4 p-5 rounded-2xl border text-left transition-all",
                                            isSelected
                                                ? "bg-gray-900 text-white border-gray-900 scale-[1.01]"
                                                : "bg-gray-50/50 border-gray-100 hover:border-gray-300 hover:bg-white text-gray-700"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-7 h-7 rounded-lg border flex items-center justify-center text-[10px] font-black transition-all",
                                            isSelected ? "bg-white/20 border-white/10 text-white" : "bg-white text-gray-400 border-gray-100"
                                        )}>
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                        <span className="text-sm font-bold flex-1">{option}</span>
                                        {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Navigation Drawer (Bottom Grid) */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-2 justify-center">
                        {questions.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all border relative",
                                    currentIndex === i
                                        ? "bg-gray-900 text-white border-gray-900"
                                        : selectedAnswers[i] !== undefined
                                            ? "bg-gray-100 text-gray-900 border-gray-200"
                                            : "bg-white text-gray-300 border-gray-100 hover:bg-gray-50"
                                )}
                            >
                                {flaggedQuestions.includes(i) && (
                                    <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                                )}
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pb-8">
                    <button
                        onClick={() => setCurrentIndex(prev => prev - 1)}
                        disabled={currentIndex === 0}
                        className="h-12 px-6 rounded-xl bg-white border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 disabled:opacity-0 transition-all flex items-center gap-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>

                    <button
                        onClick={() => {
                            if (currentIndex < questions.length - 1) {
                                setCurrentIndex(prev => prev + 1);
                            } else {
                                handleSubmit();
                            }
                        }}
                        className="h-12 px-8 rounded-xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-2 active:scale-95"
                    >
                        {currentIndex === questions.length - 1 ? "Finish Exam" : "Next Question"}
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Results Modal: Minimal & Consistent */}
            <AnimatePresence>
                {(showResults || isSubmitting) && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative bg-white rounded-[32px] p-8 md:p-12 max-w-lg w-full shadow-2xl text-center"
                        >
                            {isSubmitting ? (
                                <div className="flex flex-col items-center gap-6 py-8">
                                    <Loader2 className="w-10 h-10 text-gray-200 animate-spin" />
                                    <div className="space-y-1">
                                        <h2 className="text-xl font-bold text-gray-900">Calculating Results</h2>
                                        <p className="text-gray-500 text-sm">Grading your responses...</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-8">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center shadow-xl rotate-3">
                                        <Trophy className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold text-gray-900">Exam Complete</h2>
                                        <p className="text-gray-500 text-sm">Your performance breakdown is ready.</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 w-full">
                                        <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Score</span>
                                            <span className="text-3xl font-black text-gray-900">{score}</span>
                                            <span className="text-gray-300 text-lg"> / {questions.length}</span>
                                        </div>
                                        <div className="p-6 bg-gray-900 rounded-2xl">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Accuracy</span>
                                            <span className="text-3xl font-black text-white">{Math.round((score / questions.length) * 100)}%</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 w-full pt-4">
                                        <button onClick={() => router.push("/tracker")} className="h-14 bg-gray-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 group">
                                            View Progress
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <Link href="/exam-prep" className="h-14 border border-gray-100 text-gray-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-50 flex items-center justify-center">
                                            New Session
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default ExamPage;
