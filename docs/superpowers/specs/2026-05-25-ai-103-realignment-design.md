# Design Spec: Re-align CSC-214 OER Textbook to Microsoft AI-103

**Date:** 2026-05-25
**Author:** Dr. Frazier A. Smith (with Claude)
**Course:** CSC-214 — Artificial Intelligence II, Central Piedmont Community College
**Book:** _Applied Azure AI_ (Antora/AsciiDoc OER, 8 chapters, 1:1 chapter-to-week)
**Status:** Design — approved decisions captured; pending spec review before plan.

---

## 1. Goal

Re-align the textbook from the retiring **AI-102 (Azure AI Engineer Associate)** certification to its replacement, **AI-103: Developing AI Apps and Agents on Azure** (cert: **Azure AI App and Agent Developer Associate**). AI-102 retires **2026-06-30**; AI-103 beta launched April 2026, GA June 2026.

The revision is a **full re-alignment**: rebrand throughout, rebalance content to AI-103's domain weights, and substantially rewrite the chapters built on retired services. The book must align to the **official AI-103T00-A Microsoft Learning lab set** (22 labs), which is the ground truth for each chapter's hands-on work.

## 2. Approved decisions

| # | Decision | Choice |
|---|---|---|
| 1 | Revision depth | **Full re-alignment** (not rebrand-only or gap-patch) |
| 2 | Labs | **The new AI-103T00-A 22-lab list is the fixed constraint / ground truth**; chapters align to it |
| 3 | Structure | **Keep 8 chapters / 8 weeks, 1:1 mapping; rebalance topics within** |
| 4 | Branding | **Adopt "Microsoft Foundry" and "Foundry Tools"**, with a one-time note explaining the rename from Azure AI Foundry / Azure AI Services |
| 5 | Ch6 lab load | **Keep all 6 labs in Ch6** (text analysis + speech), preserving Ch6 as the intensive lab week |
| 6 | Capstone | **Modernize to an agentic multimodal build** (agent + Foundry IQ + tools/MCP + Content Understanding); keep design-doc + recorded-walkthrough deliverables |
| 7 | Workflow | **Make all changes in a fork** of the repo (mechanics confirmed before bulk edits / push) |

## 3. AI-103 reference (authoritative)

**Domains and weights** (Microsoft Learn study guide, updated 2026-04-16):

| Domain | Weight |
|---|---|
| Plan and manage an Azure AI solution | 25–30% |
| Implement generative AI and agentic solutions | 30–35% |
| Implement computer vision solutions | 10–15% |
| Implement text analysis solutions | 10–15% |
| Implement information extraction solutions | 10–15% |

**Platform rename:** Azure AI Foundry → **Microsoft Foundry**; Azure AI Services → **Foundry Tools**. Python is the assumed language.

**New / elevated services (all verified against Microsoft Learn, 2026):**

- **Foundry IQ** (GA via 2026-04-01 REST API): multi-source, permission-aware agentic-retrieval knowledge bases built on Azure AI Search; query decomposition + semantic reranking; grounded answers with citations. AI-103's successor to "knowledge mining."
- **Microsoft Agent Framework** (1.0 GA, April 2026): open-source Python/.NET SDK merging Semantic Kernel + AutoGen; orchestration patterns — sequential, concurrent, handoff, group chat, Magentic-One; agent vs. workflow orchestration.
- **Voice Live API** (Foundry Tools / Speech): unified low-latency speech-to-speech for voice agents; WebSocket, Azure OpenAI Realtime-compatible; interruption + end-of-turn detection; avatars; MCP server support.
- **Content Understanding** (GA, 2025-11-01 API): multimodal (text/audio/image/document/video) → structured insights; prebuilt image/video/audio analyzers; RAG grounding; SDKs in Python/.NET/Java/JS. Replaces Document-Intelligence-centric Ch8 and reshapes Ch7.

**Retired / out-of-scope services to remove from the book:** Custom Vision (classification & object detection), Face / Face Detection, custom text classification via Language Studio, QnA Maker / custom question answering, the prebuilt+custom Document Intelligence training workflow as a primary topic, and the standalone Azure AI Search knowledge-mining/skillset lab.

## 4. Source of truth — the AI-103T00-A 22-lab list

