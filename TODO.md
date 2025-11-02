# TODO for E-Wallet App Implementation

## Phase 1: Login and Register Forms
- [x] Implement AuthContext.tsx: Create authentication context with login, signup, logout functions using localStorage.
- [x] Implement Login.tsx: Build login form with email and password fields, handle submission and redirect.
- [x] Implement Signup.tsx: Build signup form with email, password, confirm password fields, handle submission and redirect.
- [x] Update App.tsx: Ensure routing for /login, /signup, /dashboard with protected routes.
- [x] Create package.json and install dependencies.
- [ ] Test the forms: Run the app, test login/signup flows using browser_action (disabled, so manual test).

## Phase 2: Dashboard with Cards and Categories
- [x] Define TypeScript interfaces for Card (id, name, number, expiry, category) and Category (id, name).
- [x] Create mock data for categories and cards in Dashboard.tsx.
- [x] Update Dashboard.tsx to display categories as sections, each containing a list of cards using CardList and CardItem components.
- [x] Implement CardItem.tsx to render individual card details (masked number, name, expiry) with click to view details.
- [x] Implement CardList.tsx to map over cards and render CardItem components.
- [x] Implement AddCardModal.tsx for adding new cards (form with inputs for card details and category selection).
- [x] Implement CardDetailModal.tsx for viewing/editing card details.
- [x] Update Header.tsx to include a header with user info and add card button.
- [x] Add CSS classes in index.css for dashboard layout (grid for categories, card styling with shadows, responsive design).
- [x] Add category bar with filter buttons (All Cards, Bank Cards, IDs, License, Tap & Go, Documents).
- [x] Implement color-coded cards based on category (bank: blue, ids: purple, license: pink, transit: cyan, documents: green).
- [x] Update CSS to remove hardcoded background from .card-item and apply via inline styles in CardItem.tsx.
- [x] Change dashboard background to light gray (#f8f9fa) for better contrast.
- [x] Update text colors in dashboard content to dark (#333) for visibility on light background.
- [x] Update category section headers to dark color.
- [x] Change category button colors to blue (#007bff) instead of purple.
- [ ] Test dashboard rendering, card display, modal interactions, and responsive design.

## Future Phases
- Implement backend integration for card storage and authentication.
- Add OCR for card scanning.
- Add encryption for sensitive data.
- Implement additional features like transactions, notifications, etc.
