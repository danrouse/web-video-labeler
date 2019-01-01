import * as React from 'react';
import ModalDialog from './ModalDialog';
import LabelClassSelector from './LabelClassSelector';

interface Props {
  labelClasses: string[];
  onClose: () => void;
  onChange: (labelClasses: string[]) => void;
}

export default class LabelClassPanel extends React.Component<Props> {
  addClass = (str: string) =>
    this.props.labelClasses.indexOf(str) === -1 &&
    this.props.onChange(this.props.labelClasses.concat([str]))

  removeClass = (str: string) =>
    this.props.onChange(this.props.labelClasses.filter(s => s !== str))

  render() {
    return (
      <ModalDialog onClose={this.props.onClose}>
        <LabelClassSelector
          classes={this.props.labelClasses}
          showIndex
          onAddClass={this.addClass}
          onRightClick={this.removeClass}
        />
      </ModalDialog>
    );
  }
}
