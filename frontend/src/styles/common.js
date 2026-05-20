// src/styles/common.js
// Theme: Premium Apple-inspired UI with crisp whites, soft blues, and subtle shadows.

// --- Layout -------------------------------------------
export const pageBackground = "bg-[#f8f9fb] min-h-screen text-[#1d1d1f]"
export const pageWrapper = "max-w-6xl mx-auto px-4 py-8 md:px-6 lg:px-8"
export const section = "mb-14"

// --- Cards --------------------------------------------
export const cardClass =
  "bg-white/70 backdrop-blur-md border border-white/40 rounded-[28px] p-6 shadow-md transition duration-300 hover:shadow-xl hover:border-white/60";
// --- Typography ---------------------------------------
export const pageTitleClass = "text-4xl sm:text-5xl font-semibold text-[#1d1d1f] tracking-tight leading-tight mb-3"
export const headingClass = "text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-tight"
export const subHeadingClass = "text-lg sm:text-xl font-semibold text-[#1d1d1f] tracking-tight"
export const bodyText = "text-[#52555e] leading-relaxed"
export const mutedText = "text-sm text-[#7b7f89]"
export const linkClass = "text-[#0066cc] hover:text-[#004499] transition duration-200"

// --- Buttons ------------------------------------------
export const primaryBtn = "inline-flex items-center justify-center bg-[#0066cc] text-white font-semibold px-5 py-3 rounded-2xl hover:bg-[#004499] transition duration-200 shadow-sm"
export const secondaryBtn = "inline-flex items-center justify-center border border-[#d5dae3] text-[#1d1d1f] bg-white px-5 py-3 rounded-2xl hover:border-[#bac7d9] hover:bg-[#f7f8fa] transition duration-200 shadow-sm"
export const ghostBtn = "text-[#0066cc] font-medium hover:text-[#004499] transition duration-200"

// --- Forms ------------------------------------------
export const formCard = "bg-white rounded-[32px] p-10 max-w-lg mx-auto shadow-sm border border-[#e8ebf2]"
export const formTitle = "text-3xl sm:text-4xl font-semibold text-[#1d1d1f] leading-tight text-center mb-8"
export const labelClass = "text-sm font-medium text-[#6e6e73] mb-2 block"
export const inputClass = "w-full bg-[#f8f9fb] border border-[#dae1ea] rounded-2xl px-4 py-3 text-[#1d1d1f] text-sm placeholder:text-[#9ea4b2] focus:outline-none focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/10 transition duration-200"
export const formGroup = "mb-5"
export const submitBtn = "w-full inline-flex justify-center items-center bg-[#0066cc] text-white font-semibold py-3 rounded-2xl hover:bg-[#004499] transition duration-200 shadow-sm"

// --- Navbar -------------------------------------------
export const navbarClass = "bg-white/95 backdrop-blur-xl border-b border-[#e8ebf2] px-4 md:px-8 py-3 sticky top-0 z-50 shadow-sm"
export const navContainerClass = "max-w-6xl mx-auto w-full flex items-center justify-between gap-4"
export const navBrandClass = "text-2xl sm:text-3xl font-semibold tracking-tight"
export const navLinksClass = "flex items-center gap-4 flex-wrap"
export const navLinkClass = "text-sm text-[#6e6e73] hover:text-[#1d1d1f] transition duration-200"
export const navLinkActiveClass = "text-sm text-[#0066cc] font-semibold"
export const navLinkActiveButtonClass = "text-sm text-[#0066cc] font-semibold bg-[#eaf3ff] px-4 py-2 rounded-2xl"

// --- Feedback -----------------------------------------
export const errorClass = "bg-[#fff2f2] text-[#b91c1c] border border-[#fecaca] rounded-2xl px-4 py-3 text-sm"
export const successClass = "bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe] rounded-2xl px-4 py-3 text-sm"
export const loadingClass = "text-[#0066cc]/70 text-sm animate-pulse text-center py-10"
export const emptyStateClass = "text-center text-[#7b7f89] py-16 text-sm"

// --- Divider ------------------------------------------
export const divider = "border-t border-[#e8ebf2] my-10"

// Product helpers
export const productImage = "w-32 h-32 object-contain mx-auto"
export const productName = "text-lg font-bold"
