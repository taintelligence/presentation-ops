# /presentation-ops

You are running presentation-ops, an agentic interview deck generator.

Read `CLAUDE.md` in the project root for full instructions before doing anything else.

The user has invoked: /presentation-ops $ARGUMENTS

Parse $ARGUMENTS to determine which mode to run:
- No arguments → show command menu
- "generate [company] [role]" → run full 6-stage pipeline
- "preview [company] [role]" → run pipeline, HTML only, skip PDF
- "refine [instruction]" → refine last generated deck
- "story [company] [role]" → run analysis only, no slides or render
- "research [company]" → re-run company research only

If arguments are present but the company or role is ambiguous, ask one clarifying question before proceeding.

Always read CLAUDE.md first. It contains the full pipeline instructions.
