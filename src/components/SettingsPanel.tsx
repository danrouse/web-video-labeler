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

  handleInput = (evt: React.FormEvent<HTMLInputElement>) => {
    let value: any = evt.currentTarget.value;
    if (evt.currentTarget.type === 'checkbox') {
      value = evt.currentTarget.checked;
    } else if (evt.currentTarget.type === 'number' || evt.currentTarget.type === 'range') {
      value = parseFloat(value);
    }
    this.props.onChange({ [evt.currentTarget.name as any]: value });
  }

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
          <LabelBox label="Output" className="SettingsPanel__LabelBox">
            <label>
              Output Directory Name
              <p>
                Name of output data directory.<br />
                When saving locally, this will be nested underneath <code>Downloads/web-video-labeler</code>.<br />
                When saving to S3, this will be prefixed to object keys.
              </p>
              <SettingsInput
                name="outputDirName"
                type="text"
                value={this.props.settings.outputDirName}
                onChange={this.handleInput}
              />
            </label>
            <label>
              Output Format
              <p>Save annotations in each of the following formats:</p>
              <div className="SettingsPanel__radio-group">
                <label>
                  Darknet (YOLO)
                  <SettingsInput
                    name="saveDarknet"
                    type="checkbox"
                    checked={this.props.settings.saveDarknet}
                    onChange={this.handleInput}
                  />
                </label>
                <label>
                  Pascal VOC XML
                  <SettingsInput
                    name="savePascalVOCXML"
                    type="checkbox"
                    checked={this.props.settings.savePascalVOCXML}
                    onChange={this.handleInput}
                  />
                </label>
                <label>
                  Raw JSON
                  <SettingsInput
                    name="saveJSON"
                    type="checkbox"
                    checked={this.props.settings.saveJSON}
                    onChange={this.handleInput}
                  />
                </label>
              </div>
            </label>
            <label className="SettingsPanel__inline">
              <div>
                Save to S3?
                <p>Images and annotations will be saved to S3 instead of downloaded to your device.</p>
              </div>
              <SettingsInput
                name="saveToS3"
                type="checkbox"
                checked={this.props.settings.saveToS3}
                onChange={this.handleInput}
              />
            </label>
          </LabelBox>
          {this.props.settings.saveToS3 &&
            <LabelBox label="AWS Settings">
              <label>
                AWS Region
                <SettingsInput
                  name="s3AWSRegion"
                  type="text"
                  value={this.props.settings.s3AWSRegion}
                  onChange={this.handleInput}
                />
              </label>
              <label>
                Access Key ID
                <SettingsInput
                  name="s3AWSAccessKeyID"
                  type="text"
                  value={this.props.settings.s3AWSAccessKeyID}
                  onChange={this.handleInput}
                />
              </label>
              <label>
                Secret Access Key
                <SettingsInput
                  name="s3AWSSecretAccessKey"
                  type="text"
                  value={this.props.settings.s3AWSSecretAccessKey}
                  onChange={this.handleInput}
                />
              </label>
              <label>
                S3 Bucket
                <SettingsInput
                  name="s3AWSBucket"
                  type="text"
                  value={this.props.settings.s3AWSBucket}
                  onChange={this.handleInput}
                />
              </label>
            </LabelBox>
          }
          <LabelBox label="Downloading" className="SettingsPanel__LabelBox">
            <label className="SettingsPanel__inline">
              <div>
                Use object tracker?
                <p>Predicts moving objects and moves labels automatically.</p>
              </div>
              <SettingsInput
                name="useCorrelationTracker"
                type="checkbox"
                checked={this.props.settings.useCorrelationTracker}
                onChange={this.handleInput}
              />
            </label>
            <label className="SettingsPanel__inline">
              <div>
                Save images with no labels?
                <p>If there are no labels present on an image, it will not be downloaded.</p>
              </div>
              <SettingsInput
                type="checkbox"
                name="saveImagesWithoutLabels"
                onChange={this.handleInput}
                checked={this.props.settings.saveImagesWithoutLabels}
              />
            </label>
            <label className="SettingsPanel__inline">
              <div>
                Save cropped images?
                <p>When saving images, also crop and save each labeled region separately.</p>
              </div>
              <SettingsInput
                type="checkbox"
                name="saveCroppedImages"
                onChange={this.handleInput}
                checked={this.props.settings.saveCroppedImages}
              />
            </label>
            <label className="SettingsPanel__inline">
              <div>
                Downloaded image scale
                <p>Scale to resize images to when saving, from 0 - 1.</p>
              </div>
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
          <LabelBox label="Labeling" className="SettingsPanel__LabelBox">
            <label className="SettingsPanel__inline">
              <div>
                Frame Skip
                <p>How many frames to skip using playback controls.</p>
              </div>
              <SettingsInput
                type="number"
                step="1"
                min="1"
                value={this.props.settings.skipLength}
                name="skipLength"
                onChange={this.handleNumber}
              />
            </label>
            <label className="SettingsPanel__inline">
              <div>
                Frame Rate
                <p>Video frames per second, usually 24.</p>
              </div>
              <SettingsInput
                type="number"
                step={1}
                min={1}
                value={this.props.settings.skipLengthFrameRate}
                name="skipLengthFrameRate"
                onChange={this.handleNumber}
              />
            </label>
            <label className="SettingsPanel__inline">
              <div>
                Grid size
                <p>Size of background grid, scaled to video. Set to 0 to disable.</p>
              </div>
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
        </form>
      </ModalDialog>
    );
  }
}
