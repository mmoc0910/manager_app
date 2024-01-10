import { View, Text, Pressable } from "react-native";
import React, { FC } from "react";
import { StyledComponent } from "nativewind";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomText from "../components/texts/CustomText";
import InputAuthCustom from "../components/form/InputAuthCustom";
import { NavigationProp } from "@react-navigation/native";
import { ClassType, RootStackParamList } from "../../types";
import { api } from "../../api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

type SubmitType = {
  code: string;
  name: string;
};
type AddClassScreenProps = {
  navigation: NavigationProp<RootStackParamList, "AddClass">;
};
const schema = yup
  .object({
    name: yup.string().required("Tên lớp không được để trống"),
    code: yup.string().required("Mã lớp không được để trống"),
  })
  .required();
const AddClassScreen: FC<AddClassScreenProps> = ({ navigation }) => {
  const { accessToken, _id } = useSelector((state: RootState) => state.auth);
  console.log("access token - ", accessToken);
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data: SubmitType) => {
    console.log("data - ", data);
    const result = await api.post<{ data: ClassType }>(
      "/classes",
      { ...data, teacher: _id },
      { headers: { Authorization: `${accessToken}` } }
    );
    console.log("result add class - ", result.data.data._id);
    navigation.navigate("Home");
    try {
    } catch (error) {
      console.log("error login - ", error);
    }
  };
  return (
    <StyledComponent component={View} className="bg-white flex-1 p-5">
      <StyledComponent component={View} className="space-y-4">
        <StyledComponent component={View}>
          <InputAuthCustom control={control} name="code" placeHolder="Mã lớp" />
        </StyledComponent>
        <StyledComponent component={View}>
          <InputAuthCustom
            control={control}
            name="name"
            placeHolder="Tên lớp"
          />
        </StyledComponent>
      </StyledComponent>
      <StyledComponent
        component={Pressable}
        className="h-12 bg-black rounded-lg items-center justify-center mt-8"
        onPress={handleSubmit(onSubmit)}
      >
        <CustomText fontFamily="Montserrat-SemiBold" classes="text-white">
          Hoàn thành
        </CustomText>
      </StyledComponent>
    </StyledComponent>
  );
};

export default AddClassScreen;
