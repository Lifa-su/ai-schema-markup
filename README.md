# AI Schema Markup Generator

A free, AI-powered Schema Markup / Structured Data generator tool. Single-page application that helps you create valid JSON-LD structured data for 23+ schema types with AI smart fill, real-time Google Rich Results preview, and validation.

Built for the international SEO community. Updated for 2025-2026 Google structured data guidelines (excludes 7 deprecated schema types: Book Actions, Claim Review, Estimated Salary, Learning Video, Special Announcement, Vehicle Listing, Course Info).

## Features

- **23 Schema Types** — Article, Product, FAQ, HowTo, Recipe, Event, LocalBusiness, Organization, Person, Review, BreadcrumbList, VideoObject, SoftwareApplication, Course, Dataset, JobPosting, Movie, Restaurant, WebSite, ProfilePage, VacationRental, DiscussionForumPosting, ImageObject
- **Visual Form Builder** — Fill in fields with a clean, intuitive form UI
- **AI Smart Fill** — Enter a URL or description, and DeepSeek AI auto-recommends schema type and fills fields
- **Real-time Rich Results Preview** — See how your markup will appear in Google Search
- **JSON-LD Validation** — Instant validation with required/recommended field checks
- **Nested Schema Support** — Full support for nested types (Person, Organization, Offer, Place, etc.)
- **Batch Generation** — Generate multiple schema markups at once with AI
- **One-Click Copy** — Copy JSON-LD or full HTML `<script>` tag
- **Google Rich Results Test** — Direct link to test your markup in Google's tool
- **Download JSON-LD** — Export as .json file
- **Modern Responsive UI** — Dark theme, works on desktop, tablet, and mobile
- **No Backend Required** — Pure HTML + CSS + JS, runs entirely in the browser

## Quick Start

1. Open `index.html` in any modern browser
2. (Optional) Click ⚙️ Settings and enter your [DeepSeek API key](https://platform.deepseek.com) for AI features
3. Select a schema type from the sidebar
4. Fill in the form fields
5. JSON-LD is generated in real-time on the right panel
6. Copy, download, or test your markup

## AI Smart Fill

The AI Smart Fill feature uses the DeepSeek API to:
- Analyze a URL or content description
- Auto-recommend the best schema type
- Fill in all relevant fields automatically

You need a DeepSeek API key to use this feature. Get one at [platform.deepseek.com](https://platform.deepseek.com).

## Schema Types by Category

| Category | Types |
|----------|-------|
| Content | Article, FAQPage, HowTo, Recipe, VideoObject, ImageObject, DiscussionForumPosting |
| Commerce | Product, Event, JobPosting, VacationRental |
| Business | LocalBusiness, Organization, Restaurant, Person, ProfilePage |
| Technical | SoftwareApplication, Course, Dataset, WebSite, BreadcrumbList, Movie, Review |

## Tech Stack

- Pure HTML5 + CSS3 + Vanilla JavaScript
- No frameworks or build tools required
- DeepSeek API for AI features (optional)
- CSS Custom Properties for theming
- CSS Grid + Flexbox for responsive layout

## 2025-2026 Compliance

This tool follows the latest Google structured data guidelines:
- Excludes all 7 schema types deprecated by Google in 2025
- Uses JSON-LD format (Google's recommended format)
- Validates required and recommended properties per Google Search Central docs
- Supports all currently active rich result types

## License

MIT
