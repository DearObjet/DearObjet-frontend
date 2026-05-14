import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '../../../app/store';
import { useAppSelector } from '../../../app/hooks';

import { useGetBusinessProfileQuery } from '../../my-page/api/my-page-api';
import {
  useSendContractMutation,
  useArtistSubmissionMutation,
  useGetInProgressContractsQuery,
  useGetContractDetailQuery,
} from '../api/contract-management-api';
import type { ArtistSearchItem } from '../types/contract-management-types';
import { Button, Input } from '../../../shared/components/ui';
import { UserSelectModal } from '../../../shared/components/common/user-select-modal';

import { CONTRACT_STATIC_TEXT } from '../../tenant-management/constants/artist-tenant-constants';

const c = CONTRACT_STATIC_TEXT;

type TemplateMode = 'new' | 'existing' | null;

const GAP_FIELD_MAP: Record<string, string> = {
  상호명: 'businessName',
  대표자: 'ownerName',
  사업자등록번호: 'businessNumber',
  주소: 'businessAddress',
  연락처: 'phoneNumber',
};

const EUL_FIELD_MAP: Record<string, string> = {
  '성명(작가명)': 'userName',
  '사업자등록번호(해당 시)': 'businessNumber',
  주소: 'businessAddress',
  연락처: 'businessPhoneNumber',
};

const GAP_FOOTER_FIELD_MAP: Record<string, string> = {
  상호명: 'businessName',
  대표자: 'ownerName',
};

const formatDateInput = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;

  let month = digits.slice(4, 6);
  if (month.length === 2) {
    const m = Number(month);
    if (m < 1) month = '01';
    else if (m > 12) month = '12';
  }

  if (digits.length <= 6) return `${digits.slice(0, 4)}-${month}`;

  let day = digits.slice(6, 8);
  if (day.length === 2) {
    const d = Number(day);
    if (d < 1) day = '01';
    else if (d > 31) day = '31';
  }

  return `${digits.slice(0, 4)}-${month}-${day}`;
};

const today = new Date().toISOString().split('T')[0];

const validateDate = (value: string) => {
  if (value.length < 10) return value;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return today;
  }
  if (value < today) return today;
  return value;
};

const formatNumberInput = (value: string) => value.replace(/\D/g, '');

