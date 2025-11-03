
// FIX: Removed self-import of `SocialPlatform` which was causing a conflict with the local declaration.
export enum SocialPlatform {
  Facebook = 'Facebook',
  LinkedIn = 'LinkedIn',
  YouTube = 'YouTube',
}

export enum View {
  Dashboard = 'Dashboard',
  ContentStudio = 'Content Studio',
  Campaigns = 'Campaigns',
  MarketIntelligence = 'Market Intelligence',
  Clients = 'Clients',
}

export enum UserRole {
  Owner = 'Owner',
  Admin = 'Admin',
  PropertyAdvisor = 'Property Advisor',
  Client = 'Client',
}

export enum ChatMode {
  Staff = 'Staff',
  Client = 'Client',
}

export enum PostStatus {
    Draft = 'Draft',
    PendingApproval = 'Pending Approval',
    Approved = 'Approved',
    Published = 'Published',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string; // URL or initials
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyAdvisorId: string;
  cardDriveId?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  sources?: any[];
  action?: 'request_location';
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
}

// Types for simulated Google Drive data
export interface DriveAsset {
    id: string;
    name: string;
    type: 'image' | 'video' | 'brochure' | 'factsheet' | 'walkthrough';
    url: string; // For images/videos, this would be a direct link or base64 string
    content?: string; // For factsheets
}
  
export interface DriveProject {
    id: string;
    name: string;
    assets: DriveAsset[];
}

// Type for a scheduled content post
export interface ContentPost {
    id: string;
    projectId: string;
    platform: SocialPlatform;
    status: PostStatus;
    scheduledDate: string; // ISO string
    createdBy: string; // User ID
    approvedBy?: string; // User ID
    postText: string;
    imageUrl?: string;
}