
function createCardResponse(widgets) {
  return {
    cards: [HEADER, {
      sections: [{
        widgets: widgets
      }]
    }]
  };
}

// How to Mapping
var REASON = {
  'nwiki': {title: 'Annual leave', inlineText: 'annual leave', imageUrl:  'https://goo.gl/EbgHuc' }, // Spa material icon
  'gsuite': {title: 'Off sick', inlineText: 'sick leave', imageUrl: 'https://goo.gl/mnZ37b'}, // Hospital material icon
  'ad': {title: 'Lunch', inlineText: 'a lunch break', imageUrl: 'https://goo.gl/zEhek7'}, // Dining material icon
  'jira': {title: 'Out of office', inlineText: 'an out-of-office', imageUrl: 'https://goo.gl/aXtqPZ'}, // Event busy material icon 
  'jira': {title: 'Out of office', inlineText: 'an out-of-office', imageUrl: 'https://goo.gl/aXtqPZ'}, // Event busy material icon 
};


function onMessage(event) {
  console.info(event);
  var widgets = ''
  var name = event.user.displayName;
  var userMessage = event.message.argumentText;
  // if user word is validated? 
  // validation function is plan to spelling check and equals
  var res = validation(userMessage);
  if(res =='404'){
    widgets = [{
        "textParagraph": {
          "text": "알아들을 수 없습니다ㅠㅠ"
        }}]
  }
  else{
    callback = MAPPING.res;
    widgets = callback();
  }
  return createCardResponse(widgets);
}

function onMessage(event) {
  console.info(event);
  var name = event.user.displayName;
  var userMessage = event.message.argumentText;

  // detect intent of the message
  var intent = detectMessageIntent(userMessage);
  var intentParams = intent.queryResult.parameters;
  
  // if we have a reason show the Calendar and Gmail Out-of-Office buttons 
  if (intentParams.reason) {
    var reason = intentParams.reason;
    var widgets = createAddSetWidget(name, reason, intentParams);
  } else {
    // no reason detected so prompt user to select using agent prompt
    var fulfillmentMessages = intent.queryResult.fulfillmentMessages[0].text.text[0];
    // build a set of buttons based on REASON
    var reasonButtonObject = Object.keys(REASON).map(function (idx) {
      intentParams.reason = idx;
      return {
        textButton: {
          text: 'Set ' + REASON[idx].title,
          onClick: {
            action: {
              actionMethodName: 'reasonButtons',
              parameters: [{key: 'entities', value: JSON.stringify(intentParams)}]
            }
          }
        }
      }
    });
    var widgets = [{
      textParagraph: {
        text: 'Hello, ' + name + '.<br/>' + fulfillmentMessages
      }
    }, {
      buttons: reasonButtonObject
    }];
  }
  return createCardResponse(widgets);
}

/**
 * Responds to a CARD_CLICKED event triggered in Hangouts Chat.
 * @param {object} event the event object from Hangouts Chat
 * @return {object} JSON-formatted response
 * @see https://developers.google.com/hangouts/chat/reference/message-formats/events
 */

function validation(msg){
  var reason = ''
  if (msg.indexOf('Gsuite') > -1) {
    // Hospital material icon
    HEADER.header.imageUrl = 'https://static.wixstatic.com/media/3b5532_5ec456e3d4c244ef92e9760a61692dc4~mv2.png';
    reason = MAPPING.Gsuite;
  } else if (msg.indexOf('JIRA') > -1) {
    reason = MAPPING.JIRA;
    HEADER.header.imageUrl = 'https://banner2.cleanpng.com/20180704/ett/kisspng-jira-atlassian-computer-software-confluence-softwa-jira-5b3d87207e0bc2.6813101115307589445163.jpg';
  }
  return reason
}

function onCardClick(event) {
  console.info(event);
  var message = '';
  var reason = event.action.parameters[0].value;
  if (event.action.actionMethodName == 'turnOnAutoResponder') {
    console.info('event.action.parameters[0].value  '+ reason);
    turnOnAutoResponder(reason);
    message = 'Turned on vacation settings.';
  } else if (event.action.actionMethodName == 'blockOutCalendar') {
    console.info('event.action.parameters[0].value  '+ reason);
    blockOutCalendar(reason);
    message = 'Blocked out your calendar for the day.';
  } else {
    message = "I'm sorry; I'm not sure which button you clicked.";
  }
  return { text: message };
}

var ONE_DAY_MILLIS = 24 * 60 * 60 * 1000;

/**
 * Turns on the user's vacation response for today in Gmail.
 * @param {string} reason the reason for vacation, either REASON.SICK or REASON.OTHER
 */

function sendMailtoAdmin(reason) {
  var currentTime = (new Date()).getTime();
  Gmail.Users.Settings.updateVacation({
    enableAutoReply: true,
    responseSubject: reason,
    responseBodyHtml: "I'm out of the office today; will be back on the next business day.<br><br><i>Created by Attendance Bot!</i>",
    restrictToContacts: true,
    restrictToDomain: true,
    startTime: currentTime,
    endTime: currentTime + ONE_DAY_MILLIS
  }, 'me');
}

/**
 * Places an all-day meeting on the user's Calendar.
 * @param {string} reason the reason for vacation, either REASON.SICK or REASON.OTHER
 */
 
function blockOutCalendar(reason) {
  CalendarApp.createAllDayEvent(reason, new Date(), new Date(Date.now() + ONE_DAY_MILLIS));
}

function JiraMenu(){
  var initWidget = [{
    textParagraph: {
      text: 'JIRA FAQ'
    }
  },{
    buttons: [{
      textButton: {
        text: '계정, 로그인, ',
        onClick: {
          action: {
            actionMethodName: 'blockOutCalendar',
            parameters: [{
              key: 'reason',
              value: 'JIRA'
            }]
          }
        }
      }
    }]
  },{
    buttons: [{
      textButton: {
        text: 'Gsuite 문의 ',
        onClick: {
          action: {
            actionMethodName: 'blockOutCalendar',
            parameters: [{
              key: 'reason',
              value: reason
            }]
          }
        }
      }
    }]
  }];
  
}

function GsuiteMenu(){
  
}

function initMenu(){
  var initWidget = [{
    textParagraph: {
      text: '안녕하세요 스마트워크팀 입니다. <br/>' + name + '님 저는 아직 성장중입니다!'
    }
  },{
    buttons: [{
      textButton: {
        text: 'nWiki 문의',
        onClick: {
          action: {
            actionMethodName: 'blockOutCalendar',
            parameters: [{
              key: 'reason',
              value: reason
            }]
          }
        }
      }
    }]
  },{
    buttons: [{
      textButton: {
        text: 'Gsuite 문의 ',
        onClick: {
          action: {
            actionMethodName: 'blockOutCalendar',
            parameters: [{
              key: 'reason',
              value: reason
            }]
          }
        }
      }
    }]
  }];
  
 return initWidget
}

