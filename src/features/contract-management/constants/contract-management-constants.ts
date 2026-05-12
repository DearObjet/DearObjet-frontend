export const CONTRACT_MANAGEMENT_ENDPOINTS = {
  SEARCH_ARTISTS: '/api/v1/contracts/artists/search',
  SEND_CONTRACT: (artistId: number) =>
    `/api/v1/contracts/artists/${artistId}/send`,
  ARTIST_SUBMISSION: (contractId: number) =>
    `/api/v1/contracts/shops/${contractId}/artist-submission`,
  IN_PROGRESS: '/api/v1/contracts/documents/in-progress',
  COMPLETED: '/api/v1/contracts/documents/completed',
  TEMPLATE: '/api/v1/contracts/template',
} as const;
