import { View, Keyboard, Pressable } from "react-native";
import React, { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { ChatType, RootStackParamList } from "../../types";
import HeaderCustom from "../components/HeaderCustom";
import { StyledComponent } from "nativewind";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { sendXML } from "../icons";
import { SvgXml } from "react-native-svg";
import { api } from "../../api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CustomText from "../components/texts/CustomText";
import moment from "moment";

type ChatScreenProps = {
  navigation: NavigationProp<RootStackParamList, "Chat">;
  route: RouteProp<RootStackParamList, "Chat">;
};
const ChatScreen: FC<ChatScreenProps> = ({ navigation, route }) => {
  const { class_id, class_name } = route.params;
  const { accessToken, _id } = useSelector((state: RootState) => state.auth);
  const [content, setContent] = useState("");
  const [chats, setChats] = useState<ChatType[]>([]);
  const flatListRef = useRef<FlatList>(null);
  useLayoutEffect(() => {
    navigation.setOptions({
      header: ({
        back,
      }: {
        back?: {
          title: string;
        };
      }) => <HeaderCustom back={back} title={`Tin nhắn lớp ${class_name}`} />,
    });
  }, [class_name]);
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  }, [chats]);
  useEffect(() => {
    const timerId = setTimeout(fetchChat, 2000);
    return () => clearTimeout(timerId);
  });
  const fetchChat = async () => {
    try {
      const result = await api.get<ChatType[]>(`/chats/${class_id}`, {
        headers: { Authorization: accessToken },
      });
      setChats(result.data);
      console.log("resuts - ", result.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSendMessage = async () => {
    try {
      await api.post(
        "/chats",
        {
          class: class_id,
          user: _id,
          content: content,
        },
        {
          headers: { Authorization: accessToken },
        }
      );
      Keyboard.dismiss();
      setContent("");
      fetchChat();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <StyledComponent component={View} className="flex-1 bg-white">
      <StyledComponent component={View} className="flex-1">
        <FlatList
          ref={flatListRef}
          inverted
          contentContainerStyle={{ padding: 20 }}
          data={chats}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          renderItem={({ item }) => (
            <StyledComponent
              component={View}
              className={`bg-slate-300 rounded-2xl px-4 py-3 w-3/4 ${
                item.user._id === _id ? "self-end" : ""
              }`}
            >
              <CustomText
                fontFamily="Montserrat-Medium"
                textProps={{ numberOfLines: 1, lineBreakMode: "tail" }}
              >
                {item.user.name}{" "}
                <CustomText classes="text-xs text-gray-400">
                  {moment(item.createdAt).format("HH:MM DD/MM/YYYY")}
                </CustomText>
              </CustomText>
              <CustomText classes="">{item.content}</CustomText>
            </StyledComponent>
          )}
          ItemSeparatorComponent={() => (
            <StyledComponent component={View} className="h-3" />
          )}
          //   ListEmptyComponent={() => (
          //     <CustomText classes="text-center mt-10">
          //       Bắt đầu cuộc chò truyện...
          //     </CustomText>
          //   )}
        />
      </StyledComponent>
      <StyledComponent
        component={View}
        className="p-5 items-stretch flex-row gap-2"
      >
        <StyledComponent
          component={TextInput}
          className="border border-slate-700 px-4 py-2 rounded-full text-base flex-1"
          style={{ fontFamily: "Montserrat" }}
          placeholder="Nhập tin nhắn"
          value={content}
          onChangeText={(text: string) => setContent(text)}
        />
        <StyledComponent
          component={Pressable}
          className="w-11 h-11 bg-slate-800 items-center justify-center rounded-full"
          onPress={() => handleSendMessage()}
        >
          <SvgXml xml={sendXML} width={22} height={22} color={"#fff"} />
        </StyledComponent>
      </StyledComponent>
    </StyledComponent>
  );
};

export default ChatScreen;
