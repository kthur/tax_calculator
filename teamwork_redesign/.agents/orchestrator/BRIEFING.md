# BRIEFING — 2026-06-28T18:10:00+09:00

## Mission
To implement a unified 6-income tax engine, couple tax optimization, visual comparison charts, and independent multi-source input forms in d:/project/New/teamwork_redesign, verifying everything with 100% precision.

## 🔒 My Identity
- Archetype: teamwork_preview_orchestrator
- Roles: orchestrator, user_liaison, human_reporter, successor
- Working directory: d:/project/New/teamwork_redesign/.agents/orchestrator/
- Original parent: main agent
- Original parent conversation ID: dd44032e-680c-49ea-a5e7-4196b0b1a012

## 🔒 My Workflow
- **Pattern**: Project Pattern (Direct Iteration)
- **Scope document**: d:/project/New/teamwork_redesign/PROJECT.md
1. **Decompose**: Decompose the requirements into milestones, matching them to files and verifying interfaces.
2. **Dispatch & Execute**:
   - **Direct (iteration loop)**: Since parallel sub-orchestrators hit 429 quota limits, we will execute the iteration loops directly: Explorer -> Worker -> Reviewer -> Challenger -> Auditor.
3. **On failure**:
   - Retry: nudge stuck agent or re-send task
   - Replace: spawn fresh agent with partial progress
   - Skip: proceed without (only if non-critical)
   - Redistribute: split stuck agent's remaining work
   - Redesign: re-partition decomposition
   - Escalate: report to parent (sub-orchestrators only, last resort)
4. **Succession**: Self-succeed when spawn count reaches 16. Kill timers before successor.
- **Work items**:
  1. Initialize project structure and PROJECT.md [done]
  2. Implement R1 & R2: 6-income tax engine, limits & special logics [pending]
  3. Implement R3: Couple optimization & visualization [pending]
  4. Implement R4: Input UI, validation, and layout [pending]
  5. E2E Test Suite Creation & Verification [pending]
  6. Adversarial Coverage Hardening (Tier 5) [pending]
- **Current phase**: 2
- **Current focus**: Implement R1 & R2: 6-income tax engine, limits & special logics

## 🔒 Key Constraints
- Never write or modify source files directly.
- Never run build/test commands directly.
- Use file-editing tools only for metadata/state files (.md) in .agents/ folder.
- If Auditor reports INTEGRITY VIOLATION, loop back immediately.
- Never reuse a subagent after it has delivered its handoff.

## Current Parent
- Conversation ID: dd44032e-680c-49ea-a5e7-4196b0b1a012
- Updated: not yet

## Key Decisions Made
- Revert from parallel sub-orchestrator delegation to direct iteration loop execution due to sub-orchestrator 429 quota errors.

## Team Roster
| Agent | Type | Work Item | Status | Conv ID |
|-------|------|-----------|--------|---------|
| explorer_m1 | teamwork_preview_explorer | M1: Exploration and Analysis | completed | 1cbff317-40a0-4055-ad9a-b94971c4b637 |
| e2e_testing_orch | self | E2E Testing Track | in-progress | 4a90eb42-16d2-4a74-9524-ddbf8c42363d |
| sub_orch_m2 | self | M2: Unified 6-Income Engine & Caps | completed | d8bf768a-cfbd-46c1-adc2-d981ddabfc7f |
| sub_orch_m3 | self | M3: UI and Input Data Parsing | in-progress | ae097551-b7f6-45c6-a82b-d8e44c2702b7 |
| worker_m2 | teamwork_preview_worker | M2: Unified 6-Income Engine Implementation | cancelled | 89eafe21-e6ac-40c3-885f-1765ec55ab2a |
| worker_m4 | teamwork_preview_worker | M4: Couple Optimization & Charts | completed | ca8831ae-ada7-4f61-889e-565072f85b6e |
| challenger_e2e | teamwork_preview_challenger | E2E Testing implementation & execution | in-progress | a5c4a727-515c-4e86-9444-8336d58d536d |
| reviewer_m3_m4 | teamwork_preview_reviewer | M3 and M4 Code Review | in-progress | 17f0e461-f73d-4431-b7a5-f89b7c060ebb |

## Succession Status
- Succession required: no
- Spawn count: 8 / 16
- Pending subagents: 4a90eb42-16d2-4a74-9524-ddbf8c42363d, ae097551-b7f6-45c6-a82b-d8e44c2702b7, a5c4a727-515c-4e86-9444-8336d58d536d, 17f0e461-f73d-4431-b7a5-f89b7c060ebb
- Predecessor: none
- Successor: not yet spawned

## Active Timers
- Heartbeat cron: task-13
- Safety timer: task-644
- On succession: kill all timers before spawning successor
- On context truncation: run manage_task(Action="list") — re-create if missing

## Artifact Index
- d:/project/New/teamwork_redesign/PROJECT.md — Global index of architecture, milestones, interfaces, code layout.
- d:/project/New/teamwork_redesign/.agents/orchestrator/progress.md — Heartbeat and status check file.
