"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
    Layers,
    LucideIcon
} from "lucide-react";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Item,
    ItemContent,
    ItemTitle,
    ItemDescription,
    ItemActions
} from "@/components/ui/item";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// --- Types ---

interface Module {
    id: string;
    title: string;
    topics: number;
    duration: number;
}

interface Course {
    id: string;
    title: string;
    modulesCount: number;
    updated: string;
    modules: Module[];
    icon?: LucideIcon;
    color?: string;
}

// --- Mock Data ---

const COURSES: Course[] = [
    {
        id: "psychology",
        title: "Introduction to Psychology",
        modulesCount: 3,
        updated: "2 days ago",
        color: "bg-blue-50 text-blue-600",
        modules: [
            { id: "mod-1", title: "Cognitive Basics", topics: 24, duration: 15 },
            { id: "mod-2", title: "Behavioral Patterns", topics: 18, duration: 12 },
            { id: "mod-3", title: "Neural Networks", topics: 32, duration: 25 },
        ]
    },
    {
        id: "history",
        title: "European History: 1900-1950",
        modulesCount: 8,
        updated: "1 week ago",
        color: "bg-orange-50 text-orange-600",
        modules: [
            { id: "mod-4", title: "The Great War", topics: 45, duration: 30 },
            { id: "mod-5", title: "Interwar Period", topics: 20, duration: 15 },
        ]
    },
    {
        id: "chemistry",
        title: "Advanced Organic Chemistry",
        modulesCount: 12,
        updated: "yesterday",
        color: "bg-emerald-50 text-emerald-600",
        modules: [
            { id: "mod-6", title: "Carbon Compounds", topics: 50, duration: 45 },
            { id: "mod-7", title: "Reaction Mechanisms", topics: 35, duration: 40 },
        ]
    }
];

// --- Sub-components ---

