import { View, Text, Pressable, useWindowDimensions } from "react-native";
import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import HeaderCustom from "../components/HeaderCustom";
import {
  NavigationProp,
  RouteProp,
  useIsFocused,
  useRoute,
} from "@react-navigation/native";
import { ClassType, RootStackParamList } from "../../types";
import { StyledComponent } from "nativewind";
import { ScrollView } from "react-native-gesture-handler";
import { api } from "../../api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CustomText from "../components/texts/CustomText";
import { SvgXml } from "react-native-svg";
import { chatXML, plusCircleXML } from "../icons";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import _ from "lodash";
import moment from "moment";
import ExamCard from "../components/exam/ExamCard";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

type ClassDetailScreenProps = {
  navigation: NavigationProp<RootStackParamList, "ClassDetail">;
  route: RouteProp<RootStackParamList, "ClassDetail">;
};

const FirstRoute = () => {
  const route = useRoute<RouteProp<RootStackParamList, "ClassDetail">>();
  const isFocused = useIsFocused();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { class_id } = route.params;
  const [dclass, setDclass] = useState<ClassType>();
  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);
  const fetchData = async () => {
    try {
      const result = await api.get<ClassType>(`/classes/${class_id}`, {
        headers: { Authorization: accessToken },
      });
      setDclass(result.data);
      console.log("result class - ", result.data);
    } catch (error) {
      console.log("error - ", error);
    }
  };

  return (
    <StyledComponent component={ScrollView} className="bg-white flex-1 p-5">
      {dclass ? (
        <StyledComponent component={View} className="space-y-4">
          <CustomText fontFamily="Montserrat-Medium" classes="text-base">
            Thông tin lớp học
          </CustomText>
          <StyledComponent component={View} className="space-y-2">
            <CustomText classes="text-base">Mã lớp: {dclass.code}</CustomText>
            <CustomText classes="text-base">Tên lớp: {dclass.name}</CustomText>
            <CustomText classes="text-base">
              SL sinh viên: {dclass.students.length} người
            </CustomText>
            <CustomText classes="text-base">
              Giáo viên: {dclass.teacher.name}
            </CustomText>
            <CustomText classes="text-base">
              SĐT giáo viên: {dclass.teacher.phone}
            </CustomText>
          </StyledComponent>
        </StyledComponent>
      ) : null}
    </StyledComponent>
  );
};
const SecondRoute = () => {
  const route = useRoute<RouteProp<RootStackParamList, "ClassDetail">>();
  const isFocused = useIsFocused();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { class_id, class_name } = route.params;
  const [dclass, setDclass] = useState<ClassType>();
  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);
  const fetchData = async () => {
    try {
      const result = await api.get<ClassType>(`/classes/${class_id}`, {
        headers: { Authorization: accessToken },
      });
      setDclass(result.data);
      console.log("result class - ", result.data);
    } catch (error) {
      console.log("error - ", error);
    }
  };

  return (
    <StyledComponent component={ScrollView} className="bg-white flex-1">
      {dclass ? (
        <StyledComponent component={View} className="p-5">
          <StyledComponent component={View} className="space-y-5">
            <CustomText fontFamily="Montserrat-Medium" classes="text-base">
              Bài kiểm tra
            </CustomText>
            <StyledComponent component={View} className="space-y-4">
              {dclass.historyExams.length > 0 ? (
                dclass.historyExams.map((item) => (
                  <StyledComponent component={View} key={item._id}>
                    <ExamCard
                      class_id={class_id}
                      class_name={class_name}
                      exam={item}
                      historyExams={dclass.historyExams}
                    />
                  </StyledComponent>
                ))
              ) : (
                <CustomText classes="text-gray-500">
                  Chưa có bài kiểm tra nào được thêm
                </CustomText>
              )}
            </StyledComponent>
          </StyledComponent>
        </StyledComponent>
      ) : null}
    </StyledComponent>
  );
};
const ThirdRoute = () => {
  const route = useRoute<RouteProp<RootStackParamList, "ClassDetail">>();
  const isFocused = useIsFocused();
  const { accessToken, role } = useSelector((state: RootState) => state.auth);
  const { class_id } = route.params;
  const [dclass, setDclass] = useState<ClassType>();
  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);
  const fetchData = async () => {
    try {
      const result = await api.get<ClassType>(`/classes/${class_id}`, {
        headers: { Authorization: accessToken },
      });
      setDclass(result.data);
      console.log("result class - ", result.data);
    } catch (error) {
      console.log("error - ", error);
    }
  };
  const handleRemoveStudent = async (_id: string) => {
    try {
      const new_students = _.map(
        dclass?.students.filter((item) => item._id !== _id),
        "_id"
      );
      const result = await api.patch(
        `/classes/${class_id}`,
        { students: new_students },
        { headers: { Authorization: accessToken } }
      );
      fetchData();
      console.log("result add student - ", result.data);
      console.log("new student - ", new_students);
    } catch (error) {
      console.log("err0r - ", error);
    }
  };

  return (
    <StyledComponent component={ScrollView} className="bg-white flex-1 p-5">
      {dclass ? (
        <StyledComponent component={View} className="space-y-5">
          <CustomText fontFamily="Montserrat-Medium" classes="text-base">
            Danh sách sinh viên
          </CustomText>
          <StyledComponent component={View} className="space-y-3">
            {dclass.students.length > 0 ? (
              dclass.students.map((item) => (
                <StyledComponent
                  key={item._id}
                  component={View}
                  className="flex-row items-center justify-between"
                >
                  <StyledComponent
                    component={View}
                    className="flex-row items-center"
                  >
                    <StyledComponent
                      component={View}
                      className="w-10 h-10 rounded-full bg-slate-500 mr-3"
                    />
                    <CustomText
                      fontFamily="Montserrat-Medium"
                      classes="text-base"
                    >
                      {item.name}
                    </CustomText>
                  </StyledComponent>
                  {role === 2 &&
                  dclass.students.some((stu) => stu._id === item._id) ? (
                    <CustomText
                      fontFamily="Montserrat-Medium"
                      classes="text-base text-[#74b9ff]"
                      textProps={{
                        onPress: () => handleRemoveStudent(item._id),
                      }}
                    >
                      Xóa
                    </CustomText>
                  ) : null}
                </StyledComponent>
              ))
            ) : (
              <CustomText classes="text-gray-500">
                Chưa có sinh viên nào được thêm vào lớp học
              </CustomText>
            )}
          </StyledComponent>
        </StyledComponent>
      ) : null}
    </StyledComponent>
  );
};

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute,
});
const ClassDetailScreen: FC<ClassDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const isFocused = useIsFocused();
  const { accessToken, role } = useSelector((state: RootState) => state.auth);
  const { class_id, class_name } = route.params;
  const [dclass, setDclass] = useState<ClassType>();
  const [bottomSheetIndex, setBottomSheetIndex] = useState<number>(-1);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25"], []);
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Tổng quan" },
    { key: "second", title: "Kiểm tra" },
    { key: "third", title: "Sinh Viên" },
  ]);
  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({
        back,
      }: {
        back?: {
          title: string;
        };
      }) => (
        <HeaderCustom
          back={back}
          title={class_name}
          contentRight={() => (
            <StyledComponent
              component={View}
              className="flex-row items-center gap-4"
            >
              <SvgXml
                xml={chatXML}
                width={26}
                height={26}
                color={"#000"}
                onPress={() =>
                  navigation.navigate("Chat", {
                    class_id: class_id,
                    class_name: class_name,
                  })
                }
              />
              {role === 2 ? (
                <SvgXml
                  xml={plusCircleXML}
                  width={26}
                  height={26}
                  color={"#000"}
                  onPress={() => {
                    if (bottomSheetIndex === -1) {
                      bottomSheetRef.current?.snapToIndex(0);
                    }
                  }}
                />
              ) : null}
            </StyledComponent>
          )}
        />
      ),
    });
  }, [bottomSheetIndex, navigation, class_id]);
  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);
  const fetchData = async () => {
    try {
      const result = await api.get<ClassType>(`/classes/${class_id}`, {
        headers: { Authorization: accessToken },
      });
      setDclass(result.data);
      console.log("result class - ", result.data);
    } catch (error) {
      console.log("error - ", error);
    }
  };
  // const handleRemoveStudent = async (_id: string) => {
  //   try {
  //     const new_students = _.map(
  //       dclass?.students.filter((item) => item._id !== _id),
  //       "_id"
  //     );
  //     const result = await api.patch(
  //       `/classes/${class_id}`,
  //       { students: new_students },
  //       { headers: { Authorization: accessToken } }
  //     );
  //     fetchData();
  //     console.log("result add student - ", result.data);
  //     console.log("new student - ", new_students);
  //   } catch (error) {
  //     console.log("err0r - ", error);
  //   }
  // };
  const handleSheetChanges = useCallback((index: number) => {
    // console.log("bottom sheet index - ", index);
    setBottomSheetIndex(index);
  }, []);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );
  if (dclass)
    return (
      <>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: "black" }}
              style={{ backgroundColor: "white" }}
              renderLabel={({ route, focused, color }) => (
                <CustomText classes="text-base" fontFamily="Montserrat-Medium">
                  {route.title}
                </CustomText>
              )}
              activeColor="#000"
              inactiveColor="#000"
            />
          )}
        />
        {/* <StyledComponent component={ScrollView} className="bg-white flex-1">
          {dclass ? (
            <StyledComponent component={View} className="space-y-6 p-5">
              <StyledComponent component={View} className="space-y-2">
                <CustomText fontFamily="Montserrat-Medium" classes="text-base">
                  Thông tin lớp học
                </CustomText>
                <StyledComponent component={View}>
                  <CustomText>Mã lớp: {dclass.code}</CustomText>
                  <CustomText>Tên lớp: {dclass.name}</CustomText>
                  <CustomText>
                    SL sinh viên: {dclass.students.length} người
                  </CustomText>
                  <CustomText>Giáo viên: {dclass.teacher.name}</CustomText>
                  <CustomText>SĐT giáo viên: {dclass.teacher.phone}</CustomText>
                </StyledComponent>
              </StyledComponent>
              <StyledComponent component={View} className="space-y-2">
                <CustomText fontFamily="Montserrat-Medium" classes="text-base">
                  Sinh viên
                </CustomText>
                <StyledComponent component={View} className="space-y-3">
                  {dclass.students.length > 0 ?
                    dclass.students.map((item) => (
                      <StyledComponent
                        key={item._id}
                        component={View}
                        className="flex-row items-center justify-between"
                      >
                        <StyledComponent
                          component={View}
                          className="flex-row items-center"
                        >
                          <StyledComponent
                            component={View}
                            className="w-10 h-10 rounded-full bg-slate-500 mr-3"
                          />
                          <CustomText
                            fontFamily="Montserrat-Medium"
                            classes="text-base"
                          >
                            {item.name}
                          </CustomText>
                        </StyledComponent>
                        {role === 2 &&
                        dclass.students.some((stu) => stu._id === item._id) ? (
                          <CustomText
                            fontFamily="Montserrat-Medium"
                            classes="text-base text-[#74b9ff]"
                            textProps={{
                              onPress: () => handleRemoveStudent(item._id),
                            }}
                          >
                            Xóa
                          </CustomText>
                        ) : null}
                      </StyledComponent>
                    )) : <CustomText classes="text-gray-500">Chưa có sinh viên nào được thêm vào lớp học</CustomText>}
                </StyledComponent>
              </StyledComponent>
              <StyledComponent component={View} className="space-y-2">
                <CustomText fontFamily="Montserrat-Medium" classes="text-base">
                  Bài kiểm tra
                </CustomText>
                <StyledComponent component={View} className="space-y-4">
                  {dclass.historyExams.length > 0 ?
                    dclass.historyExams.map((item) => (
                      <StyledComponent component={View} key={item._id}>
                        <ExamCard
                          class_id={class_id}
                          class_name={class_name}
                          exam={item}
                          historyExams={dclass.historyExams}
                        />
                      </StyledComponent>
                      // <StyledComponent
                      //   key={item._id}
                      //   component={Pressable}
                      //   className="px-4 py-3 rounded-xl bg-white"
                      //   style={{ elevation: 5 }}
                      //   onPress={() => {
                      //     if (role === 1) {
                      //       navigation.navigate("DoExam", {
                      //         exam_id: item._id,
                      //         class_id,
                      //         class_name,
                      //       });
                      //     } else if (role === 2) {
                      //       navigation.navigate("AddExam", {
                      //         class_id: dclass._id,
                      //         historyExams: dclass.historyExams,
                      //         initialExam: item,
                      //       });
                      //     }
                      //   }}
                      // >
                      //   <CustomText fontFamily="Montserrat-Medium">
                      //     {item.title}
                      //   </CustomText>
                      //   <CustomText fontFamily="Montserrat-Medium">
                      //     Thời gian: {item.duration} phút
                      //   </CustomText>
                      //   <CustomText fontFamily="Montserrat-Medium">
                      //     Ngày tạo:{" "}
                      //     {moment(item.createdAt).format("HH:MM DD/MM/YYYY")}
                      //   </CustomText>
                      // </StyledComponent>
                    )) : <CustomText classes="text-gray-500">Chưa có bài kiểm tra nào được thêm</CustomText>}
                </StyledComponent>
              </StyledComponent>
            </StyledComponent>
          ) : null}
        </StyledComponent> */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          onChange={handleSheetChanges}
        >
          <StyledComponent component={View} className="flex-1 p-6">
            <CustomText
              classes="text-lg mb-2"
              fontFamily="Montserrat-Medium"
              textProps={{
                onPress: () => {
                  if (dclass) {
                    bottomSheetRef.current?.close();
                    navigation.navigate("AddStudent", { dclass: dclass });
                  }
                },
              }}
            >
              Thêm sinh viên
            </CustomText>
            <CustomText
              classes="text-lg"
              fontFamily="Montserrat-Medium"
              textProps={{
                onPress: () => {
                  bottomSheetRef.current?.close();
                  navigation.navigate("AddExam", {
                    class_id: dclass._id,
                    historyExams: dclass.historyExams,
                  });
                },
              }}
            >
              Thêm Bài kiểm tra
            </CustomText>
          </StyledComponent>
        </BottomSheet>
      </>
    );
  return;
};

export default ClassDetailScreen;
