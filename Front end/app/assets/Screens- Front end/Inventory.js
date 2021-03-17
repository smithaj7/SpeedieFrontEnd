import React, { useState } from "react";
import { DataTable, RadioButton } from "react-native-paper";
import {
  StyleSheet,
  View,
  Button,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
  Picker,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
//import { black } from "react-native-paper/lib/typescript/src/styles/colors";
var PickerItem = DropDownPicker.propTypes.items;

export default class Inventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      page: 0,
      location: "",
      driver: "",
      items: [],
    };

    this.controller;
  }

  componentWillMount() {
    return fetch("http://localhost:7071/api/DriverNames", {
      method: "POST",
      body: JSON.stringify({
        Location: this.state.location,
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
  }

  render() {
    if (this.state.isLoading) {
      <View style={{ flex: 1 }}>
        <ActivityIndicator></ActivityIndicator>
      </View>;
    } else {
      //var inventory = [];
      var arrLength;
      this.state.dataSource.map((val) => {
        arrLength = val.nameList.length;
      });

      console.log("array:" + arrLength);
      //var inventory = [];
      for (let i = 0; i < arrLength; i++) {
        this.state.items.push(
          this.state.dataSource.map((val, index) => {
            return val.nameList[i];
          })
        );
      }
    }
    console.log("items: " + this.state.items);

    //var inventory = [];

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.text}>Speedie Bean Associate Portal</Text>
        </View>

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
              <DataTable.Title style={styles.nameHeader}>Name</DataTable.Title>
              <DataTable.Title numeric style={styles.qtyHeader}>
                Phone
              </DataTable.Title>
            </DataTable.Header>

            <DataTable.Pagination
              page={this.state.page}
              numberOfPages={1}
              onPageChange={(page) => {
                this.setState({ page: page });
              }}
              //label={"1-" + arrLength + " of " + arrLength}
            ></DataTable.Pagination>
          </DataTable>
          <DropDownPicker
            items={[
              { label: "Miami", value: "Miami" },
              { label: "New Orleans", value: "New Orleans" },
              { label: "Chicago", value: "Chicago" },
            ]}
            style={{ backgroundColor: "white", width: "30%" }}
            itemStyle={{}}
            dropDownStyle={{
              width: "40%",
            }}
            onChangeItem={(item) => this.setState({ location: item.value })}
          ></DropDownPicker>
          <DropDownPicker
            style={{
              width: 130,
              height: 35,
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: "#D3D3D3",
              position: "absolute",
              bottom: 5,
              left: 900,
            }}
            items={this.state.items}
            //onChangeItem={(item) => this.setState({ driver: item.value })}
            //placeholder="(xxx)-xxx-xxxx"
            //onChangeText={(text) => this.setState({ newPhone: text })}
          ></DropDownPicker>
          {/* <TextInput
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
            <Text style={styles.plusSign}>+</Text> */}
        </ScrollView>
      </View>
    );
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
  AddOrderBtn: {
    color: "#093b15",
    textAlign: "center",
    position: "absolute",
    top: 5,
    right: 40,
    fontWeight: "bold",
  },
  InventoryBtn: {
    color: "#093b15",
    textAlign: "center",
    position: "absolute",
    top: 5,
    right: 36,
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

  qtyHeader: {
    position: "absolute",
    left: 350,
  },
});
