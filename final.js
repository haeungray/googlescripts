function onAddToSpace(event) {
  console.info(event);
  var widgets = initMenu('init');
  return createCardResponse(widgets);
}

function onRemoveFromSpace(event) {
  console.info(event);
  console.log('Bot removed from ', event.space.name);
}

/**
 * Responds to a MESSAGE event triggered in Hangouts Chat.
 * @param {object} event the event object from Hangouts Chat
 * @return {object} JSON-formatted response
 */

// Card MSG Response
function onMessage(event) {
  var widgets = ''
  var name = event.user.displayName;
  var userMessage = event.message.argumentText;
  
  // if user word is validated? 
  // validation function is plan to spelling check and equals
  var res = validation(userMessage);
  if(res == 'error'){
    widgets = initMenu(res);
  }
  else if (res == 'init'){
    widgets = initMenu('init');
  }
  else{
    var params = 
    widgets = createAddSetWidget;
  }
  return createCardResponse(widgets);
}

function onCardClick(event) {
  var msg = '';
  var reason = event.action.parameters[0].value;
  console.info(reason);
  if (event.action.actionMethodName == 'first'){
    msg = first();
  }
  return { "text": msg };
}  
  

function createAddSetWidget(name, reason, intentParams) {
  // adjust the image and card subtitle based on reason
  HEADER.header.imageUrl = REASON[reason].imageUrl;
  HEADER.header.subtitle = 'Log your ' + REASON[reason].inlineText;
  
  // extract date objects from intent parameters returned by Dialogflow agent
  var dates = calcDateObject(intentParams);
  
  // build the Gmail/Calendar widget
  var widgets = [{
    textParagraph: {
      text: 'Hello, ' + name + '.<br/>It looks like you want to add ' + REASON[reason].inlineText + ' ' + dateRangeToString(dates) + '?'
    }
  }, {
    buttons: [{
      textButton: {
        text: 'Set ' + REASON[reason].inlineText + ' in Gmail',
        onClick: {
          action: {
            actionMethodName: 'turnOnAutoResponder',
            parameters: [{key: 'entities', value: JSON.stringify(intentParams)}]
          }
        }
      }
    }, {
      textButton: {
        text: 'Add ' + REASON[reason].inlineText + ' in Calendar',
        onClick: {
          action: {
            actionMethodName: 'blockOutCalendar',
            parameters: [{key: 'entities', value: JSON.stringify(intentParams)}]
          }
        }
      }
    }]
  }];
  return widgets;
}
/**
 This section is space to customize our chatbot services.
 */
 
function first(reason) {
  var response = UrlFetchApp.fetch('http://61.34.178.144:3000/');
  return response.getContentText()
}

// Value is a depth for query
function initMenu(msg){
  console.info(MSG[msg]['title']);
  var initWidget = [{
    textParagraph: {
      text: MSG[msg]['title']
    }
  },{
    buttons: [{
      textButton: {
        text: 'nWiki 문의',
        onClick: {
          action: {
            actionMethodName: 'first',
            parameters: [{
              key: 'reason',
              value: 'nwiki'
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
            actionMethodName: 'first',
            parameters: [{
              key: 'reason',
              value: 'gsuite'
            }]
          }
        }
      }
    }]
  },{
    buttons: [{
      textButton: {
        text: 'JIRA 문의 ',
        onClick: {
          action: {
            actionMethodName: 'first',
            parameters: [{
              key: 'reason',
              value: 'jira'
            }]
          }
        }
      }
    }]
  },{
    buttons: [{
      textButton: {
        text: 'Office 정책 문의',
        onClick: {
          action: {
            actionMethodName: 'first',
            parameters: [{
              key: 'reason',
              value: 'office'
            }]
          }
        }
      }
    }]
  },{
    buttons: [{
      textButton: {
        text: '그 밖의 다른 문의사항',
        onClick: {
          openLink:{"url": "http://ppl.cm/helpit"} 
        }
      }
    }]
  }];
  
 return initWidget
}
