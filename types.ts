
export enum UserRole {
  Owner = 'Owner',
  Admin = 'Admin',
  PropertyAdvisor = 'Property Advisor',
  Client = 'Client',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyAdvisorId: string;
  cardDriveId?: string;
}

export interface DriveAsset {
  id:string;
  name: string;
  type: 'image' | 'video' | 'brochure' | 'factsheet';
  url: string;
  content?: string;
}

export interface DriveProject {
  id: string;
  name: string;
  developer: string;
  assets: DriveAsset[];
}

export enum SocialPlatform {
  Facebook = 'Facebook',
  LinkedIn = 'LinkedIn',
  Instagram = 'Instagram',
  YouTube = 'YouTube',
  Twitter = 'Twitter',
}

export enum PostType {
  Image = 'Image',
  Video = 'Video',
  Text = 'Text',
}

export enum PostStatus {
  Draft = 'Draft',
  PendingApproval = 'Pending Approval',
  Approved = 'Approved',
  Published = 'Published',
}

export interface ContentPost {
  id: string;
  projectId: string;
  platform: SocialPlatform;
  postType: PostType;
  status: PostStatus;
  scheduledDate: string; // ISO string
  createdBy: string; // userId
  approvedBy?: string; // userId
  postText: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface MarketReportResult {
  report: string;
  sources: any[];
  tokenCount: number;
  cost: number;
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

export enum ChatMode {
    Staff = 'staff',
    Client = 'client',
}

export enum ContractType {
  AgencyAgreement = 'Agency Agreement',
  SellerToAgent = 'Seller-to-Agent Agreement',
  BuyerToAgent = 'Buyer-to-Agent Agreement',
  AgentToAgent = 'Agent-to-Agent Referral',
}

export enum ContractStatus {
  Draft = 'Draft',
  Signed = 'Signed',
  Expired = 'Expired',
}

export interface Contract {
  id: string;
  type: ContractType;
  partyName: string;
  startDate: string; // ISO string
  expiryDate: string; // ISO string
  status: ContractStatus;
  documentUrl: string;
  createdBy: string; // userId
}

export interface Listing {
    id: string;
    clientId: string;
    title: string;
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    imageUrl: string;
    status: 'For Sale' | 'For Rent' | 'Sold';
}

export enum PropertyType {
    Apartment = "Apartment",
    Villa = "Villa",
    Townhouse = "Townhouse",
    Penthouse = "Penthouse",
}
  

export enum ClientView {
    Valuation = 'Valuate My Home',
    Listings = 'My Listings',
    AI = 'Ask AI Assistant',
    Mortgage = 'Mortgage Calculator',
    Vault = 'My Vault',
}
  
export interface VaultDocument {
    id: string;
    clientId: string;
    name: string;
    type: 'Passport' | 'KYC' | 'SPA' | 'Title Deed' | 'Other';
    uploadDate: string; // ISO string
    url: string;
}