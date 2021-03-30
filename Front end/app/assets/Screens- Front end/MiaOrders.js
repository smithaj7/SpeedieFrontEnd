import React, { useState } from "react";
import { DataTable, RadioButton, Searchbar } from "react-native-paper";
import {
  StyleSheet,
  View,
  Button,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import navigation from "react-navigation";

//import {useRoute} from '@react-navigation/native'
//import Home from "./WelcomeScreen";

//import { render } from "react-dom";

//export default class App extends React.Component {
const rowsPerPage = 2;

// const { params } = this.props.navigation.state;
// var user = params.user;
// console.log(user);



export default class MiaOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      page: 0,
      searchText: "",
      orderStatus: "A",
      newName: "",
      newPhone: "",
      newDeliveryDate: "",
      newAddress: "",
      newQuantity: 0,
    };

    this.newOrderPressHandler = this.newOrderPressHandler.bind(this);
    this.inventoryPressHandler = this.inventoryPressHandler.bind(this);
    this.fillOrder = this.fillOrder.bind(this);
    this.refreshScreen = this.refreshScreen.bind(this);
    this.archivedPressHandler = this.archivedPressHandler.bind(this);
    this.addOrderPressHandler = this.addOrderPressHandler.bind(this);
    this._handleAccountPress = this._handleAccountPress.bind(this);
    this.infoPress = this.infoPress.bind(this);
  }

  componentDidMount() {
    this.getData();
    this.willFocusSubscription = this.props.navigation.addListener(
      "willFocus",
      () => {
        this.getData();
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  getData = async () => {
    return fetch("http://localhost:7071/api/HttpTrigger1", {
      method: "POST",
      body: JSON.stringify({
        location: this.props.navigation.state.params.location,
        //orderStatus: this.state.orderStatus,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          dataSource: [responseJson],
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onChangeSearch = async (text) => {
    await this.setState({ searchText: text });
    return fetch("http://localhost:7071/api/HttpTrigger1", {
      method: "POST",
      body: JSON.stringify({
        location: this.props.navigation.state.params.location,
        searchText: text,
        //orderStatus: this.state.orderStatus,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          dataSource: [responseJson],
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addOrderPressHandler() {
    return fetch("http://localhost:7071/api/AddOrder", {
      method: "POST",
      body: JSON.stringify({
        name: this.state.newName,
        phone: this.state.newPhone,
        location: this.props.navigation.state.params.loc,
        deliveryDate: this.state.newDeliveryDate,
        address: this.state.newAddress,
        quantity: this.state.newQuantity,
      }),
    })
      .catch((error) => {
        console.log(error);
      })
      .then(this.refreshScreen);
  }
  newOrderPressHandler() {
    this.props.navigation.navigate("NewOrder");
  }

  archivedPressHandler = async () => {
    await this.setState({ orderStatus: "I" });
    return this.getData();
  };

  outstandingPressHandler = async () => {
    await this.setState({ orderStatus: "A" });
    return this.getData();
  };

  _handleAccountPress(){
    const { params } = this.props.navigation.state;
    var email = params.user;
    var loc = params.location;
    var employeeRole = params.role;
    this.props.navigation.navigate("AccountInfo", {user: email, location: loc, role: employeeRole});
  }

  inventoryPressHandler() {
    this.props.navigation.navigate("Inventory", {user: email, location: loc, role: employeeRole});
  }

  infoPress(){

  }

  refreshScreen = () => {
    this.getData();
  };


  fillOrder(i, orderStatus) {
    const { params } = this.props.navigation.state;
    var user = params.user;
    return fetch("http://localhost:7071/api/FillOrder", {
      method: "POST",
      body: JSON.stringify({
        location: this.props.navigation.state.params.location,
        orderNumber: i + 1,
        newStatus: orderStatus,
        filledBy: user,
        bottlesReturned: 1,
      }),
    }).then(this.refreshScreen);
  }

  render() {
   //const route = useRoute()
    //console.log(this.props.navigation.state.params.user);
    
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1 }}>
          <ActivityIndicator />
        </View>
      );
    } else {
      var orders = [];
      var arrLength;
      this.state.dataSource.map((val, key) => {
        arrLength = val.phoneNumbers.length;
      });
      for (let i = 0; i < arrLength; i++) {
        orders.push(
          this.state.dataSource.map((val, index) => {
            if (i % 2 == 1) {
              if (val.orderStatuses[i] == "A") {
                return (
                  <DataTable.Row style={{ backgroundColor: "#D3D3D3" }} key={i}>
                    {/* <DataTable.Cell>{i + 1}</DataTable.Cell> */}
                    <DataTable.Cell style={{flex: .2}} >
                      <TouchableOpacity
                      style={styles.infoButton}
                      onPress={this.infoPress}>
                        <Text style={{color: "blue", fontWeight: "bold"}}>+</Text>
                      </TouchableOpacity>
                    </DataTable.Cell>
                    <DataTable.Cell style={{flex: .5}} >{val.deliveryDates[i]}</DataTable.Cell>
                    {/* <DataTable.Cell style={{flex: 1}}>{val.names[i]}</DataTable.Cell> */}
                    {/* <DataTable.Cell>{val.phoneNumbers[i]}</DataTable.Cell>*/}
                    <DataTable.Cell style={{flex: 1}} >{val.addresses[i]}</DataTable.Cell> 
                    {/* <DataTable.Cell>{val.quantities[i]}</DataTable.Cell> */}
                    <DataTable.Cell style={{flex: .3}}>
                      <TouchableOpacity
                        style={styles.editOrder}
                        onPress={this.fillOrder.bind(this, i, "I")}
                      >
                        <Text style={styles.editText}>Claim</Text>
                      </TouchableOpacity>
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              } else {
                return (
                  <DataTable.Row style={{ backgroundColor: "#D3D3D3" }} key={i}>
                    {/* <DataTable.Cell>{i + 1}</DataTable.Cell> */}
                    <DataTable.Cell style={{flex: .2}} >
                      <TouchableOpacity
                      style={styles.infoButton}
                      onPress={this.infoPress}>
                        <Text style={{color: "blue", fontWeight: "bold"}}>+</Text>
                      </TouchableOpacity>
                    </DataTable.Cell>
                    <DataTable.Cell style={{flex: .5}} >{val.deliveryDates[i]}</DataTable.Cell>
                    {/* <DataTable.Cell style={{flex: 1}}>{val.names[i]}</DataTable.Cell> */}
                    {/* <DataTable.Cell>{val.phoneNumbers[i]}</DataTable.Cell>*/}
                    <DataTable.Cell style={{flex: 1}} >{val.addresses[i]}</DataTable.Cell> 
                    {/* <DataTable.Cell>{val.quantities[i]}</DataTable.Cell> */}
                    <DataTable.Cell style={{flex: .3}}>
                      <TouchableOpacity
                        style={styles.reopenOrder}
                        onPress={this.fillOrder.bind(this, i, "C")}
                      >
                        <Text style={styles.editText}>Close</Text>
                      </TouchableOpacity>
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              }
            } else {
              if (val.orderStatuses[i] == "A") {
                return (
                  <DataTable.Row style={{ backgroundColor: "white" }} key={i}>
                    {/* <DataTable.Cell>{i + 1}</DataTable.Cell> */}
                    <DataTable.Cell style={{flex: .2}} >
                      <TouchableOpacity
                      style={styles.infoButton}
                      onPress={this.infoPress}>
                        <Text style={{color: "blue", fontWeight: "bold"}}>+</Text>
                      </TouchableOpacity>
                    </DataTable.Cell>
                    <DataTable.Cell style={{flex: .5}} >{val.deliveryDates[i]}</DataTable.Cell>
                    {/* <DataTable.Cell style={{flex: 1}}>{val.names[i]}</DataTable.Cell> */}
                    {/* <DataTable.Cell>{val.phoneNumbers[i]}</DataTable.Cell>*/}
                    <DataTable.Cell style={{flex: 1}} >{val.addresses[i]}</DataTable.Cell> 
                    {/* <DataTable.Cell>{val.quantities[i]}</DataTable.Cell> */}
                    <DataTable.Cell style={{flex: .3}}>
                      <TouchableOpacity
                        style={styles.editOrder}
                        onPress={this.fillOrder.bind(this, i, "I")}
                      >
                        <Text style={styles.editText}>Claim</Text>
                      </TouchableOpacity>
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              } else {
                return (
                  <DataTable.Row style={{ backgroundColor: "white" }} key={i}>
                    {/* <DataTable.Cell>{i + 1}</DataTable.Cell> */}
                    <DataTable.Cell style={{flex: .2}} >
                      <TouchableOpacity
                      style={styles.infoButton}
                      onPress={this.infoPress}>
                        <Text style={{color: "blue", fontWeight: "bold"}}>+</Text>
                      </TouchableOpacity>
                    </DataTable.Cell>
                    <DataTable.Cell style={{flex: .5}} >{val.deliveryDates[i]}</DataTable.Cell>
                    {/* <DataTable.Cell style={{flex: 1}}>{val.names[i]}</DataTable.Cell> */}
                    {/* <DataTable.Cell>{val.phoneNumbers[i]}</DataTable.Cell>*/}
                    <DataTable.Cell style={{flex: 1}} >{val.addresses[i]}</DataTable.Cell> 
                    {/* <DataTable.Cell>{val.quantities[i]}</DataTable.Cell> */}
                    <DataTable.Cell style={{flex: .3}}>
                      <TouchableOpacity
                        style={styles.reopenOrder}
                        onPress={this.fillOrder.bind(this, i, "C")}
                      >
                        <Text style={styles.editText}>Close</Text>
                      </TouchableOpacity>
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              }
            }
          })
        );
        //}
      }

      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.text}>{this.props.navigation.state.params.location} Orders</Text>
            {/* <TouchableOpacity
              style={styles.touch}
              onPress={this.newOrderPressHandler}
              activeOpacity={0.5}
            >
              <Text style={styles.AddOrderBtn}> Add Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.touchNew}
              onPress={this.inventoryPressHandler}
              activeOpacity={0.5}
            >
              <Text style={styles.InventoryBtn}>Inventory</Text>
            </TouchableOpacity> */}
            {/* <TouchableOpacity
              style={styles.archivedButton}
              onPress={this.archivedPressHandler}
              activeOpacity={0.5}
            >
              <Text style={styles.InventoryBtn}>Archived</Text>
            </TouchableOpacity>  */}
          </View>
          <Searchbar
            placeholder="Search"
            style={styles.searchBar}
            onChangeText={(text) => this.onChangeSearch(text)}
          ></Searchbar>
          {/* <RadioButton
            value="Outstanding"
            status={this.state.orderStatus === "A" ? "checked" : "unchecked"}
            onPress={this.outstandingPressHandler}
          ></RadioButton>
          <RadioButton
            value="Archived"
            status={this.state.orderStatus === "I" ? "checked" : "unchecked"}
            onPress={this.archivedPressHandler}
          ></RadioButton>
          <Text style={styles.unfulfilledText}>Unfulfilled</Text>
          <Text style={styles.fulfilledText}>Fulfilled</Text> */}

          <ScrollView
            style={{
              width: "95%",
              height: "70%",
              position: "relative",
              alignSelf: "center",
              marginTop: "10%"
              //top: 250,
              //right: 200,
            }}
          >
            <DataTable
              style={{
                width: "100%",
                position: "relative",
                alignSelf: "center",
                marginTop: 10,
                //top: 150,
                //right: 200,
                flex: 1,
                borderRadius: 10,
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <DataTable.Header style={{ backgroundColor: "#ABD7EB" }}>
                <View style={styles.headerView}>
                {/* <DataTable.Title
                  numeric
                  sortDirection="ascending"
                  style={styles.orderIDHeader}
                >
                  OrderID
                </DataTable.Title> */}
                <DataTable.Title 
                style={styles.moreInfoHeader}>
                  +
                </DataTable.Title>
                <DataTable.Title 
                style={styles.deliveryDateHeader}>
                  Delivery Date
                </DataTable.Title>
                {/* <DataTable.Title style={styles.nameHeader}>
                  Name
                </DataTable.Title> */}
                {/* <DataTable.Title numeric style={styles.phoneHeader}>
                  Phone
                </DataTable.Title>*/}
                <DataTable.Title style={styles.addressHeader}>
                  Address
                </DataTable.Title> 
                
                <DataTable.Title style={styles.claimHeader}>
                  Claim
                </DataTable.Title>
                {/* <DataTable.Title numeric style={styles.quantityHeader}>
                  Quantity
                </DataTable.Title> */}
                {/* <DataTable.Title
                  numeric
                  style={styles.phoneHeader}
                ></DataTable.Title> */}
                </View>
              </DataTable.Header>
              <ScrollView>{orders}</ScrollView>

              <DataTable.Pagination
                page={this.state.page}
                numberOfPages={1}
                onPageChange={(page) => {
                  this.setState({ page: page });
                }}
                //label={"1-" + arrLength + " of " + arrLength}
              ></DataTable.Pagination>
            </DataTable>
           
          </ScrollView>
          <View style={styles.menuView}>
            <TouchableOpacity style={styles.leftButton}>
              <Text style={styles.menuText}>Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.middleButton} onPress={this.inventoryPressHandler}>
            <Text style={styles.menuText}>Inventory</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rightButton}>
            <Text style={styles.menuText} onPress={this._handleAccountPress}>Account</Text>
            </TouchableOpacity>
          </View>
          {/* <TextInput
            style={styles.newOrderStyle}
            placeholder="Name..."
          ></TextInput>
          <TextInput
            style={{
              width: "8%",
              height: "5%",
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: "#D3D3D3",
              position: "absolute",
              top: 200,
              left: 440,
            }}
            placeholder="Phone..."
          ></TextInput>
          <TextInput
            style={{
              width: "8%",
              height: "5%",
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: "#D3D3D3",
              position: "absolute",
              top: 200,
              left: 610,
            }}
            placeholder="Address..."
          ></TextInput>
          <TextInput
            style={{
              width: "8%",
              height: "5%",
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: "#D3D3D3",
              position: "absolute",
              top: 200,
              left: 780,
            }}
            placeholder="Date..."
          ></TextInput>
          <TextInput
            style={{
              width: "8%",
              height: "5%",
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: "#D3D3D3",
              position: "absolute",
              top: 200,
              left: 950,
            }}
            placeholder="Quantity..."
          ></TextInput>
          <TouchableOpacity
            style={{
              width: "5%",
              height: "5%",
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: "aqua",
              position: "absolute",
              top: 200,
              left: 1120,
            }}
            //onPress={this.addPressHandler}
          >
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity> */}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: "10%",
    width: "100%",
    position: "relative",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#093b15",
  },
  phoneText: {
    color: "black",
    fontSize: 14,
    paddingTop: 10,
  },
  searchBar: {
    position: "relative",
    marginTop: "4%",
    width: "70%",
    alignSelf: "flex-start",
    //left: 70
  },
  newOrderStyle: {
    width: 130,
    height: 35,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#D3D3D3",
    position: "absolute",
    bottom: 5,
    left: 180,
  },
  unfulfilledText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    position: "absolute",
    left: 32,
    top: 140,
  },
  fulfilledText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    position: "absolute",
    left: 32,
    top: 175,
  },
  headerView: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  addText: {
    color: "black",
    position: "absolute",
    fontSize: 15,
    fontWeight: "bold",
    right: 15,
    top: 7,
  },
  inputView: {
    backgroundColor: "#A9A9A9",
    alignSelf: "flex-start",
    paddingLeft: 10,
    height: "50%",
    width: "40%",
    borderRadius: 10,
  },
  text: {
    color: "white",
    fontSize: 35,
    fontWeight: "bold",
    //position: "absolute",
    //top: 16,
    //left: 5,
  },
  textInput: {
    height: 40,
    width: "50%",
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 10,
  },
  table: {
    width: "50%",
  },
  touch: {
    backgroundColor: "#9AC6A2",
    width: "7%",
    height: "55%",
    position: "absolute",
    top: 15,
    right: 30,
    borderRadius: 7,
  },
  touchNew: {
    backgroundColor: "#9AC6A2",
    width: "7%",
    height: "55%",
    position: "absolute",
    top: 15,
    right: 150,
    borderRadius: 7,
  },

  plusSign: {
    fontSize: 36,
    fontWeight: "bold",
    position: "absolute",
    bottom: 7,
    left: 13,
    color: "green",
  },

  archivedButton: {
    backgroundColor: "#9AC6A2",
    width: "7%",
    height: "55%",
    position: "absolute",
    top: 15,
    right: 300,
    borderRadius: 7,
  },
  AddOrderBtn: {
    color: "#093b15",
    textAlign: "center",
    position: "absolute",
    top: 5,
    right: 18,
    fontWeight: "bold",
  },
  InventoryBtn: {
    color: "#093b15",
    textAlign: "center",
    position: "absolute",
    top: 5,
    right: 18,
    fontWeight: "bold",
  },
  pic: {
    //borderWidth: 1,
    //padding: 8,
    //borderColor: "black",
    //backgroundColor: "green",

    width: "100%",
    height: "100%",
    //color: "white",
    //alignSelf: "flex-end",
    //position: "absolute",
    //top: 40,
    //right: 40,
  },
  nameHeader: {
    position: "relative",
    alignSelf: "center",
    alignItems: "center",
    justifyContent:"flex-start",
    flex: 1
  },
  orderIDHeader: {
    position: "relative",
    alignSelf: "center",
    alignItems: "center",
    justifyContent:"center",
    flex: 1
  },

  phoneHeader: {
    position: "relative",
    alignSelf: "center",
    alignItems: "center",
    justifyContent:"center",
    flex: 1
  },
  addressHeader: {
    position: "relative",
    alignSelf: "center",
    alignItems: "center",
    justifyContent:"flex-start",
    flex: 1
  },
  quantityHeader: {
    position: "relative",
    alignSelf: "center",
    alignItems: "center",
    justifyContent:"center",
    flex: 1
  },
  orderHeader: {
    position: "relative",
    marginTop: 5,
    alignSelf: "flex-start",
    left: 20,
    fontWeight: "bold",
    fontSize: 20,
    color: "#093b15",
  },
  deliveryDateHeader: {
    position: "relative",
    alignSelf: "center",
    alignItems: "center",
    justifyContent:"flex-start",
    flex: .5
  },
  moreInfoHeader: {
    position: "relative",
    alignSelf: "center",
    alignItems: "center",
    justifyContent:"flex-start",
    flex: .2,
  },

  claimHeader: {
    position: "relative",
    alignSelf: "center",
    alignItems: "center",
    justifyContent:"flex-start",
    flex: .3
  },
  editOrder: {
    backgroundColor: "#9AC6A2",
    width: "100%",
    height: "100%",
    position: "relative",
    
    //justifyContent: "center",
    
    //right: 30,
    borderRadius: 7,
  },
  infoButton: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    position: "relative",
    
    //justifyContent: "center",
    
    //right: 30,
    borderRadius: 7,
  },

  reopenOrder: {
    backgroundColor: "#FF6961",
    width: "100%",
    height: "100%",
    position: "relative",
    //justifyContent: "center",
    //right: 30,
    borderRadius: 7,
  },
  editText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 19,
    position: "relative",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    //right: 9,
  },
  menuView: {
    position: "relative",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 20,
    height: "10%",
    width: "100%",
    backgroundColor: "#093b15"
  },
  leftButton: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent:"center",
    borderRightWidth: 1,
    borderRightColor: "white",
    //backgroundColor: "yellow",
    flex: 1,
    height: "100%",
    //width: "20%",
    //height: "100%", 
  },
  middleButton: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "white",
    //width: "20%",
    //height: "100%", 
    flex: 1,
    height: "100%",
  },
  rightButton: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "yellow",
    //width: "20%",
    //height: "100%", 
    flex: 1,
    height: "100%",

  },
  menuText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white"
  }
});
