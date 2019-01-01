import * as React from 'react';
import ModalDialog from './ModalDialog';

interface Props {
  onClose: () => void;
}

export default function HelpPanel({ onClose }: Props) {
  return (
    <ModalDialog onClose={onClose}>
      <h1>Help</h1>

      <h2>How to Use</h2>
      <h3>Labeling Videos</h3>
      <h3>Exporting and Training</h3>

      <h2>About</h2>
      <p>
        Web Video Labeler is an open source browser extension written by <a href="https://github.com/danrouse" target="_blank">danrouse</a>.
        Source code is available on <a href="" target="_blank"><i className="fab fa-github" /> GitHub <i className="fas fa-external-link-alt" /></a>.
      </p>
    </ModalDialog>
  );
}
