# SplitSmart Codex Development Rules

## Product principles
- SplitSmart is a group-expense application with optional trip dates and a future Smart Trip Mode.
- Trip dates are product functionality, not merely display metadata.
- Smart capture may suggest expenses, but must never create a financial expense without explicit user confirmation.

## Engineering rules
1. Use strict TypeScript.
2. Keep business logic out of React components.
3. Financial calculations must live in pure TypeScript modules with deterministic unit tests.
4. Expenses and settlements are separate financial events. Never mutate an expense to represent a settlement.
5. Every expense split must reconcile exactly to the expense total.
6. All database changes must use Supabase migrations.
7. Every exposed Supabase table must have appropriate RLS policies.
8. Never expose Supabase service-role/secret credentials to the browser.
9. Use publishable client credentials only in frontend code.
10. Authorization must be based on group membership/role, not merely authenticated status.
11. Connected email/payment data must be minimized; do not persist complete message bodies unless a later requirement explicitly needs them.
12. Detected transactions and confirmed expenses are separate concepts/tables.
13. All features need loading, empty, error, and unauthorized states.
14. Prefer small, reviewable changes. Do not rewrite working functionality without reason.
15. Before completion of each task run typecheck, lint, tests, and production build where applicable.
16. Do not make destructive schema changes without explicit confirmation.
17. Add tests for every non-trivial financial calculation and authorization rule.

## MVP scope
Phase 1: authentication, profiles, groups, optional trip dates, members.
Phase 2: manual expenses with equal/exact/percentage/shares splits.
Phase 3: balance engine and debt simplification.
Phase 4: settlements and dashboard.
Phase 5: Smart Trip Mode foundation and Gmail transaction suggestions.

## Smart Trip Mode architecture
Connected source -> detected transaction -> expense suggestion -> user confirmation -> expense.
The ingestion layer must be isolated from the core expense ledger so automatic detection can never bypass confirmation.
