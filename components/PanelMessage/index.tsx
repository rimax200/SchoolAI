"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Icon from "@/components/Icon";
import { Telescope, SendHorizonal, Loader2 } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import PreviewImage from "./PreviewImage";
import PreviewFile from "./PreviewFile";
import AddFiles from "./AddFiles";
import FilePreview from "./FilePreview";
import Language from "./Language";
import Audio from "./Audio";
import Voice from "./Voice";
import Time from "./Time";
import CloseLine from "./CloseLine";
import RecreateVideo from "./RecreateVideo";

const PanelMessage = ({ }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeId = searchParams.get("id");

    const [message, setMessage] = useState("");
    const [attachImage, setAttachImage] = useState(false);
    const [generateVideo, setGenerateVideo] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isResearchActive, setIsResearchActive] = useState(false);

    const { sendMessage, isTyping, createNewChat } = useChatStore();

    const handleFilesSelect = (files: FileList) => {
        const newFiles = Array.from(files);
        setUploadedFiles((prev) => [...prev, ...newFiles]);
    };

    const removeFile = (index: number) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSend = async () => {
        if (!message.trim() || isTyping) return;

        const content = message;
        setMessage(""); // Clear input early for better UX

        let chatId = activeId;
        if (!chatId) {
            chatId = createNewChat(content);
            router.push(`/chat?id=${chatId}`);
        }

        await sendMessage(content);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="absolute left-0 right-0 bottom-0 z-5 px-6 pb-6 pt-10 bg-linear-to-t from-white via-white/95 to-transparent pointer-events-none max-md:fixed max-md:px-4 max-md:pb-4 max-md:pt-8">
            <div className="pointer-events-auto max-w-[920px] mx-auto">
                {generateVideo && (
                    <CloseLine
                        title="Recreate Video"
                        onClose={() => setGenerateVideo(false)}
                    />
                )}
                <div className="relative z-2 pt-5 pb-3 px-6 bg-white rounded-[26px] border border-gray-100 shadow-[0_1rem_3rem_0_rgba(0,0,0,0.1)] flex flex-col justify-between max-md:p-4 transition-all">
                    {/* File Previews Area */}
                    {uploadedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2">
                            {uploadedFiles.map((file, index) => (
                                <FilePreview
                                    key={index}
                                    file={file}
                                    onRemove={() => removeFile(index)}
                                />
                            ))}
                        </div>
                    )}

                    {attachImage && (
                        <PreviewImage onClose={() => setAttachImage(false)} />
                    )}
                    {generateVideo && <RecreateVideo />}
                    <div className="relative pl-8 text-0">
                        <Icon
                            className="absolute top-0.75 left-0 fill-primary-200"
                            name="chat-ai-fill"
                        />
                        <TextareaAutosize
                            className="w-full text-body-md text-gray-900 outline-none resize-none placeholder:text-gray-500 font-sans leading-relaxed"
                            maxRows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything"
                        />
                    </div>
                    <div className="flex items-center gap-0.5 mt-2">
                        <div className="flex items-center gap-0.5 mr-auto">
                            <AddFiles onFilesSelect={handleFilesSelect} />
                            <button
                                onClick={() => setIsResearchActive(!isResearchActive)}
                                title="Academic Research"
                                className={`flex items-center justify-center gap-1.5 h-10 px-2 outline-0 transition-all rounded-lg hover:bg-gray-25 ${isResearchActive
                                    ? "text-blue-600 bg-blue-50/50"
                                    : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                <Telescope className="w-5 h-5" />
                                <span className="text-sm font-medium">Research</span>
                            </button>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Voice />
                            <button
                                onClick={handleSend}
                                disabled={!message.trim() || isTyping}
                                title="Send message"
                                className={`flex items-center justify-center w-9 h-9 bg-primary-200 rounded-full text-white transition-all hover:bg-primary-300 active:scale-95 shadow-sm disabled:opacity-30 disabled:scale-100`}
                            >
                                {isTyping ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <SendHorizonal className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-3 text-center hidden md:block">
                    <p className="text-[11px] text-gray-400 font-medium">
                        School AI can make mistakes. Check important info.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PanelMessage;
