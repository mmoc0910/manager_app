import { View, Text, ScrollView, Pressable } from "react-native";
import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { StyledComponent } from "nativewind";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from "@react-navigation/native";
import { ExamContentType, RootStackParamList, SatisfyType } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { api } from "../../api";
import HeaderCustom from "../components/HeaderCustom";
import CustomText from "../components/texts/CustomText";
import { FlatList } from "react-native-gesture-handler";

type StatisticalScoreScreenProps = {
  navigation: NavigationProp<RootStackParamList, "StatisticalScore">;
  route: RouteProp<RootStackParamList, "StatisticalScore">;
};
const StatisticalScoreScreen: FC<StatisticalScoreScreenProps> = ({
  navigation,
  route,
}) => {
  const { exam_id, exam_name } = route.params;
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [satisfy, setSatisfy] = useState<SatisfyType>();
  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({
        back,
      }: {
        back?: {
          title: string;
        };
      }) => <HeaderCustom back={back} title={exam_name} />,
    });
  }, [navigation, exam_name]);
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get<SatisfyType>(
          `/results/satisfy/${exam_id}`,
          {
            headers: { Authorization: accessToken },
          }
        );
        console.log("result - ", result.data);
        setSatisfy(result.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  const checkScore = (exam_content: ExamContentType[], answer: string[]) => {
    let total_question = 0;
    exam_content.forEach((item, index) => {
      if (item.correct === Number(answer[index])) {
        total_question++;
      }
    });
    return total_question;
  };
  return (
    <StyledComponent component={View} className="bg-white p-5 flex-1">
      <CustomText classes="text-lg mb-5" fontFamily="Montserrat-Medium">
        Danh sách sinh viên đã làm bài kiểm tra
      </CustomText>
      {satisfy?.rank && satisfy.rank.length > 0 ? (
        <FlatList
          data={satisfy.rank}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          renderItem={({ item }) => {
            const exam_content: ExamContentType[] = JSON.parse(
              item.exam.content
            );
            return (
              <SatisfyCard
                student_name={item.student.name}
                score={
                  (checkScore(exam_content, item.answer) / item.totalQuestion) *
                  10
                }
                result_exam_id={item._id}
                class_name={exam_name}
              />
            );
          }}
          ItemSeparatorComponent={() => (
            <StyledComponent component={View} className="h-2" />
          )}
        />
      ) : (
        <CustomText classes="text-center">
          Chưa ai làm bài kiểm tra...
        </CustomText>
      )}
    </StyledComponent>
  );
};

const SatisfyCard = ({
  student_name,
  score,
  result_exam_id,
  class_name,
}: {
  student_name: string;
  score: number;
  result_exam_id: string;
  class_name: string;
}) => {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "StatisticalScore">>();
  return (
    <StyledComponent
      component={Pressable}
      className="flex-row items-center justify-between"
      onPress={() =>
        navigation.navigate("ResultExam", {
          result_exam_id,
        })
      }
    >
      <CustomText classes="text-base">{student_name}</CustomText>
      <CustomText>Tổng điểm: {score}</CustomText>
    </StyledComponent>
  );
};

export default StatisticalScoreScreen;
