# Database Migration Instructions

## ⚠️ IMPORTANT: Manual Steps Required

After the code changes have been applied, you **MUST** run the following database migration steps:

### 1. Database Schema Update

The Prisma schema has been updated with new fields. You need to apply these changes to your database:

#### Option A: Manual SQL in Supabase (Recommended for Vercel)

1. **Buka Supabase Dashboard** → SQL Editor
2. **Jalankan SQL ini:**

```sql
-- Add missing columns to tickets table
ALTER TABLE tickets
ADD COLUMN IF NOT EXISTS departure_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS departure_time VARCHAR(255);

-- Update existing records if needed
UPDATE tickets
SET departure_date = date
WHERE departure_date IS NULL AND date IS NOT NULL;
```

#### Option B: Prisma Deploy (Alternative)

```bash
cd Server1
npx prisma migrate deploy
```

#### Option C: Prisma Push (Quick Fix - Development Only)

```bash
cd Server1
npx prisma db push
```

**⚠️ Note:** For Vercel deployment, use Option A (Manual SQL) as it's the most reliable.

### 2. Restart Server

After running the migration:

```bash
cd Server1
npm restart
# or
pm2 restart server1
```

### 3. Verify Changes

Test the endpoints to ensure they work:

- POST `/api/bus/ticket` (with auth token)
- GET `/api/bus/tickets/:userId` (with auth token)

### 4. Check Logs

Monitor server logs for any Prisma errors:

```bash
cd Server1
tail -f logs/error.log
```

## New Fields Added

- `departure_date` (DateTime?) - Optional separate date field
- `departure_time` (String?) - Optional time string
- Updated `has_addons` to have proper default value

## Troubleshooting

If you see "column does not exist" errors:

1. Check that migration was applied successfully
2. Verify database connection
3. Restart the server
4. Check Prisma client is regenerated: `npx prisma generate`

## Production Deployment

For production deployment:

1. Apply migration to production database
2. Deploy updated server code
3. Test endpoints in production
4. Monitor logs for any issues
