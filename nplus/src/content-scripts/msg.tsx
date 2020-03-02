import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { render } from 'react-dom'


export enum MsgHorizontalType {
  left = 'left',
  right = 'right'
}

export const showMsg = (msg: string, horizontal: MsgHorizontalType = MsgHorizontalType.right) => {
  const msgDivId = horizontal === MsgHorizontalType.right ? 'NotionPlusUserMsg' : 'NotionPlusMsg'
  const msgBoxDiv = document.getElementById(msgDivId)
  if (msgBoxDiv) {
    msgBoxDiv.remove()
  }
  const reactRoot = document.createElement('div')
  reactRoot.setAttribute('id', msgDivId)
  document.body.append(reactRoot)
  render(React.createElement(Msg, { msg, horizontal }), reactRoot)
}

export const Msg: React.FC<{ msg: string, horizontal: MsgHorizontalType }> = ({ msg, horizontal }) => {
  const [open, setOpen] = React.useState(true);
  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    const msgMountNode = document.getElementById('NotionPlusMsg')
    if (msgMountNode) {
      msgMountNode.remove()
    }
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal,
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={msg}
      />
    </div>
  );
}
