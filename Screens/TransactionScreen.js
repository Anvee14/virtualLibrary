import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image ,KeyboardAvoidingView,ToastAndroid,Alert,TextInput } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import db from '../config'
import * as firebase from 'firebase'

export default class TransactionScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      hasCameraPermissions: null,
      scanned: false,
      scanData: "",
      buttonState: "Normal",
      scanBookId: "",
      scanStudentId: "",
      transactionMessage:""
    }
  }

  handleBarcodeScan = async ({ type, data }) => {
    const { buttonState } = this.state
    if (buttonState == "bookId") {
      this.setState({
        scanned: true,
        scanBookId: data,
        buttonState: "Normal"
      })
    } else if (buttonState == "studentId") {
      this.setState({
        scanned: true,
        scanStudentId: data,
        buttonState: "Normal"
      })
    }
  }
  //request for camera permissions
  getCameraPermissions = async (id) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermissions: status === "granted",
      buttonState: id,
      scanned: false
    })
  }
  checkStudentEligibilityForIssue=async()=>{
    const studentRef = await db.collection("student").where("studentId","==",this.state.scanStudentId).get()
    var isStudentEligible=""
    if(studentRef.docs.length==0){
      isStudentEligible=false
      this.setState({
        scanStudentId:"",
        scanBookId:""
      })
      Alert.alert("Not verified studentId")
    }else{
      studentRef.doc.map((doc)=>{
        var student = doc.data()
        if(student.IssuedBooks<2){
          isStudentEligible=true
        }else{
          isStudentEligible=false
          this.setState({
            scanStudentId:"",
            scanBookId:""
          })
          Alert.alert("Already Issued more than two books")
        }
      })
    }
  }
  checkStudentEligibilityForReturn =async()=>{
    const transRef = await db.collection("transaction").where("BookId","==",this.state.scanBookId).limit(1).get()
    var isStudentEligible=""
    transRef.docs.map((doc)=>{
      var lastBookTrans=doc.data()
      if(lastBookTrans.studentId=this.state.scanStudentId){
        isStudentEligible=true
      }else{
        isStudentEligible=false
        this.setState({
          scanStudentId:"",
          scanBookId:""
        })
        Alert.alert("Not the same student")
      }
    })
  }
  initiateBookIssue=async()=>{
  //add a transaction
  db.collection("Transaction").add({
    'StudentId':this.state.scanStudentId,
    'BookId':this.state.scanBookId,
    'dateOftrans':firebase.firestore.Timestamp.now().toDate(),
    'type':"Issue"
  })
  //change book availability
  db.collection("Books").doc(this.state.scanBookId).update({
    'bookAvailability':false
  })
  //change no. books issued for student
  db.collection("students").doc(this.state.scanStudentId).update({
    'IssuedBooks':firebase.firestore.FieldValue.increment(1)
  })
  this.setState({
    scanStudentId:"",
    scanBookId:""
  })
  }
  initiateBookReturn=async()=>{
    //add a transaction
    db.collection("Transaction").add({
      'StudentId':this.state.scanStudentId,
      'BookId':this.state.scanBookId,
      'dateOftrans':firebase.firestore.Timestamp.now().toDate(),
      'type':"return"
    })
    //change book availability
    db.collection("Books").doc(this.state.scanBookId).update({
      'bookAvailability':true
    })
    //change no. books issued for student
    db.collection("students").doc(this.state.scanStudentId).update({
      'IssuedBooks':firebase.firestore.FieldValue.increment(-1)
    })
    this.setState({
      scanStudentId:"",
      scanBookId:""
    })
    }
    checkBookEligibility=async()=>{
      const bookRef= await db.collection("Books").where("bookId","==",this.state.scanBookId).get()
      var transactionType = ""
      if(bookRef.docs.length==0){
        transactionType=false
      }else{
        bookRef.docs.map((doc)=>{
          var book = doc.data()
          if(book.bookAvailability){
            transactionType="issue"
          }
          else{
            transactionType="return"
          }
        })
      }
      return transactionType
    }

  handleTransaction = async () => {
  var transactionType=await this.checkBookEligibility()
  if(!transactionType){
    Alert.alert("Oops!!..book not available")
    this.setState({
    scanBookId:"",
    scanStudentId:""
    })
  } 
  else if(transactionType=="Issue"){
    var isStudentEligible= await this.checkStudentEligibilityForIssue()
    if(isStudentEligible){
      this.initiateBookIssue()
      Alert.alert("Book Issued")
    }
  }else{
    var isStudentEligible= await this.checkStudentEligibilityForReturn()
    if(isStudentEligible){
      this.initiateBookReturn()
      Alert.alert("Book Return")
  
}
  }
 /* db.collection("Book").doc(this.state.scanBookId).get()
  .then((doc)=>{
    var book =doc.data()
    if(book.bookAvailibility){

      this.initiateBookIssue()
      transactionMessage= "Successfully issued"
      ToastAndroid.show(transactionMessage,ToastAndroid.SHORT)
    }
    else{
      this.initiateBookReturn()
      transactionMessage= "Successfully returned"
      ToastAndroid.show(transactionMessage,ToastAndroid.SHORT)
    }
  })
  this.setState({
    transactionMessage:transactionMessage
  })
*/
}
  render() {
    const hasCameraPermissions = this.state.hasCameraPermissions
    const scanned = this.state.scanned
    const buttonState = this.state.buttonState
    if (buttonState != "Normal" && hasCameraPermissions) {
      return (<BarCodeScanner
        onBarCodeScanned={scanned ? undefined : this.handleBarcodeScan}

      />)

    } else if (buttonState == "Normal") {
      return (
        <KeyboardAvoidingView behavior="padding" enabled >

        
        <View style={styles.container}>
          <View>
            <Image
              source={require("../assets/booklogo.jpg")}
              style={styles.bookImage}
            />

            <TextInput style={styles.inputBox}
              placeholder="Enter book Id"
              value={this.state.scanBookId}
              
            />

            <TouchableOpacity
              onPress={() => {
                this.getCameraPermissions("bookId")
              }
              }
              style={styles.scanButtonStBk}
            >
              <Text>Scan</Text>
            </TouchableOpacity>
            <TextInput style={styles.inputBox}
              placeholder="Enter student Id"
              value={this.state.scanStudentId}
            />
            <TouchableOpacity
              onPress={() => {
                this.getCameraPermissions("studentId")
              }
              }
              style={styles.scanButtonStBk}
            >
              <Text>Scan</Text>
            </TouchableOpacity>


          </View>


          <Text style={styles.text}>{hasCameraPermissions == true ? this.state.scanData : "Can't scan..Alow permission"}</Text>
          <StatusBar style="auto" />
          <TouchableOpacity onPress={this.getCameraPermissions} style={styles.scanButton}>
            <Text style={styles.buttonText}>SCAN</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={async() => {
              var transactionMessage=this.handleTransaction()
              this.setState({
                scanBookId:"",
                scanStudentId:""
              })
            }}
            style={styles.submitButton}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
      );
    }
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
