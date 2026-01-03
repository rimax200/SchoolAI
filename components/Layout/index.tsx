import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import PanelMessage from "@/components/PanelMessage";
import { ArrowDown } from "lucide-react";

type Props = {
    chatId?: string;
    classWrapper?: string;
    archived?: boolean;
    hidePanelMessage?: boolean;
    children: React.ReactNode;
    scrollRef?: React.RefObject<HTMLDivElement | null>;
    onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
    showScrollButton?: boolean;
    scrollToBottom?: () => void;
};

const Layout = ({
    chatId,
    classWrapper,
    archived,
    hidePanelMessage,
    children,
    scrollRef,
    onScroll,
    showScrollButton,
    scrollToBottom,
}: Props) => {
    const [sidebarCollapse, setSidebarCollapse] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);

    return (
        <div className="flex h-svh w-full bg-white text-gray-900 overflow-hidden relative">
            <Sidebar
                isCollapsed={sidebarCollapse}
                onToggle={() => setSidebarCollapse(!sidebarCollapse)}
                visible={sidebarVisible}
                onClose={() => setSidebarVisible(false)}
            />

            <div className="flex-1 flex flex-col min-w-0 bg-white relative h-full">
                <Header
                    chatId={chatId}
                    onOpenSidebar={() => setSidebarVisible(true)}
                />

                <main
                    ref={scrollRef}
                    onScroll={onScroll}
                    className="flex-1 w-full overflow-y-auto overflow-x-hidden scrollbar-none scroll-smooth flex flex-col relative"
                >
                    <div className={`w-full max-w-[1000px] px-4 md:pl-6 md:pr-4 py-5 md:py-7 flex-1 ${classWrapper || ""}`}>
                        {children}
                    </div>

                    {!hidePanelMessage && <div className="h-48 shrink-0" />}

                    {!archived && !hidePanelMessage && (
                        <div
                            className={`fixed bottom-52 left-1/2 -translate-x-1/2 z-[50] transition-all duration-300 ${sidebarCollapse ? "xl:ml-10" : "xl:ml-36"
                                } ${showScrollButton ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-4 invisible pointer-events-none"
                                }`}
                        >
                            <button
                                onClick={() => scrollToBottom?.()}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] text-gray-900 hover:bg-gray-50 active:scale-95 transition-all"
                                title="Scroll to bottom"
                            >
                                <ArrowDown className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </main>

                {!hidePanelMessage && (
                    <div className="absolute bottom-0 left-0 right-0 w-full flex pb-8 md:pb-12 bg-linear-to-t from-white via-white to-transparent pt-16 z-[40] pointer-events-none">
                        <div className="w-full max-w-[1000px] px-4 md:pl-6 md:pr-4 flex flex-col gap-3 pointer-events-auto">
                            <PanelMessage />
                            <div className="text-[11px] text-gray-400 text-center px-4 font-medium mb-1">
                                School AI can make mistakes. Consider checking important information.
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Layout;
