import { FC, ReactNode } from 'react';

interface PreferenceListItemProps {
  children: ReactNode;
}

export const PreferenceListItem: FC<PreferenceListItemProps> = ({
  children,
}) => {
  return (
    <div className="flex h-min w-full flex-row items-center justify-between">
      {children}
    </div>
  );
};
