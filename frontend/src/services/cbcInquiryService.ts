import type { RubricTier } from '../components/chat/chatTypes';

/**
 * Result structure returned by the CBC pedagogical inquiry engine.
 */
export interface CBCInquiryResult {
  text: string;
  materials?: string[];
  rubric?: RubricTier;
  followUps: string[];
}

/**
 * CBCInquiryService
 *
 * Domain Service: Encapsulates business logic and pedagogical grounding
 * rules for Kenya's Competency-Based Curriculum (CBC) framework.
 *
 * Adheres to:
 * - KICD Junior Secondary & Primary curriculum designs
 * - 4-Tier Formative Assessment Reporting (EE 4, ME 3, AE 2, BE 1)
 * - Zero-cost local materials substitution guidelines
 */
export class CBCInquiryService {
  /**
   * Evaluates an educator or learner prompt and returns structured curriculum intelligence.
   */
  public static generateResponse(query: string): CBCInquiryResult {
    const lower = query.toLowerCase();

    // 1. Practical Local Materials & Improvised Apparatus
    if (lower.includes('materials') || lower.includes('craft') || lower.includes('improvise')) {
      return {
        text: 'Practical CBC activities should never burden parents with expensive commercial supplies. Here is an improvised list using zero-cost household resources:',
        materials: [
          'Repurposed clean plastic containers, bottles, or cartons',
          'Sisal twine, banana fibers, or cotton waste string',
          'Local soils (clay, loam, sand) and organic compost',
          'Improvised ruler from discarded timber or cardboard strips',
        ],
        followUps: [
          'Provide safety tips for learners handling these materials',
          'Generate home assignment instructions for parents',
        ],
      };
    }

    // 2. Official 4-Tier Formative Assessment Rubrics
    if (lower.includes('rubric') || lower.includes('assess')) {
      return {
        text: 'Here is an official 4-tier formative assessment rubric calibrated directly for this competency strand, adhering to KICD guidelines for formative reporting:',
        rubric: {
          strand: 'Competency Assessment Strand',
          ee: 'Exceeding Expectations (4): Demonstrates mastery, connects concepts across strands, and assists peers effectively.',
          me: 'Meeting Expectations (3): Completes tasks accurately in accordance with specified criteria and rubrics.',
          ae: 'Approaching Expectations (2): Demonstrates basic understanding but requires scaffolding on complex steps.',
          be: 'Below Expectations (1): Demonstrates limited grasp and requires step-by-step guidance.',
        },
        followUps: [
          'How do I record this in the school formative portfolio?',
          'Suggest remediation activities for Below Expectations learners',
        ],
      };
    }

    // 3. Structured 40-Minute CBC Lesson Plan Outline
    if (lower.includes('lesson plan') || lower.includes('scheme')) {
      return {
        text: 'Here is a standard 40-minute CBC lesson plan outline structured with the official KICD strands, sub-strands, specific learning outcomes, and core competencies:',
        materials: [
          'Specific Learning Outcomes: By end of lesson, learner should identify and explain core processes.',
          'Key Inquiry Question: How does this practical observation connect to everyday life in Kenya?',
          'Core Competencies: Critical thinking, communication, self-efficacy, and digital literacy.',
        ],
        rubric: {
          strand: 'Formative Lesson Rubric',
          ee: 'EE 4: Extends inquiry beyond lesson scope.',
          me: 'ME 3: Meets all 3 specific learning outcomes.',
          ae: 'AE 2: Meets 1 or 2 outcomes with assistance.',
          be: 'BE 1: Struggles to meet outcomes without continuous supervision.',
        },
        followUps: [
          'Export this plan to Word or PDF format',
          'Create a corresponding 10-minute starter activity',
        ],
      };
    }

    // 4. Default: Socratic Guidance & Open Inquiry Challenge
    return {
      text: "Excellent CBC inquiry! Based on Kenya's Competency-Based Curriculum framework, learning is experiential and problem-driven. Rather than simply giving the final answer, let's explore this step-by-step: What key observations have you or your learners made so far?",
      materials: [
        'Learner observation notebook or digital portfolio',
        'Locally improvised apparatus relevant to the strand',
      ],
      rubric: {
        strand: 'Inquiry & Investigation Strand',
        ee: 'Exceeding Expectations (4): Independently formulates hypotheses and links concepts to real-world applications.',
        me: 'Meeting Expectations (3): Accurately demonstrates and documents core learning outcomes.',
        ae: 'Approaching Expectations (2): Demonstrates basic concepts with peer or educator prompting.',
        be: 'Below Expectations (1): Requires continuous step-by-step guidance to conduct investigation.',
      },
      followUps: [
        'Break this down for Junior Secondary Grade 7 learners',
        'Provide a practical hands-on experiment',
        'Create a 4-tier rubric for this topic',
      ],
    };
  }
}
