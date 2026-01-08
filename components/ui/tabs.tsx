"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
    value?: string
    onValueChange?: (value: string) => void
}>({})

const Tabs = ({
    value,
    onValueChange,
    defaultValue,
    children,
    className
}: {
    value?: string
    onValueChange?: (value: string) => void
    defaultValue?: string
    children: React.ReactNode
    className?: string
}) => {
    const [currentValue, setCurrentValue] = React.useState(defaultValue || value)

    React.useEffect(() => {
        if (value !== undefined) setCurrentValue(value)
    }, [value])

    const handleValueChange = (newValue: string) => {
        setCurrentValue(newValue)
        onValueChange?.(newValue)
    }

    return (
        <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
            <div className={cn("inline-flex flex-col w-full", className)}>
                {children}
            </div>
        </TabsContext.Provider>
    )
}

const TabsList = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-lg bg-[#ebebeb] p-1 text-[#616161]",
            className
        )}
        {...props}
    />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, ...props }, ref) => {
    const { value: activeValue, onValueChange } = React.useContext(TabsContext)
    const isActive = activeValue === value

    return (
        <button
            ref={ref}
            type="button"
            onClick={() => onValueChange?.(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                isActive
                    ? "bg-white text-[#303030] shadow-sm"
                    : "hover:bg-white/50 text-[#616161]",
                className
            )}
            {...props}
        />
    )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
    const { value: activeValue } = React.useContext(TabsContext)
    if (activeValue !== value) return null

    return (
        <div
            ref={ref}
            className={cn(
                "mt-2 focus-visible:outline-none",
                className
            )}
            {...props}
        />
    )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
