# AI-103 Content Re-alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-align the prose, front matter, branding, and key terms of the CSC-214 _Applied Azure AI_ OER textbook from Microsoft AI-102 to AI-103, mapping every chapter's labs to the official AI-103T00-A 22-lab list.

**Architecture:** Edit AsciiDoc sources under `modules/ROOT/`. "Tests" are non-code gates: the Antora site builds with no broken xref/image targets, grep gates confirm retired services are gone and branding is consistent, and each chapter's Hands-On section references only its mapped labs from the 22-lab list. Work stays on branch `ai-103-realignment`; PR to `main` at the end. Graphics regeneration and worksheet rework are separate follow-on plans.

**Tech Stack:** AsciiDoc, Antora 3.1, Node 20 (UI bundle via gulp). Code samples in Python (Azure/Foundry SDKs).

**Source of truth:** `docs/superpowers/specs/2026-05-25-ai-103-realignment-design.md`. Read it before starting. Domain weights, the 22-lab list, the chapter→lab remapping (spec §5), and per-chapter transformations (spec §6) govern every task here.

---

## Conventions used by every chapter task

**Preserve the established chapter skeleton** (verified against Ch1/Ch6/Ch7/Ch8): `= Chapter N: Title` → `== Learning Objectives` (numbered) → numbered sections `== N.x` → `== N.(last-2) Hands-On Connections` → `== N.(last-1) Assessment Preparation` → `== N.last Key Terms` (`term::` definition lists) → final `== Chapter Summary`. Keep `[NOTE]`/`[TIP]`/`[IMPORTANT]`/`[WARNING]====` callouts, annotated `[source,python]` blocks with `<1>` callouts, `image::ch0N/...png[...]` figures, and `xref:chNN-...adoc[...]` cross-references.

**Branding (after Task 1):** use "Microsoft Foundry" (not "Azure AI Foundry") and "Foundry Tools" (not "Azure AI Services"). Exactly one explanatory NOTE about the rename lives in Ch1.

**Figures:** keep existing `image::` references where the spec marks a figure as surviving or rebrand-only (the PNG files already exist and keep their filenames). Where the spec marks a figure replaced or new, still write the `image::` reference with the planned new filename (graphics plan generates the PNG later) and add an AsciiDoc comment `// GRAPHIC TODO: <desc>` above it so the graphics plan can find it. A missing PNG does not break the Antora build (only a warning), so the book still builds.

**Reusable verification commands** (run from repo root unless noted):

- **B — Build the site:**
  ```bash
  cd ui && npm ci && npx gulp bundle && cd ..
  npm i -g @antora/cli@3.1 @antora/site-generator@3.1
  antora site.yml 2>&1 | tee /tmp/antora-build.log
  ```
  Expected: command exits 0. (UI bundle install only needs to happen once per environment.)
- **X — No broken xref/image targets:**
  ```bash
  grep -iE "target .* not found|unresolved|could not resolve" /tmp/antora-build.log || echo "NO BROKEN TARGETS"
  ```
  Expected: `NO BROKEN TARGETS` (image PNGs that the graphics plan will create are the only allowed "image not found" warnings).
- **R — Retired services gone from prose:**
  ```bash
  grep -rniE "custom vision|face detection|face service|qna maker|question answering knowledge base|form recognizer|language studio|knowledge mining|enrichment tree|knowledge store" modules/ROOT/pages
  ```
  Expected: no matches except intentional deprecation/migration notes (each such allowed match is called out in its task).
- **L — Lab references valid:** the chapter's Hands-On section names only labs from spec §4 with the numbers assigned in spec §5.

---

## Phase 0 — Front matter, branding, and global terminology

### Task 1: Global branding rename + AI-102→AI-103 front matter

**Files:**
- Modify: `README.md`
- Modify: `modules/ROOT/pages/index.adoc`
- Modify: `modules/ROOT/nav.adoc`
- Modify: `site.yml`, `antora.yml` (titles only if they reference AI-102/old names)
- Modify: all `modules/ROOT/pages/ch0*.adoc` (branding strings only — full chapter rewrites happen in later tasks; this task only does the find/replace of brand strings that are safe to change globally)

- [ ] **Step 1: Inventory current brand strings**

