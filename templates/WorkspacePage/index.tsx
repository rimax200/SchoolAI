"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import {
    Search,
    ChevronDown,
    Layers,
    Share2,
} from "lucide-react";
import Image from "@/components/Image";

const categories = [
    { id: "all", name: "All Assets" },
    { id: "summaries", name: "Summaries" },
    { id: "flashcards", name: "Flashcards" },
    { id: "exams", name: "Mock exams" },
    { id: "outlines", name: "Essay Outlines" },
];

const workspaceData = [
    {
        category: "Biology 101",
        items: [
            {
                id: 1,
                title: "High-Yield: Mitosis & Cell Division",
                description: "42 active-recall cards focusing on the 5 stages of mitosis and key technical terms likely to appear on your exam.",
                type: "Flashcards",
                lastPracticed: "12 hours ago",
                icon: "/images/mentor/flashcards01.png"
            },
            {
                id: 2,
                title: "Biology Unit 1: Full Practice Test",
                description: "A simulated exam covering Chapters 1-4. Includes a mix of MCQs and short answers based strictly on your uploaded lecture notes.",
                type: "Summary",
                lastPracticed: "yesterday",
                icon: "/images/mentor/Summary.png"
            },
            {
                id: 3,
                title: "Ethics of Genetic Engineering Outline",
                description: "A structured essay framework with suggested evidence and quotes sourced from your \"Bioethics Seminar\" reading list.",
                type: "Essay Outlines",
                lastPracticed: "3 days ago",
                icon: "/images/mentor/Essay.png"
            }
        ]
    },
    {
        category: "Chem 101",
        items: [
            {
                id: 4,
                title: "Molecular Bonding Foundations",
                description: "Deep dive into covalent and ionic bonding patterns with interactive 3D model summaries.",
                type: "Mock exams",
                lastPracticed: "12 hours ago",
                icon: "/images/mentor/mockexam.png"
            },
            {
                id: 5,
                title: "Stoichiometry Outline",
                description: "Step-by-step calculation framework for balancing chemical equations and molar conversions.",
                type: "Essay Outlines",
                lastPracticed: "3 days ago",
                icon: "/images/mentor/Essay.png"
            },
            {
                id: 6,
                title: "Organic Chemistry Nomenclature",
                description: "A comprehensive guide to naming alkanes, alkenes, and aromatic compounds.",
                type: "Summary",
                lastPracticed: "yesterday",
                icon: "/images/mentor/Summary.png"
            }
        ]
    },
    {
        category: "Math 101",
        items: [
            {
                id: 7,
                title: "Calculus: Derivative Rules",
                description: "Master the chain rule, product rule, and quotient rule with guided practice examples.",
                type: "Summary",
                lastPracticed: "yesterday",
                icon: "/images/mentor/Summary.png"
            },
            {
                id: 8,
                title: "Linear Algebra Fundamentals",
                description: "Explaining vector spaces, matrices, and linear transformations in simple terms.",
                type: "Essay Outlines",
                lastPracticed: "3 days ago",
                icon: "/images/mentor/Essay.png"
            },
            {
                id: 9,
                title: "Trigonometry Flash Set",
                description: "Active recall cards for sine, cosine, and tangent identities across all four quadrants.",
                type: "Flashcards",
                lastPracticed: "12 hours ago",
                icon: "/images/mentor/flashcards01.png"
            }
        ]
    },
    {
        category: "Physics 101",
        items: [
            {
                id: 10,
                title: "Newtonian Mechanics Guide",
                description: "Key principles of force, mass, and acceleration as applied to real-world scenarios.",
                type: "Flashcards",
                lastPracticed: "12 hours ago",
                icon: "/images/mentor/flashcards01.png"
            },
            {
                id: 11,
                title: "Thermodynamics Practice Set",
                description: "Practice problems focusing on heat transfer, entropy, and the laws of thermodynamics.",
                type: "Summary",
                lastPracticed: "yesterday",
                icon: "/images/mentor/Summary.png"
            },
            {
                id: 12,
                title: "Quantum Physics Introduction",
                description: "Conceptual framework for wave-particle duality and the uncertainty principle.",
                type: "Essay Outlines",
                lastPracticed: "3 days ago",
                icon: "/images/mentor/Essay.png"
            }
        ]
    },
    {
        category: "Psychology 101",
        items: [
            {
                id: 13,
                title: "Cognitive Development Stages",
                description: "Piaget's stages explained with case study references and key definition cards.",
                type: "Summary",
                lastPracticed: "2 days ago",
                icon: "/images/mentor/Summary.png"
            },
            {
                id: 14,
                title: "Behavioral Analysis Outline",
                description: "Framework for understanding classical and operant conditioning through behavioral study models.",
                type: "Essay Outlines",
                lastPracticed: "4 days ago",
                icon: "/images/mentor/Essay.png"
            }
        ]
    }
];

