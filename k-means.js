/*k-means clustering*/
var Kmeans=(function namespace(){
    function init(k,data,attributes,initMethod){
        config.k=k;
        config.data=data;
        config.attributes=attributes;
        config.groups.length=k;
        for(var i=0;i<k;i++){
            config.groups[i]=[];
        }
        config.initMethod=initMethod||0;
    }
    /*PublicMethod*/
    init.prototype.initialize=function(centroid){
        if(config.initMethod==init.initOption.Assign){
            config.centroid=centroid;
        }
    };
    init.prototype.assignment=function(){
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
            var min=Infinity;
            var minj=-1;
            for(var j=0;j<config.data.length;j++){
                var d=getDistance(mean,config.data[j]);
                if(d<min){
                    min=d;
                    minj=j;
                }
            }
            config.centroid[i]=minj;
        }
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
        Assign:0,
        Forgy:1,
        RandomPartition:2,
    };
    /*PrivateAttribute*/
    var config={
        k:0,
        data:[],
        attributes:[],
        groups:[],
        oldCentroid:[],
        centroid:[],
        initMethod:-1,
    };
    return init;
}());