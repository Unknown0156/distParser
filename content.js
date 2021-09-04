function sendParse(qaobj) {
    subject=document.querySelector('.breadcrumb li:nth-child(2) a');
    if(subject!=null){
        qaobj.subject=subject.textContent;
    }
    theme=document.querySelector('.breadcrumb li:nth-child(3) span[tabindex="0"]');
    if(theme!=null){
        qaobj.theme=theme.textContent;
    }
    testnum=document.querySelector('.breadcrumb li:last-child a');
    if(testnum!=null){
        qaobj.testnum=testnum.textContent;
    }
    username=document.querySelector(".logininfo .dropdown-toggle");
    if(username!=null){
        qaobj.username=username.textContent;
    }
    profession=document.querySelector(".logininfo .nav>li:last-child");
    if(profession!=null){
        qaobj.profession=profession.textContent;
    }
    chrome.runtime.sendMessage(qaobj);    
}

//Парсинг и отправка на бэк
function parse() {
    question=document.querySelector(".qtext");
    if (question!=null){
        qaobj={type:"data"};
        qaobj.question=question.innerHTML;
        answer=document.querySelector(".rightanswer");
        if(answer!=null){
            qaobj.answer=answer.innerHTML;
            sendParse(qaobj);
        }else{
            answer=document.querySelector('.r0.correct')
            if(answer!=null){
                qaobj.answer=answer.innerHTML;
                sendParse(qaobj);
            }else{
                answer=document.querySelector('.r1.correct')  
                if(answer!=null){
                    qaobj.answer=answer.innerHTML;
                    sendParse(qaobj);
                }  
            }
        }
    }    
}

parse();

//Авторан
function autorun() {

starttest=document.querySelector('input[value="Начать"]')
if(starttest==null){
    starttest=document.querySelector('input[value="Пройти тест заново"]');
    if(starttest==null){
        starttest=document.querySelector('input[value="Продолжить последнюю попытку"]');
        if(starttest!=null){
            starttest.click();    
        }
    }else{
        starttest.click();
    }
}else{
    starttest.click();
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
    endtest=document.querySelector(".endtestlink");
    if(endtest!=null)
        endtest.click();
}   

next=document.querySelector('[title="Далее"]');
if(next!=null){
    next.click();
}

endoverview=document.querySelector(".submitbtns a");
if(endoverview!=null){
    if(endoverview.textContent!="Закончить обзор")
        return;
    if(confirm('Тест закончен. Повторить?')) {
        endoverview.click();
    } else {
        chrome.runtime.sendMessage({type:"msg", value:"stop"});
    }
}
}

//Проверка авторана
chrome.runtime.sendMessage({type:"msg", value:"autorun"}, function(response) {
    if (response){
        autorun();
    }
});

//Запуск авторана в активном окне
chrome.runtime.onMessage.addListener( (message) => {
    if (message.action="start"){
        autorun();
    }
});
