import { Pressable, View } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { StyledComponent } from "nativewind";
import CustomText from "../texts/CustomText";
import { ExamType, ResultScoreType, RootStackParamList } from "../../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import moment from "moment";
import { api } from "../../../api";
import { SvgXml } from "react-native-svg";
import { chatBarXML } from "../../icons";

type ExamCardProps = {
  exam: ExamType;
  class_id: string;
  class_name: string;
  historyExams: ExamType[];
};
const ExamCard: FC<ExamCardProps> = ({
  exam,
  class_id,
  class_name,
  historyExams,
}) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { role, _id, accessToken } = useSelector(
    (state: RootState) => state.auth
  );
  const [results, setResults] = useState<ResultScoreType[]>([]);
  useEffect(() => {
    (async () => {
      if (isFocused) {
        const result = await api.get<ResultScoreType[]>(
          `/results?student=${_id}&exam=${exam._id}`,
          { headers: { Authorization: accessToken } }
        );
        setResults(result.data);
        console.log("result - ", result.data);
        try {
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [isFocused]);

  return (
    <StyledComponent
      component={Pressable}
      className="px-4 py-3 rounded-xl bg-white flex-row items-start justify-between"
      style={{ elevation: 5 }}
      onPress={() => {
        if (results.length > 0) {
          navigation.navigate("ResultExam", {
            result_exam_id: results[0]._id,
            class_id,
            class_name,
          });
        } else {
          if (role === 1) {
            navigation.navigate("DoExam", {
              exam_id: exam._id,
              class_id,
              class_name,
            });
          } else if (role === 2) {
            navigation.navigate("AddExam", {
              class_id,
              historyExams: historyExams,
              initialExam: exam,
            });
          }
        }
      }}
    >
      <StyledComponent component={View}>
        <CustomText
          fontFamily="Montserrat-Medium"
          classes="text-base
        "
        >
          {exam.title}
        </CustomText>
        <CustomText fontFamily="Montserrat-Medium">
          Thời gian: {exam.duration} phút
        </CustomText>
        <CustomText fontFamily="Montserrat-Medium">
          Ngày tạo: {moment(exam.createdAt).format("HH:MM DD/MM/YYYY")}
        </CustomText>
        {role === 1 && (
          <CustomText fontFamily="Montserrat-Medium">
            Trạng thái: {results.length > 0 ? "Đã hoàn thành" : "Chưa làm"}
          </CustomText>
        )}
      </StyledComponent>
      {role === 2 ? (
        <SvgXml
          xml={chatBarXML}
          width={24}
          height={24}
          color={"#000"}
          onPress={() =>
            navigation.navigate("StatisticalScore", {
              exam_id: exam._id,
              exam_name: exam.title,
            })
          }
        />
      ) : (
        ""
      )}
    </StyledComponent>
  );
};

export default ExamCard;
