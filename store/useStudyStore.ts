"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SessionResult {
    totalCards: number;
    knownCount: number;
    unknownCount: number;
    hardTopics: string[];
    aiInsight: string;
    timestamp: number;
}

export interface ExamResult {
    id: string;
    date: string;
    score: number;
    totalQuestions: number;
    timeSpent: number;
    passed: boolean;
}

interface StudyStore {
    lastSession: SessionResult | null;
    examHistory: ExamResult[];
    setLastSession: (result: SessionResult) => void;
    clearLastSession: () => void;
    addExamResult: (result: ExamResult) => void;
}

export const useStudyStore = create<StudyStore>()(
    persist(
        (set) => ({
            lastSession: null,
            examHistory: [],
            setLastSession: (result) => set({ lastSession: result }),
            clearLastSession: () => set({ lastSession: null }),
            addExamResult: (result) => set((state) => ({
                examHistory: [result, ...state.examHistory]
            })),
        }),
        {
            name: "school-ai-study",
        }
    )
);
