user=document.querySelector(".logininfo .dropdown-toggle");
if(user!=null){
    username=user.textContent;
}

chrome.runtime.sendMessage({type:"msg", value:"running"}, function(response) {
        if (response){
            autoparse();
        }else{
            
        }
    }
);

chrome.runtime.onMessage.addListener( (message) => {
    if (message.action="start"){
        autoparse();
    }
} );

//Функция автовыполнения и парсинга теста
function autoparse() {
if(username!="Евгений Аникиев")
    return;

starttest=document.querySelectorAll('input[value="Начать"]')
if(starttest[0]==null){
starttest=document.querySelectorAll('input[value="Пройти тест заново"]');
if(starttest[0]==null){
    starttest=document.querySelectorAll('input[value="Продолжить последнюю попытку"]');
    if(starttest[0]!=null){
        starttest[0].click();    
    }
}else{
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
        title=document.querySelector('span[tabindex="0"]').textContent;
        if(title!=0){
            qaobj.title=title;
        }
        chrome.runtime.sendMessage(qaobj);
    }
    
}

next=document.querySelector('[title="Далее"]');
if(next!=null){
    next.click();
}
}

/*endoverview=document.querySelector(".submitbtns a");
if(endoverview!=null){
    endoverview.click();
}*/