import { MarketplaceInfoPage } from "@/components/consumer/MarketplaceInfoPage";

export default function PrivacyPage() {
  return (
    <MarketplaceInfoPage
      title="Privacy Policy"
      description="Zamoyo handles customer and seller data to operate the marketplace safely, process transactions, and improve platform reliability."
      sections={[
        {
          title: "What We Collect",
          body: "We collect account details, order history, and fulfillment data needed to provide marketplace services, delivery support, and customer communication.",
        },
        {
          title: "How We Use Data",
          body: "Your data helps us process orders, prevent fraud, improve product discovery, and support sellers with operational insights.",
        },
        {
          title: "Your Control",
          body: "You can request account data updates through support channels. Sensitive payment processing follows provider-level security controls.",
        },
      ]}
      ctaLabel="Contact Support"
      ctaHref="/help"
    />
  );
}
