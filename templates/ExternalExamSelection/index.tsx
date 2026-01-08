"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { Search, Calendar, FileText } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Tab categories for exam types
const examTabs = [
    { id: "national", name: "National Exams" },
    { id: "abroad", name: "Study Abroad" },
    { id: "professional", name: "Professional & Career" },
    { id: "foundation", name: "Foundation & Junior Levels" },
    { id: "medical", name: "Medical & Legal Entry" },
];

// Version for cache busting images - increment this when you update logos
const IMAGE_VERSION = "v2";

// Exam data organized by category
const examsByCategory: Record<string, Array<{
    id: string;
    title: string;
    description: string;
    years: number;
    questions: string;
    logo: string;
}>> = {
    national: [
        {
            id: "wassce",
            title: "WASSCE (WAEC)",
            description: "West African Senior School Certificate Examination. Covering Science, Arts, and Commercial subjects.",
            years: 17,
            questions: "20,000 past questions",
            logo: "/images/exams/waec-logo.png",
        },
        {
            id: "neco",
            title: "NECO (SSCE)",
            description: "National Examinations Council. Standard Nigerian senior secondary school certificate exams.",
            years: 17,
            questions: "20,000 past questions",
            logo: "/images/exams/neco-logo.png",
        },
        {
            id: "jamb",
            title: "JAMB (UTME)",
            description: "Joint Admissions and Matriculation Board. Unified Tertiary Matriculation Examination for university entry.",
            years: 17,
            questions: "20,000 past questions",
            logo: "/images/exams/jamb-logo.png",
        },
        {
            id: "jupeb",
            title: "JUPEB",
            description: "Joint Universities Preliminary Examinations Board. Covering Science, Arts, and Commercial subjects.",
            years: 17,
            questions: "20,000 past questions",
            logo: "/images/exams/jupeb-logo.png",
        },
        {
            id: "nabteb",
            title: "NABTEB",
            description: "National Business and Technical Examinations Board",
            years: 17,
            questions: "20,000 past questions",
            logo: "/images/exams/nabteb-logo.png",
        },
        {
            id: "post-utme",
            title: "Post-UTME",
            description: "University Screening Assessments. Covering Science, Arts, and Commercial subjects.",
            years: 17,
            questions: "20,000 past questions",
            logo: "/images/exams/post-utme-logo.png",
        },
    ],
    abroad: [
        {
            id: "sat",
            title: "SAT",
            description: "College Board Undergraduate Admission. A standardized test widely used for college admissions in the United States and other international institutions.",
            years: 10,
            questions: "15,000 past questions",
            logo: "/images/exams/sat-logo.png",
        },
        {
            id: "ielts",
            title: "IELTS",
            description: "International English Language Testing System. The world's most popular English language proficiency test for higher education and global migration.",
            years: 12,
            questions: "18,000 past questions",
            logo: "/images/exams/ielts-logo.png",
        },
        {
            id: "a-levels",
            title: "Cambridge A-Levels",
            description: "Advanced Level General Certificate. A rigorous international qualification recognized by top-tier universities worldwide for subject-specific mastery.",
            years: 15,
            questions: "25,000 past questions",
            logo: "/images/exams/a-levels-logo.png",
        },
        {
            id: "toefl",
            title: "TOEFL",
            description: "Test of English as a Foreign Language. A standardized test to measure the English language ability of non-native speakers.",
            years: 12,
            questions: "16,000 past questions",
            logo: "/images/exams/toefl-logo.png",
        },
        {
            id: "gre",
            title: "GRE",
            description: "Graduate Record Examinations. A standardized test required for admission to various graduate schools and business programs globally.",
            years: 10,
            questions: "12,000 past questions",
            logo: "/images/exams/gre-logo.png",
        },
        {
            id: "gmat",
            title: "GMAT",
            description: "Graduate Management Admission Test. A computer-adaptive test intended to assess certain analytical, writing, and quantitative skills for business school entry.",
            years: 10,
            questions: "10,000 past questions",
            logo: "/images/exams/gmat-logo.png",
        },
    ],
    professional: [
        {
            id: "ican-acca",
            title: "ICAN / ACCA",
            description: "Professional Accounting Certifications. Comprehensive examinations for aspiring accountants aiming for chartered status in Nigeria or internationally.",
            years: 12,
            questions: "15,000 past questions",
            logo: "/images/exams/ican-logo.png",
        },
        {
            id: "nclex",
            title: "NCLEX",
            description: "Nursing and Midwifery Licensing. The National Council Licensure Examination for candidates seeking registration and practice as professional nurses.",
            years: 10,
            questions: "12,000 past questions",
            logo: "/images/exams/nclex-logo.png",
        },
        {
            id: "trcn",
            title: "TRCN",
            description: "Professional Teaching Qualifications. The mandatory qualifying examination conducted by the Teachers Registration Council of Nigeria for professional educators.",
            years: 8,
            questions: "8,000 past questions",
            logo: "/images/exams/trcn-logo.png",
        },
        {
            id: "pmp",
            title: "PMP",
            description: "Project Management Professional. A globally recognized certification for project managers, covering methodologies, leadership, and business environments.",
            years: 10,
            questions: "10,000 past questions",
            logo: "/images/exams/pmp-logo.png",
        },
        {
            id: "cfa",
            title: "CFA",
            description: "Chartered Financial Analyst. A professional credential for investment and financial professionals, focusing on portfolio management and ethics.",
            years: 12,
            questions: "14,000 past questions",
            logo: "/images/exams/cfa-logo.png",
        },
        {
            id: "law-school",
            title: "Law School",
            description: "Bar Final Examinations. The vocational training assessments for law graduates seeking admission to the Nigerian Bar and legal practice.",
            years: 15,
            questions: "18,000 past questions",
            logo: "/images/exams/law-school-logo.png",
        },
    ],
    foundation: [
        {
            id: "bece",
            title: "BECE",
            description: "Basic Education Certificate Examination. The formal transition exam taken at the end of Junior Secondary School (JSS3) to qualify for Senior Secondary.",
            years: 15,
            questions: "12,000 past questions",
            logo: "/images/exams/bece-logo.png",
        },
        {
            id: "common-entrance",
            title: "Common Entrance",
            description: "Primary School Exit & College Entrance. Competitive placement tests for primary school pupils entering Federal and State-owned secondary schools.",
            years: 20,
            questions: "15,000 past questions",
            logo: "/images/exams/common-entrance-logo.png",
        },
        {
            id: "checkpoint",
            title: "Checkpoint",
            description: "Cambridge Lower Secondary Exams. Diagnostic tests used to assess the learning progress of students at the end of the lower secondary phase.",
            years: 10,
            questions: "8,000 past questions",
            logo: "/images/exams/checkpoint-logo.png",
        },
        {
            id: "scholarship",
            title: "Scholarship Tests",
            description: "Secondary School Merit-based Assessments. Competitive aptitude tests used by top private schools and foundations to award academic financial aid.",
            years: 12,
            questions: "10,000 past questions",
            logo: "/images/exams/scholarship-logo.png",
        },
        {
            id: "math-olympiad",
            title: "Math Olympiad",
            description: "Competitive Mathematics Assessments. Problem-solving competitions designed to identify and nurture exceptional mathematical talent in students.",
            years: 15,
            questions: "6,000 past questions",
            logo: "/images/exams/olympiad-logo.png",
        },
        {
            id: "entrance-screening",
            title: "Entrance Screening",
            description: "Model College & Private School Entrances. Specific screening exercises for students seeking admission into elite Model Colleges and private institutions.",
            years: 10,
            questions: "9,000 past questions",
            logo: "/images/exams/entrance-logo.png",
        },
    ],
    medical: [
        {
            id: "mcat",
            title: "MCAT",
            description: "Medical College Admission Test. A standardized, multiple-choice examination for prospective medical students in the US, Canada, and Australia.",
            years: 12,
            questions: "14,000 past questions",
            logo: "/images/exams/mcat-logo.png",
        },
        {
            id: "lsat",
            title: "LSAT",
            description: "Law School Admission Test. An assessment of reading comprehension and logical reasoning skills for candidates applying to law schools.",
            years: 12,
            questions: "12,000 past questions",
            logo: "/images/exams/lsat-logo.png",
        },
        {
            id: "bmat-ucat",
            title: "BMAT / UCAT",
            description: "Medical & Dental School Admissions. Specialised admissions tests used by universities in the UK and elsewhere to select candidates for medical and dental degrees.",
            years: 10,
            questions: "10,000 past questions",
            logo: "/images/exams/bmat-logo.png",
        },
        {
            id: "plab",
            title: "PLAB",
            description: "International Medical Licensing. The Professional and Linguistic Assessments Board test for international doctors wanting to practice medicine in the United Kingdom.",
            years: 15,
            questions: "8,000 past questions",
            logo: "/images/exams/plab-logo.png",
        },
        {
            id: "nda",
            title: "NDA",
            description: "Nigerian Defence Academy Entrance. Competitive military and academic assessments for candidates seeking admission into the Nigerian Armed Forces training academy.",
            years: 20,
            questions: "12,000 past questions",
            logo: "/images/exams/nda-logo.png",
        },
        {
            id: "civil-service",
            title: "Civil Service",
            description: "Public Sector Aptitude Tests. Examinations conducted for recruitment into various ministries, departments, and agencies of the government.",
            years: 15,
            questions: "18,000 past questions",
            logo: "/images/exams/civil-service-logo.png",
        },
    ],
};

