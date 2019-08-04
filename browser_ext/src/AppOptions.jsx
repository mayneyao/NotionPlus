import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './AppOptions.css';

export default class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      serverHost: '',
      authToken: '',
      actionTableUrl: ''
    }
  }

  componentDidMount() {
    this.initSettings();
  }

  initSettings = async () => {
    const data = await browser.storage.sync.get(['serverHost', 'authToken', 'actionTableUrl']);

    const { serverHost, authToken, actionTableUrl } = data
    this.setState({
      serverHost,
      authToken,
      actionTableUrl
    });
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = () => {
    // const { serverHost, authToken, actionTableUrl } = this.state
    browser.storage.sync.set(this.state).then(() => {
      // console.log(serverHost, authToken, actionTableUrl);
      console.log(this.state)
    });
  }

  render() {
    const { serverHost, authToken, actionTableUrl } = this.state
    return (
      <div className="main" >
        <h1>服务器</h1>
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
        <h1>Notion</h1>
        <form noValidate autoComplete="off">
          <div>
            <TextField
              id="actionTableUrl"
              label="动态任务表格地址"
              className="textField"
              value={actionTableUrl}
              onChange={this.handleChange('actionTableUrl')}
              margin="normal"
              helperText="后端将在此表格下查找动态任务代码"
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