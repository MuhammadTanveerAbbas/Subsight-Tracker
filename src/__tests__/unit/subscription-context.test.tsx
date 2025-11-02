import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SubscriptionProvider, useSubscriptions } from '@/contexts/subscription-context';
import type { Subscription } from '@/lib/types';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SubscriptionProvider>{children}</SubscriptionProvider>
);

describe('SubscriptionContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should add subscription', () => {
    const { result } = renderHook(() => useSubscriptions(), { wrapper });

    act(() => {
      result.current.addSubscription({
        name: 'Netflix',
        provider: 'Netflix Inc',
        category: 'Entertainment',
        icon: 'streaming',
        startDate: new Date().toISOString(),
        billingCycle: 'monthly',
        amount: 15.99,
        currency: 'USD',
        notes: '',
        activeStatus: true,
        autoRenew: true,
      });
    });

    expect(result.current.subscriptions).toHaveLength(1);
    expect(result.current.subscriptions[0].name).toBe('Netflix');
  });

  it('should update subscription', () => {
    const { result } = renderHook(() => useSubscriptions(), { wrapper });

    act(() => {
      result.current.addSubscription({
        name: 'Netflix',
        provider: 'Netflix Inc',
        category: 'Entertainment',
        icon: 'streaming',
        startDate: new Date().toISOString(),
        billingCycle: 'monthly',
        amount: 15.99,
        currency: 'USD',
        notes: '',
        activeStatus: true,
        autoRenew: true,
      });
    });

    const id = result.current.subscriptions[0].id;

    act(() => {
      result.current.updateSubscription(id, { amount: 19.99 });
    });

    expect(result.current.subscriptions[0].amount).toBe(19.99);
  });

  it('should delete subscription', () => {
    const { result } = renderHook(() => useSubscriptions(), { wrapper });

    act(() => {
      result.current.addSubscription({
        name: 'Netflix',
        provider: 'Netflix Inc',
        category: 'Entertainment',
        icon: 'streaming',
        startDate: new Date().toISOString(),
        billingCycle: 'monthly',
        amount: 15.99,
        currency: 'USD',
        notes: '',
        activeStatus: true,
        autoRenew: true,
      });
    });

    const id = result.current.subscriptions[0].id;

    act(() => {
      result.current.deleteSubscription(id);
    });

    expect(result.current.subscriptions).toHaveLength(0);
  });
});
