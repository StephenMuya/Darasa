// globals
import { CBCInquiryService } from '../services/cbcInquiryService';

describe('CBCInquiryService – domain logic & rubrics', () => {
  it('generates zero-cost practical materials for improvised experiment queries', () => {
    const result = CBCInquiryService.generateResponse('How can I improvise materials for a science task?');
    expect(result.text).toContain('zero-cost household resources');
    expect(result.materials).toBeDefined();
    expect(result.materials?.length).toBeGreaterThan(0);
    expect(result.followUps.length).toBeGreaterThan(0);
  });

  it('generates official 4-tier rubric for rubric assessment queries', () => {
    const result = CBCInquiryService.generateResponse('Create a formative assessment rubric for Grade 7');
    expect(result.text).toContain('official 4-tier formative assessment rubric');
    expect(result.rubric).toBeDefined();
    expect(result.rubric?.ee).toContain('Exceeding Expectations');
    expect(result.rubric?.me).toContain('Meeting Expectations');
    expect(result.rubric?.ae).toContain('Approaching Expectations');
    expect(result.rubric?.be).toContain('Below Expectations');
  });

  it('generates standard CBC lesson plan outline for scheme queries', () => {
    const result = CBCInquiryService.generateResponse('Draft a 40-minute CBC lesson plan for agriculture');
    expect(result.text).toContain('standard 40-minute CBC lesson plan');
    expect(result.materials).toContain(
      'Specific Learning Outcomes: By end of lesson, learner should identify and explain core processes.'
    );
  });

  it('returns Socratic inquiry guidance for open-ended questions', () => {
    const result = CBCInquiryService.generateResponse('Tell me about photosynthesis in Kenyan flora');
    expect(result.text).toContain('Competency-Based Curriculum framework');
    expect(result.rubric).toBeDefined();
    expect(result.followUps.length).toBe(3);
  });
});
