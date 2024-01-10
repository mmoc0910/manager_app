import { View, Pressable } from "react-native";
import React, { FC, useState } from "react";
import { StyledComponent } from "nativewind";
import CustomText from "../components/texts/CustomText";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import InputAuthCustom from "../components/form/InputAuthCustom";
import { api } from "../../api";
import { AuthState } from "../../store/auth/authSlice";
import { ScrollView } from "react-native-gesture-handler";
import Checkbox from "expo-checkbox";
import { SvgXml } from "react-native-svg";
import { eyeCloseXML, eyeXML } from "../icons";

type SignInScreenProps = {
  navigation: NavigationProp<RootStackParamList, "SignIn">;
};
type DataLogin = {
  username: string;
  password: string;
  phone: string;
  name: string;
  address: string;
};

const schema = yup
  .object({
    username: yup.string().required("Tên tài khoản không được để trống"),
    name: yup.string().required("Họ và tên không được để trống"),
    password: yup.string().required("Mật khẩu không được để trống"),
    phone: yup.string().required("Số điện thoại không được để trống"),
    address: yup.string().required("Địa chỉ không được để trống"),
  })
  .required();
const SignInScreen: FC<SignInScreenProps> = ({ navigation }) => {
  const [role, setRole] = useState<1 | 2>(1);
  const [showpass, setShowPass] = useState<boolean>(true);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });
  console.log("errors - ", errors);
  // useEffect(() => {
  //   if (accessToken) {
  //     navigation.navigate("Home");
  //   }
  // }, [accessToken]);
  const onSubmit = async (data: DataLogin) => {
    console.log("data - ", data);
    try {
      const result = await api.post<{ data: AuthState }>("/auth/register", {
        ...data,
        role,
      });
      const response = result.data.data;
      console.log("result - ", response);
      navigation.navigate("LogIn");
      // dispatch(setAuth(response));
    } catch (error) {
      console.log("error signin - ", error);
      setError("username", { message: "Tên tài khoản hoặc email đã tồn tại" });
    }
  };
  return (
    <StyledComponent component={ScrollView} className="flex-1 bg-white pb-10">
      <StyledComponent component={View} className="flex-1 px-5 pt-16">
        <CustomText fontFamily="Montserrat-Medium" classes="text-2xl">
          Đăng ký
        </CustomText>
        <StyledComponent component={View} className="mt-14 space-y-3">
          <StyledComponent component={View}>
            <InputAuthCustom
              control={control}
              name={"username"}
              placeHolder="Tên tài khoản"
            />
          </StyledComponent>
          <StyledComponent component={View}>
            <InputAuthCustom
              control={control}
              name={"name"}
              placeHolder="Họ và tên"
            />
          </StyledComponent>
          <StyledComponent component={View}>
            <InputAuthCustom
              control={control}
              name={"phone"}
              placeHolder="Số điện thoại"
            />
          </StyledComponent>
          <StyledComponent component={View}>
            <InputAuthCustom
              control={control}
              name={"address"}
              placeHolder="Địa chỉ"
            />
          </StyledComponent>
          <StyledComponent component={View}>
            <InputAuthCustom
              control={control}
              name={"password"}
              placeHolder="Mật khẩu"
              inputProps={{ secureTextEntry: showpass }}
            >
              <SvgXml
                xml={showpass ? eyeCloseXML : eyeXML}
                width={22}
                height={22}
                color={"#000"}
                onPress={() => setShowPass(!showpass)}
              />
            </InputAuthCustom>
          </StyledComponent>
          <StyledComponent component={View} className="flex-row items-center">
            <Checkbox
              value={role === 2}
              onValueChange={(value: boolean) =>
                value ? setRole(2) : setRole(1)
              }
              color={true ? "#000" : undefined}
              style={{
                width: 20,
                height: 20,
                marginRight: 10,
              }}
            />
            <CustomText fontFamily="Montserrat-Medium" classes="text-base">
              Đăng ký với tư cách là giáo viên
            </CustomText>
          </StyledComponent>
        </StyledComponent>
        <StyledComponent
          component={Pressable}
          className="h-12 bg-black rounded-lg items-center justify-center mt-8"
          onPress={handleSubmit(onSubmit)}
        >
          <CustomText fontFamily="Montserrat-SemiBold" classes="text-white">
            Đăng ký
          </CustomText>
        </StyledComponent>
        <CustomText classes="text-center pt-7 mb-20">
          Bạn đã có tài khoản?{" "}
          <CustomText
            textProps={{ onPress: () => navigation.navigate("LogIn") }}
            classes="underline"
            fontFamily="Montserrat-Medium"
          >
            Đăng nhập
          </CustomText>
        </CustomText>
      </StyledComponent>
    </StyledComponent>
  );
};

export default SignInScreen;
