# Presentation-Ops — AI Interview Deck Generator

## What This Is

An agentic Claude Code tool that takes a candidate's CV and generates a fully tailored, company-branded interview presentation deck — automatically. No JD hunting, no manual research, no design work. The user provides their CV once. Claude does the rest.

---

## Startup Check — Run Every Session

Before doing ANYTHING else, silently check:

1. Does `cv.md` exist in the project root?
2. Does `config/profile.yml` exist (not just profile.example.yml)?

If `cv.md` is missing:
> "I need your CV before I can build anything. You can:
> 1. Paste the full text here and I'll convert it to clean markdown
> 2. Describe your experience and I'll draft it for you
>
> Which works best?"

Create `cv.md` from whatever they provide. Clean markdown. Sections: Summary, Experience, Education, Skills, Achievements.

If `config/profile.yml` is missing, auto-generate it by reading `cv.md`. Extract: name, current title, email (if present), key skills, career narrative. Copy `config/profile.example.yml` as base, fill in what you can infer, leave blanks clearly marked.

If both exist, confirm silently and wait for a command.

---

## Slash Command: `/presentation-ops`

### `/presentation-ops` (no args)
Show the command menu:

```
Presentation-Ops — Interview Deck Generator

  generate [company] [role]   Full pipeline: research → analyse → write → design → PDF
  preview  [company] [role]   Same but HTML only, no PDF (faster for reviewing)
  refine   [instruction]      Edit the last generated deck with specific feedback
  story    [company] [role]   Show narrative reasoning only — review before rendering
  research [company]          Re-run company research only (refresh if news is stale)

Example:
  /presentation-ops generate Booking.com "Talent Intelligence Manager Amsterdam"
```

---

### `/presentation-ops generate [company] [role]`

This is the main command. Run the full 6-stage agentic pipeline below.

---

## The 6-Stage Agentic Pipeline

### STAGE 1 — INGEST

1. Read `cv.md` in full
2. Read `config/profile.yml`
3. Confirm to user: "Got your CV. Starting research for **[role]** at **[company]**..."
4. Set `{slug}` = lowercase company name with hyphens (e.g. `booking-com`)
5. Set `{date}` = today's date YYYY-MM-DD

---

### STAGE 2 — FIND THE JD

Search for the job listing autonomously. Try in this order:

**Attempt 1:** Web search: `"{company}" "{role}" job description {current year}`
**Attempt 2:** Web search: `site:{company-domain} "{role}" careers`
**Attempt 3:** Web search: `"{company}" "{role}" linkedin OR indeed OR glassdoor`

For each result, fetch the page and attempt to extract:
- Job title (confirm it matches what was requested)
- Full responsibilities section
- Full requirements/qualifications section
- Any "about the team" or "what you'll do" copy
- Location confirmation

Save the extracted JD to `output/{slug}-{date}-jd.md` in this format:

```markdown
# JD: {role} at {company}

**Source URL:** {url}
**Retrieved:** {date}

## Role Overview
{extracted overview}

## Responsibilities
{extracted responsibilities}

## Requirements
{extracted requirements}

## About the Team / Additional Context
{any other relevant sections}
```

**JD Confirmation Step:**
Show the user:
> "Found this listing: **{job title}** at **{company}**
> Source: {url}
>
> Does this look like the right role? (yes / no / paste JD instead)"

- If yes → proceed to Stage 3
- If no → ask them to paste the JD text directly, save it to `output/{slug}-{date}-jd.md` and proceed
- If the JD is behind a login or genuinely unfindable after 3 attempts → ask for paste, explain why

**NEVER proceed to Stage 3 without a confirmed JD.** Output quality depends on it.

---

### STAGE 3 — COMPANY RESEARCH

Research the company across 3 dimensions: identity, culture, and momentum.

#### 3a. Brand Colours

Try in this order:

**Step 1 — Brand guidelines search:**
Search: `"{company}" brand colors hex` or `"{company}" brand guidelines`
If found, extract primary and secondary hex values.

**Step 2 — CSS scrape:**
Fetch the company homepage. Look for:
- CSS custom properties (`--color-primary`, `--brand-*`, etc.)
- Repeated hex values in inline styles or `<style>` blocks
- Meta theme-color tag