```bash
cd "$(git rev-parse --show-toplevel)"
grep -rno "Azure AI Foundry" modules/ROOT/pages README.md | wc -l
grep -rno "Azure AI Services\|Azure AI services" modules/ROOT/pages README.md | wc -l
grep -rno "AI-102" modules/ROOT/pages README.md
```
Expected: nonzero counts (baseline). Record them.

- [ ] **Step 2: Replace platform brand strings**

Replace across `modules/ROOT/pages/*.adoc` and `README.md`:
- `Azure AI Foundry` → `Microsoft Foundry`
- `Azure AI Services` / `Azure AI services` → `Foundry Tools`

Do NOT blanket-replace specific service names like "Azure AI Vision" or "Azure AI Language" in this task — those are handled in the chapter rewrites where context decides the correct AI-103 service (often Content Understanding or Foundry Tools).

- [ ] **Step 3: Update `README.md` to AI-103**

Rewrite the intro line and the chapter table. New header: the book aligns to **AI-103 (Azure AI App and Agent Developer Associate)**, an 8-week course. Replace the 8-row chapter/topic/services table with the spec §5 chapter titles and AI-103 services (Foundry, RAG, agents/MCP/Foundry IQ/Agent Framework, text analysis, Voice Live, vision generation + Content Understanding, multimodal extraction). Remove the "AI-102 certification blueprint" phrasing.

- [ ] **Step 4: Update `index.adoc` About + TOC**

In `modules/ROOT/pages/index.adoc`: change the AI-102 sentence (line ~7) to AI-103 and the new cert name; update the TOC table rows to the spec §5 chapter titles and descriptions; keep the CC BY-NC license paragraph and CSC-214 attribution.

- [ ] **Step 5: Update `nav.adoc` chapter titles**

Set the eight `xref:` labels to the spec §5 titles (e.g., `3. Building AI Agents: Tools & Functions`, `6. Text Analysis & Conversational Speech Agents`, `7. Vision: Multimodal Understanding & Image Generation`, `8. Multimodal Information Extraction & Capstone`). Keep filenames unchanged for now (file renames are out of scope — chapter `.adoc` filenames stay; only titles change).

- [ ] **Step 6: Add the one-time rename NOTE to Ch1**

In `modules/ROOT/pages/ch01-generative-ai-foundations.adoc`, replace the existing "Azure OpenAI Service / Azure OpenAI Studio" NOTE (around line 51-54) with a NOTE that explains: Microsoft Foundry was formerly "Azure AI Foundry," Foundry Tools were formerly "Azure AI Services," and older docs/tutorials may still use the old names and the "Azure OpenAI" portal.

- [ ] **Step 7: Verify branding + titles**

```bash
grep -rn "Azure AI Foundry" modules/ROOT/pages README.md   # expect: 0
grep -rn "Azure AI Services\|Azure AI services" modules/ROOT/pages README.md   # expect: 0
grep -rn "Microsoft Foundry" modules/ROOT/pages | head        # expect: many
grep -rn "AI-102" modules/ROOT/pages README.md                # expect: 0 (or only inside a deliberate "formerly AI-102" note)
```
Then run **B** and **X**. Expected: build exits 0; `NO BROKEN TARGETS`.

- [ ] **Step 8: Commit**

```bash
git add README.md site.yml antora.yml modules/ROOT/nav.adoc modules/ROOT/pages
git commit -m "docs: global rebrand to Microsoft Foundry/Foundry Tools and AI-103 front matter"
```

---

## Phase 1 — Chapter rewrites (dependency order: 1 → 8)

> Each chapter task: rewrite per the spec §6 checklist for that chapter, retarget the Hands-On Connections section to the mapped labs, refresh Key Terms, verify (B, X, R, L + chapter-specific greps), commit. Read spec §6 for the chapter before editing.

### Task 2: Chapter 1 — Foundations: Models, Deployment & Evaluation

**Files:**
- Modify: `modules/ROOT/pages/ch01-generative-ai-foundations.adoc`

- [ ] **Step 1: Update title + Learning Objectives**

Set `= Chapter 1: Foundations: Models, Deployment & Evaluation`. Keep LOs 1–2 (deployment comparison, chat completion config). Replace/extend LO 3 to cover **model evaluation** (compare models and interpret evaluation output), since Lab 2 is "Explore models and evaluate performance." Add an LO for basic **secure project setup** (keyless auth / managed identity) — the AI-103 Plan & manage thread.

