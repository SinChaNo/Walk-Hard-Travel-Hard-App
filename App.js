import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput ,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from './color';
import { useEffect, useState } from 'react';

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);

  useEffect(() => {
    loadToDos();
    console.log(toDos);
  }, [])

  // 로컬 스토리지 저장
  const saveTodos = async (toSave) => {
    const s = AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    console.log(s);
  };
  
  // 로컬 스토리지 불러오기
  const loadToDos = async() => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
  }

  const addToDo = async () => {
    if(text == ""){
      return;
    }
    
    // save to do
    // const newToDos = Object.assign(
      //   {}, 
      //   toDos, 
      //   {[Date.now()]: {text, work:working}}
      // );
      const newToDos = {
        ...toDos,
        [Date.now()]: { text, work: working},
      }
      setToDos(newToDos);
      await saveTodos(newToDos);
      setText("");
    }
    
    return (
      <View style={styles.container}>
      <StatusBar style="auto" />
      {/* Header */}
      <View style={styles.headers}>
        <TouchableOpacity onPress={work}>
          <Text style={{ ...styles.btnText, color: working ? "white" : theme.grey }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{ ...styles.btnText, color: !working ? "white" : theme.grey }}>Travel</Text>
        </TouchableOpacity>
      </View>
      {/* Input */}
      <View>
        <TextInput 
          onSubmitEditing={addToDo}
          style={styles.input} 
          placeholder={working ? "Add a To Do" : "Where Do you Want Go?"} 
          onChangeText={onChangeText}
          returnKeyType='done'
          value={text}
        />
      </View>
      {/* ToDo List */}
      <ScrollView> 
        {Object.keys(toDos).map(key => (
          toDos[key].work === working ? ( 
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
            </View> 
          ) : null
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  headers: {
    flexDirection: 'row',
    justifyContent:"space-between",
    marginTop: 100,
  },
  btnText:{
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    marginTop: 10,
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    fontSize: 15,
    marginBottom: 20,
  },
  toDo: {
    backgroundColor:theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  toDoText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
});