1. Prepare for an AI development project
2. Explore models and evaluate performance
3. Create a generative AI chat app
4. Create a generative AI app that uses your own data (RAG)
5. Apply content filters to prevent the output of harmful content
6. Build AI agents with portal and VS Code
7. Use a custom function in an AI agent
8. Develop an AI agent with Model Context Protocol (MCP) tools
9. Integrate an AI agent with Foundry IQ
10. Develop an Azure AI chat agent with the Microsoft Agent Framework SDK
11. Develop a multi-agent solution
12. Analyze text
13. Develop a Text Analysis Agent
14. Use speech-capable generative AI models
15. Recognize and synthesize speech
16. Use Azure Speech in an agent
17. Develop a Voice Live agent
18. Develop a vision-enabled chat app
19. Generate images with AI
20. Analyze images with Azure Content Understanding
21. Extract information from multimodal content (Optional)
22. Develop a Content Understanding client application

## 5. Chapter → lab → domain remapping

The 1:1 chapter-to-week mapping is preserved. Lab numbers below refer to the AI-103T00-A list in §4.

| Wk/Ch | Revised chapter title | Labs | Dominant AI-103 domain |
|---|---|---|---|
| 1 | Foundations: Models, Deployment & Evaluation | 1, 2, 3 | Plan & manage / Gen AI |
| 2 | Grounding with RAG & Responsible AI | 4, 5 | Gen AI / Plan & manage |
| 3 | Building AI Agents: Tools & Functions | 6, 7 | Gen AI & agentic |
| 4 | Agent Knowledge & Protocols: MCP & Foundry IQ | 8, 9 | Gen AI & agentic |
| 5 | Agent Frameworks & Multi-Agent Orchestration | 10, 11 | Gen AI & agentic |
| 6 | Text Analysis & Conversational Speech Agents | 12, 13, 14, 15, 16, 17 | Text analysis |
| 7 | Vision: Multimodal Understanding & Image Generation | 18, 19, 20 | Computer vision |
| 8 | Multimodal Information Extraction & Capstone | 21, 22 | Information extraction |

Rationale: agents earn a 3-chapter arc (Ch3–5) to match the 30–35% gen/agentic weight; evaluation folds into Ch1 (Lab 2 now does model evaluation) while groundedness/safety evaluation stays in Ch2–3; Ch6 remains the intensive lab week; Ch7–8 pivot fully to generation, Content Understanding, and multimodal extraction.

## 6. Per-chapter transformation plan

Each chapter retains the established structure: Learning Objectives → numbered sections → Hands-On Connections → Assessment Preparation → Key Terms → Chapter Summary, with NOTE/TIP/IMPORTANT/WARNING callouts, annotated Python samples, and `image::` figures.

### Chapter 1 — Foundations: Models, Deployment & Evaluation
- **Keep:** model catalog, serverless vs. provisioned, chat completion anatomy, parameters, model selection. Already ~85% aligned.
- **Change:** rebrand to Microsoft Foundry / Foundry Tools; update the "Azure OpenAI Studio" NOTE. Add a **Plan & manage** opening thread: project setup, **keyless auth / managed identity**, region/quota basics, cost footprint. Fold **model evaluation** in (Lab 2 = "Explore models and evaluate performance"): add a section on comparing models and reading evaluation output, so LO #3 covers evaluation.
- **Labs section:** retarget to Labs 1–3.
- **SDK:** keep `openai`/`AzureOpenAI`; verify against current Foundry SDK guidance.

### Chapter 2 — Grounding with RAG & Responsible AI
- **Keep:** RAG pipeline, chunking, grounding, content safety filters. Strongly aligned.
- **Change:** rebrand; connect RAG to **Foundry "use your own data"** flow (Lab 4); deepen **Responsible AI** to match AI-103 ("Plan & manage" RAI: safety filters, guardrails, risk detection, evaluators, trace logging/provenance). Position content safety as part of the RAI governance story.
- **Labs section:** Labs 4–5.

### Chapter 3 — Building AI Agents: Tools & Functions
- **From:** current Ch3 (evaluation + agents intro) and Ch4 (agent development).
- **Keep/adapt:** agent execution loop, agent-vs-chat decision, tool-definition anatomy, tool-call lifecycle, error handling.
- **Change:** lead with **building agents in the Foundry portal + VS Code** (Lab 6) and **custom function tools** (Lab 7). Move evaluation out (now Ch1). Update to Foundry Agent Service terminology.
- **Labs section:** Labs 6–7.

### Chapter 4 — Agent Knowledge & Protocols: MCP & Foundry IQ
- **From:** current Ch5 MCP material + new Foundry IQ content.
- **Keep/adapt:** MCP client-server, connection lifecycle, tool discovery/invocation (current Ch5 §s).
- **New:** **Foundry IQ** — agentic retrieval, multi-source permission-aware knowledge bases, query decomposition, citations; how an agent consumes a knowledge base vs. raw RAG. This absorbs the "knowledge" half of the retired Ch8 knowledge-mining content.
- **Labs section:** Labs 8–9.

