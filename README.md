# presentation-ops

> Drop your CV. Say who you're interviewing with. Get a fully tailored, company-branded interview presentation — automatically.

Built on Claude Code. No templates, no manual research, no design work. One input. One output. A PDF deck that makes you look like you spent a week preparing.

---

## Why I Built This

My sister is a CDI-accredited career coach in Barcelona. She spent three hours manually building a 4-slide interview deck for a client last week — researching the company, writing tailored copy, matching the design to the brand.

I built presentation-ops to automate that entire process. Not with a template — with an agentic pipeline that researches the company, finds the job description, extracts brand colours, and writes slide copy that could only work for that specific person at that specific company for that specific role.

The first run produced a 6-slide deck for a SafetyCulture TA Partner role in Sydney. It referenced Luke Anear's return as CEO in February 2026, SafetyCulture's "Be Bold Bring Action" cultural value, and named Atlassian, Canva, and Afterpay as direct competitors for Sydney engineering talent. Autonomously. In under 5 minutes.

---

## What It Does

You provide:
- Your CV (once, reused forever)
- Company name
- Job title and location

The tool does everything else:

- Stage 1: Read CV and auto-generate candidate profile
- Stage 2: Find the job description autonomously (web search and scrape)
- Stage 3: Research the company (mission, values, culture, news, brand colours)
- Stage 4: Analyse fit (CV vs JD vs company context)
- Stage 5: Write 5-6 slides of tailored copy
- Stage 6: Render branded HTML deck and export PDF

Output files saved to output/:
- {company}-{date}-jd.md — the JD the tool found
- {company}-{date}-research.md — company intel (doubles as interview prep notes)
- {company}-{date}-deck.html — rendered deck
- {company}-{date}-deck.pdf — final presentation

---

## What This Demonstrates (TA Perspective)

This project was built to solve a problem I identified firsthand in Talent Acquisition.

Interview presentations are universally generic. Candidates spend hours manually researching companies, writing copy, and building slides — or they don't bother and show up with a 5-bullet "about me" deck that tells the interviewer nothing useful.

The intelligence layer is the differentiator. A deck that references a company's recent CEO change, mirrors their cultural language, and names their direct talent competitors is not a template — it's a signal that the candidate actually understands the business they're walking into.

This tool automates that signal at scale.

---

## The Slide Structure

- Slide 1: Who I Am — name, title, positioning statement using the company's own language
- Slide 2: The Journey — career narrative arc toward this specific role
- Slide 3: What I Bring — 3 proof points mapped directly to JD requirements
- Slide 4: Why [Company] — specific and researched, references real news and initiatives
- Slide 5: How I Work — working principles tied to company values
- Slide 6: What I'd Do — first 90 days, grounded in the company's current strategic context

---

## Usage

Open Claude Code inside the project folder and run:

    /presentation-ops generate Booking.com "Talent Intelligence Manager Amsterdam"
    /presentation-ops preview Netflix "Data Scientist Personalisation"
    /presentation-ops refine "Make slide 4 more specific about their AI investment"
    /presentation-ops story Anthropic "Recruiter San Francisco"

---

## Setup

    git clone https://github.com/taintelligence/presentation-ops.git
    cd presentation-ops
    npm install

Add your CV as cv.md in the project root, then open Claude Code:

    claude

Claude will auto-generate your profile from the CV on first run.

---

## Stack

- Claude Code — agentic execution, web search, file management
- Puppeteer — headless Chrome for HTML to PDF rendering
- HTML and CSS — slide design with CSS variable brand colour injection
- Node.js — PDF generation script
- Markdown and YAML — data and config layer

---

## Status

v1 — tested on SafetyCulture (Sydney, AU). Actively iterating.

Next: second company test, refine command validation, output deck screenshot added to README.

---

Part of a growing portfolio of Claude Code tools built to solve real Talent Acquisition problems.
github.com/taintelligence
