import { View, Text } from "react-native";
import React, { FC } from "react";
import { StyledComponent } from "nativewind";
import CustomText from "../texts/CustomText";
import { Control, Controller, useController } from "react-hook-form";
import { TextInput } from "react-native-gesture-handler";

type InputExamCustomProps = {
  name: string;
  control: Control<any>;
  placeHolder: string;
  disable?: boolean;
};

const InputExamCustom: FC<InputExamCustomProps> = ({
  name,
  control,
  placeHolder,
  disable,
}) => {
  const {
    fieldState: { error },
  } = useController({ name: name, control: control });
  return (
    <StyledComponent component={View} className="space-y-2 flex-1">
      <Controller
        control={control}
        rules={{
          maxLength: 100,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledComponent
            component={TextInput}
            className={`border rounded-lg px-4 py-[6] text-sm ${
              disable
                ? "border-gray-400 text-gray-500"
                : "border-slate-600 text-black"
            }`}
            style={{ fontFamily: "Montserrat" }}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            editable={!disable}
            placeholder={placeHolder}
          />
        )}
        name={name}
      />
      {error ? (
        <CustomText classes="text-[#ff7675] text-sm">
          {error.message}
        </CustomText>
      ) : null}
    </StyledComponent>
  );
};

export default InputExamCustom;
