import {firestore} from 'src/utils/firebase';

//내 데이터 가져오기
export const getUserdata = async usercode => {
  const userCollection = await firestore()
    .collection('users')
    .doc(usercode)
    .get();
  const userData = userCollection.data();

  return userData;
};

//이메일이나 닉 넣으면 유저코드를 줌
export const getUsercode = async userEmail => {
  const userCollection = await firestore().collection('users').get();
  let userList = [];
  userCollection.docs.forEach(doc => {
    const data = doc.data();
    userList.push({
      id: doc.id,
      email: data.email,
      nickname: data.nickname,
    });
  });

  let usercode = '';
  for (let i = 0; i < userList.length; i++) {
    if (userEmail === userList[i].email || userEmail === userList[i].nickname) {
      usercode = userList[i].id;
      break;
    }
  }

  return usercode;
};

export const getUsercodeByNickname = async nickname => {
  const userCollection = await firestore().collection('users').get();
  const userList = userCollection.docs.map(doc => doc.data());
  const usercode = userList.find(user => user.nickname === nickname)?.id;
  return usercode;
};
