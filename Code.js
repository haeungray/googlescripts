/*
function onAddToSpace(event) {
  console.info(event);
  var message = 'Thank you for adding me to ';
  if (event.space.type === 'DM') {
    message += 'a DM, ' + event.user.displayName + '!';
  } else {
    message += event.space.displayName;
  }
  return { text: message };
}

function onRemoveFromSpace(event) {
  console.info(event);
  console.log('Bot removed from ', event.space.name);
}
*/
var DEFAULT_IMAGE_URL = 'https://media.rocketpunch.com/cache/0b/98/0b98fd60b2e5d163260bf42590390eb3.png';
var HEADER = {
  header: {
    title : '베타 버전 v.0.1',
    subtitle : 'Smart Work Bot',
    imageUrl : DEFAULT_IMAGE_URL
  }
};


function createCardResponse(widgets) {
  return {
    cards: [HEADER, {
      sections: [{
        widgets: widgets
      }]
    }]
  };
}

var REASON = {
  SICK: 'Out sick',
  OTHER: '테스트로'
};

/**
 * Responds to a MESSAGE event triggered in Hangouts Chat.
 * @param {object} event the event object from Hangouts Chat
 * @return {object} JSON-formatted response
 */

function onMessage(event) {
  console.info(event);
  var reason = REASON.OTHER;
  var name = event.user.displayName;
  var userMessage = event.message.argumentText;
  userMessage = titleIndexing(userMessage)
  if(Reason[userMessage] == 'INIT'){
    var widgets = initMenu();
  }
  return createCardResponse(widgets);
}

/**
 * Responds to a CARD_CLICKED event triggered in Hangouts Chat.
 * @param {object} event the event object from Hangouts Chat
 * @return {object} JSON-formatted response
 * @see https://developers.google.com/hangouts/chat/reference/message-formats/events
 */

function titleIndexing(msg){
  // If the user said that they were 'sick', adjust the image in the
  // header sent in response.
  if (msg.indexOf('sick') > -1) {
    // Hospital material icon
    HEADER.header.imageUrl = 'https://goo.gl/mnZ37b';
    reason = REASON.SICK;
  } else if (msg.indexOf('vacation') > -1) {
    // Spa material icon
    HEADER.header.imageUrl = 'https://goo.gl/EbgHuc';
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

