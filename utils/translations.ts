export interface TranslationKeys {
  // Settings Screen
  settings: string;
  account: string;
  profile: string;
  notifications: string;
  dailyReminders: string;
  dailyMoodCheckInReminders: string;
  affirmations: string;
  dailyPositiveAffirmations: string;
  weeklyReports: string;
  weeklyProgressSummaries: string;
  privacyAndData: string;
  cloudBackup: string;
  syncDataAcrossDevices: string;
  backupNow: string;
  uploadDataToCloud: string;
  restoreData: string;
  downloadFromCloud: string;
  appPreferences: string;
  language: string;
  dataManagement: string;
  exportData: string;
  downloadYourWellnessReport: string;
  clearAllData: string;
  deleteAllLocalData: string;
  support: string;
  helpAndSupport: string;
  getHelpAndContactSupport: string;
  privacyPolicy: string;
  readOurPrivacyPolicy: string;
  signOut: string;
  signOutOfYourAccount: string;
  saveSettings: string;
  mindEaseVersion: string;
  yourMentalWellnessCompanion: string;
  
  // Language names
  english: string;
  spanish: string;
  french: string;
  german: string;
  portuguese: string;
  
  // Common terms
  success: string;
  error: string;
  cancel: string;
  ok: string;
  loading: string;
  save: string;
  delete: string;
  confirm: string;
  back: string;
  next: string;
  continue: string;
  
  // Alert messages
  settingsSavedSuccessfully: string;
  failedToSaveSettings: string;
  confirmSignOut: string;
  areYouSureYouWantToSignOut: string;
  clearAllDataTitle: string;
  clearAllDataMessage: string;
  allDataCleared: string;
  failedToClearData: string;
  cloudBackupEnabled: string;
  cloudBackupEnabledMessage: string;
  cloudBackupDisabled: string;
  cloudBackupDisabledMessage: string;
  cloudBackupDisabledSyncMessage: string;
  cloudBackupError: string;
  exportingData: string;
  generatingYourWellnessReport: string;
  exportComplete: string;
  exportCompleteMessage: string;
  saveToDevice: string;
  shareReport: string;
  savedSuccessfully: string;
  saveFailed: string;
  shareFailed: string;
  exportFailed: string;
  profileUpdatedSuccessfully: string;
  failedToSaveProfile: string;
  permissionRequired: string;
  permissionRequiredMessage: string;
  themeUpdated: string;
  darkModeEnabled: string;
  lightModeEnabled: string;
  restartAppToSeeChanges: string;
  languageSelection: string;
  languageSelectionMessage: string;
  selectYourPreferredLanguage: string;
  helpAndSupportTitle: string;
  helpAndSupportMessage: string;
  contactSupport: string;
  privacyPolicyTitle: string;
  privacyPolicyMessage: string;
  viewFullPolicy: string;
  cloudBackupDisabledTitle: string;
  backingUpData: string;
  backupComplete: string;
  backupFailed: string;
  restoreDataTitle: string;
  restoreDataMessage: string;
  restoringData: string;
  restoreComplete: string;
  restoreFailed: string;
  anonymousUser: string;
}

