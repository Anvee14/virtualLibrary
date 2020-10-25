import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity ,FlatList,TextInput,Alert} from 'react-native';
import db from '../config'
import * as firebase from 'firebase'
import { ScrollView } from 'react-native-gesture-handler';
export default class LoginScreen extends React.Component {
    constructor(){
        super()
        this.state={
            email:"",
            pwd:""
        }
    }
    submitEmail=async(email,pwd)=>{
      if(email && pwd){
          try{
              const response = await firebase.auth().signInWithEmailAndPassword(email,pwd)
              if(response){
                  this.props.navigation.navigate('TransactionScreen')
              }
          }
          catch(error){
              switch(error.code){
                  case 'auth/user-not-found':
                  alert("User not found")
                  break;
                  case 'auth/invalid-email':
                  alert("Invalid email or password")
                  break;
              }
          }
      }
      else{
          alert("Enter Email or password")
      }
    }

    render(){
        return(
            <View style={styles.container}>
            <TextInput
            style={styles.inputBox}
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={(text)=>{
            this.setState({
                email:text
            })

            }}>
            </TextInput>
            <TextInput
            style={styles.inputBox}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text)=>{
            this.setState({
                 pwd:text
            })

            }}>
                </TextInput>
           <TouchableOpacity
        style={styles.submitButton}
        onPress={()=>{
          this.submitEmail(this.state.email,this.state.pwd)
          console.log("0")
        }}
        >
        <Text style={styles.buttonText}>Submit</Text>

        </TouchableOpacity>

            
            
            </View>

        )
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgb(142, 188, 238)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text:{
      fontSize:15,
      marginTop:10
    },
    scanButton: {
      
      width: 150,
      backgroundColor: 'lightblue',
      borderRadius: 25,
      borderColor: 'black',
      borderWidth: 3,
      fontWeight: 'bold',
      fontSize: 15,
      marginLeft: 'center',
      marginRight: 'center',
      textAlign: 'center',
      marginTop:10,
    },
    scanButtonStBk: {
    
      width: 100,
      backgroundColor: 'lightblue',
      borderRadius: 25,
      borderColor: 'black',
      borderWidth: 2,
      fontWeight: 'bold',
      fontSize: 15,
      marginLeft: 100,
      marginRight: 'center',
      textAlign: 'center',
      marginTop: 20
    },
  
    buttonText: {
      fontWeight: 'bold',
      fontSize: 15,
  
    },
    inputBox: {
      width: 300,
      height: 30,
      marginTop: 10,
      borderWidth: 1,
      fontWeight: 'bold',
      fontSize: 15,
      borderWidth: 3,
      borderRadius: 20,
      borderColor: 'black',
      lineHeight: 230,
      marginLeft: 'center',
      marginRight: 'center',
      textAlign: 'center',
    },
    submitButton:{
  
      width: 150,
      backgroundColor: 'lightblue',
      borderRadius: 25,
      borderColor: 'black',
      borderWidth: 4,
      fontWeight: 'bold',
      fontSize: 15,
      marginLeft: 'center',
      marginRight: 'center',
      textAlign: 'center',
      lineHeight:40,
      marginTop:30,
    },
    bookImage: {
      width: 100,
      height: 100,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 100
    }
  });