const WorkspacePage = () => {
    const [activeTab, setActiveTab] = useState("all");

    const filteredData = workspaceData.map(section => ({
        ...section,
        items: section.items.filter(item => {
            if (activeTab === "all") return true;
            const typeMap: { [key: string]: string } = {
                summaries: "Summary",
                flashcards: "Flashcards",
                exams: "Mock exams",
                outlines: "Essay Outlines"
            };
            return item.type === typeMap[activeTab];
        })
    })).filter(section => section.items.length > 0);

    return (
        <Layout hidePanelMessage>
            <div className="flex flex-col gap-6 max-md:pt-12">
                <div className="flex flex-col gap-6">
                    {/* Page Header Area */}
                    <div className="flex items-start justify-between max-md:flex-col max-md:gap-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-[20px] font-medium text-[#383838] tracking-tight font-sans">Workspace</h1>
                            <p className="text-gray-500 text-sm font-sans">
                                Track your previous study guides, practice cards, and exam readiness in one organized place.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 max-md:w-full">
                            <div className="relative max-md:flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="pl-9 pr-12 py-2 bg-white border border-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-100/50 transition-all w-52 max-md:w-full font-sans"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-gray-400 border border-gray-100 px-1 rounded font-sans max-md:hidden">
                                    ⌘K
                                </div>
                            </div>
                            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-25 transition-colors shadow-sm font-sans">
                                <Layers className="w-4 h-4 text-gray-500" />
                                <span className="max-md:hidden">Courses</span>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Tabs Area */}
                    <div className="relative">
                        <div className="flex items-center gap-8 border-b border-gray-100 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`pb-3 text-sm font-medium transition-all relative font-sans shrink-0 ${activeTab === cat.id
                                        ? "text-primary-200"
                                        : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    {cat.name}
                                    {activeTab === cat.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-200 rounded-t-full" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="flex flex-col gap-10 mt-4">
                        {filteredData.map((section) => (
                            <div key={section.category} className="flex flex-col gap-5">
                                <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                                    <h2 className="text-[20px] font-medium text-[#383838] font-sans">{section.category}</h2>
                                    <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors font-sans">
                                        Show all
                                    </button>
                                </div>
                                <div className="flex gap-6 overflow-x-auto no-scrollbar pb-2 md:grid md:grid-cols-3 2xl:grid-cols-3">
                                    {section.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="group flex flex-col p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer min-w-[300px] max-md:min-w-[260px] max-md:p-5"
                                        >
                                            <div className="flex flex-col gap-2.5">
                                                <h3 className="text-[16px] font-medium text-[#000000] leading-snug font-sans truncate">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-500 text-[13px] line-clamp-3 leading-relaxed font-sans font-normal h-[60px]">
                                                    {item.description}
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-3 mt-auto pt-8 max-md:pt-6">
                                                <div className="text-gray-400 text-[12px] italic font-sans whitespace-nowrap">
                                                    Last practiced {item.lastPracticed}
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1.5 border border-[#EEEEEE] rounded-lg w-fit transition-colors group-hover:bg-gray-25">
                                                    <Image
                                                        src={item.icon}
                                                        width={16}
                                                        height={16}
                                                        alt=""
                                                        className="w-4 h-4 opacity-100 object-contain"
                                                    />
                                                    <span className="text-[12px] font-medium text-[#010101] font-[Manrope]">
                                                        {item.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
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

export default WorkspacePage;
