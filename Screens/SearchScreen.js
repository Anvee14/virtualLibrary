import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity ,FlatList} from 'react-native';
import db from '../config'
import * as firebase from 'firebase'
import { ScrollView } from 'react-native-gesture-handler';
export default class SearchScreen extends React.Component {
  constructor(){
    super()
    this.state = {
      transactionArr:[]
    }
  }
  componentDidMount=async()=>{
    const query = await db.collection("transaction").get()
    query.docs.map((doc)=>{
      this.setState=({
        transactionArr:[...this.state.transactionArr,doc.data()]
      })  
    })

    
  }
  render() {
    return (
      <View style={styles.container}>
      <ScrollView>
        {this.state.transactionArr.map((trans,index)=>{
        return(
          <View key={index}>
            <Text>{"BookId:"+trans.BookId}</Text>
            <Text>{"StudentId:"+trans.StudentId}</Text>
            <Text>{"DateOfTrans:"+trans.dateOfTrans}</Text>
            <Text>{"type:"+trans.type}</Text>
          </View>
          
        )
        })}
      </ScrollView>
      
        <Text>Search the book</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
