import { PostType } from '../types';

const imagePromptText = `You are an expert real estate marketing content designer for Lockwood & Carter.
Create a promotional image for a real estate campaign, optimized for digital ads or social media posts.

🎯 Objective:
Generate a visually captivating ad image that highlights either a project/development or a specific property/unit.

🧠 Input Sources:
- Factsheet: developer name, project name, handover date, payment plan, amenities, location.
- Brochure: property types, floor plans.
- Image Input: project render or unit photo (should be incorporated into the composition).

🧩 Visual Composition:
- Use a premium real estate aesthetic: elegant lighting, realistic architecture, professional layout.
- Display: Developer name, project name, 3-4 key selling points, property types, handover date, payment plan summary.
- If off-plan, include "EOI Now Open" badge.
- Always include a Call-to-Action (CTA) button: "Register Interest →", "Visit Landing Page →", or "Book Viewing →".
- Add brand color overlays and a soft gradient for text readability.

🏗️ Output Requirements:
- Format: Square (1:1) for social media.
- Professional, high-resolution composition.
- Clear text hierarchy and a prominent CTA.

💡 Example Concept:
“Luxury Waterfront Living – Marina Vista by Emaar. Handover Q4 2025 | 80/20 Payment Plan. Register Your EOI Now →”

Now generate the ad image composition, visually integrating all major details. If an image input is provided, make it the central visual focus.`;

const videoPromptText = `You are a professional real estate video director for Lockwood & Carter creating a high-conversion marketing video.
The video should merge brand visuals with property walkthroughs, emphasizing lifestyle, trust, and urgency.

🎯 Objective:
Produce a 30–60 second promotional video that visually communicates developer reputation, project features, payment info, and a strong call-to-action.

🧠 Input Sources:
- Factsheet: project name, developer, handover, payment plan, amenities.
- Brochure: floor plan, design.
- Video Inputs: Developer’s promotional visuals and a property advisor’s walkthrough video.

🎬 Video Structure & Scene Guide:
1.  **Intro (3–5s):** Cinematic intro with project logo, name, location, and developer logo.
2.  **Developer Highlights (5–8s):** Use developer's branded footage. Overlay text with property types and handover date.
3.  **Amenities & Lifestyle (8–10s):** Footage of pool, gym, community. Overlay text with key amenities.
4.  **Property Walkthrough (10–15s):** Seamlessly merge developer footage with advisor walkthrough video. Overlay unit details (e.g., "Spacious 2BR – 1,350 sq.ft | Sea View").
5.  **Floor Plan & Payment (5–8s):** Show floor plan snapshot. Overlay starting price and payment plan.
6.  **CTA Outro (5s):** Strong CTA overlay: "Register Your Interest → [Landing Page URL]" or "Book a Viewing Today →". Include Lockwood & Carter agency logo.

⚙️ Output Requirements:
- Duration: 30–60 seconds.
- Aspect ratio: 9:16 (for social media).
- Combine visuals fluidly, maintain a premium tone, and use modern transitions.
- Add background music, clean text overlays, and a clear CTA.

💡 Example Summary Script:
“Introducing Marina Vista by Emaar — where luxury meets the waterfront. Choose from 1–4 BR apartments with flexible 80/20 payment plans. Handover Q4 2025. Register your EOI now at [landing page link].”

Now generate the video, combining visuals, text overlays, and CTA flow according to the structure above.`;

export const masterPrompts = {
    [PostType.Image]: imagePromptText,
    [PostType.Video]: videoPromptText,
    [PostType.Text]: 'Generate a concise text-only post.' // Placeholder
};
