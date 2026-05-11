import type { ArtistContractDetail } from '../types/artist-tenant-types';

import { CONTRACT_STATIC_TEXT } from '../constants/artist-tenant-constants';

interface ContractDocumentProps {
  contractDetail: ArtistContractDetail | null;
}

const c = CONTRACT_STATIC_TEXT;

export const ContractDocument = ({ contractDetail }: ContractDocumentProps) => {
  return (
    <div className="h-[53.1875rem] w-[33.75rem] overflow-y-auto pr-4 text-gray-700">
      {/* <p className="mb-6 text-center font-medium">{c.title}</p> */}
      <h2 className="mb-[2.1875rem] text-center text-[32px] font-medium">
        {c.title}
      </h2>
      <p className="mb-6 text-sm">{c.intro}</p>

      <p className="mb-2 font-medium">{c.article1.title}</p>
      <p className="mb-1 font-medium">{c.article1.gap.label}</p>
      {c.article1.gap.fields.map((field) => (
        <div key={field} className="mb-2 flex items-center gap-2 text-sm">
          <span className="w-32 shrink-0">{field}</span>
          {field === '상호명' ? (
            <span>{contractDetail?.shopName ?? '__________'}</span>
          ) : (
            <span className="text-gray-400">__________</span>
          )}
        </div>
      ))}

      <p className="mb-1 mt-3 font-medium">{c.article1.eul.label}</p>
      <div className="mb-2 flex items-center gap-2 text-sm">
        <span className="w-32 shrink-0">{c.article1.eul.fields[0]}</span>
        <span>{contractDetail?.artistName ?? '__________'}</span>
      </div>
      {c.article1.eul.fields.slice(1).map((field) => (
        <div key={field} className="mb-2 flex items-center gap-2 text-sm">
          <span className="w-32 shrink-0">{field}</span>
          <span className="text-gray-400">__________</span>
        </div>
      ))}

      <p className="mb-2 mt-6 font-medium">{c.article2.title}</p>
      <p className="mb-6 text-sm">{c.article2.content}</p>

      <p className="mb-2 font-medium">{c.article3.title}</p>
      <div className="mb-2 flex items-center gap-2 text-sm">
        <span className="shrink-0">계약 시작일</span>
        <span>{contractDetail?.contractStartDate ?? '__________'}</span>
      </div>
      <div className="mb-2 flex items-center gap-2 text-sm">
        <span className="shrink-0">계약 종료일</span>
        <span>{contractDetail?.contractEndDate ?? '__________'}</span>
      </div>
      <p className="mb-6 text-sm">{c.article3.suffix}</p>

      <p className="mb-2 font-medium">{c.article5.title}</p>
      <div className="mb-2 flex items-center gap-2 text-sm">
        <span>{c.article5.content1}</span>
        <span>
          {contractDetail
            ? `${contractDetail.commissionValue}${contractDetail.commissionType === 'RATE' ? '%' : '원'}`
            : '__________'}
        </span>
        <span>{c.article5.content1Suffix}</span>
      </div>
      <p className="mb-2 text-sm">{c.article5.content2}</p>
      {c.article5.settlementFields.map((field) => (
        <div key={field} className="mb-2 flex items-center gap-2 text-sm">
          <span className="w-32 shrink-0">{field}</span>
          <span className="text-gray-400">__________</span>
        </div>
      ))}
      {c.article5.bankFields.map((field) => (
        <div key={field} className="mb-2 flex items-center gap-2 text-sm">
          <span className="w-32 shrink-0">{field}</span>
          <span className="text-gray-400">__________</span>
        </div>
      ))}

      <p className="mb-2 mt-6 font-medium">{c.article6.title}</p>
      {c.article6.items.map((item, i) => (
        <p key={i} className="mb-1 text-sm">
          {i + 1}. {item}
        </p>
      ))}

      <p className="mb-2 mt-6 font-medium">{c.article7.title}</p>
      {c.article7.items.map((item, i) => (
        <p key={i} className="mb-1 text-sm">
          {i + 1}. {item}
        </p>
      ))}

      <p className="mb-2 mt-6 font-medium">{c.article8.title}</p>
      <p className="mb-6 text-sm">{c.article8.content}</p>

      <p className="mb-2 font-medium">{c.article9.title}</p>
      <p className="mb-1 text-sm">{c.article9.intro}</p>
      {c.article9.items.map((item, i) => (
        <p key={i} className="mb-1 text-sm">
          {i + 1}. {item}
        </p>
      ))}
      <p className="mb-6 text-sm">{c.article9.suffix}</p>

      <p className="mb-2 font-medium">{c.article10.title}</p>
      {c.article10.items.map((item, i) => (
        <p key={i} className="mb-1 text-sm">
          {i + 1}. {item}
        </p>
      ))}

      <div className="mt-8">
        <div className="mb-2 flex items-center gap-2 text-sm">
          <span className="shrink-0">계약일</span>
          <span className="text-gray-400">__________</span>
        </div>

        <p className="mb-1 mt-4 font-medium">
          {c.footer.signatureFields.gap.label}
        </p>
        {c.footer.signatureFields.gap.fields.map((field) => (
          <div key={field} className="mb-2 flex items-center gap-2 text-sm">
            <span className="w-20 shrink-0">{field}</span>
            {field === '상호명' ? (
              <span>{contractDetail?.shopName ?? '__________'}</span>
            ) : (
              <span className="text-gray-400">__________</span>
            )}
          </div>
        ))}

        <p className="mb-1 mt-4 font-medium">
          {c.footer.signatureFields.eul.label}
        </p>
        <div className="mb-2 flex items-center gap-2 text-sm">
          <span className="w-20 shrink-0">
            {c.footer.signatureFields.eul.fields[0]}
          </span>
          <span>{contractDetail?.artistName ?? '__________'}</span>
          <span>(서명)</span>
        </div>
      </div>
    </div>
  );
};
