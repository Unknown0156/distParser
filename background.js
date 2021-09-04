const srv="https://distsrv.downshift.keenetic.pro";
const version=chrome.runtime.getManifest().version;
var qadb=[];
var title="";
var autorun=false;

//Отправка данных на сервер
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

//Проверка пользователя
async function checkAuth(user, prof) {
    const response = await fetch(srv+"/auth",{
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username:user, profession:prof})
    });    
    return response.status;
}

//Добавление вопроса/ответа в массив и на сервер
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
if(request.type=="data"){

    request.version=version;

    //Проверка тот же ли тест
    if(title!=request.theme){
        title=request.theme;
        qadb=[];
    }

    //Проверка аутентификации
    checkAuth(request.username, request.profession)
    .then(status=>{
        var found=false;
        qadb.forEach(element => {
            if(element.question==request.question){
                found=true;
                return;
            }
        })
        if((!found) && (qadb.length<5 || status<400)){
            sendqa(request)
            .then(status=>{
                if ( qadb.length<5 || status<400)
                qadb.push(request);
            })
        }
    })
}

//Сообщения от попап окна и контент скрипта
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
            sendResponse(qadb);
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


