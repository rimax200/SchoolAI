"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const itemVariants = cva(
    "relative flex w-full items-start gap-4 p-4",
    {
        variants: {
            variant: {
                default: "",
                outline: "rounded-xl border border-gray-100 bg-white shadow-sm",
                ghost: "hover:bg-gray-50",
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
            align: "center",
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
    <div ref={ref} className={cn("flex flex-col space-y-1.5", className)} {...props} />
))
ItemHeader.displayName = "ItemHeader"

const ItemMedia = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex shrink-0 items-center justify-center", className)}
        {...props}
    />
))
ItemMedia.displayName = "ItemMedia"

const ItemContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-1 flex-col gap-1", className)} {...props} />
))
ItemContent.displayName = "ItemContent"

const ItemTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("font-bold text-gray-900 leading-none tracking-tight", className)}
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
        className={cn("text-sm text-gray-500", className)}
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
        className={cn("ml-auto flex items-center gap-2", className)}
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
        className={cn("mt-auto flex items-center", className)}
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
