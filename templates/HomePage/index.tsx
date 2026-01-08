"use client";

import Link from "next/link";
import Layout from "@/components/Layout";
import Image from "@/components/Image";
import useEventsStore from "@/store/useEventsStore";

const mentorItems = [
    {
        title: "Study Mentor",
        description: "Master tough topics and get expert guidance for your assignments.",
        image: "/images/mentors/mentor-1.png",
        href: "/chat",
    },
    {
        title: "Study Lab",
        description: "Instantly turn your lecture slides into summaries and flashcards.",
        image: "/images/mentors/mentor-2.png",
        href: "/study-lab",
    },
    {
        title: "Exam Prep",
        description: "Quiz yourself and get a breakdown of your strengths and study gaps.",
        image: "/images/mentors/mentor-3.png",
        href: "/exam-prep",
    },
];

const HomePage = () => {
    const { isNewChat } = useEventsStore();

    return (
        <Layout classWrapper="flex flex-col items-center">
            <div className="w-full max-w-[1000px] pt-12 pb-53 max-md:pt-8 max-md:pb-32">
                <div className="relative w-16 mx-auto mb-8 after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:w-13 after:h-1.25 after:bg-[#8A44F4]/40 after:rounded-[100%] after:blur-[0.25rem] max-md:mb-4">
                    <Image
                        className="w-full opacity-100"
                        src="/images/logo-circle.png"
                        width={64}
                        height={64}
                        alt=""
                    />
                </div>

                <div className="text-center text-[36px] font-medium leading-tight tracking-tight max-md:text-[28px] text-gray-900">
                    Good morning,{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#005B55] to-[#28FCAE]">
                        Maxwell!
                    </span>{" "}
                    Ready to study?
                </div>

                <div className="mt-2 text-center text-[15px] text-gray-500 font-normal leading-relaxed max-w-lg mx-auto">
                    I’ve organized your latest class notes and slides. Pick a
                    tool below to start studying
                </div>

                {!isNewChat && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-12">
                        {mentorItems.map((item, index) => (
                            <Link
                                className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-xs transition-all hover:bg-gray-25 hover:border-gray-200 hover:shadow-sm group"
                                key={index}
                                href={item.href}
                            >
                                <div className="shrink-0 w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                                    <Image
                                        className="w-full h-full object-contain"
                                        src={item.image}
                                        width={40}
                                        height={40}
                                        alt={item.title}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <div className="mb-0.5 text-[14px] font-bold text-gray-900 leading-tight">
                                        {item.title}
                                    </div>
                                    <div className="text-[12px] text-gray-500 leading-snug font-medium">
                                        {item.description}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default HomePage;
