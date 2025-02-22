import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Fonts
import {
    alexBrush,
    dancingScript,
    greatVibes,
    outfit,
    parisienne,
} from "@/lib/fonts";

// Favicon
import Favicon from "@/public/assets/favicon/favicon.ico";

// Vercel Analytics
import { Analytics } from "@vercel/analytics/react";

// Next Intl
import { NextIntlClientProvider } from "next-intl";

// ShadCn
import { Toaster } from "@/components/ui/toaster";

// Components
import { BaseNavbar, BaseFooter } from "@/app/components";

// Contexts
import Providers from "@/contexts/Providers";

// SEO
import { JSONLD, ROOTKEYWORDS } from "@/lib/seo";

// Variables
import { BASE_URL, GOOGLE_SC_VERIFICATION, LOCALES } from "@/lib/variables";

export const metadata: Metadata = {
    title: "Invoice Generator | Stellar Invoice Generator",
    description:
        "Create invoices effortlessly with Tellus Cooperative Invoice Generator, the free invoice generator for Stellar Projects. Try it now!",
    icons: [{ rel: "icon", url: Favicon.src }],
    keywords: ROOTKEYWORDS,
    viewport: "width=device-width, initial-scale=1",
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: BASE_URL,
    },
    authors: {
        name: "Bastian Koh",
        url: "https://telluscoop.com",
    },
    verification: {
        google: GOOGLE_SC_VERIFICATION,
    },
    metadataBase: new URL("https://p8cw84o000wcg0skw88wo0wc.coolify.hoops.finance"),
    openGraph: {
        title: "Invoice Generator | Stellar Invoice Generator",
        description: "Create invoices effortlessly with Invoify, the free invoice generator. Try it now!",
        url: "https://p8cw84o000wcg0skw88wo0wc.coolify.hoops.finance",
        siteName: "Invoice Generator",
        images: [
            {
                url: "https://opengraph.b-cdn.net/production/images/131b8a79-cc49-4248-8c77-d55b641305c5.png?token=pYpntqn9xshlqVpBFeiV2EfD9Hbcg23jWYZdH3QLvbc&height=630&width=1200&expires=33276191309",
                width: 1200,
                height: 630,
                alt: "Invoice Generator Preview"
            }
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Invoice Generator | Stellar Invoice Generator",
        description: "Create invoices effortlessly with Invoify, the free invoice generator. Try it now!",
        images: ["https://opengraph.b-cdn.net/production/images/131b8a79-cc49-4248-8c77-d55b641305c5.png?token=pYpntqn9xshlqVpBFeiV2EfD9Hbcg23jWYZdH3QLvbc&height=630&width=1200&expires=33276191309"],
        creator: "@telluscoop",
        site: "p8cw84o000wcg0skw88wo0wc.coolify.hoops.finance",
    }
};

export function generateStaticParams() {
    const locales = LOCALES.map((locale) => locale.code);
    return locales;
}

export default async function LocaleLayout({
    children,
    params: { locale },
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    let messages;
    try {
        messages = (await import(`@/i18n/locales/${locale}.json`)).default;
    } catch (error) {
        notFound();
    }

    return (
        <html lang={locale}>
            <head>
                <script
                    type="application/ld+json"
                    id="json-ld"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
                />
            </head>
            <body
                className={`${outfit.className} ${dancingScript.variable} ${parisienne.variable} ${greatVibes.variable} ${alexBrush.variable} antialiased bg-slate-100 dark:bg-slate-800`}
            >
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <Providers>
                        <BaseNavbar />

                        <div className="flex flex-col">{children}</div>

                        <BaseFooter />

                        {/* Toast component */}
                        <Toaster />

                        {/* Vercel analytics */}
                        <Analytics />
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
