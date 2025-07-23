# Admin Authentication System

## Overview

The D&D Character Creator now includes an admin authentication system to protect character editing and deletion functionality. Only authorized users (DM and designated admins) can modify or delete existing characters.

## Features

- **Protected Actions**: Edit and delete character functionality requires admin authentication
- **Session Management**: 30-minute session timeout with automatic logout
- **Visual Indicators**: Clear visual cues showing admin status and protected actions
- **Secure Access**: Password-based authentication with configurable admin password

## How It Works

### For Regular Users
- Can view all characters normally
- Can create new characters without restrictions
- Edit and Delete buttons show as "Admin Only" with lock icons
- Clicking Edit/Delete prompts for admin password

### For Admin Users (DM)
- Enter admin password when prompted
- Gain access to edit and delete functionality for 30 minutes
- Session automatically expires after inactivity
- Can manually logout using the logout button
- All admin actions extend the session automatically

## Admin Password

**Default Password**: `DungeonMaster2024!`

### To Change the Admin Password:
1. Update the `VITE_ADMIN_PASSWORD` in your `.env` file
2. Restart the development server
3. Share the new password with your DM

### Production Deployment:
- Set the `VITE_ADMIN_PASSWORD` environment variable on your hosting platform
- Use a secure, unique password for production

## Visual Indicators

### Admin Status Bar
- **Green "Admin Access Active"**: Currently authenticated with logout option
- **Grey "Edit/Delete requires admin access"**: Not authenticated

### Action Buttons
- **Normal buttons**: Full-color edit/delete buttons when authenticated
- **Protected buttons**: Grey, dashed-border buttons with shield icons when not authenticated

### Information Alert
- Shows explanation of admin system when not authenticated
- Provides guidance on how to get admin access

## Security Considerations

### Current Implementation
- Client-side password verification (suitable for trusted user groups)
- Session timeout for automatic security
- Visual feedback for all authentication states

### Recommended for Production
- Consider server-side authentication for higher security needs
- Implement proper user roles and permissions
- Use secure password storage and transmission

## Usage Instructions

### For the DM/Admin:
1. Navigate to the Characters page
2. Click "Edit" or "Delete" on any character
3. Enter the admin password: `DungeonMaster2024!`
4. Enjoy admin access for 30 minutes
5. Logout manually or let session expire automatically

### For Players:
- Continue using the app normally for viewing and creating characters
- Contact the DM if you need a character edited or deleted
- The DM can provide the admin password if you're trusted with admin access

## Troubleshooting

### "Invalid Password" Error
- Verify you're using the correct admin password
- Contact the DM to confirm the current password
- Check for typos (password is case-sensitive)

### Session Expired
- Re-authenticate by clicking any edit/delete button
- Sessions last 30 minutes from last activity
- Admin actions automatically extend the session

### Can't See Edit/Delete Buttons
- Buttons are always visible but show different states
- Look for shield icons indicating admin-only access
- Check the admin status in the quick actions bar