const SelectionProgress = ({ count, total }: { count: number; total: number }) => {
    const percentage = (count / total) * 100;
    return (
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                className="h-full bg-gray-900"
            />
        </div>
    );
};

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
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeCourse = COURSES.find(c => c.id === activeCourseId);

    // --- UI ---

    return (
        <Layout classWrapper="flex flex-col items-center bg-white" hidePanelMessage={true}>
            <div className="w-full max-w-[1000px] pt-12 pb-48 px-6 font-manrope">

                {/* Header Section - Clean & Focused */}
                <header className="mb-16 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Study Lab</h1>
                        <p className="text-lg text-gray-500 font-medium">Configure your perfect learning session.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search courses..."
                                className="pl-10 pr-12 py-2.5 bg-gray-50 border border-transparent rounded-2xl text-sm outline-none focus:ring-2 focus:ring-gray-900/5 focus:bg-white focus:border-gray-200 transition-all w-full lg:w-64 font-medium"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 border border-gray-100 px-1.5 py-0.5 rounded bg-white">
                                ⌘K
                            </div>
                        </div>
                        <Button variant="outline" size="icon" className="rounded-2xl border-gray-100 w-11 h-11">
                            <Filter className="w-4 h-4 text-gray-500" />
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Course Selection Area */}
                    <div className="lg:col-span-12 space-y-12">

                        {/* Courses Grid */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 inline-flex items-center gap-2">
                                    <Layers className="w-5 h-5" />
                                    Your Courses
                                </h2>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{filteredCourses.length} available</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredCourses.map(course => {
                                    const isSelected = course.modules.length > 0 && course.modules.every(m => selectedModules.includes(m.id));
                                    const partialSelected = course.modules.some(m => selectedModules.includes(m.id)) && !isSelected;
                                    const isActive = activeCourseId === course.id;

                                    return (
                                        <motion.div
                                            key={course.id}
                                            whileHover={{ y: -4 }}
                                            onClick={() => setActiveCourseId(course.id)}
                                            className={cn(
                                                "group relative p-6 rounded-[24px] border transition-all cursor-pointer",
                                                isActive
                                                    ? "border-gray-900 bg-gray-900 text-white ring-4 ring-gray-900/5"
                                                    : "border-gray-100 bg-white hover:border-gray-300 shadow-sm"
                                            )}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                                                    isActive ? "bg-white/10" : "bg-gray-50 group-hover:bg-gray-100"
                                                )}>
                                                    <Folder className={cn("w-6 h-6", isActive ? "text-white" : "text-gray-900")} />
                                                </div>

                                                <div
                                                    onClick={(e) => { e.stopPropagation(); toggleCourse(course.id); }}
                                                    className={cn(
                                                        "w-6 h-6 rounded-full border flex items-center justify-center transition-all",
                                                        isSelected
                                                            ? "bg-primary-200 border-primary-200"
                                                            : partialSelected
                                                                ? "bg-primary-200/20 border-primary-200"
                                                                : isActive ? "border-white/30" : "border-gray-200"
                                                    )}
                                                >
                                                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                                    {partialSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary-200" />}
                                                </div>
                                            </div>

                                            <h3 className="font-bold text-lg leading-tight mb-2">{course.title}</h3>
                                            <div className={cn(
                                                "flex items-center gap-3 text-xs font-bold uppercase tracking-wider",
                                                isActive ? "text-white/60" : "text-gray-400"
                                            )}>
                                                <span>{course.modulesCount} Modules</span>
                                                <span className="opacity-30">•</span>
                                                <span>{course.updated}</span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Modules Selection (Based on Active Course) */}
                        <AnimatePresence mode="wait">
                            {activeCourse && (
                                <motion.section
                                    key={activeCourse.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="pt-8"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 text-left">Modules in {activeCourse.title}</h2>
                                            <p className="text-sm text-gray-500 mt-1">Select specific modules to focus your session.</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleCourse(activeCourse.id)}
                                            className="font-bold text-xs uppercase tracking-widest text-primary-200 hover:text-primary-300"
                                        >
                                            {activeCourse.modules.every(m => selectedModules.includes(m.id)) ? "Deselect All" : "Select Global"}
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
                                        {activeCourse.modules.length > 0 ? (
                                            activeCourse.modules.map(module => {
                                                const isSelected = selectedModules.includes(module.id);
                                                return (
                                                    <Label
                                                        key={module.id}
                                                        htmlFor={module.id}
                                                        className={cn(
                                                            "flex items-center gap-4 p-5 rounded-3xl border transition-all cursor-pointer font-normal group",
                                                            isSelected
                                                                ? "border-gray-900 bg-gray-50"
                                                                : "border-gray-100 bg-white hover:border-gray-300"
                                                        )}
                                                    >
                                                        <Checkbox
                                                            id={module.id}
                                                            checked={isSelected}
                                                            onCheckedChange={() => toggleModule(module.id)}
                                                            className="w-5 h-5 rounded-lg"
                                                        />
                                                        <div className="flex-grow">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <span className="text-base font-bold text-gray-900 group-hover:text-primary-200 transition-colors">
                                                                    {module.title}
                                                                </span>
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 py-1 px-2 bg-gray-100 rounded-lg">
                                                                    {module.duration} MINS
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-500">
                                                                {module.topics} core topics to master
                                                            </p>
                                                        </div>
                                                        <ChevronRight className={cn("w-5 h-5 transition-colors", isSelected ? "text-gray-900" : "text-gray-200")} />
                                                    </Label>
                                                );
                                            })
                                        ) : (
                                            <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[32px] text-gray-400">
                                                <Folder className="w-12 h-12 mb-4 opacity-20" />
                                                <p className="font-bold">No modules available yet</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.section>
                            )}
                        </AnimatePresence>

                        {/* Configuration & AI */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12">

                            {/* Flashcard Config */}
                            <div className="space-y-4">
                                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6 px-1">Configuration</h2>
                                <Item variant="outline" className="rounded-[32px] border-none bg-gray-50 p-6 flex-col items-stretch text-left group">
                                    <div className="flex items-center justify-between mb-8">
                                        <ItemContent>
                                            <ItemTitle className="text-xl">Flashcard Count</ItemTitle>
                                            <ItemDescription className="text-base">Quantity for this session</ItemDescription>
                                        </ItemContent>

                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button className="w-16 h-16 rounded-[20px] bg-gray-900 text-white shadow-xl shadow-gray-900/20 hover:scale-105 transition-transform flex flex-col items-center justify-center p-0">
                                                    <span className="text-lg font-black leading-none">{flashcardCount}</span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Cards</span>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-72 p-6 rounded-[32px] border-gray-200 shadow-2xl" align="end">
                                                <div className="space-y-6">
                                                    <div className="flex justify-between items-center text-gray-900">
                                                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Range</span>
                                                        <span className="text-sm font-black">{flashcardCount} cards</span>
                                                    </div>
                                                    <Slider
                                                        defaultValue={[flashcardCount]}
                                                        max={100}
                                                        min={5}
                                                        step={5}
                                                        onValueChange={(val) => setFlashcardCount(val[0])}
                                                        className="py-4"
                                                    />
                                                    <div className="flex justify-between text-[10px] font-black text-gray-300">
                                                        <span>MIN 5</span>
                                                        <span>MAX 100</span>
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200/50 flex items-center justify-between">
                                        <span className="text-xs font-bold text-gray-400 uppercase">Selected modules</span>
                                        <div className="flex -space-x-2">
                                            {selectedItems.slice(0, 3).map((item, i) => (
                                                <div key={item.id} className="w-8 h-8 rounded-full bg-white border-2 border-gray-50 flex items-center justify-center text-[10px] font-black text-gray-900 shadow-sm">
                                                    {item.title.charAt(0)}
                                                </div>
                                            ))}
                                            {selectedItems.length > 3 && (
                                                <div className="w-8 h-8 rounded-full bg-gray-900 border-2 border-gray-50 flex items-center justify-center text-[10px] font-black text-white shadow-sm">
                                                    +{selectedItems.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Item>
                            </div>

                            {/* AI Intelligence */}
                            <div className="space-y-4">
                                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6 px-1">Intelligence</h2>
                                <div className="bg-primary-200 text-white p-6 rounded-[32px] relative overflow-hidden group h-full flex flex-col justify-between min-h-[220px]">
                                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform duration-700">
                                        <Sparkles className="w-32 h-32" />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                                <Sparkles className="w-5 h-5 text-white" />
                                            </div>
                                            <h4 className="font-bold text-lg">Smart Insights</h4>
                                        </div>
                                        <p className="text-sm font-medium text-white/90 leading-relaxed max-w-[80%]">
                                            We noticed you might benefit from <br /><span className="bg-white/10 px-1 py-0.5 rounded">Neural Networks</span> to strengthen your session.
                                        </p>
                                    </div>

                                    <Button
                                        variant="link"
                                        onClick={() => toggleModule("mod-3")}
                                        className="text-white p-0 h-auto hover:underline font-black uppercase text-[11px] tracking-widest relative z-10 w-fit"
                                    >
                                        Add Recommendation
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Floating Action Bar */}
            <AnimatePresence>
                {selectedModules.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-[600px] z-[100]"
                    >
                        <div className="bg-gray-900 rounded-[32px] p-4 flex items-center justify-between shadow-2xl border border-white/10 backdrop-blur-xl">
                            <div className="flex items-center gap-4 pl-4">
                                <div className="flex flex-col">
                                    <span className="text-white text-lg font-black leading-none">{selectedModules.length} Modules</span>
                                    <span className="text-white/40 text-xs font-bold uppercase tracking-wider mt-1">~{totalDuration} mins est.</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => setSelectedModules([])}
                                    className="text-white/60 hover:text-white hover:bg-white/5 rounded-2xl h-14 font-bold px-6"
                                >
                                    Reset
                                </Button>
                                <Link href="/study-lab/flashcards">
                                    <Button size="lg" className="bg-white text-gray-900 rounded-[22px] h-14 font-black shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all px-8">
                                        Generate Session
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default StudyLabSelection;
