"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Components
import { BaseButton } from "@/app/components";

// Icons
import { Moon, Sun } from "lucide-react";

const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme, systemTheme } = useTheme();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const currentTheme = theme === 'system' ? systemTheme : theme;

    return (
        <BaseButton
            size="icon"
            variant="ghost"
            className="relative h-9 w-9 rounded-lg transition-colors hover:bg-accent/10"
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
        >
            <Sun className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.5rem] w-[1.5rem] rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </BaseButton>
    );
};

export default ThemeSwitcher;
