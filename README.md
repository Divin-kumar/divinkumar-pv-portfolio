# Divinkumar Sundaramoorthi | PV Systems Portfolio

A desktop-first professional portfolio for a pharmacovigilance techno-functional analyst. The site emphasizes verified technical contributions and the work behind day-to-day PV application support.

## Resume-led editorial redesign

This redesign uses the user's 2025 resume as evidence for earlier professional experience and retains the confirmed, updated career chronology through 2026.

The new site prioritizes:

- A concise professional proposition rather than generic tool and animation overload
- E2B/XML/ACK investigations, SQL-backed checks and reporting workflows
- Dictionary update and recoding support (MedDRA, WHO-Drug and JDrug)
- HaloPV access, workflow and reconciliation-related operational support
- TCQ, GxP documentation and controlled change evidence
- A truthful distinction between practiced skills and developing skills
- A clear separation of the current InfoBeans/IQVIA assignment and earlier Capgemini responsibilities

## Files

- `index.html`: semantic sections, public-safe content and embedded existing portrait
- `portfolio-next.css`: responsive editorial design, themes, and accessible motion preferences
- `portfolio-next.js`: navigation, workstream filters, expandable descriptions, expertise explorer, copy/email and print controls

Older site files remain in git history for rollback. The new `index.html` does not load their styles or scripts.

## Interaction and accessibility

The site offers an interactive expertise explorer with arrow-key navigation; filtered representative workstreams; expandable practice descriptions; dark and light themes; a reduced-motion control; keyboard command navigation (Cmd/Ctrl+K or /); and browser printing.

Animation is optional, uses mostly transform/opacity transitions and respects `prefers-reduced-motion`. No backend, visitor analytics or dynamic organizational data access is implemented.

## Confidentiality and fact-checking

The public site must never contain patient or case records, private ticket exports, internal IDs, credentials, business configurations, stakeholder messages, or internal links.

The 2025 resume describes Capgemini as present at that time; the website uses the later confirmed employment transition: Capgemini through January 6, 2026 and InfoBeans from January 7, 2026. No fabricated outcomes, metrics, certifications, or AI automation deployments are presented.

## Release checklist

Before promoting a preview:
1. Verify desktop at 1280, 1440 and 1920 pixels, including portrait and long-title layouts.
2. Test workstream filter counts and expandable details.
3. Test expertise tabs by mouse and arrow keys.
4. Test theme, motion, command palette, navigation, and printable profile.
5. Check keyboard focus, text contrast and reduced-motion behavior.
6. Ensure no private ticket/case content or misleading proficiency claims are present.

If full browser automation is unavailable, be explicit that source checks and Vercel deployment status are not equivalent to end-to-end browser QA.
