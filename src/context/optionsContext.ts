import { createCookiesContext } from "@yakad/lib";

export interface Options {
    themeMode: "system" | "dark" | "light";
    translation?: string;
}

const defaultOptions: Options = {
    themeMode: "system",
    translation: "asgar"
};

export const [OptionsProvider, useOptions] = createCookiesContext<Options>(
    "options",
    defaultOptions,
    "/",
    ".natiq.org"
);