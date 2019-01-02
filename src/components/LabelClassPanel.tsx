import * as React from 'react';
import ModalDialog from './ModalDialog';
import LabelClassSelector from './LabelClassSelector';

interface Props {
  labelClasses: string[];
  onClose: () => void;
  onChange: (labelClasses: string[]) => void;
}

export default class LabelClassPanel extends React.Component<Props> {
  state = {
    isAddFromListVisible: false,
  };

  addClass = (str: string) =>
    this.props.labelClasses.indexOf(str) === -1 &&
    this.props.onChange(this.props.labelClasses.concat([str]))

  removeClass = (str: string) =>
    this.props.onChange(this.props.labelClasses.filter(s => s !== str))

  toggleAddFromList = () =>
    this.setState({ isAddFromListVisible: !this.state.isAddFromListVisible })

  addFromList = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const textarea = evt.currentTarget[0] as HTMLTextAreaElement;
    const classes = textarea.value.split('\n').map(s => s.trim()).filter(s => s);
    if (classes.length) this.props.onChange(classes);
    this.setState({ isAddFromListVisible: false });
  }

  render() {
    return (
      <ModalDialog
        title="Classes"
        onClose={this.props.onClose}
        buttons={[
          <button onClick={this.toggleAddFromList} title="Add From List">
            <i className="fas fa-list-ol" />
            <span>Add From List</span>
          </button>,
          <button onClick={this.props.onClose} title="Done">
            <i className="fas fa-check" />
            <span>Done</span>
          </button>,
        ]}
      >
        <p>Right click a class to remove.</p>
        <LabelClassSelector
          classes={this.props.labelClasses}
          showIndex
          onAddClass={this.addClass}
          onRightClick={this.removeClass}
        />
        {this.state.isAddFromListVisible &&
          <ModalDialog title="Add Classes From List" onClose={this.toggleAddFromList}>
            <form onSubmit={this.addFromList} style={{ display: 'flex', flexDirection: 'column' }}>
              <textarea rows={16} defaultValue={this.props.labelClasses.join('\n')} />
              <button type="submit">Set Classes</button>
            </form>
          </ModalDialog>
        }
      </ModalDialog>
    );
  }
}
