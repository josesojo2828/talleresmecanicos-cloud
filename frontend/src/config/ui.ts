export const UI = {
    /** DaisyUI button variant modifier classes (used alongside `btn` base) */
    COLORS: {
        PRIMARY: "btn-primary",
        SECONDARY: "btn-secondary text-slate-700",
        SUCCESS: "btn-success",
        ERROR: "btn-error",
        WARNING: "btn-warning",
        INFO: "btn-info",
        OUTLINE: "btn-outline",
        GHOST: "btn-ghost",
        PREMIUM: "bg-primary text-primary-content shadow-sm hover:brightness-105 active:scale-[0.98] transition-all",
        GLASS: "glass-effect text-slate-700 border-white/50 backdrop-blur-md transition-all",
    },
    /** DaisyUI button size modifier classes (used alongside `btn` base) */
    SIZES: {
        XS: "btn-xs py-0 h-7 min-h-7",
        SM: "btn-sm py-0.5 h-8 min-h-8 text-[10px]",
        MD: "btn-md py-1 h-10 min-h-10 text-xs",
        LG: "btn-lg py-1.5 h-12 min-h-12 text-sm",
        XL: "px-6 py-2 h-14 min-h-14 text-base",
        FULL: "btn-wide btn-md",
    },
    INPUT: {
        /** DaisyUI input base class */
        BASE: "input",
        SIZES: {
            SM: "input-sm h-8 text-[10px]",
            MD: "input-md h-10 text-xs",
            LG: "input-lg h-12 text-sm",
            XL: "px-4 py-3 h-14 rounded-xl",
        },
        VARIANTS: {
            DEFAULT: "",
            ERROR: "input-error",
            SUCCESS: "input-success",
            GLASS: "bg-white/60 border-white focus:ring-1 focus:ring-primary/40 focus:outline-none transition-shadow",
        },
    },
    TYPOGRAPHY: {
        DISPLAY: "text-4xl md:text-6xl font-black tracking-tighter leading-none",
        H1: "text-3xl md:text-5xl font-black tracking-tight leading-tight",
        H2: "text-2xl md:text-4xl font-black tracking-tight",
        H3: "text-xl md:text-2xl font-bold tracking-tight",
        H4: "text-lg font-bold tracking-tight",
        P: "text-sm font-medium leading-relaxed",
        CAPTION: "text-[10px] font-bold uppercase tracking-widest",
    },
    GLASS: {
        CARD: "glass-effect p-4 border-white/60 shadow-sm rounded-xl",
        TAG: "glass-effect px-3 py-1 text-[10px] font-bold text-slate-500 border-white shadow-xs rounded-full",
        TAG_ACTIVE: "bg-primary text-primary-content border border-primary/20 shadow-xs rounded-full",
    }
} as const;
