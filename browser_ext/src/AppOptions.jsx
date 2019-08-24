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
        <h1>Notion</h1>
        <form noValidate autoComplete="off">
          <div>
            <TextField
              id="actionTableUrl"
              label="actionTableUrl"
              className="textField"
              value={actionTableUrl}
              onChange={this.handleChange('actionTableUrl')}
              margin="normal"
              helperText="Where dynamic task code is (a notion table browser url)"
              fullWidth
            />
          </div>
        </form>
        <h1>ServerHost (Optional)</h1>
        <span> If you write task code in Python, you need to configure this</span>
        <form noValidate autoComplete="off">
          <div>
            <TextField
              id="serverHost"
              label="serverHost"
              className="textField"
              value={serverHost}
              onChange={this.handleChange('serverHost')}
              margin="normal"
              helperText="If you run the backend service locally, it should be http://127.0.0.1:5000"
              fullWidth
            />
          </div>
          <div>
            <TextField
              id="authToken"
              label="authToken"
              className="textField"
              value={authToken}
              onChange={this.handleChange('authToken')}
              margin="normal"
              helperText="Same as `conf.ini > security > auth_token`"
              fullWidth
            />
          </div>
        </form>
        <Button color="primray" fullWidth onClick={this.handleSubmit}>
          Save
        </Button>
      </div>)
  }
}