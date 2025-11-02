'use server';

/**
 * @fileOverview This file defines a Genkit flow for assisting users in filling out subscription details using AI.
 *
 * The flow takes a subscription name as input and returns a SubscriptionDetailsOutput object with
 * details such as provider, category, start date, billing cycle, amount, currency, annual price, notes,
 * active status, and auto renew flag.
 *
 * @interface SubscriptionDetailsInput - Input schema for the subscription assistant flow.
 * @interface SubscriptionDetailsOutput - Output schema for the subscription assistant flow.
 * @function getSubscriptionDetails - The exported function that triggers the subscription assistant flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { rateLimit } from '@/lib/rate-limit';

const SubscriptionDetailsInputSchema = z.object({
  subscriptionName: z
    .string() // Changed from serviceName to subscriptionName for clarity and consistency.
    .describe('The name of the subscription service (e.g., Netflix, Spotify).'),
});
export type SubscriptionDetailsInput = z.infer<typeof SubscriptionDetailsInputSchema>;

const SubscriptionDetailsOutputSchema = z.object({
  provider: z.string().describe('The name of the subscription provider.'),
  category: z.string().describe('The category of the subscription (e.g., entertainment, software).'),
  startDate: z.string().describe('The start date of the subscription (YYYY-MM-DD).'),
  billingCycle: z.string().describe('The billing cycle of the subscription (e.g., monthly, yearly). Must be one of: monthly, yearly, one-time.'),
  amount: z.number().describe('The amount charged per billing cycle.'),
  currency: z.string().describe('The currency of the subscription amount (e.g., USD, EUR).'),
  annualPrice: z.number().describe('The calculated annual price of the subscription.'),
  notes: z.string().describe('Any notes or comments about the subscription.'),
  activeStatus: z.boolean().describe('Whether the subscription is currently active.'),
  autoRenew: z.boolean().describe('Whether the subscription is set to auto renew.'),
});
export type SubscriptionDetailsOutput = z.infer<typeof SubscriptionDetailsOutputSchema>;

export async function getSubscriptionDetails(
  input: SubscriptionDetailsInput
): Promise<SubscriptionDetailsOutput> {
  if (!rateLimit('subscription-assistant', 10, 60000)) {
    throw new Error('Rate limit exceeded. Please wait before making more requests.');
  }
  return subscriptionAssistantFlow(input);
}

const subscriptionAssistantPrompt = ai.definePrompt({
  name: 'subscriptionAssistantPrompt',
  input: { schema: SubscriptionDetailsInputSchema },
  output: { schema: SubscriptionDetailsOutputSchema },
  prompt: `You are a subscription expert. Given the name of a subscription service, provide details such as the provider, category, start date, billing cycle, amount, currency, annual price, notes, active status, and auto renew flag. Respond in JSON format.

The 'billingCycle' field MUST be one of the following lowercase values: 'monthly', 'yearly', or 'one-time'.

Subscription Name: {{{subscriptionName}}}`,
});

const subscriptionAssistantFlow = ai.defineFlow(
  {
    name: 'subscriptionAssistantFlow',
    inputSchema: SubscriptionDetailsInputSchema,
    outputSchema: SubscriptionDetailsOutputSchema,
  },
  async input => {
    const { output } = await subscriptionAssistantPrompt(input);
    if (output) {
      output.billingCycle = output.billingCycle.toLowerCase();
    }
    return output!;
  }
);
