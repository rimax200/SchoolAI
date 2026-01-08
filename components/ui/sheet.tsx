"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SheetContextValue {
    open: boolean
    setOpen: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextValue | null>(null)

const useSheet = () => {
    const context = React.useContext(SheetContext)
    if (!context) throw new Error("useSheet must be used within Sheet")
    return context
}

interface SheetProps {
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

const Sheet = ({ children, open: controlledOpen, onOpenChange }: SheetProps) => {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen
    const setOpen = onOpenChange || setInternalOpen

    return (
        <SheetContext.Provider value={{ open, setOpen }}>
            {children}
        </SheetContext.Provider>
    )
}

const SheetTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, children, asChild, ...props }, ref) => {
    const { setOpen, open } = useSheet()

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onClick: () => setOpen(!open),
        })
    }

    return (
        <button
            ref={ref}
            className={className}
            onClick={() => setOpen(true)}
            {...props}
        >
            {children}
        </button>
    )
})
SheetTrigger.displayName = "SheetTrigger"

const SheetClose = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
    const { setOpen } = useSheet()

    return (
        <button
            ref={ref}
            className={cn("absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100", className)}
            onClick={() => setOpen(false)}
            {...props}
        >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
        </button>
    )
})
SheetClose.displayName = "SheetClose"

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
    side?: "top" | "bottom" | "left" | "right"
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
    ({ side = "right", className, children, ...props }, ref) => {
        const { open, setOpen } = useSheet()

        if (!open) return null

        const sideVariants = {
            top: "inset-x-0 top-0 border-b",
            bottom: "inset-x-0 bottom-0 border-t rounded-t-3xl",
            left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
            right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
        }

        return (
            <>
                {/* Backdrop */}
                <div
                    className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                />
                {/* Sheet Content */}
                <div
                    ref={ref}
                    className={cn(
                        "fixed z-[201] bg-white shadow-lg transition-all duration-300",
                        sideVariants[side],
                        className
                    )}
                    {...props}
                >
                    {children}
                    <SheetClose />
                </div>
            </>
        )
    }
)
SheetContent.displayName = "SheetContent"

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
)
SheetHeader.displayName = "SheetHeader"

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3 ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
    )
)
SheetTitle.displayName = "SheetTitle"

const SheetDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
    )
)
SheetDescription.displayName = "SheetDescription"

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetDescription }
