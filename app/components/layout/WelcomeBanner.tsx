"use client";

import { useState } from "react";

// ShadCn
import { Card } from "@/components/ui/card";

// Icons
import { X } from "lucide-react";

export const WelcomeBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="w-full dark:border-b bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <Card className="relative flex items-center justify-between gap-4 px-4 py-3">
                    <p className="text-sm text-muted-foreground">
                        💡 Welcome to Invoice Generator by Tellus Cooperative - Create professional invoices for your chapter program with ease.
                    </p>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Dismiss welcome message"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </Card>
            </div>
        </div>
    );
}; 