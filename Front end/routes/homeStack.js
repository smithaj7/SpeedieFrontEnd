import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
//import Login from "../app/assets/Screens/WelcomeScreen";
import Login from "../app/assets/Screens- Front end/WelcomeScreen";
import AllOrders from "../app/assets/Screens- Front end/AllOrders";
import NewOrder from "../app/assets/Screens- Front end/NewOrder";
import Inventory from "../app/assets/Screens- Front end/Inventory";
//import ResetInventory from "../app/assets/Screens- Front end/ResetInventory";
//import AddInventory from "../app/assets/Screens- Front end/AddInventory";
import MiaOrders from "../app/assets/Screens- Front end/MiaOrders";
import NolaOrders from "../app/assets/Screens- Front end/NolaOrders";
import ChiOrders from "../app/assets/Screens- Front end/ChiOrders";

const screens = {
  Login: {
    screen: Login,
  },
  AllOrders: {
    screen: AllOrders,
  },
  MiaOrders: {
    screen: MiaOrders,
  },
  NolaOrders: {
    screen: NolaOrders,
  },
  ChiOrders: {
    screen: ChiOrders,
  },
  NewOrder: {
    screen: NewOrder,
  },
  MiaNewOrders: {
    screen: MiaOrders,
  },
  Inventory: {
    screen: Inventory,
  },
  
};
const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
