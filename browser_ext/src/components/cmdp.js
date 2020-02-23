import React from "react";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import _ from "lodash";
import SearchResults from "./res";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Cancel";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Notabase from "notabase";


let nb = new Notabase();
nb.fetch('https://www.notion.so/gine/0a4155a50f6943e0bda2b6105cd41541?v=fe0a5e52a9ae4e1593e18307f98588a6');

console.log(nb);
const styles = theme => ({
  mydlg: {
    position: "absolute",
    top: 0
  },
  progress: {
    margin: theme.spacing.unit * 0
  },
  searchIcon: {
    position: "fixed",
    top: 0,
    right: 0,
    margin: "10px",
    "&:hover": {
      cursor: "pointer"
    }
  },
  cancelSearch: {
    "&:hover": {
      cursor: "pointer"
    }
  }
});

class FormDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      query: "",
      blockData: {
        recordMap: {},
        results: []
      },
      isSearchStarted: false,
      loading: false
    };
    this.searchBlog = _.debounce(this.searchBlog, 800);
  }

  onSearchChange = e => {
    this.setState(
      {
        query: e.target.value,
        loading: true
      },
      () => {
        const { query } = this.state;
        if (query.trim().length) {
          this.searchBlog(query);
        }
      }
    );
  };
  searchBlog = async query => {
    // 需要搭配后端 api 使用。构造自己的 url 格式
    let res = await this.search(query);
    this.setState({
      blockData: res,
      isSearchStarted: true,
      loading: false
    });
  };

  search = async query => {
    let data = {
      type: "BlocksInAncestor",
      query: query,
      ancestorId: "96ddd2d8-5957-49a8-ad55-282377ebb0df",
      filters: {
        isDeletedOnly: false,
        excludeTemplates: false,
        isNavigableOnly: false,
        requireEditPermissions: false,
        ancestors: [],
        createdBy: [],
        editedBy: [],
        lastEditedTime: {},
        createdTime: {}
      },
      sort: "Relevance",
      limit: 20,
      source: "quick_find_public"
    };
    return await nb.reqeust.post("/api/v3/search", data);
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({
      query: "",
      open: false,
      blockData: {
        recordMap: {},
        results: []
      },
      isSearchStarted: false,
      loading: false
    });
  };
  cancelSearch = () => {
    this.setState({
      query: "",
      blockData: {
        recordMap: {},
        results: []
      },
      loading: false
    });
  };
  componentDidMount() {
    window.addEventListener("keydown", e => {
      if (e.key === "i" && e.metaKey) {
        e.preventDefault();
        this.handleClickOpen();
      }
    });
  }

  render() {
    const { blockData, isSearchStarted, query, loading } = this.state;
    const { classes } = this.props;
    return (
      <>
        <SearchIcon
          color="inherit"
          aria-label="Search"
          variant="outlined"
          onClick={this.handleClickOpen}
          className={classes.searchIcon}
        />
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          id="mydlg"
          fullWidth
        >
          <DialogContent>
            <TextField
              autoFocus
              autoComplete="off"
              value={query}
              margin="dense"
              id="chromecantguess"
              onChange={this.onSearchChange}
              placeholder="command+p 打开搜索栏"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {loading ? (
                      <CircularProgress
                        className={classes.progress}
                        size={20}
                        color=""
                      />
                    ) : (
                      <SearchIcon />
                    )}
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <CloseIcon
                      style={{ color: "gray" }}
                      onClick={this.cancelSearch}
                      className={classes.cancelSearch}
                    />
                  </InputAdornment>
                )
              }}
            />

            {blockData && isSearchStarted && <SearchResults data={blockData} />}
          </DialogContent>
        </Dialog>
      </>
    );
  }
}
export default withStyles(styles)(FormDialog);
