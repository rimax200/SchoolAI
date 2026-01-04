"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Check,
    ChevronRight,
    ArrowRight,
    Timer,
    Clock,
    Zap,
    BookOpen,
    Layers,
    ChevronDown
} from "lucide-react";

import { Course, Module, COURSES } from "@/constants/study";
import Layout from "@/components/Layout";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const ExamSelection = () => {
    const [selectedModules, setSelectedModules] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCourseId, setActiveCourseId] = useState<string | null>(COURSES[0].id);
    const [useTimer, setUseTimer] = useState(true);
    const [duration, setDuration] = useState(30);
    const [questionCount, setQuestionCount] = useState(15);

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

    const filteredCourses = COURSES.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeCourse = COURSES.find(c => c.id === activeCourseId);

    return (
        <Layout hidePanelMessage={true}>
            <div className="flex flex-col gap-8 max-md:pt-12 font-sans">

                {/* Header: Consistent with StudyLabSelection */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Exam Prep</h1>
                    <p className="text-gray-500 text-sm">
                        Select subjects and configure your AI-generated exam.
                    </p>
                </div>

                {/* Configuration: Clean Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col p-6 bg-white border border-gray-100 rounded-2xl shadow-sm gap-4">
                        <div className="flex items-center gap-2 text-gray-900">
                            <Timer className="w-4 h-4 text-gray-400" />
                            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400">Exam Timer</h3>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Active Timer</span>
                            <Switch checked={useTimer} onCheckedChange={setUseTimer} />
                        </div>
                        <AnimatePresence>
                            {useTimer && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-2 border-t border-gray-50 flex flex-col gap-3"
                                >
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-gray-900">{duration}m</span>
                                        <span className="text-[10px] font-bold text-gray-300 uppercase">Limit</span>
                                    </div>
                                    <Slider defaultValue={[duration]} max={120} min={5} step={5} onValueChange={(v) => setDuration(v[0])} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex flex-col p-6 bg-white border border-gray-100 rounded-2xl shadow-sm gap-4">
                        <div className="flex items-center gap-2 text-gray-900">
                            <Layers className="w-4 h-4 text-gray-400" />
                            <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400">Question Load</h3>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-gray-900">{questionCount}</span>
                                <span className="text-[10px] font-bold text-gray-300 uppercase">Questions</span>
                            </div>
                            <Slider defaultValue={[questionCount]} max={50} min={5} step={5} onValueChange={(v) => setQuestionCount(v[0])} />
                        </div>
                    </div>

                    <div className="flex flex-col p-6 bg-gray-900 rounded-2xl text-white relative overflow-hidden">
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Setup Summary</span>
                                <h3 className="font-bold text-base">Assessment Ready</h3>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-medium text-gray-400 mt-4">
                                <span>{selectedModules.length} Modules</span>
                                <span>•</span>
                                <span>{useTimer ? `${duration}m` : "Self-paced"}</span>
                            </div>
                        </div>
                        <Zap className="absolute -bottom-4 -right-4 w-24 h-24 text-white opacity-5" />
                    </div>
                </div>

                {/* Filter & Grid */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <h2 className="text-lg font-bold text-gray-900">Select Subjects</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs outline-none focus:ring-1 focus:ring-gray-200 transition-all w-48"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {filteredCourses.map((course) => {
                            const isSelected = course.modules.length > 0 && course.modules.every(m => selectedModules.includes(m.id));
                            const isActive = activeCourseId === course.id;

                            return (
                                <div
                                    key={course.id}
                                    className={cn(
                                        "flex flex-col p-5 bg-white border rounded-2xl shadow-sm transition-all cursor-pointer relative",
                                        isActive ? "border-gray-900 ring-1 ring-gray-900" : "border-gray-100 hover:border-gray-200"
                                    )}
                                    onClick={() => setActiveCourseId(course.id)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center border",
                                            isActive ? "bg-gray-900 text-white border-gray-900" : "bg-gray-50 text-gray-400 border-gray-100"
                                        )}>
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <div
                                            onClick={(e) => { e.stopPropagation(); toggleCourse(course.id); }}
                                            className={cn(
                                                "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                                                isSelected ? "bg-gray-900 border-gray-900" : "border-gray-200 bg-white"
                                            )}
                                        >
                                            {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-1">{course.title}</h3>
                                    <p className="text-[11px] text-gray-500 line-clamp-2">{course.description}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Modules Drawer */}
                    <AnimatePresence mode="wait">
                        {activeCourse && (
                            <motion.div
                                key={activeCourse.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                        Modules in {activeCourse.title}
                                    </h2>
                                    <button
                                        onClick={() => toggleCourse(activeCourse.id)}
                                        className="text-[10px] font-bold text-gray-900 hover:underline uppercase tracking-widest"
                                    >
                                        {activeCourse.modules.every(m => selectedModules.includes(m.id)) ? "Deselect Group" : "Select Group"}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {activeCourse.modules.map(module => {
                                        const isSelected = selectedModules.includes(module.id);
                                        return (
                                            <div
                                                key={module.id}
                                                onClick={() => toggleModule(module.id)}
                                                className={cn(
                                                    "flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl transition-all cursor-pointer hover:border-gray-200",
                                                    isSelected && "bg-gray-900 text-white border-gray-900"
                                                )}
                                            >
                                                <Checkbox checked={isSelected} className={cn("w-5 h-5", isSelected && "border-white/20 bg-white")} />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium leading-none mb-1">{module.title}</span>
                                                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", isSelected ? "text-gray-500" : "text-gray-300")}>
                                                        {module.duration} MINS
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Selection Bar: Fixed to your StudyLabSelection logic */}
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
                                    <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-0.5 hidden md:block">Scope</span>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-gray-900 text-lg md:text-xl font-black">{selectedModules.length}</span>
                                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Mods</span>
                                    </div>
                                </div>
                                <div className="w-px h-6 md:h-8 bg-gray-100" />
                                <div className="flex flex-col">
                                    <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-0.5 hidden md:block">Questions</span>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-gray-900 text-lg md:text-xl font-black">{questionCount}</span>
                                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Qs</span>
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
                                <Link href={`/exam-prep/session?modules=${selectedModules.join(",")}&timer=${useTimer}&duration=${duration}&count=${questionCount}`}>
                                    <button className="h-10 md:h-12 px-5 md:px-8 rounded-xl md:rounded-2xl bg-gray-900 text-white font-bold text-xs md:text-sm flex items-center gap-1.5 md:gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10 whitespace-nowrap">
                                        <span className="hidden sm:inline">Begin Examination</span>
                                        <span className="sm:hidden">Start</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default ExamSelection;
