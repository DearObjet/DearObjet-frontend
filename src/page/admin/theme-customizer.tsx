import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  useResetSystemThemeMutation,
  useUpdateSystemThemeMutation,
} from '../../store/api/theme-api';
import { ThemeToggle } from '../../components/theme-toggle';
import { Button } from '../../components/ui/button';
import type { SystemTheme } from '../../types/theme-types';
import { ColorInput } from '../../components/ui/colorinput';
import { DEFAULT_SYSTEM_THEME } from '../../constants/default-theme';
import { resetToDefaultTheme } from '../../store/slices/theme-slice';

export function ThemeCustomizer() {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.theme.systemTheme);
  const [updateTheme, { isLoading: isUpdating }] =
    useUpdateSystemThemeMutation();
  const [resetTheme, { isLoading: isResetting }] =
    useResetSystemThemeMutation();

  const [themeColors, setThemeColors] =
    useState<SystemTheme>(DEFAULT_SYSTEM_THEME);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (
      currentTheme &&
      currentTheme.primary &&
      currentTheme.secondaryLight &&
      currentTheme.secondaryDark
    ) {
      setThemeColors(currentTheme);
      setIsInitialized(true);
    }
  }, [currentTheme]);

  const handleColorChange = (
    variant: 'primary' | 'secondaryLight' | 'secondaryDark',
    state: 'default' | 'hover' | 'active' | 'disabled',
    type: 'bg' | 'border' | 'text',
    value: string
  ) => {
    setThemeColors((prev) => ({
      ...prev,
      [variant]: {
        ...prev[variant],
        [state]: {
          ...prev[variant][state],
          [type]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    try {
      await updateTheme(themeColors).unwrap();
      alert('테마가 저장되었습니다!');
    } catch (error) {
      console.error('테마 저장 실패:', error);
      alert('테마 저장에 실패했습니다.');
    }
  };

  const handleReset = async () => {
    if (confirm('기본 테마로 되돌리시겠습니까? 현재 설정은 모두 삭제됩니다.')) {
      try {
        // API를 통해 localStorage 초기화
        await resetTheme().unwrap();

        // Redux state 초기화
        dispatch(resetToDefaultTheme());

        // 로컬 state 초기화
        setThemeColors(DEFAULT_SYSTEM_THEME);

        alert('기본 테마로 초기화되었습니다!');
      } catch (error) {
        console.error('테마 초기화 실패:', error);
        alert('테마 초기화에 실패했습니다.');
      }
    }
  };

  // 로딩 중일 때 표시
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 text-lg font-medium text-foreground">
            테마를 불러오는 중...
          </div>
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-bg border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          테마 커스터마이저
        </h1>
        <ThemeToggle />
      </div>

      {/* Primary Button */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 text-xl font-bold text-foreground">Primary 버튼</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Default */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Default</h3>
            <ColorInput
              label="Background"
              value={themeColors.primary.default.bg}
              onChange={(v) => handleColorChange('primary', 'default', 'bg', v)}
            />
            <ColorInput
              label="Border"
              value={themeColors.primary.default.border}
              onChange={(v) =>
                handleColorChange('primary', 'default', 'border', v)
              }
            />
            <ColorInput
              label="Font"
              value={themeColors.primary.default.text}
              onChange={(v) =>
                handleColorChange('primary', 'default', 'text', v)
              }
            />
          </div>

          {/* Hover */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Hover</h3>
            <ColorInput
              label="Background"
              value={themeColors.primary.hover.bg}
              onChange={(v) => handleColorChange('primary', 'hover', 'bg', v)}
            />
            <ColorInput
              label="Border"
              value={themeColors.primary.hover.border}
              onChange={(v) =>
                handleColorChange('primary', 'hover', 'border', v)
              }
            />
            <ColorInput
              label="Font"
              value={themeColors.primary.hover.text}
              onChange={(v) => handleColorChange('primary', 'hover', 'text', v)}
            />
          </div>

          {/* Active */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Active</h3>
            <ColorInput
              label="Background"
              value={themeColors.primary.active.bg}
              onChange={(v) => handleColorChange('primary', 'active', 'bg', v)}
            />
            <ColorInput
              label="Border"
              value={themeColors.primary.active.border}
              onChange={(v) =>
                handleColorChange('primary', 'active', 'border', v)
              }
            />
            <ColorInput
              label="Font"
              value={themeColors.primary.active.text}
              onChange={(v) =>
                handleColorChange('primary', 'active', 'text', v)
              }
            />
          </div>

          {/* Disabled */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Disabled</h3>
            <ColorInput
              label="Background"
              value={themeColors.primary.disabled.bg}
              onChange={(v) =>
                handleColorChange('primary', 'disabled', 'bg', v)
              }
            />
            <ColorInput
              label="Border"
              value={themeColors.primary.disabled.border}
              onChange={(v) =>
                handleColorChange('primary', 'disabled', 'border', v)
              }
            />
            <ColorInput
              label="Font"
              value={themeColors.primary.disabled.text}
              onChange={(v) =>
                handleColorChange('primary', 'disabled', 'text', v)
              }
            />
          </div>
        </div>
      </div>

      {/* primary 버튼 미리보기 */}
      <div className="rounded-lg border border-border bg-background p-6">
        <h3 className="mb-6 text-xl font-semibold text-foreground">
          Primary 버튼 미리보기
        </h3>
        {/* Primary Buttons */}
        <div>
          <div className="flex flex-wrap gap-4">
            {/* Default - 실제 Button 컴포넌트 (정상 작동) */}
            <div className="text-center">
              <Button
                variant="primary"
                size="medium"
                label="버튼"
                onClick={() => {}}
              />
              <p className="mt-1 text-xs text-foreground/60">default</p>
            </div>

            {/* Hover - hover 색상 강제 적용 */}
            <div className="text-center">
              <Button
                variant="primary"
                size="medium"
                label="버튼"
                onClick={() => {}}
                style={{
                  backgroundColor: `rgb(${themeColors.primary.hover.bg})`,
                  borderColor: `rgb(${themeColors.primary.hover.border})`,
                  color: `rgb(${themeColors.primary.hover.text})`,
                }}
              />
              <p className="mt-1 text-xs text-foreground/60">hover</p>
            </div>

            {/* Active - active 색상 강제 적용 */}
            <div className="text-center">
              <Button
                variant="primary"
                size="medium"
                label="버튼"
                onClick={() => {}}
                style={{
                  backgroundColor: `rgb(${themeColors.primary.active.bg})`,
                  borderColor: `rgb(${themeColors.primary.active.border})`,
                  color: `rgb(${themeColors.primary.active.text})`,
                }}
              />
              <p className="mt-1 text-xs text-foreground/60">active</p>
            </div>

            {/* Disabled - 실제 disabled 상태 */}
            <div className="text-center">
              <Button variant="primary" size="medium" label="버튼" disabled />
              <p className="mt-1 text-xs text-foreground/60">disabled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Light Button */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 text-xl font-bold text-foreground">
          Secondary-1 버튼 (Light)
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Default */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Default</h3>
            <ColorInput
              label="Background"
              value={themeColors.secondaryLight.default.bg}
              onChange={(v) =>
                handleColorChange('secondaryLight', 'default', 'bg', v)
              }
            />
            <ColorInput
              label="Border"
              value={themeColors.secondaryLight.default.border}
              onChange={(v) =>
                handleColorChange('secondaryLight', 'default', 'border', v)
              }
            />
            <ColorInput
              label="Font"
              value={themeColors.secondaryLight.default.text}
              onChange={(v) =>
                handleColorChange('secondaryLight', 'default', 'text', v)
              }
            />
          </div>

          {/* Hover */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Hover</h3>
            <ColorInput
              label="Background"
              value={themeColors.secondaryLight.hover.bg}
              onChange={(v) =>
                handleColorChange('secondaryLight', 'hover', 'bg', v)
              }
            />
            <ColorInput
              label="Border"
              value={themeColors.secondaryLight.hover.border}
              onChange={(v) =>
                handleColorChange('secondaryLight', 'hover', 'border', v)
              }
            />
            <ColorInput
              label="Font"
              value={themeColors.secondaryLight.hover.text}
              onChange={(v) =>
                handleColorChange('secondaryLight', 'hover', 'text', v)
              }
            />
          </div>

          {/* Active */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Active</h3>
            <ColorInput
              label="Background"
              value={themeColors.secondaryLight.active.bg}
              onChange={(v) =>
                handleColorChange('secondaryLight', 'active', 'bg', v)
              }
            />
            <ColorInput
              label="Border"
              value={themeColors.secondaryLight.active.border}
              onChange={(v) =>
                handleColorChange('secondaryLight', 'active', 'border', v)
              }
            />
            <ColorInput
              label="Font"
              value={themeColors.secondaryLight.active.text}
              onChange={(v) =>
                handleColorChange('secondaryLight', 'active', 'text', v)
              }
            />
          </div>

          {/* Disabled */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Disabled</h3>
            <ColorInput
              label="Background"
              value={themeColors.secondaryLight.disabled.bg}
              onChange={(v) =>
                handleColorChange('secondaryLight', 'disabled', 'bg', v)
              }
            />
            <ColorInput
              label="Border"
              value={themeColors.secondaryLight.disabled.border}
              onChange={(v) =>
                handleColorChange('secondaryLight', 'disabled', 'border', v)
              }
            />
            <ColorInput
              label="Font"
              value={themeColors.secondaryLight.disabled.text}
              onChange={(v) =>
                handleColorChange('secondaryLight', 'disabled', 'text', v)
              }
            />
          </div>
        </div>
      </div>

      {/* Secondary-1 (Light) 버튼 미리보기 */}
      <div className="rounded-lg border border-border bg-background p-6">
        <h3 className="mb-6 text-xl font-semibold text-foreground">
          Secondary-1 버튼 (Light) 미리보기
        </h3>
        {/* Secondary Light Buttons */}
        <div>
          <div className="flex flex-wrap gap-4">
            {/* Default */}
            <div className="text-center">
              <Button
                variant="secondaryLight"
                size="medium"
                label="버튼"
                onClick={() => {}}
              />
              <p className="mt-1 text-xs text-foreground/60">default</p>
            </div>

            {/* Hover */}
            <div className="text-center">
              <Button
                variant="secondaryLight"
                size="medium"
                label="버튼"
                onClick={() => {}}
                style={{
                  backgroundColor: `rgb(${themeColors.secondaryLight.hover.bg})`,
                  borderColor: `rgb(${themeColors.secondaryLight.hover.border})`,
                  color: `rgb(${themeColors.secondaryLight.hover.text})`,
                }}
              />
              <p className="mt-1 text-xs text-foreground/60">hover</p>
            </div>

            {/* Active */}
            <div className="text-center">
              <Button
                variant="secondaryLight"
                size="medium"
                label="버튼"
                onClick={() => {}}
                style={{
                  backgroundColor: `rgb(${themeColors.secondaryLight.active.bg})`,
                  borderColor: `rgb(${themeColors.secondaryLight.active.border})`,
                  color: `rgb(${themeColors.secondaryLight.active.text})`,
                }}
              />
              <p className="mt-1 text-xs text-foreground/60">active</p>
            </div>

            {/* Disabled */}
            <div className="text-center">
              <Button
                variant="secondaryLight"
                size="medium"
                label="버튼"
                disabled
              />
              <p className="mt-1 text-xs text-foreground/60">disabled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Dark Button */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 text-xl font-bold text-foreground">
          Secondary-2 버튼 (Dark)
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Default */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Default</h3>
            <ColorInput
              label="Background"
              value={themeColors.secondaryDark.default.bg}
              onChange={(v) =>
                handleColorChange('secondaryDark', 'default', 'bg', v)
              }
            />
            <ColorInput
              label="Border"
              value={themeColors.secondaryDark.default.border}
              onChange={(v) =>
                handleColorChange('secondaryDark', 'default', 'border', v)
              }
            />
            <ColorInput
              label="Font"
              value={themeColors.secondaryDark.default.text}
              onChange={(v) =>
                handleColorChange('secondaryDark', 'default', 'text', v)
              }
            />
          </div>

          {/* Hover */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Hover</h3>
            <ColorInput
              label="Background"
              value={themeColors.secondaryDark.hover.bg}
              onChange={(v) =>
                handleColorChange('secondaryDark', 'hover', 'bg', v)
              }
            />
            <ColorInput
              label="Border"
              value={themeColors.secondaryDark.hover.border}
              onChange={(v) =>
                handleColorChange('secondaryDark', 'hover', 'border', v)
              }
            />
            <ColorInput
              label="Font"
              value={themeColors.secondaryDark.hover.text}
              onChange={(v) =>
                handleColorChange('secondaryDark', 'hover', 'text', v)
              }
            />
          </div>

          {/* Active */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Active</h3>
            <ColorInput
              label="Background"
              value={themeColors.secondaryDark.active.bg}
              onChange={(v) =>
                handleColorChange('secondaryDark', 'active', 'bg', v)
              }
            />
            <ColorInput
              label="Border"
              value={themeColors.secondaryDark.active.border}
              onChange={(v) =>
                handleColorChange('secondaryDark', 'active', 'border', v)
              }
            />
            <ColorInput
              label="Font"
              value={themeColors.secondaryDark.active.text}
              onChange={(v) =>
                handleColorChange('secondaryDark', 'active', 'text', v)
              }
            />
          </div>

          {/* Disabled */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Disabled</h3>
            <ColorInput
              label="Background"
              value={themeColors.secondaryDark.disabled.bg}
              onChange={(v) =>
                handleColorChange('secondaryDark', 'disabled', 'bg', v)
              }
            />
            <ColorInput
              label="Border"
              value={themeColors.secondaryDark.disabled.border}
              onChange={(v) =>
                handleColorChange('secondaryDark', 'disabled', 'border', v)
              }
            />
            <ColorInput
              label="Font"
              value={themeColors.secondaryDark.disabled.text}
              onChange={(v) =>
                handleColorChange('secondaryDark', 'disabled', 'text', v)
              }
            />
          </div>
        </div>
      </div>

      {/* Secondary-2 버튼 (Dark) 미리보기 */}
      <div className="rounded-lg border border-border bg-background p-6">
        <h3 className="mb-6 text-xl font-semibold text-foreground">
          Secondary-2 버튼 (Dark) 미리보기
        </h3>
        {/* Secondary Dark Buttons */}
        <div>
          <div className="flex flex-wrap gap-4">
            {/* Default */}
            <div className="text-center">
              <Button
                variant="secondaryDark"
                size="medium"
                label="버튼"
                onClick={() => {}}
              />
              <p className="mt-1 text-xs text-foreground/60">default</p>
            </div>

            {/* Hover */}
            <div className="text-center">
              <Button
                variant="secondaryDark"
                size="medium"
                label="버튼"
                onClick={() => {}}
                style={{
                  backgroundColor: `rgb(${themeColors.secondaryDark.hover.bg})`,
                  borderColor: `rgb(${themeColors.secondaryDark.hover.border})`,
                  color: `rgb(${themeColors.secondaryDark.hover.text})`,
                }}
              />
              <p className="mt-1 text-xs text-foreground/60">hover</p>
            </div>

            {/* Active */}
            <div className="text-center">
              <Button
                variant="secondaryDark"
                size="medium"
                label="버튼"
                onClick={() => {}}
                style={{
                  backgroundColor: `rgb(${themeColors.secondaryDark.active.bg})`,
                  borderColor: `rgb(${themeColors.secondaryDark.active.border})`,
                  color: `rgb(${themeColors.secondaryDark.active.text})`,
                }}
              />
              <p className="mt-1 text-xs text-foreground/60">active</p>
            </div>

            {/* Disabled */}
            <div className="text-center">
              <Button
                variant="secondaryDark"
                size="medium"
                label="버튼"
                disabled
              />
              <p className="mt-1 text-xs text-foreground/60">disabled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Colors */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 text-xl font-bold text-foreground">
          Theme 색상 (범용)
        </h2>
        <p className="mb-4 text-sm text-foreground/70">
          프로젝트 전반에서 사용되는 범용 색상입니다. 배경, 테두리, 텍스트 등에
          사용됩니다.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* theme-100 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">theme-100</h3>
            <ColorInput
              label=""
              value={themeColors.theme[100]}
              onChange={(v) =>
                setThemeColors((prev) => ({
                  ...prev,
                  theme: { ...prev.theme, 100: v },
                }))
              }
            />
            <div
              className="h-16 rounded border border-border"
              style={{ backgroundColor: `rgb(${themeColors.theme[100]})` }}
            />
          </div>
          {/* theme-200 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">theme-200</h3>
            <ColorInput
              label=""
              value={themeColors.theme[200]}
              onChange={(v) =>
                setThemeColors((prev) => ({
                  ...prev,
                  theme: { ...prev.theme, 200: v },
                }))
              }
            />
            <div
              className="h-16 rounded border border-border"
              style={{ backgroundColor: `rgb(${themeColors.theme[200]})` }}
            />
          </div>
          {/* theme-300 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">theme-300</h3>
            <ColorInput
              label=""
              value={themeColors.theme[300]}
              onChange={(v) =>
                setThemeColors((prev) => ({
                  ...prev,
                  theme: { ...prev.theme, 300: v },
                }))
              }
            />
            <div
              className="h-16 rounded border border-border"
              style={{ backgroundColor: `rgb(${themeColors.theme[300]})` }}
            />
          </div>
          {/* theme-500 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">theme-500</h3>
            <ColorInput
              label=""
              value={themeColors.theme[500]}
              onChange={(v) =>
                setThemeColors((prev) => ({
                  ...prev,
                  theme: { ...prev.theme, 500: v },
                }))
              }
            />
            <div
              className="h-16 rounded border border-border"
              style={{ backgroundColor: `rgb(${themeColors.theme[500]})` }}
            />
          </div>
          {/* theme-700 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">theme-700</h3>
            <ColorInput
              label=""
              value={themeColors.theme[700]}
              onChange={(v) =>
                setThemeColors((prev) => ({
                  ...prev,
                  theme: { ...prev.theme, 700: v },
                }))
              }
            />
            <div
              className="h-16 rounded border border-border"
              style={{ backgroundColor: `rgb(${themeColors.theme[700]})` }}
            />
          </div>
          {/* theme-900 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">theme-900</h3>
            <ColorInput
              label=""
              value={themeColors.theme[900]}
              onChange={(v) =>
                setThemeColors((prev) => ({
                  ...prev,
                  theme: { ...prev.theme, 900: v },
                }))
              }
            />
            <div
              className="h-16 rounded border border-border"
              style={{ backgroundColor: `rgb(${themeColors.theme[900]})` }}
            />
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="sticky bottom-6 flex items-center justify-between rounded-lg border border-border bg-card p-4 shadow-lg">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="text-sm text-foreground">
            변경사항을 저장하지 않으면 사라집니다
          </span>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondaryLight"
            size="medium"
            label={isResetting ? '초기화 중...' : '기본값으로 되돌리기'}
            onClick={handleReset}
            disabled={isResetting || isUpdating}
          />
          <Button
            variant="primary"
            size="large"
            label={isUpdating ? '저장 중...' : '변경사항 저장'}
            onClick={handleSave}
            disabled={isUpdating || isResetting}
          />
        </div>
      </div>
    </div>
  );
}
