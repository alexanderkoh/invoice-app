import { useEffect, useState } from "react";

// Variables
import { CURRENCIES_API } from "@/lib/variables";

// Type
import { CurrencyType } from "@/types";

type CurrencyGroupsType = {
    popular: CurrencyType[];
    all: CurrencyType[];
};

const PRIORITY_CURRENCIES = ['USD', 'CLP', 'ARS', 'MXN', 'BRL'];

export const useCurrencies = () => {
    const [currenciesLoading, setCurrenciesLoading] = useState(true);
    const [currencies, setCurrencies] = useState<CurrencyGroupsType>({
        popular: [],
        all: []
    });

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const response = await fetch(
                    "https://openexchangerates.org/api/currencies.json"
                );
                const data = await response.json();
                
                // Convert to array of currency objects
                const currencyArray = Object.entries(data).map(
                    ([code, name]) => ({
                        code,
                        name: name as string,
                    })
                );

                // Split into popular and all currencies
                const popular = currencyArray.filter(currency => 
                    PRIORITY_CURRENCIES.includes(currency.code)
                ).sort((a, b) => 
                    PRIORITY_CURRENCIES.indexOf(a.code) - PRIORITY_CURRENCIES.indexOf(b.code)
                );

                const all = currencyArray.filter(currency => 
                    !PRIORITY_CURRENCIES.includes(currency.code)
                ).sort((a, b) => a.code.localeCompare(b.code));

                setCurrencies({ popular, all });
            } catch (error) {
                // Fallback to priority currencies only
                setCurrencies({
                    popular: PRIORITY_CURRENCIES.map(code => ({
                        code,
                        name: code
                    })),
                    all: []
                });
                console.error("Error fetching currencies:", error);
            } finally {
                setCurrenciesLoading(false);
            }
        };

        fetchCurrencies();
    }, []);

    return { currencies, currenciesLoading };
};