- [ ] **Step 2: Add the Plan & manage opening thread**

In §1.2 (the Foundry platform section), add coverage of: creating a Foundry project, **keyless authentication / managed identity** (vs. API keys), and region/quota/cost basics. Keep the existing model-catalog/deployment/monitoring framing. Keep code using `AzureOpenAI`; add a note that keyless auth uses `DefaultAzureCredential` and show a 4–6 line variant.

- [ ] **Step 3: Add a model-evaluation section**

Add a new section (e.g., §1.6 "Comparing and Evaluating Models") covering side-by-side model comparison in the catalog and reading evaluation metrics (quality/latency/cost) — tie explicitly to Lab 2. Keep it focused (300–500 words + one optional figure ref `// GRAPHIC TODO: model comparison/evaluation view`).

- [ ] **Step 4: Retarget Hands-On Connections to Labs 1–3**

Rewrite the labs section to reference: **Lab 1 — Prepare for an AI development project**, **Lab 2 — Explore models and evaluate performance**, **Lab 3 — Create a generative AI chat app**. Remove the old "Lab 01 / Lab 02" deploy-and-chat framing where it no longer matches.

- [ ] **Step 5: Update Key Terms + Summary**

Add terms: `managed identity`, `keyless authentication`, `model evaluation` (and keep token/temperature/etc.). Update the chapter summary's forward-reference to Ch2.

- [ ] **Step 6: Verify**

```bash
grep -niE "custom vision|face|qna|form recognizer|language studio" modules/ROOT/pages/ch01-generative-ai-foundations.adoc   # expect: 0
grep -n "Lab 1\|Lab 2\|Lab 3\|Foundry\|managed identity\|evaluat" modules/ROOT/pages/ch01-generative-ai-foundations.adoc | head
```
Run **B** and **X**. Expected: build 0; `NO BROKEN TARGETS`.

- [ ] **Step 7: Commit**

```bash
git add modules/ROOT/pages/ch01-generative-ai-foundations.adoc
git commit -m "docs(ch1): foundations + model evaluation + plan/manage thread for AI-103"
```

### Task 3: Chapter 2 — Grounding with RAG & Responsible AI

**Files:**
- Modify: `modules/ROOT/pages/ch02-rag-and-content-safety.adoc`

- [ ] **Step 1: Title + LOs.** Set `= Chapter 2: Grounding with RAG & Responsible AI`. Keep RAG + content-safety LOs; add an LO on **responsible-AI governance** (evaluators, trace logging/provenance, oversight) per AI-103 Plan & manage.

- [ ] **Step 2: Connect RAG to Foundry "use your own data".** In the RAG sections, frame the pipeline as the Foundry "add your own data" / grounding flow that Lab 4 builds. Keep chunking/embedding/grounding content.

- [ ] **Step 3: Deepen Responsible AI.** Expand the content-safety material into a broader RAI section: safety filters + guardrails + risk detection + content moderation (Lab 5), plus a paragraph each on **evaluators/safety evaluations** and **auditing via trace logging / provenance metadata**. Keep severity-threshold tradeoff content.

- [ ] **Step 4: Retarget Hands-On to Labs 4–5.** **Lab 4 — Create a generative AI app that uses your own data**; **Lab 5 — Apply content filters to prevent the output of harmful content**.

- [ ] **Step 5: Key Terms + Summary.** Add `groundedness`, `guardrail`, `evaluator`, `provenance/trace logging`. Update forward-reference to Ch3 (agents).

- [ ] **Step 6: Verify.** Run **R** scoped to the file (expect 0), **B**, **X**. Confirm only Labs 4–5 referenced.

- [ ] **Step 7: Commit.**
```bash
git add modules/ROOT/pages/ch02-rag-and-content-safety.adoc
git commit -m "docs(ch2): RAG-as-grounding + responsible AI governance for AI-103"
```

### Task 4: Chapter 3 — Building AI Agents: Tools & Functions

**Files:**
- Modify: `modules/ROOT/pages/ch03-evaluation-and-agents-intro.adoc` (note: filename keeps `evaluation` but content pivots; do not rename file)

