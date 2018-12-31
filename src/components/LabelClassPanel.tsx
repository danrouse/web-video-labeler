import * as React from 'react';
import ModalDialog from './ModalDialog';

interface Props {
  labelClasses: string[];
  onClose: () => void;
}

export default function LabelClassPanel({ labelClasses, onClose }: Props) {
  return (
    <ModalDialog onClose={onClose}>
      <ul style={{ padding: 0, margin: 0 }}>
        {labelClasses.map((str, index) => (
          <li>{index} - {str}</li>
        ))}
      </ul>
    </ModalDialog>
  );
}
