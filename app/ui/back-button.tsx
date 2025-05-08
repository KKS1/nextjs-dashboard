'use client';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const BackButton = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
        {children}
      </Button>
    </div>
  );
};
