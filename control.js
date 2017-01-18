var relation;
var attributes;
var relationData=[];
var kmeans;
var result;
var timerId;
var timerCount;
window.onload=function(){
    document.getElementById("btn-input").addEventListener("click",processData);
    document.getElementById("do-k-means").addEventListener("click",function(){
        var k=Number(document.getElementById("k").value);
        var attributeList=[];
        var arr=document.getElementsByClassName("select-attribute");
        for(var i in arr){
            if(arr[i].checked){
                attributeList.push(arr[i].value);
            }
        }
        var init=document.getElementById("select-init").value;
        setTimer();
        kmeans=new Kmeans(k,relationData,attributeList,init);
        result=kmeans.do();
        clearTimer();
        console.log(result);
        document.getElementById("result").value=getResult();
        document.getElementById("show-time").innerHTML=timerCount;
        document.getElementById("show-result").classList.remove("hidden");
    });
};
function processData(){
    relationData.length=0;
    var data=document.getElementById("data").value.split("\n");
    var i;
    attributes=[];
    var isnumeric=[];
    for(i=0;i<data.length;i++){
        if(data[i].includes("@relation")){
            relation=data[i].split(" ")[1];
            document.getElementById("relation-name").innerHTML=relation;
        }else if(data[i].includes("@attribute")){
            var arr=data[i].split(" ");
            attributes.push({
                Name:arr[1],
                Type:arr[2],
            });
            isnumeric.push(arr[2]=="numeric");
            var tr=document.createElement("tr");
            var td=document.createElement("td");
            td.innerHTML=arr[1];
            tr.appendChild(td);
            td=document.createElement("td");
            td.innerHTML=arr[2];
            tr.appendChild(td);
            td=document.createElement("td");
            if(arr[2]=="numeric"){
                var chkbox=document.createElement("input");
                chkbox.type="checkbox";
                chkbox.value=arr[1];
                chkbox.classList.add("select-attribute");
                td.appendChild(chkbox);
            }
            tr.appendChild(td);
            document.getElementById("attributes").getElementsByTagName("tbody")[0].appendChild(tr);
        }else if(data[i].includes("@data")){
            break;
        }
    }
    for(i++;i<data.length;i++){
        var arr=data[i].split(",");
        var o={};
        for(var j=0;j<attributes.length;j++){
            if(isnumeric[j]){
                o[attributes[j].Name]=Number(arr[j]);
            }else{
                o[attributes[j].Name]=arr[j];
            }
        }
        relationData.push(o);
    }
    document.getElementById("show-data").classList.remove("hidden");
}
function getResult(){
    function getRow(o){
        var str="";
        for(var i=0;i<attributes.length;i++){
            str+=o[attributes[i].Name]+",";
        }
        return str;
    }
    var resultStr="";
    resultStr+="@relation "+relation+"\n\n";
    for(var i in attributes){
        resultStr+="@attribute "+attributes[i].Name+" "+attributes[i].Type+"\n";
    }
    resultStr+="@attribute group {1";
    for(var i=1;i<result.length;i++){
        resultStr+=","+(i+1);
    }
    resultStr+="}\n\n";
    resultStr+="@data\n";
    for(var i=0;i<relationData.length;i++){
        resultStr+=getRow(relationData[i]);
        for(var j=0;j<result.length;j++){
            if(result[j].includes(i)){
                resultStr+=(j+1);
                break;
            }
        }
        resultStr+="\n";
    }
    return resultStr;
}
function setTimer(){
    timerCount=0;
    timerId=setInterval(function(){timerCount+=10;},10);
}
function clearTimer(){
    clearInterval(timerId);
}