"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Shuffle,
    Edit3,
    ArrowLeft,
    RotateCcw,
    Lightbulb,
    Check,
    X,
    LayoutGrid,
    HelpCircle,
    Settings2,
    Loader2,
    AlertCircle
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useStudyStore } from "@/store/useStudyStore";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { COURSES } from "@/constants/study";
import {
    Item,
    ItemContent,
    ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";

const flashcards = [
    {
        id: 1,
        question: "What is the primary function of the Mitochondria within an animal cell?",
        answer: "The mitochondria produce energy for the cell in the form of adenosine triphosphate (ATP) through cellular respiration.",
        hint: "It's often called the 'powerhouse' of the cell."
    },
    {
        id: 2,
        question: "Explain the process of Osmosis.",
        answer: "Osmosis is the spontaneous net movement or diffusion of solvent molecules through a selectively-permeable membrane from a region of high water potential to a region of low water potential.",
        hint: "Think about water movement across membranes."
    }
];

const TypingText = ({ text, delay = 0.02 }: { text: string, delay?: number }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        setDisplayedText("");
        setIsComplete(false);
        let i = 0;
        const timer = setInterval(() => {
            setDisplayedText(text.slice(0, i));
            i++;
            if (i > text.length) {
                clearInterval(timer);
                setIsComplete(true);
            }
        }, delay * 1000);
        return () => clearInterval(timer);
    }, [text, delay]);

    return (
        <span className="relative">
            {displayedText}
            {!isComplete && (
                <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, times: [0, 0.5, 1] }}
                    className="inline-block w-[2px] h-[14px] bg-white ml-0.5 align-middle"
                />
            )}
        </span>
    );
};

