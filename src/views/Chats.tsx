import AppHeader from "@conponents/AppHeader";
import BackButton from "@Ui/BackBotton";
import { FC } from "react";
import { View, StyleSheet, Text, FlatList, Pressable } from "react-native";
import EmptyView from "./EmptyView";
import React from "react";
import useClient from "@hooks/useClient";
import { useDispatch, useSelector } from "react-redux";
import {
  ActiveChat,
  getActiveChats,
  removeUnreadChatCount,
} from "@store/chats";
import RecentChat, { Separator } from "@conponents/RecentChat";
import size from "@utils/size";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ProfileNavigatorParamList } from "@navigator/ProfileNavigator";
import { runAxiosAsync } from "@api/runAxiosAsync";

interface Props {}

const Chats: FC<Props> = (props) => {
  const { authClient } = useClient();
  const { navigate } =
    useNavigation<NavigationProp<ProfileNavigatorParamList>>();
  const chats = useSelector(getActiveChats);
  const dispatch = useDispatch();

  const onChatPress = (chat: ActiveChat) => {
    dispatch(removeUnreadChatCount(chat.id));

    navigate("ChatWindow", {
      conversationId: chat.id,
      peerProfile: chat.peerProfile,
    });
  };

  if (!chats.length)
    return (
      <>
        <AppHeader backButton={<BackButton />} />
        <EmptyView title="Không có đoạn chat nào." />
      </>
    );
  return (
    <>
      <AppHeader backButton={<BackButton />} />
      <FlatList
        data={chats}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <Pressable onPress={() => onChatPress(item)}>
            <RecentChat
              name={item.peerProfile.name}
              avatar={item.peerProfile.avatar}
              timestamp={item.timestamp}
              lastMessage={item.lastMessage}
              unreadMessageCount={item.unreadChatCounts}
            />
          </Pressable>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: size.padding,
  },
});

export default Chats;
