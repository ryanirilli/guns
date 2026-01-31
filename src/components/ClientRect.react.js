
import * as React from "react";
import ResizeObserver from "resize-observer-polyfill";

export default class ClientRect extends React.Component {
  containerEl;
  state = {
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
      });
    });
    resizeObserver.observe(window.document.body);
    this.setState({ resizeObserver, clientRect });
  }
  componentWillUnmount() {
    const { resizeObserver } = this.state;
    resizeObserver && resizeObserver.disconnect();
  }
  render() {
    const C = this.props.container;
    const { clientRect } = this.state;

    return (

      <C innerRef={el => (this.containerEl = el)}>
        {clientRect && this.props.render(clientRect)}
      </C>
    );
  }
}
