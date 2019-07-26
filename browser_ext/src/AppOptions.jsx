import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './AppOptions.css';

export default class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      serverHost: '',
      authToken: ''
    }
  }

  componentDidMount() {
    this.initSettings();
  }

  initSettings = async () => {
    const data = await browser.storage.sync.get(['serverHost', 'authToken']);

    const { serverHost, authToken } = data
    this.setState({
      serverHost,
      authToken
    });
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = () => {
    const { serverHost, authToken } = this.state
    browser.storage.sync.set({ serverHost, authToken }).then(() => {
      console.log(serverHost, authToken);
    });
  }

  render() {
    const { serverHost, authToken } = this.state
    return (
      <div className="main" >
        <h1>服务器设置</h1>
        <form noValidate autoComplete="off">
          <div>
            <TextField
              id="serverHost"
              label="服务器接口"
              className="textField"
              value={serverHost}
              onChange={this.handleChange('serverHost')}
              margin="normal"
              fullWidth
            />
          </div>
          <div>
            <TextField
              id="authToken"
              label="安全码"
              className="textField"
              value={authToken}
              onChange={this.handleChange('authToken')}
              margin="normal"
              helperText="与后端 conf.ini > security > auth_token 保持一致"
              fullWidth
            />
          </div>
        </form>
        <Button color="primray" fullWidth onClick={this.handleSubmit}>
          保存
        </Button>
      </div>)
  }
}