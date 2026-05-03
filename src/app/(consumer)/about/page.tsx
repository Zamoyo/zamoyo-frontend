import { MarketplaceInfoPage } from "@/components/consumer/MarketplaceInfoPage";

export default function AboutPage() {
  return (
    <MarketplaceInfoPage
      title="About Zamoyo"
      eyebrow="Zambian marketplace"
      tone="company"
      description="Zamoyo is a Zambian-first marketplace built to connect trusted local sellers with shoppers who want fast delivery, transparent pricing, and a smoother buying experience."
      highlights={["Local seller visibility", "Mobile-first shopping", "Clearer delivery expectations", "Practical support"]}
      stats={[
        { value: "ZM", label: "Built for" },
        { value: "24/7", label: "Discovery" },
        { value: "Fast", label: "Support" },
      ]}
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
      steps={[
        {
          title: "Discover locally",
          body: "Shoppers find verified categories, useful product context, and seller options without digging through noisy listings.",
        },
        {
          title: "Buy with clarity",
          body: "Cart, checkout, delivery, and support surfaces stay connected so expectations are clear before an order is placed.",
        },
        {
          title: "Grow seller trust",
          body: "Sellers get cleaner tools for products, orders, inventory, support, and customer confidence.",
        },
      ]}
      faqs={[
        {
          question: "Is Zamoyo only for Lusaka?",
          answer: "The experience currently emphasizes Lusaka delivery clarity while the platform is structured to grow into more Zambian locations.",
        },
        {
          question: "Can small sellers join?",
          answer: "Yes. The seller journey is designed for both growing shops and newer sellers who need a polished storefront path.",
        },
      ]}
      ctaLabel="Browse Categories"
      ctaHref="/categories"
      secondaryCtaLabel="Sell on Zamoyo"
      secondaryCtaHref="/sell"
    />
  );
}
