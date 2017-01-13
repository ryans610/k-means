var relationData=[];
var kmeans;
var result;
window.onload=function(){
    document.getElementById("btn-input").addEventListener("click",processData);
    document.getElementById("do-k-means").addEventListener("click",function(){
        var k=Number(document.getElementById("k").value);
        var attributes=[];
        var arr=document.getElementsByClassName("select-attribute");
        for(var i in arr){
            if(arr[i].checked){
                attributes.push(arr[i].value);
            }
        }
        kmeans=new Kmeans(k,relationData,attributes,Kmeans.initOption.Forgy);
        result=kmeans.do();
        console.log(result);
    });
};
function processData(){
    relationData.length=0;
    var data=document.getElementById("data").value.split("\n");
    var i;
    var attributes=[];
    var isnumeric=[];
    for(i=0;i<data.length;i++){
        if(data[i].includes("@relation")){
            document.getElementById("relation-name").innerHTML=data[i].split(" ")[1];
        }else if(data[i].includes("@attribute")){
            var arr=data[i].split(" ");
            attributes.push(arr[1]);
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
                o[attributes[j]]=Number(arr[j]);
            }else{
                o[attributes[j]]=arr[j];
            }
        }
        relationData.push(o);
    }
}