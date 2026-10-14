import React from 'react';
import { SavedWorkspaceModal } from './SavedWorkspaceModal';
import { ApiItem } from '../types/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'profile';
  premiumApiName?: string;
  onSelectApi?: (api: ApiItem) => void;
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectApi
}) => {
  return (
    <SavedWorkspaceModal
      isOpen={isOpen}
      onClose={onClose}
      onSelectApi={onSelectApi}
    />
  );
};
