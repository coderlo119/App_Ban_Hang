import { runAxiosAsync } from "@api/runAxiosAsync";
import AppHeader from "@conponents/AppHeader";
import useAuth from "@hooks/useAuth";
import useClient from "@hooks/useClient";
import { AppStackParamList } from "@navigator/AppNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  addConversation,
  Conversation,
  selectConversationById,
  updateConversation,
} from "@store/conversation";
import BackButton from "@Ui/BackBotton";
import EmptyChatContainer from "@Ui/EmptyChatContainer";
import PeerProfile from "@Ui/PeerProfile";
import { FC, useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { useDispatch, useSelector } from "react-redux";
import socket, { NewMessageResponse } from "src/socket";
import EmptyView from "./EmptyView";
import { useFocusEffect } from "@react-navigation/native";
import { updateActiveChat } from "@store/chats";

type Props = NativeStackScreenProps<AppStackParamList, "ChatWindow">;

type OutGoingMessage = {
  message: {
    id: string;
    time: string;
    text: string;
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
  to: string;
  conversationId: string;
};

const getTime = (value: IMessage["createdAt"]) => {
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
};
const formatConversationToIMessage = (value?: Conversation): IMessage[] => {
  const formattedValues = value?.chats.map((chat) => {
    return {
      _id: chat.id,
      text: chat.text,
      createdAt: new Date(chat.time),
      received: chat.viewed,
      user: {
        _id: chat.user.id,
        name: chat.user.name,
        avatar: chat.user.avatar,
      },
    };
  });

  const message = formattedValues || [];

  return message.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

const ChatWindow: FC<Props> = ({ route }) => {
  const { authState } = useAuth();
  const { conversationId, peerProfile } = route.params;
  const conversation = useSelector(selectConversationById(conversationId));
  const dispatch = useDispatch();
  const { authClient } = useClient();
  const [fetchingChats, setFetchingChats] = useState(false);

  const profile = authState.profile;

  const handleOnMessageSend = (messages: IMessage[]) => {
    if (!profile) return;
    const currentMessage = messages[messages.length - 1];

    const newMessage: OutGoingMessage = {
      message: {
        id: currentMessage._id.toString(),
        text: currentMessage.text,
        time: getTime(currentMessage.createdAt),
        user: {
          id: profile.id,
          name: profile.name,
          avatar: profile.avatar,
        },
      },
      conversationId,
      to: peerProfile.id,
    };
    dispatch(
      updateConversation({
        conversationId,
        chat: { ...newMessage.message, viewed: false },
        peerProfile,
      })
    );

    dispatch(
      updateActiveChat({
        id: conversationId,
        lastMessage: newMessage.message.text,
        peerProfile,
        timestamp: newMessage.message.time,
        unreadChatCounts: 0,
      })
    );

    socket.emit("chat:new", newMessage);
  };

  const fetchOldChats = async () => {
    setFetchingChats(true);
    const res = await runAxiosAsync<{ conversation: Conversation }>(
      authClient("/conversation/chats/" + conversationId)
    );
    setFetchingChats(false);

    if (res?.conversation) {
      dispatch(addConversation([res.conversation]));
    }
  };

  const sendSeenRequest = () => {
    runAxiosAsync(
      authClient.patch(`/conversation/seen/${conversationId}/${peerProfile.id}`)
    );
  };

  useEffect(() => {
    const handleApiRequest = async () => {
      await fetchOldChats();
      await sendSeenRequest();
    };
    handleApiRequest();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const updateSeenStatus = (data: NewMessageResponse) => {
        socket.emit("chat:seen", {
          messageId: data.message.id,
          conversationId,
          peerId: peerProfile.id,
        });
      };
      socket.on("chat:message", updateSeenStatus);

      return () => socket.off("chat:message", updateSeenStatus);
    }, [])
  );

  if (!profile) return null;

  if (fetchingChats) return <EmptyView title="Hãy đợi..." />;

  return (
    <View style={styles.container}>
      <AppHeader
        backButton={<BackButton />}
        center={
          <PeerProfile name={peerProfile.name} avatar={peerProfile.avatar} />
        }
      />
      <GiftedChat
        messages={formatConversationToIMessage(conversation)}
        user={{
          _id: profile.id,
          name: profile.name,
          avatar: profile.avatar,
        }}
        onSend={handleOnMessageSend}
        renderChatEmpty={() => <EmptyChatContainer />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatWindow;
