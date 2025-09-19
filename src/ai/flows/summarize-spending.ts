'use server';

/**
 * @fileOverview AI-powered subscription spending summarization flow.
 *
 * - summarizeSpending - A function that generates a summary of spending habits.
 * - SummarizeSpendingInput - The input type for the summarizeSpending function.
 * - SummarizeSpendingOutput - The return type for the summarizeSpending function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSpendingInputSchema = z.object({
  subscriptionData: z
    .string()
    .describe(
      'JSON string representing an array of subscription objects, each with details like name, provider, category, amount, billing cycle, etc.'
    ),
});
export type SummarizeSpendingInput = z.infer<typeof SummarizeSpendingInputSchema>;

const SummarizeSpendingOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A detailed summary of the user\'s subscription spending habits, including key trends, potential savings areas, and overall insights.'
    ),
});
export type SummarizeSpendingOutput = z.infer<typeof SummarizeSpendingOutputSchema>;

export async function summarizeSpending(input: SummarizeSpendingInput): Promise<SummarizeSpendingOutput> {
  return summarizeSpendingFlow(input);
}

const summarizeSpendingPrompt = ai.definePrompt({
  name: 'summarizeSpendingPrompt',
  input: {schema: SummarizeSpendingInputSchema},
  output: {schema: SummarizeSpendingOutputSchema},
  prompt: `You are an AI assistant that analyzes subscription data and provides a summary of spending habits.

  Analyze the following subscription data (provided as a JSON string):
  {{subscriptionData}}

  Provide a detailed summary of the user's spending habits, including:
  - Key trends in spending
  - Potential areas for savings
  - Overall insights into their subscription expenses.

  Focus on actionable insights and recommendations for the user.
  Ensure the summary is clear, concise, and easy to understand.
`,
});

const summarizeSpendingFlow = ai.defineFlow(
  {
    name: 'summarizeSpendingFlow',
    inputSchema: SummarizeSpendingInputSchema,
    outputSchema: SummarizeSpendingOutputSchema,
  },
  async input => {
    try {
      const {output} = await summarizeSpendingPrompt(input);
      return output!;
    } catch (error) {
      console.error('Error in summarizeSpendingFlow:', error);
      throw new Error(`Failed to summarize spending: ${error}`);
    }
  }
);
