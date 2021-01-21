import { useState, useRef } from 'react';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import IconThreeDots from './Icons/ThreeDots';
import { useWidgetSettings } from '../../hooks';
// import IconClose from './Icons/CircleClose';
const StyledWrapper = styled.div`
  width: 5.8rem;
  position: relative;
  /* overflow: hidden; */
  .container {
    overflow-y: scroll;
    overflow-y: overlay;
    overflow-x: hidden;
    position: relative;
    width: 100%;
    max-width: 8rem;
    height: 3.1rem;

    background: #ffffff;
    box-shadow: 0rem 0rem 0.08rem 0rem #dfdfdf;
    border-radius: 0.24rem;
    border: 0.01rem solid #ececec;
    padding: 0.29rem 0.21rem;
    transition: all 0.8s ease-in-out;

    .remove {
      cursor: pointer;
      bottom: 0.05rem;
    }
  }
  > .title {
    user-select: none;
    width: 100%;
    text-align: center;
    font-size: 0.14rem;
    font-weight: 400;
    color: #333;
    line-height: 0.2rem;
    padding-top: 0.1rem;
    padding-bottom: 0.64rem;
  }
  .setting {
    z-index: 9;

    display: flex;
    cursor: pointer;
    /* visibility: hidden; */
    width: 0.4rem;
    height: 0.4rem;
    position: absolute;
    right: 0.1rem;
    top: 0.04rem;
    opacity: 0;
    svg {
      width: 100%;
      height: 100%;
    }
  }
  .setting_list {
    z-index: 7;
    position: absolute;
    top: 0.4rem;
    right: 0.2rem;
    display: flex;
    flex-direction: column;
    font-size: 0.14rem;
    color: #000;
    /* background-color: #fff; */
    background-color: #fff;
    padding: 0.14rem;
    user-select: none;
    border-radius: 5px;
    box-shadow: 0rem 0rem 0.08rem 0rem #dfdfdf;
    .item {
      padding: 0.05rem;
      cursor: pointer;

      &:not(.sizes):hover {
        color: #fff;
        background: rgba(2, 2, 2, 0.6);
      }
      &.sizes {
        /* display: flex;
        justify-content: space-a; */
        .size {
          font-size: 0.1rem;
          border: 1px solid #333;
          padding: 0.02rem 0.04rem;
          &:not(:last-child) {
            margin-right: 0.04rem;
          }
          &.curr {
            background-color: #222;
            color: #fff;
            /* border-color: #fff; */
          }
        }
      }
    }
  }
  &:hover .setting {
    opacity: 1;
  }
  &.large .container {
    height: 6.74rem;
  }
  &.noscroll .container {
    overflow: hidden;
  }
  &.compact .container {
    padding: 0;
    /* overflow: scroll; */
    /* .setting {
      right: 0.1rem;
      top: 0.1rem;
    } */
  }
  &:fullscreen {
    height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .container {
      height: fit-content;
      width: fit-content;
      min-height: 2.4rem;
      min-width: 4.87rem;
    }
    .setting,
    .setting_list {
      display: none;
    }
  }
`;
const SizeMap = {
  middle: '中',
  large: '大',
  mini: '小'
};
export default function WidgetWrapper({
  name,
  disableScroll = false,
  removeWidget,
  title = '组件标题',
  compact,
  size = null,
  children = null
}) {
  const compContainer = useRef(null);
  const { getWidgetSetting, updateWidgetSetting } = useWidgetSettings();
  const [currSize, setCurrSize] = useState(getWidgetSetting(name, 'size') || 'middle');
  const [settingVisible, setSettingVisible] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const updateCurrSize = (key, { size }) => {
    console.log({ key, size });
    setCurrSize(size);
    updateWidgetSetting(key, { size });
  };
  const handleRemove = () => {
    let confirmed = confirm('确定删除？');
    if (confirmed) {
      removeWidget();
    }
  };
  const handleFullscreen = () => {
    //to do
    compContainer.current.requestFullscreen();
    toggleSettingListVisible();
  };
  // console.log({ compact });
  const toggleSettingListVisible = () => {
    setSettingVisible((prev) => !prev);
  };
  return (
    <StyledWrapper
      ref={compContainer}
      className={`${compact ? 'compact' : ''} ${disableScroll ? 'noscroll' : ''}  ${currSize}`}
    >
      <div className="container" ref={ref}>
        {inView ? children : null}
      </div>
      <div className="setting" onClick={toggleSettingListVisible}>
        <IconThreeDots />
      </div>
      {settingVisible && (
        <ul className="setting_list" onMouseLeave={toggleSettingListVisible}>
          <li className="item" onClick={handleRemove}>
            移除小组件
          </li>
          <li className="item" onClick={handleFullscreen}>
            全屏显示
          </li>
          {size && (
            <li className="item sizes">
              {size.map((key) => {
                return (
                  <span
                    onClick={updateCurrSize.bind(null, name, { size: key })}
                    className={`size ${currSize == key ? 'curr' : ''}`}
                    key={key}
                  >
                    {SizeMap[key]}
                  </span>
                );
              })}
            </li>
          )}
        </ul>
      )}
      <h2 className="title">{title}</h2>
    </StyledWrapper>
  );
}