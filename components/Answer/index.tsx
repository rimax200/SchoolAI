"use client";

import Image from "@/components/Image";
import Icon from "@/components/Icon";
import GenerateImage from "./GenerateImage";
import GenerateVideo from "./GenerateVideo";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChatStore } from "@/store/useChatStore";
import { useState } from "react";
import { Check, Copy, RotateCcw, Terminal } from "lucide-react";

type Props = {
    image?: string;
    video?: string;
    children: React.ReactNode;
};

const Answer = ({ image, video, children }: Props) => {
    const { regenerateMessage, currentChatId } = useChatStore();
    const [copied, setCopied] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRegenerate = () => {
        if (currentChatId) {
            regenerateMessage(currentChatId);
        }
    };

    return (
        <div className="group/answer">
            <div className="flex items-start gap-3 md:gap-4">
                <div className="relative flex shrink-0 mt-1 after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:w-3.5 after:h-0.5 after:bg-[#8A44F4]/40 after:rounded-[100%] after:blur-[0.125rem]">
                    <Image
                        className="w-5 opacity-100"
                        src="/images/logo-circle.png"
                        width={20}
                        height={20}
                        alt="AI"
                    />
                </div>
                <div className="flex-1 overflow-hidden">
                    {children && (
                        <div className="content overflow-x-auto p-4 md:p-5 rounded-2xl rounded-tl-none bg-gray-25 text-gray-900 text-body-md shadow-sm border border-gray-100/50">
                            {typeof children === "string" ? (
                                <div className="prose prose-sm max-w-none prose-p:mb-5 last:prose-p:mb-0 prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent prose-code:text-primary-200 prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal prose-li:mb-2 text-gray-900">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code({ node, inline, className, children, ...props }: any) {
                                                const match = /language-(\w+)/.exec(className || "");
                                                const lang = match ? match[1] : "";
                                                const codeString = String(children).replace(/\n$/, "");

                                                if (!inline && match) {
                                                    return (
                                                        <div className="my-5 rounded-xl overflow-hidden border border-gray-700 bg-[#0d0d12] shadow-lg">
                                                            <div className="flex items-center justify-between px-4 py-2 bg-[#1a1b25] border-b border-gray-800">
                                                                <div className="flex items-center gap-2">
                                                                    <Terminal className="w-3.5 h-3.5 text-gray-400" />
                                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                                                                        {lang}
                                                                    </span>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleCopy(codeString)}
                                                                    className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
                                                                >
                                                                    {copied ? (
                                                                        <>
                                                                            <Check className="w-3.5 h-3.5 text-green-400" />
                                                                            <span className="text-[10px] font-bold">COPIED</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Copy className="w-3.5 h-3.5" />
                                                                            <span className="text-[10px] font-bold uppercase">COPY CODE</span>
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                            <div className="p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                                                                <code className={`${className} !text-gray-200 !bg-transparent !p-0 !text-[13.5px] font-mono leading-relaxed block`} {...props}>
                                                                    {children}
                                                                </code>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return (
                                                    <code className={`${className} bg-gray-100 text-primary-200 px-1.5 py-0.5 rounded text-[0.9em] font-mono`} {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            },
                                        }}
                                    >
                                        {children}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                children
                            )}
                        </div>
                    )}
                    {image && <GenerateImage image={image} />}
                    {video && <GenerateVideo video={video} />}

                    <div className="flex items-center gap-3 mt-2 opacity-0 group-hover/answer:opacity-100 transition-opacity">
                        <button
                            title="Regenerate response"
                            className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all border border-transparent hover:border-gray-100"
                            onClick={handleRegenerate}
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Answer;
