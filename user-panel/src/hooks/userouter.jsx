import { useEffect, useState } from 'react';
import { useRouter as useNextRouter } from 'next/navigation';

const useRouter = () => {
  const [mounted, setMounted] = useState(false);
  const router = useNextRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return router;
};

export default useRouter;
