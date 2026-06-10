import { TouchableOpacityProps } from 'react-native';
import { IconProps } from 'phosphor-react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  label: string;
  icon?: React.FC<IconProps>;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  className?: string;
  isBengali?: boolean;
}
