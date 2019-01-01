import * as React from 'react';
import ModalDialog from './ModalDialog';
import './SettingsPanel.css';

interface Props {
  settings: UserSettings;
  onChange: (settings: Partial<UserSettings>) => void;
  onClose: () => void;
  onReset: () => void;
}

type OverrideInputAttributes<T, P> = Pick<React.InputHTMLAttributes<T>, Exclude<keyof React.InputHTMLAttributes<T>, P>>;
interface OverrideInputValue<T> extends OverrideInputAttributes<T, 'value'> {
  value: UserSettings[keyof UserSettings];
}
interface OverrideInputChecked<T> extends OverrideInputAttributes<T, 'checked'> {
  checked: UserSettings[keyof UserSettings];
}
type SettingsInputProps<T> = (OverrideInputValue<T> | OverrideInputChecked<T>) & {
  name: keyof UserSettings;
};

function SettingsInput<T>(props: SettingsInputProps<T>) {
  return React.createElement('input', props);
}

export default class SettingsPanel extends React.Component<Props> {
  handleNumber = (evt: React.FormEvent<HTMLInputElement>) => this.props.onChange({
    [evt.currentTarget.name as any]: parseFloat(evt.currentTarget.value),
  } as Pick<UserSettings, keyof UserSettings>)

  handleCheckbox = (evt: React.FormEvent<HTMLInputElement>) => this.props.onChange({
    [evt.currentTarget.name as any]: evt.currentTarget.checked,
  } as Pick<UserSettings, keyof UserSettings>)

  render() {
    return (
      <ModalDialog onClose={this.props.onClose} className="SettingsPanel">
        <h1>Settings</h1>
        <fieldset>
          <legend>Playback</legend>
          <label>
            Frame Skip
            <SettingsInput
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
            <SettingsInput
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
            <SettingsInput
              type="checkbox"
              name="saveImagesWithoutLabels"
              onChange={this.handleCheckbox}
              checked={this.props.settings.saveImagesWithoutLabels}
            />
          </label>
          <label>
            Save cropped images?
            <SettingsInput
              type="checkbox"
              name="saveCroppedImages"
              onChange={this.handleCheckbox}
              checked={this.props.settings.saveCroppedImages}
            />
          </label>
          <label>
            Image scale
            <SettingsInput
              name="savedImageScale"
              type="number"
              min={0.01}
              max={1}
              step={0.01}
              onChange={this.handleNumber}
              value={this.props.settings.savedImageScale}
            />
          </label>
        </fieldset>
        <fieldset>
          <legend>Darknet Output</legend>
          <label>
            Width
            <SettingsInput
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
            <SettingsInput
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
            <SettingsInput
              name="darknetExecutablePath"
              type="text"
              value={this.props.settings.darknetExecutablePath}
            />
          </label>
          <label>
            Config URL
            <SettingsInput
              name="darknetConfigURL"
              type="text"
              value={this.props.settings.darknetConfigURL}
            />
          </label>
          <label>
            Train/test split
            <SettingsInput
              name="darknetTrainTestRatio"
              type="number"
              min={0}
              max={1}
              step={0.01}
              value={this.props.settings.darknetTrainTestRatio}
            />
          </label>
        </fieldset>
        <div style={{ display: 'flex' }}>
          <button onClick={this.props.onReset} title="Reset Settings" style={{ flex: 1 }}>
            <i className="fas fa-trash" />
            <span>Reset</span>
          </button>
          <button onClick={this.props.onClose} title="Done" style={{ flex: 3 }}>
            <i className="fas fa-check" />
            <span>Done</span>
          </button>
        </div>
      </ModalDialog>
    );
  }
}
