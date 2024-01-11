// TypingIndicator.js
import React from 'react';
import './Chats.css'

const TypingIndicator = () => {
  return (
    <div className="typing-indicator">
      {/* <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div> */}
      <div className='bot-messages'>
      <div className='user-name-div pannaga-name'>BOT</div>
      <div className='user-question-div pannaga-question-two'></div>
      </div>
    </div>



  );
};

export default TypingIndicator;



{/* <div className='bot-messages'>
<div className='user-name-div pannaga-name'>BOT</div>
<div className='user-question-div pannaga-question'>{text}</div>
</div> */}
