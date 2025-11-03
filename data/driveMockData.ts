import { DriveProject, ContentPost, PostStatus, SocialPlatform, PostType } from '../types';

const getFutureDate = (weeks: number, dayOfWeek: number) => { // 0=Sun, 1=Mon...
    const date = new Date();
    date.setDate(date.getDate() + (weeks * 7));
    const currentDay = date.getDay();
    const distance = dayOfWeek - currentDay;
    date.setDate(date.getDate() + distance);
    date.setHours(10, 0, 0, 0); // Set to 10 AM
    return date.toISOString();
}

export const driveData: DriveProject[] = [
  {
    id: 'proj-001',
    name: 'Masaar',
    developer: 'Arada',
    assets: [
      { id: 'asset-1a', name: 'Masaar Forest Community.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop' },
      { id: 'asset-1b', name: 'Masaar Modern Villa Exterior.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop' },
      { id: 'asset-1c', name: 'Masaar Interior Living Room.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2070&auto=format&fit=crop' },
      { id: 'asset-1d', name: 'Masaar Project Brochure.pdf', type: 'brochure', url: '#' },
      {
        id: 'asset-1e',
        name: 'Masaar Factsheet.txt',
        type: 'factsheet',
        url: '#',
        content: `
          Project: Masaar
          Developer: Arada
          Location: Al Suyoh, Sharjah
          Property Types: 2-5 Bedroom Townhouses and Villas
          Key Features: 50,000 trees, forest community, green spine, jogging tracks, family-friendly, smart home technology.
          Target Audience: Families, nature lovers, investors looking for high ROI in Sharjah's growing market.
          Starting Price: AED 1.2M
          Status: Off-plan, various phases under construction.
        `,
      },
    ],
  },
  {
    id: 'proj-002',
    name: 'Dubai Hills Estate',
    developer: 'Emaar Properties',
    assets: [
      { id: 'asset-2a', name: 'Dubai Hills Golf Course View.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1593955872339-16a125974033?q=80&w=2070&auto=format&fit=crop' },
      { id: 'asset-2b', name: 'Dubai Hills Mansion Exterior.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1542324218-b2a549a174d8?q=80&w=2070&auto=format&fit=crop' },
      { id: 'asset-2c', name: 'Dubai Hills Mall.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1593693397649-7ca203228a49?q=80&w=2070&auto=format&fit=crop' },
      { id: 'asset-2d', name: 'DHE Project Brochure.pdf', type: 'brochure', url: '#' },
      {
        id: 'asset-2e',
        name: 'DHE Factsheet.txt',
        type: 'factsheet',
        url: '#',
        content: `
          Project: Dubai Hills Estate
          Developer: Emaar Properties
          Location: Along Al Khail Road, Dubai
          Property Types: Apartments, Townhouses, Villas, Mansions
          Key Features: 18-hole championship golf course, Dubai Hills Mall, central park, premium healthcare and education facilities.
          Target Audience: High-net-worth individuals, families, golf enthusiasts, luxury market investors.
          Starting Price: AED 900K (Apartments), AED 2.5M (Villas)
          Status: Mixed-use development, multiple phases completed and off-plan.
        `,
      },
    ],
  },
  {
    id: 'proj-003',
    name: 'DAMAC Lagoons',
    developer: 'DAMAC Properties',
    assets: [
        { id: 'asset-3a', name: 'Lagoon Crystal Waters.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1526786221463-74a322488af7?q=80&w=2070&auto=format&fit=crop' },
        { id: 'asset-3b', name: 'Santorini Style Villas.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1534293992196-9f21f64b6389?q=80&w=2070&auto=format&fit=crop' },
        { id: 'asset-3c', name: 'Community Clubhouse Night.jpg', type: 'image', url: 'https://images.unsplash.com/photo-1518224523916-29a32c43145d?q=80&w=1964&auto=format&fit=crop' },
        { id: 'asset-3d', name: 'Lagoons Brochure.pdf', type: 'brochure', url: '#' },
        {
          id: 'asset-3e',
          name: 'Lagoons Factsheet.txt',
          type: 'factsheet',
          url: '#',
          content: `
            Project: DAMAC Lagoons
            Developer: DAMAC Properties
            Location: Near DAMAC Hills, Dubai
            Property Types: 3-7 Bedroom Townhouses and Villas
            Key Features: Mediterranean-themed clusters (Santorini, Costa Brava, Venice), swimmable lagoons, water-based activities, premium lifestyle amenities.
            Target Audience: Families, young professionals, investors seeking unique community living.
            Starting Price: AED 1.5M
            Status: Off-plan, under construction.
          `,
        },
      ],
  }
];

export const mockScheduledPosts: ContentPost[] = [
    {
        id: 'post-1',
        projectId: 'proj-001',
        platform: SocialPlatform.Facebook,
        postType: PostType.Image,
        status: PostStatus.Approved,
        scheduledDate: getFutureDate(0, 3), // This Wednesday
        createdBy: 'user-3',
        approvedBy: 'user-2',
        postText: 'Discover the tranquility of Masaar by Arada, a lush forest community in the heart of Sharjah. 🌳 Live among 50,000 trees and enjoy a lifestyle connected to nature. Your dream family home awaits! #Masaar #Arada #SharjahRealEstate #FamilyHome',
        imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop'
    },
    {
        id: 'post-2',
        projectId: 'proj-002',
        platform: SocialPlatform.LinkedIn,
        postType: PostType.Image,
        status: PostStatus.PendingApproval,
        scheduledDate: getFutureDate(0, 5), // This Friday
        createdBy: 'user-4',
        postText: 'Investment insight: Dubai Hills Estate by Emaar continues to show strong capital appreciation. With its premium amenities, including a championship golf course and the new Dubai Hills Mall, it represents a prime opportunity for investors targeting the luxury segment. Contact us for a detailed market analysis.',
        imageUrl: 'https://images.unsplash.com/photo-1593955872339-16a125974033?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 'post-3',
        projectId: 'proj-003',
        platform: SocialPlatform.Facebook,
        postType: PostType.Image,
        status: PostStatus.Draft,
        scheduledDate: getFutureDate(1, 1), // Next Monday
        createdBy: 'user-5',
        postText: '',
        imageUrl: ''
    }
];