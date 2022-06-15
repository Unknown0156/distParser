const srv="https://distsrv.downshift.keenetic.pro";
const version=chrome.runtime.getManifest().version;
var qadb=[];
var title="";
var auth=false;
var autorun=false;

//отправка данных на сервер
async function sendqa(newqa) {
    const response = await fetch(srv+"/newqa",{
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newqa)
    });    
    return response.status;
}

//добавление вопроса/ответа в массив и базу данных на сервере
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
if(request.type=="data"){
    //версия расширения
    request.version=version;

    //проверка тот же ли тест
    if(title!=request.theme){
        title=request.theme;
        qadb=[];
    }

    //проверка был ли этот вопрос
    var found=false;
    qadb.forEach(element => {
        if(element.question==request.question){
            found=true;
            return;
        }
    })
    if(!found){
        sendqa(request)
        .then(status=>{
            qadb.push(request);
            if(status<400){
                auth=true;
            }else{
                auth=false;
            }
        })
    }
}

//сообщения от попап окна и контент скрипта
if(request.type=="msg"){
    switch (request.value) {
        case "start":
            autorun=true;
            break;
        case "stop":
            autorun=false;
            break;
        case "autorun":
            sendResponse(autorun);
            break;
        case "show":
            if(auth){
                sendResponse(qadb);
            }else{
                sendResponse(qadb.slice(0,5));
            }
            break;
        case "auth":
            sendResponse(auth);
            break;
        case "reset":
            qadb=[];
            title="";
            break;
        default:
            break;
    }
}
});