const FlashcardPage = () => {
    const searchParams = useSearchParams();
    const countParam = parseInt(searchParams.get("count") || "10");
    const moduleIds = useMemo(() => searchParams.get("modules")?.split(",") || [], [searchParams]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [knownCount, setKnownCount] = useState(0);
    const [unknownCount, setUnknownCount] = useState(0);

    const [cards, setCards] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Completion State
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
    const [hardTopics, setHardTopics] = useState<string[]>([]);
    const [finalInsight, setFinalInsight] = useState("");

    const setLastSession = useStudyStore(state => state.setLastSession);
    const router = useRouter();

    const currentCard = cards[currentIndex];
    const progressValue = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

    const handleFlip = useCallback(() => {
        setIsFlipped(prev => !prev);
        if (showHint) setShowHint(false);
    }, [showHint]);

    const nextCard = useCallback(() => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
            setShowHint(false);
        }
    }, [currentIndex, cards.length]);

    const prevCard = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setIsFlipped(false);
            setShowHint(false);
        }
    }, [currentIndex]);

    const generateFinalInsight = async (known: number, unknown: number, hTopics: string[]) => {
        setIsGeneratingInsight(true);
        try {
            const API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
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
                            content: `Analyze a student's flashcard session. 
                            Stats: ${known} Easy, ${unknown} Hard. 
                            Modules: ${moduleIds.join(", ")}.
                            Specific Hard Questions: ${hTopics.slice(0, 5).join(" | ")}.
                            
                            Provide an EXTREMELY concise (max 18 words) fluid sentence. 
                            NO labels like "Feedback:", NO colons, NO "Main topic:". 
                            Just a smooth coaching sentence that mentions a key topic to review or celebrates success.
                            Example: "Solid work; just spend a little more time refining your understanding of neural network architecture."`
                        }
                    ],
                    model: "llama-3.1-8b-instant",
                    temperature: 0.7,
                }),
            });
            const data = await response.json();
            const insight = data.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
            setFinalInsight(insight);

            // Save to store
            setLastSession({
                totalCards: cards.length,
                knownCount: known,
                unknownCount: unknown,
                hardTopics: hTopics,
                aiInsight: insight,
                timestamp: Date.now()
            });
        } catch (err) {
            console.error("Insight Error:", err);
            setFinalInsight("Great session! Keep practicing those tricky concepts.");
        } finally {
            setIsGeneratingInsight(false);
        }
    };

    const markKnown = useCallback(() => {
        const nextKnown = knownCount + 1;
        setKnownCount(nextKnown);
        if (currentIndex === cards.length - 1) {
            setShowCompletionModal(true);
            generateFinalInsight(nextKnown, unknownCount, hardTopics);
        } else {
            nextCard();
        }
    }, [nextCard, currentIndex, cards.length, knownCount, unknownCount, hardTopics]);

    const markUnknown = useCallback(() => {
        const nextUnknown = unknownCount + 1;
        setUnknownCount(nextUnknown);
        const newHardTopics = [...hardTopics, cards[currentIndex]?.question];
        setHardTopics(newHardTopics);

        if (currentIndex === cards.length - 1) {
            setShowCompletionModal(true);
            generateFinalInsight(knownCount, nextUnknown, newHardTopics);
        } else {
            nextCard();
        }
    }, [nextCard, currentIndex, cards.length, knownCount, unknownCount, hardTopics, cards]);

    // AI Generation Logic
    useEffect(() => {
        const generateCards = async () => {
            if (moduleIds.length === 0) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

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
                                content: `You are a strict academic assistant. Generate exactly ${countParam} flashcards for these topics: ${topics}.
                                Return ONLY a raw JSON array of objects.
                                Each object MUST have: "question", "answer", and "hint".
                                RULES:
                                1. Answers MUST be short, direct, and concise (max 20 words).
                                2. Hints MUST be helpful but subtle.
                                3. NO conversational text, NO markdown blocks, ONLY the JSON array.`
                            }
                        ],
                        model: "llama-3.1-8b-instant",
                        temperature: 0.6,
                        max_tokens: 2000,
                    }),
                });

                if (!response.ok) throw new Error("Failed to connect to AI");

                const data = await response.json();
                const content = data.choices[0].message.content;
                const parsedCards = JSON.parse(content.trim().replace(/```json|```/g, ''));

                if (Array.isArray(parsedCards)) {
                    setCards(parsedCards);
                } else if (parsedCards.flashcards) {
                    setCards(parsedCards.flashcards);
                } else {
                    throw new Error("Invalid response format");
                }
            } catch (err: any) {
                console.error("Flashcard Gen Error:", err);
                setError("I couldn't generate cards right now. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        generateCards();
    }, [moduleIds, countParam]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault();
                handleFlip();
            } else if (e.code === "ArrowRight") {
                nextCard();
            } else if (e.code === "ArrowLeft") {
                prevCard();
            } else if (e.key === "1") {
                markUnknown();
            } else if (e.key === "2") {
                markKnown();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleFlip, nextCard, prevCard, markKnown, markUnknown]);

    return (
        <Layout classWrapper="flex flex-col items-center bg-white min-h-screen" hidePanelMessage={true}>
            <div className="w-full max-w-3xl pt-8 pb-20 px-4 md:px-0 font-sans">

                {/* Header Area - Compact & Aligned */}
                <div className="flex flex-col gap-6 mb-8">
                    <div className="flex items-center justify-between">
                        <Link href="/study-lab" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                            <span className="max-md:hidden">Back to Library</span>
                            <span className="hidden max-md:block">Back</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-25 transition-colors shadow-sm font-sans">
                                <Shuffle className="w-4 h-4 text-gray-500" />
                                <span className="max-md:hidden">Shuffle</span>
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-25 transition-colors shadow-sm font-sans">
                                <Settings2 className="w-4 h-4 text-gray-500" />
                                <span className="max-md:hidden">Options</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                            <LayoutGrid className="w-3.5 h-3.5" />
                            <span>{moduleIds.length > 0 ? "Smart Session" : "Generic Session"}</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight font-sans">Active Recall</h1>
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 font-sans">
                                <span>Card</span>
                                <span className="bg-gray-900 text-white px-2 py-0.5 rounded text-xs font-bold">{currentIndex + 1}</span>
                                <span>of {cards.length || countParam}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <Progress
                        value={progressValue}
                        className="h-1.5 bg-gray-100 rounded-full"
                        indicatorClassName="bg-[#1D2786]"
                    />
                </div>

                {/* Content Area */}
                {isLoading ? (
                    <div className="h-[380px] md:h-[420px] bg-gray-50 border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-4 mb-8">
                        <Loader2 className="w-8 h-8 text-primary-200 animate-spin" />
                        <p className="text-sm font-medium text-gray-500 animate-pulse px-6 text-center">AI is generating your study session...</p>
                    </div>
                ) : error ? (
                    <div className="h-[380px] md:h-[420px] bg-red-50 border border-red-100 rounded-2xl flex flex-col items-center justify-center gap-4 mb-8 px-10 text-center">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                        <h3 className="text-lg font-bold text-red-900">Something went wrong</h3>
                        <p className="text-sm text-red-700">{error}</p>
                        <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
                    </div>
                ) : cards.length > 0 ? (
                    <>
                        {/* Main Flashcard */}
                        <div className="perspective-1000 h-[380px] md:h-[420px] relative mb-8 cursor-pointer group" onClick={handleFlip}>
                            <motion.div
                                className="w-full h-full relative preserve-3d transition-all duration-700"
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            >
                                {/* Front Side */}
                                <div className="absolute inset-0 backface-hidden bg-white border border-gray-100 rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center text-center shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-gray-200 transition-all">
                                    <div className="absolute top-6 px-3 py-1 bg-gray-50 rounded-md text-[10px] font-bold tracking-widest text-gray-400 uppercase border border-gray-100">
                                        Question
                                    </div>
                                    <h2 className="text-lg md:text-2xl font-medium text-gray-900 leading-relaxed max-w-xl font-sans px-2">
                                        {currentCard?.question}
                                    </h2>
                                    <button
                                        className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full border border-gray-100 bg-white hover:bg-gray-50 text-xs font-medium text-gray-500 transition-all font-sans group/hint"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowHint(!showHint);
                                        }}
                                    >
                                        <Lightbulb className="w-3.5 h-3.5 text-yellow-400 group-hover/hint:text-yellow-500 transition-colors" />
                                        {showHint ? currentCard?.hint : "Show Hint"}
                                    </button>
                                </div>

                                {/* Back Side */}
                                <div
                                    className="absolute inset-0 backface-hidden bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center text-center rotate-y-180 shadow-xl shadow-gray-900/10"
                                >
                                    <div className="absolute top-6 px-3 py-1 bg-white/10 rounded-md text-[10px] font-bold tracking-widest text-white/60 uppercase border border-white/5">
                                        Verified Answer
                                    </div>
                                    <p className="text-base md:text-xl font-medium text-white leading-relaxed max-w-xl font-sans px-2">
                                        {currentCard?.answer}
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col items-center gap-8">
                            <div className="flex items-center gap-3 md:gap-6">
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevCard(); }}
                                    disabled={currentIndex === 0}
                                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <div className="flex items-center gap-2 md:gap-3 p-1.5 bg-gray-50 border border-gray-100 rounded-xl">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); markUnknown(); }}
                                        className="h-10 px-4 md:px-6 hover:bg-white text-gray-500 hover:text-red-600 hover:shadow-sm rounded-lg font-bold transition-all flex items-center gap-2 text-sm"
                                    >
                                        <X className="w-4 h-4" />
                                        <span className="max-md:hidden">Hard</span>
                                    </button>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleFlip(); }}
                                        className="h-10 px-6 md:px-8 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-all flex items-center gap-2 text-sm shadow-md shadow-gray-900/10"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        <span className="max-md:hidden">{isFlipped ? "Return" : "Reveal"}</span>
                                    </button>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); markKnown(); }}
                                        className="h-10 px-4 md:px-6 hover:bg-white text-gray-500 hover:text-green-600 hover:shadow-sm rounded-lg font-bold transition-all flex items-center gap-2 text-sm"
                                    >
                                        <Check className="w-4 h-4" />
                                        <span className="max-md:hidden">Easy</span>
                                    </button>
                                </div>

                                <button
                                    onClick={(e) => { e.stopPropagation(); nextCard(); }}
                                    disabled={currentIndex === cards.length - 1}
                                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 transition-all"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest opacity-60">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span>Mastered {Math.round((knownCount / (knownCount + unknownCount || 1)) * 100)}%</span>
                                </div>
                                <div className="w-px h-3 bg-gray-300" />
                                <div className="flex items-center gap-2">
                                    <span>Studied {knownCount + unknownCount}/{cards.length}</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="h-[380px] md:h-[420px] bg-gray-50 border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-4 mb-8">
                        <p className="text-sm font-medium text-gray-500">No content selected to generate cards.</p>
                        <Link href="/study-lab">
                            <Button variant="outline">Back to Selection</Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Completion Modal */}
            <AnimatePresence>
                {showCompletionModal && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 overflow-hidden pointer-events-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                            onClick={() => { }}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl border border-gray-100 z-10"
                        >
                            <div className="flex flex-col items-center text-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center shadow-xl shadow-gray-900/20">
                                    <Check className="w-8 h-8 text-white" strokeWidth={3} />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-gray-900 font-sans">Session Complete!</h2>
                                    <p className="text-gray-500 text-sm font-sans">You've finished all cards in this set.</p>
                                </div>

                                <div className="w-full grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Mastered</div>
                                        <div className="text-xl font-bold text-gray-900">{knownCount}</div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Struggled</div>
                                        <div className="text-xl font-bold text-gray-900">{unknownCount}</div>
                                    </div>
                                </div>

                                <div className="w-full p-5 bg-gray-900 rounded-2xl relative overflow-hidden min-h-[100px] flex items-center">
                                    <div className="relative z-10 flex flex-col items-start text-left gap-3 w-full">
                                        <div className="flex items-center gap-2">
                                            <img src="/icons/gemini.png" alt="AI" className="w-4 h-4 object-contain" />
                                            <span className="text-[10px] font-bold text-white uppercase tracking-widest opacity-60">AI Insight</span>
                                        </div>
                                        {isGeneratingInsight ? (
                                            <div className="flex items-center gap-2 text-white/40 italic text-xs">
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                Analyzing performance...
                                            </div>
                                        ) : (
                                            <p className="text-xs text-white leading-relaxed font-sans font-medium">
                                                {finalInsight && <TypingText text={finalInsight} />}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full flex flex-col gap-3 mt-2">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="w-full h-12 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-gray-900/10 hover:bg-gray-800 transition-all font-sans"
                                    >
                                        Start Again
                                    </button>
                                    <button
                                        onClick={() => router.push("/study-lab")}
                                        className="w-full h-12 bg-white text-gray-500 border border-gray-100 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all font-sans"
                                    >
                                        Finish Session
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .preserve-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
            `}</style>
        </Layout>
    );
};

export default FlashcardPage;
