export function Hero() {
  return (
    <section className="flex flex-col max-w-4xl mx-auto mb-12 gap-12 mt-5">
      <article className="flex flex-col items-center justify-center gap-10 md:flex-row">
        <div
          className="[&>p]:mb-4 [&>p>strong]:text-black [&>p>strong]:bg-sky-200 [&>p>strong]:font-normal [&>p>strong]:text-base text-black/80 [&>p>strong]:py-0.5 [&>p>strong]:px-1 [&>p>strong]:font-mono text-lg text-pretty order-2 md:order-1 leading-normal"
        >
          <img src="/screenshot.webp" alt="Screenshot of Chatify in use" className="rounded-md" height={1080} width={1920} />
        </div>
      </article>
    </section>
  )
}