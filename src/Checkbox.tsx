import * as React from "react";

interface Props {
  name: string;
  label?: string;
  containerClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
  defaultIsChecked?: boolean;
  isChecked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  iconEl?: React.ReactNode;
}

type AnyProp = keyof Props;

interface DefaultProps {
  defaultIsChecked: boolean;
  disabled: boolean;
  onChange: (event: any) => void;
}

type PropsWithDefault = Props & DefaultProps;

interface State {
  isChecked: boolean;
}

export class Checkbox extends React.PureComponent<Props, State> {
  static defaultProps: DefaultProps = {
    defaultIsChecked: false,
    onChange: () => {},
    disabled: false
  };

  isControlled = (prop: AnyProp) => prop in this.props;

  state: State = {
    isChecked: (this.props as PropsWithDefault).defaultIsChecked
  };

  // We don't write props value to state, when we deal with controlled components.
  // When props are changed - component will be rerendered with new prop value.
  // So, we just take this new value and use in `render` method.
  getState(): State {
    return (Object.keys(this.state) as Array<keyof State>).reduce(
      (resultState: State, stateProp: keyof State) => {
        const stateFromProps = this.props[stateProp];
        const stateFromState = this.state[stateProp];

        resultState[stateProp] = this.isControlled(stateProp)
          ? (stateFromProps as boolean)
          : stateFromState;

        return resultState;
      },
      this.state
    );
  }

  handleChange = (event: any) => {
    const {
      currentTarget: { checked }
    } = event;
    const { onChange } = this.props as PropsWithDefault;

    if (this.isControlled("isChecked")) {
      onChange(event);
    } else {
      this.setState(
        {
          isChecked: checked
        },
        () => onChange(event)
      );
    }
  };

  render() {
    const { isChecked } = this.getState();
    const {
      label,
      containerClassName,
      disabled,
      iconEl,
      iconClassName,
      labelClassName,
      name
    } = this.props;

    return (
      <label className={containerClassName}>
        <input
          name={name}
          type="checkbox"
          checked={isChecked}
          onChange={this.handleChange}
          disabled={disabled}
          data-testid="checkbox"
        />
        {iconEl ? <span className={iconClassName}>{iconEl}</span> : null}
        {label ? <span className={labelClassName}>{label}</span> : null}
      </label>
    );
  }
}
