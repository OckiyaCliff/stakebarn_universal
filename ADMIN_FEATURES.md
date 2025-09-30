# Admin Features Guide

## Overview
All admin CRUD operations are fully implemented with both API routes and UI interfaces.

## Admin Pages

### 1. User Management (`/admin/dashboard/users`)
**Features:**
- View all users with their email and balances
- Edit user balances (available_balance and staked_balance)
- View user join dates
- Real-time balance updates

**How to use:**
1. Navigate to "Users" in the admin sidebar
2. Click the pencil icon next to any user
3. Update available balance or staked balance
4. Click "Save Changes"

### 2. Deposit Management (`/admin/dashboard/deposits`)
**Features:**
- View deposits by status (Pending/Approved/Declined)
- See deposit proof images and transaction hashes
- Approve deposits (automatically credits user balance)
- Decline deposits with required notes
- Track admin actions and notes

**How to use:**
1. Navigate to "Deposits" in the admin sidebar
2. Switch between Pending/Approved/Declined tabs
3. For pending deposits:
   - Click checkmark to approve
   - Click X to decline
   - Add optional notes for approval or required notes for decline
4. View proof images by clicking "View" link

### 3. Staking Management (`/admin/dashboard/staking`)
**Features:**
- View all active stakes
- Cancel user stakes (returns funds to available balance)
- Full CRUD for staking plans:
  - Create new plans
  - Edit existing plans (APY, lockup days, min stake)
  - Delete plans
  - Toggle plan active/inactive status

**How to use:**
1. Navigate to "Staking" in the admin sidebar
2. **Active Stakes tab:**
   - View all user stakes
   - Click X to cancel a stake
3. **Staking Plans tab:**
   - Click "Add Plan" to create new plan
   - Click pencil to edit plan
   - Click trash to delete plan
   - Configure: name, APY, lockup days, min stake, currency, status

## User Features

### Deposit Submission (`/dashboard/deposit`)
**Features:**
- View wallet addresses for deposits
- Submit deposit requests with:
  - Amount and currency selection
  - Transaction hash
  - Wallet address used
  - Proof image upload
- View deposit history and status

**How to use:**
1. Navigate to "Deposit" in user dashboard
2. Fill in the deposit form:
   - Select currency (USDT/BTC/ETH)
   - Enter amount
   - Enter transaction hash
   - Select wallet address used
   - Upload proof screenshot/image
3. Click "Submit Deposit"
4. Wait for admin approval

## API Endpoints

### Admin APIs
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/[id]/balance` - Update user balance
- `GET /api/admin/deposits?status=pending` - List deposits by status
- `POST /api/admin/deposits/[id]/approve` - Approve deposit
- `POST /api/admin/deposits/[id]/decline` - Decline deposit
- `GET /api/admin/stakes?status=active` - List stakes
- `POST /api/admin/stakes/[id]/cancel` - Cancel stake
- `GET /api/admin/staking-plans` - List staking plans
- `POST /api/admin/staking-plans` - Create plan
- `PUT /api/admin/staking-plans/[id]` - Update plan
- `DELETE /api/admin/staking-plans/[id]` - Delete plan

### User APIs
- `POST /api/deposits` - Submit deposit request

## Database Setup

Run these scripts in order:
1. `scripts/010_add_deposit_fields.sql` - Adds deposit proof and admin fields
2. `scripts/008_create_balance_functions.sql` - Creates balance update functions
3. `scripts/009_create_stake_functions.sql` - Creates stake management functions
4. `scripts/011_create_storage_bucket.sql` - Creates storage for deposit proofs

## Access

- **Admin Dashboard:** `/admin/dashboard`
- **User Dashboard:** `/dashboard`
- **Admin Login:** `/admin/auth/login`

All admin routes are protected by the `requireAdmin()` middleware.
