import * as React from 'react';
import ModalDialog from './ModalDialog';
import LabelClassSelector from './LabelClassSelector';

interface Props {
  labelClasses: string[];
  onClose: () => void;
}

export default function LabelClassPanel({ labelClasses, onClose }: Props) {

  return (
    <ModalDialog onClose={onClose}>
      <LabelClassSelector classes={labelClasses} showIndex />
    </ModalDialog>
  );
}