**Step 3 — Logo/favicon fallback:**
Fetch `{company-domain}/favicon.ico` or og:image. Note dominant colours visually described.

**Step 4 — Fallback:**
If nothing reliable found, use neutral theme:
```
primary: "#1a1a2e"
secondary: "#4a9eff"
accent: "#ffffff"
background: "#ffffff"
text: "#1a1a2e"
```
Log: "Brand colours not found — using neutral professional theme."

Save extracted colours to the research file as a `brand_colors` block.

#### 3b. Company Identity

Fetch: company homepage + /about page (or /about-us, /company, /who-we-are)

Extract:
- Mission statement (exact wording if possible)
- Core values (named values, not generic descriptions)
- Company size, stage, industry positioning
- Key products or services
- Leadership names/titles if prominent on page

#### 3c. Culture Signals

Search: `"{company}" culture values employees {current year}`
Search: `"{company}" glassdoor culture` or `"{company}" working at`

Look for:
- How they describe their ideal employee
- Any awards (Best Place to Work etc.)
- How they talk about growth, autonomy, collaboration
- Recurring language patterns in job postings

#### 3d. Momentum & News

Search: `"{company}" news {current year}`
Search: `"{company}" product launch OR funding OR expansion OR partnership {current year}`
Search: `"{company}" {department relevant to role} {current year}` (e.g. "Booking.com data science 2025")

Extract:
- 3-5 most relevant recent developments
- Any strategic direction signals
- Industry context or challenges they're navigating

#### Save Research File

Write everything to `output/{slug}-{date}-research.md`:

```markdown
# Company Research: {company}

**Generated:** {date}

## Brand Colours
- Primary: {hex}
- Secondary: {hex}
- Accent: {hex}
- Background: {hex}
- Text: {hex}

## Mission & Values
{extracted mission}
{extracted values}

## Company Identity
{size, stage, products, positioning}

## Culture Signals
{how they describe themselves, recurring language}

## Recent News & Momentum
{3-5 relevant developments with dates}

## Strategic Context
{relevant direction for this role/department}
```

---

### STAGE 4 — ANALYSE

Before writing a single slide, reason through the following. Write this reasoning into a `## Analysis` section at the top of the slide content file — the candidate should be able to read it and understand the strategic logic.

**4a. Role Decomposition**
What are the 3 real hiring needs behind this JD? Not the listed requirements — the underlying problems this company is trying to solve by hiring for this role. Read between the lines.

**4b. CV-to-JD Bridge**
For each of the 3 hiring needs: which specific part of the candidate's background (role, project, achievement, skill) most directly addresses it? Be specific — cite the experience and the metric if one exists.

**4c. Company Angle**
For each slide: which company value, mission element, or recent initiative can be authentically referenced? This should feel researched, not forced.

**4d. Narrative Arc**
What is the single most compelling 60-second story that makes this candidate feel like the inevitable choice for this role? This becomes the spine of the deck.

**4e. Gap Check**
Are there JD requirements the CV doesn't obviously cover? Flag them honestly. Note how the deck will navigate around them — either by framing adjacent experience, or by simply not drawing attention to the gap.

---

### STAGE 5 — WRITE THE SLIDES

Generate 5-6 slides of structured copy. Every line must be:
- Specific to this candidate (no generic claims)
- Tied to either a JD requirement OR a company signal
- Written in the candidate's voice (read the CV's register and match it)

**NEVER write anything that could appear in any interview deck. If a line is generic, rewrite it.**

Use this slide structure:

---

**SLIDE 1 — WHO I AM**
- Candidate name (large)
- Current/most recent title
- One positioning statement (15-20 words max) that uses language from the company's own about page or values
- Role being applied for + company name

*Goal: Make the interviewer feel they already know who this person is and why they're here.*

---

**SLIDE 2 — THE JOURNEY**
- Not a CV timeline. A narrative arc.
- 3-4 beats that show logical progression toward THIS role at THIS company
- Each beat: what they did, what it built in them, why it matters now
- Final beat: why this role is the natural next step

*Goal: Make the career path feel inevitable, not accidental.*

---

**SLIDE 3 — WHAT I BRING**
- 3 proof points, each directly mapped to a JD requirement
- Format: [Skill/Strength] → [Specific example] → [Outcome/metric if available]
- Use the exact language from the JD where it strengthens the connection

