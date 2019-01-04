import * as React from 'react';
import stringToColor from '../util/stringToColor';
import './LabelBox.css';

interface LabelBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  color?: string;
  buttons?: JSX.Element[];
  onLabelClick?: () => void;
  getRef?: (ref: HTMLDivElement | null) => void;
}

export default function LabelBox({
  label,
  color,
  getRef,
  onLabelClick,
  buttons,
  children,
  ...otherProps
}: LabelBoxProps) {
  const dstColor = color || stringToColor(label);
  return (
    <div
      {...otherProps}
      className={`LabelBox ${otherProps.className || ''}`}
      style={{ ...(otherProps.style || {}), borderColor: dstColor }}
      ref={ref => ref && getRef && getRef(ref)}
    >
      <div
        className="LabelBox__label"
      >
        {buttons && <div className="LabelBox__buttons" style={{ color: dstColor }}>{buttons}</div>}
        <div
          className="LabelBox__label-text"
          style={{ backgroundColor: dstColor, cursor: onLabelClick ? 'pointer' : 'normal' }}
          onClick={onLabelClick}
        >
          {label}
        </div>
      </div>
      {children}
    </div>
  );
}
