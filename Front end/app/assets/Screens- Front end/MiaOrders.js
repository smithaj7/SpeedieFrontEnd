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
        location: "Miami",
        orderStatus: this.state.orderStatus,
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
        location: "Miami",
        searchText: text,
        orderStatus: this.state.orderStatus,
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
        location: "Miami",
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
    this.props.navigation.push("NewOrder");
  }

  archivedPressHandler = async () => {
    await this.setState({ orderStatus: "I" });
    return this.getData();
  };

  outstandingPressHandler = async () => {
    await this.setState({ orderStatus: "A" });
    return this.getData();
  };

  inventoryPressHandler() {
    this.props.navigation.push("Inventory");
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
        location: "Miami",
        orderNumber: i + 1,
        newStatus: orderStatus,
        filledBy: user,
      }),
    }).then(this.refreshScreen);
  }

  render() {
    //console.log(this.state.userName);
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
              if (this.state.orderStatus == "A") {
                return (
                  <DataTable.Row style={{ backgroundColor: "#D3D3D3" }} key={i}>
                    <DataTable.Cell>{i + 1}</DataTable.Cell>
                    <DataTable.Cell>{val.names[i]}</DataTable.Cell>
                    <DataTable.Cell>{val.phoneNumbers[i]}</DataTable.Cell>
                    <DataTable.Cell>{val.addresses[i]}</DataTable.Cell>
                    <DataTable.Cell>{val.deliveryDates[i]}</DataTable.Cell>
                    <DataTable.Cell>{val.quantities[i]}</DataTable.Cell>
                    <DataTable.Cell>
                      <TouchableOpacity
                        style={styles.editOrder}
                        onPress={this.fillOrder.bind(this, i, "A")}
                      >
                        <Text style={styles.editText}>Fulfill</Text>
                      </TouchableOpacity>
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              } else {
                return (
                  <DataTable.Row style={{ backgroundColor: "#D3D3D3" }} key={i}>
                    <DataTable.Cell>{i + 1}</DataTable.Cell>
                    <DataTable.Cell>{val.names[i]}</DataTable.Cell>
                    <DataTable.Cell>{val.phoneNumbers[i]}</DataTable.Cell>
                    <DataTable.Cell>{val.addresses[i]}</DataTable.Cell>
                    <DataTable.Cell>{val.deliveryDates[i]}</DataTable.Cell>
                    <DataTable.Cell>{val.quantities[i]}</DataTable.Cell>
                    <DataTable.Cell>
                      <TouchableOpacity
                        style={styles.reopenOrder}
                        onPress={this.fillOrder.bind(this, i, "I")}
                      >
                        <Text style={styles.editText}>Reopen</Text>
                      </TouchableOpacity>
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              }
            } else {
              if (this.state.orderStatus == "A") {
                return (
                  <DataTable.Row style={{ backgroundColor: "white" }} key={i}>
                    <DataTable.Cell>{i + 1}</DataTable.Cell>
                    <DataTable.Cell>{val.names[i]}</DataTable.Cell>
                    <DataTable.Cell>{val.phoneNumbers[i]}</DataTable.Cell>
                    <DataTable.Cell>{val.addresses[i]}</DataTable.Cell>
                    <DataTable.Cell>{val.deliveryDates[i]}</DataTable.Cell>
                    <DataTable.Cell>{val.quantities[i]}</DataTable.Cell>
                    <DataTable.Cell>
                      <TouchableOpacity
                        style={styles.editOrder}
                        onPress={this.fillOrder.bind(this, i, "A")}
                      >
                        <Text style={styles.editText}>Fulfill</Text>
                      </TouchableOpacity>
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              } else {
                return (
                  <DataTable.Row style={{ backgroundColor: "white" }} key={i}>
                    <DataTable.Cell>{i + 1}</DataTable.Cell>
                    <DataTable.Cell>{val.names[i]}</DataTable.Cell>
                    <DataTable.Cell>{val.phoneNumbers[i]}</DataTable.Cell>
                    <DataTable.Cell>{val.addresses[i]}</DataTable.Cell>
                    <DataTable.Cell>{val.deliveryDates[i]}</DataTable.Cell>
                    <DataTable.Cell>{val.quantities[i]}</DataTable.Cell>
                    <DataTable.Cell>
                      <TouchableOpacity
                        style={styles.reopenOrder}
                        onPress={this.fillOrder.bind(this, i, "I")}
                      >
                        <Text style={styles.editText}>Reopen</Text>
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
            <Text style={styles.text}>Speedie Bean Associate Portal</Text>
            <TouchableOpacity
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
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.archivedButton}
              onPress={this.archivedPressHandler}
              activeOpacity={0.5}
            >
              <Text style={styles.InventoryBtn}>Archived</Text>
            </TouchableOpacity>  */}
          </View>
          <Text style={styles.orderHeader}>Miami Orders</Text>
          <Searchbar
            placeholder="Search"
            style={{ width: "40%" }}
            onChangeText={(text) => this.onChangeSearch(text)}
          ></Searchbar>
          <RadioButton
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
          <Text style={styles.fulfilledText}>Fulfilled</Text>

          <ScrollView
            style={{
              width: "80%",
              height: "70%",
              position: "absolute",
              top: 250,
              right: 200,
            }}
          >
            <DataTable
              style={{
                //width: "80%",
                //position: "absolute",
                //top: 150,
                //right: 200,
                flex: 1,
                borderRadius: 10,
                borderColor: "black",
                borderWidth: 1,
              }}
            >
              <DataTable.Header style={{ backgroundColor: "#ABD7EB" }}>
                <DataTable.Title
                  numeric
                  sortDirection="ascending"
                  style={styles.orderIDHeader}
                >
                  OrderID
                </DataTable.Title>
                <DataTable.Title style={styles.nameHeader}>
                  Name
                </DataTable.Title>
                <DataTable.Title numeric style={styles.phoneHeader}>
                  Phone
                </DataTable.Title>
                <DataTable.Title style={styles.addressHeader}>
                  Address
                </DataTable.Title>
                <DataTable.Title style={styles.deliveryDateHeader}>
                  Delivery Date
                </DataTable.Title>
                <DataTable.Title numeric style={styles.quantityHeader}>
                  Quantity
                </DataTable.Title>
                <DataTable.Title
                  numeric
                  style={styles.phoneHeader}
                ></DataTable.Title>
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
            <TextInput
              style={styles.newOrderStyle}
              placeholder="Name..."
              onChangeText={(text) => this.setState({ newName: text })}
            ></TextInput>
            <TextInput
              style={{
                width: 130,
                height: 35,
                borderColor: "black",
                borderWidth: 1,
                borderRadius: 10,
                backgroundColor: "#D3D3D3",
                position: "absolute",
                bottom: 5,
                left: 360,
              }}
              placeholder="(xxx)-xxx-xxxx"
              onChangeText={(text) => this.setState({ newPhone: text })}
            ></TextInput>
            <TextInput
              style={{
                width: 130,
                height: 35,
                borderColor: "black",
                borderWidth: 1,
                borderRadius: 10,
                backgroundColor: "#D3D3D3",
                position: "absolute",
                bottom: 5,
                left: 530,
              }}
              placeholder="Address..."
              onChangeText={(text) => this.setState({ newAddress: text })}
            ></TextInput>
            <TextInput
              style={{
                width: 130,
                height: 35,
                borderColor: "black",
                borderWidth: 1,
                borderRadius: 10,
                backgroundColor: "#D3D3D3",
                position: "absolute",
                bottom: 5,
                left: 700,
              }}
              placeholder="mm/dd/yyyy"
              onChangeText={(text) => this.setState({ newDeliveryDate: text })}
            ></TextInput>
            <TextInput
              style={{
                width: 110,
                height: 35,
                borderColor: "black",
                borderWidth: 1,
                borderRadius: 10,
                backgroundColor: "#D3D3D3",
                position: "absolute",
                bottom: 5,
                left: 870,
              }}
              placeholder="Quantity..."
              onChangeText={(text) => this.setState({ newQuantity: text })}
            ></TextInput>
            <TouchableOpacity
              style={{
                width: 60,
                height: 40,
                borderColor: "black",
                borderWidth: 1,
                borderRadius: 10,
                backgroundColor: "aqua",
                position: "absolute",
                bottom: 5,
                left: 990,
              }}
              onPress={this.addOrderPressHandler}
            >
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
            <Text style={styles.plusSign}>+</Text>
          </ScrollView>
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
    height: "7%",
    width: "100%",
    backgroundColor: "#093b15",
  },
  phoneText: {
    color: "black",
    fontSize: 14,
    paddingTop: 10,
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
    fontSize: 18,
    fontWeight: "bold",
    position: "absolute",
    top: 16,
    left: 5,
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
    position: "absolute",
    left: 180,
  },
  orderIDHeader: {
    position: "absolute",
    left: 10,
  },

  phoneHeader: {
    position: "absolute",
    left: 350,
  },
  addressHeader: {
    position: "absolute",
    left: 520,
  },
  quantityHeader: {
    position: "absolute",
    left: 850,
  },
  orderHeader: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#093b15",
  },
  deliveryDateHeader: {
    position: "absolute",
    left: 690,
  },
  editOrder: {
    backgroundColor: "#9AC6A2",
    width: "33%",
    height: "85%",
    position: "absolute",
    top: 5,
    //right: 30,
    borderRadius: 7,
  },

  reopenOrder: {
    backgroundColor: "#FF6961",
    width: "45%",
    height: "85%",
    position: "absolute",
    top: 5,
    //right: 30,
    borderRadius: 7,
  },
  editText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 15,
    position: "absolute",
    top: 13,
    right: 9,
  },
});
