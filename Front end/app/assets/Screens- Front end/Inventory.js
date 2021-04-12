// import React, { useState } from "react";
// import { DataTable, RadioButton } from "react-native-paper";
// // import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
// import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
// import {
//   StyleSheet,
//   View,
//   Button,
//   TouchableOpacity,
//   Text,
//   Image,
//   TextInput,
//   Picker,
//   ActivityIndicator,
//   ScrollView,
//   Alert,
// } from "react-native";
// import DropDownPicker from "react-native-dropdown-picker";
// //import { black } from "react-native-paper/lib/typescript/src/styles/colors";
// var PickerItem = DropDownPicker.propTypes.items;

// export default class Inventory extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isLoading: true,
//       dataSource: [],
//       page: 0,
//       location: "",
//       driver: "",
//       items: [],
//     };

//     this.controller;
//   }

//   componentWillMount() {
//     return fetch("http://localhost:7071/api/DriverNames", {
//       method: "POST",
//       body: JSON.stringify({
//         Location: this.state.location,
//       }),
//     })
//       .then((response) => response.json())
//       .then((responseJson) => {
//         console.log(responseJson);
//         this.setState({
//           isLoading: false,
//           dataSource: [responseJson],
//         });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

//   render() {
//     if (this.state.isLoading) {
//       <View style={{ flex: 1 }}>
//         <ActivityIndicator></ActivityIndicator>
//       </View>;
//     } else {
//       //var inventory = [];
//       var arrLength;
//       this.state.dataSource.map((val) => {
//         arrLength = val.nameList.length;
//       });

//       console.log("array:" + arrLength);
//       //var inventory = [];
//       for (let i = 0; i < arrLength; i++) {
//         this.state.items.push(
//           this.state.dataSource.map((val, index) => {
//             return val.nameList[i];
//           })
//         );
//       }
//     }
//     console.log("items: " + this.state.items);

//     //var inventory = [];

//     return (
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.text}>Speedie Bean Inventory</Text>
//         </View>

//         <ScrollView
//           style={{
//             width: "80%",
//             height: "70%",
//             alignSelf: "center",
//             top: "10%",
//             // right: "5%",
//           }}
//         >
//           <DataTable
//             style={{
//               //width: "80%",
//               //position: "absolute",
//               //top: 150,
//               //right: 200,
//               flex: 1,
//               borderRadius: 10,
//               borderColor: "black",
//               borderWidth: 1,
//             }}
//           >
//             <DataTable.Header style={{ backgroundColor: "#ABD7EB" }}>
//               <DataTable.Title
//                 // numeric
//                 sortDirection="ascending"
//                 style={styles.BottleSizeHeader}
//               >
//                 Bottle Size
//               </DataTable.Title>
//               <DataTable.Title style={styles.quantityHeader}>Quantity</DataTable.Title>
//               {/* <DataTable.Title numeric style={styles.qtyHeader}>
//                 Phone
//               </DataTable.Title> */}
//             </DataTable.Header>

