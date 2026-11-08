import type * as React from 'react';

export type IconName = 'arrow-right' | 'chevron-down' | 'download' | 'file-text' | 'search' | 'wifi' | 'check' | 'x' | 'info' | 'triangle-alert' | 'circle-x' | 'scissors' | 'plus' | 'minus' | 'phone';

export interface IconProps { name: IconName; size?: 16 | 18 | 20 | number; label?: string; className?: string }
export declare function Icon(props: IconProps): React.ReactElement;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary: the one red action per screen. secondary: outlined. quiet: on surface. link: underlined text. */
  variant?: 'primary' | 'secondary' | 'quiet' | 'link';
  /** lg 48px (site), md 40px (compact site), sm 32px (software). */
  size?: 'lg' | 'md' | 'sm';
  icon?: IconName;
  iconAfter?: IconName;
  /** Renders an <a> instead of a <button>. */
  href?: string;
}
export declare function Button(props: ButtonProps): React.ReactElement;

export interface ToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  /** alarm: red when on (mute). ink: dark fill when on (polarity). */
  tone?: 'alarm' | 'ink';
  /** Accessible name, e.g. "Без звука, выход 3". */
  label: string;
}
export declare function ToggleButton(props: ToggleButtonProps): React.ReactElement;

export interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  help?: string;
  /** Replaces help and marks the input invalid. Name the problem and the fix. */
  error?: string;
  multiline?: boolean;
  rows?: number;
  /** lg 48px (site), sm 36px (software). */
  size?: 'lg' | 'sm';
}
export declare function Field(props: FieldProps): React.ReactElement;

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<string | { value: string; label: string }>;
  help?: string;
  size?: 'lg' | 'sm';
}
export declare function Select(props: SelectProps): React.ReactElement;

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> { label: string }
export declare function Checkbox(props: CheckboxProps): React.ReactElement;

export interface SwitchProps { label: string; checked?: boolean; defaultChecked?: boolean; onChange?: (on: boolean) => void; className?: string }
export declare function Switch(props: SwitchProps): React.ReactElement;

export interface SegmentedOption<T> { value: T; label: React.ReactNode }
export interface SegmentedProps<T = string> {
  label?: string;
  /** Accessible name when there is no visible label. */
  ariaLabel?: string;
  options: SegmentedOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  size?: 'lg' | 'sm';
  className?: string;
}
export declare function Segmented<T = string>(props: SegmentedProps<T>): React.ReactElement;

export interface TabsProps { items: Array<{ label: string; href?: string; current?: boolean; onClick?: React.MouseEventHandler }>; label?: string; density?: 'site' | 'app'; className?: string }
export declare function Tabs(props: TabsProps): React.ReactElement;

export interface BreadcrumbProps { items: Array<{ label: string; href?: string }>; className?: string }
export declare function Breadcrumb(props: BreadcrumbProps): React.ReactElement;

export interface SectionProps { title: string; description?: React.ReactNode; aside?: React.ReactNode; id?: string; children?: React.ReactNode; className?: string }
export declare function Section(props: SectionProps): React.ReactElement;

export interface ProductRowProps {
  name: string;
  href?: string;
  /** Front-panel photo on white. Rack units are shown at one width. */
  image?: string;
  imageAlt?: string;
  /** Non-rack products (modules, tube heads): photo at 200px height instead of full width. */
  boxed?: boolean;
  summary?: string;
  spec?: string;
  /** Formatted price, e.g. "199 900 ₽" or "от 70 000 ₽". Omit for "По запросу". */
  price?: string | null;
  priceNote?: string;
  className?: string;
}
export declare function ProductRow(props: ProductRowProps): React.ReactElement;

export interface SpecRow { label: React.ReactNode; value: React.ReactNode }
export interface SpecTableProps {
  caption?: string;
  rows?: SpecRow[];
  groups?: Array<{ title: string; rows: SpecRow[] }>;
  /** site 16px, print 13px (9.5pt), app 14px. */
  density?: 'site' | 'print' | 'app';
  className?: string;
}
export declare function SpecTable(props: SpecTableProps): React.ReactElement;

export interface StatusProps { tone?: 'ok' | 'warn' | 'danger' | 'off'; size?: 'md' | 'sm'; children: React.ReactNode; className?: string }
export declare function Status(props: StatusProps): React.ReactElement;

export interface TagProps { children: React.ReactNode; className?: string }
export declare function Tag(props: TagProps): React.ReactElement;

export interface NoticeProps { tone?: 'info' | 'warn' | 'error'; title?: string; size?: 'md' | 'sm'; children: React.ReactNode; className?: string }
export declare function Notice(props: NoticeProps): React.ReactElement;

export interface ParamCellProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  /** The stage does nothing (Выкл., Норм., 0,00 мс): shown in ink-3. */
  off?: boolean;
}
export declare function ParamCell(props: ParamCellProps): React.ReactElement;

export interface MeterProps {
  /** Signal level in dB below full scale, e.g. -12. Above -3 shows "перегрузка". */
  level: number;
  width?: number;
  muted?: boolean;
  showValue?: boolean;
  className?: string;
}
export declare function Meter(props: MeterProps): React.ReactElement;

declare global {
  interface Window {
    Nag: {
      Button: typeof Button; ToggleButton: typeof ToggleButton; Field: typeof Field; Select: typeof Select;
      Checkbox: typeof Checkbox; Switch: typeof Switch; Segmented: typeof Segmented; Tabs: typeof Tabs;
      Breadcrumb: typeof Breadcrumb; Section: typeof Section; ProductRow: typeof ProductRow; SpecTable: typeof SpecTable;
      Status: typeof Status; Tag: typeof Tag; Notice: typeof Notice; ParamCell: typeof ParamCell; Meter: typeof Meter; Icon: typeof Icon;
    };
  }
}
