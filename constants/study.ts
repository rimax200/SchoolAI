import { LucideIcon } from "lucide-react";

export interface Module {
    id: string;
    title: string;
    topics: number;
    duration: number;
}

export interface Course {
    id: string;
    title: string;
    modulesCount: number;
    updated: string;
    modules: Module[];
    icon?: LucideIcon;
    description?: string;
}

export const COURSES: Course[] = [
    {
        id: "psychology",
        title: "Introduction to Psychology",
        description: "Explore the human mind, behavior, and cognitive processes.",
        modulesCount: 3,
        updated: "2 days ago",
        modules: [
            { id: "mod-1", title: "Cognitive Basics", topics: 24, duration: 15 },
            { id: "mod-2", title: "Behavioral Patterns", topics: 18, duration: 12 },
            { id: "mod-3", title: "Neural Networks", topics: 32, duration: 25 },
        ]
    },
    {
        id: "history",
        title: "European History: 1900-1950",
        description: "A deep dive into the political and social shifts of the 20th century.",
        modulesCount: 8,
        updated: "1 week ago",
        modules: [
            { id: "mod-4", title: "The Great War", topics: 45, duration: 30 },
            { id: "mod-5", title: "Interwar Period", topics: 20, duration: 15 },
        ]
    },
    {
        id: "chemistry",
        title: "Advanced Organic Chemistry",
        description: "Advanced study of carbon-based molecules and their reactions.",
        modulesCount: 12,
        updated: "yesterday",
        modules: [
            { id: "mod-6", title: "Carbon Compounds", topics: 50, duration: 45 },
            { id: "mod-7", title: "Reaction Mechanisms", topics: 35, duration: 40 },
        ]
    }
];
