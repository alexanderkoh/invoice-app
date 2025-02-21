"use client";

import { useMemo } from "react";

// Next
import Link from "next/link";
import Image from "next/image";

// Assets
import Logo from "@/public/assets/img/logo.svg";

// ShadCn
import { Card } from "@/components/ui/card";

// Components
import { DevDebug, LanguageSelector, ThemeSwitcher } from "@/app/components";
import { WelcomeBanner } from "./WelcomeBanner";

const BaseNavbar = () => {
    const devEnv = useMemo(() => {
        return process.env.NODE_ENV === "development";
    }, []);

    return (
        <>
            <header className="sticky top-0 z-[99] w-full dark:border-b bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <Card className="flex items-center justify-between h-14 px-4">
                        <Link href={"/"} className="flex items-center">
                            <Image
                                src={Logo}
                                alt="Invoify Logo"
                                width={150}
                                height={80}
                                className="w-auto h-8 sm:h-10 dark:invert-0 invert"
                                loading="eager"
                                priority
                            />
                        </Link>
                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* ? DEV Only */}
                            {devEnv && <DevDebug />}
                            <LanguageSelector />
                            <ThemeSwitcher />
                        </div>
                    </Card>
                </div>
            </header>
            <WelcomeBanner />
        </>
    );
};

export default BaseNavbar;