//             <DataTable.Pagination
//               page={this.state.page}
//               numberOfPages={1}
//               onPageChange={(page) => {
//                 this.setState({ page: page });
//               }}
//               //label={"1-" + arrLength + " of " + arrLength}
//             ></DataTable.Pagination>
//           </DataTable>
//           <DropDownPicker
//             items={[
//               { label: "Miami", value: "Miami" },
//               { label: "New Orleans", value: "New Orleans" },
//               { label: "Chicago", value: "Chicago" },
//             ]}
//             style={{ 
//               backgroundColor: "white", 
//               width: "50%",
//               marginTop: "5%"
//             }}
//             itemStyle={{}}
//             dropDownStyle={{
//               width: "50%",
//             }}
//             onChangeItem={(item) => this.setState({ location: item.value })}
//           ></DropDownPicker>
//           {/* <DropDownPicker
//             style={{
//               width: "50%",
//               height: "4%",
//               borderColor: "black",
//               borderWidth: 1,
//               borderRadius: 10,
//               backgroundColor: "#D3D3D3",
//               position: "relative",
//               bottom: "1%",
//             }}
//             items={this.state.items}
//             //onChangeItem={(item) => this.setState({ driver: item.value })}
//             //placeholder="(xxx)-xxx-xxxx"
//             //onChangeText={(text) => this.setState({ newPhone: text })}
//           ></DropDownPicker> */} 
//           {/* This commented out above was the second drop down bar */}
//           {/* <TextInput
//               style={{
//                 width: 130,
//                 height: 35,
//                 borderColor: "black",
//                 borderWidth: 1,
//                 borderRadius: 10,
//                 backgroundColor: "#D3D3D3",
//                 position: "absolute",
//                 bottom: 5,
//                 left: 530,
//               }}
//               placeholder="Address..."
//               onChangeText={(text) => this.setState({ newAddress: text })}
//             ></TextInput>
//             <TextInput
//               style={{
//                 width: 130,
//                 height: 35,
//                 borderColor: "black",
//                 borderWidth: 1,
//                 borderRadius: 10,
//                 backgroundColor: "#D3D3D3",
//                 position: "absolute",
//                 bottom: 5,
//                 left: 700,
//               }}
//               placeholder="mm/dd/yyyy"
//               onChangeText={(text) => this.setState({ newDeliveryDate: text })}
//             ></TextInput>
//             <TextInput
//               style={{
//                 width: 110,
//                 height: 35,
//                 borderColor: "black",
//                 borderWidth: 1,
//                 borderRadius: 10,
//                 backgroundColor: "#D3D3D3",
//                 position: "absolute",
//                 bottom: 5,
//                 left: 870,
//               }}
//               placeholder="Quantity..."
//               onChangeText={(text) => this.setState({ newQuantity: text })}
//             ></TextInput>
//             <TouchableOpacity
//               style={{
//                 width: 60,
//                 height: 40,
//                 borderColor: "black",
//                 borderWidth: 1,
//                 borderRadius: 10,
//                 backgroundColor: "aqua",
//                 position: "absolute",
//                 bottom: 5,
//                 left: 990,
//               }}
//               onPress={this.addOrderPressHandler}
//             >
//               <Text style={styles.addText}>Add</Text>
//             </TouchableOpacity>
//             <Text style={styles.plusSign}>+</Text> */}
//         </ScrollView>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     height: "10%",
//     width: "100%",
//     backgroundColor: "#093b15",
//   },
//   phoneText: {
//     color: "black",
//     fontSize: 14,
//     paddingTop: "1%",
//   },
//   inputView: {
//     backgroundColor: "#A9A9A9",
//     // alignSelf: "flex-start",
//     paddingLeft: "1%",
//     height: "50%",
//     width: "40%",
//     borderRadius: 10,
//   },
//   text: {
//     color: "white",
//     fontSize: 18,
//     textAlign: "center",
//     fontWeight: "bold",
//     position: "relative",
//     top: "50%",
//   },
//   textInput: {
//     height: "15%",
//     width: "50%",
//     borderColor: "black",
//     borderWidth: 1,
//     backgroundColor: "white",
//     borderRadius: 10,
//   },
//   table: {
//     width: "50%",
//   },
//   touch: {
//     backgroundColor: "#9AC6A2",
//     width: "7%",
//     height: "55%",
//     position: "relative",
//     // top: 15,
//     // right: 30,
//     borderRadius: 7,
//   },
//   touchNew: {
//     backgroundColor: "#9AC6A2",
//     width: "7%",
//     height: "55%",
//     position: "relative",
//     // top: 15,
//     // right: 150,
//     borderRadius: 7,
//   },
//   AddOrderBtn: {
//     color: "#093b15",
//     textAlign: "center",
//     position: "absolute",
//     // top: 5,
//     // right: 40,
//     fontWeight: "bold",
//   },
//   InventoryBtn: {
//     color: "#093b15",
//     textAlign: "center",
//     position: "relative",
//     // top: 5,
//     // right: 36,
//     fontWeight: "bold",
//   },
//   pic: {
//     //borderWidth: 1,
//     //padding: 8,
//     //borderColor: "black",
//     //backgroundColor: "green",

