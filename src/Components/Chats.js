import React, { useState, useRef, useEffect } from 'react';
import './Chats.css'
import persontwo from '../Assets/person.png';
import hamburger from '../Assets/ham.jpg'
import close from '../Assets/icons8-close-window-50.png';
import sales from '../Assets/Salesagenticon.png';
import axios from 'axios';
import TypingIndicator from './TypeindIndicator'

function Chats() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [chats, setChats] = useState([]);
  const messageListRef = useRef(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [hamburgerDisplay, setHamburgerDisplay] = useState(true);
  const [selectedChatTitle, setSelectedChatTitle] = useState('');
  const [messageHistory, setMessageHistory] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionOrder, setQuestionOrder] = useState([]);
  const [apiResponse, setApiResponse] = useState({});
  const [conversationHistory, setConversationHistory] = useState([]);
  const [selectedChatHistory, setSelectedChatHistory] = useState([]);
  const [userEnteredQuestions, setUserEnteredQuestions] = useState([]);
  const [waitingForResponse, setWaitingForResponse] = useState(false);




  const handleInputChange = (e) => {
    e.preventDefault();
    setUserInput(e.target.value);
  };
 
  
  const sendMessage = () => {
   
    if (userInput.trim() === '' || waitingForResponse) return;
     // below line is for preventing the send messaage befor response comes.
    setWaitingForResponse(true);


    const newMessage = {
      text: userInput,
      //  timestamp: new Date().toLocaleTimeString(),
      sender: 'user',
    };

    setMessages([...messages, newMessage]);


    // here 

    setConversationHistory((prevHistory) => [
      ...prevHistory,
      `User: ${userInput}`,
    ]);

    // if (currentQuestion) {
    //   setMessageHistory((prevHistory) => ({
    //     ...prevHistory,
    //     [currentQuestion]: [...(prevHistory[currentQuestion] || []), newMessage],
    //   }));
    // } else {
    //   setCurrentQuestion(userInput);
    //   setQuestionOrder([...questionOrder, userInput]);
    //   setMessageHistory((prevHistory) => ({
    //     ...prevHistory,
    //     [userInput]: [newMessage],
    //   }));
    // }

    setUserInput('');
    // below is for mapping all questions
    setUserEnteredQuestions((prevQuestions) => [...prevQuestions, userInput]);
console.log("before api call",conversationHistory)
    const query = userInput;

    const requestBody = {
      human_say: query,
      conversation_history: conversationHistory,
    };

    const headerObject = {
      'Content-Type': 'application/json',
      Accept: '/',
    };

    const dashboardsApi = 'http://sales-agent.apprikart.com/api/sales_agent/chat';

    axios
      .post(dashboardsApi, requestBody, { headers: headerObject })
      .then((response) => {
        console.log('API Response:', response);

        const chatbotResponse = response.data.say;
        const modifiedResponse = chatbotResponse
          // .replace(/\bHello!,This is Pannaga from KIA Motors\b/g, '')
          .replace('<END_OF_TURN>', '')
          // trim is for triming white space
          .trim();
        console.log('chatbotresponse', modifiedResponse);

        setApiResponse((prevResponse) => ({
          ...prevResponse,
          [userInput]: modifiedResponse,
        }));

        setConversationHistory((prevHistory) => [
          ...prevHistory,
          `Pannaga: ${modifiedResponse}`,
        ]);
        console.log("conversaation after api call",conversationHistory)
        setWaitingForResponse(false);
      })
      .catch((err) => {
        console.error('API Error:', err);
    
        // Define the error message based on the error type
        let errorMessage = 'Internal Server Error';
    
        if (!err.response) {
          errorMessage = 'Internal Server Error: No response from the server';
        }
    
        // Display the error message in the UI
        const errorResponse = `Pannaga: ${errorMessage}`;



        // after internaal server,not coming,may be becaause of below code
        
        setConversationHistory((prevHistory) => [
          ...prevHistory,
          errorResponse,
        ]);
        setWaitingForResponse(false);
      });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  function hamburgerClose() {
    setHamburgerDisplay(!hamburgerDisplay);
  }

  function hamburgerDisappearing() {
    setHamburgerDisplay(!hamburgerDisplay);
  }

  // const selectChat = (title) => {
  //   if (title === 'New Chat') {
  //     setCurrentQuestion('');
  //     setMessages([]);
  //     setConversationHistory([]);
  //   } else {
  //     setSelectedChatTitle(title);
  
  //     // Retrieve the chat history for the selected title from the chats state
  //     const selectedChat = chats.find((chat) => chat.title === title);
  
  //     if (selectedChat) {
  //       setMessages(selectedChat.answers);
  
  //       // Construct conversation history based on messages
  //       const conversation = selectedChat.answers.map((message) => {
  //         if (message.sender === 'user') {
  //           return `User: ${message.text}`;
  //         } else {
  //           return `Pannaga: ${message.text}`;
  //         }
  //       });
  
  //       setConversationHistory(conversation);
  //     } else {
  //       // Handle the case where the selected chat is not found
  //       console.log(`Chat with title "${title}" not found.`);
  //     }
  //   }
  // };
  
  
  
  
  
  

  // const displayChat = (title) => {
  //   setCurrentQuestion(title);
  //   if (title === 'New Chat') {
  //     setMessages([]);
  //   } else {
  //     setMessages(messageHistory[title] || []);
  //   }
  // };



// this useffect is for ui
  useEffect(() => {
    if (messageListRef.current) {
      // Scroll to the bottom whenever the conversation history changes
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [conversationHistory]);

  // ... (rest of your component)

  // this is for setting initial message
// useEffect(()=>{
//   //  Initial message from Pannaga
//    const initializePannagaMessage = "Hello! how can i assist you?";
//    setConversationHistory([
//       `Pannaga: ${initializePannagaMessage}`,
//      ]);
    
//   }, []);

  // in new page when new chat is started for initial message
  const initializePannagaMessage = () => {
    const initialMessage = "Hello,how can i assist you?";
    setConversationHistory([`Pannaga: ${initialMessage}`]);
  };
  

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // when new chat button is cliciked
  const startNewChat = () => {
    setSelectedChatTitle('New Chat'); // Reset selected chat title to 'New Chat'
    setCurrentQuestion('');
    setMessages([]);
    setConversationHistory([]); // Clear the conversation history
    setSelectedChatHistory([]);
    setQuestionOrder([]); // Clear the question order
    initializePannagaMessage(); 
    setUserEnteredQuestions([]);
    // below is for after clciking new chat to not to display
    // setWaitingForResponse(false);// Initialize the Pannaga message
  };


  const UserMessage = ({ text }) => (
    <div className='user-messages'>
      <div className='user-name-div user-name'>USER</div>
      <div className='user-question-div user-question'>{text}</div>
    </div>
  );
  
  // BotMessage component
  const BotMessage = ({ text }) => (
    <div className='bot-messages'>
      <div className='user-name-div pannaga-name'>BOT</div>
      <div className='user-question-div pannaga-question'>{text}</div>
    </div>
  );
  
  
  return (
    <>
      <div className={`navbar ${inputFocused ? 'navbar-focused' : ''}`}>
        <div className='chat-parent-div'>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }} className='inner-chat-paarent-div'>
            {/* <div>
              <img src={sales} alt="funding-icon" style={{ width: '40px', height: '40px' }} />
            </div> */}
            <div style={{ color: '#21261B', fontWeight: '600', letterSpacing: '0.5px' }}>
              CHATBOT.AI
            </div>
          </div>
          <div className='hamburger-button' onClick={hamburgerClose}>
            <img
              src={hamburger}
              alt="hamburger-icon"
              style={{ width: '60px', height: '60px' }}
              className='hamburger-icon'
            />
          </div>
        </div>

        <div className='clear-chat-parent-div'>
          {/* disabled is aadded to disable new chat untill new response comes */}
          <button className='new-chat-div' onClick={startNewChat} disabled={waitingForResponse}>
            + New Chat
          </button>
          <div
            className={`toggle-sidebar-button ${
              mobileSidebarOpen ? 'open' : ''
            }`}
            onClick={toggleMobileSidebar}
          >
            <img
              src={persontwo}
              alt='person-icon'
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      </div>

      <div className={hamburgerDisplay ? 'sidebaropen' : 'sidebarclose'}>
        <div className='sidebar-content'>

          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }} className='nav-topsec'>
            <div
              key='New Chat'
              className={`chat-title ${
                selectedChatTitle === 'New Chat' ? 'selected' : ''
              }`}
              // onClick={() => selectChat('New Chat')}
              style={{ textAlign: "center" }}
            >
              Question history
            </div>

            <div onClick={hamburgerDisappearing} className='hamburgerdisappearingicon' >
              <img src={close} alt="close-icon" style={{ width: "40px", height: "40px" }} />
            </div>

          </div>
          <div style={{ display: "flex", flexDirection: "row", }}>
            <div className='question-section' style={{ flexBasis: "100%" }}  >
              {/* this is for mapping questions */}
            {userEnteredQuestions.map((question, index) => (
                <li
                  key={index}
                  className={`chat-title ${
                    question === selectedChatTitle ? 'selected' : ''
                  }`}
                  onClick={() => {
                    // selectChat(question);
                    hamburgerDisappearing();
                  }}
                  style={{ padding: "5px", borderRadius: "5px", backgroundColor: "#191C14", marginTop: "10px", marginLeft: "10px", marginRight: "10px" }}
                >
                  {question}
                </li>
              ))}
            </div>
          </div>
        </div>
      </div>

      

      <div className='chat-app' >
        <div className='chat' >


          

          <div
            className='message-list'
            ref={messageListRef}
          >

            {/* <div>hiii</div> */}
            <div className='bot-messages'>
      <div className='user-name-div pannaga-name'>BOT</div>
      <div className='user-question-div pannaga-question'>hey?how can i assist you</div>
    </div>
            {conversationHistory.map((message, index) => (
              <div key={index} className='message'>
                {message.startsWith('User') ? (
                   
                  <UserMessage text={message.split(': ')[1]} />
                 
                ) : (
                  <div>
                
                  <BotMessage text={message.split(': ')[1]} />
                  </div>
             
                
                )}
              </div>
            ))}
             {waitingForResponse && <TypingIndicator />} 
          </div>
          <div className='user-input'>
            <input
              type='text'
              placeholder='Type your message..'
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyPress}
              style={{ fontFamily: "Sora, sans-serif" }}
            
            />
            <button onClick={sendMessage} disabled={waitingForResponse}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chats;