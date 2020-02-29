import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default function Settings() {
  const initState = {
    serverHost: '',
    authToken: '',
    actionTableUrl: ''
  }
  const [settings, setSettings] = useState(initState)

  useEffect(() => {
    initSettings()
  }, [])

  const initSettings = async () => {
    const data = await browser.storage.sync.get(['serverHost', 'authToken', 'actionTableUrl']);

    const { serverHost, authToken, actionTableUrl } = data
    setSettings({
      serverHost,
      authToken,
      actionTableUrl
    });
  }

  const handleChange = (name: any) => (event: any) => {
    setSettings({ ...settings, [name]: event!.target!.value });
  };

  const handleSubmit = () => {
    // const { serverHost, authToken, actionTableUrl } = this.state
    browser.storage.sync.set(settings).then(() => {
      // console.log(serverHost, authToken, actionTableUrl);
      console.log(settings)
    });
  }
  const { serverHost, authToken, actionTableUrl } = settings

  return <div className="main" >
    <h1>Notion</h1>
    <form noValidate autoComplete="off">
      <div>
        <TextField
          id="actionTableUrl"
          label="actionTableUrl"
          className="textField"
          value={actionTableUrl}
          onChange={handleChange('actionTableUrl')}
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
          onChange={handleChange('serverHost')}
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
          onChange={handleChange('authToken')}
          margin="normal"
          helperText="Same as `conf.ini > security > auth_token`"
          fullWidth
        />
      </div>
    </form>
    <Button color="primary" fullWidth onClick={handleSubmit}>
      Save
    </Button>
  </div>
}