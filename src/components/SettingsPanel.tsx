import * as React from 'react';
import ModalDialog from './ModalDialog';
import './SettingsPanel.css';

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
      <ModalDialog onClose={this.props.onClose} className="SettingsPanel">
        <h1>Web Video Labeler Settings</h1>
        <fieldset>
          <legend>Playback</legend>
          <label>
            Frame Skip
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
            Frame Rate
            <input
              type="number"
              step={1}
              min={1}
              value={this.props.settings.skipLengthFrameRate}
              name="skipLengthFrameRate"
              onChange={this.handleNumber}
            />
          </label>
        </fieldset>
        <fieldset>
          <legend>Downloading</legend>
          <label>
            Save images with no labels?
            <input
              type="checkbox"
              name="saveImagesWithLabels"
              onChange={this.handleCheckbox}
              checked={this.props.settings.saveImagesWithoutLabels}
            />
          </label>
          <label>
            Save cropped images?
            <input
              type="checkbox"
              name="saveCroppedImages"
              onChange={this.handleCheckbox}
              checked={this.props.settings.saveCroppedImages}
            />
          </label>
        </fieldset>
        <fieldset>
          <legend>Darknet Output</legend>
          <p>These settings are used to pre-populate darknet config and training scripts</p>
          <label>
            Width
            <input
              name="darknetWidth"
              type="number"
              min={1}
              step={1}
              value={this.props.settings.darknetWidth}
              onChange={this.handleNumber}
            />
          </label>
          <label>
            Height
            <input
              name="darknetHeight"
              type="number"
              min={1}
              step={1}
              value={this.props.settings.darknetHeight}
              onChange={this.handleNumber}
            />
          </label>
          <label>
            Executable path
            <input type="text" value={this.props.settings.darknetExecutablePath} />
          </label>
          <label>
            Config URL
            <input type="text" value={this.props.settings.darknetConfigURL} />
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