### Chapter 5 — Agent Frameworks & Multi-Agent Orchestration
- **From:** current Ch5 framework/SDK + capstone-scoping material.
- **Keep/adapt:** SDK-vs-direct-API value, orchestration patterns (sequential/parallel/orchestrator).
- **Change:** replace generic "agent framework SDK" with **Microsoft Agent Framework** (Semantic Kernel + AutoGen lineage; sequential/concurrent/handoff/group-chat/Magentic-One); **multi-agent solution** build (Lab 11). Keep capstone-proposal scoping here, retargeted to the modernized agentic capstone.
- **Labs section:** Labs 10–11.

### Chapter 6 — Text Analysis & Conversational Speech Agents
- **Keep/adapt:** the law-firm scenario; NER/key-phrase/sentiment **concepts**, pipeline thinking, error propagation, human-in-the-loop.
- **Cut:** **custom text classification** (Language Studio + Blob) and **QnA Maker / custom question answering** as primary topics.
- **Change:** reframe text analysis as **generative-prompting-first** — extract entities/topics/summaries/**structured JSON** via LLM prompting + **Foundry Tools** (Translator, language analysis); build a **Text Analysis Agent** (Lab 13). Rebuild speech around the **agent voice modality**: speech-capable generative models (Lab 14), STT/TTS (Lab 15), **speech in an agent** (Lab 16), **Voice Live agent** (Lab 17). Update SSML/custom-speech notes to current guidance.
- **Labs section:** Labs 12–17 (intensive week, as today).

### Chapter 7 — Vision: Multimodal Understanding & Image Generation
- **Cut entirely:** **Custom Vision** (classification & object detection) and **Face / Face Detection**. Replace the trail-camera/Custom-Vision premise with a scenario centered on multimodal understanding + generation (candidate: a media/marketing or accessibility scenario — to be chosen in the plan).
- **Keep/adapt:** vision-enabled chat (multimodal models), OCR concept (recast under Content Understanding / info extraction).
- **New / elevated:** **image generation** from text + reference media; **image editing** (inpainting, mask-based, prompt-driven); brief **video generation/editing**; **multimodal understanding** (captions, visual Q&A, **accessibility alt-text/extended descriptions**); **Content Understanding** for images (single-task + pro-mode analyzers, object/region identification); **responsible AI for multimodal** — unsafe-content filters, **indirect prompt injection via text embedded in images**, visual policy rules (watermarks, prohibited symbols, brand usage).
- **Labs section:** Labs 18–20. Rewrite decision framework + comparison matrix to AI-103 vision capabilities.

### Chapter 8 — Multimodal Information Extraction & Capstone
- **Retitle** "Document Intelligence & Knowledge Mining" → **"Multimodal Information Extraction & Capstone."**
- **Cut:** prebuilt+custom **Document Intelligence** training workflow and the **Azure AI Search skillset/knowledge-store** lab content as primary topics (the retrieval/knowledge half migrates to Foundry IQ in Ch4).
- **New / elevated:** **Content Understanding** as the extraction engine — OCR + layout + field extraction in multimodal pipelines; analyzers producing **clean markdown/structured JSON** for agents and RAG; **multimodal extraction** (Lab 21) and a **Content Understanding client application** (Lab 22). Retrieval/grounding pipelines feeding agent tools.
- **Capstone:** modernize to an **agentic multimodal build** — an agent using Foundry IQ knowledge, tools/MCP, and Content Understanding inputs; preserve the technical-design-doc + 5–7 min recorded-walkthrough deliverables and the problem-options-choice-reasoning justification structure.
- **Cert section:** rewrite "AI-102 Certification Connection" → **AI-103 (Azure AI App and Agent Developer Associate)**; update domain list.

## 7. Cross-cutting changes

- **Branding:** global pass — "Azure AI Foundry" → "Microsoft Foundry"; "Azure AI Services" → "Foundry Tools"; service names (e.g., "Azure AI Vision Image Analysis" → Content Understanding where applicable). One-time explanatory NOTE on the rename, placed in Ch1.
- **Plan & manage thread (25–30%):** weave managed identity / keyless auth, private networking, quotas/scaling/rate limits, cost management, monitoring (performance, drift, safety events, grounding quality), and RAI governance (oversight modes, tool-access controls, auditing/provenance) across Ch1–2 and into the capstone's operational plan.
- **Code samples:** audit every Python block against current Foundry SDKs (Agent Framework, Content Understanding, Voice Live, Foundry IQ). Replace `azure-ai-vision`/Custom Vision/Form Recognizer SDK calls. Keep API-version pins current.
- **Front matter:** update `README.md` chapter table + "AI-102" line; `index.adoc` About/TOC; `nav.adoc` chapter titles; `site.yml`/`antora.yml` titles if changed. Confirm CC BY-NC license and NSF footer remain.
- **Key Terms:** remove retired-service terms (Custom Vision, mAP-in-Custom-Vision, face detection, QnA knowledge base, custom text classification, Form Recognizer prebuilt/custom/composed/template/neural model, skillset/enrichment-tree/knowledge-store as primary); add Foundry IQ, agentic retrieval, Microsoft Agent Framework, orchestration patterns, Voice Live, Content Understanding, analyzer, multimodal extraction, indirect prompt injection, managed identity / keyless auth.

## 8. Graphics plan (44 existing)

- **Rebrand-only (label edits, ~25):** most Ch1–5 figures (Foundry/Foundry Tools labels). **Regenerate** `g5-4-azure-ai-services-landscape` to AI-103 service map.
- **Replace / heavy redo (~7):** `g7-3-custom-vision-training-cycle`, `g7-5-vision-capability-matrix`, `g7-6-vision-service-selection` (Custom Vision/Face based); `g6-2-custom-classification-workflow`, `g6-5-prebuilt-vs-custom-comparison`; `g8-2-prebuilt-vs-custom-spectrum`, `g8-3`/`g8-4`/`g8-5` (Document Intelligence / AI Search / skillset / enrichment-tree).
- **Net-new (~6–8):** image/video generation + editing (inpainting/masks); Content Understanding multimodal pipeline; Foundry IQ agentic retrieval; Microsoft Agent Framework orchestration patterns (sequential/concurrent/handoff/group-chat); Voice Live agent loop; indirect-prompt-injection-in-images.
- **Mostly survive:** RAG pipeline, agent execution loop, tool-call lifecycle, MCP client-server/lifecycle, evaluation scorecard/diagnostic, content-filter placement, severity quadrant.
- Update `graphics-manifest.md` to reflect adds/removals/renames and new generation prompts. Generation will use the project's diagram tooling (style consistent with existing 44).

## 9. Worksheets

26 `.docx` lab worksheets (Lab01–26) match the old AI-102 labs. The new list has **22 labs with different titles/scope**. Worksheets must be **re-mapped, retitled, and re-authored** to the 22 AI-103 labs (drop Custom Vision / Face / custom-classification / QnA / Doc-Intelligence / knowledge-mining worksheets; add Foundry IQ, Agent Framework, multi-agent, Text-Analysis-Agent, speech-in-agent, Voice Live, image generation, Content Understanding worksheets). Treated as a parallel sub-deliverable in the plan.

## 10. Workflow constraint

All changes land in a **fork** of the repo (per user instruction). Before bulk content edits or any push, confirm: literal GitHub fork vs. isolated branch/worktree; target remote; PR-back vs. standalone. This design doc is committed to an isolated branch (`ai-103-realignment`) pending that confirmation.

## 11. Out of scope (this revision)

- Authoring/maintaining the Skillable Cloud Slice lab environments themselves (Microsoft-provided; we align to them).
- Changing the Antora UI bundle, build pipeline, or hosting.
- Net-new assessment instruments beyond updating existing discussion/assignment prompts to new scenarios/services.

## 12. Risks & open questions

- **Preview-vs-GA drift:** several AI-103 features are recent (Foundry IQ agentic retrieval, Voice Live, Agent Framework 1.0). Pin to GA behavior where the exam emphasizes GA; flag preview features explicitly.
- **Ch7 scenario:** the trail-camera premise is built on retired services; a replacement scenario must be chosen (plan decision).
- **Lab-21 optional:** Lab 21 is optional in the official track — confirm whether Ch8 treats it as optional/extension.
- **Fork mechanics:** unconfirmed (see §10).
- **SDK churn:** sample-code APIs may shift between beta and GA; budget a verification pass close to publish.

## 13. Success criteria

- Every chapter's Hands-On Connections section references only AI-103T00-A labs, correctly mapped per §5.
- No remaining references to retired services (Custom Vision, Face, QnA Maker, Form Recognizer-as-primary, standalone AI Search knowledge mining) except where intentionally noting deprecation/migration.
- Branding consistent (Microsoft Foundry / Foundry Tools) with one explanatory note.
- AI-103 "Plan & manage" content (security, CI/CD, monitoring, RAI governance) present across Ch1–2 + capstone.
- Cert section, README, index, nav, and key terms reflect AI-103.
- Graphics manifest updated; replaced/new figures generated in consistent style.
- All work isolated in the fork; Antora site builds cleanly.
