import { View, Text, ScrollView, Pressable } from "react-native";
import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { StyledComponent } from "nativewind";
import HeaderCustom from "../components/HeaderCustom";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import {
  ExamContentType,
  ExamType,
  ResultScoreType,
  RootStackParamList,
} from "../../types";
import { api } from "../../api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CustomText from "../components/texts/CustomText";
import Checkbox from "expo-checkbox";
import CountDown from "react-native-countdown-fixed";

type DoExamScreenProps = {
  navigation: NavigationProp<RootStackParamList, "DoExam">;
  route: RouteProp<RootStackParamList, "DoExam">;
};
const DoExamScreen: FC<DoExamScreenProps> = ({ navigation, route }) => {
  const { exam_id, class_id, class_name } = route.params;
  const { accessToken, _id } = useSelector((state: RootState) => state.auth);
  const [exam, setExam] = useState<ExamType>();
  const [resultAnswer, setResultAnswer] = useState<string[]>([]);
  console.log("resultAnswer - ", resultAnswer);
  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({
        back,
      }: {
        back?: {
          title: string;
        };
      }) => <HeaderCustom back={back} title={"Làm bài kiểm tra"} />,
    });
  }, [navigation]);
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get<ExamType>(`/exams/${exam_id}`, {
          headers: { Authorization: accessToken },
        });
        const resultExam = JSON.parse(result.data.content) as ExamContentType[];
        setResultAnswer(new Array(resultExam.length).fill(""));
        setExam(result.data);
      } catch (error) {
        console.log("error - ", error);
      }
    })();
  }, [exam_id]);
  const handleSubmit = async () => {
    try {
      const result = await api.post<{ data: ResultScoreType }>(
        "/results/score",
        {
          student: _id,
          exam: exam_id,
          answer: resultAnswer,
        },
        { headers: { Authorization: accessToken } }
      );
      console.log("result - ", result.data);
      navigation.navigate("ResultExam", {
        result_exam_id: result.data.data._id,
        class_id,
        class_name,
      });
    } catch (error) {
      console.log("error - ", error);
    }
  };
  if (exam) {
    const { title, description, content, duration } = exam;
    const exam_content: ExamContentType[] = JSON.parse(content);
    return (
      <StyledComponent component={View} className="p-5 bg-white flex-1">
        <StyledComponent component={View} className="mb-3 self-start">
          <CountDown
            until={Number(duration) * 60}
            onFinish={() => {
              console.log("finished");
              handleSubmit();
            }}
            onPress={() => console.log("hello")}
            size={12}
            timeToShow={["H", "M", "S"]}
            timeLabels={{}}
            digitStyle={{ backgroundColor: "#000" }}
            digitTxtStyle={{ color: "#fff", fontSize: 14 }}
          />
        </StyledComponent>
        <StyledComponent component={ScrollView}>
          <CustomText fontFamily="Montserrat-Medium" classes="text-lg">
            {title}
          </CustomText>
          <CustomText fontFamily="Montserrat-Medium" classes="text-gray-500">
            {description}
          </CustomText>
          <CustomText fontFamily="Montserrat-Medium" classes="text-gray-500">
            Thời gian: {duration} phút
          </CustomText>
          <StyledComponent component={View} className="mt-5 space-y-3">
            {exam_content.length > 0 &&
              exam_content.map(({ answer, question }, index) => {
                const questionIndex = index;
                return (
                  <StyledComponent
                    component={View}
                    className="space-y-3"
                    key={questionIndex}
                  >
                    <CustomText
                      fontFamily="Montserrat-Medium"
                      classes="text-base"
                    >
                      Câu hỏi {questionIndex + 1}: {question}
                    </CustomText>
                    <StyledComponent component={View} className="space-y-1">
                      {answer.map((item, index) => {
                        const answerIndex = index;
                        return (
                          <StyledComponent
                            key={answerIndex}
                            component={View}
                            className="flex-row items-center gap-2"
                          >
                            <Checkbox
                              value={
                                resultAnswer[questionIndex] ===
                                String(answerIndex)
                              }
                              onValueChange={(value: boolean) => {
                                if (value) {
                                  setResultAnswer((cur) =>
                                    cur.map((it, index) => {
                                      return index === questionIndex
                                        ? String(answerIndex)
                                        : it;
                                    })
                                  );
                                }
                              }}
                              color={true ? "#000" : undefined}
                              style={{
                                width: 15,
                                height: 15,
                                marginRight: 10,
                                transform: [{ translateY: -3 }],
                              }}
                            />
                            <CustomText classes="text-base">{item}</CustomText>
                          </StyledComponent>
                        );
                      })}
                    </StyledComponent>
                  </StyledComponent>
                );
              })}
          </StyledComponent>
          <StyledComponent
            component={Pressable}
            className="h-12 bg-black rounded-lg items-center justify-center mt-8"
            onPress={() => handleSubmit()}
          >
            <CustomText fontFamily="Montserrat-SemiBold" classes="text-white">
              Nộp bài
            </CustomText>
          </StyledComponent>
        </StyledComponent>
      </StyledComponent>
    );
  }
  return;
};

export default DoExamScreen;
