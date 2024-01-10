import { Pressable, View } from "react-native";
import React, { FC } from "react";
import { StyledComponent } from "nativewind";
import CustomText from "../texts/CustomText";
import { ClassType, RootStackParamList } from "../../../types";
import { NavigationProp, useNavigation } from "@react-navigation/native";

type ClassCardProps = { dclass: ClassType };
const ClassCard: FC<ClassCardProps> = ({ dclass }) => {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Home">>();
  return (
    <StyledComponent
      component={Pressable}
      onPress={() =>
        navigation.navigate("ClassDetail", {
          class_id: dclass._id,
          class_name: dclass.name,
        })
      }
      className="bg-slate-300 rounded-xl aspect-square p-4 h-[100] mt-5"
      style={{ width: "47%" }}
    >
      <StyledComponent
        component={View}
        className="w-16 h-16 rounded-full item-center justify-center bg-white self-center mb-2"
      ></StyledComponent>
      <CustomText
        fontFamily="Montserrat-Medium"
        classes="text-center"
        textProps={{ lineBreakMode: "tail", numberOfLines: 2 }}
      >
        {dclass.code} - {dclass.name}
      </CustomText>
      <CustomText classes="text-gray-500 text-center">
        {dclass.students.length} sinh viên
      </CustomText>
    </StyledComponent>
  );
};

export default ClassCard;
