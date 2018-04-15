import React from 'react';
import { Link } from 'react-router-dom';
import {UnControlled as CodeMirror } from 'react-codemirror2';

require('codemirror/mode/erlang/erlang');

class Arena extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "",
            arenaId: props.arena || null
        };
    }

    componentWillMount () {

        //check the URL - if an arena ID is present, request that data. if not, create a new random ID
        if (this.state.arenaId) {
            //service call
            const arenaData = {
                header: "",
                data: {
                    _id: "1",
                    codeString: "--module(my_module). " + this.state.arenaId
                }
            };

            //make service call and save as str
            this.setState({ value: arenaData.data.codeString });
        }

    }

    //save to the database
    save () {}

    //reset button (get's the last saved from db)
    reset() {}

    //new fresh one
    createNew () {}

    //delete
    deleteArena() {}

    render() {
        return (
            <div className="arena">
                <CodeMirror
                    className="arena-mirror"
                    value={this.state.value}
                    options={{
                        mode: 'erlang',
                        theme: 'mdn-like',
                        lineNumbers: true,
                        autofocus: true,
                        lineWrapping: true
                    }}
                    onChange={(editor, data, value) => {
                        //make socket call
                    }}>
                </CodeMirror>
            </div>
        );
    }
}

const OutMessage = (props) => (
    <div className="me"><small>{props.displayName}:</small><br/><span>{props.message}</span></div>
);

const InMessage = (props) => (
    <div><small>{props.displayName}:</small><br/><span>{props.message}</span></div>
);

const ChatBox = (props) => (
    <ul>
      {props.messageList.map((msg, index) =>
            <li key={index}>
                {props.displayName && props.displayName === msg.displayName
                    ? <OutMessage message={msg.message} displayName={props.displayName}></OutMessage>
                    : <InMessage displayName={msg.displayName} message={msg.message}></InMessage>}
            </li>
      )}
    </ul>
);

class ChatContainer extends React.Component {
    
    constructor (props) {
        super(props);
        this.state = {
            date: new Date(),
            joined: false,
            messageList: [],
            displayName: null,
            value: ""
        };
        this.toggleChat = this.toggleChat.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.getAllMessages = this.getAllMessages.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    getAllMessages() {
        //api call to get all messages
        //replace [] with message array
        //return [];
        return  [
            { "displayName": "emk103", "message": "this is a test of our systems! this is a test of our systems! this is a test of our systems! this is a test of our systems!" },
            { "displayName": "benny990", "message": "HEY THERE how's it goin" },
            { "displayName": "lolol", "message": "some basic chat functionality" },
            { "displayName": "emk103", "message": "i got dis" },
            { "displayName": "lomotey", "message": "i am chatting here" }
        ];
    }

    sendMessage(event) {
        
       window.event = event;
        if (event.key === "Enter") {
            //format message
            const messageObject = {
                displayName: this.state.displayName,
                message: this.state.value
            };

            //api call
            this.setState({ messageList: [...this.state.messageList, messageObject], value: "" });

        }

    }

    handleChange(event) {
        console.log("event");
        this.setState({ value: event.target.value });
    }
    

    toggleChat() {
        if (this.state.joined) {
            this.setState({ joined: false, displayName: null });
        } else {
            let n = prompt("Enter a display name.");
            if (n) { this.setState({ joined: true, displayName: n }); }
        }
    }

    componentWillMount() {
        this.setState({ messageList: this.getAllMessages() });
    }

    render() {
        return (
            <div className="chat-container">
                <h2>Chat</h2>
                <ChatBox displayName={this.state.displayName} messageList={this.state.messageList}></ChatBox>
                <div className="btn-set">
                    <button className={ this.state.joined ? "leave" : "join"} onClick={this.toggleChat}>{this.state.joined ? "Leave chat" : "Join chat"}</button>
                    <textarea
                        disabled={!this.state.joined}
                        placeholder="Ask a question..."
                        onKeyPress={(e) => this.sendMessage(e)}
                        value={this.state.value}
                        onChange={(e) => this.handleChange(e)}>
                    </textarea>
                </div>
            </div>
        );
    }
}

const Landing = (props) => (
    <div className="landing">
        <Arena arena={props.match.params.arena}></Arena>
        <ChatContainer></ChatContainer>
    </div>
);

export default Landing;