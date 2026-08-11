import type { Dress } from "./dresses";

/**
 * Configured outside product content so the client can change the ordering
 * number without touching individual dress records.
 */
export const WHATSAPP_NUMBER = "923364300129";

export function isWhatsAppConfigured() {
  return /^\d{8,15}$/.test(WHATSAPP_NUMBER);
}

function productUrl(dressId: string) {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  url.hash = "";
  url.searchParams.set("dress", dressId);
  return url.toString();
}

type OrderDetails = {
  dress: Dress;
  size: string | null;
  quantity: number;
};

export function buildOrderMessage({ dress, size, quantity }: OrderDetails): string {
  const lines = [
    "Hello Flora Dahlia, I would like to order or enquire about this piece.",
    "",
    `Dress: ${dress.name}`,
    `Reference: ${dress.productReference}`,
    `Colour: ${dress.descriptor}`,
    `Size: ${size ?? "Not specified"}`,
    `Quantity: ${quantity}`,
    `Price shown: ${dress.price}`,
    `Availability: ${dress.availability}`,
    `Product link: ${productUrl(dress.id)}`,
    "",
    "Please confirm availability, delivery timing, total cost, and payment options.",
  ];
  return lines.join("\n");
}

export function buildEnquiryMessage(dress: Dress): string {
  const lines = [
    "Hello Flora Dahlia, I would like more information about this piece.",
    "",
    `Dress: ${dress.name}`,
    `Reference: ${dress.productReference}`,
    `Product link: ${productUrl(dress.id)}`,
    "",
    "Please share available sizes, delivery timing, and the next steps to order.",
  ];
  return lines.join("\n");
}

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
