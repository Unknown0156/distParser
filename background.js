const srv="https://distsrv.downshift.keenetic.pro";
const version=chrome.runtime.getManifest().version;
var qadb=[];
var showdb=[];
var title="";
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
                showdb=qadb;
            }else{
                showdb=qadb.slice(0,5);
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
            if(autorun){
                sendResponse(true);
            }else{
                sendResponse(false);
            }
            break;
        case "show":
            sendResponse(showdb);
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


