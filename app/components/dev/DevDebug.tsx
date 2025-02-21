"use client";

import { useState } from "react";

// Next
import Link from "next/link";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

// Components
import { BaseButton } from "@/app/components";

// Variables
import { FORM_FILL_VALUES } from "@/lib/variables";

// Icons
import { Code, FileInput } from "lucide-react";

const DevDebug = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { reset, formState } = useFormContext();

    return (
        <div className="relative">
            <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
            >
                <CollapsibleTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-md border-2 border-destructive hover:bg-destructive/10"
                    >
                        <Code className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Toggle dev menu</span>
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="absolute right-0 top-full mt-2 z-50 w-[240px] rounded-md border bg-card p-4 shadow-md">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Badge variant="destructive" className="px-2 py-1">DEV MODE</Badge>
                            <Badge 
                                variant={formState.isDirty ? "destructive" : "secondary"}
                                className="px-2 py-1"
                            >
                                {formState.isDirty ? "Form Dirty" : "Form Clean"}
                            </Badge>
                        </div>
                        <div className="space-y-2">
                            <BaseButton
                                variant="outline"
                                className="w-full justify-start text-sm"
                                onClick={() => reset(FORM_FILL_VALUES)}
                            >
                                <FileInput className="mr-2 h-4 w-4" />
                                Fill Test Data
                            </BaseButton>
                            <div className="grid grid-cols-2 gap-2">
                                <Link 
                                    href="/template/1"
                                    className="inline-flex h-8 items-center justify-center rounded-md bg-background px-3 text-sm font-medium border hover:bg-accent hover:text-accent-foreground"
                                >
                                    Template 1
                                </Link>
                                <Link 
                                    href="/template/2"
                                    className="inline-flex h-8 items-center justify-center rounded-md bg-background px-3 text-sm font-medium border hover:bg-accent hover:text-accent-foreground"
                                >
                                    Template 2
                                </Link>
                            </div>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default DevDebug;
