import React, { useEffect, useState } from 'react';
import { masterbaseProvisionUrl } from '@api/masterbase/masterbase-api';
import { Button } from '@components/General';

function Provision() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const fetchUrl = async () => {
      const fetchedUrl = await masterbaseProvisionUrl();
      setUrl(fetchedUrl);
    };

    void fetchUrl();
  }, []);
  return (
    <Button>
      <a
        href={url}
        target="_self"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        Provision
      </a>
    </Button>
  );
}

export default Provision;
