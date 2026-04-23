import { MarketplaceInfoPage } from "@/components/consumer/MarketplaceInfoPage";

export default function CareersPage() {
  return (
    <MarketplaceInfoPage
      title="Careers at Zamoyo"
      description="We are growing a marketplace platform that serves real shoppers and sellers in Zambia. If you care about quality product execution and local impact, we would love to hear from you."
      sections={[
        {
          title: "How We Work",
          body: "We ship fast, review quality rigorously, and stay close to customer behavior. Cross-functional collaboration and ownership are expected across engineering, design, operations, and support.",
        },
        {
          title: "Who We Need",
          body: "We are actively interested in product engineers, marketplace operations specialists, seller success managers, and logistics-focused customer support professionals.",
        },
        {
          title: "How to Apply",
          body: "Send your profile and role interest to careers@zamoyo.com with examples of impactful work. We prioritize candidates who are practical, customer-centric, and execution focused.",
        },
      ]}
      ctaLabel="View Marketplace"
      ctaHref="/"
    />
  );
}
