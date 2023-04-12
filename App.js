import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput ,
  ScrollView,
  Alert,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from './color';
import { useEffect, useState } from 'react';
import { Fontisto } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const STORAGE_KEY = "@toDos";
const VIEW_KEY = "@lastView";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [lastView, setLastView] = useState(Boolean);
  const [editMode, setEditMode] = useState(false);
  const [editInput, setEditInput] = useState("");
  
  useEffect(() => {
    loadToDos();
    loadLastView();
  }, []);
  
  const work = () => {
    setWorking(true);
    setLastView(working);
    saveLastView(lastView);
    console.log(toDos);
  }
  const travel = () => {
    setWorking(false);
    setLastView(working);
    saveLastView(lastView);
    console.log(toDos);
  }
    

  const onChangeText = (payload) => setText(payload);
  const onEditText = (payload) => setEditInput(payload);

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
      setWorking(JSON.parse(lastView));// working 상태 변경
    } catch (e) {
      console.error(e);
    }
  }

  // 로컬 스토리지 저장
  const saveTodos = async (toSave) => {
    const s = AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  
  // 로컬 스토리지 불러오기
  const loadToDos = async() => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
    s !== null ? setToDos(JSON.parse(s)) : null;
  }

  // 항목 추가
  const addToDo = async () => {
    if(text == ""){
      return;
    }

    const newToDos = {
      ...toDos,
      [(Date.now())]: { 
        text, 
        work: working,
        done: false,
        edit: false,
      },
    }
    setToDos(newToDos);
    await saveTodos(newToDos);
    setText("");
  }

  // 목록 삭제
  const deleteToDo = (key) => {
    Alert.alert(
      "Delete To Do",
      "Are you sure?", [
      {text: "Cancel"},
      {text: "Sure", onPress: () => {
        const newToDos = {...toDos};
        delete newToDos[key];
        delete newToDos["[object Object]"];
        setToDos(newToDos);
        saveTodos(newToDos);}
      }]
    )
    return;
  }

  // 목록 체크
  const doneTodo = (key) => {
    const newTodos = {...toDos};
    newTodos[key].done === true ? newTodos[key].done = false : newTodos[key].done = true;
    setToDos(newTodos);
    saveTodos(newTodos);
  }

  // 수정 기능
  const editToDo = (key) => {
    //edit
    const newTodos = {...toDos};
    newTodos[key].text = editInput;
    newTodos[key].edit = false;
    setToDos(newTodos);
    setEditInput("");
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
      <View>
      {/* Input */}
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
        {toDos && Object.keys(toDos).map(key => (
          toDos[key].work === working ? ( 
            <View style={styles.toDo} key={key}>
              {/* Check Btn */}
              <TouchableOpacity onPress={() => doneTodo(key)} style={styles.checkBtn}>
                <Text>
                    {toDos[key].done === false ? 
                      (<Fontisto name="checkbox-passive" size={18} color="white" />) 
                      :
                      (<Fontisto name="checkbox-active" size={18} color={theme.grey} />)}
                </Text>
              </TouchableOpacity>
              {/* Text */}
              {!toDos[key].edit &&
                [toDos[key].done === false ? 
                  <Text style={styles.toDoText}>{toDos[key].text}</Text>
                  :
                  <Text style={styles.doneText} >{toDos[key].text}</Text>
              ]}
              {toDos[key].edit &&
                <TextInput 
                  style={styles.editInput}
                  placeholder={editInput} 
                  onChangeText={onEditText}
                  returnKeyType='done'
                  value={editInput}
                />
              }
              {/* Edit Btn */}
              {!editMode &&
                <TouchableOpacity onPress={() => {setEditMode(true); toDos[key].edit=true;}}>
                  <Text style={styles.editBtn}>
                    <AntDesign name="edit" size={18} color={theme.dark} />
                  </Text>
                </TouchableOpacity>
              }
              {toDos[key].edit &&
                <TouchableOpacity onPress={() => {setEditMode(false); toDos[key].edit=false; editToDo(key);}}>
                  <Text style={styles.editBtn}>
                    <Fontisto name="save" size={18} color={theme.dark} />
                  </Text>
                </TouchableOpacity>
              }
              {/* Delete Btn */}
              <TouchableOpacity onPress={() => deleteToDo(key)}>
                <Text>
                  <Fontisto name="trash" size={18} color={theme.dark} />
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
  checkBtn: {
    flex: 0.2,
  },
  toDo: {
    backgroundColor:theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 20,
  },
  toDoText: {
    flex:2,
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  doneText: {
    flex:2,
    color: theme.dark,
    fontSize: 15,
    fontWeight: "400",
    textDecorationLine: 'line-through',
  },
  editBtn:{
    marginRight: 10,
  },
  editInput: {
    flex: 1,
    backgroundColor:'white',
    borderRadius: 10,
    marginRight: 20,
    paddingHorizontal: 10,
    marginBottom: -4,
    marginTop: -4,
  },
});
