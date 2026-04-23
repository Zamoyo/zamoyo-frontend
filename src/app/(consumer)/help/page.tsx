import { MarketplaceInfoPage } from "@/components/consumer/MarketplaceInfoPage";

export default function HelpPage() {
  return (
    <MarketplaceInfoPage
      title="Help Center"
      description="Need support with an order, payment, delivery, or seller issue? Zamoyo support is designed to keep resolution fast and straightforward."
      sections={[
        {
          title: "Order Tracking",
          body: "Use your order ID and purchase email to check your delivery timeline, movement updates, and estimated arrival date.",
        },
        {
          title: "Returns and Refunds",
          body: "If an item is damaged, incorrect, or not delivered as promised, start a return request quickly so we can review and assist.",
        },
        {
          title: "Account and Security",
          body: "For login and account access issues, use the password reset flow first. If access problems continue, contact support with your registered email.",
        },
      ]}
      ctaLabel="Track an Order"
      ctaHref="/track"
    />
  );
}