//     width: "100%",
//     height: "100%",
//     //color: "white",
//     //alignSelf: "flex-end",
//     //position: "absolute",
//     //top: 40,
//     //right: 40,
//   },

//   quantityHeader: {
//     position: "relative",
//     left: "30%",
//   },
//   BottleSizeHeader: {
//     position: "relative",
//     // left: "1%",
//   },

//   qtyHeader: {
//     position: "relative",
//     // left: "70%",
//   },
// });

import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert, Image, ActivityIndicator, Modal} from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import DropDownPicker from "react-native-dropdown-picker";
import navigation from "react-navigation";

export default class Inventory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          // isLoading: true,
          // dataSource: [],
          // page: 0,
          // location: "",
          // driver: "",
          // items: [],
          dataSource: "",
          tableHead: ['Bottle Size', 'Quantity', 'Add Inventory'],
          tableData: [['Quart', '3', 'n/a'],
                      ['Pint', '7', 'n/a'],
                      ['Gallon', '5', 'n/a']],
          data2: []
        };
    
        this.controller;
        this.displayModal = this.displayModal.bind(this);
        this._handleAccountPress = this._handleAccountPress.bind(this);
        this.ordersPressHandler = this.ordersPressHandler.bind(this);
        this.inventoryPressHandler = this.inventoryPressHandler.bind(this);

      }

      itemChange = async (item) => {
        
        await fetch("http://localhost:7071/api/getInventory", {
          method: "POST",
          body: JSON.stringify({
            location: item.value,
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

          var numQuarts = this.state.dataSource.map((val, key) => {
            return val.Quarts;
          });

          var numHalfGals = this.state.dataSource.map((val, key) => {
            return val.HalfGals;
          });

          
          this.setState({tableData: [['Quart', numQuarts, 'n/a'],
          ['HG', numHalfGals, 'n/a']],})
      };

      
    
      _alertIndex(index) {
        alert(`This is row ${index + 1}`);
    }

    displayModal = () => {
      this.setState({isVisible: true})
    }

    _handleAccountPress(){
      const { params } = this.props.navigation.state;
      var email = params.user;
      var loc = params.location;
      var employeeRole = params.role;
      this.props.navigation.navigate("AccountInfo", {user: email, location: loc, role: employeeRole});
    }
  
    inventoryPressHandler() {
      const { params } = this.props.navigation.state;
      var email = params.user;
      var loc = params.location;
      var employeeRole = params.role;
      this.props.navigation.navigate("Inventory", {user: email, location: loc, role: employeeRole});
    }

    ordersPressHandler(){
      const { params } = this.props.navigation.state;
      var email = params.user;
      var loc = params.location;
      var employeeRole = params.role;
      this.props.navigation.navigate("MiaOrders", {user: email, location: loc, role: employeeRole});
    }
  
    infoPress(){
  
    }
    
    // constructor(props) {
    //   super(props);
    //   this.state = {
    //     tableHead: ['Head', 'Head2', 'Head3', 'Head4'],
    //     tableData: [
    //       ['1', '2', '3', '4'],
    //       ['a', 'b', 'c', 'd'],
    //       ['1', '2', '3', '4'],
    //       ['a', 'b', 'c', 'd']
    //     ]
    //   }
    // }
   
    // componentWillMount() {
    //     return fetch("http://localhost:7071/api/DriverNames", {
    //       method: "POST",
    //       body: JSON.stringify({
    //         Location: this.state.location,
    //       }),
    //     })
    //       .then((response) => response.json())
    //       .then((responseJson) => {
    //         console.log(responseJson);
    //         this.setState({
    //           isLoading: false,
    //           dataSource: [responseJson],
    //         });
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       });
    //   }
   
    render() {
        // if (this.state.isLoading) {
        //     <View style={{ flex: 1 }}>
        //       <ActivityIndicator></ActivityIndicator>
        //     </View>;
        //   } else {
        //     //var inventory = [];
        //     var arrLength;
        //     this.state.dataSource.map((val) => {
        //       arrLength = val.nameList.length;
        //     });
      
        //     console.log("array:" + arrLength);
        //     //var inventory = [];
        //     for (let i = 0; i < arrLength; i++) {
        //       this.state.items.push(
        //         this.state.dataSource.map((val, index) => {
        //           return val.nameList[i];
        //         })
        //       );
        //     }
        //   }
          // console.log("items: " + this.state.items);
         

        const state = this.state;
        const element = (data, index) => (
        <TouchableOpacity onPress={()  => {this._alertIndex(index)}}>
            <View style={styles.btn}>
            <Text style={styles.btnText}>Add Inventory</Text>
            </View>
        </TouchableOpacity>
        );
    
        return (
        <View style={styles.container}>
            <Image style = {styles.logo} source={require("../../../SpeediePNG.png")}></Image>
            <View style={styles.header}>
              <Text style={styles.headerText}>Inventory</Text>
            </View>
            <DropDownPicker
              items={[
                { label: "Miami", value: "Miami" },
                { label: "New Orleans", value: "New Orleans" },
                { label: "Chicago", value: "Chicago" },
                // { label: "Select a City", placeHolder: "Select a city"}
              ]}
              defaultValue={this.state.data}
              placeholder="Select a City"
              style={{ 
                backgroundColor: "white", 
                width: "50%",
                alignSelf: "center",
                marginTop: "5%",
              }}
              itemStyle={{}}
              containerStyle={{height: "8%"}}
              dropDownStyle={{
                width: "50%",
                alignSelf: "center"
              }}
              onChangeItem={(item) => {this.itemChange(item)}}
            ></DropDownPicker>

            <View style={styles.container2}>
                <Table borderStyle={{borderColor: 'transparent'}}>
                <Row data={state.tableHead} style={styles.head} textStyle={styles.headText}/>
                {
                    state.tableData.map((rowData, index) => (
                    <TableWrapper key={index} style={styles.row}>
                        {
                        rowData.map((cellData, cellIndex) => (
                          
                            <Cell key={cellIndex} data={cellIndex === 2 ? element(cellData, index) : cellData} textStyle={styles.text}/>
                        ))
                        }
                    </TableWrapper>
                    ))
                }
                </Table>
            </View>
            <View style={styles.menuView}>
            <TouchableOpacity style={styles.leftButton} onPress={this.ordersPressHandler}>
              <Text style={styles.menuText}>Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.middleButton} onPress={this.inventoryPressHandler}>
            <Text style={styles.menuText}>Inventory</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rightButton}>
            <Text style={styles.menuText} onPress={this._handleAccountPress}>Account</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        )
    }
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 16, 
    paddingTop: 30, 
    backgroundColor: '#fff',
  },
  logo: {
    width: "25%",
    height: "8%",
    position: "absolute",
    marginTop: "5%",
    // alignItems: "flex-start",
  },
  header: {
    padding: "5%",
  },
  headerText: {
    textAlign: "center",
    color: "#113B08",
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  container2: { 
    flex: 1, 
    padding: 16, 
    paddingTop: 30, 
    backgroundColor: '#fff' 
  },
  head: { 
    height: "18%", 
    backgroundColor: '#113B08' 
  },
  headText: {
    color: 'white',
    margin: "5%" ,
    textAlign: "center",
    fontWeight: "bold"
  },
  text: { 
    margin: "8%" ,
    textAlign: "center"
  },
  row: { 
    flexDirection: 'row', 
    backgroundColor: '#C4A484' ,
    height: "25%"
  },
  btn: { 
    width: "95%", 
    height: "80%", 
    backgroundColor: '#C2E2C3',  
    borderRadius: 2,
    // alignItems: "center",
  },
  btnText: { 
    textAlign: 'center', 
    color: 'black',
    fontWeight: "bold",
  },

  modalContainer: {
    height: "50%",
    width: "50%",
    backgroundColor: "black"
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
