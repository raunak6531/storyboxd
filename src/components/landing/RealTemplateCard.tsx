'use client';

import React from 'react';
import { SAMPLE_REVIEW } from '@/lib/sampleReview';
import {
  TemplateBottom,
  TemplateTopLeft,
  TemplateCentered,
  TemplateMinimal,
  TemplatePolaroid,
  TemplateMagazine,
  TemplateCinematic,
  TemplateGradient,
  TemplateDuotone,
  TemplateNewspaper,
  TemplateLetterboxd,
  TemplateWrapped,
  TemplateType,
  TextStyle,
} from '@/components/StoryTemplates';

export interface RealTemplateCardProps {
  template: TemplateType;
  width?: number;
  className?: string;
  role?: string;
  'aria-label'?: string;
}

export function RealTemplateCard({
  template,
  width = 300,
  className = '',
  role,
  'aria-label': ariaLabel,
}: RealTemplateCardProps) {
  const canvasWidth = 1080;
  const canvasHeight = 1920;
  const scale = width / canvasWidth;
  const height = width * (16 / 9);

  let fontType = 'Inter';
  if (template === 'split') fontType = 'Permanent Marker';
  else if (template === 'newspaper') fontType = 'Playfair Display';
  else if (template === 'cinematic') fontType = 'Anton';

  const textStyle: TextStyle = {
    fontType,
    colorTheme: 'neutral',
    isBold: false,
    isItalic: false,
    letterSpacing: 0,
    lineHeight: 1.4,
    textAlign: template === 'cinematic' ? 'center' : template === 'newspaper' ? 'left' : 'center',
    quoteStyle: 'double',
  };

  const props = {
    data: SAMPLE_REVIEW,
    fontSizeMultiplier: 1,
    textStyle,
    backdropPositionPercent: 50,
    backdropPositionYPercent: 50,
    showPoster: true,
    customBackdropUrl: null,
    processedBackdropUrl: null,
    backdropBlur: 0,
    backdropBrightness: 100,
    backdropSaturation: 100,
    accentColor: '#00e054',
    canvasWidth,
    canvasHeight,
    aspectRatio: '9:16' as const,
  };

  const renderTemplate = () => {
    switch (template) {
      case 'bottom':
        return <TemplateBottom {...props} />;
      case 'topLeft':
        return <TemplateTopLeft {...props} />;
      case 'centered':
        return <TemplateCentered {...props} />;
      case 'minimal':
        return <TemplateMinimal {...props} />;
      case 'split':
        return <TemplatePolaroid {...props} />;
      case 'magazine':
        return <TemplateMagazine {...props} />;
      case 'cinematic':
        return <TemplateCinematic {...props} />;
      case 'gradient':
        return <TemplateGradient {...props} />;
      case 'duotone':
        return <TemplateDuotone {...props} />;
      case 'newspaper':
        return <TemplateNewspaper {...props} />;
      case 'letterboxd':
        return <TemplateLetterboxd {...props} />;
      case 'wrapped':
        return <TemplateWrapped {...props} />;
      default:
        return <TemplateMinimal {...props} />;
    }
  };

  return (
    <div
      role={role}
      aria-label={ariaLabel}
      className={`relative overflow-hidden rounded-[28px] select-none ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div
        className="pointer-events-none origin-top-left"
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          transform: `scale(${scale})`,
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
}

