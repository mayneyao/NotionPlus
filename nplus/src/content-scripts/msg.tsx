import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { render } from 'react-dom'

export const showMsg = (msg: string) => {

  const msgBoxDiv = document.getElementById("NotionPlusMsg")
  if (msgBoxDiv) {
    msgBoxDiv.remove()
  }
  const reactRoot = document.createElement('div')
  reactRoot.setAttribute('id', 'NotionPlusMsg')
  document.body.append(reactRoot)
  render(React.createElement(Msg, { msg }), reactRoot)
}

export const Msg: React.FC<{ msg: string }> = ({ msg }) => {
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
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={msg}
      />
    </div>
  );
}
