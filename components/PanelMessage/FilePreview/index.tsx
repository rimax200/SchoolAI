import { X, FileText, FileArchive, Image as ImageIcon, FileCode } from "lucide-react";

type FilePreviewProps = {
    file: File;
    onRemove: () => void;
};

const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
    const getFileIcon = (type: string) => {
        if (type.includes("zip") || type.includes("archive")) return FileArchive;
        if (type.includes("image")) return ImageIcon;
        if (type.includes("pdf")) return FileText;
        if (type.includes("javascript") || type.includes("typescript") || type.includes("code")) return FileCode;
        return FileText;
    };

    const getFileLabel = (file: File) => {
        const type = file.type.toLowerCase();
        if (type.includes("zip")) return "Zip archive";
        if (type.includes("pdf")) return "PDF document";
        if (type.includes("image/png")) return "PNG image";
        if (type.includes("image/jpeg")) return "JPEG image";
        if (type.includes("text/plain")) return "Text file";

        // Fallback to extension if type is empty
        const ext = file.name.split(".").pop()?.toUpperCase();
        return ext ? `${ext} file` : "Document";
    };

    const Icon = getFileIcon(file.type);

    return (
        <div className="relative group flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm w-fit min-w-[180px] max-w-[280px]">
            <div className="flex items-center justify-center w-10 h-10 bg-[#8E44F4] rounded-lg shrink-0">
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col min-w-0 pr-6">
                <span className="text-[13px] font-semibold text-gray-900 truncate">
                    {file.name}
                </span>
                <span className="text-[11px] text-gray-400 font-medium lowercase">
                    {getFileLabel(file)}
                </span>
            </div>
            <button
                onClick={onRemove}
                className="absolute -top-2 -right-2 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center text-white border-2 border-white transition-colors hover:bg-gray-900 shadow-sm"
            >
                <X className="w-3 h-3" />
            </button>
        </div>
    );
};

export default FilePreview;
