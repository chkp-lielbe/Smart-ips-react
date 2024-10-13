import React, { useState, useEffect, useContext } from 'react';
import { DataSet, Timeline } from 'vis-timeline/standalone';
import { convertToformat, convertDateToFormat, getNextDayFormatted, convertFormatToDate } from '../Utils/dateAndTimeUtils';
import { GatewayConfigContext } from '../contexts/GatewayConfigContext'; // Import the context
import { ENABLED_STR, DISABLED_STR } from '../constants';
import './ProtectionsTimeline.css'

function ProtectionsTimeline() {
  const { gatewayConfig } = useContext(GatewayConfigContext); // Access the global context
  const [items, setItems] = useState([]);
  const [modalDetails, setModalDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading state to true

  useEffect(() => {
    const createdItems = createItemsForTimeline(gatewayConfig.history); // Use global history
    setItems(createdItems);
  }, [gatewayConfig.history]);

  useEffect(() => {
    if (items.length > 0) {
      const timelineItems = new DataSet(items);
      const container = document.getElementById('visualization');

      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);

      const timeline = new Timeline(container, timelineItems, {
        width: '100%',
        height: '200px',
        editable: {
          add: false,
          remove: false,
          updateTime: false,
          updateGroup: false,
        },
        margin: {
          item: 10,
          axis: 5,
        },
        orientation: 'bottom',
        end: currentDate,
        zoomMin: 1000 * 60 * 60 * 24 * 3, // min zoom of days
      });

      timeline.on('click', function (properties) {
        if (properties.item) {
          const item = items.find(item => item.id === properties.item);
          if (item) {
            setModalDetails(item);
          }
        }
      });

      // Set loading to false after the timeline has been initialized
      setLoading(false);
    } else {
      // Even if items are empty, we set loading to false to show an empty timeline
      setLoading(false);
    }
  }, [items]);

  const closeModal = () => {
    setModalDetails(null);
  };

  const copyToClipboard = () => {
    if (modalDetails && modalDetails.info) {
      const infoString = modalDetails.info.join('\n');
      navigator.clipboard.writeText(infoString).then(() => {
        console.log("Copied to clipboard:", infoString);
      }).catch(err => {
        console.error("Failed to copy to clipboard: ", err);
      });
    }
  };

  if (loading) {
    return <div className="loading-icon">Loading...</div>; 
  }

  return (
    <>
      <div id="visualization"></div>
      {modalDetails && (
        <>
          <div id="overlay"></div>
          <div id="item-modal">
            <div id="item-details">
              <p className="items-header"><strong>Disabled Protections</strong></p>
              <ul className="items-list">
                {modalDetails.info.map((info, index) => (
                  <li key={index}>{info}</li>
                ))}
              </ul>
            </div >
            <div className="button-container">
              <button className="close-modal" onClick={closeModal}>OK</button>
              <button className="copy-button" onClick={copyToClipboard} title="Copy to clipboard">
                🗐 Copy
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function createItemsForTimeline(history) {
  const timelineMap = new Map();
  let prevDate = "";
  let protectionsSet = new Set();

  for (let i = history.length - 1; i >= 0; i--) {
    const logInfo = history[i];
    const dateKey = convertDateToFormat(logInfo.date);

    if (prevDate === "") {
      timelineMap.set(dateKey, new Set());
      prevDate = dateKey;
    }
    while (dateKey !== prevDate) {
      const dayAfterPrev = getNextDayFormatted(prevDate);
      timelineMap.set(dayAfterPrev, new Set(protectionsSet));
      prevDate = dayAfterPrev;
    }

    let currentData = timelineMap.get(dateKey);

    if (logInfo.status === DISABLED_STR) {
      if (!currentData.has(logInfo.name)) {
        currentData.add(logInfo.name);
        protectionsSet.add(logInfo.name);
      }
    } else if (logInfo.status === ENABLED_STR) {
      if (currentData.has(logInfo.name)) {
        protectionsSet.delete(logInfo.name);
      }
    }
  }

  if (protectionsSet.size > 0) {
    let currentDate = new Date();
    let formatedDate = convertToformat(currentDate);
    while (formatedDate !== prevDate) {
      const dayAfterPrev = getNextDayFormatted(prevDate);
      timelineMap.set(dayAfterPrev, new Set(protectionsSet));
      prevDate = dayAfterPrev;
    }
  }

  const items = [];
  let idCounter = 1;

  timelineMap.forEach((protectionsSet, dateKey) => {
    const infoArray = Array.from(protectionsSet);
    if (infoArray.length > 0) {
      var protectionDate = convertFormatToDate(dateKey)
      items.push({
        id: idCounter,
        content: String(infoArray.length),
        start: protectionDate,
        info: infoArray,
        className: 'custom-item',
      });
      idCounter++;
    }
  });

  return items;
}

export default ProtectionsTimeline;
