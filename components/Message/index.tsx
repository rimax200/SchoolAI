"use client";

import Image from "@/components/Image";
import Icon from "@/components/Icon";
import File from "./File";
import { useChatStore } from "@/store/useChatStore";
import { useState } from "react";
import { Check, Copy, Edit3, X } from "lucide-react";

type Props = {
    id: string;
    chatId: string;
    image?: string;
    file?: boolean;
    children: React.ReactNode;
};

const Message = ({ id, chatId, image, file, children }: Props) => {
    const { updateMessage } = useChatStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(typeof children === "string" ? children : "");
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (typeof children === "string") {
            navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSave = () => {
        if (editValue.trim()) {
            updateMessage(chatId, id, editValue);
            setIsEditing(false);
        }
    };

    return (
        <div className="group/message">
            {image && (
                <div className="flex flex-wrap justify-end gap-2 mb-2">
                    <div className="w-50">
                        <Image
                            className="w-full opacity-100 rounded-md"
                            src={image}
                            width={200}
                            height={200}
                            alt=""
                        />
                    </div>
                </div>
            )}
            <div className="flex justify-end items-start gap-3">
                <div className="flex-1 flex flex-col items-end">
                    {isEditing ? (
                        <div className="w-full max-w-xl flex flex-col gap-2">
                            <textarea
                                className="w-full p-4 rounded-2xl bg-white border border-primary-100 shadow-sm outline-none text-gray-900 text-body-md min-h-[100px] resize-none"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-3 py-1.5 rounded-lg border border-gray-100 text-xs font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-3 py-1.5 rounded-lg bg-primary-200 text-white text-xs font-medium hover:bg-primary-300 shadow-sm"
                                >
                                    Save changes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="content p-3 px-4 rounded-2xl rounded-tr-none text-gray-900 text-body-md shadow-sm border border-transparent whitespace-pre-wrap max-w-[85%]"
                            style={{ backgroundColor: '#F0F7FF' }}
                        >
                            {children}
                        </div>
                    )}

                    {file && <File />}

                    {!isEditing && (
                        <div className="flex items-center gap-3 mt-2 opacity-0 group-hover/message:opacity-100 transition-opacity">
                            <button
                                title={copied ? "Copied!" : "Copy message"}
                                onClick={handleCopy}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all"
                            >
                                {copied ? <Check className="w-4 h-4 text-success-100" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <button
                                title="Edit message"
                                onClick={() => setIsEditing(true)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all"
                            >
                                <Edit3 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
                <div className="shrink-0 size-8 rounded-full overflow-hidden border-2 border-white shadow-sm mt-1">
                    <Image
                        className="size-full opacity-100 object-cover"
                        src="/images/avatar-1.jpg"
                        width={32}
                        height={32}
                        alt="User"
                    />
                </div>
            </div>
        </div>
    );
};

export default Message;
