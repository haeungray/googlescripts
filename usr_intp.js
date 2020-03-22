/**
 * Responds to a MESSAGE event in Hangouts Chat.
 * @param {Object} event the event object from Hangouts Chat
 */

var DEFAULT_IMAGE_URL = 'https://media.rocketpunch.com/cache/0b/98/0b98fd60b2e5d163260bf42590390eb3.png';
var HEADER = {
  header: {
    title : '베타 버전 v.0.1',
    subtitle : 'Smart Work Bot',
    imageUrl : DEFAULT_IMAGE_URL
  }
};

// 문자열 - URL Mapping을 위한 오브젝트 선언
const REASON = {
  '라이선스': {'url': 'license', 'ET': '1m'}
};


// 특정 채팅방에 초대되었을때 실행
function onAddToSpace(event) {
  var message = "";
  if (event.space.type == "DM") {
    message = "안녕하세요 " + event.user.displayName + "님!";
  } else {
    message = "초대해주셔서 감사합니다. " + event.space.displayName;
  }
  return { "text": message };
}

// 채팅방에서 제거시 
function onRemoveFromSpace(event) {
  console.info("봇이 제거되었습니다. ", event.space.name);
}

// 전달된 텍스트를 카드형태로 반환
function createCardResponse(widgets) {
  return {
    cards: [HEADER, {
      sections: [{
        widgets: widgets
      }]
    }]
  };
}

// 메시지 이벤트를 받았을때 
// 사용자 입력 text를 추출해서 URL MAPPING
function onMessage(event) {
  var userMessage = event.message.text;
   
  // 로깅 사용자가 요청한 단어 빈도 추출
  Logger.log('userMessage ' + userMessage);
  
  // labelMSG  반환값에
  var params = labelMsg(userMessage);
  if(params==404){
      var widgets = [{
        "textParagraph": {
          "text": "알아들을 수 없습니다ㅠㅠ"
        }}]
  }
  else {
    waitMsg(params['ET']);
    var response = UrlFetchApp.fetch('http://61.34.178.144:3000/'+ params['url']);
    Logger.log('response ' + response);
    var widgets = [{
      "textParagraph": {
        "text": response.getContentText()
      }}] 
  }
  return createCardResponse(widgets);
}
// User Msg - URL Mapping 
function labelMsg(message){
    if (message.search('라이선스') > -1) {
      return REASON['라이선스'];}
    else {return 404;}
}
function waitMsg(){
 return { "text": "잠시만 기다려주세요"};
}