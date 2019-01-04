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

  handleRadio = (evt: React.FormEvent<HTMLInputElement>) => this.props.onChange({
    [evt.currentTarget.name as any]: evt.currentTarget.value,
  })

  render() {
    return (
      <ModalDialog
        title="Settings"
        onClose={this.props.onClose}
        className="SettingsPanel"
        buttons={[
          <button key="reset" onClick={this.props.onReset} title="Reset Settings">
            <i className="fas fa-trash" />
            <span>Reset</span>
          </button>,
          <button key="done" onClick={this.props.onClose} title="Done">
            <i className="fas fa-check" />
            <span>Done</span>
          </button>,
        ]}
      >
        <form onSubmit={this.props.onClose}>
          <LabelBox label="Labeling" className="SettingsPanel__LabelBox">
            <label>
              Frame Skip
              <p>How many frames to skip using playback controls.</p>
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
              <p>Video frames per second, usually 24.</p>
              <SettingsInput
                type="number"
                step={1}
                min={1}
                value={this.props.settings.skipLengthFrameRate}
                name="skipLengthFrameRate"
                onChange={this.handleNumber}
              />
            </label>
            <label>
              Grid size
              <p>Size of background grid, scaled to video. Set to 0 to disable.</p>
              <div className="SettingsPanel__range">
                <span>{this.props.settings.gridSize}</span>
                <SettingsInput
                  type="range"
                  step={1}
                  min={0}
                  max={64}
                  name="gridSize"
                  value={this.props.settings.gridSize}
                  onChange={this.handleNumber}
                />
              </div>
            </label>
          </LabelBox>
          <LabelBox label="Downloading" className="SettingsPanel__LabelBox">
            <label>
              Save images with no labels?
              <p>If there are no labels present on an image, it will not be downloaded.</p>
              <SettingsInput
                type="checkbox"
                name="saveImagesWithoutLabels"
                onChange={this.handleCheckbox}
                checked={this.props.settings.saveImagesWithoutLabels}
              />
            </label>
            <label>
              Save cropped images?
              <p>When saving images, also crop and save each labeled region separately.</p>
              <SettingsInput
                type="checkbox"
                name="saveCroppedImages"
                onChange={this.handleCheckbox}
                checked={this.props.settings.saveCroppedImages}
              />
            </label>
            <label>
              Downloaded image scale
              <p>Scale to resize images to when saving, from 0 - 1.</p>
              <div className="SettingsPanel__range">
                <span>{this.props.settings.savedImageScale}</span>
                <SettingsInput
                  name="savedImageScale"
                  type="range"
                  min={0.01}
                  max={1}
                  step={0.01}
                  onChange={this.handleNumber}
                  value={this.props.settings.savedImageScale}
                />
              </div>
            </label>
          </LabelBox>
          <LabelBox label="Output" className="SettingsPanel__LabelBox">
            <label>
              Format
              <p>Output data type</p>
              <div className="SettingsPanel__radio-group">
                <label>
                  Darknet/YOLO
                  <SettingsInput
                    name="outputFormat"
                    type="radio"
                    value="DARKNET"
                    checked={this.props.settings.outputFormat === 'DARKNET'}
                    onChange={this.handleRadio}
                  />
                </label>
                <label>
                  Pascal VOC XML
                  <SettingsInput
                    name="outputFormat"
                    type="radio"
                    value="PASCALVOCXML"
                    checked={this.props.settings.outputFormat === 'PASCALVOCXML'}
                    onChange={this.handleRadio}
                  />
                </label>
                <label>
                  Raw JSON
                  <SettingsInput
                    name="outputFormat"
                    type="radio"
                    value="JSON"
                    checked={this.props.settings.outputFormat === 'JSON'}
                    onChange={this.handleRadio}
                  />
                </label>
              </div>
            </label>
            <label>
              Train/test split
              <p>Ratio of training to testing images in the output data.</p>
              <div className="SettingsPanel__range">
                <span>{this.props.settings.trainTestRatio}</span>
                <SettingsInput
                  name="trainTestRatio"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={this.props.settings.trainTestRatio}
                />
              </div>
            </label>
            {this.props.settings.outputFormat === 'DARKNET' &&
              <div>
                <label>
                  Executable path
                  <p>Command to call <code>darknet</code> on your local machine.</p>
                  <SettingsInput
                    name="darknetExecutablePath"
                    type="text"
                    value={this.props.settings.darknetExecutablePath}
                  />
                </label>
                <label>
                  Config URL
                  <p>Base configuration for training and running the network.</p>
                  <SettingsInput
                    name="darknetConfigURL"
                    type="text"
                    value={this.props.settings.darknetConfigURL}
                  />
                </label>
              </div>
            }
          </LabelBox>
        </form>
      </ModalDialog>
    );
  }
}
