import React, { useEffect, useRef, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View, Alert, Animated, Image } from 'react-native';
import database, { firebase } from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GestureHandlerRootView, Swipeable, TouchableOpacity } from 'react-native-gesture-handler';
import fcolors from '../src/assets/colors/fcolors';
import BText from '../src/components/common/BText';
import RText from '../src/components/common/RText';
import NeonGr from '../src/components/neongr';
import LinearGradient from 'react-native-linear-gradient';
import firestore, { FieldValue } from "@react-native-firebase/firestore";
import DialogInput from 'react-native-dialog-input';
import BottomBar from '../src/components/common/BottomBar';
import { useUser } from '../src/components/common/UserContext';

const mycode = 'GPlyn';

function FriendList({ navigation: { navigate } }) {
  const [isMore, setMore] = useState(false);
  const [users, setUsers] = useState([]);
  const [showaddf, setshowaddf] = useState(false);

  //유저코드 가져오기
  const { usercode } = useUser();

  // 친구 추가 코드
  async function add_frd(frdcode) {
    // 해당 친구가 있는지 확인
    const usersCollection = await firestore().collection('users').doc(frdcode).get();
    const db = usersCollection.data();
    if (db) {
      console.log("있는뎁쇼");
      // 추가
      const userCollection = firestore().collection("users").doc(usercode);
      userCollection.update("friend", FieldValue.arrayUnion(frdcode));

      //상대 쪽에도 추가
      const userCollection1 = firestore().collection("users").doc(frdcode);
      userCollection1.update("friend", FieldValue.arrayUnion(usercode));

      // 새 친구를 추가하고 상태를 업데이트
      setUsers(prevState => [...prevState, { ...db, id: prevState.length + 1, code: frdcode }]);


    } else {
      console.log("없음");
      Alert.alert('', '해당 친구코드는 없는 코드입니다.');
    }
  };

  // 친구 삭제 코드
  function delete_frd(frdcode) {
    const userCollection = firestore().collection("users").doc(usercode);
    userCollection.update({
      friend: FieldValue.arrayRemove(frdcode)
    });
  };

  // 친구 ID 가져오기
  const get_frdid = async () => {
    const usersCollection = await firestore().collection('users').doc(usercode).get();
    const db = usersCollection.data();
    console.log(db.friend);
    return db.friend;
  };

  // 친구 목록 불러오기
  const frd_info = async () => {
    try {
      console.log('돌아감');
      let frdid = await get_frdid();
      console.log(frdid);
      let updatedUsers = [];
      for (let id = 0; id < frdid.length; id++) {
        const usersCollection = await firestore().collection('users').doc(frdid[id]).get();
        const db = usersCollection.data();
        updatedUsers.push({ ...db, id: id + 1, code: frdid[id] });
        console.log(db);
      }
      setUsers(updatedUsers);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    frd_info();
  }, []);

  const [collapsed, setCollapsed] = useState(true);

  const rotateAnimValueRef = useRef(new Animated.Value(0));

  useEffect(() => {
    const targetValue = collapsed ? 0 : 1;

    const config = {
      duration: 200,
      useNativeDriver: false,
      toValue: targetValue,
    };

    Animated.parallel([
      Animated.timing(rotateAnimValueRef.current, config),
    ]).start();
  }, [collapsed]);

  // 친구 목록
  const renderItem = ({ item }) => {
    const isExpanded = item.id === moreview;
    console.log(item);

    return (
      <View style={[styles.friendbox, isExpanded ? { height: 196 } : null]}>
        {/* 친구 프사 */}
        <View style={{ flexDirection: 'row' }}>
          <Image source={require('../src/assets/images/userframe.png')}
            style={{
              width: 47,
              height: 47,
              marginRight: 20
            }}
          />

          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'column' }}>
              <BText fontSize={16} style={{ marginBottom: 4 }}>{item.nickname}</BText>
              <NeonGr><RText color={fcolors.gray4}>{item.intro}</RText></NeonGr>
            </View>
            <View style={{ position: 'absolute', left: 210, top: -5 }}>
              <TouchableOpacity onPress={() => { more_frd(item.id), setCollapsed(!collapsed) }}>
                <Animated.View
                  style={[
                    {
                      transform: [
                        {
                          rotate: rotateAnimValueRef.current.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '180deg'],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Icon name='expand-more' size={30} color={!collapsed ? fcolors.blue : fcolors.gray2} />
                </Animated.View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 추가되는 내용 */}
        {isExpanded && (
          <>
            <View style={{ marginTop: 15, flexDirection: 'row', flexWrap: 'wrap' }}>
              {item.trvtg.map((ele) => (
                <View style={styles.tgbox} key={ele}>
                  <RText fontSize={13}>{ele}</RText>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    )
  };

  // 친구추가 버튼 이벤트
  const [smallboxVisible, setSmallboxVisible] = useState(false);

  const toggleMenu = () => {
    setSmallboxVisible(!smallboxVisible);
  };

  // 친구 확대 버튼 이벤트
  const [moreview, setmoreview] = useState(null);

  const more_frd = (id) => {
    setmoreview(moreview === id ? null : id);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, marginTop: 10, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigate('main')}><Icon name='arrow-back-ios' size={24} color="#717171" /></TouchableOpacity>
          <BText fontSize={18}>친구 목록</BText>
          <TouchableOpacity onPress={toggleMenu}>
            <Icon name='person-add-alt' size={24} color="#717171" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />

        {smallboxVisible && (
          <>
            <TouchableOpacity style={styles.smallbox} onPress={() => setshowaddf(true)}>
              <Text style={{ color: fcolors.blue }}>친구 추가하기</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.smallbox1} onPress={() => add_frd('tmBaD')}>
              <Text style={{ color: fcolors.blue }}>친구 초대하기</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <BottomBar></BottomBar>

      <DialogInput
        isDialogVisible={showaddf}
        message={'친구 코드를 입력해주세요.'}
        dialogStyle={{ backgroundColor: 'white', borderRadius: 10 }}
        textInputProps={{
          autoCorrect: false,
          autoCapitalize: false,
          maxLength: 10,
        }}
        hintInput={this.state?.name}
        initValueTextInput={""}
        submitText={'추가'}
        cancelText={'취소'}
        submitInput={(inputNickName) => {
          if (inputNickName.trim() == "")
            Alert.alert('', '공백은 추가할 수 없습니다.');
          else {
            console.log(inputNickName);
            add_frd(inputNickName);
            setshowaddf(false);
          }
        }}
        closeDialog={() => {
          setshowaddf(false);
        }}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: fcolors.white,
    flexDirection: 'column'
  },
  friendbox: {
    width: '100%',
    height: 74,
    borderRadius: 10,
    backgroundColor: fcolors.lblue,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
    marginBottom: 10,
    zIndex: 1
  },
  tgbox: {
    height: 34,
    backgroundColor: fcolors.white,
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 10,
    marginRight: 15,
    marginVertical: 9,
  },
  friendbox1: {
    width: '100%',
    height: 196,
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: fcolors.lblue,
    padding: 20,
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 10,
  },
  frd_delet: {
    width: 76,
    height: 74,
    backgroundColor: fcolors.orange,
    alignItems: 'center',
    justifyContent: 'center'
  },
  smallbox: {
    position: 'absolute',
    right: -10,
    top: -630,
    backgroundColor: fcolors.skyblue,
    padding: 8,
    borderRadius: 10,
    zIndex: 10,
    elevation: 4
  },
  smallbox1: {
    position: 'absolute',
    right: -10,
    top: -680,
    backgroundColor: fcolors.skyblue,
    padding: 8,
    borderRadius: 10,
    zIndex: 11,
    elevation: 4
  }
});

export default FriendList;
