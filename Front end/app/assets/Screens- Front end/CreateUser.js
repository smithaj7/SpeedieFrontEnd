import React, { Children } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

import navigation from "react-navigation";
import DropDownPicker from "react-native-dropdown-picker";

export default class CreateUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      isLoading: true,
      dataSource: [],
      loggedIn: false,
    };

    this._handlePress = this._handlePress.bind(this);
    this.setRole = this.setRole(this);
    this.setLocation = this.setLocation(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    return await fetch("http://localhost:7071/api/ForgotPassword", {
      method: "POST",
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
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

  _handlePress = async () => {
      if (this.state.role == null || this.state.location == null || this.state.email == null || this.state.password == null){
          alert("Please fill in all fields.")
      }
      else{
        const result = await this.getData();
        var li = this.state.dataSource.map((val, key) => {
            return val.ResetStatus;
        });
        if (li == "invalid email"){
            alert("Invalid email");
        }
        else{
            this.props.navigation.navigate("AccountPage");
        }
      }
  };

    setRole = async(item) => {
        this.state.role = item;
    };


    setLocation = async(item) => {
        this.state.location = item;
    };

  render() {
    return (
      <View style={styles.container}>
        <Image style = {styles.logo} source={require("../../../SpeediePNG.png")}></Image>
        <View style = {styles.banner}>
        </View>
        <Text style={styles.loginHeader}>Create New Employee</Text>
        <View style={styles.EmailInputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Email"
            placeholderTextColor="#003f5c"
            onChangeText={(text) => this.setState({ email: text })}
            onSubmitEditing={this._handlePress}
          />
        </View>
        <View style={styles.PasswordInputView}>
          <TextInput
            secureTextEntry
            style={styles.inputText}
            placeholder="Temporary Password"
            placeholderTextColor="#003f5c"
            onChangeText={(text) => this.setState({ password: text })}
            onSubmitEditing={this._handlePress}
          />
        </View>
{/* 
        <View style={styles.ConfirmPasswordInputView}>
          <TextInput
            secureTextEntry
            style={styles.inputText}
            placeholder="Confirm Password"
            placeholderTextColor="#003f5c"
            onChangeText={(text) => this.setState({ confirmPassword: text })}
            onSubmitEditing={this._handlePress}
          />
        </View> */}

        <View style={styles.selectEmployee}>
            <DropDownPicker
              items={[
                { label: "Administrator", value: "administrator" },
                { label: "Delivery Driver", value: "associate" },
              ]}
              placeholder="Select an Employee Type"
              style={{ 
                backgroundColor: "white", 
                marginTop: "5%",
                zIndex: 999
              }}
              dropDownStyle={{
              }}
              onChangeItem={(item) => {this.setRole(item)}}
            ></DropDownPicker>
        </View>

        <View style={styles.selectLocation}>
            <DropDownPicker
              items={[
                { label: "Miami", value: "Miami" },
                { label: "New Orleans", value: "New Orleans" },
                { label: "Chicago", value: "Chicago" },
              ]}
              placeholder="Select a Location"
              style={{ 
                backgroundColor: "white", 
                marginTop: "5%",
              }}
              dropDownStyle={{
                zIndex: 3
              }}
              onChangeItem={(item) => {this.setLocation(item)}}
            ></DropDownPicker>
        </View>

        <TouchableOpacity style={styles.createBtn} onPress={this._handlePress}>
          <Text style={styles.createText}>Create Employee</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // background: {
  //   flex: 1,
  // },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "flex-start",
    width: "100%",
    height: "100%",
  },
  logo: {
    width: "30%",
    height: "10%",
    position: "relative",
    alignSelf: "flex-start",
    marginTop: "10%"
  },
  
  loginHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    position: "relative",
    alignSelf: "center",
  },
  EmailInputView: {
    width: "90%",
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "black",
    borderRadius: 15,
    height: "8%",
    marginTop: "5%",
    alignSelf: "center",
    padding: "5%",
  },
  PasswordInputView: {
    width: "90%",
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "black",
    borderRadius: 15,
    height: "8%",
    marginTop: "5%",
    position: "relative",
    alignSelf: "center",
    padding: "5%",
  },
  ConfirmPasswordInputView: {
    width: "90%",
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "black",
    borderRadius: 15,
    height: "8%",
    marginTop: "5%",
    position: "relative",
    alignSelf: "center",
    padding: "5%",
  },
  inputText: {
    height: "90%",
    fontSize: 18,
    width: "85%",
    color: "black",
  },
  selectEmployee: {
    alignSelf: "center",
    minHeight: "100px",
  },
  selectLocation: {
    alignSelf: "center",
  },
  createBtn: {
    width: "40%%",
    backgroundColor: "#113B08",
    borderRadius: 10,
    height: "6%",
    alignSelf: "center",
    position: "relative",
    marginTop: "15%",
    marginBottom: "2%",
  },
  createText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    position: "relative",
    right: 0,
    top: "30%",
  },
});
