import { t } from '@i18n';
import { AlertTriangle } from 'lucide-react';
import { SideMenuItem } from '@components/General';
import { PAGES } from '../../../constants/menuConstants';
import { useSideMenu } from '../../../Context/SideMenuContext';
import { Dispatch, SetStateAction } from 'react';

interface ProvisionProps {
  collapsed: boolean;
  setCurrentPage?: Dispatch<SetStateAction<PAGES>>;
}

function ToSSideMenu({ setCurrentPage }: ProvisionProps) {
  const { toggleCollapsed } = useSideMenu();

  return (
    <SideMenuItem
      title={t('TOS_HINT')}
      icon={<AlertTriangle color="yellow" className="bounce" />}
      onClick={() => {
        setCurrentPage?.(PAGES.PREFERENCES);
        toggleCollapsed();
      }}
      selected={false}
    />
  );
}

export default ToSSideMenu;
