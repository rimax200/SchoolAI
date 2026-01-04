"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const itemVariants = cva(
    "group relative flex w-full items-start gap-4 p-4 transition-all duration-200",
    {
        variants: {
            variant: {
                default: "",
                outline: "rounded-lg border border-gray-200 bg-white shadow-sm hover:border-gray-300",
                ghost: "hover:bg-gray-50 rounded-lg",
                secondary: "bg-gray-50 border border-transparent rounded-lg hover:border-gray-200",
            },
            size: {
                default: "p-4",
                sm: "p-3 gap-3",
                lg: "p-6 gap-6",
            },
            align: {
                start: "items-start",
                center: "items-center",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            align: "start",
        },
    }
)

export interface ItemProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof itemVariants> {
    asChild?: boolean
}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(
    ({ className, variant, size, align, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "div"
        return (
            <Comp
                ref={ref}
                className={cn(itemVariants({ variant, size, align, className }))}
                {...props}
            />
        )
    }
)
Item.displayName = "Item"

const ItemHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1 my-0", className)} {...props} />
))
ItemHeader.displayName = "ItemHeader"

const ItemMedia = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex shrink-0 items-center justify-center pt-0.5", className)}
        {...props}
    />
))
ItemMedia.displayName = "ItemMedia"

const ItemContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-1 flex-col gap-1 overflow-hidden", className)} {...props} />
))
ItemContent.displayName = "ItemContent"

const ItemTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("font-semibold text-gray-900 leading-tight tracking-tight", className)}
        {...props}
    />
))
ItemTitle.displayName = "ItemTitle"

const ItemDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-gray-500 leading-normal", className)}
        {...props}
    />
))
ItemDescription.displayName = "ItemDescription"

const ItemActions = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("ml-auto flex shrink-0 items-center gap-2", className)}
        {...props}
    />
))
ItemActions.displayName = "ItemActions"

const ItemFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("mt-auto flex items-center pt-2", className)}
        {...props}
    />
))
ItemFooter.displayName = "ItemFooter"

export {
    Item,
    ItemHeader,
    ItemMedia,
    ItemContent,
    ItemTitle,
    ItemDescription,
    ItemActions,
    ItemFooter,
}
