# Database Seeding

This directory contains scripts for setting up and seeding the clinic assistant database.

## Setup

1. **Generate Prisma Client:**

   ```bash
   npx prisma generate
   ```

2. **Push Schema to Database:**

   ```bash
   npx prisma db push
   ```

3. **Seed the Database:**
   ```bash
   npm run db:seed
   ```

Or run the complete setup:

```bash
./scripts/setup-db.sh
```

## What Gets Created

The seeding script creates:

- **3 Doctors** with different specialties
- **15 Doctor Schedules** (5 days × 3 doctors)
- **3 Sample Patients**
- **4 Sample Reservations** (2 for today, 2 for tomorrow)

## Doctor IDs

After seeding, you'll get these doctor IDs:

- **Dr. Sarah Johnson** (General Medicine): `68e6ab81eb4b33ad343d7ca9`
- **Dr. Michael Smith** (Cardiology): `68e6ab81eb4b33ad343d7caa`
- **Dr. Emily Davis** (Pediatrics): `68e6ab81eb4b33ad343d7cab`

## Doctor Schedules

- **Dr. Sarah Johnson**: Monday-Friday, 9:00 AM - 5:00 PM
- **Dr. Michael Smith**: Monday-Friday, 8:00 AM - 4:00 PM
- **Dr. Emily Davis**: Monday-Friday, 10:00 AM - 6:00 PM

## Sample Data

The script creates realistic sample data including:

- Patient information with phone numbers
- Reservations for today and tomorrow
- Different appointment types and durations
- Various appointment statuses

## Usage in Application

The appointments page (`/appointments`) now uses real doctor data and will display:

- Doctor selection dropdown
- Calendar view with available time slots
- Real-time availability checking
- Integration with the queue system
