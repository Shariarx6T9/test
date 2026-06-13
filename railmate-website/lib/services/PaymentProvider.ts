// lib/services/PaymentProvider.ts

/**
 * Common interface for creating a payment request.
 */
export interface PaymentRequest {
  amount: number;
  currency: 'BDT';
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  metadata: Record<string, any>;
}

/**
 * Common interface for the result of a payment verification.
 */
export interface PaymentVerificationResult {
  success: boolean;
  transactionId?: string;
  message?: string;
}

/**
 * Abstract class defining the contract for a payment provider.
 * This ensures all providers have a consistent interface.
 */
export abstract class PaymentProvider {
  protected providerName: string;

  constructor(providerName: string) {
    this.providerName = providerName;
  }

  abstract createPaymentRequest(request: PaymentRequest): Promise<{ redirectUrl: string }>;
  abstract verifyPayment(paymentData: any): Promise<PaymentVerificationResult>;
}

// -- Placeholder Implementations --

const ENABLE_BKASH = process.env.ENABLE_BKASH === 'true';
const ENABLE_NAGAD = process.env.ENABLE_NAGAD === 'true';

if (ENABLE_BKASH) {
  class BKashProvider extends PaymentProvider {
    constructor() {
      super('bKash');
    }

    async createPaymentRequest(request: PaymentRequest): Promise<{ redirectUrl: string }> {
      console.log(`[bKash] Creating payment for ${request.amount} BDT.`);
      // Mock: In a real scenario, this would call the bKash API.
      return { redirectUrl: 'https://placeholder.bkash.com/payment' };
    }

    async verifyPayment(paymentData: any): Promise<PaymentVerificationResult> {
      console.log('[bKash] Verifying payment.');
      // Mock: In a real scenario, this would verify the payment with bKash.
      return { success: true, transactionId: 'mock_bkash_txn_123' };
    }
  }
  // This is where you would instantiate and export the provider.
  // export const bKashProvider = new BKashProvider();
}

if (ENABLE_NAGAD) {
  class NagadProvider extends PaymentProvider {
    constructor() {
      super('Nagad');
    }

    async createPaymentRequest(request: PaymentRequest): Promise<{ redirectUrl: string }> {
      console.log(`[Nagad] Creating payment for ${request.amount} BDT.`);
      // Mock: In a real scenario, this would call the Nagad API.
      return { redirectUrl: 'https://placeholder.nagad.com.bd/payment' };
    }

    async verifyPayment(paymentData: any): Promise<PaymentVerificationResult> {
      console.log('[Nagad] Verifying payment.');
      // Mock: In a real scenario, this would verify the payment with Nagad.
      return { success: true, transactionId: 'mock_nagad_txn_123' };
    }
  }
  // export const nagadProvider = new NagadProvider();
}
