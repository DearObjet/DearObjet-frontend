export const ROUTES = {
  // ─── Public ───────────────────────────────────────────
  // home
  HOME: '/',

  // notices
  NOTICES: '/notices',
  NOTICE_DETAIL: '/notices/:noticeId',

  // map
  MAP: '/map',
  MAP_DETAIL: '/map/:shopId',

  // posts
  POSTS: '/posts',

  // artists
  ARTISTS: '/artists',

  // payment
  PAYMENT: '/payment',

  // signup
  SIGNUP: '/signup',

  // ─── Auth ─────────────────────────────────────────────
  OAUTH_CALLBACK: '/oauth/callback',

  // ─── Customer (/my) ───────────────────────────────────
  MY: '/my',

  // ─── Shop (/shop) ─────────────────────────────────────
  // shop_dashboard
  SHOP_DASHBOARD: '/shop/dashboard',

  // manage
  SHOP_MANAGE: '/shop/manage',
  SHOP_MANAGE_RESERVATIONS: '/shop/manage/reservations',

  // artists
  SHOP_ARTISTS: '/shop/artists',

  // shop_inventory
  SHOP_INVENTORY: '/shop/inventory',

  // shop_contracts
  SHOP_CONTRACTS: '/shop/contracts',

  // shop_settlements
  SHOP_SETTLEMENTS: '/shop/settlements',

  // shop_messages
  SHOP_MESSAGES: '/shop/messages',

  // shop_profile
  SHOP_PROFILE: '/shop/profile',

  // shop_notices
  SHOP_NOTICES: '/shop/notices',
  SHOP_NOTICE_DETAIL: '/shop/notices/:noticeId',

  // shop_settings
  SHOP_SETTINGS: '/shop/settings',

  // ─── Artist (/artist) ─────────────────────────────────
  // artist_dashboard
  ARTIST_DASHBOARD: '/artist/dashboard',

  // artist_inventory
  ARTIST_INVENTORY: '/artist/inventory',

  // shop
  ARTIST_SHOPS: '/artist/shops',

  // artist_shipments
  ARTIST_SHIPMENTS: '/artist/shipments',

  // artist_settlements
  ARTIST_SETTLEMENTS: '/artist/settlements',
  ARTIST_SETTLEMENTS_HISTORY: '/artist/settlements/history',

  // artist_messages
  ARTIST_MESSAGES: '/artist/messages',

  // artist_profile
  ARTIST_PROFILE: '/artist/profile',

  // artist_notices
  ARTIST_NOTICES: '/artist/notices',
  ARTIST_NOTICE_DETAIL: '/artist/notices/:noticeId',

  // artist_settings
  ARTIST_SETTINGS: '/artist/settings',

  // ─── Admin ────────────────────────────────────────────
  ADMIN: '/admin',

  // ─── Footer ───────────────────────────────────────────
  ABOUT: '/about',
  CAREERS: '/careers',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  PARTNERSHIP: '/partnership',
  FEEDBACK: '/feedback',
  PARTNER_PRIVACY: '/partner-privacy',
} as const;
