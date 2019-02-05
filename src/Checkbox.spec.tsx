import * as React from "react";
import { cleanup, fireEvent, render } from "react-testing-library";

import { Checkbox } from ".";

describe("Checkbox", () => {
  afterEach(cleanup);

  it("renders properly by default", () => {
    const { container } = render(<Checkbox name="some-name" />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders properly with all props", () => {
    const props = {
      label: "Some label",
      containerClassName: "container-class-name",
      iconClassName: "icon-class-name",
      labelClassName: "label-class-name",
      defaultIsChecked: true,
      onChange: () => {},
      disabled: true,
      iconEl: <span>Some icon</span>,
      name: "checkbox"
    };
    const { container } = render(<Checkbox {...props} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  describe("in controlled mode", () => {
    let ControlledCheckbox: any;

    beforeEach(() => {
      class Controlled extends React.PureComponent<any> {
        public state = {
          isChecked: false
        };

        public handleChange = ({ currentTarget: { checked } }: any) => {
          this.setState({
            isChecked: checked
          });
        };

        public render() {
          const { isChecked } = this.state;

          return (
            <>
              <Checkbox
                name="checkbox"
                label="Some label"
                onChange={this.handleChange}
                isChecked={isChecked}
              />
            </>
          );
        }
      }

      ControlledCheckbox = Controlled;
    });

    it("calls onChange with correct argument", () => {
      const { getByTestId } = render(<ControlledCheckbox />);

      fireEvent.click(getByTestId("checkbox"));

      expect((getByTestId("checkbox") as HTMLInputElement).checked).toBe(true);

      fireEvent.click(getByTestId("checkbox"));

      expect((getByTestId("checkbox") as HTMLInputElement).checked).toBe(false);
    });
  });

  describe("in self controlled mode", () => {
    it("calls onChange with correct argument", () => {
      const onChange = jest.fn();

      const { getByTestId } = render(
        <Checkbox name="checkbox" label="Some label" onChange={onChange} />
      );

      fireEvent.click(getByTestId("checkbox"));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0].currentTarget).toBeDefined();

      fireEvent.click(getByTestId("checkbox"));

      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange.mock.calls[0][0].currentTarget).toBeDefined();
    });
  });

  describe("works properly without onChange callback", () => {
    it("calls onChange with correct argument", () => {
      const { getByTestId } = render(
        <Checkbox name="checkbox" label="Some label" />
      );

      fireEvent.click(getByTestId("checkbox"));

      expect((getByTestId("checkbox") as HTMLInputElement).checked).toBe(true);

      fireEvent.click(getByTestId("checkbox"));

      expect((getByTestId("checkbox") as HTMLInputElement).checked).toBe(false);
    });
  });
});
