export type AddressType = "Home" | "Work";

export interface Address {
  id: number;
  name: string;
  type: AddressType;
  street: string;
  area: string;
  city: string;
  phone: string;
  isDefault: boolean;
}
