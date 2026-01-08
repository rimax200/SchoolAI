"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    ArrowRight,
    ArrowLeft,
    Clock,
    CheckCircle2,
    AlertCircle,
    RotateCcw,
    Home,
    FileText
} from "lucide-react";

import { useStudyStore } from "@/store/useStudyStore";
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ExamPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const addExamResult = useStudyStore(state => state.addExamResult);

    const useTimer = searchParams.get("timer") === "true";
    const duration = parseInt(searchParams.get("duration") || "30");
    const questionCount = parseInt(searchParams.get("count") || "10");

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [timeLeft, setTimeLeft] = useState(duration * 60);
    const [isFinished, setIsFinished] = useState(false);
    const [isThinking, setIsThinking] = useState(true);

    const questions = useMemo(() => {
        return Array.from({ length: questionCount }).map((_, i) => ({
            id: i,
            question: `Identify the primary theoretical framework that characterizes ${["Synaptic Plasticity", "Neural Encoding", "Cognitive Mapping", "Sensory Processing"][i % 4]} within the context of adaptive learning systems.`,
            options: [
                "Long-term potentiation and structural remodeling",
                "Stochastic point-process models for spike trains",
                "Relational representation of environmental cues",
                "Hierarchical bayesian inference on high-dimensional data"
            ],
            correct: i % 4
        }));
    }, [questionCount]);

    useEffect(() => {
        const timer = setTimeout(() => setIsThinking(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!useTimer || isFinished || isThinking) return;
        if (timeLeft <= 0) {
            handleFinish();
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [useTimer, timeLeft, isFinished, isThinking]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleSelectOption = (optionIndex: number) => {
        if (isFinished) return;
        setAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
    };

    const handleFinish = () => {
        setIsFinished(true);
        const correctCount = questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
        const score = Math.round((correctCount / questions.length) * 100);

        addExamResult({
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
            score,
            totalQuestions: questions.length,
            timeSpent: duration * 60 - timeLeft,
            passed: score >= 70
        });
    };

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    if (isThinking) {
        return (
            <Layout hidePanelMessage classWrapper="bg-[#f1f1f1] min-h-screen">
                <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
                    <div className="bg-white p-12 rounded-2xl shadow-sm border border-[#ebebeb] flex flex-col items-center gap-6">
                        <div className="relative w-12 h-12">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-full h-full border-2 border-[#f1f1f1] border-t-[#303030] rounded-full"
                            />
                        </div>
                        <div className="flex flex-col items-center gap-1 text-center">
                            <h2 className="text-[14px] font-bold text-[#303030] font-sans uppercase tracking-widest">Generating</h2>
                            <p className="text-[#616161] text-[13px] font-sans">Compiling your AI-generated assessment...</p>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (isFinished) {
        const correctCount = questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
        const score = Math.round((correctCount / questions.length) * 100);
        const passed = score >= 70;

        return (
            <Layout hidePanelMessage classWrapper="bg-[#f1f1f1] min-h-screen">
                <div className="max-w-[800px] mx-auto pt-20 flex flex-col items-center px-4">
                    <motion.div
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full bg-white border border-[#ebebeb] rounded-xl p-12 flex flex-col items-center text-center shadow-sm"
                    >
                        <div className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center mb-6",
                            passed ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                        )}>
                            {passed ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                        </div>

                        <h2 className="text-2xl font-bold text-[#303030] mb-2 font-sans">
                            {passed ? "Assessment Passed" : "Assessment Complete"}
                        </h2>
                        <p className="text-[#616161] text-sm font-sans mb-10 max-w-sm">
                            {passed
                                ? "You've demonstrated sufficient proficiency in the selected modules."
                                : "Review the highlighted topics before attempting another session."}
                        </p>

                        <div className="grid grid-cols-2 gap-8 w-full max-w-xs mb-10">
                            <div className="flex flex-col items-center p-4 bg-[#f9f9f9] rounded-lg border border-[#f1f1f1]">
                                <div className="text-3xl font-black text-[#303030]">{score}%</div>
                                <div className="text-[10px] font-bold text-[#616161] uppercase tracking-widest">Final Score</div>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-[#f9f9f9] rounded-lg border border-[#f1f1f1]">
                                <div className="text-3xl font-black text-[#303030]">{correctCount}/{questions.length}</div>
                                <div className="text-[10px] font-bold text-[#616161] uppercase tracking-widest">Questions</div>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full max-w-sm">
                            <button
                                className="flex-1 h-10 rounded-lg bg-[#303030] text-white font-bold text-sm hover:bg-[#1a1a1a] transition-all flex items-center justify-center gap-2"
                                onClick={() => window.location.reload()}
                            >
                                <RotateCcw size={16} />
                                Restart
                            </button>
                            <button
                                className="flex-1 h-10 rounded-lg bg-white border border-[#d1d1d1] text-[#303030] font-bold text-sm hover:bg-[#f6f6f6] transition-all flex items-center justify-center gap-2"
                                onClick={() => router.push("/exam-prep")}
                            >
                                <Home size={16} />
                                Exit
                            </button>
                        </div>
                    </motion.div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout hidePanelMessage classWrapper="bg-[#f1f1f1] min-h-screen">
            {/* Minimal Sub-navigation like Shopify Section Header */}
            <div className="fixed top-0 left-0 right-0 bg-white border-b border-[#ebebeb] z-[100] px-4">
                <div className="max-w-[1000px] mx-auto h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push("/exam-prep")}
                            className="text-[#616161] hover:text-[#303030] transition-colors p-2 -ml-2"
                        >
                            <X size={20} />
                        </button>
                        <div className="w-[1px] h-6 bg-[#ebebeb]" />
                        <h3 className="text-[14px] font-bold text-[#303030]">Question {currentQuestionIndex + 1} of {questions.length}</h3>
                    </div>

                    <div className="flex items-center gap-6">
                        {useTimer && (
                            <div className={cn(
                                "flex items-center gap-2 text-[13px] font-bold",
                                timeLeft < 60 ? "text-red-600 animate-pulse" : "text-[#303030]"
                            )}>
                                <Clock size={16} />
                                {formatTime(timeLeft)}
                            </div>
                        )}
                        <div className="w-32 h-1 bg-[#f1f1f1] rounded-full overflow-hidden hidden sm:block">
                            <motion.div
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-[#303030]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[700px] mx-auto pt-24 pb-32 px-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="bg-white border border-[#ebebeb] rounded-xl shadow-sm overflow-hidden"
                    >
                        {/* Question Content */}
                        <div className="p-8 border-b border-[#f1f1f1] bg-[#fdfdfd]">
                            <h2 className="text-[18px] font-bold text-[#303030] leading-snug font-sans">
                                {currentQuestion.question}
                            </h2>
                        </div>

                        {/* Options Section */}
                        <div className="p-4 grid gap-1">
                            {currentQuestion.options.map((option, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSelectOption(i)}
                                    className={cn(
                                        "w-full p-4 text-left rounded-lg transition-all duration-150 flex items-center gap-4 group",
                                        answers[currentQuestionIndex] === i
                                            ? "bg-[#f1f1f1] ring-1 ring-[#303030] shadow-sm"
                                            : "hover:bg-[#f9f9f9]"
                                    )}
                                >
                                    <div className={cn(
                                        "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all",
                                        answers[currentQuestionIndex] === i
                                            ? "bg-[#303030] border-[#303030]"
                                            : "border-[#d1d1d1] group-hover:border-[#303030]"
                                    )}>
                                        {answers[currentQuestionIndex] === i && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                    </div>
                                    <span className={cn(
                                        "text-[14px] font-medium font-sans",
                                        answers[currentQuestionIndex] === i ? "text-[#303030] font-bold" : "text-[#616161]"
                                    )}>{option}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Dark Action Pill Navigation (Maintaining Floating Bar) */}
            <div className="fixed bottom-10 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
                <div className="bg-[#303030] border border-[#3e3e3e] px-2 py-2 rounded-full flex items-center gap-2 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] pointer-events-auto">
                    <button
                        disabled={currentQuestionIndex === 0}
                        onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                        className="h-9 w-9 flex items-center justify-center rounded-full text-white/60 hover:text-white disabled:opacity-30 disabled:hover:text-white/60 transition-all bg-white/5"
                    >
                        <ArrowLeft size={16} />
                    </button>

                    <div className="px-4 text-white/40 text-[10px] uppercase font-bold tracking-widest">
                        {Math.round(progress)}% Complete
                    </div>

                    {currentQuestionIndex === questions.length - 1 ? (
                        <button
                            onClick={handleFinish}
                            disabled={answers[currentQuestionIndex] === undefined}
                            className="h-9 px-6 rounded-full bg-white text-[#303030] font-bold text-xs hover:bg-[#f1f1f1] transition-all disabled:opacity-50"
                        >
                            Finish
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                            disabled={answers[currentQuestionIndex] === undefined}
                            className="h-9 px-6 rounded-full bg-white text-[#303030] font-bold text-xs flex items-center gap-2 hover:bg-[#f1f1f1] transition-all disabled:opacity-50"
                        >
                            Next Question
                            <ArrowRight size={14} className="stroke-[3]" />
                        </button>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ExamPage;
