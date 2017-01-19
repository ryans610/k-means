/*k-means clustering*/
var Kmeans=(function namespace(){
    function init(k,data,attributes,initMethod,cycleLimit){
        config.k=k;
        config.data=data;
        config.attributes=attributes;
        config.initMethod=initMethod;
        config.groups=[];
        config.oldCentroid=[];
        config.groups.length=k;
        for(var i=0;i<k;i++){
            config.groups[i]=[];
        }
        config.cycle=0;
        config.cycleLimit=cycleLimit;
    }
    /*PublicMethod*/
    init.prototype.initialize=function(centroid){
        if(config.initMethod==init.initOption.Assign){
            config.centroid=centroid;
        }else if(config.initMethod==init.initOption.Forgy){
            config.centroid=[];
            var arr=config.data.slice();
            while(config.centroid.length!=config.k){
                var i=Math.floor(Math.random()*arr.length);
                if(!config.centroid.includes(i)){
                    config.centroid.push(i);
                    arr.splice(arr.indexOf(i),1);
                }
            }
        }else if(config.initMethod==init.initOption.RandomPartition){
            config.centroid=[];
            for(var i=0;i<config.data.length;i++){
                config.groups[Math.floor(Math.random()*config.k)].push(i);
            }
            init.prototype.update();
        }
    };
    init.prototype.assignment=function(){
        config.cycle++;
        //reset groups
        for(var i=0;i<config.k;i++){
            config.groups[i].length=0;
        }
        //assignment
        for(var i=0;i<config.data.length;i++){
            var min=Infinity;
            var minj=-1;
            for(var j=0;j<config.k;j++){
                var d=getDistance(config.data[i],config.data[config.centroid[j]]);
                if(d<min){
                    min=d;
                    minj=j;
                }
            }
            config.groups[minj].push(i);
        }
    };
    init.prototype.update=function(){
        //reset centroid
        config.oldCentroid=config.centroid.slice();
        config.centroid.length=0;
        config.centroid.length=config.k;
        //each group
        for(var i=0;i<config.k;i++){
            var mean={};
            //each attribute
            for(var j=0;j<config.attributes.length;j++){
                var sum=0;
                for(var m=0;m<config.groups[i].length;m++){
                    sum+=config.data[config.groups[i][m]][config.attributes[j]];
                }
                sum/=config.attributes.length;
                mean[config.attributes[j]]=sum;
            }
            //get centroid
            var min=Infinity;
            var minj=-1;
            for(var j=0;j<config.data.length;j++){
                var d=getDistance(mean,config.data[j]);
                if(d<min&&!config.centroid.includes(j)){
                    min=d;
                    minj=j;
                }
            }
            config.centroid[i]=minj;
        }
    };
    init.prototype.finish=function(){
        if(config.cycle>config.cycleLimit){
            return true;
        }
        for(var i=0;i<config.k;i++){
            if(!config.oldCentroid.includes(config.centroid[i])){
                return false;
            }
        }
        return true;
    };
    init.prototype.getGroups=function(){
        return config.groups;
    };
    init.prototype.do=function(centroid){
        init.prototype.initialize(centroid);
        while(!init.prototype.finish()){
            init.prototype.assignment();
            init.prototype.update();
        }
        return init.prototype.getGroups();
    };
    /*PrivateMethod*/
    function getDistance(a,b){
        var sum=0;
        for(var i=0;i<config.attributes.length;i++){
            sum+=Math.pow(a[config.attributes[i]]-b[config.attributes[i]],2);
        }
        return sum;
    }
    /*PublicAttribute*/
    init.initOption={
        Assign:"Assign",
        Forgy:"Forgy",
        RandomPartition:"RandomPartition",
    };
    /*PrivateAttribute*/
    var config={
        k:null,
        data:null,
        attributes:null,
        groups:null,
        oldCentroid:null,
        centroid:null,
        initMethod:null,
        cycle:null,
        cycleLimit:null,
    };
    return init;
}());