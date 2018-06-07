// @flow
import * as React from "react";
import ResizeObserver from "resize-observer-polyfill";
type Props = {
  render: Object => React.Node,
  container: React.Component<{
    innerRef: ?HTMLDivElement
  }>
};
type State = {
  clientRect: ?Object,
  resizeObserver: ?Object
};
export default class ClientRect extends React.Component<Props, State> {
  containerEl: ?HTMLDivElement;
  state: State = {
    clientRect: null,
    resizeObserver: null
  };
  componentDidMount() {
    const { containerEl } = this;
    if (!containerEl) {
      return;
    }
    const clientRect = containerEl.getBoundingClientRect();
    let hasFired = false;
    const resizeObserver = new ResizeObserver(entries => {
      if (!hasFired) {
        hasFired = true;
        return;
      }
      this.setState({ clientRect: null }, () => {
        this.setState({ clientRect: containerEl.getBoundingClientRect() });
        console.log("updating");
      });
    });
    resizeObserver.observe(window.document.body);
    this.setState({ resizeObserver, clientRect });
  }
  render() {
    const C = this.props.container;
    const { clientRect } = this.state;

    return (
      //$FlowFixMe
      <C innerRef={el => (this.containerEl = el)}>
        {clientRect && this.props.render(clientRect)}
      </C>
    );
  }
}
