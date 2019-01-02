import * as React from 'react';
import stringToColor from '../util/stringToColor';
import './LabelBox.css';

interface LabelBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  color?: string;
  onLabelClick?: () => void;
  getRef?: (ref: HTMLDivElement | null) => void;
}

export default function LabelBox({ label, color, getRef, onLabelClick, children, ...otherProps }: LabelBoxProps) {
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
        style={{ backgroundColor: dstColor }}
        onClick={onLabelClick}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
