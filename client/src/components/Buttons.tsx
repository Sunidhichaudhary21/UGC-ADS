import React from 'react'

export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
    <button className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium bg-white text-[#3F536A] hover:bg-white/90 active:scale-95 transition-all ${className}`} {...props} >
        {children}
    </button>
);

export const GhostButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
    <button className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border border-white/25 bg-white/10 hover:bg-white/20 backdrop-blur-sm active:scale-95 transition ${className}`} {...props} >
        {children}
    </button>
);