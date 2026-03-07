# Admin Panel - Quick Start Guide

## 🚀 Getting Started

### 1. First Time Setup
```bash
# Install dependencies
npm install

# Setup database
npm run db:push

# Seed initial data
npm run db:seed

# Start development server
npm run dev
```

### 2. Access Admin Panel
- URL: `http://localhost:3000/admin/login`
- Default credentials are set during seed (check seed.ts)

## 📋 Quick Reference

### Menu Management

#### Add New Menu Item
1. Go to `/admin/menu/items`
2. Click "Añadir Plato" button
3. Fill required fields:
   - Name *
   - Category *
4. Optional: description, price, image URL, award
5. Toggle: Popular, Homemade, Active status
6. Click "Crear Plato"

#### Edit Menu Item
1. Go to `/admin/menu/items`
2. Click edit icon on item row
3. Update fields
4. Click "Guardar Cambios"

#### Delete Menu Item
1. Go to `/admin/menu/items`
2. Click delete icon on item row
3. Confirm deletion in dialog

### Events Management

#### Create New Event
1. Go to `/admin/events`
2. Click "Crear Evento" button
3. Fill required fields:
   - Title *
   - Description *
   - Date *
   - Time *
   - Category *
4. Optional: image URL
5. Toggle: Featured, Active status
6. Click "Crear Evento"

#### Toggle Featured Event
1. Go to `/admin/events`
2. Click star icon on event card
3. Featured events show gold star badge

#### Edit/Delete Event
- Click "Editar" button to modify
- Click delete icon and confirm to remove

### Site Settings

#### Update Settings
1. Go to `/admin/settings`
2. Modify any section:
   - General Settings
   - Hero Section
   - About Section
   - Contact Information
3. Scroll to bottom and click "Guardar Cambios"

#### Toggle Events Visibility
1. Go to `/admin/settings`
2. Use toggle switch for "Sección de Eventos"
3. Click "Guardar Cambios"

## 🎨 Design Guidelines

### Colors
- Primary: #53A699 (teal green)
- Gold: #C7AF65 (golden accent)
- Use for CTAs, highlights, and branding

### Image URLs
- Use high-quality images (minimum 800px width)
- Recommended: Unsplash, restaurant photos
- Ensure HTTPS URLs
- Aspect ratio: 16:9 or 4:3 works best

### Text Guidelines
- **Titles**: Clear, concise (max 60 chars)
- **Descriptions**: Informative (100-200 chars)
- **Prices**: Include € symbol (e.g., "12,50€")
- **Time**: Use 24h format (e.g., "20:30")

## ⚠️ Common Issues

### Issue: Image Not Loading
- Check URL is valid and accessible
- Ensure HTTPS (not HTTP)
- Verify image is publicly accessible
- Try opening URL in new browser tab

### Issue: Form Not Submitting
- Check for validation errors (red text)
- Ensure all required fields (*) are filled
- Check browser console for errors

### Issue: Not Logged In
- Session may have expired
- Go to `/admin/login` and sign in again
- Check credentials are correct

## 📱 Mobile Access

The admin panel is fully responsive:
- Access from any device
- Touch-friendly buttons
- Optimized for tablets and phones

## 🔒 Security Notes

- Never share admin credentials
- Log out when using shared computers
- Use strong passwords
- Session expires after inactivity

## 💡 Pro Tips

1. **Preview Changes**: Open site in new tab while editing
2. **Image Preview**: Paste URL and wait to see preview
3. **Bulk Updates**: Edit settings page saves all at once
4. **Featured Events**: Limit to 2-3 for best UX
5. **Active Status**: Use to hide items without deleting
6. **Categories**: Group similar items for better organization

## 🆘 Support

If you encounter issues:
1. Check browser console (F12)
2. Verify database connection
3. Check API route logs
4. Review documentation at `ADMIN_PANEL_DOCUMENTATION.md`

## 📊 Dashboard Stats

The main dashboard (`/admin`) shows:
- Total menu items (active)
- Total events
- Active events
- Events section visibility status

Click any stat card to navigate to that section.

## ⌨️ Keyboard Shortcuts

- `Esc` - Close modal dialogs
- `Enter` - Submit forms (when focused)
- `Tab` - Navigate form fields

## 🔄 Workflow Example

### Adding a New Menu Special

1. Take photo of dish
2. Upload to image host (or use URL)
3. Go to `/admin/menu/items/new`
4. Fill in:
   - Name: "Taco Tuesday Special"
   - Description: "3 tacos with drink"
   - Category: "Para Compartir"
   - Price: "15,90€"
   - Image URL: [paste URL]
   - Toggle: Popular ✓
   - Toggle: Active ✓
5. Click "Crear Plato"
6. View on website immediately!

### Promoting an Event

1. Create event at `/admin/events/new`
2. Add attractive image and description
3. Set date and time
4. Toggle "Featured" ✓
5. Save and share on social media!

---

**Need help?** Refer to full documentation in `ADMIN_PANEL_DOCUMENTATION.md`
