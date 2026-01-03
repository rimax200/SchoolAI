import React from "react";

export const content = [
    {
        id: 1,
        date: "Today, 10 : 15",
        chat: [
            {
                id: 0,
                message: {
                    content:
                        "I just uploaded this PDF document the teacher sent to us. It's about Quantum Physics principles. Can you explain the main concepts discussed here?",
                    file: true,
                },
                answer: {
                    content: (
                        <>
                            <p>
                                I've analyzed the handout! 📄 It covers the fundamental principles of Quantum Mechanics. Here are the core concepts explained:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>
                                    <strong>Wave-Particle Duality:</strong> The document explains how matter and light exhibit both wave-like and particle-like properties depending on the experiment.
                                </li>
                                <li>
                                    <strong>Superposition:</strong> This refers to the ability of a quantum system to be in multiple states at once until it is measured.
                                </li>
                                <li>
                                    <strong>Quantum Entanglement:</strong> A phenomenon where particles become interconnected, such that the state of one instantly influences the other, regardless of distance.
                                </li>
                                <li>
                                    <strong>Heisenberg Uncertainty Principle:</strong> The idea that you cannot simultaneously know both the exact position and momentum of a particle.
                                </li>
                            </ul>
                            <p className="mt-3">
                                Would you like me to dive deeper into any of these specific sections from the handout?
                            </p>
                        </>
                    ),
                },
            },
        ],
    },
    {
        id: 2,
        date: "Today, 12 : 45",
        chat: [
            {
                id: 0,
                message: {
                    content:
                        "Can you summarize the key reaction mechanisms from the week 4 Organic Chemistry slides? I'm finding the nucleophilic substitution part a bit confusing.",
                },
                answer: {
                    content: (
                        <>
                            <p>Of course! 🧪 Week 4 focuses heavily on Nucleophilic Substitution reactions. Here's a breakdown of the two main mechanisms (SN1 vs SN2):</p>
                            <div className="mt-4 space-y-4">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-2">SN2 Mechanism (Bimolecular)</h4>
                                    <ul className="list-disc pl-5 text-sm space-y-1">
                                        <li>Occurs in a <strong>single step</strong> (concerted).</li>
                                        <li>Involves a "backside attack" by the nucleophile.</li>
                                        <li>Results in <strong>inversion of configuration</strong> (Walden inversion).</li>
                                        <li>Preferred by primary alkyl halides.</li>
                                    </ul>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-2">SN1 Mechanism (Unimolecular)</h4>
                                    <ul className="list-disc pl-5 text-sm space-y-1">
                                        <li>Occurs in <strong>two steps</strong>.</li>
                                        <li>Formation of a carbocation intermediate (rate-determining step).</li>
                                        <li>Results in <strong>racemization</strong> (mixture of enantiomers).</li>
                                        <li>Preferred by tertiary alkyl halides.</li>
                                    </ul>
                                </div>
                            </div>
                        </>
                    ),
                },
            },
        ],
    },
];
