import { View, Text, Image, Pressable } from "react-native";
import React, { FC } from "react";
import { StyledComponent } from "nativewind";
import { SvgXml } from "react-native-svg";
import { accountXML, arrowLongLeftXML } from "../icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import CustomText from "./texts/CustomText";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

type HeaderCustomProps = {
  back?: {
    title: string;
  };
  title?: string;
  contentRight?: () => React.ReactNode;
  onPressBack?: () => void;
};

const HeaderCustom: FC<HeaderCustomProps> = ({
  back,
  contentRight,
  title,
  onPressBack,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { name, role } = useSelector((state: RootState) => state.auth);
  return (
    <StyledComponent
      component={View}
      className="items-center flex-row justify-between pb-4 pt-5 px-5 bg-white"
      style={{ backgroundColor: "#fff", elevation: 5 }}
    >
      {back ? (
        <StyledComponent
          component={Pressable}
          className="flex-row items-center"
        >
          <SvgXml
            xml={arrowLongLeftXML}
            width={24}
            height={24}
            color={"#000"}
            onPress={() => {
              if (onPressBack) {
                onPressBack();
              } else {
                navigation.goBack();
              }
            }}
          />
          {title ? (
            <CustomText
              fontFamily="Montserrat-Medium"
              classes="text-lg ml-4 mr-10"
              textProps={{ numberOfLines: 1, lineBreakMode: "tail" }}
            >
              {title}
            </CustomText>
          ) : null}
        </StyledComponent>
      ) : (
        <StyledComponent
          component={Pressable}
          className="flex-row gap-2"
          onPress={() => navigation.navigate("Profile")}
        >
          <StyledComponent
            component={Image}
            source={{ uri: "abc" }}
            className="w-10 h-10 rounded-full bg-slate-600"
          />
          <StyledComponent component={View}>
            <CustomText fontFamily="Montserrat-Medium">{name}</CustomText>
            <CustomText>
              {role === 1
                ? "Tài khoản sinh viên"
                : role === 2
                ? "Tài khoản giáo viên"
                : ""}
            </CustomText>
          </StyledComponent>
        </StyledComponent>
      )}
      {contentRight ? contentRight() : null}
    </StyledComponent>
  );
};

export default HeaderCustom;
