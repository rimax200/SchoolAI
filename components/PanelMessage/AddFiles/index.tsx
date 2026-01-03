import { useRef } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Plus, UploadCloud, Library, Globe } from "lucide-react";

type Props = {
    onFilesSelect: (files: FileList) => void;
};

const AddFiles = ({ onFilesSelect }: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFilesSelect(e.target.files);
        }
    };

    const items = [
        {
            name: "Upload file",
            icon: UploadCloud,
            onClick: handleUploadClick,
        },
        {
            name: "Add from library",
            icon: Library,
            onClick: () => {
                console.log("Add from library");
            },
        },
        {
            name: "Website URL",
            icon: Globe,
            onClick: () => {
                console.log("Add website URL");
            },
        },
    ];

    return (
        <Menu as="div" className="relative">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                multiple
            />
            <MenuButton
                className="group flex items-center justify-center size-10 outline-0 transition-colors"
                title="Add files"
            >
                <Plus className="w-5 h-5 text-gray-500 transition-colors group-hover:text-gray-900" />
            </MenuButton>
            <MenuItems
                className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl outline-0 transition duration-200 ease-out z-30 overflow-hidden"
                transition
            >
                {items.map((item, index) => (
                    <MenuItem
                        key={index}
                        as="button"
                        className="group flex items-center gap-3 w-full px-4 py-3 text-left transition-colors hover:bg-gray-25 outline-none"
                        onClick={item.onClick}
                    >
                        <item.icon className="w-4 h-4 text-gray-400 transition-colors group-hover:text-gray-900" />
                        <span className="text-sm font-medium text-[#2B303B]">
                            {item.name}
                        </span>
                    </MenuItem>
                ))}
            </MenuItems>
        </Menu>
    );
};

export default AddFiles;
