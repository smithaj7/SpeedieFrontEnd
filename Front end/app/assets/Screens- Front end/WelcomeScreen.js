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

export default class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoading: true,
      dataSource: [],
      loggedIn: false,
    };

    this._handlePress = this._handlePress.bind(this);
    //this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
  }

  // this.state = {
  //   email: "",
  //   password: "",
  // };

  // pressHandler({ navigation }) {
  //   navigation.push("Next");
  // }

  componentDidMount() {
    // return fetch("http://localhost:7071/api/Login", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     email: this.state.email,
    //     password: this.state.password,
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     console.log(responseJson);
    //     this.setState({
    //       isLoading: false,
    //       dataSource: [responseJson],
    //     });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    this.getData();
    //setInterval(this.getData, 30000);
  }

  getData = async () => {
    return await fetch("http://localhost:7071/api/Login", {
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
    const result = await this.getData();
    //var li
    var li = this.state.dataSource.map((val, key) => {
      return val.LoggedIn;
    });

    var location = this.state.dataSource.map((val, key) => {
      return val.Location;
    });

    console.log(li[0]);
    console.log(this.state.email);
    console.log(this.state.password);

    if (li[0] == "Yes") {
      console.log("hey");
      this.setState(
        {
          loggedIn: true,
        },
        () => console.log(this.state.loggedIn)
      );
      if (location == "All") {
        this.props.navigation.navigate("AllOrders");
      } else if (location == "Miami") {
        var userName = this.state.email;
        this.props.navigation.navigate("MiaOrders", { user: userName });
      } else if (location == "New Orleans") {
        this.props.navigation.navigate("NolaOrders");
      } else if (location == "Chicago") {
        this.props.navigation.navigate("ChiOrders");
      }
    } else {
      alert("Invalid username or password");
    }
  };

  render() {
    // var li = [];
    // li = this.state.dataSource.map((val, key) => {
    //   return val.LoggedIn[0];
    // });
    // if (li) {
    //   this.setState({
    //     loggedIn: true,
    //   });
    // }

    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../../../Speedie Logo.webp")}
        ></Image>
        <Text style={styles.loginHeader}>Welcome to Speedie Bean!</Text>
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
            placeholder="Password"
            placeholderTextColor="#003f5c"
            onChangeText={(text) => this.setState({ password: text })}
            onSubmitEditing={this._handlePress}
          />
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={this._handlePress}>
          <Text style={styles.loginText}>LOGIN</Text>
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
    backgroundColor: "#FFFFFF",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  logo: {
    width: "18%",
    height: "18%",
    alignSelf: "flex-start",
    justifyContent: "start",
  },
  loginHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    position: "relative",
  },
  EmailInputView: {
    width: "35%",
    backgroundColor: "#9abadd",
    borderRadius: 25,
    height: 50,
    marginTop: 20,
    alignSelf: "center",
    padding: 20,
  },

  PasswordInputView: {
    width: "35%",
    backgroundColor: "#99badd",
    borderRadius: 25,
    height: 50,
    marginTop: 20,
    position: "relative",
    top: 0,
    right: 0,
    //marginTop: 60,
    //justifyContent: "center",
    // alignItems: "flex-start",

    alignSelf: "center",
    padding: 20,
  },
  inputText: {
    height: 70,
    width: "80%",
    color: "black",
  },
  forgot: {
    color: "black",
    fontSize: 11,
    position: "relative",
    alignSelf: "center",
  },
  loginBtn: {
    width: "35%",
    backgroundColor: "#113B08",
    borderRadius: 25,
    height: 50,
    //alignItems: "center",
    //justifyContent: "center",
    alignSelf: "center",
    position: "relative",
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    position: "relative",
    right: 0,
    top: 15,
  },
});
