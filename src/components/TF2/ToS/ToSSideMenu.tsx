import { t } from '@i18n';
import { AlertTriangle } from 'lucide-react';
import { SideMenuItem } from '@components/General';
import { PAGES } from '../../../constants/menuConstants';

interface ProvisionProps {
  collapsed: boolean;
  setCurrentPage?: React.Dispatch<React.SetStateAction<PAGES>>;
}

function ToSSideMenu({ collapsed, setCurrentPage }: ProvisionProps) {
  return (
    <SideMenuItem
      key={68}
      title={t('TOS_HINT')}
      Icon={<AlertTriangle color="yellow" className="bounce" />}
      collapsed={collapsed}
      onClick={() => setCurrentPage?.(PAGES.PREFERENCES)}
      selected={false}
    />
  );
}

export default ToSSideMenu;
