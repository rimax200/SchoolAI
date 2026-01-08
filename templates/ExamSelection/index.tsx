"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Filter,
    Check,
    ChevronDown,
    ChevronRight,
    ArrowRight,
    Settings2,
    Layers,
    Timer,
    BookOpen
} from "lucide-react";

import { Course, Module, COURSES } from "@/constants/study";
import Layout from "@/components/Layout";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";

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
        <Layout hidePanelMessage={true} classWrapper="bg-[#f1f1f1] min-h-screen">
            <div className="max-w-[1000px] mx-auto pt-12 pb-40 px-4">

                {/* Shopify-style Header */}
                <div className="flex flex-col gap-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-[20px] font-bold text-[#303030] tracking-tight font-sans">Exam Prep</h1>
                            <p className="text-[#616161] text-sm font-sans">
                                Set up your exam by selecting courses and modules.
                            </p>
                        </div>
                    </div>

                    {/* Main Course Selection Card */}
                    <div className="bg-white border border-[#ebebeb] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden">
                        <div className="p-5 border-b border-[#f1f1f1] flex items-center justify-between bg-white">
                            <h2 className="text-[14px] font-bold text-[#303030] flex items-center gap-2">
                                <BookOpen size={18} className="text-[#616161]" />
                                Your Courses
                            </h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#616161]" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search courses"
                                    className="pl-9 pr-4 py-1.5 bg-[#f6f6f6] border border-[#d1d1d1] rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#303030] transition-all w-64 font-sans"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 p-5 overflow-x-auto no-scrollbar scroll-smooth">
                            {filteredCourses.map((course) => {
                                const isSelected = course.modules.length > 0 && course.modules.every(m => selectedModules.includes(m.id));
                                const isActive = activeCourseId === course.id;

                                return (
                                    <div
                                        key={course.id}
                                        onClick={() => setActiveCourseId(course.id)}
                                        className={cn(
                                            "flex-shrink-0 w-[240px] flex flex-col p-4 bg-white border rounded-lg transition-all cursor-pointer relative",
                                            isActive
                                                ? "border-[#303030] shadow-[0_0_0_1px_#303030]"
                                                : "border-[#ebebeb] hover:border-[#d1d1d1]"
                                        )}
                                    >
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-[13px] font-bold text-[#303030] leading-snug font-sans line-clamp-2 pr-6">
                                                    {course.title}
                                                </h3>
                                                <div className={cn(
                                                    "w-4 h-4 rounded border flex items-center justify-center transition-all",
                                                    isSelected ? "bg-[#303030] border-[#303030]" : "border-[#d1d1d1] bg-white"
                                                )}>
                                                    {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                                                </div>
                                            </div>
                                            <span className="text-[11px] font-medium text-[#616161] uppercase tracking-wider">
                                                {course.modulesCount} Modules
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Modules & Configuration Section - Two Column Grid like Shopify Payments/Shipping */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Module Selection Card (2/3 width) */}
                    <div className="md:col-span-2 flex flex-col gap-4">
                        <AnimatePresence mode="wait">
                            {activeCourse && (
                                <motion.div
                                    key={activeCourse.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="bg-white border border-[#ebebeb] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden"
                                >
                                    <div className="p-5 border-b border-[#f1f1f1] flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <h2 className="text-[14px] font-bold text-[#303030]">
                                                Modules in <span className="text-[#303030]">{activeCourse.title}</span>
                                            </h2>
                                            <p className="text-[12px] text-[#616161]">Pick specific modules for your exam.</p>
                                        </div>
                                        <button
                                            onClick={() => toggleCourse(activeCourse.id)}
                                            className="text-xs font-bold text-[#303030] px-3 py-1.5 border border-[#d1d1d1] rounded-lg hover:bg-[#f6f6f6] transition-all"
                                        >
                                            {activeCourse.modules.every(m => selectedModules.includes(m.id)) ? "Deselect All" : "Select All"}
                                        </button>
                                    </div>

                                    <div className="p-2">
                                        {activeCourse.modules.map(module => {
                                            const isSelected = selectedModules.includes(module.id);
                                            return (
                                                <div
                                                    key={module.id}
                                                    onClick={() => toggleModule(module.id)}
                                                    className={cn(
                                                        "flex items-center gap-4 p-4 hover:bg-[#f9f9f9] transition-all cursor-pointer border-b border-[#f1f1f1] last:border-0",
                                                        isSelected && "bg-[#f9f9f9]"
                                                    )}
                                                >
                                                    <Checkbox
                                                        id={module.id}
                                                        checked={isSelected}
                                                        onCheckedChange={() => toggleModule(module.id)}
                                                        className="w-4 h-4 rounded border-[#d1d1d1] data-[state=checked]:bg-[#303030] data-[state=checked]:border-[#303030]"
                                                    />
                                                    <div className="flex flex-col flex-1">
                                                        <span className="text-[13px] font-bold text-[#303030]">
                                                            {module.title}
                                                        </span>
                                                        <span className="text-[11px] text-[#616161]">
                                                            {module.topics} core topics • Est. {module.duration} mins
                                                        </span>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-[#d1d1d1]" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Configuration Sidebar (1/3 width) - Smaller cards pattern */}
                    <div className="flex flex-col gap-4">
                        {/* Exam Volume Card */}
                        <div className="bg-white border border-[#ebebeb] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
                            <div className="flex flex-col gap-1 mb-4">
                                <h3 className="text-[13px] font-bold text-[#303030]">Exam Volume</h3>
                                <p className="text-[12px] text-[#616161]">Number of AI-generated questions.</p>
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="flex items-center justify-between w-full px-3 py-2 border border-[#d1d1d1] rounded-lg text-sm font-medium text-[#303030] hover:bg-[#f6f6f6] transition-all">
                                        <span>{questionCount} Questions</span>
                                        <ChevronDown className="w-4 h-4 text-[#616161]" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-72 p-6 rounded-xl shadow-2xl border-[#ebebeb] bg-white">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center text-[#303030]">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#616161]">Volume</span>
                                            <span className="text-sm font-black">{questionCount}</span>
                                        </div>
                                        <Slider
                                            defaultValue={[questionCount]}
                                            max={50}
                                            min={5}
                                            step={5}
                                            onValueChange={(val) => setQuestionCount(val[0])}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Exam Timer Card */}
                        <div className="bg-white border border-[#ebebeb] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.1)] p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-[13px] font-bold text-[#303030]">Timer</h3>
                                    <p className="text-[12px] text-[#616161]">Enable timed assessment.</p>
                                </div>
                                <Switch
                                    checked={useTimer}
                                    onCheckedChange={setUseTimer}
                                    className="data-[state=checked]:bg-[#303030]"
                                />
                            </div>

                            <AnimatePresence>
                                {useTimer && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden pt-2"
                                    >
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="flex items-center justify-between w-full px-3 py-2 border border-[#d1d1d1] rounded-lg text-sm font-medium text-[#303030] hover:bg-[#f6f6f6] transition-all">
                                                    <span>{duration} Minutes</span>
                                                    <ChevronDown className="w-4 h-4 text-[#616161]" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-72 p-6 rounded-xl shadow-2xl border-[#ebebeb] bg-white">
                                                <div className="space-y-6">
                                                    <div className="flex justify-between items-center text-[#303030]">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#616161]">Time Limit</span>
                                                        <span className="text-sm font-black">{duration}m</span>
                                                    </div>
                                                    <Slider
                                                        defaultValue={[duration]}
                                                        max={120}
                                                        min={10}
                                                        step={10}
                                                        onValueChange={(val) => setDuration(val[0])}
                                                        className="cursor-pointer"
                                                    />
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shopify-inspired Floating Bar (The 'Smart Pill') */}
            <AnimatePresence>
                {selectedModules.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-8 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none"
                    >
                        <div className="bg-[#303030] border border-[#3e3e3e] px-4 md:px-6 py-3 rounded-full flex items-center gap-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] pointer-events-auto">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Scope</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-white text-md font-bold">{selectedModules.length}</span>
                                        <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider">Mods</span>
                                    </div>
                                </div>
                                <div className="w-px h-6 bg-white/10" />
                                <div className="flex flex-col">
                                    <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Target</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-white text-md font-bold">{questionCount}</span>
                                        <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider">Qs</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedModules([])}
                                    className="text-white/60 hover:text-white font-bold text-xs transition-colors px-2"
                                >
                                    Cancel
                                </button>
                                <Link href={`/exam-prep/session?modules=${selectedModules.join(",")}&timer=${useTimer}&duration=${duration}&count=${questionCount}`}>
                                    <button className="h-9 px-6 rounded-full bg-white text-[#303030] font-bold text-xs flex items-center gap-2 hover:bg-[#f1f1f1] transition-colors shadow-sm">
                                        <span>Begin Exam</span>
                                        <ArrowRight size={14} className="stroke-[3]" />
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

export default ExamSelection;
