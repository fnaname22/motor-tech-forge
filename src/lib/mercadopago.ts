/**
 * Mercado Pago v2 Integration
 * Note: You need your Public Key from Mercado Pago.
 */

declare global {
  interface Window {
    MercadoPago: any;
  }
}

let mp: any = null;

export const initMercadoPago = (publicKey: string) => {
  if (!mp && window.MercadoPago) {
    mp = new window.MercadoPago(publicKey, {
      locale: "pt-BR",
    });
  }
  return mp;
};

export const createPreference = async (items: any[]) => {
  // In a real application, you should create the preference on your backend
  // to avoid exposing sensitive data and to ensure security.
  console.log("Creating payment preference for items:", items);
  return { id: "mock-pref-id" };
};
