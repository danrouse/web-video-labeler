import * as React from 'react';
import ModalDialog from './ModalDialog';

interface Props {
  settings: UserSettings;
  onChange: (settings: Partial<UserSettings>) => void;
  onClose: () => void;
  onReset: () => void;
}

export default class SettingsPanel extends React.Component<Props> {
  handleNumber = (evt: React.FormEvent<HTMLInputElement>) => this.props.onChange({
    [evt.currentTarget.name as any]: parseInt(evt.currentTarget.value, 10),
  } as Pick<UserSettings, keyof UserSettings>)

  handleCheckbox = (evt: React.FormEvent<HTMLInputElement>) => this.props.onChange({
    [evt.currentTarget.name as any]: evt.currentTarget.checked,
  } as Pick<UserSettings, keyof UserSettings>)

  render() {
    return (
      <ModalDialog onClose={this.props.onClose}>
        <h1>Web Video Labeler Settings</h1>
        <fieldset>
          <label>
            frame skip
            <input
              type="number"
              step="1"
              min="1"
              value={this.props.settings.skipLength}
              name="skipLength"
              onChange={this.handleNumber}
            />
          </label>
          <label>
            frame rate (todo: automatable?)
            <input
              type="number"
              step="1"
              min="1"
              value={this.props.settings.skipLengthFrameRate}
              name="skipLengthFrameRate"
              onChange={this.handleNumber}
            />
          </label>
        </fieldset>
        <fieldset>
          <label>
            save images with no labels?
            <input
              type="checkbox"
              name="saveImagesWithLabels"
              onChange={this.handleCheckbox}
              checked={this.props.settings.saveImagesWithoutLabels}
            />
          </label>
          <label>
            save cropped images?
            <input
              type="checkbox"
              name="saveCroppedImages"
              onChange={this.handleCheckbox}
              checked={this.props.settings.saveCroppedImages}
            />
          </label>
        </fieldset>
        <button onClick={this.props.onReset}>
          <i className="fas fa-trash" title="Reset Settings" />
          <span>Reset Settings</span>
        </button>
      </ModalDialog>
    );
  }
}
