
// ============================================================
// AI Schema Markup Generator - JavaScript
// ============================================================

// ---- Schema Type Definitions ----
const SCHEMA_TYPES = {
  Article: {
    icon: '📰', category: 'Content',
    description: 'News articles, blog posts, and editorial content',
    fields: [
      {name:'headline',label:'Headline',type:'text',required:true,help:'Article title (max 110 chars)'},
      {name:'image',label:'Image URL',type:'url',required:true,help:'Representative image URL'},
      {name:'datePublished',label:'Date Published',type:'datetime-local',required:true},
      {name:'dateModified',label:'Date Modified',type:'datetime-local',recommended:true},
      {name:'author',label:'Author',type:'nested',schema:'Person',required:true},
      {name:'publisher',label:'Publisher',type:'nested',schema:'Organization',required:true},
      {name:'description',label:'Description',type:'textarea',recommended:true},
      {name:'articleBody',label:'Article Body',type:'textarea'},
      {name:'wordCount',label:'Word Count',type:'number'},
      {name:'keywords',label:'Keywords',type:'text',help:'Comma-separated keywords'}
    ]
  },
  Product: {
    icon: '🛍️', category: 'Commerce',
    description: 'Products with pricing, availability, and reviews',
    fields: [
      {name:'name',label:'Product Name',type:'text',required:true},
      {name:'image',label:'Image URL',type:'url',required:true},
      {name:'description',label:'Description',type:'textarea',required:true},
      {name:'sku',label:'SKU',type:'text',recommended:true},
      {name:'brand',label:'Brand',type:'text',recommended:true},
      {name:'offers',label:'Offer',type:'nested',schema:'Offer',required:true},
      {name:'aggregateRating',label:'Rating',type:'nested',schema:'AggregateRating',recommended:true},
      {name:'review',label:'Review',type:'nested',schema:'Review'},
      {name:'gtin',label:'GTIN/UPC',type:'text'},
      {name:'mpn',label:'MPN',type:'text'},
      {name:'color',label:'Color',type:'text'},
      {name:'material',label:'Material',type:'text'}
    ]
  },
  FAQPage: {
    icon: '❓', category: 'Content',
    description: 'Frequently Asked Questions page',
    fields: [
      {name:'mainEntity',label:'FAQ Items',type:'faq-list',required:true,help:'Add question and answer pairs'}
    ]
  },
  HowTo: {
    icon: '📋', category: 'Content',
    description: 'Step-by-step instructions for completing a task',
    fields: [
      {name:'name',label:'Title',type:'text',required:true},
      {name:'description',label:'Description',type:'textarea',recommended:true},
      {name:'image',label:'Image URL',type:'url',recommended:true},
      {name:'totalTime',label:'Total Time (ISO 8601)',type:'text',help:'e.g. PT30M for 30 minutes'},
      {name:'estimatedCost',label:'Estimated Cost',type:'text'},
      {name:'supply',label:'Supplies Needed',type:'array',help:'Materials needed'},
      {name:'tool',label:'Tools Needed',type:'array',help:'Tools required'},
      {name:'step',label:'Steps',type:'howto-steps',required:true,help:'Add step-by-step instructions'}
    ]
  },
  Recipe: {
    icon: '🍳', category: 'Content',
    description: 'Cooking and baking recipes with ingredients and instructions',
    fields: [
      {name:'name',label:'Recipe Name',type:'text',required:true},
      {name:'image',label:'Image URL',type:'url',required:true},
      {name:'description',label:'Description',type:'textarea',recommended:true},
      {name:'author',label:'Author',type:'nested',schema:'Person',recommended:true},
      {name:'prepTime',label:'Prep Time (ISO 8601)',type:'text',help:'e.g. PT20M'},
      {name:'cookTime',label:'Cook Time (ISO 8601)',type:'text',help:'e.g. PT1H'},
      {name:'totalTime',label:'Total Time (ISO 8601)',type:'text'},
      {name:'recipeYield',label:'Yield/Servings',type:'text',recommended:true},
      {name:'recipeCategory',label:'Category',type:'text',help:'e.g. Dessert, Main course'},
      {name:'recipeCuisine',label:'Cuisine',type:'text',help:'e.g. Italian, Mexican'},
      {name:'nutrition',label:'Calories',type:'text',help:'e.g. 250 calories'},
      {name:'recipeIngredient',label:'Ingredients',type:'array',required:true},
      {name:'recipeInstructions',label:'Instructions',type:'howto-steps',required:true},
      {name:'aggregateRating',label:'Rating',type:'nested',schema:'AggregateRating'},
      {name:'video',label:'Video',type:'nested',schema:'VideoObject'}
    ]
  },
  Event: {
    icon: '📅', category: 'Commerce',
    description: 'Events with dates, locations, and ticket info',
    fields: [
      {name:'name',label:'Event Name',type:'text',required:true},
      {name:'startDate',label:'Start Date',type:'datetime-local',required:true},
      {name:'endDate',label:'End Date',type:'datetime-local',recommended:true},
      {name:'location',label:'Location',type:'nested',schema:'Place',required:true},
      {name:'image',label:'Image URL',type:'url',recommended:true},
      {name:'description',label:'Description',type:'textarea',recommended:true},
      {name:'offers',label:'Ticket/Offer',type:'nested',schema:'Offer'},
      {name:'performer',label:'Performer',type:'nested',schema:'Person'},
      {name:'organizer',label:'Organizer',type:'nested',schema:'Organization'},
      {name:'eventStatus',label:'Event Status',type:'select',options:['EventScheduled','EventCancelled','EventMovedOnline','EventPostponed','EventRescheduled']},
      {name:'eventAttendanceMode',label:'Attendance Mode',type:'select',options:['OfflineEventAttendanceMode','OnlineEventAttendanceMode','MixedEventAttendanceMode']}
    ]
  },
  LocalBusiness: {
    icon: '🏪', category: 'Business',
    description: 'Local businesses with address, hours, and contact info',
    fields: [
      {name:'name',label:'Business Name',type:'text',required:true},
      {name:'image',label:'Image URL',type:'url',required:true},
      {name:'address',label:'Address',type:'nested',schema:'PostalAddress',required:true},
      {name:'telephone',label:'Phone',type:'tel',recommended:true},
      {name:'url',label:'Website URL',type:'url'},
      {name:'email',label:'Email',type:'email'},
      {name:'priceRange',label:'Price Range',type:'text',help:'e.g. 88571 or -50'},
      {name:'openingHoursSpecification',label:'Opening Hours',type:'text',help:'e.g. Mo-Fr 09:00-17:00'},
      {name:'geo',label:'Coordinates',type:'nested',schema:'GeoCoordinates'},
      {name:'aggregateRating',label:'Rating',type:'nested',schema:'AggregateRating'},
      {name:'servesCuisine',label:'Cuisine (if restaurant)',type:'text'}
    ]
  },
  Organization: {
    icon: '🏢', category: 'Business',
    description: 'Organizations, companies, and institutions',
    fields: [
      {name:'name',label:'Organization Name',type:'text',required:true},
      {name:'url',label:'Website URL',type:'url',required:true},
      {name:'logo',label:'Logo URL',type:'url',required:true},
      {name:'description',label:'Description',type:'textarea'},
      {name:'email',label:'Email',type:'email'},
      {name:'telephone',label:'Phone',type:'tel'},
      {name:'address',label:'Address',type:'nested',schema:'PostalAddress'},
      {name:'sameAs',label:'Social Profiles',type:'array',help:'URLs of social media profiles'},
      {name:'foundingDate',label:'Founding Date',type:'date'},
      {name:'numberOfEmployees',label:'Number of Employees',type:'number'}
    ]
  },
  Person: {
    icon: '👤', category: 'Business',
    description: 'Individual people - authors, creators, professionals',
    fields: [
      {name:'name',label:'Full Name',type:'text',required:true},
      {name:'url',label:'Profile URL',type:'url'},
      {name:'image',label:'Photo URL',type:'url'},
      {name:'jobTitle',label:'Job Title',type:'text'},
      {name:'worksFor',label:'Works For',type:'nested',schema:'Organization'},
      {name:'email',label:'Email',type:'email'},
      {name:'telephone',label:'Phone',type:'tel'},
      {name:'sameAs',label:'Social Profiles',type:'array'},
      {name:'description',label:'Bio',type:'textarea'},
      {name:'alumniOf',label:'Education',type:'text'}
    ]
  },
  Review: {
    icon: '⭐', category: 'Content',
    description: 'Reviews and ratings for products, services, or businesses',
    fields: [
      {name:'itemReviewed',label:'Item Reviewed',type:'nested',schema:'Thing',required:true},
      {name:'reviewRating',label:'Rating',type:'nested',schema:'Rating',required:true},
      {name:'author',label:'Author',type:'nested',schema:'Person',required:true},
      {name:'reviewBody',label:'Review Text',type:'textarea',recommended:true},
      {name:'datePublished',label:'Date Published',type:'date',recommended:true},
      {name:'publisher',label:'Publisher',type:'nested',schema:'Organization'}
    ]
  },
  BreadcrumbList: {
    icon: '🔗', category: 'Navigation',
    description: 'Breadcrumb navigation trail',
    fields: [
      {name:'itemListElement',label:'Breadcrumb Items',type:'breadcrumb-list',required:true,help:'Add breadcrumb items in order'}
    ]
  },
  VideoObject: {
    icon: '🎬', category: 'Media',
    description: 'Video content with metadata for video rich results',
    fields: [
      {name:'name',label:'Video Title',type:'text',required:true},
      {name:'description',label:'Description',type:'textarea',required:true},
      {name:'thumbnailUrl',label:'Thumbnail URL',type:'url',required:true},
      {name:'uploadDate',label:'Upload Date',type:'datetime-local',required:true},
      {name:'duration',label:'Duration (ISO 8601)',type:'text',help:'e.g. PT1H30M for 1h30m'},
      {name:'contentUrl',label:'Video File URL',type:'url'},
      {name:'embedUrl',label:'Embed URL',type:'url'},
      {name:'publisher',label:'Publisher',type:'nested',schema:'Organization'},
      {name:'interactionStatistic',label:'View Count',type:'number'}
    ]
  },
  SoftwareApplication: {
    icon: '📱', category: 'Commerce',
    description: 'Software apps with ratings and pricing',
    fields: [
      {name:'name',label:'App Name',type:'text',required:true},
      {name:'operatingSystem',label:'Operating System',type:'text',required:true,help:'e.g. Windows, macOS, Android'},
      {name:'applicationCategory',label:'Category',type:'select',options:['GameApplication','SocialNetworkingApplication','TravelApplication','ShoppingApplication','SportsApplication','LifestyleApplication','BusinessApplication','DesignApplication','DeveloperApplication','DriverApplication','EducationalApplication','HealthApplication','FinanceApplication','SecurityApplication','BrowserApplication','CommunicationApplication','DesktopEnhancementApplication','EntertainmentApplication','MultimediaApplication','HomeApplication','UtilitiesApplication','ReferenceApplication']},
      {name:'offers',label:'Pricing',type:'nested',schema:'Offer',required:true},
      {name:'aggregateRating',label:'Rating',type:'nested',schema:'AggregateRating',recommended:true},
      {name:'description',label:'Description',type:'textarea'},
      {name:'screenshot',label:'Screenshot URL',type:'url'},
      {name:'featureList',label:'Features',type:'textarea'}
    ]
  },
  Course: {
    icon: '🎓', category: 'Content',
    description: 'Educational courses and training programs',
    fields: [
      {name:'name',label:'Course Name',type:'text',required:true},
      {name:'description',label:'Description',type:'textarea',required:true},
      {name:'provider',label:'Provider',type:'nested',schema:'Organization',required:true},
      {name:'url',label:'Course URL',type:'url'},
      {name:'image',label:'Image URL',type:'url'},
      {name:'inLanguage',label:'Language',type:'text',help:'e.g. en, es, zh'},
      {name:'coursePrerequisites',label:'Prerequisites',type:'textarea'},
      {name:'educationalLevel',label:'Level',type:'select',options:['Beginner','Intermediate','Advanced']}
    ]
  },
  Dataset: {
    icon: '📊', category: 'Content',
    description: 'Datasets for Google Dataset Search',
    fields: [
      {name:'name',label:'Dataset Name',type:'text',required:true},
      {name:'description',label:'Description',type:'textarea',required:true},
      {name:'url',label:'Dataset URL',type:'url'},
      {name:'license',label:'License URL',type:'url',recommended:true},
      {name:'creator',label:'Creator',type:'nested',schema:'Organization'},
      {name:'datePublished',label:'Date Published',type:'date'},
      {name:'dateModified',label:'Date Modified',type:'date'},
      {name:'distribution',label:'Download URL',type:'url'},
      {name:'keywords',label:'Keywords',type:'text',help:'Comma-separated'},
      {name:'temporalCoverage',label:'Time Period',type:'text',help:'e.g. 2020-01-01/2025-12-31'}
    ]
  },
  Movie: {
    icon: '🎥', category: 'Media',
    description: 'Movies with cast, ratings, and details',
    fields: [
      {name:'name',label:'Movie Title',type:'text',required:true},
      {name:'image',label:'Poster URL',type:'url',required:true},
      {name:'description',label:'Description',type:'textarea'},
      {name:'director',label:'Director',type:'nested',schema:'Person'},
      {name:'dateCreated',label:'Release Date',type:'date'},
      {name:'duration',label:'Duration (ISO 8601)',type:'text',help:'e.g. PT2H30M'},
      {name:'genre',label:'Genre',type:'text'},
      {name:'aggregateRating',label:'Rating',type:'nested',schema:'AggregateRating'},
      {name:'actor',label:'Actors',type:'array',help:'Actor names'}
    ]
  },
  JobPosting: {
    icon: '💼', category: 'Commerce',
    description: 'Job listings with salary, location, and requirements',
    fields: [
      {name:'title',label:'Job Title',type:'text',required:true},
      {name:'description',label:'Job Description',type:'textarea',required:true},
      {name:'datePosted',label:'Date Posted',type:'date',required:true},
      {name:'validThrough',label:'Valid Through',type:'datetime-local',recommended:true},
      {name:'hiringOrganization',label:'Company',type:'nested',schema:'Organization',required:true},
      {name:'jobLocation',label:'Location',type:'nested',schema:'Place',required:true},
      {name:'baseSalary',label:'Salary',type:'nested',schema:'MonetaryAmount'},
      {name:'employmentType',label:'Employment Type',type:'select',options:['FULL_TIME','PART_TIME','CONTRACTOR','TEMPORARY','INTERN','VOLUNTEER','PER_DIEM','OTHER']},
      {name:'workHours',label:'Work Hours',type:'text'},
      {name:'jobLocationType',label:'Remote?',type:'select',options:['','TELECOMMUTE']},
      {name:'skills',label:'Required Skills',type:'textarea'}
    ]
  },
  WebSite: {
    icon: '🌐', category: 'Navigation',
    description: 'Website with sitelinks search box',
    fields: [
      {name:'name',label:'Website Name',type:'text',required:true},
      {name:'url',label:'Website URL',type:'url',required:true},
      {name:'potentialAction',label:'Search URL Template',type:'text',required:true,help:'e.g. https://example.com/search?q={search_term_string}'},
      {name:'description',label:'Description',type:'textarea'}
    ]
  },
  ProfilePage: {
    icon: '👨‍💻', category: 'Navigation',
    description: 'Profile pages for creators and individuals',
    fields: [
      {name:'mainEntity',label:'Person',type:'nested',schema:'Person',required:true},
      {name:'dateCreated',label:'Profile Created',type:'date'},
      {name:'dateModified',label:'Profile Modified',type:'date'}
    ]
  },
  VacationRental: {
    icon: '🏖️', category: 'Commerce',
    description: 'Vacation rental properties',
    fields: [
      {name:'name',label:'Property Name',type:'text',required:true},
      {name:'description',label:'Description',type:'textarea',required:true},
      {name:'image',label:'Image URL',type:'url',required:true},
      {name:'address',label:'Address',type:'nested',schema:'PostalAddress',required:true},
      {name:'numberOfRooms',label:'Number of Rooms',type:'number'},
      {name:'occupancy',label:'Max Occupancy',type:'number'},
      {name:'floorSize',label:'Floor Size (sqft)',type:'number'},
      {name:'amenityFeature',label:'Amenities',type:'array',help:'e.g. WiFi, Pool, Parking'},
      {name:'offers',label:'Pricing',type:'nested',schema:'Offer'}
    ]
  },
  DiscussionForumPosting: {
    icon: '💬', category: 'Content',
    description: 'Forum posts and discussion threads',
    fields: [
      {name:'headline',label:'Post Title',type:'text',required:true},
      {name:'text',label:'Post Content',type:'textarea',required:true},
      {name:'author',label:'Author',type:'nested',schema:'Person',required:true},
      {name:'datePublished',label:'Date Published',type:'datetime-local',required:true},
      {name:'url',label:'Post URL',type:'url'},
      {name:'interactionStatistic',label:'Comment Count',type:'number'}
    ]
  },
  ImageObject: {
    icon: '🖼️', category: 'Media',
    description: 'Images with metadata for image search',
    fields: [
      {name:'contentUrl',label:'Image URL',type:'url',required:true},
      {name:'name',label:'Image Title',type:'text',recommended:true},
      {name:'description',label:'Description',type:'textarea'},
      {name:'author',label:'Creator',type:'nested',schema:'Person'},
      {name:'datePublished',label:'Date Published',type:'date'},
      {name:'license',label:'License URL',type:'url'},
      {name:'acquireLicensePage',label:'License Page URL',type:'url'},
      {name:'creditText',label:'Credit Text',type:'text'},
      {name:'copyrightNotice',label:'Copyright Notice',type:'text'}
    ]
  },
  Restaurant: {
    icon: '🍽️', category: 'Business',
    description: 'Restaurants with menu, cuisine, and reservation info',
    fields: [
      {name:'name',label:'Restaurant Name',type:'text',required:true},
      {name:'image',label:'Image URL',type:'url',required:true},
      {name:'address',label:'Address',type:'nested',schema:'PostalAddress',required:true},
      {name:'telephone',label:'Phone',type:'tel',recommended:true},
      {name:'url',label:'Website URL',type:'url'},
      {name:'servesCuisine',label:'Cuisine Type',type:'text',required:true},
      {name:'priceRange',label:'Price Range',type:'text',help:'e.g. 88571'},
      {name:'menu',label:'Menu URL',type:'url'},
      {name:'acceptsReservations',label:'Accepts Reservations',type:'select',options:['True','False']},
      {name:'openingHoursSpecification',label:'Opening Hours',type:'text',help:'e.g. Mo-Fr 11:00-22:00'},
      {name:'aggregateRating',label:'Rating',type:'nested',schema:'AggregateRating'},
      {name:'geo',label:'Coordinates',type:'nested',schema:'GeoCoordinates'}
    ]
  }
};

