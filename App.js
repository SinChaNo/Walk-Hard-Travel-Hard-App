import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput ,
  ScrollView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from './color';
import { useEffect, useState } from 'react';
import { Fontisto } from '@expo/vector-icons';

const STORAGE_KEY = "@toDos";
const VIEW_KEY = "@lastView";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [lastView, setLastView] = useState(Boolean);
  
  useEffect(() => {
    loadToDos();
    loadLastView();
    console.log(toDos);
  }, []);
  
  const work = () => {
    setWorking(true);
    setLastView(working);
    console.log("---버튼 누른 후---")
    console.log(lastView);
    saveLastView(lastView);
  }
  const travel = () => {
    setWorking(false);
    setLastView(working);    
    console.log("---버튼 누른 후---")
    console.log(lastView);
    saveLastView(lastView);
  }
    

  const onChangeText = (payload) => setText(payload);

  // 마지막 뷰 정보 저장
  const saveLastView = async (lastView) => {
    try {
      const e = await AsyncStorage.setItem(VIEW_KEY, JSON.stringify(lastView));
    } catch (e) {
      console.error(e);
    }
  };

  // 마지막 뷰 정보 불러오기
  const loadLastView = async() => {
    try {
      const lastView = await AsyncStorage.getItem(VIEW_KEY);
      console.log("---불러오기---");
      setWorking(JSON.parse(lastView));// working 상태 변경
    } catch (e) {
      console.log("---불러온 후---");
      console.log(working); 
      console.error(e);
    }
  }

  // 로컬 스토리지 저장
  const saveTodos = async (toSave) => {
    const s = AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    console.log(s);
  };
  
  // 로컬 스토리지 불러오기
  const loadToDos = async() => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
    s !== null ? setToDos(JSON.parse(s)) : null;
  }

  const addToDo = async () => {
    if(text == ""){
      return;
    }

    const newToDos = {
      ...toDos,
      [Date.now()]: { text, work: working},
    }
    setToDos(newToDos);
    await saveTodos(newToDos);
    setText("");
  }

  const deleteToDo = (key) => {
    Alert.alert(
      "Delete To Do",
      "Are you sure?", [
      {text: "Cancel"},
      {text: "Sure", onPress: () => {
        const newToDos = {...toDos};
        delete newToDos[key];
        setToDos(newToDos);
        saveTodos(newToDos);}
      }]
    )
    return;
  }

  // 마지막 선택한 작업에 따라 적절한 헤더 텍스트 표시
  const getHeader = () => {
    if (lastView === null || lastView === true) {
      return setWorking(true);
    } else {
      return setWorking(false);
    }
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
              <TouchableOpacity onPress={() => deleteToDo(key)}>
                <Text>
                  <Fontisto name="trash" size={18} color={theme.gray} />
                </Text>
              </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
  },
  toDoText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
});
