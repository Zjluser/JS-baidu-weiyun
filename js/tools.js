//获取到元素身上dataset里面的id，并转换成数据类型
function getDataSet(obj){
    return obj.dataset.id * 1;

}

//获取被选中的数据(当前页面currentData中的)
function isCheckedFile(data){
    var arr=[];
    for(var i=0;i<data.length;i++){
        if(data[i].checked){
            arr.push(data[i])
        }
    }
    return arr
}

//提示框
function alertMessage(val,type){
    var tip=document.querySelector(".tip");
    tip.innerHTML=val;
    tip.classList.add(type);
    setTimeout(()=>{
        tip.classList.remove(type);
        tip.innerHTML='';
    },1500)
}

//根据数据查找对应的节点
function getChildNode(parentNode,id){
    var children=parentNode.children;
    for(var i=0;i<children.length;i++){
        if(getDataSet(children[i])==id){
            return children[i];
        }
    }
    return null;
}

//判断名字是否可用(其实就是判断是否重命名了)
function nameCanUse(data,name){
    for(var i=0;i<data.length;i++){
        if(data[i].name===name){
            return false
        }
    }
    return true;
}

//判断是否全选
function isCheckedAll(data){
    for(var i=0;i<data.length;i++){
        if(!data[i].checked){
            return false;
        }
    }
    return true;
}
//判断是否有选中的
function isChecked(data){
    for(var i=0;i<data.length;i++){
        if(data[i].checked){
            return true
        }
    }
    return false
}

//判断是否要显示头部菜单
function menuShow(isChecked){
  if(isChecked){
        fileOperation.classList.remove('active');
        download.classList.add('active');
        mydevice.classList.add('active');
    }else{
         fileOperation.classList.add('active');
         download.classList.remove('active');
         mydevice.classList.remove('active');
    }
}
//拖拽函数
function dragElement(eleDown,eleMove,scope){
    eleDown.onmousedown=function(e){
        e.preventDefault();
        //获取到鼠标在按下对象里面的位置
        var dx=e.pageX-getRect(eleMove,'left');
        var dy=e.pageY-getRect(eleMove,'top');
    document.onmousemove=function(e){
        var L=e.pageX-dx-getRect(eleMove.offsetParent,'left');
        var T=e.pageY-dy-getRect(eleMove.offsetParent,'top');
        if(scope){
            L=L<=0?0:L;
            T=T<=0?0:T;
            L=L>=eleMove.offsetParent.clientWidth-eleMove.offsetWidth?
            eleMove.offsetParent.clientWidth-eleMove.offsetWidth:L;
            T=T>=eleMove.offsetParent.clientHeight-eleMove.offsetHeight?
            eleMove.offsetParent.clientHeight-eleMove.offsetHeight:T;
        }
        eleMove.style.left=L+'px';
        eleMove.style.top=T+'px';
    };
    document.onmouseup=function(){
        this.onmouseup=this.onmousemove=null;
    }
 };
}

//
function getRect(obj,type){
return obj.getBoundingClientRect()[type];
}

//重名替换数据(每一个新数据的id值都是不一样的（包括替换的数据）)
function replaceSameNameData(data,replaceData){
    for(var i=0;i<data.length;i++){
        if(data[i].name===replaceData.name){
            replaceData.pId=data[i].pId;
            replaceData.checked=false;
            data[i]=replaceData;
            data[i].name=data[i].name+'(新)';
            break;
        }
    }
}

//碰撞检测
function duang(current,target){
    var currentRect=current.getBoundingClientRect();
    var targetRect=target.getBoundingClientRect();
    var currentLeft=currentRect.left;
    var currentTop=currentRect.top;
    var currentRight=currentRect.right;
    var currentBottom=currentRect.bottom;

    var targetLeft=targetRect.left;
    var targetTop=targetRect.top;
    var targetRight=targetRect.right;
    var targetBottom=targetRect.bottom;

    return currentRight>targetLeft&&currentBottom>targetTop&&currentLeft<targetRight&&currentTop<targetBottom;
};