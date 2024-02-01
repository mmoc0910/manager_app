import { View, Text, ScrollView, Pressable } from "react-native";
import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { StyledComponent } from "nativewind";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from "@react-navigation/native";
import {
  AuthType,
  ClassType,
  ExamContentType,
  RootStackParamList,
  SatisfyType,
} from "../../types";
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
  const { exam_id, exam_name, class_id } = route.params;
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [satisfy, setSatisfy] = useState<SatisfyType>();
  const [students, setStudents] = useState<AuthType[]>([]);
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
        const [resultSatisfy, resultStudent] = await Promise.all([
          api.get<SatisfyType>(`/results/satisfy/${exam_id}`, {
            headers: { Authorization: accessToken },
          }),
          await api.get<ClassType>(`/classes/${class_id}`, {
            headers: { Authorization: accessToken },
          }),
        ]);
        console.log("result - ", resultSatisfy.data);
        setSatisfy(resultSatisfy.data);
        setStudents(resultStudent.data.students);
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
          // data={satisfy.rank}
          data={students}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          renderItem={({ item }) => {
            const complete = satisfy.rank.find(
              (i) => i.student._id === item._id
            );
            console.log("complete - ", complete);
            if (complete) {
              const exam_content: ExamContentType[] = JSON.parse(
                complete.exam.content
              );
              return (
                <SatisfyCard
                  student_name={complete.student.name}
                  score={
                    (checkScore(exam_content, complete.answer) /
                      complete.totalQuestion) *
                    10
                  }
                  result_exam_id={item._id}
                  status={1}
                />
              );
            }
            return <SatisfyCard student_name={item.name} status={0} />;
          }}
          ItemSeparatorComponent={() => (
            <StyledComponent component={View} className="h-4" />
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
  status,
}: // class_name,
{
  student_name: string;
  score?: number;
  result_exam_id?: string;
  status?: 0 | 1;
  // class_name: string;
}) => {
  console.log("score - ", score);
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "StatisticalScore">>();
  return (
    <StyledComponent
      component={Pressable}
      className="flex-row gap-3"
      onPress={() =>
        result_exam_id &&
        navigation.navigate("ResultExam", {
          result_exam_id,
        })
      }
    >
      <StyledComponent
        component={View}
        className="w-11 h-11 object-cover bg-slate-500 rounded-full"
      />
      <StyledComponent component={View} className="flex-1">
        <StyledComponent component={View} className="flex-row justify-between">
          <CustomText classes="text-base" fontFamily="Montserrat-Medium">{student_name}</CustomText>
          {score !== undefined ? (
            <CustomText classes="text-base">Tổng điểm: {score}</CustomText>
          ) : null}
        </StyledComponent>
        {status === 1 ? (
          <CustomText fontFamily="Montserrat-Medium" classes="text-[#74b9ff]">
            Đã làm
          </CustomText>
        ) : (
          <CustomText fontFamily="Montserrat-Medium" classes="text-[#d63031]">
            Chưa làm
          </CustomText>
        )}
      </StyledComponent>
    </StyledComponent>
  );
};

export default StatisticalScoreScreen;
