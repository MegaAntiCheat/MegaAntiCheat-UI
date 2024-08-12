import React, { FC, ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface TextInputPasswordProps {
  input: ReactNode;
  onClick: () => void;
  showEye: boolean;
}

export const TextInputPassword: FC<TextInputPasswordProps> = ({
  input,
  onClick,
  showEye,
}) => {
  return (
    <div className={'relative flex'}>
      <div
        className="absolute right-0.5 top-1/2 flex -translate-y-[50%] items-center"
        onClick={onClick}
      >
        {showEye ? (
          <EyeOff width={24} height={24} className="pref-password-reveal" />
        ) : (
          <Eye width={24} height={24} className="pref-password-reveal" />
        )}
      </div>
      {input}
    </div>
  );
};
