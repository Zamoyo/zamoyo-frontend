import { MarketplaceInfoPage } from "@/components/consumer/MarketplaceInfoPage";

export default function ReturnsPage() {
  return (
    <MarketplaceInfoPage
      title="Returns Policy"
      description="Zamoyo supports fair returns so shoppers can buy with confidence while keeping expectations clear for sellers."
      sections={[
        {
          title: "Return Window",
          body: "Most eligible items can be returned within 7 days from delivery, provided they are in original condition and include all accessories.",
        },
        {
          title: "Non-Eligible Returns",
          body: "Products damaged by misuse, opened personal-care items, and explicitly non-returnable items may not qualify for return or refund.",
        },
        {
          title: "How to Start",
          body: "Open your order history, select the order, and submit a return request with clear details. Our team reviews each case and responds with next steps.",
        },
      ]}
      ctaLabel="Open Your Orders"
      ctaHref="/account/orders"
    />
  );
}
