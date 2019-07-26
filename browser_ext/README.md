This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) using the [browser-extension-react-scripts](https://github.com/gxvv/create-react-browser-extension).

## Available Scripts

In the project directory, you can run:

### `npm start [vendor]`

The vendor can be one of chrome, firefox, opera and edge. (default is chrome)<br>
Runs the app in the development mode.<br>
The compiler will generate a unpacked extension in the dev folder.<br>
The directory holding the manifest file can be added as an extension in developer mode in its current state.

#### e.g Chrome

1. Open the Extension Management page by navigating to chrome://extensions.
   - The Extension Management page can also be opened by clicking on the Chrome menu, hovering over More Tools then selecting Extensions.
2. Enable Developer Mode by clicking the toggle switch next to Developer mode.
3. Click the LOAD UNPACKED button and select the extension directory.

Open the popup to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build [vendor]`

Builds the packed extension for distribution to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your extension is ready to be distributed!

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React Browser Extension documentation](https://github.com/gxvv/create-react-browser-extension).

To learn React, check out the [React documentation](https://reactjs.org/).
