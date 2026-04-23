import { MarketplaceInfoPage } from "@/components/consumer/MarketplaceInfoPage";

export default function AboutPage() {
  return (
    <MarketplaceInfoPage
      title="About Zamoyo"
      description="Zamoyo is a Zambian-first marketplace built to connect trusted local sellers with shoppers who want fast delivery, transparent pricing, and a smoother buying experience."
      sections={[
        {
          title: "Our Mission",
          body: "We are building a marketplace that reflects how people in Zambia and across Africa actually shop: mobile-first, practical, and relationship-driven. Zamoyo focuses on real seller visibility and reliable order fulfillment.",
        },
        {
          title: "What We Prioritize",
          body: "Clear product discovery, reliable checkout flows, responsive support, and local logistics integration are core to our product decisions. We optimize for trust and convenience, not noise.",
        },
        {
          title: "Seller Growth",
          body: "From first listing to payout readiness, Zamoyo gives small and growing businesses better storefront tools and operational visibility so they can scale confidently.",
        },
      ]}
      ctaLabel="Browse Categories"
      ctaHref="/categories"
    />
  );
}
