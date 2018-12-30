import * as React from 'react';

interface Props {
  saveFullImages: boolean;
  saveCroppedImages: boolean;
  onSaveFullImagesChange: React.FormEventHandler<HTMLInputElement>;
  onSaveCroppedImagesChange: React.FormEventHandler<HTMLInputElement>;
  onEraseDataClick: () => void;
  onDownloadDataClick: () => void;
  isLocalStorageFull?: boolean;
  numLabeledImages: number;
}

export default function DownloadManager(props: Props) {
  return (
    <div>
      {props.isLocalStorageFull &&
        <p>
          Warning: Local storage is full!<br />
          Additional data will not persist after you close your browser.<br />
          Download and clear data
        </p>
      }
      <button onClick={props.onDownloadDataClick}>
        Download {props.numLabeledImages} image{props.numLabeledImages !== 1 ? 's' : ''}
      </button>
      <button onClick={props.onEraseDataClick}>
        Clear
      </button>
      <div style={{ border: '1px solid gray', borderRadius: 3 }}>
        <label>
          <input type="checkbox" checked={props.saveFullImages} onChange={props.onSaveFullImagesChange} />
          Save Full Image
        </label>
        <label>
          <input type="checkbox" checked={props.saveCroppedImages} onChange={props.onSaveCroppedImagesChange} />
          Save Cropped Images
        </label>
      </div>
    </div>
  );
}
