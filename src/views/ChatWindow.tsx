import AppHeader from "@conponents/AppHeader";
import useAuth from "@hooks/useAuth";
import { AppStackParamList } from "@navigator/AppNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BackButton from "@Ui/BackBotton";
import EmptyChatContainer from "@Ui/EmptyChatContainer";
import PeerProfile from "@Ui/PeerProfile";
import { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

type Props = NativeStackScreenProps<AppStackParamList, "ChatWindow">;

const ChatWindow: FC<Props> = ({ route }) => {
  const { authState } = useAuth();
  const { conversationId, peerProfile } = route.params;

  const profile = authState.profile;

  if (!profile) return null;
  return (
    <View style={styles.container}>
      <AppHeader
        backButton={<BackButton />}
        center={
          <PeerProfile name={peerProfile.name} avatar={peerProfile.avatar} />
        }
      />
      <GiftedChat
        messages={[]}
        user={{
          _id: profile.id,
          name: profile.name,
          avatar: profile.avatar,
        }}
        onSend={(messages) => {
          console.log(messages);
        }}
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