// Nested schema field definitions
const NESTED_SCHEMAS = {
  Person: [
    {name:'name',label:'Name',type:'text',required:true},
    {name:'url',label:'URL',type:'url'}
  ],
  Organization: [
    {name:'name',label:'Name',type:'text',required:true},
    {name:'url',label:'URL',type:'url'},
    {name:'logo',label:'Logo URL',type:'url'}
  ],
  Offer: [
    {name:'price',label:'Price',type:'number',required:true},
    {name:'priceCurrency',label:'Currency',type:'text',required:true,help:'e.g. USD, EUR, GBP'},
    {name:'availability',label:'Availability',type:'select',options:['InStock','OutOfStock','PreOrder','SoldOut','BackOrder','OnlineOnly','LimitedAvailability']},
    {name:'url',label:'Offer URL',type:'url'},
    {name:'validFrom',label:'Valid From',type:'date'},
    {name:'priceValidUntil',label:'Price Valid Until',type:'date'}
  ],
  AggregateRating: [
    {name:'ratingValue',label:'Rating Value',type:'number',required:true},
    {name:'bestRating',label:'Best Rating',type:'number',help:'Default: 5'},
    {name:'ratingCount',label:'Rating Count',type:'number',required:true}
  ],
  Rating: [
    {name:'ratingValue',label:'Rating Value',type:'number',required:true},
    {name:'bestRating',label:'Best Rating',type:'number',help:'Default: 5'},
    {name:'worstRating',label:'Worst Rating',type:'number',help:'Default: 1'}
  ],
  PostalAddress: [
    {name:'streetAddress',label:'Street Address',type:'text',required:true},
    {name:'addressLocality',label:'City',type:'text',required:true},
    {name:'addressRegion',label:'State/Region',type:'text'},
    {name:'postalCode',label:'Postal Code',type:'text'},
    {name:'addressCountry',label:'Country',type:'text',required:true}
  ],
  Place: [
    {name:'name',label:'Place Name',type:'text',required:true},
    {name:'address',label:'Address',type:'nested',schema:'PostalAddress',required:true}
  ],
  GeoCoordinates: [
    {name:'latitude',label:'Latitude',type:'number',required:true},
    {name:'longitude',label:'Longitude',type:'number',required:true}
  ],
  Thing: [
    {name:'@type',label:'Type',type:'text',required:true,help:'e.g. Product, Restaurant, Movie'},
    {name:'name',label:'Name',type:'text',required:true}
  ],
  MonetaryAmount: [
    {name:'currency',label:'Currency',type:'text',required:true,help:'e.g. USD'},
    {name:'value',label:'Amount',type:'number',required:true},
    {name:'unitText',label:'Per',type:'select',options:['HOUR','DAY','WEEK','MONTH','YEAR']}
  ],
  Review: [
    {name:'author',label:'Reviewer Name',type:'text',required:true},
    {name:'reviewRating',label:'Rating (1-5)',type:'number',required:true},
    {name:'reviewBody',label:'Review Text',type:'textarea'}
  ],
  VideoObject: [
    {name:'name',label:'Video Title',type:'text',required:true},
    {name:'description',label:'Description',type:'textarea'},
    {name:'thumbnailUrl',label:'Thumbnail URL',type:'url'},
    {name:'contentUrl',label:'Video URL',type:'url'},
    {name:'uploadDate',label:'Upload Date',type:'date'}
  ]
};
