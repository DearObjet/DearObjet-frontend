import React, { useState, useEffect } from 'react';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ColorInput: React.FC<ColorInputProps> = ({
  label,
  value,
  onChange,
}) => {
  const [hexValue, setHexValue] = useState(rgbToHex(value));

  useEffect(() => {
    setHexValue(rgbToHex(value));
  }, [value]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setHexValue(hex);

    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      const rgb = hexToRgb(hex);
      onChange(`${rgb.r} ${rgb.g} ${rgb.b}`);
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setHexValue(hex);
    const rgb = hexToRgb(hex);
    onChange(`${rgb.r} ${rgb.g} ${rgb.b}`);
  };

  return (
    <div>
      {label && (
        <label className="mb-1 block text-xs font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={hexValue}
          onChange={handleColorPickerChange}
          className="h-8 w-12 cursor-pointer rounded border border-border"
        />
        <input
          type="text"
          value={hexValue}
          onChange={handleHexChange}
          className="flex-1 rounded border border-border bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-bg"
        />
      </div>
    </div>
  );
};

// 헬퍼 함수
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(rgb: string): string {
  const [r, g, b] = rgb.split(' ').map(Number);

  // 유효하지 않은 값 처리
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return '#000000';
  }

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}