- [ ] **Step 1: Title + LOs.** Set `= Chapter 3: Building AI Agents: Tools & Functions`. LOs: explain the agent paradigm (loop, agent-vs-chat), build an agent in the Foundry portal + VS Code, define and use a custom function tool, handle tool errors.

- [ ] **Step 2: Remove evaluation content.** Delete the model-evaluation sections (groundedness/relevance/coherence/fluency metric tour) — that material now lives in Ch1 (model eval) and Ch2 (RAI evaluators). Keep a one-line pointer: evaluation was introduced in Ch1–2. Keep the agent-execution-loop and agent-vs-chat sections.

- [ ] **Step 3: Add "build agents in portal + VS Code".** New section walking the Foundry Agent Service: define agent role/goal/instructions, attach a tool, run in portal then VS Code (Lab 6). Keep tool-definition-anatomy and tool-call-lifecycle content (move from old Ch4 if needed, but avoid duplicating Ch4).

- [ ] **Step 4: Add custom-function tool section.** Cover defining a custom function tool with a JSON schema and wiring it into an agent (Lab 7), with a Python sample.

- [ ] **Step 5: Retarget Hands-On to Labs 6–7.**

- [ ] **Step 6: Key Terms + Summary.** Add `Foundry Agent Service`, `agent instructions`, `function tool`. Remove evaluation-metric terms (now in Ch1–2). Forward-reference to Ch4 (MCP + Foundry IQ).

- [ ] **Step 7: Verify.** **R** (expect 0; specifically `grep -c "groundedness\|fluency metric"` should be ~0 here), **B**, **X**, only Labs 6–7.

- [ ] **Step 8: Commit.**
```bash
git add modules/ROOT/pages/ch03-evaluation-and-agents-intro.adoc
git commit -m "docs(ch3): pivot to building agents (portal/VS Code + custom functions)"
```

### Task 5: Chapter 4 — Agent Knowledge & Protocols: MCP & Foundry IQ

**Files:**
- Modify: `modules/ROOT/pages/ch04-agent-development.adoc` (keep filename; content pivots to MCP + Foundry IQ)

- [ ] **Step 1: Title + LOs.** Set `= Chapter 4: Agent Knowledge & Protocols: MCP & Foundry IQ`. LOs: explain MCP client-server and connect an agent to MCP tools; explain agentic retrieval and integrate an agent with a Foundry IQ knowledge base.

- [ ] **Step 2: MCP section.** Bring forward the MCP client-server, connection lifecycle, and tool discovery/invocation content (currently in Ch5). Frame around Lab 8 (Develop an AI agent with MCP tools). Keep MCP figures (`g5-1`, `g5-2`) but plan to move/renumber them in the graphics plan — for now reference the existing filenames and add `// GRAPHIC TODO: renumber MCP figures to ch04`.

- [ ] **Step 3: Foundry IQ section (NEW).** Write a new section on **Foundry IQ**: agentic retrieval as a reasoning task; multi-source, permission-aware knowledge bases (Blob/SharePoint/OneLake/web); query decomposition + semantic reranking; grounded answers with citations; how an agent consumes a knowledge base vs. raw RAG (callback to Ch2). Tie to Lab 9. Add `// GRAPHIC TODO: foundry-iq-agentic-retrieval`.

- [ ] **Step 4: Retarget Hands-On to Labs 8–9.**

- [ ] **Step 5: Key Terms + Summary.** Add `Model Context Protocol (MCP)`, `MCP server`, `Foundry IQ`, `agentic retrieval`, `knowledge base`. Forward-reference to Ch5 (Agent Framework + multi-agent).

- [ ] **Step 6: Verify.** **R**, **B**, **X**, only Labs 8–9.

- [ ] **Step 7: Commit.**
```bash
git add modules/ROOT/pages/ch04-agent-development.adoc
git commit -m "docs(ch4): MCP + Foundry IQ agent knowledge/protocols"
```

### Task 6: Chapter 5 — Agent Frameworks & Multi-Agent Orchestration

**Files:**
- Modify: `modules/ROOT/pages/ch05-advanced-agent-patterns.adoc`

- [ ] **Step 1: Title + LOs.** Set `= Chapter 5: Agent Frameworks & Multi-Agent Orchestration`. LOs: use the Microsoft Agent Framework SDK to build an agent; design and build a multi-agent solution using orchestration patterns; scope the capstone proposal.

