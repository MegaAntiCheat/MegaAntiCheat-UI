import React from 'react';
import { provisionUrl } from '@api/masterbase/masterbase-api';
import { Button } from '@components/General';

function Provision() {
  return (
    <Button>
      <a
        href={provisionUrl()}
        target="_self"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        Provision
      </a>
    </Button>
  );
}

export default Provision;
