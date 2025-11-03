import React, { useState } from 'react';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

const imagePromptText = `You are an expert real estate marketing content designer.
Create a promotional image for a real estate campaign, optimized for digital ads or social media posts.

🎯 Objective:

Generate a visually captivating ad image that highlights either:

A project/development (multiple units or towers), or

A specific property/unit (individual apartment, villa, townhouse).

🧠 Input Sources:

Factsheet → developer name, project name, handover date, payment plan, amenities, project location

Brochure → property types, floor plans, elevations

Image Input (if provided) → project render or unit photo (should be incorporated into the composition)

🧩 Visual Composition:

Use premium real estate aesthetic: elegant lighting, realistic architecture, professional layout.

Display:

Developer name & logo

Project name & location

Key selling points (3–4 bullets)

Property types available (1–4 BR apartments / villas)

Handover date

Payment plan summary (e.g., 70/30, post-handover options)

If off-plan: include Launch Date and “EOI Now Open” badge.

For unit-specific ads, replace general info with:

Floor plan snapshot

Unit size (sq.ft or sq.m)

Key features (balcony, sea view, open kitchen, etc.)

“View Floor Plan” or “Book a Viewing” button visual.

Always include a Call-to-Action button (CTA) with one of:

“Register Interest →”

“Visit Landing Page →”

“Book Viewing →”

Add brand color overlays and a soft gradient for text readability.

🏗️ Output Requirements:

Format: Landscape (16:9) for digital ads OR Square (1:1) for social media.

Professional, high-resolution composition.

Text hierarchy: large project name → medium tagline → smaller details → clear CTA button.

Optional QR code area linking to the project’s landing page.

💡 Example Concept:

“Luxury Waterfront Living – Marina Vista by Emaar
Handover Q4 2025 | 80/20 Payment Plan
Register Your EOI Now →”

Now generate the ad image composition, visually integrating all major details.
If an image input is provided, make it the central visual focus.`;

const videoPromptText = `You are a professional real estate video director creating a high-conversion marketing video for a real estate project or unit.
The video should merge brand visuals with property walkthroughs, emphasizing lifestyle, trust, and urgency.

🎯 Objective:

Produce a 30–60 second promotional video that visually communicates:

Developer reputation

Project features or unit details

Payment and handover info

Call-to-action with landing page link

🧠 Input Sources:

Factsheet: project name, developer, handover, payment plan, amenities, property types.

Brochure: floor plan, design, and unit-specific elevation.

Video Inputs:

Developer’s video content (renders, promotional visuals)

Property advisor’s walkthrough video (authentic on-site or model walkthrough)

Combine these inputs into a cohesive, professional sequence.

🎬 Video Structure & Scene Guide:

Scene 1 – Intro (3–5 sec)

Smooth cinematic intro with project logo and tagline

Background: hero shot of the tower/community

Overlay text:

Project name

Location

Developer logo

Scene 2 – Developer Highlights (5–8 sec)

Use developer’s branded footage.

Display project overview, architectural renders, or location aerials.

Overlay text:

“Luxury 1–4 BR Apartments” or “Waterfront Villas by [Developer]”

“Handover [Quarter/Year]”

Scene 3 – Amenities & Lifestyle (8–10 sec)

Footage: pool, gym, community view, kids area.

Overlay text: “Resort-Style Amenities” / “Smart Home Ready” / “Vibrant Community.”

Scene 4 – Property Walkthrough (10–15 sec)

Merge developer footage with advisor walkthrough video seamlessly.

Transition to advisor voiceover or captions describing unit highlights.

Overlay: “Spacious 2BR – 1,350 sq.ft | Sea View | Open Kitchen.”

Scene 5 – Floor Plan & Payment Info (5–8 sec)

Show floor plan snapshot or animated layout.

Overlay text:

“Starting from AED [price]”

“Payment Plan: 70/30 | Post-Handover Options.”

Scene 6 – Launch / EOI Section (if Off-Plan)

Text:

“Launches [Date]”

“EOI Now Open – Reserve Your Spot.”

Animation of the landing page preview or QR code.

Scene 7 – CTA Outro (5 sec)

Strong CTA overlay:

“Register Your Interest → [Landing Page URL]”

“Book a Viewing Today →”

Include agency logo + developer logo side by side.

Soft fade-out with tagline music.

⚙️ Output Requirements:

Duration: 30–60 seconds

Aspect ratio: 16:9 (YouTube/landing) or 9:16 (Instagram/TikTok ads)

Combine both developer visuals + advisor walkthrough fluidly

Maintain premium tone, real estate branding, and modern transitions

Add smooth background music, clean text overlays, and clear CTA ending.

💡 Example Summary Script:

“Introducing Marina Vista by Emaar — where luxury meets the waterfront.
Choose from 1–4 BR apartments with flexible 80/20 payment plans.
Handover Q4 2025.
Register your EOI now at [landing page link].”

Now generate the video concept, combining visuals, text overlays, and CTA flow according to the structure above.`;


interface PromptCardProps {
    title: string;
    promptText: string;
}

const PromptCard: React.FC<PromptCardProps> = ({ title, promptText }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(promptText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="bg-brand-secondary rounded-xl shadow-lg flex flex-col h-full">
            <div className="p-4 border-b border-brand-accent flex justify-between items-center">
                <h3 className="text-lg font-bold text-brand-gold">{title}</h3>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-sm bg-brand-primary text-brand-light font-semibold py-2 px-3 rounded-lg hover:bg-brand-accent hover:text-brand-text transition-colors"
                >
                    {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
                    {copied ? 'Copied!' : 'Copy Prompt'}
                </button>
            </div>
            <div className="p-6 overflow-y-auto">
                <pre className="text-brand-light text-sm whitespace-pre-wrap font-sans">
                    {promptText}
                </pre>
            </div>
        </div>
    );
};


const MasterPrompts: React.FC = () => {
    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <BookmarkIcon className="w-8 h-8 text-brand-gold" />
                <h2 className="text-2xl font-bold text-brand-text">AI Content Master Prompts</h2>
            </div>
            <p className="text-brand-light max-w-4xl">
                This is your central library for high-performance AI prompts. Use these templates as a starting point for generating consistent, on-brand creative content for your marketing campaigns.
            </p>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                <PromptCard title="🖼️ Image Content Generator" promptText={imagePromptText} />
                <PromptCard title="🎥 Video Content Generator (Veo)" promptText={videoPromptText} />
            </div>
        </div>
    );
};

export default MasterPrompts;