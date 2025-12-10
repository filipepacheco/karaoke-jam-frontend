# Test Data Seeding Guide

## Overview
A dedicated page has been created to help you seed test data into the application for testing the jam session features.

## How to Use

### 1. Navigate to the Seed Page
Go to: `http://localhost:5173/test/seed-data`

### 2. Configure the Jam ID
- The page comes pre-filled with the first jam ID from the API
- You can change this to any existing jam ID
- Get a jam ID by visiting `/jams` and clicking on a jam

### 3. Click "Seed Test Data"
- The page will create all test data automatically
- Watch the results display as data is being created

### 4. View Your Results
After seeding completes successfully, you can:
- Click "Go to Browse Jams" to see all jams
- Click "View Jam Details" to see the specific jam with all the new data

## What Gets Created

### Musicians (4 total)
1. **John Doe** - Guitar (INTERMEDIATE)
2. **Jane Smith** - Drums (ADVANCED)
3. **Mike Johnson** - Bass (BEGINNER)
4. **Sarah Williams** - Vocals (ADVANCED)

### Songs (3 total)
1. **Bluesette** by Toots Thielemans (Jazz)
2. **All The Things You Are** by Jerome Kern (Jazz)
3. **Girl from Ipanema** by Tom Jobim (Bossa Nova)

### Registrations (4 total)
Links musicians to songs:
- John (Guitar) → Bluesette
- Jane (Drums) → All The Things You Are
- Mike (Bass) → Girl from Ipanema
- Sarah (Vocals) → Bluesette

### Performance Schedule (4 entries)
Creates a performance lineup:
1. John - Bluesette (IN_PROGRESS)
2. Jane - All The Things You Are (SCHEDULED)
3. Mike - Girl from Ipanema (SCHEDULED)
4. Sarah - Bluesette (SCHEDULED)

## Testing Features

Once you've seeded the data, you can test:

### ✅ Browse Jams Page (`/jams`)
- See all jams with the test data
- Filter and search functionality
- View jam cards with song counts

### ✅ Jam Detail Page (`/jams/:id`)
- View complete jam information
- See the repertoire section with all songs
- View musicians registered section
- See the performance schedule lineup
- QR code display
- Registration UI (based on your auth status)

### ✅ Empty States
- Try deleting test data from the API and see empty states
- Verify error messages appear correctly

## API Endpoints Used

The seeding process calls these endpoints:

- `POST /musicos` - Create musicians
- `POST /musicas` - Create songs
- `POST /inscricoes` - Create registrations
- `POST /escalas` - Create schedules

## Tips

- **Multiple Seeds**: You can run the seeding multiple times. It will create duplicate data each time.
- **Clear Data**: To clean up, you may need to manually delete registrations and schedules via the API before deleting musicians or songs.
- **Test Different Jams**: Change the Jam ID to seed data for different jams and compare UI behavior.
- **Mobile Testing**: After seeding, test the jam detail page on different screen sizes to verify responsive design.

## Troubleshooting

### Error: "Please provide a Jam ID"
- Make sure the Jam ID field is not empty
- The ID should match an existing jam in your database

### Error: "Failed to create musicians"
- Check that your backend API is running
- Verify the API endpoints are accessible
- Check browser console for detailed error messages

### No changes visible in UI
- Try refreshing the page
- Clear browser cache if needed
- Check that your jam ID matches the data that was seeded

## Next Steps

After seeding test data:
1. Test user registration workflow
2. Test filtering and search on Browse Jams
3. Test responsive design on different devices
4. Verify performance schedule displays correctly
5. Test authentication flow for registration

---

**Created**: December 6, 2025
**Location**: `src/pages/TestDataSeedPage.tsx`
**Route**: `/test/seed-data`

