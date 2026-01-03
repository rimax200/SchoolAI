"use client";

import { useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import {
    ChevronLeft,
    ChevronRight,
    Shuffle,
    Edit3,
    ArrowLeft,
    RotateCcw,
    Lightbulb,
    Check,
    X
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

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

const FlashcardPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [knownCount, setKnownCount] = useState(0);
    const [unknownCount, setUnknownCount] = useState(0);

    const currentCard = flashcards[currentIndex];
    const progressValue = ((currentIndex + 1) / flashcards.length) * 100;

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
        if (showHint) setShowHint(false);
    };

    const nextCard = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
            setShowHint(false);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
            setShowHint(false);
        }
    };

    const markKnown = () => {
        setKnownCount(prev => prev + 1);
        nextCard();
    };

    const markUnknown = () => {
        setUnknownCount(prev => prev + 1);
        nextCard();
    };

    return (
        <Layout classWrapper="flex flex-col items-center bg-gray-25 min-h-screen" hidePanelMessage={true}>
            <div className="w-full max-w-[900px] pt-8 pb-32 px-6 font-manrope">
                {/* Back Link */}
                <Link
                    href="/study-lab"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Study Lab
                </Link>

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cell Structure & Function</h1>
                        <p className="text-gray-500 font-medium tracking-tight">Chapter 4 Review • {flashcards.length} cards</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="rounded-xl border-gray-100 font-manrope bg-white shadow-sm">
                            <Shuffle className="w-4 h-4 mr-2" />
                            Shuffle
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl border-gray-100 font-manrope bg-white shadow-sm">
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Card
                        </Button>
                    </div>
                </div>

                {/* Progress Bar using Shadcn Progress */}
                <div className="mb-12">
                    <div className="flex justify-between items-end mb-3">
                        <div className="text-sm font-bold text-gray-900">Card {currentIndex + 1} of {flashcards.length}</div>
                        <div className="text-sm font-medium text-gray-500">{Math.round(progressValue)}% complete</div>
                    </div>
                    <Progress value={progressValue} className="h-2 bg-gray-100" />
                </div>

                {/* Flashcard Container */}
                <div className="perspective-1000 h-[400px] relative mb-12 cursor-pointer" onClick={handleFlip}>
                    <motion.div
                        className="w-full h-full relative preserve-3d transition-all duration-700"
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                    >
                        {/* Front Side */}
                        <div className="absolute inset-0 backface-hidden bg-white border border-gray-100 rounded-[32px] p-12 shadow-xl shadow-gray-200/50 flex flex-col items-center justify-center text-center">
                            <div className="absolute top-8 px-4 py-1.5 bg-gray-50 rounded-full text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                Question
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                                {currentCard.question}
                            </h2>
                            <button
                                className="mt-8 flex items-center gap-2 text-primary-200 font-bold text-sm hover:text-primary-300 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowHint(!showHint);
                                }}
                            >
                                <Lightbulb className="w-4 h-4" />
                                {showHint ? currentCard.hint : "Show Hint"}
                            </button>
                            <div className="absolute bottom-8 text-[11px] font-bold text-gray-300 tracking-widest uppercase">
                                Click card or press Space to flip
                            </div>
                        </div>

                        {/* Back Side */}
                        <div
                            className="absolute inset-0 backface-hidden bg-primary-200 border border-primary-300 rounded-[32px] p-12 shadow-xl shadow-primary-200/20 flex flex-col items-center justify-center text-center rotate-y-180"
                        >
                            <div className="absolute top-8 px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black tracking-widest text-white/50 uppercase">
                                Answer
                            </div>
                            <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                                {currentCard.answer}
                            </p>
                            <div className="absolute bottom-8 text-[11px] font-bold text-white/30 tracking-widest uppercase">
                                Click card to see question
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-8">
                    <div className="flex items-center gap-6">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); prevCard(); }}
                            disabled={currentIndex === 0}
                            className="rounded-full w-12 h-12 border-gray-100 bg-white"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>

                        <div className="flex items-center gap-3 p-1.5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                            <Button
                                variant="ghost"
                                onClick={(e) => { e.stopPropagation(); markUnknown(); }}
                                className="h-14 px-6 hover:bg-error-0 text-gray-500 hover:text-error-100 rounded-[14px] font-bold transition-all gap-3"
                            >
                                <X className="w-5 h-5" />
                                Unknown
                                <span className="flex items-center justify-center w-5 h-5 bg-gray-50 rounded-md text-[10px] font-black text-gray-400">1</span>
                            </Button>

                            <Button
                                onClick={(e) => { e.stopPropagation(); handleFlip(); }}
                                className="h-14 px-8 bg-primary-200 text-white rounded-[14px] font-bold shadow-lg shadow-primary-200/25 hover:bg-primary-300 transition-all gap-3"
                            >
                                <RotateCcw className="w-5 h-5" />
                                {isFlipped ? "Show Question" : "Reveal Answer"}
                                <span className="flex items-center justify-center px-1.5 h-5 bg-white/20 rounded-md text-[10px] font-black">SPC</span>
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={(e) => { e.stopPropagation(); markKnown(); }}
                                className="h-14 px-6 hover:bg-success-0 text-gray-500 hover:text-success-100 rounded-[14px] font-bold transition-all gap-3"
                            >
                                <Check className="w-5 h-5" />
                                Known
                                <span className="flex items-center justify-center w-5 h-5 bg-gray-50 rounded-md text-[10px] font-black text-gray-400">2</span>
                            </Button>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); nextCard(); }}
                            disabled={currentIndex === flashcards.length - 1}
                            className="rounded-full w-12 h-12 border-gray-100 bg-white"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                    </div>

                    {/* Keyboard Legend */}
                    <div className="flex flex-wrap justify-center items-center gap-6 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-white border border-gray-100 rounded shadow-sm text-gray-500">Space</span>
                            Flip Card
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-white border border-gray-100 rounded shadow-sm text-gray-500">←</span>
                            Prev
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-white border border-gray-100 rounded shadow-sm text-gray-500">→</span>
                            Next
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-white border border-gray-100 rounded shadow-sm text-gray-500">1</span>
                            Mark Unknown
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-white border border-gray-100 rounded shadow-sm text-gray-500">2</span>
                            Mark Known
                        </div>
                    </div>
                </div>
            </div>

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
