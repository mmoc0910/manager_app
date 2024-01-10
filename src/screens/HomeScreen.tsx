import { ScrollView, View } from "react-native";
import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { StyledComponent } from "nativewind";
import { NavigationProp, useIsFocused } from "@react-navigation/native";
import { ClassType, RootStackParamList } from "../../types";
import HeaderCustom from "../components/HeaderCustom";
import { SvgXml } from "react-native-svg";
import { plusCircleXML } from "../icons";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CustomText from "../components/texts/CustomText";
import { api } from "../../api";
import ClassCard from "../components/class/ClassCard";

type HomeScreenProps = {
  navigation: NavigationProp<RootStackParamList, "Home">;
};

const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
  const { accessToken, role, _id } = useSelector(
    (state: RootState) => state.auth
  );
  console.log("role - ", role);
  const isFocused = useIsFocused();
  const [listClass, setListClass] = useState<ClassType[]>([]);
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
          contentRight={() =>
            role === 2 ? (
              <SvgXml
                xml={plusCircleXML}
                width={26}
                height={26}
                color={"#000"}
                onPress={() => {
                  navigation.navigate("AddClass");
                }}
              />
            ) : null
          }
        />
      ),
    });
  }, [navigation, role]);
  useEffect(() => {
    if (!accessToken) {
      navigation.navigate("LogIn");
    }
  }, []);
  useEffect(() => {
    if (isFocused) {
      (async () => {
        try {
          const result = await api.get<ClassType[]>(
            `/classes?${role === 1 ? "students" : "teacher"}=${_id}`,
            {
              headers: { Authorization: accessToken },
            }
          );
          console.log("result - ", result.data);
          setListClass(result.data);
        } catch (error) {
          console.log("error - ", error);
        }
      })();
    }
  }, [isFocused]);
  return (
    <StyledComponent component={View} className="flex-1 bg-white">
      <StyledComponent component={ScrollView} className="p-5">
        <StyledComponent component={View}>
          <CustomText
            fontFamily="Montserrat-Medium"
            classes="uppercase text-base"
          >
            Danh sách lớp học
          </CustomText>
          <StyledComponent
            component={View}
            className="flex-row flex-wrap justify-between"
          >
            {listClass.length > 0 ? (
              listClass.map((dclass) => (
                <ClassCard key={dclass._id} dclass={dclass} />
              ))
            ) : (
              <CustomText classes="text-gray-500 mt-5">
                {role === 1
                  ? "Bạn chưa được thêm vào lớp học nào, liên hệ giáo viên để thêm bạn vào lớp"
                  : role === 2
                  ? "Bạn chưa thêm lớp lớp học nào"
                  : ""}
              </CustomText>
            )}
          </StyledComponent>
        </StyledComponent>
      </StyledComponent>
    </StyledComponent>
  );
};

export default HomeScreen;
