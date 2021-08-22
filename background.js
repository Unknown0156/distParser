var qa=[];
var title;
chrome.extension.onMessage.addListener(request=> {
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
if(request.type=="msg"){
    switch (request.value) {
        case "show":
            chrome.runtime.sendMessage({
                msg: "showqa",
                data: qa
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


