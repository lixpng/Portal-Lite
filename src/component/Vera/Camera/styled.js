import styled from 'styled-components';
const StyledWrapper = styled.div`
  overflow: hidden;
  position: relative;
  min-width: 200px;
  min-height: 200px;
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius);
  border: none;
  background: transparent;
  .video .username,
  .opts {
    visibility: hidden;
  }
  &:hover {
    .video {
      .username,
      .opts {
        visibility: visible;
      }
    }
  }
  .processing {
    z-index: 10;
    display: none;
    text-transform: capitalize;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -70%, 0);
    padding: 10px;
    border-radius: 5px;
    background-color: var(--camera-bg-color);
    font-size: 22px;
    color: var(--font-color);
  }
  .video {
    position: relative;
    display: flex;
    width: 200px;
    height: 200px;
    &.hidden video {
      visibility: hidden;
    }

    .opts {
      z-index: 7;
      position: absolute;
      bottom: 5px;
      left: 5px;
      padding: 5px;
      display: flex;
      /* visibility: hidden; */
      .opt {
        padding: 0;
        // opacity: 0.6;
        border: none;
        border-radius: var(--border-radius);
        background-color: var(--button-bg-color);
        height: 22px !important;
        width: 22px !important;
        min-width: unset;
        background-size: 70%;
        background-repeat: no-repeat;
        background-position: center;
        cursor: pointer;
        &:not(:last-child) {
          margin-right: 6px;
        }
        &.bg {
          background-image: url(${`chrome-extension://${chrome.runtime.id}/crx/vera/assets/icon/bg.rm.svg`});
          &[data-status='false'] {
            background-image: url(${`chrome-extension://${chrome.runtime.id}/crx/vera/assets/icon/bg.rm.off.svg`});
          }
        }
        &.video {
          background-image: url(${`chrome-extension://${chrome.runtime.id}/crx/vera/assets/icon/video.on.svg`});
          &[data-status='false'] {
            background-image: url(${`chrome-extension://${chrome.runtime.id}/crx/vera/assets/icon/video.off.svg`});
          }
        }
        &.audio {
          background-color: var(--button-bg-color);
          background-image: url(${`chrome-extension://${chrome.runtime.id}/crx/vera/assets/icon/audio.on.svg`});
          &[data-status='false'] {
            background-color: #863733;
            background-image: url(${`chrome-extension://${chrome.runtime.id}/crx/vera/assets/icon/audio.off.svg`});
          }
        }
        &.pin {
          background-image: url(${`chrome-extension://${chrome.runtime.id}/crx/vera/assets/icon/pin.off.svg`});
          &[data-status='false'] {
            background-image: url(${`chrome-extension://${chrome.runtime.id}/crx/vera/assets/icon/pin.svg`});
          }
        }
      }
    }
  }
`;

export default StyledWrapper;
