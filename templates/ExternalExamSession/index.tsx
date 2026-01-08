"use client";

import { useState, useEffect, useRef } from "react";
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
    Sparkles,
    Send,
    Bot,
    Loader2,
    ChevronDown
} from "lucide-react";

import { useStudyStore } from "@/store/useStudyStore";
import { cn } from "@/lib/utils";

interface Question {
    id: number;
    question: string;
    section: string;
    options: { key: string; text: string }[];
    answer: string;
    solution: string;
    year: string;
    examType: string;
    questionNumber: number;
}

const ExternalExamSession = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const addExamResult = useStudyStore(state => state.addExamResult);

    const examId = searchParams.get("exam") || "jamb";
    const mode = searchParams.get("mode") || "simple";
    const year = searchParams.get("year") || "Random";
    const questionCount = parseInt(searchParams.get("count") || "20");

    const isSimpleMode = mode === "simple";
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState(60 * 60);
    const [isFinished, setIsFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [isAiThinking, setIsAiThinking] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    // Fetch real questions from ALOC API or Storage
    useEffect(() => {
        const fetchQuestions = async () => {
            setIsLoading(true);
            setLoadError(null);

            // Check if questions were precached during onboarding
            const isPrecached = searchParams.get("precached") === "true";
            if (isPrecached) {
                try {
                    const stored = sessionStorage.getItem("precached_exam_questions");
                    if (stored) {
                        const parsedQuestions = JSON.parse(stored);
                        if (parsedQuestions && parsedQuestions.length > 0) {
                            setQuestions(parsedQuestions);
                            setIsLoading(false);
                            // Optional: clear storage or keep it? Keeping it safely ignores reload issues.
                            return;
                        }
                    }
                } catch (e) {
                    console.error("Failed to load cached questions");
                }
            }

            try {
                const response = await fetch(
                    `/api/questions?exam=${examId}&count=${questionCount}&year=${year}&subject=english`
                );
                const data = await response.json();

                if (data.success && data.questions.length > 0) {
                    setQuestions(data.questions);
                } else {
                    setLoadError("Could not load questions. Please try again.");
                }
            } catch (error) {
                setLoadError("Network error. Please check your connection.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestions();
    }, [examId, questionCount, year, searchParams]);

    // Timer for hard mode
    useEffect(() => {
        if (isSimpleMode || isFinished || isLoading) return;
        if (timeLeft <= 0) {
            handleFinish();
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [isSimpleMode, timeLeft, isFinished, isLoading]);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    // Reset chat when question changes
    useEffect(() => {
        setChatHistory([]);
    }, [currentQuestionIndex]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleSelectOption = (optionKey: string) => {
        if (isFinished) return;
        setAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionKey }));
    };

    const handleFinish = () => {
        setIsFinished(true);
        const correctCount = questions.reduce((acc, q, i) =>
            acc + (answers[i]?.toLowerCase() === q.answer?.toLowerCase() ? 1 : 0), 0
        );
        const score = Math.round((correctCount / questions.length) * 100);

        addExamResult({
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
            score,
            totalQuestions: questions.length,
            timeSpent: (60 * 60) - timeLeft,
            passed: score >= 50
        });
    };

    // AI Chat handler
    const handleAiChat = async (message: string) => {
        if (!questions[currentQuestionIndex]) return;

        const q = questions[currentQuestionIndex];
        setChatHistory(prev => [...prev, { role: 'user', content: message }]);
        setIsAiThinking(true);

        setTimeout(() => {
            let response = "";

            if (message.toLowerCase().includes("simplify")) {
                response = `This question is asking you to identify the meaning of a word or concept.\n\nLook at the underlined part carefully and think about what it means in context.`;
            } else if (message.toLowerCase().includes("solution") || message.toLowerCase().includes("help")) {
                response = q.solution || `The correct answer is option ${q.answer?.toUpperCase()}. This is based on standard ${q.examType} curriculum.`;
            } else if (message.toLowerCase().includes("hint")) {
                response = `Hint: The answer is option ${q.answer?.toUpperCase()}. Think about synonyms or related concepts.`;
            } else {
                response = q.solution || `For this ${q.examType} ${q.year} question, the correct answer is ${q.answer?.toUpperCase()}.`;
            }

            setChatHistory(prev => [...prev, { role: 'ai', content: response }]);
            setIsAiThinking(false);
        }, 800);
    };

    const currentQuestion = questions[currentQuestionIndex];
    const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

    // Loading State
    if (isLoading) {
        return (
            <div className="flex h-screen w-full bg-white">
                <div className="flex-1 bg-[#f7f7f7] flex flex-col items-center justify-center">
                    <div className="bg-white p-12 rounded-2xl border border-[#ebebeb] flex flex-col items-center gap-6 shadow-sm">
                        <Loader2 className="w-12 h-12 text-[#303030] animate-spin" />
                        <div className="text-center">
                            <h2 className="text-[14px] font-bold text-[#303030] uppercase tracking-widest">Loading Questions</h2>
                            <p className="text-[#616161] text-[13px] mt-1">Fetching {examId.toUpperCase()} past questions...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error State
    if (loadError) {
        return (
            <div className="flex h-screen w-full bg-white">
                <div className="flex-1 bg-[#f7f7f7] flex flex-col items-center justify-center">
                    <div className="bg-white p-12 rounded-2xl border border-[#ebebeb] flex flex-col items-center gap-6 shadow-sm">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                        <div className="text-center">
                            <h2 className="text-[16px] font-bold text-[#303030]">Failed to Load</h2>
                            <p className="text-[#616161] text-[13px] mt-1">{loadError}</p>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-[#303030] text-white rounded-lg font-bold text-sm"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Results State
    if (isFinished) {
        const correctCount = questions.reduce((acc, q, i) =>
            acc + (answers[i]?.toLowerCase() === q.answer?.toLowerCase() ? 1 : 0), 0
        );
        const score = Math.round((correctCount / questions.length) * 100);
        const passed = score >= 50;

        return (
            <div className="flex h-screen w-full bg-white">
                <div className="flex-1 bg-[#f7f7f7] flex flex-col items-center justify-center p-6">
                    <div className="bg-white border border-[#ebebeb] rounded-2xl p-8 md:p-12 shadow-sm flex flex-col items-center text-center max-w-[600px] w-full">
                        <div className={cn(
                            "w-20 h-20 rounded-full flex items-center justify-center mb-8",
                            passed ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                        )}>
                            {passed ? <CheckCircle2 size={48} /> : <AlertCircle size={48} />}
                        </div>

                        <h2 className="text-2xl md:text-3xl font-black text-[#303030] mb-2">{passed ? "Passed!" : "Keep Practicing"}</h2>
                        <p className="text-[#616161] text-sm mb-10">{examId.toUpperCase()} Practice Complete</p>

                        <div className="grid grid-cols-2 gap-4 md:gap-8 w-full max-w-sm mb-12">
                            <div className="p-4 md:p-6 bg-[#f9f9f9] rounded-xl border border-[#f1f1f1]">
                                <span className="text-3xl md:text-4xl font-black text-[#303030]">{score}%</span>
                                <p className="text-[10px] font-bold text-[#616161] uppercase tracking-widest mt-1">Score</p>
                            </div>
                            <div className="p-4 md:p-6 bg-[#f9f9f9] rounded-xl border border-[#f1f1f1]">
                                <span className="text-3xl md:text-4xl font-black text-[#303030]">{correctCount}/{questions.length}</span>
                                <p className="text-[10px] font-bold text-[#616161] uppercase tracking-widest mt-1">Correct</p>
                            </div>
                        </div>

                        <div className="w-full text-left p-5 md:p-6 bg-[#fafafa] rounded-xl border border-[#f1f1f1] mb-10">
                            <h3 className="text-xs font-bold text-[#303030] uppercase tracking-widest flex items-center gap-2 mb-3">
                                <Sparkles size={14} /> AI Summary
                            </h3>
                            <p className="text-[#616161] text-sm leading-relaxed">
                                {score >= 70
                                    ? "Excellent work! You show strong mastery of this subject."
                                    : score >= 50
                                        ? "Good effort. Review missed questions to improve."
                                        : "Focus on reviewing core concepts and try again."}
                            </p>
                        </div>

                        <div className="flex gap-3 w-full max-w-sm">
                            <button onClick={() => window.location.reload()} className="flex-1 h-12 rounded-xl bg-[#303030] text-white font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2">
                                <RotateCcw size={18} /> Retry
                            </button>
                            <button onClick={() => router.push("/external-exam")} className="flex-1 h-12 rounded-xl bg-white border border-[#d1d1d1] text-[#303030] font-bold text-sm hover:bg-[#f6f6f6] transition-all flex items-center justify-center gap-2">
                                <Home size={18} /> Exit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main Exam UI - Full Screen Split Layout
    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Main Content Area - Gray Background (Middle Section) */}
            <div className="flex-1 flex flex-col bg-[#f7f7f7] min-w-0">
                {/* Top Navigation Bar */}
                <div className="h-14 bg-white border-b border-[#ebebeb] px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push("/external-exam")} className="text-[#616161] hover:text-[#303030]">
                            <X size={20} />
                        </button>
                        <div className="w-[1px] h-6 bg-[#ebebeb]" />
                        <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-[#303030]">
                                {examId.toUpperCase()} • {currentQuestion?.year || year}
                            </span>
                            <span className="text-[11px] text-[#616161]">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {!isSimpleMode && (
                            <div className={cn(
                                "text-sm font-bold font-mono px-3 py-1 border rounded-lg flex items-center gap-1.5",
                                timeLeft < 300 ? "bg-red-50 text-red-600 border-red-100" : "bg-white text-[#303030] border-[#ebebeb]"
                            )}>
                                <Clock size={14} />
                                {formatTime(timeLeft)}
                            </div>
                        )}

                        {/* AI Help Toggle - Desktop: show when panel is closed */}
                        {!isChatOpen && isSimpleMode && (
                            <button
                                onClick={() => setIsChatOpen(true)}
                                className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[#303030] text-white hover:bg-black transition-all"
                            >
                                <Sparkles size={14} />
                                AI Help
                            </button>
                        )}

                        {/* AI Help Toggle - Mobile: icon only in top bar */}
                        {isSimpleMode && (
                            <button
                                onClick={() => setIsChatOpen(!isChatOpen)}
                                className={cn(
                                    "md:hidden w-9 h-9 rounded-full flex items-center justify-center transition-all",
                                    isChatOpen ? "bg-[#1a1a1a] text-white" : "bg-[#303030] text-white hover:bg-black"
                                )}
                            >
                                <Sparkles size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Scrollable Question Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-[800px] mx-auto p-6 pb-32">
                        {currentQuestion && (
                            <div className="bg-white border border-[#ebebeb] rounded-2xl shadow-sm overflow-hidden">
                                {currentQuestion.section && (
                                    <div className="px-6 md:px-8 py-4 bg-[#fafafa] border-b border-[#f1f1f1]">
                                        <p className="text-[12px] text-[#616161] italic leading-relaxed">{currentQuestion.section}</p>
                                    </div>
                                )}
                                <div className="p-6 md:p-8 border-b border-[#f1f1f1]">
                                    <h2
                                        className="text-[17px] md:text-[19px] font-bold text-[#303030] leading-relaxed [&_u]:underline [&_u]:decoration-2 [&_u]:underline-offset-2 [&_u]:decoration-[#303030]"
                                        dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
                                    />
                                </div>
                                <div className="p-5 md:p-6 grid gap-3">
                                    {currentQuestion.options.map((opt) => (
                                        <button
                                            key={opt.key}
                                            onClick={() => handleSelectOption(opt.key)}
                                            className={cn(
                                                "w-full p-4 md:p-5 text-left rounded-xl transition-all flex items-center gap-4 border",
                                                answers[currentQuestionIndex] === opt.key
                                                    ? "bg-[#303030] border-[#303030] text-white shadow-lg"
                                                    : "bg-white border-[#ebebeb] text-[#303030] hover:border-[#d1d1d1] hover:bg-[#fafafa]"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm shrink-0",
                                                answers[currentQuestionIndex] === opt.key
                                                    ? "bg-white/20 border-white/30 text-white"
                                                    : "bg-[#f7f7f7] border-[#ebebeb] text-[#616161]"
                                            )}>
                                                {opt.key.toUpperCase()}
                                            </div>
                                            <span className="font-medium text-[15px]">{opt.text}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Bottom Navigation Bar - Desktop */}
                <div className="hidden md:flex h-20 bg-white border-t border-[#ebebeb] px-6 items-center justify-center shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentQuestionIndex === 0}
                            className="w-10 h-10 rounded-full border border-[#ebebeb] flex items-center justify-center text-[#616161] hover:text-[#303030] hover:border-[#303030] disabled:opacity-30 transition-all"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <div className="flex items-center gap-3 px-6">
                            <div className="w-32 h-2 bg-[#ebebeb] rounded-full overflow-hidden">
                                <motion.div animate={{ width: `${progress}%` }} className="h-full bg-[#303030]" />
                            </div>
                            <span className="text-[#303030] font-bold text-sm">{Math.round(progress)}%</span>
                        </div>

                        {currentQuestionIndex === questions.length - 1 ? (
                            <button
                                onClick={handleFinish}
                                className="h-10 px-8 rounded-full bg-[#303030] text-white font-bold text-sm transition-all hover:bg-black"
                            >
                                Finish Exam
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                className="w-10 h-10 rounded-full border border-[#ebebeb] flex items-center justify-center text-[#616161] hover:text-[#303030] hover:border-[#303030] transition-all"
                            >
                                <ArrowRight size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Bottom Navigation Bar - Mobile (Hidden when chat open) */}
                <AnimatePresence>
                    {!isChatOpen && (
                        <motion.div
                            initial={{ y: 0, opacity: 1 }}
                            exit={{ y: 80, opacity: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="md:hidden fixed bottom-8 left-4 right-4 z-[100]"
                        >
                            <div className="bg-[#303030] rounded-full px-2 py-2 flex items-center justify-between shadow-2xl">
                                <button
                                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentQuestionIndex === 0}
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white disabled:opacity-30 transition-all"
                                >
                                    <ArrowLeft size={18} />
                                </button>

                                <div className="flex items-center gap-2">
                                    <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                        <motion.div animate={{ width: `${progress}%` }} className="h-full bg-white" />
                                    </div>
                                    <span className="text-white font-bold text-[11px]">{Math.round(progress)}%</span>
                                </div>

                                {currentQuestionIndex === questions.length - 1 ? (
                                    <button
                                        onClick={handleFinish}
                                        className="h-10 px-6 rounded-full bg-white text-[#303030] font-bold text-xs transition-all"
                                    >
                                        Finish
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-all"
                                    >
                                        <ArrowRight size={18} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Right Sidebar - AI Panel (White Background - Full Height) */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 380, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="hidden md:flex flex-col bg-white border-l border-[#ebebeb] h-full shrink-0 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="h-14 px-5 border-b border-[#ebebeb] flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] font-bold text-[#303030]">New conversation</span>
                                <ChevronDown size={14} className="text-[#616161]" />
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="w-8 h-8 rounded-full hover:bg-[#f7f7f7] flex items-center justify-center text-[#616161]">
                                    <Sparkles size={16} />
                                </button>
                                <button
                                    onClick={() => setIsChatOpen(false)}
                                    className="w-8 h-8 rounded-full hover:bg-[#f7f7f7] flex items-center justify-center text-[#616161]"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Chat Content */}
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col scrollbar-none">
                            {chatHistory.length === 0 && (
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-[#f7f7f7] flex items-center justify-center mb-6">
                                        <Bot size={28} className="text-[#303030]" />
                                    </div>
                                    <p className="text-[15px] font-bold text-[#303030] mb-1">Hey there</p>
                                    <p className="text-[14px] text-[#616161] mb-8">How can I help?</p>

                                    {/* Suggested Questions */}
                                    <div className="w-full space-y-2">
                                        <button
                                            onClick={() => handleAiChat("Simplify this question")}
                                            className="w-full text-left px-4 py-3 text-[13px] text-[#616161] hover:bg-[#f7f7f7] rounded-lg transition-all border border-[#ebebeb] hover:border-[#d1d1d1]"
                                        >
                                            Simplify this question
                                        </button>
                                        <button
                                            onClick={() => handleAiChat("Help me with the solution")}
                                            className="w-full text-left px-4 py-3 text-[13px] text-[#616161] hover:bg-[#f7f7f7] rounded-lg transition-all border border-[#ebebeb] hover:border-[#d1d1d1]"
                                        >
                                            Help me with the solution
                                        </button>
                                        <button
                                            onClick={() => handleAiChat("Give me a hint")}
                                            className="w-full text-left px-4 py-3 text-[13px] text-[#616161] hover:bg-[#f7f7f7] rounded-lg transition-all border border-[#ebebeb] hover:border-[#d1d1d1]"
                                        >
                                            Give me a hint
                                        </button>
                                    </div>
                                </div>
                            )}

                            {chatHistory.length > 0 && (
                                <div className="flex flex-col gap-4">
                                    {chatHistory.map((msg, i) => (
                                        <div key={i} className={cn("flex flex-col max-w-[90%]", msg.role === 'user' ? "self-end" : "self-start")}>
                                            <div className={cn(
                                                "p-4 rounded-2xl text-[14px] leading-relaxed",
                                                msg.role === 'user' ? "bg-[#303030] text-white" : "bg-[#f7f7f7] text-[#303030]"
                                            )}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    {isAiThinking && (
                                        <div className="self-start p-4 rounded-2xl bg-[#f7f7f7]">
                                            <Loader2 size={18} className="animate-spin text-[#616161]" />
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-[#ebebeb] shrink-0">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Ask anything..."
                                    className="w-full pl-4 pr-12 py-3 bg-[#f7f7f7] border border-[#ebebeb] rounded-xl text-[14px] outline-none focus:ring-1 focus:ring-[#303030] focus:border-[#303030]"
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && chatInput.trim()) {
                                            handleAiChat(chatInput);
                                            setChatInput("");
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        if (chatInput.trim()) {
                                            handleAiChat(chatInput);
                                            setChatInput("");
                                        }
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#303030] text-white flex items-center justify-center hover:bg-black transition-all"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile: Floating Bottom Sheet Chat (60% height, dark header) */}
            <AnimatePresence>
                {isChatOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsChatOpen(false)}
                            className="md:hidden fixed inset-0 z-[180] bg-black/40"
                        />

                        {/* Floating Chat Card */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 300 }}
                            className="md:hidden fixed bottom-0 left-0 right-0 z-[200] bg-white rounded-t-3xl flex flex-col overflow-hidden shadow-2xl"
                            style={{ maxHeight: "60vh" }}
                        >
                            {/* Dark Header */}
                            <div className="h-12 px-4 bg-[#303030] flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-2">
                                    <Bot size={16} className="text-white" />
                                    <span className="text-[13px] font-bold text-white">AI Tutor</span>
                                </div>
                                <button
                                    onClick={() => setIsChatOpen(false)}
                                    className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center"
                                >
                                    <X size={14} className="text-white" />
                                </button>
                            </div>

                            {/* Chat Content - Compact */}
                            <div className="flex-1 overflow-y-auto p-4 flex flex-col scrollbar-none">
                                {chatHistory.length === 0 && (
                                    <div className="flex flex-col items-center justify-center text-center py-4">
                                        <div className="w-10 h-10 rounded-full bg-[#f7f7f7] flex items-center justify-center mb-3">
                                            <Sparkles size={18} className="text-[#303030]" />
                                        </div>
                                        <p className="text-[13px] font-bold text-[#303030] mb-0.5">How can I help?</p>
                                        <p className="text-[11px] text-[#616161] mb-4">Ask about this question</p>

                                        <div className="w-full flex flex-wrap gap-2 justify-center">
                                            <button
                                                onClick={() => handleAiChat("Simplify")}
                                                className="px-3 py-1.5 text-[11px] font-medium text-[#303030] bg-[#f7f7f7] rounded-full"
                                            >
                                                Simplify
                                            </button>
                                            <button
                                                onClick={() => handleAiChat("Solution")}
                                                className="px-3 py-1.5 text-[11px] font-medium text-[#303030] bg-[#f7f7f7] rounded-full"
                                            >
                                                Solution
                                            </button>
                                            <button
                                                onClick={() => handleAiChat("Hint")}
                                                className="px-3 py-1.5 text-[11px] font-medium text-[#303030] bg-[#f7f7f7] rounded-full"
                                            >
                                                Hint
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {chatHistory.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        {chatHistory.map((msg, i) => (
                                            <div key={i} className={cn("flex flex-col max-w-[85%]", msg.role === 'user' ? "self-end" : "self-start")}>
                                                <div className={cn(
                                                    "p-2.5 rounded-xl text-[12px] leading-relaxed",
                                                    msg.role === 'user' ? "bg-[#303030] text-white" : "bg-[#f7f7f7] text-[#303030]"
                                                )}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        ))}
                                        {isAiThinking && (
                                            <div className="self-start p-2.5 rounded-xl bg-[#f7f7f7]">
                                                <Loader2 size={14} className="animate-spin text-[#616161]" />
                                            </div>
                                        )}
                                        <div ref={chatEndRef} />
                                    </div>
                                )}
                            </div>

                            {/* Compact Input */}
                            <div className="p-3 border-t border-[#ebebeb] shrink-0 bg-[#fafafa]">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Ask anything..."
                                        className="w-full pl-3 pr-10 py-2.5 bg-white border border-[#ebebeb] rounded-xl text-[13px] outline-none"
                                        value={chatInput}
                                        onChange={e => setChatInput(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' && chatInput.trim()) {
                                                handleAiChat(chatInput);
                                                setChatInput("");
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            if (chatInput.trim()) {
                                                handleAiChat(chatInput);
                                                setChatInput("");
                                            }
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[#303030] text-white flex items-center justify-center"
                                    >
                                        <Send size={12} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExternalExamSession;
