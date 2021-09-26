const srv="https://distsrv.downshift.keenetic.pro";
const version=chrome.runtime.getManifest().version;

//проверка доступа
async function checkAuth(name, prof) {
    const response = await fetch(srv+"/auth",{
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username:name, profession:prof})
    });    
    return response.status;
}

//получение ссылки на телеграм
async function tgLink() {
    const response = await fetch(srv+"/tg",{
        method: 'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
        },
    });    
    return response.text();
}

//функция вывода данных
function showData() {
    var qacount=document.getElementById("qacount");
    var qa=document.getElementById("qa");
    if(qacount!=null && qa!=null){
        chrome.runtime.sendMessage({type:"msg", value:"show"}, function(response){
            if(qacount.innerHTML==("Ответов получено: "+response.length))
                return;
            qacount.innerHTML="Ответов получено: "+response.length;
            qa.innerHTML="";
            if(response[0]==null)
                return;

            //построение таблицы с вопрос-ответом
            var tbl = document.createElement('table');
            tbl.style.width = '100%';
            tbl.setAttribute('border', '1');
            tbl.setAttribute('cellpadding', '4');
            tbl.setAttribute('cellspacing', '0');
            var tcap=document.createElement('caption');
            tcap.append(response[0].subject+'>'+response[0].theme);
            tbl.appendChild(tcap);
            var thead=document.createElement('thead');
            var tr=document.createElement('tr');
            var th=document.createElement('th');
            th.append('№');
            tr.appendChild(th);
            var th=document.createElement('th');
            th.append('Вопрос');
            tr.appendChild(th);
            var th=document.createElement('th');
            th.append('Ответ');
            tr.appendChild(th);
            thead.appendChild(tr);
            tbl.appendChild(thead);
            var tbdy = document.createElement('tbody');
            var i=0;
            response.forEach(element => {
                var tr = document.createElement('tr');
                var itd = document.createElement('td');
                itd.append(++i);
                tr.appendChild(itd);
                var qtd = document.createElement('td');
                tr.appendChild(qtd);
                qtd.insertAdjacentHTML('afterbegin', '<span>'+element.question+'</span>');
                var atd = document.createElement('td');
                tr.appendChild(atd);
                atd.insertAdjacentHTML('afterbegin', '<span>'+element.answer+'</span>');
                tbdy.appendChild(tr);
            });
            tbl.appendChild(tbdy);
            qa.appendChild(tbl);

            //проверка авторизации и вывод ссылки на телеграм
            checkAuth(response[0].username, response[0].profession)
            .then(status=>{
                tgLink()
                .then(tglink=>{
                    if(status>200){    
                        qa.insertAdjacentHTML('afterbegin', '<span style="color: red">Вы используете демо версию приложения, ограниченную тремя ответами. Перейдите в телеграмм-канал чтобы получить полную версию:</span><br><a class="uibtn" href='+tglink+' target=_blank><img src="images/tg.png"></a>');
                    }else{
                        qa.insertAdjacentHTML('beforeend', '<span>По всем вопросам обращаться в телеграм-канал:</span><br><a class="uibtn" href='+tglink+' target=_blank><img src="images/tg.png"></a>');
                    }
                })
                
            })
        });
    }    
}

document.addEventListener('DOMContentLoaded', function() {
    //вывод данных по таймеру
    showData();
    let intervalId = window.setInterval(function(){
        showData();
    }, 500);

    //запуск авторежима
    var start = document.getElementById('startbtn');
    start.addEventListener('click', function() {
        chrome.runtime.sendMessage({type:"msg", value:"start"});
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "start"});  
        });
    });

    //остановка авторежима
    var stop = document.getElementById('stopbtn');
    stop.addEventListener('click', function() {
        chrome.runtime.sendMessage({type:"msg", value:"stop"});
    });

    //расширение в отдельной вкладке
    var full = document.getElementById('fullbtn');
    full.addEventListener('click', function() {
        fulllink=document.createElement('a');
        fulllink.href="#";
        fulllink.target="_blank";
        fulllink.click();
    });

    //расширение в отдельном окне
    var newwindow=document.getElementById('nwbtn');
    newwindow.addEventListener('click', function() {
        chrome.windows.create({
            url: chrome.runtime.getURL("popup.html"),
            type: "popup",
            focused: true,
            width: 560,
            height: 860,
            left: 600
          });   
    }) 

    //очистить вопросы-ответы
    var reset = document.getElementById('resetbtn');
    reset.addEventListener('click', function() {
        chrome.runtime.sendMessage({type:"msg", value:"reset"});
    });
});