export const translations: Record<string, Partial<TranslationKeys>> = {
  en: {
    // Settings Screen
    settings: 'Settings',
    account: 'Account',
    profile: 'Profile',
    notifications: 'Notifications',
    dailyReminders: 'Daily Reminders',
    dailyMoodCheckInReminders: 'Daily mood check-in reminders',
    affirmations: 'Affirmations',
    dailyPositiveAffirmations: 'Daily positive affirmations',
    weeklyReports: 'Weekly Reports',
    weeklyProgressSummaries: 'Weekly progress summaries',
    privacyAndData: 'Privacy & Data',
    cloudBackup: 'Cloud Backup',
    syncDataAcrossDevices: 'Sync data across devices',
    backupNow: 'Backup Now',
    uploadDataToCloud: 'Upload data to cloud',
    restoreData: 'Restore Data',
    downloadFromCloud: 'Download from cloud',
    appPreferences: 'App Preferences',
    language: 'Language',
    dataManagement: 'Data Management',
    exportData: 'Export Data',
    downloadYourWellnessReport: 'Download your wellness report',
    clearAllData: 'Clear All Data',
    deleteAllLocalData: 'Delete all local data',
    support: 'Support',
    helpAndSupport: 'Help & Support',
    getHelpAndContactSupport: 'Get help and contact support',
    privacyPolicy: 'Privacy Policy',
    readOurPrivacyPolicy: 'Read our privacy policy',
    signOut: 'Sign Out',
    signOutOfYourAccount: 'Sign out of your account',
    saveSettings: 'Save Settings',
    mindEaseVersion: 'MindEase v1.0.0',
    yourMentalWellnessCompanion: 'Your mental wellness companion',
    
    // Language names
    english: 'English',
    spanish: 'Spanish',
    french: 'French',
    german: 'German',
    portuguese: 'Portuguese',
    
    // Common terms
    success: 'Success',
    error: 'Error',
    cancel: 'Cancel',
    ok: 'OK',
    loading: 'Loading',
    save: 'Save',
    delete: 'Delete',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    continue: 'Continue',
    
    // Alert messages
    settingsSavedSuccessfully: 'Settings saved successfully!',
    failedToSaveSettings: 'Failed to save settings. Please try again.',
    confirmSignOut: 'Sign Out',
    areYouSureYouWantToSignOut: 'Are you sure you want to sign out?',
    clearAllDataTitle: 'Clear All Data',
    clearAllDataMessage: 'This will permanently delete all your local data including mood entries, exercise history, and achievements. This action cannot be undone.',
    allDataCleared: 'All data has been cleared.',
    failedToClearData: 'Failed to clear data. Please try again.',
    cloudBackupEnabled: 'Cloud Backup Enabled',
    cloudBackupEnabledMessage: 'Your data will now be automatically backed up to the cloud when you have an internet connection.',
    cloudBackupDisabled: 'Cloud Backup Disabled',
    cloudBackupDisabledMessage: 'Your data will only be stored locally on this device.',
    cloudBackupError: 'Failed to update cloud backup settings.',
    exportingData: 'Exporting Data',
    generatingYourWellnessReport: 'Generating your wellness report...',
    exportComplete: 'Export Complete',
    exportCompleteMessage: 'Your wellness report has been generated with {moodEntries} mood entries, {exercises} exercises, and {journalEntries} journal entries.',
    saveToDevice: 'Save to Device',
    shareReport: 'Share Report',
    savedSuccessfully: 'Saved Successfully',
    saveFailed: 'Save Failed',
    shareFailed: 'Share Failed',
    exportFailed: 'Export Failed',
    profileUpdatedSuccessfully: 'Profile updated successfully!',
    failedToSaveProfile: 'Failed to save profile changes locally.',
    permissionRequired: 'Permission Required',
    permissionRequiredMessage: 'Please enable notifications in your device settings to receive reminders.',
    themeUpdated: 'Theme Updated',
    darkModeEnabled: 'Dark mode enabled. Restart the app to see changes.',
    lightModeEnabled: 'Light mode enabled. Restart the app to see changes.',
    restartAppToSeeChanges: 'Restart the app to see changes.',
    languageSelection: 'Language Selection',
    languageSelectionMessage: 'Language selection will be available in a future update. Currently supporting English only.',
    selectYourPreferredLanguage: 'Select your preferred language:',
    helpAndSupportTitle: 'Help & Support',
    helpAndSupportMessage: 'For support, please contact us at:\n\nEmail: support@mindease.app\n\nOr visit our help center for FAQs and guides.',
    contactSupport: 'Contact Support',
    privacyPolicyTitle: 'Privacy Policy',
    privacyPolicyMessage: 'Your privacy is important to us. All your data is stored locally on your device and is never shared without your explicit consent.\n\nKey points:\n• Data is stored locally by default\n• Cloud backup is optional\n• No data is sold to third parties\n• You can export or delete your data anytime',
    viewFullPolicy: 'View Full Policy',
    cloudBackupDisabledTitle: 'Cloud Backup Disabled',
    cloudBackupDisabledSyncMessage: 'Please enable cloud backup first to sync your data.',
    backingUpData: 'Backing Up Data',
    backupComplete: 'Backup Complete',
    backupFailed: 'Backup Failed',
    restoreDataTitle: 'Restore Data',
    restoreDataMessage: 'This will replace your current local data with the data from the cloud. Are you sure you want to continue?',
    restoringData: 'Restoring Data',
    restoreComplete: 'Restore Complete',
    restoreFailed: 'Restore Failed',
    anonymousUser: 'Anonymous User',
  },
  
  es: {
    // Settings Screen
    settings: 'Configuración',
    account: 'Cuenta',
    profile: 'Perfil',
    notifications: 'Notificaciones',
    dailyReminders: 'Recordatorios Diarios',
    dailyMoodCheckInReminders: 'Recordatorios diarios de registro de estado de ánimo',
    affirmations: 'Afirmaciones',
    dailyPositiveAffirmations: 'Afirmaciones positivas diarias',
    weeklyReports: 'Reportes Semanales',
    weeklyProgressSummaries: 'Resúmenes de progreso semanal',
    privacyAndData: 'Privacidad y Datos',
    cloudBackup: 'Respaldo en la Nube',
    syncDataAcrossDevices: 'Sincronizar datos entre dispositivos',
    backupNow: 'Respaldar Ahora',
    uploadDataToCloud: 'Subir datos a la nube',
    restoreData: 'Restaurar Datos',
    downloadFromCloud: 'Descargar de la nube',
    appPreferences: 'Preferencias de la App',
    language: 'Idioma',
    dataManagement: 'Gestión de Datos',
    exportData: 'Exportar Datos',
    downloadYourWellnessReport: 'Descargar tu reporte de bienestar',
    clearAllData: 'Borrar Todos los Datos',
    deleteAllLocalData: 'Eliminar todos los datos locales',
    support: 'Soporte',
    helpAndSupport: 'Ayuda y Soporte',
    getHelpAndContactSupport: 'Obtener ayuda y contactar soporte',
    privacyPolicy: 'Política de Privacidad',
    readOurPrivacyPolicy: 'Leer nuestra política de privacidad',
    signOut: 'Cerrar Sesión',
    signOutOfYourAccount: 'Cerrar sesión de tu cuenta',
    saveSettings: 'Guardar Configuración',
    mindEaseVersion: 'MindEase v1.0.0',
    yourMentalWellnessCompanion: 'Tu compañero de bienestar mental',
    
    // Language names
    english: 'Inglés',
    spanish: 'Español',
    french: 'Francés',
    german: 'Alemán',
    portuguese: 'Portugués',
    
    // Common terms
    success: 'Éxito',
    error: 'Error',
    cancel: 'Cancelar',
    ok: 'OK',
    loading: 'Cargando',
    save: 'Guardar',
    delete: 'Eliminar',
    confirm: 'Confirmar',
    back: 'Atrás',
    next: 'Siguiente',
    continue: 'Continuar',
    
    // Alert messages
    settingsSavedSuccessfully: '¡Configuración guardada exitosamente!',
    failedToSaveSettings: 'Error al guardar la configuración. Por favor, inténtalo de nuevo.',
    confirmSignOut: 'Cerrar Sesión',
    areYouSureYouWantToSignOut: '¿Estás seguro de que quieres cerrar sesión?',
    clearAllDataTitle: 'Borrar Todos los Datos',
    clearAllDataMessage: 'Esto eliminará permanentemente todos tus datos locales, incluyendo entradas de estado de ánimo, historial de ejercicios y logros. Esta acción no se puede deshacer.',
    allDataCleared: 'Todos los datos han sido borrados.',
    failedToClearData: 'Error al borrar los datos. Por favor, inténtalo de nuevo.',
    cloudBackupEnabled: 'Respaldo en la Nube Habilitado',
    cloudBackupEnabledMessage: 'Tus datos ahora se respaldarán automáticamente en la nube cuando tengas conexión a internet.',
    cloudBackupDisabled: 'Respaldo en la Nube Deshabilitado',
    cloudBackupDisabledMessage: 'Tus datos solo se almacenarán localmente en este dispositivo.',
    cloudBackupError: 'Error al actualizar la configuración de respaldo en la nube.',
    exportingData: 'Exportando Datos',
    generatingYourWellnessReport: 'Generando tu reporte de bienestar...',
    exportComplete: 'Exportación Completa',
    exportCompleteMessage: 'Tu reporte de bienestar ha sido generado con {moodEntries} entradas de estado de ánimo, {exercises} ejercicios y {journalEntries} entradas de diario.',
    saveToDevice: 'Guardar en Dispositivo',
    shareReport: 'Compartir Reporte',
    savedSuccessfully: 'Guardado Exitosamente',
    saveFailed: 'Error al Guardar',
    shareFailed: 'Error al Compartir',
    exportFailed: 'Error al Exportar',
    profileUpdatedSuccessfully: '¡Perfil actualizado exitosamente!',
    failedToSaveProfile: 'Error al guardar los cambios del perfil localmente.',
    permissionRequired: 'Permiso Requerido',
    permissionRequiredMessage: 'Por favor, habilita las notificaciones en la configuración de tu dispositivo para recibir recordatorios.',
    themeUpdated: 'Tema Actualizado',
    darkModeEnabled: 'Modo oscuro habilitado. Reinicia la app para ver los cambios.',
    lightModeEnabled: 'Modo claro habilitado. Reinicia la app para ver los cambios.',
    restartAppToSeeChanges: 'Reinicia la app para ver los cambios.',
    languageSelection: 'Selección de Idioma',
    languageSelectionMessage: 'La selección de idioma estará disponible en una futura actualización. Actualmente solo se admite inglés.',
    selectYourPreferredLanguage: 'Selecciona tu idioma preferido:',
    helpAndSupportTitle: 'Ayuda y Soporte',
    helpAndSupportMessage: 'Para soporte, por favor contáctanos en:\n\nEmail: support@mindease.app\n\nO visita nuestro centro de ayuda para preguntas frecuentes y guías.',
    contactSupport: 'Contactar Soporte',
    privacyPolicyTitle: 'Política de Privacidad',
    privacyPolicyMessage: 'Tu privacidad es importante para nosotros. Todos tus datos se almacenan localmente en tu dispositivo y nunca se comparten sin tu consentimiento explícito.\n\nPuntos clave:\n• Los datos se almacenan localmente por defecto\n• El respaldo en la nube es opcional\n• No vendemos datos a terceros\n• Puedes exportar o eliminar tus datos en cualquier momento',
    viewFullPolicy: 'Ver Política Completa',
    cloudBackupDisabledTitle: 'Respaldo en la Nube Deshabilitado',
    cloudBackupDisabledSyncMessage: 'Por favor, habilita primero el respaldo en la nube para sincronizar tus datos.',
    backingUpData: 'Respaldando Datos',
    backupComplete: 'Respaldo Completo',
    backupFailed: 'Error en el Respaldo',
    restoreDataTitle: 'Restaurar Datos',
    restoreDataMessage: 'Esto reemplazará tus datos locales actuales con los datos de la nube. ¿Estás seguro de que quieres continuar?',
    restoringData: 'Restaurando Datos',
    restoreComplete: 'Restauración Completa',
    restoreFailed: 'Error en la Restauración',
    anonymousUser: 'Usuario Anónimo',
  },
  
  fr: {
    // Settings Screen
    settings: 'Paramètres',
    account: 'Compte',
    profile: 'Profil',
    notifications: 'Notifications',
    dailyReminders: 'Rappels Quotidiens',
    dailyMoodCheckInReminders: 'Rappels quotidiens de suivi de l\'humeur',
    affirmations: 'Affirmations',
    dailyPositiveAffirmations: 'Affirmations positives quotidiennes',
    weeklyReports: 'Rapports Hebdomadaires',
    weeklyProgressSummaries: 'Résumés de progrès hebdomadaires',
    privacyAndData: 'Confidentialité et Données',
    cloudBackup: 'Sauvegarde Cloud',
    syncDataAcrossDevices: 'Synchroniser les données entre appareils',
    backupNow: 'Sauvegarder Maintenant',
    uploadDataToCloud: 'Télécharger les données vers le cloud',
    restoreData: 'Restaurer les Données',
    downloadFromCloud: 'Télécharger depuis le cloud',
    appPreferences: 'Préférences de l\'App',
    language: 'Langue',
    dataManagement: 'Gestion des Données',
    exportData: 'Exporter les Données',
    downloadYourWellnessReport: 'Télécharger votre rapport de bien-être',
    clearAllData: 'Effacer Toutes les Données',
    deleteAllLocalData: 'Supprimer toutes les données locales',
    support: 'Support',
    helpAndSupport: 'Aide et Support',
    getHelpAndContactSupport: 'Obtenir de l\'aide et contacter le support',
    privacyPolicy: 'Politique de Confidentialité',
    readOurPrivacyPolicy: 'Lire notre politique de confidentialité',
    signOut: 'Se Déconnecter',
    signOutOfYourAccount: 'Se déconnecter de votre compte',
    saveSettings: 'Enregistrer les Paramètres',
    mindEaseVersion: 'MindEase v1.0.0',
    yourMentalWellnessCompanion: 'Votre compagnon de bien-être mental',
    
    // Language names
    english: 'Anglais',
    spanish: 'Espagnol',
    french: 'Français',
    german: 'Allemand',
    portuguese: 'Portugais',
    
    // Common terms
    success: 'Succès',
    error: 'Erreur',
    cancel: 'Annuler',
    ok: 'OK',
    loading: 'Chargement',
    save: 'Enregistrer',
    delete: 'Supprimer',
    confirm: 'Confirmer',
    back: 'Retour',
    next: 'Suivant',
    continue: 'Continuer',
    
    // Alert messages
    settingsSavedSuccessfully: 'Paramètres enregistrés avec succès !',
    failedToSaveSettings: 'Échec de l\'enregistrement des paramètres. Veuillez réessayer.',
    confirmSignOut: 'Se Déconnecter',
    areYouSureYouWantToSignOut: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    clearAllDataTitle: 'Effacer Toutes les Données',
    clearAllDataMessage: 'Cela supprimera définitivement toutes vos données locales, y compris les entrées d\'humeur, l\'historique des exercices et les réalisations. Cette action ne peut pas être annulée.',
    allDataCleared: 'Toutes les données ont été effacées.',
    failedToClearData: 'Échec de l\'effacement des données. Veuillez réessayer.',
    cloudBackupEnabled: 'Sauvegarde Cloud Activée',
    cloudBackupEnabledMessage: 'Vos données seront maintenant automatiquement sauvegardées dans le cloud lorsque vous avez une connexion internet.',
    cloudBackupDisabled: 'Sauvegarde Cloud Désactivée',
    cloudBackupDisabledMessage: 'Vos données ne seront stockées que localement sur cet appareil.',
    cloudBackupError: 'Échec de la mise à jour des paramètres de sauvegarde cloud.',
    exportingData: 'Exportation des Données',
    generatingYourWellnessReport: 'Génération de votre rapport de bien-être...',
    exportComplete: 'Exportation Terminée',
    exportCompleteMessage: 'Votre rapport de bien-être a été généré avec {moodEntries} entrées d\'humeur, {exercises} exercices et {journalEntries} entrées de journal.',
    saveToDevice: 'Enregistrer sur l\'Appareil',
    shareReport: 'Partager le Rapport',
    savedSuccessfully: 'Enregistré avec Succès',
    saveFailed: 'Échec de l\'Enregistrement',
    shareFailed: 'Échec du Partage',
    exportFailed: 'Échec de l\'Exportation',
    profileUpdatedSuccessfully: 'Profil mis à jour avec succès !',
    failedToSaveProfile: 'Échec de l\'enregistrement des modifications du profil localement.',
    permissionRequired: 'Permission Requise',
    permissionRequiredMessage: 'Veuillez activer les notifications dans les paramètres de votre appareil pour recevoir des rappels.',
    themeUpdated: 'Thème Mis à Jour',
    darkModeEnabled: 'Mode sombre activé. Redémarrez l\'app pour voir les changements.',
    lightModeEnabled: 'Mode clair activé. Redémarrez l\'app pour voir les changements.',
    restartAppToSeeChanges: 'Redémarrez l\'app pour voir les changements.',
    languageSelection: 'Sélection de Langue',
    languageSelectionMessage: 'La sélection de langue sera disponible dans une future mise à jour. Seul l\'anglais est actuellement supporté.',
    selectYourPreferredLanguage: 'Sélectionnez votre langue préférée:',
    helpAndSupportTitle: 'Aide et Support',
    helpAndSupportMessage: 'Pour le support, veuillez nous contacter à :\n\nEmail : support@mindease.app\n\nOu visitez notre centre d\'aide pour les FAQ et guides.',
    contactSupport: 'Contacter le Support',
    privacyPolicyTitle: 'Politique de Confidentialité',
    privacyPolicyMessage: 'Votre confidentialité est importante pour nous. Toutes vos données sont stockées localement sur votre appareil et ne sont jamais partagées sans votre consentement explicite.\n\nPoints clés :\n• Les données sont stockées localement par défaut\n• La sauvegarde cloud est optionnelle\n• Aucune donnée n\'est vendue à des tiers\n• Vous pouvez exporter ou supprimer vos données à tout moment',
    viewFullPolicy: 'Voir la Politique Complète',
    cloudBackupDisabledTitle: 'Sauvegarde Cloud Désactivée',
    cloudBackupDisabledSyncMessage: 'Veuillez d\'abord activer la sauvegarde cloud pour synchroniser vos données.',
    backingUpData: 'Sauvegarde des Données',
    backupComplete: 'Sauvegarde Terminée',
    backupFailed: 'Échec de la Sauvegarde',
    restoreDataTitle: 'Restaurer les Données',
    restoreDataMessage: 'Cela remplacera vos données locales actuelles par les données du cloud. Êtes-vous sûr de vouloir continuer ?',
    restoringData: 'Restauration des Données',
    restoreComplete: 'Restauration Terminée',
    restoreFailed: 'Échec de la Restauration',
    anonymousUser: 'Utilisateur Anonyme',
  },
  
  de: {
    // Settings Screen
    settings: 'Einstellungen',
    account: 'Konto',
    profile: 'Profil',
    notifications: 'Benachrichtigungen',
    dailyReminders: 'Tägliche Erinnerungen',
    dailyMoodCheckInReminders: 'Tägliche Stimmungscheck-Erinnerungen',
    affirmations: 'Affirmationen',
    dailyPositiveAffirmations: 'Tägliche positive Affirmationen',
    weeklyReports: 'Wöchentliche Berichte',
    weeklyProgressSummaries: 'Wöchentliche Fortschrittszusammenfassungen',
    privacyAndData: 'Datenschutz und Daten',
    cloudBackup: 'Cloud-Backup',
    syncDataAcrossDevices: 'Daten zwischen Geräten synchronisieren',
    backupNow: 'Jetzt Sichern',
    uploadDataToCloud: 'Daten in die Cloud hochladen',
    restoreData: 'Daten Wiederherstellen',
    downloadFromCloud: 'Von der Cloud herunterladen',
    appPreferences: 'App-Einstellungen',
    language: 'Sprache',
    dataManagement: 'Datenverwaltung',
    exportData: 'Daten Exportieren',
    downloadYourWellnessReport: 'Ihren Wellness-Bericht herunterladen',
    clearAllData: 'Alle Daten Löschen',
    deleteAllLocalData: 'Alle lokalen Daten löschen',
    support: 'Support',
    helpAndSupport: 'Hilfe und Support',
    getHelpAndContactSupport: 'Hilfe erhalten und Support kontaktieren',
    privacyPolicy: 'Datenschutzrichtlinie',
    readOurPrivacyPolicy: 'Unsere Datenschutzrichtlinie lesen',
    signOut: 'Abmelden',
    signOutOfYourAccount: 'Von Ihrem Konto abmelden',
    saveSettings: 'Einstellungen Speichern',
    mindEaseVersion: 'MindEase v1.0.0',
    yourMentalWellnessCompanion: 'Ihr Begleiter für mentales Wohlbefinden',
    
    // Language names
    english: 'Englisch',
    spanish: 'Spanisch',
    french: 'Französisch',
    german: 'Deutsch',
    portuguese: 'Portugiesisch',
    
    // Common terms
    success: 'Erfolg',
    error: 'Fehler',
    cancel: 'Abbrechen',
    ok: 'OK',
    loading: 'Lädt',
    save: 'Speichern',
    delete: 'Löschen',
    confirm: 'Bestätigen',
    back: 'Zurück',
    next: 'Weiter',
    continue: 'Fortfahren',
    
    // Alert messages
    settingsSavedSuccessfully: 'Einstellungen erfolgreich gespeichert!',
    failedToSaveSettings: 'Fehler beim Speichern der Einstellungen. Bitte versuchen Sie es erneut.',
    confirmSignOut: 'Abmelden',
    areYouSureYouWantToSignOut: 'Sind Sie sicher, dass Sie sich abmelden möchten?',
    clearAllDataTitle: 'Alle Daten Löschen',
    clearAllDataMessage: 'Dies wird alle Ihre lokalen Daten dauerhaft löschen, einschließlich Stimmungseinträgen, Übungsverlauf und Erfolgen. Diese Aktion kann nicht rückgängig gemacht werden.',
    allDataCleared: 'Alle Daten wurden gelöscht.',
    failedToClearData: 'Fehler beim Löschen der Daten. Bitte versuchen Sie es erneut.',
    cloudBackupEnabled: 'Cloud-Backup Aktiviert',
    cloudBackupEnabledMessage: 'Ihre Daten werden nun automatisch in die Cloud gesichert, wenn Sie eine Internetverbindung haben.',
    cloudBackupDisabled: 'Cloud-Backup Deaktiviert',
    cloudBackupDisabledMessage: 'Ihre Daten werden nur lokal auf diesem Gerät gespeichert.',
    cloudBackupError: 'Fehler beim Aktualisieren der Cloud-Backup-Einstellungen.',
    exportingData: 'Daten Exportieren',
    generatingYourWellnessReport: 'Ihr Wellness-Bericht wird generiert...',
    exportComplete: 'Export Abgeschlossen',
    exportCompleteMessage: 'Ihr Wellness-Bericht wurde mit {moodEntries} Stimmungseinträgen, {exercises} Übungen und {journalEntries} Tagebucheinträgen generiert.',
    saveToDevice: 'Auf Gerät Speichern',
    shareReport: 'Bericht Teilen',
    savedSuccessfully: 'Erfolgreich Gespeichert',
    saveFailed: 'Speichern Fehlgeschlagen',
    shareFailed: 'Teilen Fehlgeschlagen',
    exportFailed: 'Export Fehlgeschlagen',
    profileUpdatedSuccessfully: 'Profil erfolgreich aktualisiert!',
    failedToSaveProfile: 'Fehler beim lokalen Speichern der Profiländerungen.',
    permissionRequired: 'Berechtigung Erforderlich',
    permissionRequiredMessage: 'Bitte aktivieren Sie Benachrichtigungen in Ihren Geräteeinstellungen, um Erinnerungen zu erhalten.',
    themeUpdated: 'Design Aktualisiert',
    darkModeEnabled: 'Dunkler Modus aktiviert. Starten Sie die App neu, um die Änderungen zu sehen.',
    lightModeEnabled: 'Heller Modus aktiviert. Starten Sie die App neu, um die Änderungen zu sehen.',
    restartAppToSeeChanges: 'Starten Sie die App neu, um die Änderungen zu sehen.',
    languageSelection: 'Sprachauswahl',
    languageSelectionMessage: 'Die Sprachauswahl wird in einem zukünftigen Update verfügbar sein. Derzeit wird nur Englisch unterstützt.',
    selectYourPreferredLanguage: 'Wählen Sie Ihre bevorzugte Sprache:',
    helpAndSupportTitle: 'Hilfe und Support',
    helpAndSupportMessage: 'Für Support kontaktieren Sie uns bitte unter:\n\nE-Mail: support@mindease.app\n\nOder besuchen Sie unser Hilfezentrum für FAQs und Anleitungen.',
    contactSupport: 'Support Kontaktieren',
    privacyPolicyTitle: 'Datenschutzrichtlinie',
    privacyPolicyMessage: 'Ihr Datenschutz ist uns wichtig. Alle Ihre Daten werden lokal auf Ihrem Gerät gespeichert und niemals ohne Ihre ausdrückliche Zustimmung geteilt.\n\nWichtige Punkte:\n• Daten werden standardmäßig lokal gespeichert\n• Cloud-Backup ist optional\n• Keine Daten werden an Dritte verkauft\n• Sie können Ihre Daten jederzeit exportieren oder löschen',
    viewFullPolicy: 'Vollständige Richtlinie Anzeigen',
    cloudBackupDisabledTitle: 'Cloud-Backup Deaktiviert',
    cloudBackupDisabledSyncMessage: 'Bitte aktivieren Sie zuerst das Cloud-Backup, um Ihre Daten zu synchronisieren.',
    backingUpData: 'Daten Sichern',
    backupComplete: 'Backup Abgeschlossen',
    backupFailed: 'Backup Fehlgeschlagen',
    restoreDataTitle: 'Daten Wiederherstellen',
    restoreDataMessage: 'Dies wird Ihre aktuellen lokalen Daten durch die Daten aus der Cloud ersetzen. Sind Sie sicher, dass Sie fortfahren möchten?',
    restoringData: 'Daten Wiederherstellen',
    restoreComplete: 'Wiederherstellung Abgeschlossen',
    restoreFailed: 'Wiederherstellung Fehlgeschlagen',
    anonymousUser: 'Anonymer Benutzer',
  },
  
  pt: {
    // Settings Screen
    settings: 'Configurações',
    account: 'Conta',
    profile: 'Perfil',
    notifications: 'Notificações',
    dailyReminders: 'Lembretes Diários',
    dailyMoodCheckInReminders: 'Lembretes diários de registro de humor',
    affirmations: 'Afirmações',
    dailyPositiveAffirmations: 'Afirmações positivas diárias',
    weeklyReports: 'Relatórios Semanais',
    weeklyProgressSummaries: 'Resumos de progresso semanal',
    privacyAndData: 'Privacidade e Dados',
    cloudBackup: 'Backup na Nuvem',
    syncDataAcrossDevices: 'Sincronizar dados entre dispositivos',
    backupNow: 'Fazer Backup Agora',
    uploadDataToCloud: 'Carregar dados para a nuvem',
    restoreData: 'Restaurar Dados',
    downloadFromCloud: 'Baixar da nuvem',
    appPreferences: 'Preferências do App',
    language: 'Idioma',
    dataManagement: 'Gerenciamento de Dados',
    exportData: 'Exportar Dados',
    downloadYourWellnessReport: 'Baixar seu relatório de bem-estar',
    clearAllData: 'Limpar Todos os Dados',
    deleteAllLocalData: 'Excluir todos os dados locais',
    support: 'Suporte',
    helpAndSupport: 'Ajuda e Suporte',
    getHelpAndContactSupport: 'Obter ajuda e entrar em contato com o suporte',
    privacyPolicy: 'Política de Privacidade',
    readOurPrivacyPolicy: 'Ler nossa política de privacidade',
    signOut: 'Sair',
    signOutOfYourAccount: 'Sair da sua conta',
    saveSettings: 'Salvar Configurações',
    mindEaseVersion: 'MindEase v1.0.0',
    yourMentalWellnessCompanion: 'Seu companheiro de bem-estar mental',
    
    // Language names
    english: 'Inglês',
    spanish: 'Espanhol',
    french: 'Francês',
    german: 'Alemão',
    portuguese: 'Português',
    
    // Common terms
    success: 'Sucesso',
    error: 'Erro',
    cancel: 'Cancelar',
    ok: 'OK',
    loading: 'Carregando',
    save: 'Salvar',
    delete: 'Excluir',
    confirm: 'Confirmar',
    back: 'Voltar',
    next: 'Próximo',
    continue: 'Continuar',
    
    // Alert messages
    settingsSavedSuccessfully: 'Configurações salvas com sucesso!',
    failedToSaveSettings: 'Falha ao salvar configurações. Tente novamente.',
    confirmSignOut: 'Sair',
    areYouSureYouWantToSignOut: 'Tem certeza de que deseja sair?',
    clearAllDataTitle: 'Limpar Todos os Dados',
    clearAllDataMessage: 'Isso excluirá permanentemente todos os seus dados locais, incluindo entradas de humor, histórico de exercícios e conquistas. Esta ação não pode ser desfeita.',
    allDataCleared: 'Todos os dados foram limpos.',
    failedToClearData: 'Falha ao limpar dados. Tente novamente.',
    cloudBackupEnabled: 'Backup na Nuvem Habilitado',
    cloudBackupEnabledMessage: 'Seus dados agora serão automaticamente salvos na nuvem quando você tiver conexão com a internet.',
    cloudBackupDisabled: 'Backup na Nuvem Desabilitado',
    cloudBackupDisabledMessage: 'Seus dados serão armazenados apenas localmente neste dispositivo.',
    cloudBackupError: 'Falha ao atualizar configurações de backup na nuvem.',
    exportingData: 'Exportando Dados',
    generatingYourWellnessReport: 'Gerando seu relatório de bem-estar...',
    exportComplete: 'Exportação Completa',
    exportCompleteMessage: 'Seu relatório de bem-estar foi gerado com {moodEntries} entradas de humor, {exercises} exercícios e {journalEntries} entradas de diário.',
    saveToDevice: 'Salvar no Dispositivo',
    shareReport: 'Compartilhar Relatório',
    savedSuccessfully: 'Salvo com Sucesso',
    saveFailed: 'Falha ao Salvar',
    shareFailed: 'Falha ao Compartilhar',
    exportFailed: 'Falha na Exportação',
    profileUpdatedSuccessfully: 'Perfil atualizado com sucesso!',
    failedToSaveProfile: 'Falha ao salvar alterações do perfil localmente.',
    permissionRequired: 'Permissão Necessária',
    permissionRequiredMessage: 'Por favor, habilite notificações nas configurações do seu dispositivo para receber lembretes.',
    themeUpdated: 'Tema Atualizado',
    darkModeEnabled: 'Modo escuro habilitado. Reinicie o app para ver as alterações.',
    lightModeEnabled: 'Modo claro habilitado. Reinicie o app para ver as alterações.',
    restartAppToSeeChanges: 'Reinicie o app para ver as alterações.',
    languageSelection: 'Seleção de Idioma',
    languageSelectionMessage: 'A seleção de idioma estará disponível em uma atualização futura. Atualmente apenas inglês é suportado.',
    selectYourPreferredLanguage: 'Selecione seu idioma preferido:',
    helpAndSupportTitle: 'Ajuda e Suporte',
    helpAndSupportMessage: 'Para suporte, entre em contato conosco em:\n\nE-mail: support@mindease.app\n\nOu visite nosso centro de ajuda para FAQs e guias.',
    contactSupport: 'Entrar em Contato com Suporte',
    privacyPolicyTitle: 'Política de Privacidade',
    privacyPolicyMessage: 'Sua privacidade é importante para nós. Todos os seus dados são armazenados localmente no seu dispositivo e nunca são compartilhados sem seu consentimento explícito.\n\nPontos-chave:\n• Dados são armazenados localmente por padrão\n• Backup na nuvem é opcional\n• Nenhum dado é vendido para terceiros\n• Você pode exportar ou excluir seus dados a qualquer momento',
    viewFullPolicy: 'Ver Política Completa',
    cloudBackupDisabledTitle: 'Backup na Nuvem Desabilitado',
    cloudBackupDisabledSyncMessage: 'Por favor, habilite primeiro o backup na nuvem para sincronizar seus dados.',
    backingUpData: 'Fazendo Backup dos Dados',
    backupComplete: 'Backup Completo',
    backupFailed: 'Falha no Backup',
    restoreDataTitle: 'Restaurar Dados',
    restoreDataMessage: 'Isso substituirá seus dados locais atuais pelos dados da nuvem. Tem certeza de que deseja continuar?',
    restoringData: 'Restaurando Dados',
    restoreComplete: 'Restauração Completa',
    restoreFailed: 'Falha na Restauração',
    anonymousUser: 'Usuário Anônimo',
  },
};

export const getTranslation = (key: keyof TranslationKeys, language: string = 'en', params?: Record<string, string | number>): string => {
  const translation = translations[language]?.[key] || translations['en']?.[key] || key;
  
  if (params) {
    return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
      return str.replace(`{${paramKey}}`, String(paramValue));
    }, translation);
  }
  
  return translation;
};

export const getSupportedLanguages = () => [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
];
