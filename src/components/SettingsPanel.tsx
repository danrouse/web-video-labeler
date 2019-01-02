import * as React from 'react';
import ModalDialog from './ModalDialog';
import LabelBox from './LabelBox';
import './SettingsPanel.css';

interface Props {
  settings: UserSettings;
  onChange: (settings: Partial<UserSettings>) => void;
  onClose: () => void;
  onReset: () => void;
}

type OverrideInputAttributes<P> = Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  Exclude<keyof React.InputHTMLAttributes<HTMLInputElement>, P>
>;
interface OverrideInputValue extends OverrideInputAttributes<'value'> {
  value: UserSettings[keyof UserSettings];
}
interface OverrideInputChecked extends OverrideInputAttributes<'checked'> {
  checked: UserSettings[keyof UserSettings];
}
type SettingsInputProps = (OverrideInputValue | OverrideInputChecked) & {
  name: keyof UserSettings;
};

function SettingsInput(props: SettingsInputProps) {
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
      <ModalDialog
        title="Settings"
        onClose={this.props.onClose}
        className="SettingsPanel"
        buttons={[
          <button onClick={this.props.onReset} title="Reset Settings">
            <i className="fas fa-trash" />
            <span>Reset</span>
          </button>,
          <button onClick={this.props.onClose} title="Done">
            <i className="fas fa-check" />
            <span>Done</span>
          </button>,
        ]}
      >
        <form onSubmit={this.props.onClose}>
          <LabelBox label="Playback" className="SettingsPanel__LabelBox">
            <label>
              Frame Skip
              <p>How many frames to skip using playback controls</p>
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
              <p>Video frames per second, usually 24</p>
              <SettingsInput
                type="number"
                step={1}
                min={1}
                value={this.props.settings.skipLengthFrameRate}
                name="skipLengthFrameRate"
                onChange={this.handleNumber}
              />
            </label>
          </LabelBox>
          <LabelBox label="Downloading" className="SettingsPanel__LabelBox">
            <label>
              Save images with no labels?
              <p>If there are no labels present on an image, it will not be downloaded</p>
              <SettingsInput
                type="checkbox"
                name="saveImagesWithoutLabels"
                onChange={this.handleCheckbox}
                checked={this.props.settings.saveImagesWithoutLabels}
              />
            </label>
            <label>
              Save cropped images?
              <p>When saving images, also crop and save each labeled region separately</p>
              <SettingsInput
                type="checkbox"
                name="saveCroppedImages"
                onChange={this.handleCheckbox}
                checked={this.props.settings.saveCroppedImages}
              />
            </label>
            <label>
              Image scale
              <p>Scale to resize images to when saving, from 0 - 1</p>
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
          </LabelBox>
          <LabelBox label="Darknet Output" className="SettingsPanel__LabelBox">
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
              <p>Command to call <pre>darknet</pre> on your local machine</p>
              <SettingsInput
                name="darknetExecutablePath"
                type="text"
                value={this.props.settings.darknetExecutablePath}
              />
            </label>
            <label>
              Config URL
              <p>Base configuration for training and running the network</p>
              <SettingsInput
                name="darknetConfigURL"
                type="text"
                value={this.props.settings.darknetConfigURL}
              />
            </label>
            <label>
              Train/test split
              <p>Ratio of training to testing images in the output data</p>
              <SettingsInput
                name="darknetTrainTestRatio"
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={this.props.settings.darknetTrainTestRatio}
              />
            </label>
          </LabelBox>
        </form>
      </ModalDialog>
    );
  }
}
