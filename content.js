
function checkUser(params) {
    x=document.querySelector(".toogle-menu").textContent;
    if(ajax.xHttpRequest(x,)){
        alert("Слышь купи");
        return true;
    } 
    return false;
}

starttest=document.querySelectorAll('input[value="Пройти тест заново"]');
if(starttest[0]==null){
    starttest=document.querySelectorAll('input[value="Продолжить последнюю попытку"]');
    if(starttest[0]!=null){
        starttest[0].click();    
    }
}else{
    starttest[0].click();
}

sendtest=document.querySelectorAll('input[value="Отправить всё и завершить тест"]');
if(sendtest[0]!=null){
    sendtest[0].click();
    setTimeout(function() {
        sendtest=document.querySelectorAll('input[value="Отправить всё и завершить тест"]');
        if(sendtest[1]!=null)
            sendtest[1].click();
    }, (1000));
}else{
    endtest=document.getElementsByClassName("endtestlink");
    if(endtest[0]!=null)
        endtest[0].click();
}   

question=document.querySelector(".qtext");
if (question!=null){
    qaobj={type:"data"};
    qaobj.question=question.textContent;
    image=document.querySelector(".qtext img");
    if(image!=null){
        qaobj.image=image.src
    }else{
        qaobj.image="";
    }
    answer=document.getElementsByClassName("rightanswer");
    if(answer[0]!=null){
        qaobj.answer=answer[0].textContent;
        qaobj.title=document.querySelector('span[tabindex="0"]').textContent;
        chrome.runtime.sendMessage(qaobj);
    }
}

next=document.querySelector('[title="Далее"]');
if(next!=null){
    next.click();
}

/*endoverview=document.querySelector(".submitbtns a");
if(endoverview!=null){
    endoverview.click();
}*/