- [ ] **Step 2: Microsoft Agent Framework section.** Replace generic "agent framework SDK" content with **Microsoft Agent Framework** (1.0 GA, Python/.NET, merges Semantic Kernel + AutoGen). Keep the SDK-vs-direct-API value argument (figure `g5-3` survives). Tie to Lab 10.

- [ ] **Step 3: Multi-agent orchestration section.** Cover the orchestration patterns: **sequential, concurrent, handoff, group chat, Magentic-One**, and agent-vs-workflow orchestration. Keep/adapt the orchestrator and coordination-pattern figures (`g4-3`, `g4-4` may move here — add `// GRAPHIC TODO`). Tie to Lab 11.

- [ ] **Step 4: Capstone scoping.** Keep the capstone-proposal scoping section, retargeted to the **modernized agentic multimodal capstone** (agent + Foundry IQ + tools/MCP + Content Understanding). Keep figure `g5-5` (scoping decision tree).

- [ ] **Step 5: Remove the old "Azure AI services landscape" survey** here if it duplicates the Ch8 landscape; if kept, it must use the AI-103 service map (graphics plan regenerates `g5-4`). Add `// GRAPHIC TODO: regenerate services landscape to AI-103`.

- [ ] **Step 6: Retarget Hands-On to Labs 10–11.**

- [ ] **Step 7: Key Terms + Summary.** Add `Microsoft Agent Framework`, `orchestration pattern`, `handoff`, `group chat`, `Magentic-One`, `multi-agent solution`. Forward-reference to Ch6.

- [ ] **Step 8: Verify.** **R**, **B**, **X**, only Labs 10–11.

- [ ] **Step 9: Commit.**
```bash
git add modules/ROOT/pages/ch05-advanced-agent-patterns.adoc
git commit -m "docs(ch5): Microsoft Agent Framework + multi-agent orchestration"
```

### Task 7: Chapter 6 — Text Analysis & Conversational Speech Agents

**Files:**
- Modify: `modules/ROOT/pages/ch06-nlp-and-speech.adoc`

- [ ] **Step 1: Title + LOs.** Set `= Chapter 6: Text Analysis & Conversational Speech Agents`. LOs: extract entities/topics/summaries/structured JSON via generative prompting + Foundry Tools; build a text-analysis agent; integrate speech (STT/TTS) and build a voice agent (Voice Live).

- [ ] **Step 2: Reframe text analysis as generative-first.** Keep the law-firm scenario and the NER/key-phrase/sentiment/translation **concepts**, but reframe the primary method as **LLM prompting for structured extraction** (entities, summaries, structured JSON) plus **Foundry Tools** (Translator, language analysis). Keep one Python sample showing prompt-based structured extraction (JSON output). Tie to Lab 12 (Analyze text).

- [ ] **Step 3: DELETE custom text classification (old §6.3) and QnA knowledge base (old §6.4).** Remove these sections entirely. Replace with a **Text Analysis Agent** section (Lab 13): an agent that calls text-analysis tools/prompts to process documents. Remove figure refs `g6-2` (custom classification workflow) and any QnA figure; add `// GRAPHIC TODO: text-analysis-agent` if a new figure is wanted.

- [ ] **Step 4: Rebuild speech as agent modality.** Keep STT/TTS/SSML concepts (Lab 15). Add: **speech-capable generative models** (Lab 14), **Azure Speech in an agent** (Lab 16), and **Voice Live agent** (Lab 17) — low-latency speech-to-speech, WebSocket/Realtime-compatible, interruption + end-of-turn detection, optional avatars, MCP support. Keep/adapt the speech-chat-loop figure `g6-3`; add `// GRAPHIC TODO: voice-live-agent-loop`.

- [ ] **Step 5: Update the multi-service pipeline section.** Recast the "NLP pipeline" as a generative/agent pipeline; remove custom-classification and QnA stages; keep error-propagation and human-in-the-loop content. Update figure refs `g6-4`/`g6-5` (`// GRAPHIC TODO`).

- [ ] **Step 6: Retarget Hands-On to Labs 12–17** (keep as the intensive lab week, per decision).

