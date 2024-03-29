import React from "react";
import { BsPerson, BsFillPersonFill } from "react-icons/bs";

const ChatMessage = ({ message, currentUser }) => {
  const { sender, text, timestamp } = message;
  const isMe = sender === currentUser;
  const messageClass = isMe
    ? "chat-message-me py-2 justify-content-end"
    : "chat-message-friend ";

  return (
    <div className={`chat-message d-flex ${messageClass}`}>
      <div className="profile-image">
        {!isMe && <BsFillPersonFill size={24} />}
      </div>
      <div className={`message-content`}>
        <p className="message-text m-0">{text}</p>
        <h6 className="message-timestamp m-0 text-small">
          {timestamp.split(" EDT")[0]}
        </h6>
      </div>
      <div className="profile-image">
        {isMe && <BsPerson size={24} className="person-icon" />}
      </div>
    </div>
  );
};

export default ChatMessage;
