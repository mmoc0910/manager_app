import { View, Text, ScrollView, Pressable, Switch } from "react-native";
import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import HeaderCustom from "../components/HeaderCustom";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { ExamType, RootStackParamList } from "../../types";
import { StyledComponent } from "nativewind";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputAuthCustom from "../components/form/InputAuthCustom";
import CustomText from "../components/texts/CustomText";
import { TextInput } from "react-native-gesture-handler";
import _ from "lodash";
import { api } from "../../api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

type AddExamScreenProps = {
  navigation: NavigationProp<RootStackParamList, "AddExam">;
  route: RouteProp<RootStackParamList, "AddExam">;
};
type QuestionType = {
  question: string;
  answer: string[];
  correct?: 0 | 1 | 2 | 3 | undefined;
};

const schema = yup
  .object({
    title: yup.string().required("Tên bài kiểm tra không được để trống"),
    description: yup.string(),
    duration: yup.string().required("Thời gian không được để trống"),
  })
  .required();
const AddExamScreen: FC<AddExamScreenProps> = ({ navigation, route }) => {
  const { class_id, historyExams, initialExam } = route.params;
  console.log("initial ẽam - ", initialExam);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [questions, setQuestions] = useState<QuestionType[]>(
    initialExam
      ? JSON.parse(initialExam.content)
      : [{ question: "", answer: ["A. ", "B. ", "C. ", "D. "], correct: undefined }]
  );
  console.log("questions - ", questions);
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: initialExam ? initialExam.title : "",
      description: initialExam ? initialExam.description : "",
      duration: initialExam ? initialExam.duration : "",
    },
  });
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
          title={initialExam ? "Sửa bài kiểm tra" : "Thêm bài kiểm tra"}
          contentRight={() =>
            initialExam ? (
              <CustomText
                fontFamily="Montserrat-Medium"
                classes="text-[#74b9ff] text-base"
                textProps={{
                  onPress: async () => {
                    try {
                      const new_exams = _.map(
                        historyExams.filter(
                          (item) => item._id !== initialExam._id
                        ),
                        "_id"
                      );
                      await api.delete(`/exams/${initialExam._id}`, {
                        headers: { Authorization: accessToken },
                      });
                      await api.patch(
                        `/classes/${class_id}`,
                        { historyExams: new_exams },
                        { headers: { Authorization: accessToken } }
                      );
                      navigation.goBack();
                    } catch (error) {
                      console.log("error - ", error);
                    }
                  },
                }}
              >
                Xóa bài ktra
              </CustomText>
            ) : null
          }
        />
      ),
    });
  }, [navigation, initialExam]);
  const onSubmit = async (data: {
    title: string;
    description?: string;
    duration: string;
  }) => {
    console.log("data submit -=================================== ", data);
    try {
      if (initialExam) {
        //sửa
        const result = await api.patch<{ data: ExamType }>(
          `/exams/${initialExam._id}`,
          { ...data, content: JSON.stringify(questions) },
          { headers: { Authorization: accessToken } }
        );
        console.log("results edit exam - ", result.data);
        navigation.goBack();
      }
      if (initialExam === undefined) {
        //thêm
        const result = await api.post<{ data: ExamType }>(
          "/exams",
          { ...data, content: JSON.stringify(questions) },
          { headers: { Authorization: accessToken } }
        );
        const new_exams = _.concat(_.map(historyExams, "_id"), [
          result.data.data._id,
        ]);
        await api.patch(
          `/classes/${class_id}`,
          { historyExams: new_exams },
          { headers: { Authorization: accessToken } }
        );
        navigation.goBack();
      }
    } catch (error) {
      console.log("error - ", error);
    }
  };
  return (
    <StyledComponent component={ScrollView} className="bg-white p-5">
      <StyledComponent component={View} className="space-y-3">
        <StyledComponent component={View}>
          <InputAuthCustom
            control={control}
            name={"title"}
            placeHolder="Tên bài kiểm tra"
          />
        </StyledComponent>
        <StyledComponent component={View}>
          <InputAuthCustom
            control={control}
            name={"description"}
            placeHolder="Mô tả"
          />
        </StyledComponent>
        <StyledComponent component={View}>
          <InputAuthCustom
            control={control}
            name={"duration"}
            placeHolder="Thời gian (phút)"
            inputProps={{ keyboardType: "numeric" }}
          />
        </StyledComponent>
      </StyledComponent>
      <StyledComponent component={View} className="mt-5">
        {questions.map((item, index) => (
          <ExamItem
            key={index}
            index={index}
            dquestion={item}
            updateQuestions={(index, question, answer, correct) =>
              setQuestions((curQuestion) =>
                curQuestion.map((item, i) =>
                  i === index
                    ? { question: question, answer: answer, correct: correct }
                    : item
                )
              )
            }
          />
        ))}
      </StyledComponent>
      <StyledComponent
        component={Pressable}
        className="h-12 bg-black rounded-lg items-center justify-center mt-5"
        onPress={() =>
          setQuestions((curQuestions) =>
            _.concat(curQuestions, [
              { question: "", answer: ["A. ", "B. ", "C. ", "D. "], correct: undefined },
            ])
          )
        }
      >
        <CustomText fontFamily="Montserrat-SemiBold" classes="text-white">
          Thêm câu hỏi
        </CustomText>
      </StyledComponent>
      <StyledComponent
        component={Pressable}
        className="h-12 bg-black rounded-lg items-center justify-center mt-5 mb-20"
        onPress={handleSubmit(onSubmit)}
      >
        <CustomText fontFamily="Montserrat-SemiBold" classes="text-white">
          {initialExam ? "Chỉnh sửa" : "Hoàn thành"}
        </CustomText>
      </StyledComponent>
    </StyledComponent>
  );
};

