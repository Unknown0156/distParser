document.addEventListener('DOMContentLoaded', function() {
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

chrome.runtime.onMessage.addListener(request=>{
    if (request.msg == "showqa") {
        var qa=document.getElementById("qa");
        qa.innerHTML="";
        var tbl = document.createElement('table');
        tbl.style.width = '100%';
        tbl.setAttribute('border', '1');
        var tbdy = document.createElement('tbody');
        request.data.forEach(element => {
            var tr = document.createElement('tr');
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

/*
TODO
Сравнение картинок
Кнопка остановки
Проверка исходного кода функции
*/