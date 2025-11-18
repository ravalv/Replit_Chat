import { useState } from 'react';
import SessionTimeoutWarning from '../SessionTimeoutWarning';

export default function SessionTimeoutWarningExample() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SessionTimeoutWarning
      isOpen={isOpen}
      remainingSeconds={180}
      onExtendSession={() => {
        console.log('Session extended');
        setIsOpen(false);
      }}
      onLogout={() => console.log('Logout')}
    />
  );
}
