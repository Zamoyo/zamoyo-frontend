export interface SellerApplicationInput {
  firstName: string;
  lastName: string;
  email: string;
  mobileMoneyNumber: string;
  shopName: string;
  businessType: "individual" | "registered";
  shopAddress: string;
  nationalId: string;
  idDocumentName?: string;
}

export interface SellerApplicationResult {
  success: true;
  applicationId: string;
  nextPath: string;
}
