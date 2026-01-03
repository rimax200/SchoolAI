import { Paperclip, Globe, Mic, SendHorizonal, Sparkles } from "lucide-react";

const ChatInput = () => {
    return (
        <div className="w-full max-w-3xl mx-auto mt-12 mb-8">
            <div className="relative bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 p-2">
                <div className="flex items-center gap-2 px-4 py-3">
                    <Sparkles size={18} className="text-gray-400 shrink-0" />
                    <input
                        type="text"
                        placeholder="Ask a question or make a request..."
                        className="flex-1 bg-transparent border-none outline-none text-body-md text-gray-900 placeholder:text-gray-400"
                    />
                </div>

                <div className="flex items-center justify-between px-2 pb-1">
                    <div className="flex items-center gap-1">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-body-xs font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                            <Paperclip size={14} />
                            Attach Files
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-body-xs font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                            <Globe size={14} />
                            Research
                        </button>
                    </div>

                    <div className="flex items-center gap-1">
                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors">
                            <Mic size={18} />
                        </button>
                        <button className="p-2 bg-gray-900 text-white hover:bg-black rounded-full transition-all active:scale-95 shadow-lg shadow-gray-900/20">
                            <SendHorizonal size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
