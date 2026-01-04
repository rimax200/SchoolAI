"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
    Search,
    Filter,
    Folder,
    Clock,
    Sparkles,
    X,
    ArrowRight,
    Check,
    ChevronRight,
    Library,
    Compass,
    Settings2,
    BookOpen,
    Layers,
    ChevronDown,
    LucideIcon
} from "lucide-react";

import { Course, Module, COURSES } from "@/constants/study";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// --- Icons ---

const GeminiIcon = ({ className }: { className?: string }) => (
    <img src="/icons/gemini.png" alt="Gemini" className={cn("object-contain", className)} />
);

const TypingText = ({ text, delay = 0.03 }: { text: string, delay?: number }) => {
    const [displayedText, setDisplayedText] = useState("");
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (isInView) {
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
        }
    }, [isInView, text, delay]);

    return (
        <span ref={ref} className="relative">
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

// --- Main Component ---

const StudyLabSelection = () => {
    const [selectedModules, setSelectedModules] = useState<string[]>([]);
    const [flashcardCount, setFlashcardCount] = useState(20);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCourseId, setActiveCourseId] = useState<string | null>(COURSES[0].id);

    // --- Logic ---

    const toggleModule = (id: string) => {
        setSelectedModules(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    const toggleCourse = (courseId: string) => {
        const course = COURSES.find(c => c.id === courseId);
        if (!course) return;

        const allModuleIds = course.modules.map(m => m.id);
        const alreadyHasAll = allModuleIds.every(id => selectedModules.includes(id));

        if (alreadyHasAll) {
            setSelectedModules(prev => prev.filter(id => !allModuleIds.includes(id)));
        } else {
            setSelectedModules(prev => Array.from(new Set([...prev, ...allModuleIds])));
        }
    };

    const selectedItems = useMemo(() =>
        COURSES.flatMap(c => c.modules).filter(m => selectedModules.includes(m.id)),
        [selectedModules]
    );

    const totalDuration = selectedItems.reduce((acc, m) => acc + m.duration, 0);

    const filteredCourses = COURSES.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeCourse = COURSES.find(c => c.id === activeCourseId);

    return (
        <Layout hidePanelMessage={true}>
            <div className="flex flex-col gap-6 max-md:pt-12">

                {/* Header Area - Exact Replica from Library */}
                <div className="flex items-start justify-between max-md:flex-col max-md:gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[20px] font-medium text-[#383838] tracking-tight font-sans">Study Lab</h1>
                        <p className="text-gray-500 text-sm font-sans">
                            Select materials to generate your recall session.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 max-md:w-full">
                        <div className="relative max-md:flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search"
                                className="pl-9 pr-12 py-2 bg-white border border-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-100/50 transition-all w-52 max-md:w-full font-sans"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-gray-400 border border-gray-100 px-1 rounded font-sans max-md:hidden">
                                ⌘K
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-25 transition-colors shadow-sm font-sans">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <span className="max-md:hidden">Filter</span>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Content Sections - Exact Replica including Grid */}
                <div className="flex flex-col gap-10 mt-4 pb-32">
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                            <h2 className="text-[20px] font-medium text-[#383838] font-sans">Your Library</h2>
                        </div>

                        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-2 md:grid md:grid-cols-3 2xl:grid-cols-3">
                            {filteredCourses.map((course) => {
                                const isSelected = course.modules.length > 0 && course.modules.every(m => selectedModules.includes(m.id));
                                const partialSelected = course.modules.some(m => selectedModules.includes(m.id)) && !isSelected;
                                const isActive = activeCourseId === course.id;

                                return (
                                    <div
                                        key={course.id}
                                        className={cn(
                                            "group flex flex-col p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer min-w-[300px] max-md:min-w-[260px] relative",
                                            isActive && "border-primary-100 bg-primary-0/20 shadow-md ring-1 ring-primary-100/10"
                                        )}
                                        onClick={() => setActiveCourseId(course.id)}
                                    >
                                        {/* Selection Indicator */}
                                        <div
                                            onClick={(e) => { e.stopPropagation(); toggleCourse(course.id); }}
                                            className={cn(
                                                "absolute top-4 right-4 w-5 h-5 rounded-md border flex items-center justify-center transition-all z-10",
                                                isSelected ? "bg-gray-900 border-gray-900" : "border-gray-200 bg-white"
                                            )}
                                        >
                                            {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                            {partialSelected && <div className="w-2 h-2 rounded-sm bg-gray-900/20" />}
                                        </div>

                                        <div className="flex flex-col gap-2.5">
                                            <h3 className="text-[16px] font-medium text-[#000000] leading-snug font-sans truncate pr-8">
                                                {course.title}
                                            </h3>
                                            <p className="text-gray-500 text-[13px] line-clamp-3 leading-relaxed font-sans font-normal h-[50px]">
                                                {course.description}
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-3 mt-auto pt-6">
                                            <div className="flex items-center gap-2 px-3 py-1.5 border border-[#EEEEEE] rounded-lg w-fit transition-colors group-hover:bg-gray-25">
                                                <Layers className="w-4 h-4 opacity-100 object-contain text-gray-400" />
                                                <span className="text-[12px] font-medium text-[#010101] font-sans">
                                                    {course.modulesCount} Modules
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Active Course Detail Area */}
                    <AnimatePresence mode="wait">
                        {activeCourse && (
                            <motion.section
                                key={activeCourse.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col gap-6"
                            >
                                <div className="flex items-center justify-between border-b border-gray-50 pb-2 mt-4">
                                    <h2 className="text-[20px] font-medium text-[#383838] font-sans">
                                        Modules in <span className="text-primary-200">{activeCourse.title}</span>
                                    </h2>
                                    <button
                                        onClick={() => toggleCourse(activeCourse.id)}
                                        className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors font-sans"
                                    >
                                        {activeCourse.modules.every(m => selectedModules.includes(m.id)) ? "Deselect All" : "Select All"}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeCourse.modules.map(module => {
                                        const isSelected = selectedModules.includes(module.id);
                                        return (
                                            <Label
                                                key={module.id}
                                                htmlFor={module.id}
                                                className={cn(
                                                    "group flex flex-col p-5 bg-white border border-gray-100 rounded-2xl transition-all cursor-pointer relative",
                                                    isSelected && "bg-gray-50 border-gray-300 shadow-inner"
                                                )}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="pt-1">
                                                        <Checkbox
                                                            id={module.id}
                                                            checked={isSelected}
                                                            onCheckedChange={() => toggleModule(module.id)}
                                                            className="w-5 h-5 rounded-md border-gray-200 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1 pr-6 flex-1">
                                                        <h3 className="text-[15px] font-medium text-[#383838] font-sans leading-tight">
                                                            {module.title}
                                                        </h3>
                                                        <p className="text-[12px] text-gray-500 font-sans">
                                                            {module.topics} core topics • Est. {module.duration} mins
                                                        </p>
                                                    </div>
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center transition-colors absolute right-4 top-1/2 -translate-y-1/2 border border-gray-100 shadow-xs",
                                                        isSelected ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-400 group-hover:bg-gray-50"
                                                    )}>
                                                        <ChevronRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </Label>
                                        );
                                    })}
                                </div>
                            </motion.section>
                        )}
                    </AnimatePresence>

                    {/* Parameter Section / Bottom Area */}
                    <div className="flex flex-col gap-8 mt-6">
                        <div className="flex items-center gap-2 text-[#383838] font-medium font-sans">
                            <Settings2 className="w-4 h-4" />
                            <h2 className="text-[18px]">Session Settings</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col p-6 bg-white border border-gray-100 rounded-2xl shadow-sm font-sans gap-4">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-[16px] font-medium text-[#000000]">Flashcard Count</h3>
                                    <p className="text-gray-500 text-[13px]">How many cards for this session?</p>
                                </div>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="flex items-center justify-between w-full px-4 py-2 border border-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-25 transition-all shadow-sm">
                                            <span>{flashcardCount} Flashcards</span>
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-72 p-6 rounded-2xl shadow-2xl border-gray-100 bg-white" align="start">
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center text-gray-900">
                                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Target</span>
                                                <span className="text-sm font-black">{flashcardCount}</span>
                                            </div>
                                            <Slider
                                                defaultValue={[flashcardCount]}
                                                max={100}
                                                min={5}
                                                step={5}
                                                onValueChange={(val) => setFlashcardCount(val[0])}
                                                className="py-4"
                                            />
                                            <div className="flex justify-between text-[10px] font-bold text-gray-300">
                                                <span>LITE (5)</span>
                                                <span>EXPERT (100)</span>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="bg-gray-900 text-white p-6 rounded-xl relative overflow-hidden flex flex-col items-center shadow-2xl shadow-gray-900/20 md:col-span-2">
                                <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between w-full">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-2">
                                            <GeminiIcon className="w-5 h-5" />
                                            <h3 className="font-bold text-base font-sans">AI Recommended</h3>
                                        </div>
                                        <p className="text-[13px] text-gray-400 leading-relaxed font-sans font-medium max-w-[600px] min-h-[40px]">
                                            <TypingText text="We suggest starting with Neural Networks. This topic has been highlighted as a key area for your current learning path." />
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => toggleModule("mod-3")}
                                        className="h-9 px-4 rounded-xl bg-white text-gray-900 font-bold text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-colors w-fit relative z-10 whitespace-nowrap"
                                    >
                                        Add to session
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Selection Bar - Responsive Smart Pill */}
            <AnimatePresence>
                {selectedModules.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-6 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none"
                    >
                        <div className="bg-white/90 backdrop-blur-2xl border border-gray-100 px-4 md:px-8 py-3 md:py-4 rounded-[22px] md:rounded-[28px] flex items-center justify-between shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] pointer-events-auto max-w-lg md:max-w-2xl w-full mx-auto">
                            <div className="flex items-center gap-4 md:gap-8">
                                <div className="flex flex-col">
                                    <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-0.5 hidden md:block">Session Scope</span>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-gray-900 text-lg md:text-xl font-black">{selectedModules.length}</span>
                                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Mods</span>
                                    </div>
                                </div>
                                <div className="w-px h-6 md:h-8 bg-gray-100" />
                                <div className="flex flex-col">
                                    <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-0.5 hidden md:block">Duration</span>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-gray-900 text-lg md:text-xl font-black">{totalDuration}</span>
                                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Mins</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 md:gap-4">
                                <button
                                    onClick={() => setSelectedModules([])}
                                    className="text-gray-400 hover:text-gray-900 font-bold px-2 md:px-4 text-xs md:text-sm transition-colors"
                                >
                                    Clear
                                </button>
                                <Link href={`/study-lab/flashcards?count=${flashcardCount}&modules=${selectedModules.join(",")}`}>
                                    <button className="h-10 md:h-12 px-5 md:px-8 rounded-xl md:rounded-2xl bg-gray-900 text-white font-bold text-xs md:text-sm flex items-center gap-1.5 md:gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10 whitespace-nowrap">
                                        <span className="hidden sm:inline">Start Session</span>
                                        <span className="sm:hidden">Start</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </Layout>
    );
};

export default StudyLabSelection;
