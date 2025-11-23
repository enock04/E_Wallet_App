 G6
## Phase 2: Dashboard with Cards and Categories
 [x] Define TypeScript interfaces for Card (id, name, number, expiry, category) and Category (id, name).
 [x] Create mock data for categories and cards in Dashboard.tsx.
  [x] Update Dashboard.tsx to display categories as sections, each containing a list of cards using CardList and CardItem components.
 [x] Implement CardItem.tsx to render individual card details (masked number, name, expiry) with click to view details.
 [x] Implement CardList.tsx to map over cards and render CardItem components.
[x] Implement AddCardModal.tsx for adding new cards (form with inputs for card details and category selection).
 [x] Implement CardDetailModal.tsx for viewing/editing card details.
 [x] Update Header.tsx to include a header with user info and add card button.
 [x] Add CSS classes in index.css for dashboard layout (grid for categories, card styling with shadows, responsive design).
 [x] Add category bar with filter buttons (All Cards, Bank Cards, IDs, License, Tap & Go, Documents).
 [x] Implement color-coded cards based on category (bank: blue, ids: purple, license: pink, transit: cyan, documents: green).
 [x] Update CSS to remove hardcoded background from .card-item and apply via inline styles in CardItem.tsx.
 [x] Change dashboard background to light gray (#f8f9fa) for better contrast.
 [x] Update text colors in dashboard content to dark (#333) for visibility on light background.
 [x] Update category section headers to dark color.
 [x] Change category button colors to blue (#007bff) instead of purple.
[x] Integrate frontend with backend API for authentication and card management.
 [x] Update AuthContext to use backend API for login/signup.
 [x] Update Dashboard to fetch cards from backend and add new cards via API.
 [x] Update AddCardModal to include cardHolder and issuer fields.
 [x] Update CardDetailModal to display cardHolder and issuer.
 [x] Test dashboard rendering, card display, modal interactions, and responsive design.
 [x] Apply glassmorphism design to modals, category buttons, and add card button.
 [x] Remove duplicate .card-item CSS rules.
 [x] Implement edit and delete functionality for cards in CardDetailModal.
 [x] Update CardList to pass edit and delete handlers to CardDetailModal.
 [x] Add updateCard and deleteCard functions in Dashboard.tsx to handle API calls.
 [x] Update backend cards route to return all cards for demo purposes.
 [x] Update pre-seeded card numbers to full numbers instead of masked.
# e_Wallet_App
 main
