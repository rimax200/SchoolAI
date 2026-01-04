"use client";

import { useState, useCallback, useEffect } from "react";
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
    HelpCircle
} from "lucide-react";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Item,
    ItemContent,
    ItemTitle,
    ItemDescription,
    ItemActions,
    ItemMedia
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

const FlashcardPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [knownCount, setKnownCount] = useState(0);
    const [unknownCount, setUnknownCount] = useState(0);

    const currentCard = flashcards[currentIndex];
    const progressValue = ((currentIndex + 1) / flashcards.length) * 100;

    const handleFlip = useCallback(() => {
        setIsFlipped(prev => !prev);
        if (showHint) setShowHint(false);
    }, [showHint]);

    const nextCard = useCallback(() => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
            setShowHint(false);
        }
    }, [currentIndex]);

    const prevCard = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setIsFlipped(false);
            setShowHint(false);
        }
    }, [currentIndex]);

    const markKnown = useCallback(() => {
        setKnownCount(prev => prev + 1);
        nextCard();
    }, [nextCard]);

    const markUnknown = useCallback(() => {
        setUnknownCount(prev => prev + 1);
        nextCard();
    }, [nextCard]);

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
            <div className="w-full max-w-[800px] pt-12 pb-32 px-6 font-manrope">

                {/* Clean Header - Standard Shadcn feel */}
                <nav className="flex items-center justify-between mb-16">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/study-lab" className="gap-2 font-bold text-gray-500">
                            <ArrowLeft className="w-4 h-4" />
                            Exit Session
                        </Link>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                            <Shuffle className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 gap-2">
                            <Edit3 className="w-4 h-4" />
                            Edit
                        </Button>
                    </div>
                </nav>

                {/* Session Context Header */}
                <header className="mb-10 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <LayoutGrid className="w-3 h-3" />
                        Cell Structure & Function
                    </div>
                    <div className="flex items-end justify-between">
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Active Recall</h1>
                        <div className="text-sm font-bold text-gray-400">
                            Card <span className="text-gray-900">{currentIndex + 1}</span> of {flashcards.length}
                        </div>
                    </div>
                </header>

                {/* Progress Bar */}
                <div className="mb-12">
                    <Progress value={progressValue} className="h-1 bg-gray-100" />
                </div>

                {/* Main Flashcard - Using standard container styling */}
                <div className="perspective-1000 h-[420px] relative mb-12 cursor-pointer group" onClick={handleFlip}>
                    <motion.div
                        className="w-full h-full relative preserve-3d transition-all duration-700"
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                    >
                        {/* Front Side */}
                        <div className="absolute inset-0 backface-hidden bg-white border border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-sm group-hover:border-gray-300 transition-colors">
                            <div className="absolute top-8 px-4 py-1 bg-gray-50 rounded-full text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                Question
                            </div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight max-w-[90%]">
                                {currentCard.question}
                            </h2>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="mt-8 rounded-full h-8 px-4 text-xs font-bold gap-2 text-gray-500 hover:text-gray-900"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowHint(!showHint);
                                }}
                            >
                                <HelpCircle className="w-3.5 h-3.5" />
                                {showHint ? currentCard.hint : "Show Hint"}
                            </Button>
                        </div>

                        {/* Back Side */}
                        <div
                            className="absolute inset-0 backface-hidden bg-gray-900 border border-gray-800 rounded-3xl p-10 flex flex-col items-center justify-center text-center rotate-y-180 shadow-xl"
                        >
                            <div className="absolute top-8 px-4 py-1 bg-white/10 rounded-full text-[10px] font-black tracking-widest text-white/40 uppercase">
                                Verified Answer
                            </div>
                            <p className="text-xl md:text-2xl font-medium text-white leading-relaxed max-w-[90%]">
                                {currentCard.answer}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Standard Controls */}
                <div className="flex flex-col items-center gap-10">
                    <div className="flex items-center gap-8">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); prevCard(); }}
                            disabled={currentIndex === 0}
                            className="rounded-xl w-12 h-12 border-gray-200"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </Button>

                        <div className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-100 rounded-2xl">
                            <Button
                                variant="ghost"
                                onClick={(e) => { e.stopPropagation(); markUnknown(); }}
                                className="h-10 px-6 hover:bg-white text-gray-500 hover:text-gray-900 rounded-xl font-bold transition-all gap-3"
                            >
                                <X className="w-4 h-4" />
                                Hard
                            </Button>

                            <Button
                                onClick={(e) => { e.stopPropagation(); handleFlip(); }}
                                className="h-10 px-8 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all gap-3 shadow-lg shadow-gray-900/10"
                            >
                                <RotateCcw className="w-4 h-4" />
                                {isFlipped ? "Return" : "Reveal"}
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={(e) => { e.stopPropagation(); markKnown(); }}
                                className="h-10 px-6 hover:bg-white text-gray-500 hover:text-gray-900 rounded-xl font-bold transition-all gap-3"
                            >
                                <Check className="w-4 h-4" />
                                Easy
                            </Button>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); nextCard(); }}
                            disabled={currentIndex === flashcards.length - 1}
                            className="rounded-xl w-12 h-12 border-gray-200"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </Button>
                    </div>

                    {/* Stats Summary - Using 'Item' for clean data display */}
                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                        <Item variant="outline" size="sm" className="rounded-xl">
                            <ItemContent>
                                <ItemTitle className="text-xs text-gray-400 uppercase tracking-widest">Mastery</ItemTitle>
                                <p className="text-xl font-bold text-gray-900">
                                    {Math.round((knownCount / (knownCount + unknownCount || 1)) * 100)}%
                                </p>
                            </ItemContent>
                        </Item>
                        <Item variant="outline" size="sm" className="rounded-xl">
                            <ItemContent>
                                <ItemTitle className="text-xs text-gray-400 uppercase tracking-widest">Studied</ItemTitle>
                                <p className="text-xl font-bold text-gray-900">
                                    {knownCount + unknownCount} <span className="text-gray-300 font-medium">/ {flashcards.length}</span>
                                </p>
                            </ItemContent>
                        </Item>
                    </div>

                    {/* Shortcuts */}
                    <div className="flex justify-center items-center gap-6 text-[9px] font-bold tracking-[0.2em] text-gray-300 uppercase">
                        <Shortcut label="SPC" action="Flip" />
                        <Shortcut label="←/→" action="Move" />
                        <Shortcut label="1" action="Hard" />
                        <Shortcut label="2" action="Easy" />
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

const Shortcut = ({ label, action }: { label: string; action: string }) => (
    <div className="flex items-center gap-2">
        <span className="px-1.5 py-0.5 border border-gray-100 rounded bg-gray-50 text-gray-400">{label}</span>
        {action}
    </div>
);

export default FlashcardPage;
