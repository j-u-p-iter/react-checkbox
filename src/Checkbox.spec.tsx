import * as React from "react";
import { cleanup, fireEvent, render } from "react-testing-library";

import { Checkbox, TEST_ID } from ".";

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
        state = {
          isChecked: false
        };

        handleChange = ({ currentTarget: { checked } }: any) => {
          this.setState({
            isChecked: checked
          });
        };

        render() {
          const { isChecked } = this.state;

          return (
            <Checkbox
              name="checkbox"
              label="Some label"
              onChange={this.handleChange}
              isChecked={isChecked}
            />
          );
        }
      }

      ControlledCheckbox = Controlled;
    });

    it("updates state on Checkbox correctly", () => {
      const { getByTestId } = render(<ControlledCheckbox />);

      fireEvent.click(getByTestId(TEST_ID));

      expect((getByTestId(TEST_ID) as HTMLInputElement).checked).toBe(true);

      fireEvent.click(getByTestId(TEST_ID));

      expect((getByTestId(TEST_ID) as HTMLInputElement).checked).toBe(false);
    });
  });

  describe("in self controlled mode", () => {
    it("calls onChange with correct argument", () => {
      const onChange = jest.fn();

      const { getByTestId } = render(
        <Checkbox name="checkbox" label="Some label" onChange={onChange} />
      );

      fireEvent.click(getByTestId(TEST_ID));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0].currentTarget).toBeDefined();

      fireEvent.click(getByTestId(TEST_ID));

      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange.mock.calls[0][0].currentTarget).toBeDefined();
    });
  });

  describe("without onChange callback", () => {
    it("doesn't throw error", () => {
      const { getByTestId } = render(
        <Checkbox name="checkbox" label="Some label" />
      );

      fireEvent.click(getByTestId(TEST_ID));

      expect((getByTestId(TEST_ID) as HTMLInputElement).checked).toBe(true);

      fireEvent.click(getByTestId(TEST_ID));

      expect((getByTestId(TEST_ID) as HTMLInputElement).checked).toBe(false);
    });
  });
});
