/* eslint-disable no-use-before-define */
import React, { useEffect, useCallback, useRef, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { getAllActionCode, doAction } from '../core'
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { showMsg } from './msg';

export interface ActionCodeType {
  name: string;
}

const filter = createFilterOptions();
const MyAutocomplete = withStyles({
  root: {
    width: '100%!important',
    overflowX: 'hidden'
  },
})(Autocomplete as any);


const getNotionContext = () => {
  const pathNameList = window.location.pathname.split('/')
  const currentPageId = pathNameList[pathNameList.length - 1]
  const search = new URLSearchParams(window.location.search)
  const selectedRecordId = search.get('p')
  return {
    currentURL: window.location.href,
    currentPageId,
    selectedRecordId: selectedRecordId || undefined,
  }
}

const MyDialog = withStyles({
  root: {
    top: '-50vh!important',
  },
})(Dialog as any);

export default function FormDialog() {
  const [open, setOpen] = useState(false);
  const [actionCode, setActionCode] = useState({})
  const inputRef = useRef(null);
  const [value, setValue] = useState<ActionCodeType | null>(null);

  const handleClose = () => {
    setOpen(false);
    setValue(null);
  };


  const doActionWrapper = ({ actionName, actionParams }: any) => {
    console.log(actionCode, actions);
    console.log("ready to exec", actionName, actionParams)
    if (actionCode && actionCode[actionName]) {
      const notionContext = getNotionContext();
      doAction({
        actionName,
        actionParams,
        actionCode,
        blockID: notionContext.selectedRecordId,
      })
      showMsg(`Exec Action: ${actionName}`);
    } else {
      console.log(`Action: ${actionName} Not Found!`)
    }
    setOpen(false);
  }
  const actions = Object.entries(actionCode).map(item => ({ name: item[0] } as ActionCodeType))
  const handleUserKeyPress = useCallback((e: any) => {
    const isInExtApp = e.path.find((pnode: any) => {
      return pnode.getAttribute && pnode.getAttribute("class") && pnode.getAttribute("class").includes('Mui')
    })
    if (isInExtApp) {
      e.stopImmediatePropagation();
      if (e.key === "Escape") return setOpen(false);
    }
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case 'i':
          setOpen(!open);
          break
        default:
          return;
      }
    }
  }, [actionCode])

  useEffect(() => {
    const handleUserKeyPressListener = window.addEventListener("keydown", handleUserKeyPress, true)
    return () => {
      window.removeEventListener('keydown', handleUserKeyPressListener)
    };
  }, [])

  useEffect(() => {
    getAllActionCode().then(code => setActionCode(code));
  }, [])

  useEffect(() => {
    inputRef && inputRef.current && inputRef.current.focus();
  }, [inputRef])

  return (
    <MyDialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
      <MyAutocomplete
        value={value}
        onChange={(event: any, newValue: ActionCodeType | null) => {
          if (newValue && newValue.name) {
            setValue({
              name: newValue.name,
            });
            doActionWrapper({
              actionName: newValue.name,
              actionParams: []
            });
            setValue(null);
            setOpen(!open);
            return;
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params) as ActionCodeType[];
          // if (params.name !== '') {
          //   filtered.push({
          //     name: `Add "${params.name}"`,
          //   });
          // }
          return filtered;
        }}
        id="free-solo-with-text-demo"
        options={actions}
        getOptionLabel={option => {
          // e.g value selected with enter, right from the input
          if (typeof option === 'string') {
            return option;
          }
          return option.name;
        }}
        renderOption={option => option.name}
        style={{ width: 300 }}
        freeSolo
        renderInput={params => (
          <TextField
            {...params}
            variant="standard"
            margin="normal"
            fullWidth
            autoFocus
            onKeyPressCapture={(e) => {
              if (e.key === "Enter") {
                const inputArray = inputRef.current.value.split(' ')
                const action = inputArray[0]
                const params = inputArray.slice(1)
                doActionWrapper({
                  actionName: action,
                  actionParams: params
                });
              }
            }}
            inputRef={inputRef}
          />
        )}
      />
    </MyDialog>
  );
}