const ExamItem = ({
  index,
  dquestion,
  updateQuestions,
}: {
  index: number;
  dquestion: QuestionType;
  updateQuestions: (
    index: number,
    question: string,
    answer: string[],
    correct: 0 | 1 | 2 | 3 | undefined
  ) => void;
}) => {
  const [correct, setCorrect] = useState<0 | 1 | 2 | 3 | undefined>(
    dquestion.correct
  );
  const [question, setQuestion] = useState<string>(dquestion.question);
  const [answer, setAnswer] = useState<string[]>(dquestion.answer);
  //   console.log("data - ", correct, question, answer);
  useEffect(() => {
    updateQuestions(index, question, answer, correct);
  }, [correct, question, answer]);
  return (
    <StyledComponent component={View} className="mb-3">
      <CustomText fontFamily="Montserrat-SemiBold" classes="mb-2">
        Câu hỏi {index + 1}:
      </CustomText>
      <StyledComponent
        component={TextInput}
        className={`border rounded-lg px-4 py-[6] text-sm border-slate-600 text-black`}
        style={{ fontFamily: "Montserrat" }}
        placeholder={"Câu hỏi"}
        value={question}
        onChangeText={(text: string) => setQuestion(text)}
      />
      <StyledComponent component={View} className="space-y-2 mt-2">
        <StyledComponent
          component={View}
          className="flex-row items-center space-x-2"
        >
          <StyledComponent
            component={TextInput}
            className={`border rounded-lg px-4 py-[6] text-sm border-slate-600 text-black flex-1`}
            style={{ fontFamily: "Montserrat" }}
            placeholder={"Câu trả lời 1"}
            onChangeText={(text: string) =>
              setAnswer((cur) =>
                cur.map((item, index) => (index === 0 ? text : item))
              )
            }
            value={answer[0]}
          />
          <Switch
            trackColor={{ false: "#767577", true: "#ccc" }}
            thumbColor={correct === 0 ? "#000" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setCorrect(0)}
            value={correct === 0}
          />
        </StyledComponent>
        <StyledComponent
          component={View}
          className="flex-row items-center space-x-2"
        >
          <StyledComponent
            component={TextInput}
            className={`border rounded-lg px-4 py-[6] text-sm border-slate-600 text-black flex-1`}
            style={{ fontFamily: "Montserrat" }}
            placeholder={"Câu trả lời 2"}
            onChangeText={(text: string) =>
              setAnswer((cur) =>
                cur.map((item, index) => (index === 1 ? text : item))
              )
            }
            value={answer[1]}
          />
          <Switch
            trackColor={{ false: "#767577", true: "#ccc" }}
            thumbColor={correct === 1 ? "#000" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setCorrect(1)}
            value={correct === 1}
          />
        </StyledComponent>
        <StyledComponent
          component={View}
          className="flex-row items-center space-x-2"
        >
          <StyledComponent
            component={TextInput}
            className={`border rounded-lg px-4 py-[6] text-sm border-slate-600 text-black flex-1`}
            style={{ fontFamily: "Montserrat" }}
            placeholder={"Câu trả lời 3"}
            onChangeText={(text: string) =>
              setAnswer((cur) =>
                cur.map((item, index) => (index === 2 ? text : item))
              )
            }
            value={answer[2]}
          />
          <Switch
            trackColor={{ false: "#767577", true: "#ccc" }}
            thumbColor={correct === 2 ? "#000" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setCorrect(2)}
            value={correct === 2}
          />
        </StyledComponent>
        <StyledComponent
          component={View}
          className="flex-row items-center space-x-2"
        >
          <StyledComponent
            component={TextInput}
            className={`border rounded-lg px-4 py-[6] text-sm border-slate-600 text-black flex-1`}
            style={{ fontFamily: "Montserrat" }}
            placeholder={"Câu trả lời 4"}
            onChangeText={(text: string) =>
              setAnswer((cur) =>
                cur.map((item, index) => (index === 3 ? text : item))
              )
            }
            value={answer[3]}
          />
          <Switch
            trackColor={{ false: "#767577", true: "#ccc" }}
            thumbColor={correct === 3 ? "#000" : "#f3f3f3"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setCorrect(3)}
            value={correct === 3}
          />
        </StyledComponent>
      </StyledComponent>
    </StyledComponent>
  );
};

export default AddExamScreen;
