export const ARTIST_TENANT_ENDPOINTS = {
  ARTIST_CONTRACTS: '/api/v1/contracts/artists',
  ARTIST_CONTRACT_DETAIL: (contractId: number) =>
    `/api/v1/contracts/artists/${contractId}`,
  ARTIST_SUGGESTIONS: '/api/v1/contracts/artists/suggestions',
  RELEASE_REQUEST: (contractId: number) =>
    `/api/v1/contracts/shops/${contractId}/release-request`,
  RELEASE_CANCELLATION: (contractId: number) =>
    `/api/v1/contracts/shops/${contractId}/release-cancellation`,
  APPROVAL: (contractId: number) =>
    `/api/v1/contracts/artists/${contractId}/approval`,
};

export const CONTRACT_STATIC_TEXT = {
  title: '입점계약서',
  intro:
    '본 계약은 아래 당사자 간 상호 신뢰를 바탕으로 소품의 위탁 판매 및 정산에 관한 사항을 정함을 목적으로 한다.',

  article1: {
    title: '제1조 (계약 당사자)',
    gap: {
      label: '갑 (소품샵)',
      fields: ['상호명', '대표자', '사업자등록번호', '주소', '연락처'],
    },
    eul: {
      label: '을 (작가)',
      fields: ['성명(작가명)', '사업자등록번호(해당 시)', '주소', '연락처'],
    },
  },

  article2: {
    title: '제2조 (계약 목적)',
    content:
      '본 계약은 을이 제작한 상품(이하 "상품")을 갑의 매장에서 위탁 판매함에 있어 필요한 제반 사항을 규정함을 목적으로 한다.',
  },

  article3: {
    title: '제3조 (계약 기간)',
    suffix:
      '계약 종료일 30일 전까지 갑 또는 을 어느 일방의 서면 또는 구두 해지 의사가 없는 경우, 본 계약은 동일 조건으로 1년 단위 자동 연장된다.',
  },

  article5: {
    title: '제4조 (판매 수수료 및 정산)',
    content1: '상품 판매 시 판매금액 기준 갑은 판매금액의',
    content1Suffix: '를 판매 수수료로 공제한다.',
    content2: '을의 정산금액 = 총 판매금액 - 판매 수수료',
    settlementFields: ['정산 기준일 (매월)', '지급일 (익월)'],
    bankFields: ['은행명', '예금주', '계좌번호'],
  },

  article6: {
    title: '제5조 (상품 관리)',
    items: [
      '갑은 위탁 상품을 성실히 관리한다.',
      '상품의 고의 또는 중대한 과실로 인한 훼손 및 분실 시 갑은 이를 배상한다.',
      '일반적인 진열 과정에서 발생하는 경미한 손상은 상호 협의한다.',
    ],
  },

  article7: {
    title: '제6조 (재고 및 회수)',
    items: [
      '계약 종료 시 을은 미판매 상품을 회수할 수 있다.',
      '재고 확인은 상호 협의 후 진행한다.',
    ],
  },

  article8: {
    title: '제7조 (가격 변경)',
    content: '상품 판매가격 변경 시 을과 갑의 협의를 통해 결정한다.',
  },

  article9: {
    title: '제8조 (계약 해지)',
    intro: '다음 각 호에 해당하는 경우 계약을 해지할 수 있다.',
    items: [
      '일방이 계약 내용을 중대하게 위반한 경우',
      '상호 신뢰관계가 현저히 훼손된 경우',
      '사업 종료 또는 운영 중단 시',
    ],
    suffix: '해지 시 정산 및 상품 회수는 14일 이내 완료한다.',
  },

  article10: {
    title: '제9조 (기타)',
    items: [
      '본 계약서에 명시되지 않은 사항은 상호 협의하여 결정하며, 관련 법령 및 일반 상관례에 따른다.',
      '본 계약의 체결을 증명하기 위해 계약서 2부를 작성하고 갑과 을이 각각 1부씩 보관한다.',
    ],
  },

  footer: {
    signatureFields: {
      gap: { label: '갑 (소품샵)', fields: ['상호명', '대표자'] },
      eul: { label: '을 (작가)', fields: ['작가명'] },
    },
  },
} as const;
