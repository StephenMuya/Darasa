/**
 * chatService.test.ts
 *
 * Unit tests for chatService: inquiry dispatch, materials normalization,
 * and offline fallback resilience.
 */

// vitest globals
import { chatService } from '../services/chatService';

describe('chatService', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('dispatches inquiry to backend and normalizes materials objects into strings', async () => {
    const mockBackendResp = {
      conversation_id: 'conv-101',
      message_id: 'msg-501',
      sender_name: 'Darasa CBC Assistant',
      text: 'Practical drip irrigation guidelines.',
      materials: [
        { item: '2L bottle', purpose: 'water tank', source: 'local' },
        'Sisal string',
      ],
      rubric: {
        strand: 'Crop Production',
        ee: 'EE 4',
        me: 'ME 3',
        ae: 'AE 2',
        be: 'BE 1',
      },
      follow_ups: ['How to assess?'],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockBackendResp,
    } as Response);

    const result = await chatService.sendInquiry('How to build drip irrigation?');
    expect(result.conversationId).toBe('conv-101');
    expect(result.text).toBe('Practical drip irrigation guidelines.');
    expect(result.materials).toBeDefined();
    expect(result.materials?.length).toBe(2);
    expect(result.materials?.[0]).toContain('2L bottle (water tank)');
    expect(result.materials?.[1]).toBe('Sisal string');
    expect(result.rubric?.strand).toBe('Crop Production');
  });

  it('falls back gracefully to local CBC intelligence if backend fails or is offline', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'));

    const result = await chatService.sendInquiry('How to improvise science craft materials?');
    expect(result).toBeDefined();
    expect(result.text).toContain('zero-cost household resources');
    expect(result.materials?.length).toBeGreaterThan(0);
    expect(result.followUps.length).toBeGreaterThan(0);
  });

  it('creates conversation session', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: 'conv-999', title: 'Test Session' }),
    } as Response);

    const conv = await chatService.createConversation('Test Session');
    expect(conv.id).toBe('conv-999');
  });
});