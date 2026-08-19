/**
 * Fleet Intelligence Smart AI - Document Management & Expiry Intelligence Module Index
 * PROMPT 48 - Export all components, services, and types
 */

export * from './types/documentTypes';
export * from './services/documentService';
export * from './services/documentExpiryEngine';
export * from './services/documentComplianceEngine';
export * from './services/documentOcrAiService';
export * from './services/storageProvider';

export { DocumentManagementMainView } from './components/DocumentManagementMainView';
export { DocumentOverviewTab } from './components/DocumentOverviewTab';
export { DocumentListTable } from './components/DocumentListTable';
export { ExpiryCalendarView } from './components/ExpiryCalendarView';
export { VerificationQueueTab } from './components/VerificationQueueTab';
export { RequirementTemplatesTab } from './components/RequirementTemplatesTab';
export { DocumentUploadModal } from './components/DocumentUploadModal';
export { BulkUploadModal } from './components/BulkUploadModal';
export { DocumentPreviewModal } from './components/DocumentPreviewModal';
export { DocumentAiDrawer } from './components/DocumentAiDrawer';