export const ContractManagement = () => {
  const [mode, setMode] = useState<TemplateMode>(null);
  const [hasInput, setHasInput] = useState(false);
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<ArtistSearchItem | null>(
    null
  );
  const [selectedContractId, setSelectedContractId] = useState<number | null>(
    null
  );

  const [gapValues, setGapValues] = useState<Record<string, string>>({});
  const [eulValues, setEulValues] = useState<Record<string, string>>({});
  const [gapFooterValues, setGapFooterValues] = useState<
    Record<string, string>
  >({});
  const [eulFooterValue, setEulFooterValue] = useState('');
  const [contractStartDate, setContractStartDate] = useState('');
  const [contractEndDate, setContractEndDate] = useState('');
  const [contractDate, setContractDate] = useState('');
  const [commissionValue, setCommissionValue] = useState('');
  const [settlementValues, setSettlementValues] = useState<
    Record<string, string>
  >({});
  const [bankValues, setBankValues] = useState<Record<string, string>>({});

  const role = useSelector((state: RootState) => state.auth.user?.role);
  const userId = useAppSelector((state) => state.auth.user?.userId);
  const isShop = role === 'SHOP';

  const { data: businessProfile } = useGetBusinessProfileQuery();
  const { data: inProgressData } = useGetInProgressContractsQuery(userId!, {
    skip: !userId,
  });
  const { data: contractDetail } = useGetContractDetailQuery(
    { contractId: selectedContractId!, userId: userId!, isShop },
    { skip: !selectedContractId || !userId }
  );
  const [sendContract] = useSendContractMutation();
  const [artistSubmission] = useArtistSubmissionMutation();

  const buildProfileValues = useCallback(() => {
    if (!businessProfile) return;
    if (isShop) {
      const newGapValues: Record<string, string> = {};
      c.article1.gap.fields.forEach((field) => {
        const key = GAP_FIELD_MAP[field];
        if (key)
          newGapValues[field] =
            (businessProfile[key as keyof typeof businessProfile] as string) ??
            '';
      });
      setGapValues(newGapValues);

      const newFooterValues: Record<string, string> = {};
      c.footer.signatureFields.gap.fields.forEach((field) => {
        const key = GAP_FOOTER_FIELD_MAP[field];
        if (key)
          newFooterValues[field] =
            (businessProfile[key as keyof typeof businessProfile] as string) ??
            '';
      });
      setGapFooterValues(newFooterValues);
    } else {
      const newEulValues: Record<string, string> = {};
      c.article1.eul.fields.forEach((field) => {
        const key = EUL_FIELD_MAP[field];
        if (key)
          newEulValues[field] =
            (businessProfile[key as keyof typeof businessProfile] as string) ??
            '';
      });
      setEulValues(newEulValues);
      setEulFooterValue(businessProfile.userName ?? '');
    }
    setHasInput(true);
  }, [businessProfile, isShop]);

  useEffect(() => {
    buildProfileValues();
  }, [buildProfileValues]);

  useEffect(() => {
    if (!contractDetail || mode !== 'existing') return;
    const doc = contractDetail.contractDocument;

    setGapValues({
      상호명: doc.shopBusinessName ?? '',
      대표자: doc.shopOwnerName ?? '',
      사업자등록번호: doc.shopBusinessNumber ?? '',
      주소: doc.shopAddress ?? '',
      연락처: doc.shopContact ?? '',
    });
    setGapFooterValues({
      상호명: doc.shopSignatureBusinessName ?? '',
      대표자: doc.shopSignatureOwnerName ?? '',
    });
    setContractStartDate(doc.contractStartDate ?? '');
    setContractEndDate(doc.contractEndDate ?? '');
    setContractDate(doc.contractDate ?? '');
    setCommissionValue(String(doc.commissionRate ?? ''));
    setSettlementValues({
      [c.article5.settlementFields[0]]: String(doc.settlementDay ?? ''),
      [c.article5.settlementFields[1]]: String(doc.paymentDay ?? ''),
    });

    if (!isShop) {
      setEulValues({
        '성명(작가명)': doc.artistName || businessProfile?.userName || '',
        '사업자등록번호(해당 시)':
          doc.artistBusinessNumber || businessProfile?.businessNumber || '',
        주소: doc.artistAddress || businessProfile?.businessAddress || '',
        연락처: doc.artistContact || businessProfile?.businessPhoneNumber || '',
      });
      setBankValues({
        은행명: doc.artistBankName || businessProfile?.bankName || '',
        예금주: doc.artistAccountHolder || businessProfile?.accountHolder || '',
        계좌번호:
          doc.artistAccountNumber || businessProfile?.bankAccountNumber || '',
      });
      setEulFooterValue(
        doc.artistSignatureName || businessProfile?.userName || ''
      );
    }
    setHasInput(true);
  }, [contractDetail, mode, isShop, businessProfile]);

  const handleCancel = () => {
    setMode(null);
    setHasInput(false);
    setSelectedArtist(null);
    setSelectedContractId(null);
    setContractStartDate('');
    setContractEndDate('');
    setContractDate('');
    setCommissionValue('');
    setSettlementValues({});
    setBankValues({});
    buildProfileValues();
  };

  const handleNewContract = () => {
    handleCancel();
    setMode('new');
  };

  const handleSelectInProgress = (contractId: number) => {
    setMode('existing');
    setHasInput(false);
    setSelectedContractId(contractId);
    setSelectedArtist(null);
  };

  const handleSend = async (artist: ArtistSearchItem) => {
    if (!userId) return;
    await sendContract({
      artistId: artist.artistId,
      userId,
      body: {
        shopBusinessName: gapValues['상호명'] ?? '',
        shopOwnerName: gapValues['대표자'] ?? '',
        shopBusinessNumber: gapValues['사업자등록번호'] ?? '',
        shopAddress: gapValues['주소'] ?? '',
        shopContact: gapValues['연락처'] ?? '',
        contractStartDate,
        contractEndDate,
        commissionRate: Number(commissionValue),
        settlementDay: Number(
          settlementValues[c.article5.settlementFields[0]] ?? 0
        ),
        paymentDay: Number(
          settlementValues[c.article5.settlementFields[1]] ?? 0
        ),
        contractDate,
        shopSignatureBusinessName: gapFooterValues['상호명'] ?? '',
        shopSignatureOwnerName: gapFooterValues['대표자'] ?? '',
      },
    }).unwrap();
  };

  const handleArtistSend = async () => {
    if (!userId || !selectedContractId) return;
    await artistSubmission({
      contractId: selectedContractId,
      userId,
      body: {
        artistName: eulValues['성명(작가명)'] ?? '',
        artistBusinessNumber: eulValues['사업자등록번호(해당 시)'] ?? '',
        artistAddress: eulValues['주소'] ?? '',
        artistContact: eulValues['연락처'] ?? '',
        artistBankName: bankValues['은행명'] ?? '',
        artistAccountHolder: bankValues['예금주'] ?? '',
        artistAccountNumber: bankValues['계좌번호'] ?? '',
        artistSignatureName: eulFooterValue,
      },
    }).unwrap();
    handleCancel();
  };

  return (
    <div className="flex h-full gap-4">
      {showArtistModal && (
        <UserSelectModal
          onClose={() => setShowArtistModal(false)}
          onSelectArtist={(artist) => {
            setSelectedArtist(artist);
            setShowArtistModal(false);
            handleSend(artist);
          }}
        />
      )}

      <section className="flex h-[63.25rem] w-[59.875rem] flex-col rounded-xl bg-white">
        {mode !== null ? (
          <div className="relative min-h-0 flex-1 overflow-y-auto p-10 text-gray-700">
            <div className="absolute right-6 top-4 flex gap-2">
              {!hasInput ? (
                <>
                  <Button
                    variant="secondaryDark"
                    size="small"
                    label="취소"
                    onClick={handleCancel}
                  />
                  <Button variant="secondaryDark" size="small" label="저장" />
                </>
              ) : (
                <>
                  <Button variant="secondaryDark" size="small" label="저장" />
                  <Button
                    variant="primary"
                    size="small"
                    label="보내기"
                    onClick={() =>
                      isShop ? setShowArtistModal(true) : handleArtistSend()
                    }
                  />
                </>
              )}
            </div>

            {isShop && mode === 'new' && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  수신 작가:{' '}
                  {selectedArtist ? selectedArtist.artistName : '미선택'}
                </span>
              </div>
            )}

            <h2 className="mb-8 text-center text-2xl font-medium">
              입점 계약서
            </h2>
            <p className="mb-6 text-sm">{c.intro}</p>

            <p className="mb-2 font-medium">{c.article1.title}</p>
            <p className="mb-1 font-medium">{c.article1.gap.label}</p>
            {c.article1.gap.fields.map((field) => (
              <div key={field} className="mb-2 flex items-center gap-2 text-sm">
                <span className="w-32 shrink-0">{field}</span>
                <Input
                  size="small"
                  className="flex-1"
                  placeholder={field === '상호명' ? '[소품샵명]' : ''}
                  value={gapValues[field] ?? ''}
                  onChange={(e) => {
                    setGapValues((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }));
                    setHasInput(true);
                  }}
                  disabled={!isShop}
                />
              </div>
            ))}

            <p className="mb-1 mt-3 font-medium">{c.article1.eul.label}</p>
            {c.article1.eul.fields.map((field) => (
              <div key={field} className="mb-2 flex items-center gap-2 text-sm">
                <span className="w-32 shrink-0">{field}</span>
                <Input
                  size="small"
                  className="flex-1"
                  placeholder={
                    field === '성명(작가명)' ? '[작가명 또는 브랜드명]' : ''
                  }
                  value={eulValues[field] ?? ''}
                  onChange={(e) => {
                    setEulValues((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }));
                    setHasInput(true);
                  }}
                  disabled={isShop}
                />
              </div>
            ))}

            <p className="mb-2 mt-6 font-medium">{c.article2.title}</p>
            <p className="mb-6 text-sm">{c.article2.content}</p>

            <p className="mb-2 font-medium">{c.article3.title}</p>
            <div className="mb-2 flex items-center gap-2 text-sm">
              <span className="shrink-0">계약 시작일</span>
              <Input
                size="small"
                placeholder="YYYY-MM-DD"
                value={contractStartDate}
                onChange={(e) => {
                  const formatted = formatDateInput(e.target.value);
                  setContractStartDate(validateDate(formatted));
                  setHasInput(true);
                }}
                disabled={!isShop}
              />
            </div>
            <div className="mb-2 flex items-center gap-2 text-sm">
              <span className="shrink-0">계약 종료일</span>
              <Input
                size="small"
                placeholder="YYYY-MM-DD"
                value={contractEndDate}
                onChange={(e) => {
                  const formatted = formatDateInput(e.target.value);
                  setContractEndDate(validateDate(formatted));
                  setHasInput(true);
                }}
                disabled={!isShop}
              />
            </div>
            <p className="mb-6 text-sm">{c.article3.suffix}</p>

            <p className="mb-2 font-medium">{c.article5.title}</p>
            <div className="mb-2 flex items-center gap-2 text-sm">
              <span className="shrink-0">{c.article5.content1}</span>
              <Input
                size="small"
                className="w-24"
                placeholder="[수수료율]"
                value={commissionValue}
                onChange={(e) => {
                  const raw = formatNumberInput(e.target.value);
                  const capped = Number(raw) > 99 ? '99' : raw;
                  setCommissionValue(capped);
                  setHasInput(true);
                }}
                disabled={!isShop}
              />
              <span className="shrink-0">{c.article5.content1Suffix}</span>
            </div>
            <p className="mb-2 text-sm">{c.article5.content2}</p>
            {c.article5.settlementFields.map((field) => (
              <div key={field} className="mb-2 flex items-center gap-2 text-sm">
                <span className="w-32 shrink-0">{field}</span>
                <Input
                  size="small"
                  className="flex-1"
                  value={settlementValues[field] ?? ''}
                  onChange={(e) => {
                    const raw = formatNumberInput(e.target.value);
                    const capped = Number(raw) > 31 ? '31' : raw;
                    setSettlementValues((prev) => ({
                      ...prev,
                      [field]: capped,
                    }));
                    setHasInput(true);
                  }}
                  disabled={!isShop}
                />
              </div>
            ))}
            {c.article5.bankFields.map((field) => (
              <div key={field} className="mb-2 flex items-center gap-2 text-sm">
                <span className="w-32 shrink-0">{field}</span>
                <Input
                  size="small"
                  className="flex-1"
                  value={bankValues[field] ?? ''}
                  onChange={(e) => {
                    setBankValues((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }));
                    setHasInput(true);
                  }}
                  disabled={isShop}
                />
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
                <Input
                  size="small"
                  placeholder="YYYY-MM-DD"
                  value={contractDate}
                  onChange={(e) => {
                    const formatted = formatDateInput(e.target.value);
                    setContractDate(validateDate(formatted));
                    setHasInput(true);
                  }}
                  disabled={!isShop}
                />
              </div>

              <p className="mb-1 mt-4 font-medium">
                {c.footer.signatureFields.gap.label}
              </p>
              {c.footer.signatureFields.gap.fields.map((field) => (
                <div
                  key={field}
                  className="mb-2 flex items-center gap-2 text-sm"
                >
                  <span className="w-20 shrink-0">{field}</span>
                  <Input
                    size="small"
                    className="flex-1"
                    placeholder={field === '상호명' ? '[소품샵명]' : ''}
                    value={gapFooterValues[field] ?? ''}
                    onChange={(e) => {
                      setGapFooterValues((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }));
                      setHasInput(true);
                    }}
                    disabled={!isShop}
                  />
                </div>
              ))}

              <p className="mb-1 mt-4 font-medium">
                {c.footer.signatureFields.eul.label}
              </p>
              <div className="mb-2 flex items-center gap-2 text-sm">
                <span className="w-20 shrink-0">
                  {c.footer.signatureFields.eul.fields[0]}
                </span>
                <Input
                  size="small"
                  className="flex-1"
                  placeholder="[작가명 또는 브랜드명]"
                  value={eulFooterValue}
                  onChange={(e) => {
                    setEulFooterValue(e.target.value);
                    setHasInput(true);
                  }}
                  disabled={isShop}
                />
                <span>(서명)</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <p className="text-gray-400">계약서를 선택해주세요</p>
          </div>
        )}
      </section>

      <div className="grid h-full grid-rows-2 gap-4">
        <section className="flex w-[25.125rem] flex-col overflow-hidden rounded-xl bg-white">
          <div className="flex shrink-0 items-center justify-between px-5 py-4">
            <h3>작성중인 계약서</h3>
            <div className="flex gap-2">
              {isShop && (
                <Button
                  variant="primary"
                  size="small"
                  label="새 계약서 작성"
                  onClick={handleNewContract}
                />
              )}
              <Button variant="secondaryDark" size="small" label="삭제" />
            </div>
          </div>
          <div className="overflow-y-auto">
            {inProgressData?.items
              .filter(
                (item) =>
                  !(
                    !isShop &&
                    item.contractDocumentStatus === 'ARTIST_SUBMITTED'
                  )
              )
              .map((item) => (
                <button
                  key={item.contractId}
                  onClick={() => handleSelectInProgress(item.contractId)}
                  className={`grid w-full grid-cols-3 border-b border-gray-100 px-4 py-3 text-left text-sm transition-colors hover:bg-gray-50 ${
                    selectedContractId === item.contractId ? 'bg-gray-100' : ''
                  }`}
                >
                  <span className="truncate">{item.title}</span>
                  <span className="text-gray-500">{item.contractDate}</span>
                  <span className="text-gray-500">{item.counterpartyName}</span>
                </button>
              ))}
          </div>
        </section>

        <section className="flex w-[25.125rem] flex-col overflow-hidden rounded-xl bg-white">
          <div className="flex shrink-0 items-center justify-between px-5 py-4">
            <h3>완료된 계약</h3>
            <Button variant="secondaryDark" size="small" label="삭제" />
          </div>
          <div className="overflow-y-auto" />
        </section>
      </div>
    </div>
  );
};
