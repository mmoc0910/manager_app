import { View, Pressable } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { StyledComponent } from "nativewind";
import CustomText from "../components/texts/CustomText";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import InputAuthCustom from "../components/form/InputAuthCustom";
import { api } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { AuthState, setAuth } from "../../store/auth/authSlice";
import { SvgXml } from "react-native-svg";
import { eyeCloseXML, eyeXML } from "../icons";

type LoginScreenProps = {
  navigation: NavigationProp<RootStackParamList, "LogIn">;
  route: RouteProp<RootStackParamList, "LogIn">;
};
type DataLogin = { username: string; password: string };

const schema = yup
  .object({
    username: yup.string().required("Tên đăng nhập không được để trống"),
    password: yup.string().required("Mật khẩu không được để trống"),
  })
  .required();
const LoginScreen: FC<LoginScreenProps> = ({ navigation, route }) => {
  const sign_in_success = route.params?.sign_in_success || undefined;
  // console.log("auth - ", username);
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [showpass, setShowPass] = useState<boolean>(true);
  const { control, handleSubmit, setError } = useForm({
    resolver: yupResolver(schema),
  });
  // console.log("errors - ", errors);
  useEffect(() => {
    if (accessToken) {
      navigation.navigate("Home");
    }
  }, [accessToken]);
  const onSubmit = async (data: DataLogin) => {
    console.log("data - ", data);
    try {
      const result = await api.post<{ data: AuthState }>("/auth/login", data);
      const response = result.data.data;
      console.log("result - ", response);
      dispatch(setAuth(response));
    } catch (error) {
      console.log("error login - ", error);
      setError("password", {
        message: "Tên đăng nhập hoặc mật khẩu không chính xác",
      });
    }
  };
  return (
    <StyledComponent component={View} className="flex-1 bg-slate-400">
      <StyledComponent
        component={View}
        className="flex-1 items-center justify-center"
      >
        <CustomText
          fontFamily="Montserrat-SemiBold"
          classes="text-3xl text-white text-center"
        >
          Welcome to Manager Student App
        </CustomText>
      </StyledComponent>

      <StyledComponent
        component={View}
        className="px-5 pt-12 bg-white w-full h-3/4"
        style={{ borderTopRightRadius: 40, borderTopLeftRadius: 40 }}
      >
        <CustomText
          fontFamily="Montserrat-Medium"
          classes="text-2xl text-center"
        >
          Đăng nhập
        </CustomText>
        {sign_in_success ? (
          <CustomText
            fontFamily="Montserrat-Medium"
            classes="text-base text-[#74b9ff] text-center mt-5"
          >
            Đăng ký thành công hãy đăng nhập đê sử dụng
          </CustomText>
        ) : null}

        <StyledComponent component={View} className="mt-14 space-y-4">
          <StyledComponent component={View}>
            <InputAuthCustom
              control={control}
              name="username"
              placeHolder="Tên đăng nhập"
            />
          </StyledComponent>
          <StyledComponent component={View}>
            <InputAuthCustom
              control={control}
              name="password"
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
        </StyledComponent>
        <StyledComponent
          component={Pressable}
          className="h-12 bg-slate-400 rounded-lg items-center justify-center mt-8"
          onPress={handleSubmit(onSubmit)}
        >
          <CustomText fontFamily="Montserrat-SemiBold" classes="text-white">
            Đăng nhập
          </CustomText>
        </StyledComponent>
        <CustomText classes="text-center pt-7 pb-20">
          Bạn chưa có tài khoản?{" "}
          <CustomText
            textProps={{ onPress: () => navigation.navigate("SignIn") }}
            classes="underline"
            fontFamily="Montserrat-Medium"
          >
            Đăng ký
          </CustomText>
        </CustomText>
      </StyledComponent>
    </StyledComponent>
  );
};

export default LoginScreen;
