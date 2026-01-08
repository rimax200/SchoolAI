"use client";

import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import { ArrowRight, Search, Filter, Play } from "lucide-react";

const NewHome = () => {
    return (
        <Layout hidePanelMessage fullWidth>
            <div className="flex flex-col gap-[30px] w-full p-5 pb-32">

                {/* Banner */}
                <div
                    className="w-full bg-white border border-[#EAEAEA] border-l-[4px] border-l-[#35966A] rounded-[12px] p-4 flex items-center justify-between relative overflow-hidden"
                    style={{ minHeight: "160px" }}
                >
                    <div className="flex flex-col gap-4 z-10 relative max-w-[600px]">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-[#1a1a1a] font-bold" style={{ fontFamily: "'Inter Display', sans-serif", fontSize: "18px" }}>
                                One step at a time Maxwell.
                            </h1>
                            <p className="text-[#4A5567]" style={{ fontFamily: "'Inter Display', sans-serif", fontSize: "14px" }}>
                                Don't worry about the entire syllabus today. Just focus on one chapter. Progress is progress, no matter how small it feels.
                            </p>
                        </div>
                        <button
                            className="w-fit border border-[#CDD5E0] rounded-[8px] bg-white text-[#1a1a1a] font-medium transition-all hover:bg-gray-50 flex items-center justify-center shadow-[inset_0_-1px_1px_rgba(0,0,0,0.05)]"
                            style={{ padding: "8px 16px", fontSize: "14px", boxShadow: "inset 0 -2px 0 0 #F2F2F2" }}
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Banner Image - Doodle */}
                    <div className="absolute right-0 top-0 bottom-0 w-[200px] md:w-[300px] flex items-center justify-end pr-8">
                        <Image
                            src="/images/success.png"
                            alt="Progress Doodle"
                            width={150}
                            height={120}
                            className="object-contain opacity-90"
                        />
                    </div>
                </div>

                {/* Section: My Learning Journey */}
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[#1a1a1a]" style={{ fontFamily: "'Inter Display', sans-serif", fontSize: "24px", fontWeight: 500 }}>
                            My Learning Journey
                        </h2>
                        <Link href="/courses" className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] hover:opacity-70">
                            See All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    {/* Grid */}
                    <div className="flex overflow-x-auto pb-4 gap-4 -mx-5 px-5 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-4">
                        {[
                            { title: "Mathematics", icon: "/images/home-icons/pi-math-card.png", bg: "/images/home-icons/math-bg.svg", desc: "Explore innovations shaping tomorrow's infrastructure and technology.", progress: 80, color: "orange" },
                            { title: "English Language", icon: "/images/home-icons/a-english-card.png", bg: "/images/home-icons/english-bg.png", desc: "Access research, journals, and books driving healthcare advancement.", progress: 80, color: "red" },
                            { title: "Physics", icon: "/images/home-icons/atom-physics-card.png", bg: "/images/home-icons/physics-bg.png", desc: "Gain insights on business strategy, finance, and organizational leadership.", progress: 60, color: "blue" },
                            { title: "Chemistry", icon: "/images/home-icons/au-chemistry-card.png", bg: "/images/home-icons/chemistry-bg.png", desc: "Study legal systems, human rights, and landmark judicial perspectives.", progress: 40, color: "purple" }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="min-w-[260px] md:min-w-0 shrink-0 bg-white border border-[#EAEAEA] rounded-[12px] overflow-hidden relative group cursor-pointer hover:shadow-sm transition-all"
                                style={{ height: "170px" }}
                            >
                                {/* Background Pattern */}
                                <div className="absolute inset-0 z-0">
                                    <Image src={item.bg} alt="" fill className="object-cover" />
                                </div>

                                <div className="relative z-10 p-5 flex flex-col h-full justify-between">
                                    <div className="flex items-start gap-4">
                                        {/* Icon - SVG */}
                                        <img
                                            src={`${item.icon}?v=3`}
                                            alt={item.title}
                                            className="w-8 h-8 shrink-0 object-contain"
                                        />
                                        <h3 className="text-[#1a1a1a]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "20px", lineHeight: "1.2" }}>
                                            {item.title}
                                        </h3>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <p className="text-[#586162] line-clamp-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", lineHeight: "1.4" }}>
                                            {item.desc}
                                        </p>

                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex justify-between items-center text-[10px] uppercase font-medium tracking-wide">
                                                <span>Progress</span>
                                                <span>{item.progress}%</span>
                                            </div>
                                            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${item.progress}%`,
                                                        backgroundColor: item.color === 'orange' ? '#FF5722' : item.color === 'red' ? '#F44336' : item.color === 'blue' ? '#2196F3' : '#9C27B0'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section: Top Picks for You */}
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[#1a1a1a]" style={{ fontFamily: "'Inter Display', sans-serif", fontSize: "24px", fontWeight: 500 }}>
                            Top Picks for You
                        </h2>
                        <Link href="/library" className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] hover:opacity-70">
                            See All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    {/* Books Grid */}
                    <div className="flex overflow-x-auto pb-4 gap-4 -mx-5 px-5 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-4">
                        {[
                            { title: "Fluid Mechanics For Engineering", author: "Prof. Ifeanyi Enobong", progress: 80 },
                            { title: "Thermodynamics in Practice", author: "Engr. Dr. Charles U. Orji", progress: 75 },
                            { title: "Signals and Systems Analysis", author: "Robert B. Northrop", progress: 75 },
                            { title: "Structural Steel Design", author: "Engr. Dr. Charles U. Orji", progress: 40 },
                        ].map((book, idx) => (
                            <div
                                key={idx}
                                className="min-w-[260px] md:min-w-0 shrink-0 bg-white border border-[#EAEAEA] rounded-[12px] flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition-all"
                                style={{ padding: "40px 20px" }}
                            >
                                <div className="relative w-[160px] h-[220px] mb-[35px]">
                                    <Image
                                        src="/images/home-icons/Fluidmechanic-book.svg"
                                        alt={book.title}
                                        fill
                                        className="object-cover rounded-sm"
                                    />
                                </div>
                                <h3 className="text-[#1a1a1a]" style={{ fontFamily: "'Inter Display', sans-serif", fontSize: "17px", fontWeight: 500, lineHeight: "1.3", marginBottom: "5px" }}>
                                    {book.title}
                                </h3>
                                <p className="text-[#7F7F7F]" style={{ fontFamily: "'Inter Display', sans-serif", fontSize: "14px", fontWeight: 400 }}>
                                    {book.author}
                                </p>

                                <div className="w-full mt-6">
                                    <div className="flex justify-between items-center text-[10px] font-medium mb-1.5 uppercase tracking-wide text-gray-500">
                                        <span>Progress</span>
                                        <span>{book.progress}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#1a1a1a] rounded-full"
                                            style={{ width: `${book.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section: Curated Study Videos */}
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[#1a1a1a]" style={{ fontFamily: "'Inter Display', sans-serif", fontSize: "24px", fontWeight: 500 }}>
                            Curated Study Videos
                        </h2>
                        <Link href="/videos" className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] hover:opacity-70">
                            See All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="flex overflow-x-auto pb-4 gap-6 -mx-5 px-5 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-3">
                        {[1, 2, 3].map((v) => (
                            <div key={v} className="min-w-[300px] md:min-w-0 shrink-0 group cursor-pointer">
                                <div className="relative w-full aspect-video bg-black/5 rounded-[12px] overflow-hidden mb-3">
                                    <Image
                                        src="/images/preview-video.png"
                                        alt="Video Thumbnail"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-all">
                                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                                            <Play size={20} className="fill-black text-black ml-1" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-[10px] font-medium rounded">
                                        3:47
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                                        {/* Avatar placeholder */}
                                        <div className="w-full h-full bg-gray-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-[#1a1a1a] font-medium text-sm leading-tight mb-1 line-clamp-2">
                                            Algebra Basics: What is Algebra? - Math Antics
                                        </h3>
                                        <p className="text-gray-500 text-xs">Khan Acad • 2M views</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section: The Study Lab */}
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[#1a1a1a]" style={{ fontFamily: "'Inter Display', sans-serif", fontSize: "24px", fontWeight: 500 }}>
                            The Study Lab
                        </h2>
                        <Link href="/study-lab" className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] hover:opacity-70">
                            See All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="flex overflow-x-auto pb-4 gap-4 -mx-5 px-5 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-3">
                        {[
                            { title: "Quick Summary", desc: "Paste a long article or chapter to get the core ideas in 5 bullet points." },
                            { title: "Simplify Jargon", desc: "Explain complex theories or academic terms like I'm 10 years old." },
                            { title: "Essay Feedback", desc: "Paste your draft to find grammatical errors and get suggestions." }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="min-w-[260px] md:min-w-0 shrink-0 bg-[#FBFBFB] border border-[#EAEAEA] rounded-[12px] p-4 flex flex-col gap-2 hover:bg-white hover:shadow-sm transition-all cursor-pointer"
                            >
                                <h3 className="text-[#1a1a1a] font-medium text-[15px]">{item.title}</h3>
                                <p className="text-[#586162] text-xs leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default NewHome;
