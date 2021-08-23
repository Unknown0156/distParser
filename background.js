var qa=[];
var title;
var running=false;

//Добавление вопроса/ответа в массив
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
if(request.type=="data"){
    title=request.title;
    if(qa[0]==null){
        qa.push(request);
    }else{
        var found=false;
        qa.forEach(element => {
            if(element.question==request.question && element.image==request.image){
                found=true;
                return;
            }
        })
        if(!found){
            qa.push(request);
        }
    }
}

//Сообщения от попап окна
if(request.type=="msg"){
    switch (request.value) {
        case "start":
            running=true;
            break;
        case "stop":
            running=false;
            break;
        case "count":
            chrome.runtime.sendMessage({
                msg: "qacount",
                length: qa.length
            })
            break;
        case "running":
            if(running){
                sendResponse(true);
            }else{
                sendResponse(false);
            }
            break;
        case "show":
            chrome.runtime.sendMessage({
                msg: "showqa",
                data: qa,
                title: title 
            })
            break;
        case "save":
            chrome.runtime.sendMessage({
                msg: "saveqa",
                data: qa,
                fname: title
            })
            qa=[];
            title="";
            break;
        default:
            break;
    }
}
});