- [ ] **Step 7: Key Terms + Summary.** Remove `custom text classification`, `single/multi-label classification` (as Language Studio features), `QA knowledge base`, `linked entity recognition` (if dropped). Add `structured extraction`, `Foundry Tools`, `text-analysis agent`, `Voice Live`, `speech-capable model`. Forward-reference to Ch7.

- [ ] **Step 8: Verify.**
```bash
grep -niE "custom text classification|qna maker|question answering knowledge base|language studio" modules/ROOT/pages/ch06-nlp-and-speech.adoc   # expect: 0
```
Run **B**, **X**; confirm only Labs 12–17.

- [ ] **Step 9: Commit.**
```bash
git add modules/ROOT/pages/ch06-nlp-and-speech.adoc
git commit -m "docs(ch6): generative-first text analysis + Voice Live speech agents"
```

### Task 8: Chapter 7 — Vision: Multimodal Understanding & Image Generation

**Files:**
- Modify: `modules/ROOT/pages/ch07-computer-vision.adoc`

> **Scenario decision (default — confirm with author):** replace the trail-camera/Custom-Vision premise with a **digital media & communications team ("Piedmont Media")** scenario: generate and edit campaign imagery, auto-generate accessibility alt-text/extended descriptions, and analyze/catalog a media library with Content Understanding. This naturally exercises every AI-103 vision beat. If the author prefers a different scenario, swap the running example but keep the section structure below.

- [ ] **Step 1: Title + LOs.** Set `= Chapter 7: Vision: Multimodal Understanding & Image Generation`. LOs: analyze visual content with multimodal models (captions, visual Q&A, accessibility descriptions); generate and edit images (and intro video) from prompts/reference media; use Content Understanding to extract visual characteristics; apply responsible AI for multimodal content.

- [ ] **Step 2: DELETE Custom Vision (old §7.4, all subsections) and Face Detection (old §7.5, all subsections).** Remove entirely, including their Key Terms and the capability-matrix/selection figures built on them.

- [ ] **Step 3: Multimodal understanding section.** Vision-enabled chat (Lab 18): captions (single/multi-image), **visual question answering grounded in visual evidence**, **accessibility alt-text and extended descriptions**, object/region identification. Keep figure `g7-4` (chat-vs-API) if still apt; add `// GRAPHIC TODO` for an updated multimodal-understanding figure.

- [ ] **Step 4: Image (and video) generation + editing section.** Generate images from text + reference media (Lab 19); **image editing**: inpainting, mask-based edits, prompt-driven modification; brief coverage of **video generation/editing**; generation/editing controls. Add `// GRAPHIC TODO: image-generation-and-editing`.

- [ ] **Step 5: Content Understanding for images section.** Analyze images with **Content Understanding** (Lab 20): single-task vs. pro-mode analyzers, extracting visual characteristics, video-segment analysis intro. Add `// GRAPHIC TODO: content-understanding-image-pipeline`.

- [ ] **Step 6: Responsible AI for multimodal section.** Filters for unsafe/disallowed visual content; **indirect prompt injection via text embedded in images**; visual policy rules (watermarks, prohibited symbols, brand usage). Keep as a `[WARNING]`/section. Add `// GRAPHIC TODO: indirect-prompt-injection-in-images`.

- [ ] **Step 7: Rewrite the decision framework + comparison matrix** to AI-103 vision capabilities (multimodal understanding / generation / editing / Content Understanding) — remove Custom Vision & Face rows. Replace figures `g7-3`, `g7-5`, `g7-6` (`// GRAPHIC TODO`).

- [ ] **Step 8: Retarget Hands-On to Labs 18–20.**

- [ ] **Step 9: Key Terms + Summary.** Remove `Custom Vision`, `multiclass/multilabel classification`, `mAP`, `face detection`. Add `multimodal understanding`, `visual question answering`, `alt-text`, `image generation`, `inpainting`, `Content Understanding`, `analyzer`, `indirect prompt injection`. Forward-reference to Ch8.

- [ ] **Step 10: Verify.**
```bash
grep -niE "custom vision|face detection|face service|mAP|DALL-E" modules/ROOT/pages/ch07-computer-vision.adoc   # expect: 0 (DALL-E replaced by current image-gen naming)
```
Run **B**, **X**; confirm only Labs 18–20.

