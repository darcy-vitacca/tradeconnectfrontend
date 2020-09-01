//Core
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "../css/inbox_settings_help.css";

//Redux
import {
  getInbox,
  deleteMessage,
  sendMessage,
} from "../redux/actions/userActions";
//Functions
//Packages
import { uuid } from "uuidv4";
import ReactTooltip from "react-tooltip";
import { ScaleLoader } from "react-spinners";

//Components
import InboxItem from "../components/inbox/inbox_item";
import InboxView from "../components/inbox/inbox_view_item";
import InboxReply from "../components/inbox/inbox_reply_item";
import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
class Inbox extends Component {
  constructor() {
    super();
    this.closeEmail = this.closeEmail.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.viewEmail = this.viewEmail.bind(this);
    this.replyEmail = this.replyEmail.bind(this);
    this.clickOnDelete = this.clickOnDelete.bind(this);

    this.state = {
      inboxState: false,
      viewEmail: false,
      viewEmailCurr: [],
      replyEmail: false,
      replyEmailCurr: [],
      sendMessage: false,
      emailDraft: [
        {
          recipientId: "",
          recipientHandle: "",
          subject: "",
          body: "",
          attachments: [],
        },
      ],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
    if(nextProps.data.contact){
      this.sendNewMessage(nextProps.data.contact.userId, nextProps.data.contact.handle)
    }
  }

  componentDidMount() {
    this.props.getInbox(this.props.user.credentials.userId);
  }

  clickOnDelete = (item, inboxMethod) => {
    this.props.deleteMessage(item.messageId, inboxMethod);
  };

  toggleInbox = () => {
    this.setState(
      {
        inboxState: !this.state.inboxState,
        viewEmail: false,
        viewEmailCurr: [],
        replyEmail: false,
        replyEmailCurr: [],
        emailDraft: []
      },
      () => {
        console.log(this.state);
      }
    );
  };
  sendNewMessage (userId, handle){
    console.log(userId)
    console.log(handle)
    this.setState(
      {
        viewEmail: false,
        viewEmailCurr: [],
        replyEmail: true,
        sendMessage: true,
        replyEmailCurr: [],
        emailDraft: [
          {
            recipientId: userId,
            recipientHandle: handle,
            createdAt: "",
            subject: "",
            body: "",
            attachments: [],
          },
        ],
      },
      () => {
        console.log(this.state);
      }
    );

  }
  replyEmail = (email) => {
    let createdAtFinal = dayjs(email.createdAt).fromNow();
    if (this.state.inboxState === false) {
      this.setState(
        {
          viewEmail: false,
          viewEmailCurr: [],
          replyEmail: true,
          replyEmailCurr: email,
          emailDraft: [
            {
              recipientId: email.senderId,
              recipientHandle: email.senderHandle,
              createdAt: email.createdAt,
              subject: "",
              body: `\n\n\n\n-----------------------------------------\nRecieved : ${createdAtFinal}\n${email.body}`,
              attachments: [],
            },
          ],
        },
        () => {
          console.log(this.state);
        }
      );
    } else if (this.state.inboxState === true) {
      this.setState(
        {
          viewEmail: false,
          viewEmailCurr: [],
          replyEmail: true,
          replyEmailCurr: email,
          emailDraft: [
            {
              recipientId: email.recipientId,
              recipientHandle: email.recipientHandle,
              createdAt: email.createdAt,
              subject: "",
              body: `\n\n\n\n-----------------------------------------\nRecieved : ${createdAtFinal}\n${email.body}`,
              attachments: [],
            },
          ],
        },
        () => {
          console.log(this.state);
        }
      );
    }
  };
  sendEmail = (event) => {
    console.log("here1234")
    event.preventDefault();
    let {
      recipientId,
      recipientHandle,
      subject,
      body,
      attachments,
    } = this.state.emailDraft[0];
    
    const message = {
      recipientId: recipientId,
      recipientHandle: recipientHandle,
      subject: subject,
      body: body,
      attachments: attachments,
    };
    this.props.sendMessage(message);
    this.props.getInbox(this.props.user.credentials.userId);
    this.closeEmail();
    console.log(this.state);
  };
  handleChange = (event) => {
    event.preventDefault();
    let emailDraft = [...this.state.emailDraft];
    emailDraft[0][event.target.name] = event.target.value;
    this.setState({ emailDraft });
     // console.log(emailDraft);
  };

  viewEmail = (email) => {
    this.setState(
      {
        viewEmail: true,
        viewEmailCurr: email,
        replyEmail: false,
        replyInboxCurr: [],
      },
      () => {
        console.log(this.state);
      }
    );
  };

  closeEmail = () => {
    console.log("here7890")
    this.setState({
      viewEmail: false,
      viewEmailCurr: [],
      replyEmail: false,
      replyEmailCurr: [],
      sendMessage: false,
      emailDraft: [
        {
          recipientId: "",
          recipientHandle: "",
          subject: "",
          body: "",
          attachments: [],
        },
      ],
    });
  };

  render() {
    let {
      UI: { loading },
      user: {
        authenticated,
        inbox: { inboxAll, sentAll },
      },
    } = this.props;
    let {
      inboxState,
      viewEmail,
      viewEmailCurr,
      replyEmail,
      replyEmailCurr,
      emailDraft,
      sendMessage
    } = this.state;
    let helpMarkup = !loading ? (
      !authenticated ? (
        this.props.history.push("/login")
      ) : (
        <div className="profileBody">
          <div className="accountContainer">
            {!inboxState ? (
              <h1 className="accountHeader">Inbox</h1>
            ) : (
              <h1 className="accountHeader">Sent Items</h1>
            )}
            <div className="accountCont">
              {viewEmail ? (
                <InboxView
                  key={uuid()}
                  closeEmail={this.closeEmail}
                  inboxState={this.state.inboxState}
                  message={viewEmailCurr}
                />
              ) : null}
              {replyEmail ? (
                <InboxReply
                  emailDraft={emailDraft[0]}
                  inboxState={inboxState}
                  messageState={sendMessage}
                  handleChange={this.handleChange}
                  closeEmail={this.closeEmail}
                  sendEmail={this.sendEmail}
                />
              ) : null}
              <div className="inboxButtons">
                <button
                  onClick={this.toggleInbox}
                  id="inboxButton"
                  disabled={inboxState !== true}
                  className="inboxButtonToggle"
                >
                  Inbox : {inboxAll !== undefined ? inboxAll.length : 0}
                </button>
                <button
                  onClick={this.toggleInbox}
                  id="sentButton"
                  disabled={inboxState}
                  className="inboxButtonToggle"
                >
                  Sent: {sentAll !== undefined ? sentAll.length : 0}{" "}
                </button>
              </div>

              <table className="inbox">
                <tr>
                  {!inboxState ? (
                    <th className="col1">From</th>
                  ) : (
                    <th className="col1">To</th>
                  )}
                  <th className="col2">Subject</th>
                  <th className="col3">Date</th>
                  <th className="col4">Reply</th>
                  <th className="col5">
                    <img
                      className="inboxDeleteIcon"
                      src={require("../images/deletedash.png")}
                      alt="profile"
                    ></img>{" "}
                  </th>
                </tr>
                {!inboxState ? (
                  inboxAll !== undefined ? (
                    inboxAll === "Inbox empty" ? (
                      <p>{inboxAll}</p>
                    ) : (
                      <InboxItem
                        reply={this.replyEmail}
                        view={this.viewEmail}
                        inboxAll={inboxAll}
                        key={uuid()}
                        delete={this.clickOnDelete}
                      />
                    )
                  ) : (
                    <p>loading</p>
                  )
                ) : sentAll !== undefined ? (
                  sentAll === "No sent items" ? (
                    <p>{sentAll}</p>
                  ) : (
                    <InboxItem
                      reply={this.replyEmail}
                      view={this.viewEmail}
                      sentAll={sentAll}
                      key={uuid()}
                      delete={this.clickOnDelete}
                    />
                  )
                ) : (
                  <p>loading</p>
                )}
              </table>
            </div>
          </div>
        </div>
      )
    ) : (
      <p>...loading</p>
    );
    return <div>{helpMarkup}</div>;
  }
}
Inbox.propTypes = {
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
  data: state.data,
});
const mapActionsToProps = {
  getInbox,
  deleteMessage,
  sendMessage,
};

export default connect(mapStateToProps, mapActionsToProps)(Inbox);
