import { useEffect, useState, useRef } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageInputSmall,
  VirtualizedMessageList,
  Window
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';
import { getUser } from '../hooks/utils';
import StyledWrapper from './styled';
const chatClient = StreamChat.getInstance('fwcuynkafsqt');

export default function ChatBox({ channelId = null, visible = false, toggleVisible }) {
  const [channel, setChannel] = useState(null);
  const chatBoxRef = useRef(null);
  console.log({ channelId });
  useEffect(() => {
    const initialChat = async () => {
      console.log('start init chat');
      const user = await getUser();
      if (user) {
        const { username, id, photo } = user;
        const response = await fetch(
          `${process.env.REACT_APP_SERVICE_DOMAIN}/service/chat/token/${id}`
        );
        const { code, data: userToken } = await response.json();
        if (code == 0) {
          await chatClient.connectUser(
            {
              id,
              name: username,
              image: photo
            },
            userToken
          );
        }
      } else {
        console.log('init chat guest user');
        await chatClient.setGuestUser({
          id: Math.random().toString(20).substr(2, 6),
          username: 'Guest'
        });
      }
      // 初始化channel
      let cn = chatClient.channel('livestream', channelId, {
        image: 'https://static.nicegoodthings.com/privoce/works.portal.logo.png',
        name: 'Vera Chat'
      });
      setChannel(cn);
      console.log('end init chat');
      setTimeout(() => {
        let chatBox = chatBoxRef.current;
        let dragEle = chatBox.querySelector('[class^=str-chat__header]');
        let containment = document.querySelector('#VERA_FULLSCREEN_CONTAINER');
        new PlainDraggable(chatBox, {
          handle: dragEle,
          containment
        });
      }, 3000);
    };
    if (channelId) {
      initialChat();
    }
  }, [channelId]);
  return (
    <StyledWrapper ref={chatBoxRef} className={visible ? 'visible' : ''}>
      <button className="close" onClick={toggleVisible}></button>
      {channel && (
        <Chat client={chatClient} theme="livestream dark">
          <Channel channel={channel}>
            <Window>
              <ChannelHeader live />
              <VirtualizedMessageList />
              <MessageInput Input={MessageInputSmall} focus />
            </Window>
          </Channel>
        </Chat>
      )}
    </StyledWrapper>
  );
}
