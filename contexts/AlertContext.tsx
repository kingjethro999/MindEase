// contexts/AlertContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';
import CustomAlert, { AlertButton, CustomAlertProps } from '../components/CustomAlert';

interface AlertContextType {
  showAlert: (props: Omit<CustomAlertProps, 'visible'>) => void;
  hideAlert: () => void;
  showSuccess: (title: string, message: string, buttons?: AlertButton[]) => void;
  showError: (title: string, message: string, buttons?: AlertButton[]) => void;
  showWarning: (title: string, message: string, buttons?: AlertButton[]) => void;
  showInfo: (title: string, message: string, buttons?: AlertButton[]) => void;
  showConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string
  ) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alertProps, setAlertProps] = useState<CustomAlertProps>({
    visible: false,
    message: '',
  });

  const showAlert = (props: Omit<CustomAlertProps, 'visible'>) => {
    // Automatically use column layout if there are more than 2 buttons
    const buttonLayout = props.buttons && props.buttons.length > 1 ? 'column' : (props.buttonLayout || 'row');
    
    setAlertProps({
      ...props,
      visible: true,
      buttonLayout,
    });
  };

  const hideAlert = () => {
    setAlertProps(prev => ({
      ...prev,
      visible: false,
    }));
  };

  const showSuccess = (title: string, message: string, buttons?: AlertButton[]) => {
    const defaultButtons = [{ text: 'OK', style: 'default' as const }];
    const finalButtons = buttons || defaultButtons;
    showAlert({
      type: 'success',
      title,
      message,
      buttons: finalButtons,
      buttonLayout: 'column',
    });
  };

  const showError = (title: string, message: string, buttons?: AlertButton[]) => {
    const defaultButtons = [{ text: 'OK', style: 'default' as const }];
    const finalButtons = buttons || defaultButtons;
    showAlert({
      type: 'error',
      title,
      message,
      buttons: finalButtons,
      buttonLayout: 'column',
    });
  };

  const showWarning = (title: string, message: string, buttons?: AlertButton[]) => {
    const defaultButtons = [{ text: 'OK', style: 'default' as const }];
    const finalButtons = buttons || defaultButtons;
    showAlert({
      type: 'warning',
      title,
      message,
      buttons: finalButtons,
      buttonLayout: 'column',
    });
  };

  const showInfo = (title: string, message: string, buttons?: AlertButton[]) => {
    const defaultButtons = [{ text: 'OK', style: 'default' as const }];
    const finalButtons = buttons || defaultButtons;
    showAlert({
      type: 'info',
      title,
      message,
      buttons: finalButtons,
      buttonLayout: 'column',
    });
  };

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel'
  ) => {
    showAlert({
      type: 'warning',
      title,
      message,
      buttons: [
        {
          text: cancelText,
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: confirmText,
          style: 'destructive',
          onPress: onConfirm,
        },
      ],
      buttonLayout: 'column',
    });
  };

  const contextValue: AlertContextType = {
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      <CustomAlert {...alertProps} onClose={hideAlert} />
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export default AlertContext;
