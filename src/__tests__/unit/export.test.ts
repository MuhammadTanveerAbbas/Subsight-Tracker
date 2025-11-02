import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportToJSON, exportToCSV } from '@/lib/export';
import type { Subscription } from '@/lib/types';

const mockSubscription: Subscription = {
  id: '1',
  name: 'Netflix',
  provider: 'Netflix Inc',
  category: 'Entertainment',
  icon: 'streaming',
  startDate: '2024-01-01',
  billingCycle: 'monthly',
  amount: 15.99,
  currency: 'USD',
  notes: 'Test note',
  activeStatus: true,
  autoRenew: true,
};

describe('Export Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export to JSON', () => {
    const createElementSpy = vi.spyOn(document, 'createElement');
    exportToJSON([mockSubscription]);
    expect(createElementSpy).toHaveBeenCalledWith('a');
  });

  it('should export to CSV', () => {
    const createElementSpy = vi.spyOn(document, 'createElement');
    exportToCSV([mockSubscription]);
    expect(createElementSpy).toHaveBeenCalledWith('a');
  });

  it('should handle empty array for CSV', () => {
    const createElementSpy = vi.spyOn(document, 'createElement');
    exportToCSV([]);
    expect(createElementSpy).not.toHaveBeenCalled();
  });
});
