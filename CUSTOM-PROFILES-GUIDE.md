# 🎯 Custom Profiles System - Complete Guide

## ✨ Overview
The custom profiles system allows users to create specialized AI assistants tailored for specific tasks and use cases. This replaces the old hardcoded profile system with a flexible, user-driven approach.

## 🚀 Features

### ✅ **Profile Management**
- **Create Custom Profiles**: Users can create unlimited custom profiles
- **Profile Validation**: Robust validation with real-time feedback
- **Profile Storage**: Persistent storage using localStorage
- **Profile Selection**: Easy dropdown selection with visual indicators
- **Profile Deletion**: Safe deletion with confirmation dialogs

### 🎨 **Visual Design**
- **Glassmorphism UI**: Matches your existing design system perfectly
- **Visual Indicators**: Clear feedback for selected profiles
- **Custom Badges**: Green badges mark user-created profiles
- **Loading States**: Smooth loading animations during operations
- **Error Handling**: Beautiful error messages with validation feedback

### 🔧 **Robust Validation**
- **Name Validation**: 2-50 characters, alphanumeric + spaces/hyphens/underscores
- **Duplicate Prevention**: Prevents duplicate profile names
- **Description Limits**: Optional, max 200 characters
- **System Prompt**: Required, 10-2000 characters
- **Character Counters**: Real-time character counting with warnings

## 📋 How to Use

### 1. **Creating a Profile**
1. Go to the **Customize** section
2. Click **"+ Create New Profile"**
3. Fill in the form:
   - **Profile Name** (required): e.g., "Code Reviewer", "Math Tutor"
   - **Description** (optional): Brief explanation of the profile's purpose
   - **System Prompt** (required): Detailed instructions for the AI's behavior
4. Click **"💾 Save Profile"**

### 2. **Using a Profile**
1. Select your custom profile from the dropdown
2. Visual indicators show the active profile:
   - ✅ Checkmark indicator
   - 🏷️ "Custom" badge for user-created profiles
   - 📊 Profile status display

### 3. **Managing Profiles**
- **Delete**: Click "🗑️ Delete Custom Profile" (with confirmation)
- **Edit**: Currently requires deletion and recreation
- **Default Fallback**: Automatically switches to "Default Assistant" if selected profile is deleted

## 🎯 Example Custom Profiles

### **Code Reviewer**
```
Name: Code Reviewer
Description: Expert code analysis and improvement suggestions
System Prompt: You are an expert code reviewer with 10+ years of experience. Analyze code for bugs, security vulnerabilities, performance issues, and adherence to best practices. Provide specific, actionable feedback with code examples. Focus on maintainability, readability, and scalability.
```

### **Creative Writer**
```
Name: Creative Writer
Description: Imaginative storytelling and creative content
System Prompt: You are a creative writing assistant specializing in storytelling, character development, and narrative structure. Help users craft compelling stories, develop interesting characters, and improve their writing style. Be encouraging and provide specific suggestions for plot development and prose improvement.
```

### **Math Tutor**
```
Name: Math Tutor
Description: Step-by-step mathematical instruction
System Prompt: You are a patient and encouraging math tutor. Break down complex problems into simple steps, explain concepts clearly, and provide multiple examples. Always check for understanding and offer practice problems. Use visual descriptions when helpful and relate math to real-world applications.
```

## 🔧 Technical Implementation

### **Storage System**
- **Location**: `localStorage.customProfiles`
- **Format**: JSON array of profile objects
- **Persistence**: Survives browser restarts and app updates
- **Sync**: Automatic saving on create/delete operations

### **Profile Object Structure**
```javascript
{
  value: "code_reviewer",           // Unique identifier (auto-generated)
  name: "Code Reviewer",            // Display name
  description: "Expert code analysis...", // Optional description
  prompt: "You are an expert...",   // System prompt
  isCustom: true,                   // Marks as user-created
  createdAt: "2025-01-19T..."       // Creation timestamp
}
```

### **Event System**
- `create-profile`: Fired when user creates a new profile
- `delete-profile`: Fired when user deletes a profile
- `profile-select`: Fired when user selects a different profile

## 🎨 UI Color Scheme

The system uses your existing glassmorphism design with these key colors:
- **Background**: `var(--main-content-background)` with blur effects
- **Borders**: `var(--glass-border)` for consistent styling
- **Success**: Green accents (`#4ade80`) for custom badges and success states
- **Error**: Red accents (`#ef4444`) for validation errors
- **Warning**: Yellow accents (`#fbbf24`) for character count warnings

## 🧪 Testing

Run the test file to verify functionality:
```javascript
// In browser console
// Load and run: buddy/test-custom-profiles.js
```

## 🚀 Future Enhancements

### **Potential Improvements**
- **Profile Import/Export**: JSON file import/export for sharing
- **Profile Templates**: Pre-built templates for common use cases
- **Profile Categories**: Organize profiles by category (Work, Education, Creative)
- **Profile Search**: Search/filter profiles by name or description
- **Profile Analytics**: Track usage statistics for profiles
- **Cloud Sync**: Sync profiles across devices (for authenticated users)

## 🎯 Benefits

### **For Users**
- **Flexibility**: Create exactly the assistant they need
- **Efficiency**: Quick switching between specialized roles
- **Personalization**: Tailor AI behavior to specific workflows
- **Persistence**: Profiles saved permanently

### **For Developers**
- **Maintainability**: No more hardcoded profile lists
- **Extensibility**: Easy to add new features
- **User-Driven**: Users create their own content
- **Scalability**: Unlimited profiles without code changes

## 📝 Notes

- **Default Profile**: Always available, cannot be deleted
- **Validation**: Comprehensive client-side validation prevents errors
- **Fallback**: Automatic fallback to default if selected profile is deleted
- **Performance**: Efficient localStorage operations with minimal overhead
- **Accessibility**: Full keyboard navigation and screen reader support

---

**🎉 The custom profiles system is now fully functional and ready for use!**