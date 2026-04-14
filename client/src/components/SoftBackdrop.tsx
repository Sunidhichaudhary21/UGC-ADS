export default function SoftBackdrop() {
    return (
        <div className="fixed inset-0 -z-1 pointer-events-none">
            <div className="absolute left-1/2 top-20 -translate-x-1/2 w-[980px] h-[460px] bg-linear-to-tr from-blue-400/30 via-blue-500/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute right-12 bottom-10 w-[520px] h-[260px] bg-linear-to-bl from-primary/70 via-blue-500/25 to-transparent rounded-full blur-3xl" />
            <div className="absolute left-16 bottom-12 w-[360px] h-[200px] bg-blue-500/25 rounded-full blur-3xl animate-pulse" />
        </div>
    )
}