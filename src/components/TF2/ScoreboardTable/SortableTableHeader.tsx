import React from 'react';

import { t } from '@i18n';
import {
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from 'lucide-react';
import {
  SORT_TYPES,
  SortableHeader,
  TableHeaderSorting,
} from '../../../constants/tableConstants';

interface SortableTableHeaderProps {
  header: SortableHeader;
  changeSort: (sorting: TableHeaderSorting) => void;
  currentSort: TableHeaderSorting;
}

export const SortableTableHeader = ({
  header,
  changeSort,
  currentSort,
}: SortableTableHeaderProps) => {
  const SortIcon = ({ size }: { size: number }) => {
    if (currentSort.sortValue === header.sortValue) {
      switch (currentSort.sortType) {
        case SORT_TYPES.SORT_ASC: {
          return <ArrowUpNarrowWide size={size} />;
        }
        case SORT_TYPES.SORT_DESC: {
          return <ArrowDownWideNarrow size={size} />;
        }
      }
    }

    return <ArrowDownUp size={size} />;
  };

  return (
    <button
      className={`gap-1 items-center ${
        header?.hideWhenSmall ? 'xs:flex hidden' : 'flex'
      }`}
      onClick={() => {
        changeSort({
          sortValue: header.sortValue,
          sortType:
            currentSort.sortType === SORT_TYPES.SORT_ASC
              ? SORT_TYPES.SORT_DESC
              : SORT_TYPES.SORT_ASC,
        });
      }}
    >
      {t(header.nameKey)}
      <SortIcon size={16} />
    </button>
  );
};
