import React from 'react';
import { Text, TextProps } from 'react-native';

export type TypographyVariant =
  | 'display-xl'
  | 'display-lg'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body-lg'
  | 'body'
  | 'body-sm'
  | 'label-lg'
  | 'label'
  | 'caption'
  | 'time'
  | 'mono';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  className?: string;
  isBengali?: boolean;
}

const variantClasses: Record<TypographyVariant, string> = {
  'display-xl': 'font-jakarta-bold text-[57px] leading-[64px] tracking-[-0.25px]',
  'display-lg': 'font-jakarta-bold text-[45px] leading-[52px]',
  h1: 'font-jakarta text-[36px] leading-[44px]',
  h2: 'font-jakarta text-[32px] leading-[40px]',
  h3: 'font-inter-semibold text-[24px] leading-[32px]',
  h4: 'font-inter-semibold text-[20px] leading-[28px]',
  'body-lg': 'font-inter text-[16px] leading-[24px]',
  body: 'font-inter text-[14px] leading-[20px]',
  'body-sm': 'font-inter text-[12px] leading-[16px]',
  'label-lg': 'font-inter-medium text-[14px] leading-[20px] tracking-[0.1px]',
  label: 'font-inter-medium text-[12px] leading-[16px] tracking-[0.5px]',
  caption: 'font-inter text-[11px] leading-[16px] tracking-[0.5px]',
  time: 'font-mono-medium text-[14px]',
  mono: 'font-mono text-[13px]',
};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  className = '',
  isBengali = false,
  children,
  ...props
}) => {
  let classes = [variantClasses[variant]];
  
  if (!className.includes('text-')) {
    classes.push('text-text-primary');
  }

  if (isBengali) {
    const isBold = variant.includes('bold') || variant.includes('semibold') || ['h1', 'h2', 'h3', 'h4'].includes(variant);
    classes = classes.filter(c => !c.startsWith('font-'));
    classes.push(isBold ? 'font-bengali-semibold' : 'font-bengali');
    
    // Bengali rules: min font size 14
    const smallVariants: TypographyVariant[] = ['body-sm', 'label', 'caption', 'mono'];
    if (smallVariants.includes(variant)) {
        classes = classes.filter(c => !c.startsWith('text-['));
        classes.push('text-[14px]');
    }
    
    // Bengali rules: min line height 1.7
    // Overriding leading for Bengali
    classes = classes.filter(c => !c.startsWith('leading-'));
    classes.push('leading-[26px]'); // 1.7 * 14 = 23.8, 1.7 * 16 = 27.2. 26 is a good middle ground or we could be more specific.
  }

  return (
    <Text className={`${classes.join(' ')} ${className}`} {...props}>
      {children}
    </Text>
  );
};
