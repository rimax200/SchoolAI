"use client";

import Layout from "@/components/Layout";
import { TrendingUp, Activity, AlertCircle, CheckCircle2 } from "lucide-react";

const KnowledgeMap = () => {
    const topics = [
        { name: "Photosynthesis", mastery: 85, status: "Green", trend: "+5%" },
        { name: "The Calvin Cycle", mastery: 20, status: "Red", trend: "-12%" },
        { name: "Mitochondria", mastery: 64, status: "Yellow", trend: "+2%" },
        { name: "Cellular Respiration", mastery: 72, status: "Green", trend: "+8%" },
    ];

    return (
        <Layout title="Knowledge Map">
            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Knowledge Map</h2>
                        <p className="text-gray-500 text-body-sm">Your diagnostic center. Analyze and bridge gaps.</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-body-sm font-semibold text-gray-900">
                        <TrendingUp size={16} className="text-emerald-500" />
                        84% Overall Mastery
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Activity size={20} className="text-teal-500" />
                                Mastery Heatmap
                            </h3>
                            <div className="space-y-6">
                                {topics.map((topic) => (
                                    <div key={topic.name}>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-body-sm font-semibold text-gray-700">{topic.name}</span>
                                            <span className={`text-body-xs font-bold ${topic.status === "Green" ? "text-emerald-500" :
                                                    topic.status === "Yellow" ? "text-amber-500" : "text-red-500"
                                                }`}>{topic.mastery}%</span>
                                        </div>
                                        <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${topic.status === "Green" ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" :
                                                        topic.status === "Yellow" ? "bg-amber-500" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                                                    }`}
                                                style={{ width: `${topic.mastery}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-linear-to-br from-gray-900 to-gray-800 rounded-[2rem] text-white overflow-hidden relative">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-2">Academic Coach AI</h3>
                                <p className="text-gray-300 text-body-sm mb-6 max-w-sm">
                                    I've detected a significant gap in your understanding of the <strong>Calvin Cycle</strong>.
                                    Would you like me to generate a personalized recovery guide?
                                </p>
                                <button className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-teal-500/20">
                                    Bridge the Gap
                                </button>
                            </div>
                            <div className="absolute top-1/2 right-12 -translate-y-1/2 scale-150 opacity-10">
                                <TrendingUp size={120} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm">
                            <h3 className="text-body-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <AlertCircle size={18} className="text-red-500" />
                                Priority Review
                            </h3>
                            <div className="space-y-3">
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                                    <h4 className="text-[10px] font-bold text-red-800 uppercase tracking-widest mb-1">Critical</h4>
                                    <p className="text-body-xs text-red-700 font-semibold mb-2">The Calvin Cycle (20%)</p>
                                    <p className="text-[10px] text-red-600">Failed 4/5 questions in Mock Exam yesterday.</p>
                                </div>
                                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                                    <h4 className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-1">Attention Required</h4>
                                    <p className="text-body-xs text-amber-700 font-semibold mb-2">Glycolysis (52%)</p>
                                    <p className="text-[10px] text-amber-600">Haven't reviewed this topic in 3 days.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm">
                            <h3 className="text-body-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-emerald-500" />
                                Recent Wins
                            </h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 p-3 bg-gray-25/50 rounded-xl">
                                    <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <p className="text-body-xs text-gray-700">Mastered <strong>Photosynthesis</strong> with 92% accurate recall.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default KnowledgeMap;
