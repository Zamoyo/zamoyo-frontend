import { MarketplaceInfoPage } from "@/components/consumer/MarketplaceInfoPage";

export default function TermsPage() {
  return (
    <MarketplaceInfoPage
      title="Terms and Conditions"
      eyebrow="Marketplace rules"
      tone="policy"
      description="These terms govern how buyers and sellers use Zamoyo. By using the platform, you agree to marketplace rules around account usage, transactions, and acceptable conduct."
      highlights={["Account responsibility", "Transparent checkout", "Fair marketplace conduct", "Seller and buyer safeguards"]}
      stats={[
        { value: "Fair", label: "Conduct" },
        { value: "Clear", label: "Orders" },
        { value: "Safe", label: "Usage" },
      ]}
      sections={[
        {
          title: "Account Responsibility",
          body: "Users are responsible for accurate account information and for securing their login credentials. Suspicious or abusive activity may result in account restrictions.",
        },
        {
          title: "Orders and Payments",
          body: "Checkout totals, shipping fees, and payment status are shown before order confirmation. Completed orders are subject to each product's listed fulfillment and return conditions.",
        },
        {
          title: "Marketplace Conduct",
          body: "Fraud, counterfeit listings, abusive behavior, and attempts to bypass platform safeguards are prohibited and may lead to removal from Zamoyo.",
        },
      ]}
      steps={[
        {
          title: "Use accurate details",
          body: "Account, delivery, and seller information should be kept truthful and current.",
        },
        {
          title: "Respect checkout rules",
          body: "Orders, fees, delivery expectations, and return eligibility should be reviewed before confirmation.",
        },
        {
          title: "Keep conduct fair",
          body: "Buyers and sellers should avoid abuse, fraud, counterfeit activity, and attempts to bypass safeguards.",
        },
      ]}
      faqs={[
        {
          question: "Can Zamoyo restrict an account?",
          answer: "Yes. Accounts may be restricted when activity creates risk for shoppers, sellers, or the marketplace.",
        },
        {
          question: "Do seller policies still apply?",
          answer: "Yes. Product, delivery, and return expectations remain tied to the relevant listing and marketplace rules.",
        },
      ]}
      ctaLabel="Read Privacy Policy"
      ctaHref="/privacy"
      secondaryCtaLabel="Help Center"
      secondaryCtaHref="/help"
    />
  );
}
