import React, { Component } from "react";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from "@material-ui/core";

import getWeb3 from "./utils/getWeb3";
import CryptoSpatialCoordinateContract from "./contracts/CryptoSpatialCoordinate.json";

import MainAppBar from './components/MainAppBar';
import MainMap from './components/MainMap';
import MainDrawer from './components/MainDrawer';


const theme = createMuiTheme({
  palette: {
    type: 'light', // dark
  },
});

class App extends Component {

  /**
   * @notice state variables 
   */

  state = {
    web3: null,
    accounts: null,
    contract: null,
    drawerOpen: false,
  }

  /**
   * @notice componentDidMount
   * 
   */

  componentDidMount = async () => {

    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const deployedCSC = CryptoSpatialCoordinateContract.networks[networkId];
      const instanceCSC = new web3.eth.Contract(
        CryptoSpatialCoordinateContract.abi,
        deployedCSC && deployedCSC.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instanceCSC });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  /**
   * @notice openDrawer
   */

  openDrawer = (evt) => {
    this.setState({ drawerOpen: true });
  };

  /**
   * @notice closeDrawer
   */
  closeDrawer = (evt) => {
    this.setState({ drawerOpen: false });
  };

  /**
   * @notice toggleDrawer close/open the main side Drawer
   */
  toggleDrawer = (evt) => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  };

  /**
   * @notice updateFeatureIndex
   */

  updateFeatureIndex = (evt) => {
    this.mainMap.updateFeatureIndex();
  };

  /** 
   * @notice render the component 
   */

  render() {
    return (
      <div className="App">
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <MainDrawer drawerOpen={this.state.drawerOpen}
            closeDrawer={this.closeDrawer}
          />
          <MainAppBar toggleDrawer={this.toggleDrawer} 
                      updateFeatureIndex={this.updateFeatureIndex}
                      />
          <MainMap  onRef={ref => (this.mainMap = ref)} />
        
        </ThemeProvider>
      </div>
    );
  }
}

export default App;