- [ ] **Step 11: Commit.**
```bash
git add modules/ROOT/pages/ch07-computer-vision.adoc
git commit -m "docs(ch7): multimodal understanding, image generation/editing, Content Understanding"
```

### Task 9: Chapter 8 — Multimodal Information Extraction & Capstone

**Files:**
- Modify: `modules/ROOT/pages/ch08-document-intelligence-and-knowledge-mining.adoc` (keep filename)

> **Lab 21 decision (default):** keep Lab 21 (Extract information from multimodal content) labeled **Optional**, matching the official track.

- [ ] **Step 1: Title + LOs.** Set `= Chapter 8: Multimodal Information Extraction & Capstone`. LOs: extract structured info from multimodal content using Content Understanding (OCR + layout + field extraction); produce clean grounded representations for agents/RAG; architect and justify an agentic multimodal solution; communicate it via design doc + recorded walkthrough.

- [ ] **Step 2: DELETE prebuilt/custom Document Intelligence training workflow (old §8.2–8.3) and the Azure AI Search / knowledge-mining / skillset / knowledge-store sections (old §8.4–8.5).** The retrieval/knowledge half moved to Foundry IQ (Ch4). Remove their Key Terms and figures `g8-3`, `g8-4`, `g8-5` and the prebuilt-vs-custom spectrum `g8-2`.

- [ ] **Step 3: Content Understanding extraction section.** Recast the healthcare scenario around **Content Understanding**: multimodal pipelines combining OCR, layout analysis, and field extraction; analyzers producing **clean markdown / structured JSON** for downstream reasoning; multimodal extraction (Lab 21, Optional) and a **Content Understanding client application** (Lab 22). Add `// GRAPHIC TODO: content-understanding-extraction` (can reuse the intent of `g8-1`).

- [ ] **Step 4: Retrieval/grounding pipelines.** Brief section connecting extraction output to RAG/agent tools and Foundry IQ knowledge (callbacks to Ch2/Ch4). Keep it integrative, not a re-teach.

- [ ] **Step 5: Update multi-service architecture section.** Keep the "justify your design" pedagogy and the problem-options-choice-reasoning structure (`g8-7` survives). Update the reference-architecture figure to the AI-103 service set + agentic/multimodal framing (`g8-6` → `// GRAPHIC TODO`).

- [ ] **Step 6: Modernize the capstone (§8.7).** Reframe the technical-design-doc capstone around an **agentic multimodal solution** (agent + Foundry IQ + tools/MCP + Content Understanding inputs). Keep the required-components checklist, the 5–7 min recorded walkthrough, and the common-pitfalls list. Update lab references in justification examples to the new lab numbers.

- [ ] **Step 7: Rewrite the cert section.** Replace "AI-102 Certification Connection" with **AI-103 (Azure AI App and Agent Developer Associate)** and its five domains (spec §3). Update the course-arc recap to the new chapter titles.

- [ ] **Step 8: Retarget Hands-On to Labs 21–22.** (Lab 21 marked Optional.)

- [ ] **Step 9: Key Terms + Summary.** Remove `Form Recognizer`/`prebuilt model`/`custom extraction model`/`composed/template/neural model`, `search index`, `indexer`, `skillset`, `built-in/custom skill`, `enrichment tree`, `knowledge store`, `semantic ranking` (as AI-Search features). Add `Content Understanding`, `analyzer`, `multimodal extraction`, `field extraction`, `grounded representation`. Keep `human-in-the-loop`, `confidence score`.

- [ ] **Step 10: Verify.**
```bash
grep -niE "form recognizer|document intelligence|knowledge mining|enrichment tree|knowledge store|skillset" modules/ROOT/pages/ch08-document-intelligence-and-knowledge-mining.adoc
```
Expect: 0, except an optional one-line "formerly Document Intelligence/Form Recognizer" migration note if useful. Run **B**, **X**; confirm only Labs 21–22; confirm cert section says AI-103.

- [ ] **Step 11: Commit.**
```bash
git add modules/ROOT/pages/ch08-document-intelligence-and-knowledge-mining.adoc
git commit -m "docs(ch8): Content Understanding multimodal extraction + agentic capstone + AI-103 cert"
```

---

## Phase 2 — Book-wide integration & verification

### Task 10: Full-book consistency sweep

