import { View, Text, Image, Pressable } from "react-native";
import React, { FC, useLayoutEffect, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { AuthType, RootStackParamList } from "../../types";
import HeaderCustom from "../components/HeaderCustom";
import CustomText from "../components/texts/CustomText";
import { StyledComponent } from "nativewind";
import { ScrollView } from "react-native-gesture-handler";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputAuthCustom from "../components/form/InputAuthCustom";
import ButtonCustom from "../components/form/ButtonCustom";
import { setAuth } from "../../store/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { api } from "../../api";

type ProfileScreenProps = {
  navigation: NavigationProp<RootStackParamList, "Profile">;
};

type DataProfile = {
  username: string;
  name: string;
  address: string;
  phone: string;
};

const schema = yup
  .object({
    phone: yup.string().required("Số điện thoại không được để trống"),
    name: yup.string().required("Họ và tên không được để trống"),
    username: yup.string().required("Tên đăng nhập không được để trống"),
    address: yup.string().required("Địa chỉ không được để trống"),
  })
  .required();

const ProfileScreen: FC<ProfileScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { username, name, phone, address, accessToken, role, _id } =
    useSelector((state: RootState) => state.auth);
  const [disable, setDisable] = useState<boolean>(true);
  console.log("address - ", address);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      phone: phone ? phone : "",
      username: username ? username : "",
      address: address ? address : "",
      name: name ? name : "",
    },
  });
  console.log("error - ", errors);
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
          contentRight={() => (
            <Pressable
              onPress={() => {
                dispatch(setAuth({}));
                navigation.navigate("LogIn");
              }}
            >
              <CustomText
                fontFamily="Montserrat-Medium"
                classes="text-[#74b9ff]"
              >
                Đăng xuất
              </CustomText>
            </Pressable>
          )}
        />
      ),
    });
  });
  const onSubmit = async (data: DataProfile) => {
    console.log("data - ", data);
    const result = await api.patch<{ data: AuthType }>(
      "/users/change-info",
      { ...data, id: _id },
      {
        headers: { Authorization: accessToken },
      }
    );
    console.log("result - ", result.data);
    dispatch(setAuth(result.data.data));
    try {
    } catch (error) {
      console.log("error - ", error);
    }
  };
  return (
    <StyledComponent component={ScrollView} className="flex-1 bg-white p-5">
      <StyledComponent
        component={Image}
        source={{ uri: "abc" }}
        className="w-24 h-24 rounded-full bg-slate-500 self-center"
      />
      <StyledComponent component={View} className="pt-3">
        <CustomText
          classes="text-center text-base"
          fontFamily="Montserrat-Medium"
        >
          {name}
        </CustomText>
        <CustomText classes="text-center text-base ">
          {role === 1
            ? "Tài khoản sinh viên"
            : role === 2
            ? "Tài khoản giáo viên"
            : ""}
        </CustomText>
        <CustomText
          fontFamily="Montserrat-Medium"
          classes="text-[#74b9ff] text-center"
          textProps={{ onPress: () => setDisable(false) }}
        >
          Chỉnh sửa
        </CustomText>
      </StyledComponent>
      <StyledComponent component={View} className="pt-12 space-y-4">
        <StyledComponent component={View}>
          <InputAuthCustom
            control={control}
            name={"username"}
            placeHolder="Tên đăng nhập"
            disable={disable}
          />
        </StyledComponent>
        <StyledComponent component={View}>
          <InputAuthCustom
            control={control}
            name={"name"}
            placeHolder="Họ và tên"
            disable={disable}
          />
        </StyledComponent>
        <StyledComponent component={View}>
          <InputAuthCustom
            control={control}
            name={"phone"}
            placeHolder="Số điện thoại"
            disable={disable}
          />
        </StyledComponent>
        <StyledComponent component={View}>
          <InputAuthCustom
            control={control}
            name={"address"}
            placeHolder="Địa chỉ"
            disable={disable}
          />
        </StyledComponent>
        <StyledComponent
          component={Pressable}
          className="mt-3 mb-20"
          onPress={handleSubmit(onSubmit)}
        >
          <ButtonCustom content="Hoàn thành" disable={disable} />
        </StyledComponent>
      </StyledComponent>
    </StyledComponent>
  );
};

export default ProfileScreen;
