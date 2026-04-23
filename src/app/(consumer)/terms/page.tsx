import { MarketplaceInfoPage } from "@/components/consumer/MarketplaceInfoPage";

export default function TermsPage() {
  return (
    <MarketplaceInfoPage
      title="Terms and Conditions"
      description="These terms govern how buyers and sellers use Zamoyo. By using the platform, you agree to marketplace rules around account usage, transactions, and acceptable conduct."
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
      ctaLabel="Read Privacy Policy"
      ctaHref="/privacy"
    />
  );
}
