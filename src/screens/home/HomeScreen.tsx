// @ts-nocheck
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, View} from 'react-native';
// import database from '@react-native-firebase/database';
import {
  GestureHandlerRootView,
  ScrollView,
  // ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';

import Mt_Icon from 'react-native-vector-icons/MaterialIcons';
import MtC_Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import {useNavigation} from '@react-navigation/native';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import fcolor from '../../assets/colors/fcolors';
import BText from 'src/components/common/BText';
import RText from 'src/components/common/RText';
// import LinearGradient from 'react-native-linear-gradient';
import MText from 'src/components/common/MText';
// import NeonGr from '../src/components/neongr';
import BottomBar from 'src/components/common/BottomBar';
import {useUser} from 'src/context/UserContext';
import {useFocusEffect} from '@react-navigation/native';
import {firestore} from 'src/utils/firebase';
import NeonGr from 'src/components/neongr';
import {getPlan, havePlan} from 'src/components/common/getPlan';
import globalStyles from 'src/assets/styles/globalStyles';
import TypeBox from 'src/components/common/TypeBox';
import {getUserdata} from 'src/components/common/getUserdata';
import {daySlice, getDay, getTime} from 'src/components/common/dataManagement';
import ReservationBox from 'src/components/common/reservationBox';
import {usePlan} from 'src/context';

function HomeScreen({navigation}: {navigation: any}) {
  //저장된 유저명
  const {userData} = useUser();
  const {planListData} = usePlan();
  //닉네임
  const [user, setUser] = useState('');

  //일정이 있음
  const [have, setHave] = useState(false);

  //일정 제목 데이터
  const [plan, setPlan] = useState({
    title: '',
    dayNumber: 0,
    date: '',
    dayOfWeek: '',
    place: '',
  });
  //일정 리스트 데이터
  const [planList, setPlanList] = useState([]);

  //무한반복 막는 용
  const [count, setCount] = useState(0);

  //임시 추천여행지 데이터
  const data = [
    {
      image: require('src/assets/images/home/recommandImage1.jpg'),
      location: '양양 서피비치',
      locationInfo: '국내에서 만나는 이국적인 바다 감성',
    },
    {
      image: require('src/assets/images/home/recommandImage2.jpg'),
      location: '제주 협재 해수욕장',
      locationInfo: '에메랄드빛 바다가 펼쳐지는 제주도 대표 해변',
    },
    {
      image: require('src/assets/images/home/recommandImage3.jpg'),
      location: '강릉 주문진',
      locationInfo: '푸른 바다와 함께하는 힐링 여행지',
    },
    {
      image: require('src/assets/images/home/recommandImage4.jpg'),
      location: '부산 해운대',
      locationInfo: '도시와 바다가 만나는 국내 대표 해수욕장',
    },
    {
      image: require('src/assets/images/home/recommandImage5.jpg'),
      location: '여수 오동도',
      locationInfo: '아름다운 동백꽃과 푸른 바다가 어우러진 섬',
    },
  ];
  //임시 가볼만한 곳 데이터
  // const data1 = [
  //   {
  //     image: require('src/assets/images/home/recommandImage1.jpg'),
  //     location: '올레길',
  //     locationInfo: '자연을 만끽하며 걷는 트레킹 코스',
  //   },
  //   {
  //     image: require('src/assets/images/home/recommandImage1.jpg'),
  //     location: '올레길',
  //     locationInfo: '자연을 만끽하며 걷는 트레킹 코스',
  //   },
  //   {
  //     image: require('src/assets/images/home/recommandImage1.jpg'),
  //     location: '올레길',
  //     locationInfo: '자연을 만끽하며 걷는 트레킹 코스',
  //   },
  // ];

  const getPlanlist = async () => {
    try {
      const userdata = await getUserdata(usercode);
      const {have, mainPlan} = await havePlan(usercode);
      setUser(userdata);
      setHave(have);

      if (have) {
        const {dayNumber, planData, planData1} = await getPlan(mainPlan);
        console.log(dayNumber);
        const {date, dayOfWeek} = daySlice(planData.dayList[dayNumber - 1]);

        setPlan({
          title: planData.title,
          dayNumber: dayNumber,
          date: date,
          dayOfWeek: dayOfWeek,
          place: planData.place,
        });

        const planFour = planData1.slice(0, 4);
        setPlanList(planFour);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // useEffect(() => {
  //   console.log(
  //     '✅ PlanContext planData:\n',
  //     JSON.stringify(planListData, null, 2),
  //   );
  // }, [planListData]);

  // useFocusEffect(
  //   useCallback(() => {
  //     getPlanlist();
  //   }, [usercode]),
  // );

  //추천 여행지
  const recomRenderItem = ({item, index}) => {
    return (
      <View>
        <Image
          source={item.image}
          style={{width: 244, height: 142, borderRadius: 8}}
        />
        <View style={{paddingVertical: 8, gap: 4}}>
          <BText fontSize={17}>{item.location}</BText>
          <MText fontSize={13} color={fcolor.gray3}>
            {item.locationInfo}
          </MText>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: fcolor.white}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: 12,
          paddingTop: Platform.OS === 'ios' ? 60 : 20,
          paddingHorizontal: 25,
          backgroundColor: fcolor.white,
        }}>
        <Image
          source={require('src/assets/images/home/logo_blue.png')}
          style={{width: 89, height: 34}}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <MtC_Icon name="bell" size={22} color={fcolor.gray4} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Friend')}>
            <Mt_Icon
              name="group"
              size={25}
              color={fcolor.gray4}
              style={{marginLeft: 15}}
            />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={[]}
        style={{flex: 1}}
        renderItem={null}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <>
            <View
              style={{
                paddingBottom: 10,
                paddingHorizontal: 25,
                paddingTop: 20,
                backgroundColor: fcolor.white,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <BText fontSize={17} style={{fontWeight: 'bold'}}>
                  {have ? plan.title : '여행 떠나기'}
                </BText>
                {have && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('main1')}>
                    <RText color={fcolor.gray4}>상세보기{'>'}</RText>
                  </TouchableOpacity>
                )}
              </View>
              <View style={{justifyContent: 'center', marginVertical: 30}}>
                <View style={{alignItems: 'center', gap: 4}}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('PlanMake')}>
                    <Image
                      source={require('src/assets/images/home/homeAddPlan.png')}
                      style={{width: 128, height: 128, margin: 5}}
                    />
                  </TouchableOpacity>
                  <MText fontSize={14} color={fcolor.gray4}>
                    아직 일정이 없어요.
                  </MText>
                  <MText fontSize={14} color={fcolor.gray4}>
                    플래닝과 함께 일정을 세워볼까요?
                  </MText>
                </View>
              </View>
            </View>
            <View style={{height: 3, backgroundColor: fcolor.gray1}} />
            <View
              style={{
                paddingHorizontal: 25,
                paddingVertical: 20,
              }}>
              <BText
                fontSize={17}
                style={{fontWeight: 'bold', marginBottom: 5}}>
                {have
                  ? plan?.place + '에서 가볼만한 곳'
                  : userData?.nickname + '님을 위한 추천여행지'}
              </BText>
              <MText fontSize={13} color={fcolor.gray4}>
                {have
                  ? '현재 여행중인 ' + plan?.place + '에서 여기는 어때요?'
                  : userData?.travelType + ' 여행자들이 좋아하는 여행지예요.'}
              </MText>
            </View>
            <FlatList
              data={have ? data1 : data}
              renderItem={recomRenderItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal={true}
              // style={{paddingHorizontal: 25}}
              contentContainerStyle={{paddingHorizontal: 16, gap: 16}}
              showsHorizontalScrollIndicator={false}
            />
          </>
        }
      />

      <BottomBar activeRoute="Home" />
    </View>
  );
}

export default HomeScreen;
