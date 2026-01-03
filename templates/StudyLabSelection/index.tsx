"use client";

import { useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import {
    Search,
    Filter,
    ChevronDown,
    Folder,
    Clock,
    Sparkles,
    X,
    ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const courses = [
    {
        id: "psychology",
        title: "Introduction to Psychology",
        modulesCount: 3,
        updated: "2 days ago",
        modules: [
            { id: "mod-1", title: "Module 1: Cognitive Basics", topics: 24, duration: 15 },
            { id: "mod-2", title: "Module 2: Behavioral Patterns", topics: 18, duration: 12 },
            { id: "mod-3", title: "Module 3: Neural Networks", topics: 32, duration: 25 },
        ]
    },
    {
        id: "history",
        title: "European History: 1900-1950",
        modulesCount: 8,
        updated: "1 week ago",
        modules: []
    },
    {
        id: "chemistry",
        title: "Advanced Organic Chemistry",
        modulesCount: 12,
        updated: "yesterday",
        modules: []
    }
];

const StudyLabSelection = () => {
    const [selectedModules, setSelectedModules] = useState<string[]>(["mod-1", "mod-2"]);

    const toggleModule = (id: string) => {
        setSelectedModules(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    const clearSelection = () => setSelectedModules([]);

    const selectedItems = courses.flatMap(c => c.modules).filter(m => selectedModules.includes(m.id));
    const totalDuration = selectedItems.reduce((acc, m) => acc + m.duration, 0);
    const totalFlashcards = selectedItems.reduce((acc, m) => acc + m.topics * 2, 0);

    return (
        <Layout classWrapper="flex flex-col items-center" hidePanelMessage={true}>
            <div className="w-full max-w-[1200px] pt-8 pb-32 px-6 font-manrope">
                {/* Breadcrumbs */}
                <div className="mb-8">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/">Home</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/study-lab" className="cursor-default hover:text-gray-400">Study Lab</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Selection</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-grow">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Content</h1>
                                <p className="text-gray-500 font-manrope">Choose courses or modules for your session.</p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-gray-900 font-manrope">Step 1 of 3</div>
                                <div className="text-xs text-gray-500 font-manrope">Configuration next</div>
                            </div>
                        </div>

                        {/* Progress Bar (Manual styles for the top step progress) */}
                        <div className="w-full h-1 bg-gray-100 rounded-full mb-8 overflow-hidden">
                            <div className="w-1/3 h-full bg-primary-200"></div>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="relative max-md:flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="pl-9 pr-12 py-2 bg-white border border-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-100/50 transition-all w-52 max-md:w-full font-manrope"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-gray-400 border border-gray-100 px-1 rounded font-manrope max-md:hidden">
                                    ⌘K
                                </div>
                            </div>
                            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-25 transition-colors shadow-sm font-manrope">
                                <Filter className="w-4 h-4 text-gray-500" />
                                <span className="max-md:hidden">Filter</span>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-25 transition-colors shadow-sm font-manrope">
                                <ChevronDown className="w-4 h-4 text-gray-500 rotate-180" />
                                <span className="max-md:hidden">Sort</span>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>

                        {/* Course List using Accordion */}
                        <Accordion type="single" collapsible defaultValue="psychology" className="space-y-4">
                            {courses.map(course => (
                                <AccordionItem
                                    key={course.id}
                                    value={course.id}
                                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm px-5 border-b-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <Checkbox
                                            checked={course.modules.length > 0 && course.modules.every(m => selectedModules.includes(m.id))}
                                            onCheckedChange={(checked) => {
                                                const moduleIds = course.modules.map(m => m.id);
                                                if (checked) {
                                                    setSelectedModules(prev => Array.from(new Set([...prev, ...moduleIds])));
                                                } else {
                                                    setSelectedModules(prev => prev.filter(id => !moduleIds.includes(id)));
                                                }
                                            }}
                                        />
                                        <AccordionTrigger className="hover:no-underline flex-grow py-5">
                                            <div className="flex flex-col items-start text-left">
                                                <h3 className="font-bold text-gray-900">{course.title}</h3>
                                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1"><Folder className="w-3 h-3" /> {course.modulesCount} Modules</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated {course.updated}</span>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                    </div>

                                    {course.modules.length > 0 && (
                                        <AccordionContent className="pl-12 pb-5 space-y-3">
                                            {course.modules.map(module => (
                                                <div
                                                    key={module.id}
                                                    className="flex items-center gap-4 cursor-pointer group"
                                                    onClick={() => toggleModule(module.id)}
                                                >
                                                    <Checkbox
                                                        checked={selectedModules.includes(module.id)}
                                                        onCheckedChange={() => toggleModule(module.id)}
                                                    />
                                                    <div>
                                                        <div className="text-sm font-bold text-gray-900 group-hover:text-primary-200 transition-colors">
                                                            {module.title}
                                                        </div>
                                                        <div className="text-xs text-gray-500 leading-none mt-1">
                                                            {module.topics} Topics • {module.duration} mins
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </AccordionContent>
                                    )}
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-[320px] shrink-0 space-y-6">
                        {/* Quiz Scope */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-900">Quiz Scope</h3>
                                <button
                                    onClick={clearSelection}
                                    className="text-xs font-bold text-primary-200 hover:text-primary-300 font-manrope"
                                >
                                    Clear all
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Selected Items</span>
                                    <span className="font-bold text-gray-900">{selectedModules.length} Modules</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Est. Duration</span>
                                    <span className="font-bold text-gray-900">~{totalDuration} mins</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Flashcards</span>
                                    <span className="font-bold text-gray-900">{totalFlashcards} Cards</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {selectedItems.map(item => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-25 border border-gray-100 rounded-lg text-xs font-medium text-gray-700"
                                    >
                                        {item.title.split(":")[1]?.trim() || item.title}
                                        <X
                                            className="w-3 h-3 cursor-pointer hover:text-error-100"
                                            onClick={() => toggleModule(item.id)}
                                        />
                                    </div>
                                ))}
                            </div>

                            <Link href="/study-lab/flashcards" className="w-full block">
                                <Button variant="dark" className="w-full shadow-gray-900/25 font-manrope">
                                    Generate Flashcards
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>

                        {/* AI Suggestion */}
                        <div className="bg-gray-900 rounded-2xl p-6 text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles className="w-16 h-16" />
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-primary-25" />
                                <h4 className="font-bold">AI Suggestion</h4>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed mb-4">
                                Based on your recent mistakes, we recommend adding <span className="text-white font-bold">Module 3: Neural Networks</span> to this session.
                            </p>
                            <Button
                                variant="link"
                                onClick={() => toggleModule("mod-3")}
                                className="text-primary-25 p-0 h-auto hover:text-white transition-colors font-manrope"
                            >
                                Add to selection
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default StudyLabSelection;
