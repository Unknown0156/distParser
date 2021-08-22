//Работа интерфейса
document.addEventListener('DOMContentLoaded', function() {
    
    var start = document.getElementById('startbtn');
    start.addEventListener('click', function() {
        chrome.runtime.sendMessage({
            type:"msg",
            value:"start"
        });
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "start"}, function(response) {});  
        });
    });

    var stop = document.getElementById('stopbtn');
    stop.addEventListener('click', function() {
        chrome.runtime.sendMessage({
            type:"msg",
            value:"stop"
        });
    });

    var show = document.getElementById('showbtn');
    show.addEventListener('click', function() {
        chrome.runtime.sendMessage({
            type:"msg",
            value:"show"
        });
    });

    var save = document.getElementById('savebtn');
    save.addEventListener('click', function() {
        chrome.runtime.sendMessage({
            type:"msg",
            value:"save"
        });
    });
});

//Получение данных с бэкграунда
chrome.runtime.onMessage.addListener(request=>{
    if (request.msg == "showqa") {
        var qa=document.getElementById("qa");
        qa.innerHTML="";
        var tbl = document.createElement('table');
        tbl.style.width = '100%';
        tbl.setAttribute('border', '1');
        tbl.setAttribute('cellpadding', '4');
        tbl.setAttribute('cellspacing', '0');
        var tcap=document.createElement('caption');
        tcap.append(request.title);
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
        request.data.forEach(element => {
            var tr = document.createElement('tr');
            var itd = document.createElement('td');
            itd.append(++i);
            tr.appendChild(itd);
            var qtd = document.createElement('td');
            qtd.append(element.question);
            if(element.image!=""){
                var img = document.createElement('img');
                img.setAttribute("src", element.image);
                qtd.append(img);
            }
            tr.appendChild(qtd);
            var atd = document.createElement('td');
            atd.append(element.answer);
            tr.appendChild(atd);
            tbdy.appendChild(tr);
        });
        tbl.appendChild(tbdy);
        qa.appendChild(tbl);
    }

    if(request.msg == "saveqa"){
        var a = document.createElement('a');
        var output = [];
        request.data.forEach(function (elem, i) {
        output[i] = {
            id: i+1,
            question: elem.question+" "+elem.image,
            answer: elem.answer
            };
        });
        var jsondata = JSON.stringify(output);
        var file = new Blob([jsondata], { type: 'text/plain' });
        a.href = URL.createObjectURL(file);
        a.download = request.fname+".json";
        a.click();
    }
});