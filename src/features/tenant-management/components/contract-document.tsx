import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import type {
  ArtistContractDetail,
  ShopContractDetail,
} from '../types/artist-tenant-types';
import { CONTRACT_STATIC_TEXT } from '../constants/artist-tenant-constants';

interface ContractDocumentProps {
  contractDetail: ArtistContractDetail | ShopContractDetail | null;
  showDownload?: boolean;
}

const c = CONTRACT_STATIC_TEXT;

export const ContractDocument = ({
  contractDetail,
  showDownload = false,
}: ContractDocumentProps) => {
  const doc = contractDetail?.contractDocument;
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!contentRef.current) return;

    const element = contentRef.current;
    const originalStyle = element.style.cssText;

    element.style.height = 'auto';
    element.style.overflow = 'visible';
    element.style.padding = '40px';

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    element.style.cssText = originalStyle;

    const imgData = canvas.toDataURL('image/png');
    const imgWidthMm = 210;
    const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;

    const pdf = new jsPDF('p', 'mm', [imgWidthMm, imgHeightMm]);
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidthMm, imgHeightMm);
    pdf.save('입점계약서.pdf');
  };

  return (
    <div className="flex flex-col">
      {showDownload && (
        <button
          onClick={handleDownloadPdf}
          className="mb-4 self-end rounded bg-gray-800 px-3 py-1 text-sm text-white hover:bg-gray-700"
        >
          PDF로 내려받기
        </button>
      )}
      <div
        ref={contentRef}
        className="h-[53.1875rem] w-[33.75rem] overflow-y-auto pr-4 text-gray-700"
      >
        <h2 className="mb-[2.1875rem] text-center text-[32px] font-medium">
          {c.title}
        </h2>
        <p className="mb-6 text-sm">{c.intro}</p>

        <p className="mb-2 font-medium">{c.article1.title}</p>
        <p className="mb-1 font-medium">{c.article1.gap.label}</p>
        {c.article1.gap.fields.map((field) => (
          <div key={field} className="mb-2 flex items-center gap-2 text-sm">
            <span className="w-32 shrink-0">{field}</span>
            <span>
              {field === '상호명'
                ? (doc?.shopBusinessName ?? '__________')
                : field === '대표자'
                  ? (doc?.shopOwnerName ?? '__________')
                  : field === '사업자등록번호'
                    ? (doc?.shopBusinessNumber ?? '__________')
                    : field === '주소'
                      ? (doc?.shopAddress ?? '__________')
                      : field === '연락처'
                        ? (doc?.shopContact ?? '__________')
                        : '__________'}
            </span>
          </div>
        ))}

        <p className="mb-1 mt-3 font-medium">{c.article1.eul.label}</p>
        {c.article1.eul.fields.map((field) => (
          <div key={field} className="mb-2 flex items-center gap-2 text-sm">
            <span className="w-32 shrink-0">{field}</span>
            <span>
              {field === '성명(작가명)'
                ? (doc?.artistName ?? '__________')
                : field === '사업자등록번호(해당 시)'
                  ? (doc?.artistBusinessNumber ?? '__________')
                  : field === '주소'
                    ? (doc?.artistAddress ?? '__________')
                    : field === '연락처'
                      ? (doc?.artistContact ?? '__________')
                      : '__________'}
            </span>
          </div>
        ))}

        <p className="mb-2 mt-6 font-medium">{c.article2.title}</p>
        <p className="mb-6 text-sm">{c.article2.content}</p>

        <p className="mb-2 font-medium">{c.article3.title}</p>
        <div className="mb-2 flex items-center gap-2 text-sm">
          <span className="shrink-0">계약 시작일</span>
          <span>{doc?.contractStartDate ?? '__________'}</span>
        </div>
        <div className="mb-2 flex items-center gap-2 text-sm">
          <span className="shrink-0">계약 종료일</span>
          <span>{doc?.contractEndDate ?? '__________'}</span>
        </div>
        <p className="mb-6 text-sm">{c.article3.suffix}</p>

        <p className="mb-2 font-medium">{c.article5.title}</p>
        <div className="mb-2 flex items-center gap-2 text-sm">
          <span>{c.article5.content1}</span>
          <span>{doc ? `${doc.commissionRate}%` : '__________'}</span>
          <span>{c.article5.content1Suffix}</span>
        </div>
        <p className="mb-2 text-sm">{c.article5.content2}</p>
        {c.article5.settlementFields.map((field) => (
          <div key={field} className="mb-2 flex items-center gap-2 text-sm">
            <span className="w-32 shrink-0">{field}</span>
            <span>
              {field === c.article5.settlementFields[0]
                ? (doc?.settlementDay ?? '__________')
                : (doc?.paymentDay ?? '__________')}
            </span>
          </div>
        ))}
        {c.article5.bankFields.map((field) => (
          <div key={field} className="mb-2 flex items-center gap-2 text-sm">
            <span className="w-32 shrink-0">{field}</span>
            <span>
              {field === '은행명'
                ? (doc?.artistBankName ?? '__________')
                : field === '예금주'
                  ? (doc?.artistAccountHolder ?? '__________')
                  : field === '계좌번호'
                    ? (doc?.artistAccountNumber ?? '__________')
                    : '__________'}
            </span>
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
            <span>{doc?.contractDate ?? '__________'}</span>
          </div>

          <p className="mb-1 mt-4 font-medium">
            {c.footer.signatureFields.gap.label}
          </p>
          {c.footer.signatureFields.gap.fields.map((field) => (
            <div key={field} className="mb-2 flex items-center gap-2 text-sm">
              <span className="w-20 shrink-0">{field}</span>
              <span>
                {field === '상호명'
                  ? (doc?.shopSignatureBusinessName ?? '__________')
                  : (doc?.shopSignatureOwnerName ?? '__________')}
              </span>
            </div>
          ))}

          <p className="mb-1 mt-4 font-medium">
            {c.footer.signatureFields.eul.label}
          </p>
          <div className="mb-2 flex items-center gap-2 text-sm">
            <span className="w-20 shrink-0">
              {c.footer.signatureFields.eul.fields[0]}
            </span>
            <span>{doc?.artistSignatureName ?? '__________'}</span>
            <span>(서명)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
