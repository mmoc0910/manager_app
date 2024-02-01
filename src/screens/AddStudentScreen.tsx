import { View, Text, Pressable } from "react-native";
import React, { FC, useLayoutEffect, useState } from "react";
import { StyledComponent } from "nativewind";
import HeaderCustom from "../components/HeaderCustom";
import CustomText from "../components/texts/CustomText";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { AuthType, RootStackParamList } from "../../types";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { SvgXml } from "react-native-svg";
import { searchXML } from "../icons";
import { api } from "../../api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import _ from "lodash";

type AddStudentProps = {
  navigation: NavigationProp<RootStackParamList, "AddStudent">;
  route: RouteProp<RootStackParamList, "AddStudent">;
};
const AddStudentScreen: FC<AddStudentProps> = ({ navigation, route }) => {
  const {
    dclass: { students, _id: class_id },
  } = route.params;
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [search, setSearch] = useState<string>();
  const [searchStudents, setSearchStudents] = useState<AuthType[]>([]);
  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({
        back,
      }: {
        back?: {
          title: string;
        };
      }) => <HeaderCustom back={back} title={"Thêm sinh viên"} />,
    });
  }, [navigation]);
  const fetchStudent = async () => {
    if (search) {
      try {
        const result = await api.get<AuthType[]>(
          `/users?role=1&name=${search}`,
          {
            headers: { Authorization: accessToken },
          }
        );
        console.log("result - ", result.data);
        setSearchStudents(result.data.filter((item) => item.role === 1));
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleAddStudent = async (_id: string) => {
    try {
      const new_students = _.concat(_.map(students, "_id"), [_id]);
      console.log("new student - ", new_students);
      const result = await api.patch(
        `/classes/${class_id}`,
        { students: new_students },
        { headers: { Authorization: accessToken } }
      );
      console.log("result add student - ", result.data);
      navigation.goBack();
    } catch (error) {
      console.log("error - ", error);
    }
  };
  return (
    <StyledComponent component={View} className="flex-1 bg-white p-5">
      <StyledComponent
        component={View}
        className="flex-row items-stretch gap-3 mb-5"
      >
        <StyledComponent
          component={TextInput}
          className="border border-black rounded-full px-4 py-[6] text-sm flex-1"
          style={{ fontFamily: "Montserrat" }}
          onChangeText={(text: string) => setSearch(text)}
          placeholder="Tìm kiếm"
        />
        <StyledComponent
          component={Pressable}
          className="w-10 h-10 rounded-full bg-black items-center justify-center"
          onPress={() => fetchStudent()}
        >
          <SvgXml xml={searchXML} width={20} height={20} color={"#fff"} />
        </StyledComponent>
      </StyledComponent>

      <FlatList
        data={searchStudents}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        renderItem={({ item }) => (
          <StyledComponent
            component={View}
            className="flex-row items-center justify-between"
          >
            <StyledComponent component={View} className="flex-row items-center">
              <StyledComponent
                component={View}
                className="w-10 h-10 rounded-full bg-slate-500 mr-3"
              />
              <CustomText fontFamily="Montserrat-Medium" classes="text-base">
                {item.name}
              </CustomText>
            </StyledComponent>
            {!students.some((stu) => stu._id === item._id) ? (
              <CustomText
                fontFamily="Montserrat-Medium"
                classes="text-base text-[#74b9ff]"
                textProps={{ onPress: () => handleAddStudent(item._id) }}
              >
                Thêm
              </CustomText>
            ) : null}
          </StyledComponent>
        )}
        ItemSeparatorComponent={() => (
          <StyledComponent component={View} className="h-4" />
        )}
      />
    </StyledComponent>
  );
};

export default AddStudentScreen;
