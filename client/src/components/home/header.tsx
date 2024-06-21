import { ChatifyLogo } from "../common/svg-icons";

export function Header() {
  return (
    <header
      className="flex justify-center flex-col max-w-xl mx-auto items-center pt-32 md:pt-8 xl:pt-4"
    >
      <h1 className="font-bold items-center mb-8 mt-4 flex gap-5 animate-fade-in-up z-10">
        <span className="flex flex-col text-center gap-3 sm:gap-0 align-middle">
          <span
            className="tracking-tighter text-slate-800 text-5xl sm:text-6xl"
          >Chatify</span
          >
          <span className="tracking-tighter text-[32px] sm:text-[70px] px-1 bg-clip-text inline-block text-transparent bg-gradient-to-r from-slate-400 to-slate-600 -mt-4"
          >Network</span
          >
        </span>

        <span className="align-middle">
          <ChatifyLogo className="text-sm me-0 text-brand flex origin-center transition-all ease-in-out max-h-32 max-w-32" />
        </span>
      </h1>
    </header>
  )
}