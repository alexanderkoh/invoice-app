"use client";

import { useTranslationContext } from "@/contexts/TranslationContext";

// Icons
import { Twitter, MessageSquare } from "lucide-react";

const BaseFooter = () => {
    const { _t } = useTranslationContext();

    return (
        <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        {_t("footer.developedBy")}{" "}
                        <a
                            href="https://telluscoop.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium underline underline-offset-4 hover:text-primary"
                        >
                            Tellus Cooperative
                        </a>
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://x.com/telluscoop"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            aria-label="Follow us on Twitter"
                        >
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a
                            href="https://discord.gg/ysuxyKJ34c"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            aria-label="Join our Discord community"
                        >
                            <MessageSquare className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default BaseFooter;
