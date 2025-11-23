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
- [x] Integrate frontend with backend API for authentication and card management.
- [x] Update AuthContext to use backend API for login/signup.
- [x] Update Dashboard to fetch cards from backend and add new cards via API.
- [x] Update AddCardModal to include cardHolder and issuer fields.
- [x] Update CardDetailModal to display cardHolder and issuer.
- [x] Test dashboard rendering, card display, modal interactions, and responsive design.
- [x] Apply glassmorphism design to modals, category buttons, and add card button.
- [x] Remove duplicate .card-item CSS rules.
- [x] Implement edit and delete functionality for cards in CardDetailModal.
- [x] Update CardList to pass edit and delete handlers to CardDetailModal.
- [x] Add updateCard and deleteCard functions in Dashboard.tsx to handle API calls.
- [x] Update backend cards route to return all cards for demo purposes.
- [x] Update pre-seeded card numbers to full numbers instead of masked.

## Phase 3: Possession Authentication
- [x] Implement possession authentication for sensitive cards (ID, license, bank cards).
- [x] Add verification methods: OTP sent to registered email/phone, biometric verification, or card scanning confirmation.
- [x] Update AddCardModal to include possession verification step for sensitive categories.
- [x] Create PossessionAuthModal component for verification process.
- [x] Update backend to handle verification tokens and validation.
- [x] Add verification status to card model and display in UI.
- [x] Update Card interface to include verifiedStatus, verificationDate, and tokenId.
- [x] Update CardItem to display verification status badge.
- [x] Update CardDetailModal to show verification status and allow re-verification for bank cards.
- [x] Add CSS styles for verification status display.

## Phase 4: Transaction History Enhancement
- [ ] Move transaction history from mock data to backend API.
- [ ] Create transactions model and routes in backend.
- [ ] Implement API endpoints for fetching transactions by card ID.
- [ ] Update CardDetailModal to fetch real transaction data.
- [ ] Add pagination and filtering for transaction history.

## Phase 5: Payment Functionality
- [x] Create Payment page/component for making payments.
- [x] Implement manual payment entry form (amount, recipient, selected card).
- [x] Add digital payment with card scanning (integrate camera for QR/barcode scanning).
- [x] Create PaymentModal component for payment confirmation.
- [x] Update backend with payment processing routes.
- [x] Add payment history tracking and display.
- [x] Implement security measures for payment processing.
- [x] Add Payment route to App.tsx.
- [x] Update Header.tsx to include "Make Payment" button.
- [x] Add payment styles to index.css.
- [x] Update CardDetailModal to fetch real transaction data from backend.
- [x] Integrate transaction routes in server.ts.

## Phase 6: Card Scanning Integration
- [ ] Integrate camera access for card scanning (QR codes, barcodes).
- [ ] Add OCR functionality for extracting card details from images.
- [ ] Update AddCardModal to include scan option.
- [ ] Implement card scanning component with camera preview.
- [ ] Add validation for scanned card data.

## Future Phases
- Implement backend integration for card storage and authentication.
- Add encryption for sensitive data.
- Implement additional features like notifications, multi-device sync, etc.
