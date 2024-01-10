import { View, Text, TextInputProps } from "react-native";
import React, { FC } from "react";
import { StyledComponent } from "nativewind";
import CustomText from "../texts/CustomText";
import { Control, Controller, useController } from "react-hook-form";
import { TextInput } from "react-native-gesture-handler";

type InputAuthCustomProps = {
  name: string;
  control: Control<any>;
  placeHolder: string;
  disable?: boolean;
  inputProps?: TextInputProps;
  children?: React.ReactNode;
};

const InputAuthCustom: FC<InputAuthCustomProps> = ({
  name,
  control,
  placeHolder,
  disable,
  inputProps,
  children,
}) => {
  const {
    fieldState: { error },
  } = useController({ name: name, control: control });
  return (
    <StyledComponent component={View}>
      <CustomText
        fontFamily="Montserrat-Medium"
        classes={`mb-2 text-base ${disable ? "text-gray-500" : ""}`}
      >
        {placeHolder}*
      </CustomText>
      <StyledComponent component={View} className="justify-center w-full">
        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledComponent
              component={TextInput}
              className={`border rounded-lg px-4 py-2 text-sm w-full text-base ${
                disable
                  ? "border-gray-400 text-gray-500"
                  : "border-slate-600 text-black"
              }`}
              style={{ fontFamily: "Montserrat" }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              editable={!disable}
              {...inputProps}
            />
          )}
          name={name}
        />
        {children ? (
          <StyledComponent component={View} className="absolute right-4">
            {children}
          </StyledComponent>
        ) : null}
      </StyledComponent>
      {error ? (
        <CustomText classes="text-[#ff7675] text-sm">
          {error.message}
        </CustomText>
      ) : null}
    </StyledComponent>
  );
};

export default InputAuthCustom;
