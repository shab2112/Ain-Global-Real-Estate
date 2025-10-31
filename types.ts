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