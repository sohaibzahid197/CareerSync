'use client'
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { IoChatbubblesSharp, IoSend, IoCloseCircle } from 'react-icons/io5';
import Image from 'next/image';
import { ask } from '@/lib/GeminiAPI';
import {ImSpinner2} from "react-icons/im";


const Chatbot = ({ question }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState(null);
    const chatBottomRef = useRef(null);

    useEffect(() => {
        if (chatBottomRef.current) {
            chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversation]);

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    useEffect(() => {
        async function getResponse() {
            console.log('calling')
            if (question) {
                const response = await ask(question);
                setConversation([{ text: response, sender: 'chatbot', avatar: '/chatbot-avatar.png' }]);
                setIsOpen(true);
                question = null;
            }
        }
        getResponse();
    }, []);

    const handleSendMessage = async () => {
        if (message.trim() === '') return;

        const newConversation = [...conversation, { text: message, sender: 'user', avatar: '/user-avatar.png' }];
        setConversation(newConversation);
        setMessage('');

        const response = await ask(message);
        setConversation([...newConversation, { text: response, sender: 'chatbot', avatar: '/chatbot-avatar.png' }]);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const renderHTML = (htmlString) => {
        return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
    };

    return (
        <div className="fixed bottom-10 right-10">
            <button
                onClick={toggleChatbot}
                className="bg-slate-800 shadow-xl hover:bg-slate-600 text-slate-50 font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
            >
                {conversation ? <IoChatbubblesSharp className="h-8 w-8"/> : <ImSpinner2 size={30}
                className="animate-spin w-full text-slate-50"/>}
            </button>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-96 bg-slate-800 p-4 rounded-lg shadow-lg absolute bottom-16 right-0 z-50"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <IoChatbubblesSharp className="text-blue-500 h-8 w-8 mr-2" />
                            <h2 className="text-lg font-bold text-white">Chatbot</h2>
                        </div>
                        <button onClick={toggleChatbot} className="text-slate-50 hover:text-slate-300 focus:outline-none">
                            <IoCloseCircle size={25} />
                        </button>
                    </div>
                    <div className="overflow-y-auto h-64">
                        {conversation.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex items-start justify-${msg.sender === 'user' ? 'end' : 'start'} mb-4`}
                            >
                                {msg.sender === 'user' ? (
                                    <>
                                        <span
                                            className={`inline-block px-2 py-1 rounded-lg ${
                                                msg.sender === 'user' ? 'bg-blue-500 text-slate-50' : 'bg-gray-200'
                                            }`}
                                        >
                                            {msg.text}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span
                                            className={`inline-block px-2 py-1 rounded-lg ${
                                                msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                            }`}
                                        >
                                            {renderHTML(msg.text)}
                                        </span>
                                    </>
                                )}
                            </div>
                        ))}
                        <div ref={chatBottomRef} />
                    </div>
                    <div className="flex mt-2">
                        <input
                            type="text"
                            value={message}
                            onChange={handleMessageChange}
                            onKeyPress={handleKeyPress}
                            className="flex-grow border border-gray-300 rounded-full px-4 py-2 mr-2 focus:outline-none"
                            placeholder="Type a message..."
                        />
                        <button
                            onClick={handleSendMessage}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none"
                        >
                            <IoSend />
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Chatbot;
