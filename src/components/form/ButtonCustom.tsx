import { View } from "react-native";
import React, { FC } from "react";
import { StyledComponent } from "nativewind";
import CustomText from "../texts/CustomText";

type ButtonCustomProps = { content: string; disable?: boolean };

const ButtonCustom: FC<ButtonCustomProps> = ({ content, disable }) => {
  return (
    <StyledComponent
      component={View}
      className={`h-11 bg-black rounded-lg items-center justify-center ${
        disable ? "opacity-70" : ""
      }`}
    >
      <CustomText fontFamily="Montserrat-SemiBold" classes="text-white">
        {content}
      </CustomText>
    </StyledComponent>
  );
};

export default ButtonCustom;
