import { useState, useEffect } from 'react';
import StyledBox from './styled';
import Button from '../Button';
import Loading from '../Loading';
import InviteList from './InviteList';
import LoginArea from './LoginArea';
import useCopy from '../hooks/useCopy';
import { selectText, getInviteUrl } from '../hooks/utils';

import useUsername from '../hooks/useUsername';
const copyTxt = chrome.i18n.getMessage('copy');
const copiedTxt = chrome.i18n.getMessage('copied');

export default function InviteBox({ peerId = '' }) {
  const [inviteUrl, setInviteUrl] = useState('');
  const { username, fake } = useUsername();
  const { copied, copy } = useCopy();
  useEffect(() => {
    if (peerId) {
      setInviteUrl(getInviteUrl(peerId));
    }
  }, [peerId]);
  const handleLinkClick = ({ target }) => {
    selectText(target);
  };
  const handleCopyClick = () => {
    copy(inviteUrl);
  };
  if (!inviteUrl) return <Loading />;

  return (
    <StyledBox>
      <div className="link">
        <span className="url" onClick={handleLinkClick}>
          {inviteUrl}
        </span>
        <Button className="blue" onClick={handleCopyClick}>
          {copied ? copiedTxt : copyTxt}
        </Button>
      </div>
      {!fake && username ? <InviteList username={username} link={inviteUrl} /> : <LoginArea />}
    </StyledBox>
  );
}
