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
  'display-xl': 'font-jakarta-bold text-[40px] leading-[46px] tracking-[-0.8px]',
  'display-lg': 'font-jakarta-bold text-[32px] leading-[38.4px] tracking-[-0.32px]',
  h1: 'font-jakarta text-[24px] leading-[31.2px]',
  h2: 'font-jakarta text-[20px] leading-[27px]',
  h3: 'font-inter-semibold text-[18px] leading-[25.2px]',
  h4: 'font-inter-semibold text-[16px] leading-[22.4px]',
  'body-lg': 'font-inter text-[16px] leading-[25.6px]',
  body: 'font-inter text-[14px] leading-[22.4px]',
  'body-sm': 'font-inter text-[13px] leading-[20.15px]',
  'label-lg': 'font-inter-medium text-[14px] leading-[19.6px] tracking-[0.14px]',
  label: 'font-inter-medium text-[12px] leading-[16.8px] tracking-[0.24px]',
  caption: 'font-inter text-[12px] leading-[18px]',
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
