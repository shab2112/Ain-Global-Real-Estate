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
    id: string;
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
    YouTube = 'YouTube',
    Instagram = 'Instagram',
    Twitter = 'Twitter',
}

export interface GroundingChunk {
    web?: {
      uri: string;
      title: string;
    };
    maps?: {
        uri: string;
        title: string;
        placeAnswerSources?: {
            reviewSnippets: {
                uri: string;
                title: string;
            }[];
        };
    };
}

export interface MarketReportResult {
    report: string;
    sources: GroundingChunk[];
    tokenCount?: number;
    cost?: number;
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
    sources?: GroundingChunk[];
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

export enum PostStatus {
    Draft = 'Draft',
    PendingApproval = 'Pending Approval',
    Approved = 'Approved',
    Published = 'Published',
}

export enum PostType {
    Image = 'Image',
    Video = 'Video',
    Text = 'Text',
}

export interface ContentPost {
    id: string;
    projectId: string;
    platform: SocialPlatform;
    postType: PostType;
    status: PostStatus;
    scheduledDate: string; // ISO string
    createdBy: string; // User ID
    approvedBy?: string; // User ID
    postText: string;
    imageUrl?: string;
    videoUrl?: string;
}

export enum ContractStatus {
    Draft = 'Draft',
    Signed = 'Signed',
    Expired = 'Expired',
}

export enum ContractType {
    AgencyAgreement = 'Agency Agreement',
    AgentToAgent = 'Agent to Agent (Form I)',
    SellerToAgent = 'Seller to Agent (Form A)',
    BuyerToAgent = 'Buyer to Agent (Form B)',
}

export interface Contract {
    id: string;
    partyName: string;
    type: ContractType;
    status: ContractStatus;
    startDate: string; // ISO string
    expiryDate: string; // ISO string
    documentUrl: string;
    createdBy: string; // User ID
}