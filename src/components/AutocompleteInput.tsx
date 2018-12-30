import * as React from 'react';

type AutocompleteChangeHandler = (evt: React.SyntheticEvent<HTMLElement>, str?: string) => void;

interface Props extends React.HTMLProps<HTMLInputElement> {
  suggestions?: string[];
  inputClassName?: string;
  inputStyle?: React.CSSProperties;
  onChange: AutocompleteChangeHandler;
  onFocus?: React.FocusEventHandler;
  onBlur?: React.FocusEventHandler;
}

interface State {
  hasFocus: boolean;
  hasHover: boolean;
}

export default class AutocompleteInput extends React.Component<Props, State> {
  ref?: HTMLInputElement;

  state: State = {
    hasFocus: false,
    hasHover: false,
  };

  handleFocus = (evt: React.FocusEvent<HTMLInputElement>) => {
    this.setState({ hasFocus: true });
    if (this.props.onFocus) this.props.onFocus(evt);
  };

  handleBlur = (evt: React.FocusEvent<HTMLInputElement>) => {
    this.setState({ hasFocus: false });
    if (this.props.onBlur) this.props.onBlur(evt);
  };

  handleKeyDown = (evt: React.KeyboardEvent) => {
    if ((evt.key === 'Escape' || evt.key === 'Enter') && this.ref) {
      this.ref.blur();
    }
  };

  handleSuggestionClick = (evt: React.MouseEvent<HTMLElement>) => {
    this.props.onChange(evt, evt.currentTarget.dataset.suggestion);
    this.setState({ hasHover: false });
    if (this.ref) this.ref.blur();
    evt.stopPropagation();
    evt.preventDefault();
  };

  handleListMouseEnter = () => this.setState({ hasHover: true });
  handleListMouseLeave = () => this.setState({ hasHover: false });

  render() {
    const {
      className, inputClassName, style, inputStyle, suggestions,
      onFocus, onBlur, // props to ignore
      ...inputProps
    } = this.props;
    const filteredSuggestions = suggestions && suggestions.filter(s => s !== this.props.value);
    return (
      <div className={className} style={style}>
        <input
          {...inputProps}
          ref={(ref) => ref && (this.ref = ref)}
          className={inputClassName}
          style={inputStyle}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
        />
        {(this.state.hasFocus || this.state.hasHover) && filteredSuggestions &&
          <ul
            style={{
              margin: 0,
              padding: 0,
              width: this.ref ? this.ref.offsetWidth : 'auto',
              listStyle: 'none',
              backgroundColor: 'white',
              color: 'black',
              pointerEvents: 'all',
            }}
            onMouseEnter={this.handleListMouseEnter}
            onMouseLeave={this.handleListMouseLeave}
          >
            {filteredSuggestions.map(suggestion =>
              <li
                key={suggestion}
                data-suggestion={suggestion}
                onClick={this.handleSuggestionClick}
                style={{
                  padding: 2,
                  cursor: 'pointer',
                }}
              >
                {suggestion}
              </li>
            )}
          </ul>
        }
      </div>
    );
  }
}
