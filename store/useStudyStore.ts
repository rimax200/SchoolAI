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

interface StudyStore {
    lastSession: SessionResult | null;
    setLastSession: (result: SessionResult) => void;
    clearLastSession: () => void;
}

export const useStudyStore = create<StudyStore>()(
    persist(
        (set) => ({
            lastSession: null,
            setLastSession: (result) => set({ lastSession: result }),
            clearLastSession: () => set({ lastSession: null }),
        }),
        {
            name: "school-ai-study",
        }
    )
);
