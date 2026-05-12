import { useState } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from '../../../app/store';

import { Button, Input } from '../../../shared/components/ui';

import { CONTRACT_STATIC_TEXT } from '../../shop/tenant-management/constants/artist-tenant-constants';

const c = CONTRACT_STATIC_TEXT;

type TemplateMode = 'new' | 'existing' | null;

export const ContractManagement = () => {
  const [mode, setMode] = useState<TemplateMode>(null);
  const [hasInput, setHasInput] = useState(false);
  const [hasEdit, setHasEdit] = useState(false);
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const isShop = role === 'SHOP';

  const handleChange = () => {
    if (mode === 'new') setHasInput(true);
    if (mode === 'existing') setHasEdit(true);
  };

  const handleCancel = () => {
    setMode(null);
    setHasInput(false);
    setHasEdit(false);
  };

  return (
    <div className="flex h-full gap-4">
      <section className="flex h-[63.25rem] w-[59.875rem] flex-col rounded-xl bg-white">
        {mode !== null ? (
          <div className="relative min-h-0 flex-1 overflow-y-auto p-10 text-gray-700">
            <div className="absolute right-6 top-4 flex gap-2">
              {mode === 'new' && hasInput && (
                <>
                  <Button variant="secondaryDark" size="small" label="저장" />
                  <Button variant="primary" size="small" label="보내기" />
                </>
              )}
              {mode === 'existing' && hasEdit && (
                <>
                  <Button
                    variant="secondaryDark"
                    size="small"
                    label="취소"
                    onClick={handleCancel}
                  />
                  <Button variant="primary" size="small" label="저장" />
                </>
              )}
            </div>

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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                placeholder="[계약 시작일]"
                onChange={handleChange}
                disabled={!isShop}
              />
            </div>
            <div className="mb-2 flex items-center gap-2 text-sm">
              <span className="shrink-0">계약 종료일</span>
              <Input
                size="small"
                placeholder="[계약 종료일]"
                onChange={handleChange}
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
                onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  disabled={!isShop}
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
                  placeholder="[계약일]"
                  onChange={handleChange}
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
                    onChange={handleChange}
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
                  onChange={handleChange}
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
                  onClick={() => {
                    setMode('new');
                    setHasInput(false);
                    setHasEdit(false);
                  }}
                />
              )}
              <Button variant="secondaryDark" size="small" label="삭제" />
            </div>
          </div>
          <div className="overflow-y-auto" />
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
