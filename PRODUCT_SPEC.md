# SplitSmart Product Specification

## Vision
SplitSmart helps groups track shared expenses with minimal manual entry. Its differentiator is Smart Trip Mode: when a group has optional trip start/end dates, users can connect an authorized transaction source and receive suggested expenses during the trip period for explicit confirmation.

## MVP users
Authenticated individuals who create or join groups and record shared expenses.

## Core entities
- User/Profile
- Group
- Group Member
- Expense
- Expense Split
- Settlement
- Category

## Group creation
Fields:
- Name: required
- Description: optional
- Currency: required, default INR
- Trip start date: optional
- Trip end date: optional
- Smart Trip Mode: enabled only when the user chooses it; it can also be enabled later

Validation: if both dates are supplied, start date must be on or before end date.

## Expense functionality
Users can:
- Add, edit and soft-delete expenses
- Select payer
- Select participants
- Split equally
- Split by exact amount
- Split by percentage
- Split by shares
- Assign category
- Add expense date and notes

Invariant: split amounts must reconcile exactly to the expense amount.

## Balance functionality
For each group, calculate:
- What the current user owes
- What the current user is owed
- Net balance
- Member net balances
- Simplified who-owes-whom suggestions

The balance engine must be independent of React and Supabase.

## Settlement functionality
A settlement records money actually paid between members. It never edits or deletes the underlying expense.

## Dashboard
Show:
- Total owed by current user
- Total owed to current user
- Net balance
- Groups
- Recent expenses
- Quick add expense

## Smart Trip Mode
### User experience
When trip dates exist, offer:
"Smart Trip Mode can identify payment notifications during your trip and suggest expenses for review."

The user explicitly connects a source such as Gmail. The MVP should prioritize email integration before SMS.

### Capture lifecycle
Connected source -> transaction detection -> normalization -> trip-date filtering -> group matching -> expense suggestion -> user review -> confirmed expense.

### Safety
- Never auto-create an expense without explicit confirmation.
- Minimize retained financial/message data.
- Do not store complete email bodies unless required by a future feature.
- OAuth tokens/secrets must never be exposed to the browser.

## Non-goals for initial MVP
- Direct bank account aggregation
- Automatic payments
- Automatic expense creation
- SMS ingestion in the web MVP
- Multi-currency conversion inside a single group
- Full AI agent automation

## UX principles
- Mobile-first expense entry
- Clear financial totals
- Prominent Add Expense action
- Simple group/member management
- Strong empty/loading/error states
- Confirmation before financial changes

## Future roadmap
1. Google authentication
2. Gmail Smart Capture
3. Outlook Smart Capture
4. AI merchant/category classification
5. Duplicate detection
6. Trip timeline and trip summary
7. PWA/mobile experience
8. Android notification/SMS integration where platform policies permit
9. UPI/payment integrations