*Goal: Remove doubt. Show don't tell.*

---

**SLIDE 4 — WHY {COMPANY}**
- Direct, specific, researched
- Reference something real: a product launch, a mission statement, a strategic direction
- Connect it to something in the candidate's own values or approach
- This should be uncomfortable to read if the company name were swapped out — that's how you know it's working

*Goal: Signal that this isn't a numbers game. This is a deliberate choice.*

---

**SLIDE 5 — HOW I WORK**
- 3-4 working principles or values
- Each one connected to a real example from the CV
- At least one must echo a company value from the research

*Goal: Give the interviewer a preview of what it's like to work with this person.*

---

**SLIDE 6 — WHAT I'D DO (optional — include if profile.yml has `include_contribution_slide: true`)**
- Forward-looking: 2-3 specific things the candidate would prioritise in the first 90 days
- Grounded in the JD and the company's current strategic context
- Shows initiative and strategic thinking without overstepping

*Goal: Turn a retrospective deck into a prospective one. This is the slide that gets remembered.*

---

Save slide copy to `output/{slug}-{date}-slides.md` with clear slide delimiters.

---

### STAGE 6 — RENDER + PDF

1. Read `output/{slug}-{date}-slides.md`
2. Read brand colours from `output/{slug}-{date}-research.md`
3. Read `templates/deck-template.html`
4. Inject slide content and brand colours into the template
5. Save rendered HTML to `output/{slug}-{date}-deck.html`
6. Run: `node generate-deck.mjs output/{slug}-{date}-deck.html output/{slug}-{date}-deck.pdf`
7. Log to `history/decks.md`:
   ```
   | {date} | {company} | {role} | {slug}-{date}-deck.pdf | {jd source url} |
   ```
8. Confirm to user:
   > "Done. Your deck is ready:
   > PDF: `output/{slug}-{date}-deck.pdf`
   > Research notes: `output/{slug}-{date}-research.md`
   >
   > Run `/presentation-ops refine [instruction]` to adjust anything."

---

### `/presentation-ops preview [company] [role]`

Same as `generate` but skip Stage 6 PDF step. Output HTML only. Faster for reviewing copy and design before committing to PDF.

---

### `/presentation-ops refine [instruction]`

Load the most recently generated slide file from `output/`. Apply the instruction to the relevant slide(s). Re-render HTML and PDF. Log the refinement in `history/decks.md` as a sub-entry.

Examples:
- `/presentation-ops refine Make slide 4 more specific about their AI investment`
- `/presentation-ops refine Slide 3 proof point 2 — use the Booking.com example instead`
- `/presentation-ops refine Tone down the confidence on slide 5, make it more collaborative`

---

### `/presentation-ops story [company] [role]`

Run Stages 1-4 only. Output the analysis and narrative arc for review. Do not write slides or render anything. Useful for reviewing strategic logic before committing to a full deck.

---

### `/presentation-ops research [company]`

Re-run Stage 3 only for a company. Useful if news is stale or the research file needs refreshing. Overwrites the existing research file.

---

## Design Principles

**Quality over speed.** This deck represents the candidate in a room. Every line matters.

**Specificity is the product.** A deck that could work for any candidate at any company has failed. The goal is a deck that could only work for THIS person at THIS company for THIS role.

**Honest framing over spin.** If there's a gap between the CV and the JD, navigate around it with adjacent strengths. Never fabricate credentials or imply experience that isn't there.

**The candidate owns the output.** Always stop before submitting, sending, or sharing anything. The deck is a draft until the human reviews it.

---

## File Conventions

- Slugs: lowercase, hyphens, no spaces (`booking-com`, `google-deepmind`)
- Dates: YYYY-MM-DD
- Output files: `output/{slug}-{date}-{type}.{ext}`
- All output is gitignored — never commit generated decks
- `cv.md` is never auto-modified after initial creation
- `config/profile.yml` can be edited by Claude if user asks for updates

---

## Stack

- Claude Code (agentic execution)
- Node.js / Puppeteer (PDF generation via `generate-deck.mjs`)
- HTML + CSS with CSS variables (brand colour injection)
- Markdown (data layer)
- YAML (config)
