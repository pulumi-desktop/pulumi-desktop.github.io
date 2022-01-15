/*
 * Theme switcher
 *
 * Pico.css - https://picocss.com
 * Copyright 2019-2021 - Licensed under MIT
 */

/**
 * This file was modified from its original form but the original
 * copyright is to be maintained.
 */

type Theme = "auto" | "dark" | "light";

export const themeSwitcher = {
    // Config
    _scheme: "auto",
    buttonsTarget: ".theme-switcher",

    // Init
    init() {
        this.scheme = this._scheme;
        this.initSwitchers();
    },

    // Prefered color scheme
    get preferedColorScheme(): Theme {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    },

    // Init switchers
    initSwitchers() {
        const buttons = document.querySelectorAll(this.buttonsTarget);
        buttons.forEach((el: HTMLInputElement) => {
            el.addEventListener(
                "click",
                () => {
                    this.scheme == "dark" ? (this.scheme = "light") : (this.scheme = "dark");
                    el.setAttribute("aria-checked", `${el.checked}`);
                },
                false
            );

            el.checked = this._scheme === "dark";
            el.setAttribute("aria-checked", `${el.checked}`);
        });
    },

    // Set scheme
    set scheme(scheme: Theme) {
        if (scheme == "auto") {
            this.preferedColorScheme == "dark" ? (this._scheme = "dark") : (this._scheme = "light");
        } else if (scheme == "dark" || scheme == "light") {
            this._scheme = scheme;
        }
        this.applyScheme();
    },

    // Get scheme
    get scheme() {
        return this._scheme;
    },

    // Apply scheme
    applyScheme() {
        document.querySelector("html").setAttribute("data-theme", this.scheme);
    },
};

export default themeSwitcher;
