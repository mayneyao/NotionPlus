import React from 'react';
import './AppPopup.css';

export default class AppPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: ''
    };
  }

  componentDidMount() {
    this.initColor();
  }

  initColor = async () => {
    const data = await browser.storage.sync.get('color');

    this.setState({
      color: data.color
    });
  }

  handleButtonClick = async () => {
    const { color } = this.state;
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true
    });

    browser.tabs.executeScript(
      tabs[0].id,
      {
        code: `document.body.style.backgroundColor = "${color}";`
      }
    );
  }

  render() {
    const { color } = this.state;

    return (
      <div className="App">
        <button
          onClick={this.handleButtonClick}
          style={{
            backgroundColor: color
          }}
        />
      </div>
    )
  }
}
