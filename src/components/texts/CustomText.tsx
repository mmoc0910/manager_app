import { Text } from "react-native";
import React, { FC } from "react";
import { StyledComponent } from "nativewind";
import { TextComponentProps } from "../../../types";

const CustomText: FC<TextComponentProps> = ({
  classes,
  children,
  fontFamily = "Montserrat",
  textProps,
  style,
}) => {
  return (
    <StyledComponent
      {...textProps}
      component={Text}
      className={`text-sm text-black ${classes}`}
      style={[{ fontFamily: fontFamily }, style]}
    >
      {children}
    </StyledComponent>
  );
};

export default CustomText;
