import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/Description";


const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: 540,
    minwWidth: 180,
    maxWidth: "100%",
    height: "60vh",
    maxHeight: "70vh",
    backgroundColor: theme.palette.background.paper
  }
});

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

function makeSearchResultTree(recordMap, results) {
  let tree = {};
  const getParentBlock = blockID => {
    let thisBlock = recordMap.block[blockID].value;
    if (thisBlock.type === "page") {
      return thisBlock.id;
    } else {
      return getParentBlock(thisBlock.parent_id);
    }
  };
  results.map(blockID => {
    let thisBlock = recordMap.block[blockID].value;
    if (thisBlock.type === "page") {
      tree[blockID] = {
        title: thisBlock.properties.title[0][0],
        children: []
      };
    } else {
      let parentBlockID = getParentBlock(thisBlock.id);
      if (parentBlockID in tree) {
        tree[parentBlockID].children.push({
          title: thisBlock.properties.title[0],
          blockID: thisBlock.id
        });
      } else {
        let parentBlock = recordMap.block[parentBlockID].value;
        try {
          tree[parentBlockID] = {
            title: parentBlock.properties.title[0][0],
            children: [
              {
                title: thisBlock.properties.title[0],
                blockID: thisBlock.id
              }
            ]
          };
        } catch (error) {
          console.log(error);
        }
      }
    }
  });
  return tree;
}

function SimpleList(props) {
  const {
    classes,
    data: { recordMap, results }
  } = props;

  let tree = makeSearchResultTree(recordMap, results);

  return (
    <div className={classes.root}>
      {Boolean(results.length) ? (
        <List component="nav">
          {Object.entries(tree).map(item => {
            let [key, block] = item;
            let postSlug = key.split("-").join("");
            return (
              <div>
                <a href={`posts/${postSlug}`}>
                  <ListItem button>
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary={block.title} />
                  </ListItem>
                </a>
                {block.children.map(item => (
                  <a href={`posts/${postSlug}#${item.blockID}`}>
                    <ListItem button>
                      <div style={{ minWidth: 40, height: 40 }}></div>
                      <ListItemText primary={item.title} />
                    </ListItem>
                  </a>
                ))}
              </div>
            );
          })}
        </List>
      ) : (
        <span style={{ color: "gray" }}>搜不到啊😂</span>
      )}
    </div>
  );
}

SimpleList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleList);
