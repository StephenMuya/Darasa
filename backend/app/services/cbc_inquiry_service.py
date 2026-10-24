from app.schemas.chat import PracticalMaterial
from app.schemas.rubric import RubricTier


class CBCInquiryService:
    """
    Kenya Competency-Based Curriculum (CBC) Pedagogical Reasoning Service
    Single responsibility: analyze pedagogical inquiries and generate structured
    competency guidance, official 4-tier formative rubrics, and zero-cost local materials.
    """

    @classmethod
    def generate_pedagogical_response(cls, query: str, role: str = "teacher") -> dict:
        """
        Analyze prompt query and return domain-structured pedagogical artifacts.
        """
        normalized = query.lower()

        # 1. Zero-cost practical materials query
        if any(
            w in normalized
            for w in [
                "material",
                "improvise",
                "practical",
                "activity",
                "zero cost",
                "soil",
                "bottle",
                "craft",
            ]
        ):
            materials = [
                PracticalMaterial(
                    item="2L used plastic bottle (cleaned)",
                    purpose="Slow-drip water reservoir with pinhole base",
                    source="Locally recycled household container",
                ),
                PracticalMaterial(
                    item="Heated safety pin or wire nail (with teacher supervision)",
                    purpose="Perforating precise drip micro-apertures",
                    source="Standard household / laboratory kit",
                ),
                PracticalMaterial(
                    item="Sisal twine and wooden support pegs",
                    purpose="Upright stabilization next to potted sukuma wiki seedlings",
                    source="Local garden / kitchen supplies",
                ),
                PracticalMaterial(
                    item="Dry grass mulch / banana leaf fibers",
                    purpose="Moisture conservation barrier around plant root zone",
                    source="School grounds / organic farm waste",
                ),
            ]
            text = (
                "Based on the KICD Grade 6 Agriculture & Science Curriculum Designs, here is your "
                "practical activity guide using zero-cost household resources. Learners actively practice "
                "problem-solving and environmental conservation by constructing functional micro-irrigation models."
            )
            follow_ups = [
                "Generate the corresponding 4-tier assessment rubric",
                "How do I scaffold this for Grade 5 learners?",
                "Provide reflection questions for learners' CBC portfolios",
            ]
            rubric = None

        # 2. Formative assessment rubric query
        elif any(
            w in normalized
            for w in ["rubric", "assess", "formative", "grading", "criteria", "tier"]
        ):
            materials = None
            rubric = RubricTier(
                strand="2.0 Crop Production  -  Water Conservation Practices",
                sub_strand="2.3 Improvised Drip Irrigation",
                ee="Exceeding Expectations (Level 4): Seamlessly designs, calculates drip rate duration (e.g. 500ml/hr), and evaluates soil moisture retention with zero assistance.",
                me="Meeting Expectations (Level 3): Correctly constructs an improvised bottle drip model that maintains steady root-zone hydration.",
                ae="Approaching Expectations (Level 2): Assembles the model with minor assistance; requires guidance to calibrate pinhole size for steady dripping.",
                be="Below Expectations (Level 1): Struggles to assemble materials; requires substantial scaffolding to demonstrate drip concept.",
            )
            text = (
                "Here is the official 4-tier formative assessment rubric structured strictly according "
                "to KICD competency benchmarks (EE 4, ME 3, AE 2, BE 1)."
            )
            follow_ups = [
                "Export rubric criteria to printable format",
                "How do I record this in the school Link Book?",
                "Suggest remediation activities for Below Expectations learners",
            ]

        # 3. Lesson plan / scheme of work inquiry
        elif any(
            w in normalized
            for w in ["lesson", "scheme", "plan", "curriculum", "strand"]
        ):
            materials = None
            rubric = None
            text = (
                "Here is an inquiry-based lesson plan structured for 40 minutes under Kenya CBC guidelines:\n\n"
                "• Introduction (5 mins): Engage learners with a local real-world problem scenario.\n"
                "• Exploration (20 mins): Group collaboration using practical hands-on tasks.\n"
                "• Synthesis (10 mins): Learner presentations and Socratic question checks.\n"
                "• Assessment & Conclusion (5 mins): Self-reflection recorded in their CBC Learning Portfolios."
            )
            follow_ups = [
                "List core competencies addressed in this lesson",
                "What values (integrity, respect, unity) are fostered here?",
                "How to adapt this for learners with special educational needs?",
            ]

        # 4. Default pedagogical assistant guidance
        else:
            materials = None
            rubric = None
            text = (
                f"Welcome to Darasa CBC Intelligence. I am ready to support your educational inquiries "
                f"on curriculum designs, competency evaluations, and interactive lesson planning. "
                f"You asked: '{query}'."
            )
            follow_ups = [
                "How can I improvise materials for a practical science task?",
                "Create a formative assessment rubric for Grade 7",
                "Draft a 40-minute CBC lesson plan outline",
            ]

        return {
            "text": text,
            "materials": materials,
            "rubric": rubric,
            "follow_ups": follow_ups,
        }