// Category descriptions
const categoryDescriptions: Record<string, string> = {
    national: "Standard Nigerian secondary and tertiary entrance examinations.",
    abroad: "International tests for English proficiency and global university admissions.",
    professional: "Certification mocks for specialized career paths and licensing.",
    foundation: "Primary and junior secondary level assessments and entrance exams.",
    medical: "Medical, legal, and specialized institutional entrance examinations.",
};

const ExternalExamSelection = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("national");
    const [searchQuery, setSearchQuery] = useState("");

    // Auto-switch tab if search result is in another category
    useEffect(() => {
        if (!searchQuery) return;

        // Check if current active tab has results
        const currentExams = examsByCategory[activeTab] || [];
        const currentHasResults = currentExams.some(exam =>
            exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exam.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (currentHasResults) return;

        // If not, search other tabs
        const tabIds = Object.keys(examsByCategory);
        for (const tabId of tabIds) {
            if (tabId === activeTab) continue;

            const hasResults = examsByCategory[tabId]?.some(exam =>
                exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                exam.description.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (hasResults) {
                setActiveTab(tabId);
                break;
            }
        }
    }, [searchQuery, activeTab]);

    // Get exams for current tab and filter by search
    const currentExams = examsByCategory[activeTab] || [];
    const filteredExams = currentExams.filter(exam =>
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout hidePanelMessage>
            <div className="flex flex-col gap-6 max-md:pt-12">
                {/* Page Header */}
                <div className="flex items-start justify-between max-md:flex-col max-md:gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[20px] font-medium text-[#383838] tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Exam Practice Center
                        </h1>
                        <p className="text-[#717784] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Practice for your upcoming exams with timed simulations and AI-powered performance reviews.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center gap-4 max-md:w-full">
                        <div className="relative max-md:flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-12 py-2 bg-white border border-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-100 transition-all w-52 max-md:w-full"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-gray-400 border border-gray-100 px-1 rounded max-md:hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
                                ⌘K
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="relative">
                    <div className="flex items-center gap-8 border-b border-gray-100 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth">
                        {examTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "pb-3 text-sm font-medium transition-all relative shrink-0",
                                    activeTab === tab.id
                                        ? "text-[#383838]"
                                        : "text-[#717784] hover:text-[#383838]"
                                )}
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                                {tab.name}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#383838] rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category Description */}
                <p
                    className="text-[#717784] text-[12px] -mt-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    {categoryDescriptions[activeTab]}
                </p>

                {/* Exam Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredExams.map((exam) => (
                        <div
                            key={exam.id}
                            onClick={() => router.push(`/external-exam/onboarding?exam=${exam.id}&title=${encodeURIComponent(exam.title)}`)}
                            className="cursor-pointer hover:shadow-md transition-all"
                            style={{
                                backgroundColor: "#FFFFFF",
                                border: "1.5px solid #E1E4EA",
                                borderRadius: "15px",
                                padding: "6px",
                            }}
                        >
                            <div
                                className="flex items-center justify-between"
                                style={{
                                    backgroundColor: "#F5F5F5",
                                    borderRadius: "12px",
                                    padding: "18px",
                                    minHeight: "157px",
                                }}
                            >
                                <div className="flex flex-col" style={{ flex: 1, maxWidth: "280px" }}>
                                    <h3
                                        className="text-[#383838]"
                                        style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "15px",
                                            fontWeight: 500,
                                            marginBottom: "9px",
                                        }}
                                    >
                                        {exam.title}
                                    </h3>

                                    <p
                                        style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "12px",
                                            fontWeight: 400,
                                            color: "#717784",
                                            lineHeight: "1.5",
                                            marginBottom: "9px",
                                        }}
                                    >
                                        {exam.description}
                                    </p>

                                    <div
                                        style={{
                                            height: "1px",
                                            backgroundColor: "#E1E4EA",
                                            marginBottom: "9px",
                                            width: "100%",
                                        }}
                                    />

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={12} className="text-[#717784]" />
                                            <span
                                                style={{
                                                    fontFamily: "'Inter', sans-serif",
                                                    fontSize: "12px",
                                                    fontWeight: 400,
                                                    color: "#717784",
                                                }}
                                            >
                                                {exam.years} years
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <FileText size={12} className="text-[#717784]" />
                                            <span
                                                style={{
                                                    fontFamily: "'Inter', sans-serif",
                                                    fontSize: "12px",
                                                    fontWeight: 400,
                                                    color: "#717784",
                                                }}
                                            >
                                                {exam.questions}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-[80px] h-[80px] flex items-center justify-center shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={`${exam.logo}?${IMAGE_VERSION}`}
                                        alt={`${exam.title} logo`}
                                        width={80}
                                        height={80}
                                        className="object-contain w-[80px] h-[80px]"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty state when no results */}
                {filteredExams.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-4">
                            <Search size={24} className="text-[#717784]" />
                        </div>
                        <h3 className="text-[15px] font-medium text-[#383838] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                            No exams found
                        </h3>
                        <p className="text-[12px] text-[#717784]" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Try adjusting your search query.
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ExternalExamSelection;
