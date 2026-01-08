"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Puzzle, Trophy, Shuffle } from "lucide-react";

type Step = "mode" | "quantity" | "year" | "loading";

const ExamOnboarding = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const examId = searchParams.get("exam") || "wassce";
    const examTitle = searchParams.get("title") || "WASSCE";

    const [currentStep, setCurrentStep] = useState<Step>("mode");
    const [selectedMode, setSelectedMode] = useState<string>("");
    const [selectedQuantity, setSelectedQuantity] = useState<number>(0);
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [isExiting, setIsExiting] = useState(false);
    const [loadingText, setLoadingText] = useState("");

    const fullLoadingText = "Please wait while I load your exam...";

    const [isTypingComplete, setIsTypingComplete] = useState(false);
    const [precachedQuestions, setPrecachedQuestions] = useState<any[] | null>(null);

    // Fetch questions when entering loading state
    useEffect(() => {
        if (currentStep === "loading" && !precachedQuestions) {
            const fetchQuestions = async () => {
                try {
                    // Normalize year: if "random" (or included in "random" string), send nothing so API handles random logic
                    // But our API expects "Random" or number.
                    // The API Route logic I just wrote: if (year && !isNaN(parseInt(year))) url += `&year=${year}`;
                    // So if we send "random", it ignores it and fetches random. Good.

                    const response = await fetch(
                        `/api/questions?exam=${examId}&count=${selectedQuantity}&year=${selectedYear}&subject=english`
                    );
                    const data = await response.json();
                    if (data.success) {
                        setPrecachedQuestions(data.questions);
                    } else {
                        // If error, we still proceed but maybe show error? 
                        // For now let's just allow redirect where Session will try again or show error
                        setPrecachedQuestions([]);
                    }
                } catch (e) {
                    setPrecachedQuestions([]);
                }
            };
            fetchQuestions();
        }
    }, [currentStep, examId, selectedQuantity, selectedYear]);

    // Typewriter effect
    useEffect(() => {
        if (currentStep === "loading") {
            let index = 0;
            const interval = setInterval(() => {
                if (index <= fullLoadingText.length) {
                    setLoadingText(fullLoadingText.slice(0, index));
                    index++;
                } else {
                    clearInterval(interval);
                    setIsTypingComplete(true);
                }
            }, 50);
            return () => clearInterval(interval);
        }
    }, [currentStep]);

    // Handle Navigation when both ready
    useEffect(() => {
        if (isTypingComplete && precachedQuestions) {
            // Save to sessionStorage
            if (precachedQuestions.length > 0) {
                sessionStorage.setItem("precached_exam_questions", JSON.stringify(precachedQuestions));
            }

            // Trigger exit animation
            setIsExiting(true);

            // Add a delay for the exit animation to complete before pushing new route
            setTimeout(() => {
                router.push(`/external-exam/session?exam=${examId}&mode=${selectedMode}&count=${selectedQuantity}&year=${selectedYear}&precached=true`);
            }, 600);
        }
    }, [isTypingComplete, precachedQuestions, router, examId, selectedMode, selectedQuantity, selectedYear]);

    const handleModeSelect = (mode: string) => {
        setSelectedMode(mode);
        setIsExiting(true);
        setTimeout(() => {
            setCurrentStep("quantity");
            setIsExiting(false);
        }, 300);
    };

    const handleQuantitySelect = (quantity: number) => {
        setSelectedQuantity(quantity);
        setIsExiting(true);
        setTimeout(() => {
            setCurrentStep("year");
            setIsExiting(false);
        }, 300);
    };

    const handleYearSelect = (year: string) => {
        setSelectedYear(year);
        setIsExiting(true);
        setTimeout(() => {
            setCurrentStep("loading");
            setIsExiting(false);
        }, 300);
    };

    const quantities = [10, 20, 30, 40, 50, 60, 80, 100];
    const years = [
        "2025", "2024", "2023", "2022", "2021", "2020",
        "2019", "2018", "2017", "2016", "2015", "2014",
        "2013", "2012", "2011", "2010", "2009", "2008"
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut",
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            y: -40,
            transition: { duration: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    return (
        <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
                {/* Step 1: Mode Selection */}
                {currentStep === "mode" && !isExiting && (
                    <motion.div
                        key="mode"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col items-center text-center px-6 max-w-[600px]"
                    >
                        <motion.h1
                            variants={itemVariants}
                            className="text-[#383838] mb-3"
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "28px",
                                fontWeight: 500
                            }}
                        >
                            How would you like to practice today?
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "16px",
                                fontWeight: 400,
                                color: "#717784"
                            }}
                        >
                            Select one option
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col gap-4 mt-10 w-full max-w-[400px]"
                        >
                            {/* Practice Mode */}
                            <button
                                onClick={() => handleModeSelect("simple")}
                                className="flex items-start gap-4 p-4 rounded-lg hover:bg-[#F5F5F5] transition-all text-left group"
                            >
                                <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                                    <Puzzle size={22} className="text-[#383838]" />
                                </div>
                                <div className="flex flex-col">
                                    <span
                                        className="text-[#383838] group-hover:text-black transition-colors"
                                        style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "20px",
                                            fontWeight: 500
                                        }}
                                    >
                                        Practice Mode
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "14px",
                                            fontWeight: 300,
                                            color: "#717784"
                                        }}
                                    >
                                        Unlimited time and AI assistance enabled. Perfect for learning.
                                    </span>
                                </div>
                            </button>

                            {/* Competitive Mode */}
                            <button
                                onClick={() => handleModeSelect("hard")}
                                className="flex items-start gap-4 p-4 rounded-lg hover:bg-[#F5F5F5] transition-all text-left group"
                            >
                                <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                                    <Trophy size={22} className="text-[#383838]" />
                                </div>
                                <div className="flex flex-col">
                                    <span
                                        className="text-[#383838] group-hover:text-black transition-colors"
                                        style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "20px",
                                            fontWeight: 500
                                        }}
                                    >
                                        Competitive Mode
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "14px",
                                            fontWeight: 300,
                                            color: "#717784"
                                        }}
                                    >
                                        Strictly timed with no AI help. Simulate the real exam environment.
                                    </span>
                                </div>
                            </button>
                        </motion.div>
                    </motion.div>
                )}

                {/* Step 2: Quantity Selection */}
                {currentStep === "quantity" && !isExiting && (
                    <motion.div
                        key="quantity"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col items-center text-center px-6 max-w-[600px]"
                    >
                        <motion.h1
                            variants={itemVariants}
                            className="text-[#383838] mb-3"
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "28px",
                                fontWeight: 500
                            }}
                        >
                            How many questions are you ready for?
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "16px",
                                fontWeight: 400,
                                color: "#717784"
                            }}
                        >
                            Select one option
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap justify-center gap-3 mt-10"
                        >
                            {quantities.map((qty) => (
                                <button
                                    key={qty}
                                    onClick={() => handleQuantitySelect(qty)}
                                    className="hover:bg-[#E8E8E8] active:scale-95 transition-all"
                                    style={{
                                        backgroundColor: "#F5F5F5",
                                        padding: "8px 16px",
                                        borderRadius: "8px",
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        color: "#383838",
                                        minWidth: "50px",
                                    }}
                                >
                                    {qty}
                                </button>
                            ))}
                        </motion.div>
                    </motion.div>
                )}

                {/* Step 3: Year Selection */}
                {currentStep === "year" && !isExiting && (
                    <motion.div
                        key="year"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col items-center text-center px-6 max-w-[700px]"
                    >
                        <motion.h1
                            variants={itemVariants}
                            className="text-[#383838] mb-3"
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "28px",
                                fontWeight: 500
                            }}
                        >
                            Select the past question year to focus on.
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "16px",
                                fontWeight: 400,
                                color: "#717784"
                            }}
                        >
                            Select one option
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="mt-10 flex flex-col items-center"
                        >
                            {/* Years Grid - 3 rows */}
                            {/* Years Grid - Responsive */}
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-y-3 gap-x-2 w-full max-w-full overflow-hidden px-2">
                                {years.map((year) => (
                                    <button
                                        key={year}
                                        onClick={() => handleYearSelect(year)}
                                        className="py-2 px-1 hover:bg-[#F5F5F5] rounded-lg transition-all truncate"
                                        style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "15px",
                                            fontWeight: 500,
                                            color: "#383838",
                                        }}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>

                            {/* Shuffle Option */}
                            <motion.div
                                variants={itemVariants}
                                className="mt-10 flex flex-col items-center gap-3"
                            >
                                <p
                                    style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "14px",
                                        fontWeight: 400,
                                        color: "#717784",
                                    }}
                                >
                                    Or, would you prefer a random mix?
                                </p>
                                <button
                                    onClick={() => handleYearSelect("random")}
                                    className="flex items-center gap-2 px-4 py-2 border border-[#E1E4EA] rounded-lg hover:bg-[#F5F5F5] transition-all"
                                    style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        color: "#383838",
                                    }}
                                >
                                    <Shuffle size={16} />
                                    Shuffle Questions
                                </button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Step 4: Loading */}
                {currentStep === "loading" && !isExiting && (
                    <motion.div
                        key="loading"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col items-center text-center px-6"
                    >
                        <motion.h1
                            variants={itemVariants}
                            className={`text-[#383838] ${isTypingComplete ? "animate-pulse" : ""}`}
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "28px",
                                fontWeight: 500
                            }}
                        >
                            {loadingText}
                            {!isTypingComplete && <span className="animate-pulse">|</span>}
                        </motion.h1>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExamOnboarding;
