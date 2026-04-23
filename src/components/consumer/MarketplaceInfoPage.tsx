import Link from "next/link";

type InfoSection = {
  title: string;
  body: string;
};

type MarketplaceInfoPageProps = {
  title: string;
  description: string;
  sections: InfoSection[];
  ctaLabel?: string;
  ctaHref?: string;
};

export function MarketplaceInfoPage({
  title,
  description,
  sections,
  ctaLabel,
  ctaHref,
}: MarketplaceInfoPageProps) {
  return (
    <main className="min-h-screen bg-[#f4fbf6] pb-24 pt-10 md:pt-14">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="rounded-3xl border border-zinc-200/70 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] md:p-10">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 md:text-5xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-zinc-500 md:text-base">
            {description}
          </p>

          <div className="mt-8 space-y-5">
            {sections.map((section) => (
              <section key={section.title} className="rounded-2xl border border-zinc-200/60 bg-zinc-50/50 p-4 md:p-5">
                <h2 className="text-sm font-black uppercase tracking-wider text-zinc-900 md:text-base">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{section.body}</p>
              </section>
            ))}
          </div>

          {ctaHref && ctaLabel ? (
            <div className="mt-8">
              <Link
                href={ctaHref}
                className="inline-flex h-11 items-center rounded-xl bg-zinc-900 px-6 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
              >
                {ctaLabel}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