**Files:** all `modules/ROOT/pages/*.adoc`, `README.md`, `graphics-manifest.md`

- [ ] **Step 1: Retired-services gate (whole book).**
```bash
grep -rniE "custom vision|face detection|face service|qna maker|question answering knowledge base|form recognizer|language studio|knowledge mining|enrichment tree|knowledge store|DALL-E|AI-102" modules/ROOT/pages README.md
```
Expected: only intentional, commented "formerly X" migration notes remain. Fix any stragglers.

- [ ] **Step 2: Branding gate.**
```bash
grep -rn "Azure AI Foundry\|Azure AI Services\|Azure AI services" modules/ROOT/pages README.md   # expect: 0
```

- [ ] **Step 3: Lab-reference gate.** Verify each chapter references only its mapped labs (spec §5) and that all 22 labs appear somewhere across the book:
```bash
for n in $(seq 1 22); do grep -rq "Lab $n\b" modules/ROOT/pages || echo "MISSING Lab $n"; done
```
Expected: no `MISSING` lines (Lab 21 present, marked Optional).

- [ ] **Step 4: Cross-reference + image inventory.** Build and inspect:
```bash
antora site.yml 2>&1 | tee /tmp/antora-build.log
grep -iE "target .* not found|could not resolve|unresolved" /tmp/antora-build.log || echo "NO BROKEN XREFS"
grep -iE "image.*not found" /tmp/antora-build.log | sort -u > /tmp/missing-images.txt; wc -l /tmp/missing-images.txt
```
Expected: `NO BROKEN XREFS`. `/tmp/missing-images.txt` lists exactly the figures the graphics plan must produce (the `// GRAPHIC TODO` set) — save it; it is the input to the graphics plan.

- [ ] **Step 5: Update `graphics-manifest.md` status column.** Mark each figure as `Survives`, `Rebrand`, `Replace`, or `New` per spec §8, and add rows for the new `// GRAPHIC TODO` figures with draft generation prompts. (Generation itself is the graphics plan.)

- [ ] **Step 6: Commit.**
```bash
git add modules/ROOT/pages README.md graphics-manifest.md
git commit -m "docs: book-wide AI-103 consistency sweep + graphics manifest status"
```

### Task 11: Open PR to main

- [ ] **Step 1: Push branch and open PR.**
```bash
git push -u origin ai-103-realignment
gh pr create --base main --head ai-103-realignment \
  --title "Re-align CSC-214 textbook to Microsoft AI-103" \
  --body "Full content re-alignment per docs/superpowers/specs/2026-05-25-ai-103-realignment-design.md. Chapters, front matter, branding, and key terms updated to AI-103 / Microsoft Foundry and the AI-103T00-A 22-lab list. Graphics regeneration and worksheet rework follow in separate plans."
```
Expected: PR URL printed. Do NOT merge — leave for author review.

---

## Follow-on plans (scoped here, written separately after content is final)

- **Graphics plan** (`docs/superpowers/plans/<date>-ai-103-graphics.md`): generate the figures in `/tmp/missing-images.txt` plus the rebrand/replace set from `graphics-manifest.md`, using the project's diagram tooling in the existing visual style; verify each `image::` resolves on rebuild.
- **Worksheets plan** (`docs/superpowers/plans/<date>-ai-103-worksheets.md`): rework the `.docx` worksheets to the 22 AI-103 labs (retitle/renumber, drop retired-service worksheets, author new ones for Foundry IQ, Agent Framework, multi-agent, Text-Analysis Agent, speech-in-agent, Voice Live, image generation, Content Understanding). Verify the build's `cp -r worksheets build/site/worksheets` step still maps to lab references.

## Spec coverage check

- Branding/front matter (spec §7) → Task 1. Plan & manage thread (spec §3/§7) → Tasks 2–3 + capstone Task 9. Chapter remapping (spec §5) → Tasks 2–9. Per-chapter transforms (spec §6) → Tasks 2–9. Retired-service removal (spec §3) → enforced in every chapter task + Task 10 gate. Key terms (spec §7) → each chapter task. Graphics (spec §8) → Task 10 manifest + graphics follow-on plan. Worksheets (spec §9) → worksheets follow-on plan. Branch workflow (spec §10) → Task 11. Cert section (spec §6 Ch8) → Task 9.
