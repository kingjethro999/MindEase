# Custom Alert Component

A beautiful, customizable alert component for React Native with smooth animations and multiple alert types.

## Features

- 🎨 **Beautiful Design** - Matches your app's theme with custom styling
- 🚀 **Smooth Animations** - Spring animations for show/hide transitions
- 🎯 **Multiple Types** - Success, Error, Warning, Info, and Confirmation alerts
- 📱 **Responsive** - Adapts to different screen sizes
- 🔧 **Customizable** - Custom buttons, auto-close, and styling options
- 🌟 **Blur Effect** - Modern blur background for better focus
- 📦 **Easy Integration** - Simple context-based API

## Installation

The component is already integrated into your app. Make sure you have the required dependencies:

```bash
pnpm add expo-blur react-native-svg
```

## Usage

### 1. Basic Usage with Context

The `AlertProvider` is already set up in your app layout. Use the `useAlert` hook in any component:

```tsx
import { useAlert } from '../contexts/AlertContext';

const MyComponent = () => {
  const { showSuccess, showError, showWarning, showInfo, showConfirm } = useAlert();

  const handleSuccess = () => {
    showSuccess('Success!', 'Your action was completed successfully.');
  };

  const handleError = () => {
    showError('Error', 'Something went wrong. Please try again.');
  };

  const handleWarning = () => {
    showWarning('Warning', 'Please check your input before proceeding.');
  };

  const handleInfo = () => {
    showInfo('Info', 'Here is some helpful information.');
  };

  const handleConfirm = () => {
    showConfirm(
      'Delete Item',
      'Are you sure you want to delete this item?',
      () => {
        // Handle confirmation
        console.log('User confirmed');
      },
      () => {
        // Handle cancellation
        console.log('User cancelled');
      },
      'Delete',
      'Cancel'
    );
  };

  return (
    <View>
      <Button title="Show Success" onPress={handleSuccess} />
      <Button title="Show Error" onPress={handleError} />
      <Button title="Show Warning" onPress={handleWarning} />
      <Button title="Show Info" onPress={handleInfo} />
      <Button title="Show Confirm" onPress={handleConfirm} />
    </View>
  );
};
```

### 2. Advanced Usage with Custom Props

```tsx
import { useAlert } from '../contexts/AlertContext';

const MyComponent = () => {
  const { showAlert } = useAlert();

  const handleCustomAlert = () => {
    showAlert({
      type: 'warning',
      title: 'Custom Alert',
      message: 'This is a custom alert with multiple buttons.',
      buttons: [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('Cancelled'),
        },
        {
          text: 'Save',
          style: 'default',
          onPress: () => console.log('Saved'),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => console.log('Deleted'),
        },
      ],
      autoClose: true,
      autoCloseDelay: 5000,
      showCloseButton: false,
    });
  };

  return (
    <Button title="Show Custom Alert" onPress={handleCustomAlert} />
  );
};
```

## API Reference

### AlertContext Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `showSuccess` | Show success alert | `(title: string, message: string, buttons?: AlertButton[])` |
| `showError` | Show error alert | `(title: string, message: string, buttons?: AlertButton[])` |
| `showWarning` | Show warning alert | `(title: string, message: string, buttons?: AlertButton[])` |
| `showInfo` | Show info alert | `(title: string, message: string, buttons?: AlertButton[])` |
| `showConfirm` | Show confirmation dialog | `(title: string, message: string, onConfirm: () => void, onCancel?: () => void, confirmText?: string, cancelText?: string)` |
| `showAlert` | Show custom alert | `(props: CustomAlertProps)` |
| `hideAlert` | Hide current alert | `()` |

### CustomAlertProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | `false` | Whether the alert is visible |
| `title` | `string` | `undefined` | Alert title |
| `message` | `string` | `required` | Alert message |
| `type` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Alert type |
| `buttons` | `AlertButton[]` | `[{ text: 'OK' }]` | Alert buttons |
| `onClose` | `() => void` | `undefined` | Called when alert is closed |
| `showCloseButton` | `boolean` | `true` | Whether to show close button |
| `autoClose` | `boolean` | `false` | Whether to auto-close |
| `autoCloseDelay` | `number` | `3000` | Auto-close delay in ms |

### AlertButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | `required` | Button text |
| `onPress` | `() => void` | `undefined` | Button press handler |
| `style` | `'default' \| 'cancel' \| 'destructive'` | `'default'` | Button style |

## Alert Types

### Success Alert
- **Icon**: CheckCircle
- **Color**: Green (`theme.colors.success`)
- **Use case**: Successful operations, confirmations

### Error Alert
- **Icon**: AlertCircle
- **Color**: Red (`theme.colors.error`)
- **Use case**: Errors, failures, validation issues

### Warning Alert
- **Icon**: AlertTriangle
- **Color**: Orange (`theme.colors.warning`)
- **Use case**: Warnings, confirmations, important notices

### Info Alert
- **Icon**: Info
- **Color**: Blue (`theme.colors.primary`)
- **Use case**: Information, tips, general messages

## Examples in Your App

The custom alert is already integrated in:

- **Onboarding Consent Screen** - Shows warning when agreements aren't accepted
- **Login Screen** - Shows error for login failures and success for password reset
- **Signup Screen** - Can be used for validation errors and success messages

## Styling

The alert component automatically uses your app's theme colors and styling. The component is fully responsive and will adapt to different screen sizes.

## Accessibility

The alert component includes:
- Proper accessibility labels
- Keyboard navigation support
- Screen reader compatibility
- Back button handling on Android

## Performance

- Uses `useNativeDriver: true` for smooth 60fps animations
- Optimized re-renders with proper React patterns
- Lightweight blur effect implementation
