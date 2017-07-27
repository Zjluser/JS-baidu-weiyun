
var fileList=document.querySelector(".body");
var navsList=document.querySelector('.file-navs-list');
//全选按钮
var fileCheckboxAll=document.querySelector('.checkbox');
//新建文件夹按钮
var createNewFolderBtn=document.querySelector('.newfile');
var fileOperation=document.querySelector('.file-operate');
//删除按钮
var deleteFiles=document.querySelector('.delete-file');
var download=document.querySelector('.download');
var mydevice=document.querySelector('.mydevice');
var renameFiles=document.querySelector('.rename-file');
//移动菜单
var moveListMenu=document.querySelector('.move-list-menu');
//移动到按钮
var moveListBtn=document.querySelector('.move-file');
//遮罩层
var moveListWrap=document.querySelector('.move-list-wrap');
//右键菜单的数据
var menudata=user_data.fileRightMenu;
console.log(menudata);
//右键菜单和画框的状态控制
var isRightMenu=false;

//用来关联全选功能、新建功能的变量
var isNameing=false;
var currentData=null;
var parents=null;
var current=0;
 //初始化页面
currentData=getChildrenById(data,current);
//按照数据生成文件
createFilesHtml(currentData,current);
function createFilesHtml(currentData,id){
    let str='';
    for(let i=0;i<currentData.length;i++){
       str+=`
          <div class="file-box" data-id="${currentData[i].id}">
                     <div class="circle">√</div>
                     <div class="fileImg" data-id="${currentData[i].id}"></div>
                     <p class="file-name" data-id="${currentData[i].id}" title="${currentData[i].name}">${currentData[i].name}</p>
                     <div class="text-file" data-id="${currentData[i].id}">
                         <input type="text" class="rename-text" value="新建文件夹"/>
                         <a href="javascript:;" class="sure">√</a>
                         <a href="javascript:;" class="cancel">×</a>
                     </div>
         </div>
       `
    }
    fileList.innerHTML=str;
};



//生成导航条
parents=getParentsById(data,current);
createNavsHtml(parents,current)
function createNavsHtml(data,id){
    var str='';
     if(data.length>1){
         str+=`<a href="javascript:;" class="return">返回上一级</a>`
        }
    for(var i=data.length-1;i>=0;i--){
        str+=` <a href="javascript:;" class="${data[i].id === 0?
            'demo active' : 'demo'}" data-id="${data[i].id}">${data[i].name}</a>`;
        if(i) str+=`>`
    }
    navsList.innerHTML=str;
};



//生成树状菜单
function createTreeHtml(data,id){
    var str='<ul>';
    for(var i=0;i<data.length;i++){
        if(data[i].checked) continue;
        str+=`<li class="clear">
                <h2 class="add ${data[i].id===id?'active':''}" data-id="${data[i].id}">
                  <div class="add ${data[i].id===id?'active':''}" data-id="${data[i].id}"></div>
                  ${data[i].name}
                </h2 class="active">`;
        str+=data[i].children?createTreeHtml(data[i].children,id) : '';
        str+=`</li>`;
    }
    str+=`</ul>`
    return str;
}


//生成右键菜单
function createRightMenu(data,id,isFile){
    var fileRightMenu=document.createElement('div');
    fileRightMenu.className='fileRightMenu';
    for(var i=0;i<data.length;i++){
        var item=document.createElement('a');
        item.href="javascript:;"
        if(typeof data[i].name==='function'){
            item.innerHTML=data[i].name(isFile);
            item.onclick=data[i].click.bind(null,id,isFile);
        }else{
            if(typeof data[i].click==='function'){
                item.onclick=data[i].click.bind(null,id);
            }
        }
        if(data[i].name===0){
            item.className="botbor";
        }
        if(typeof data[i].name==="string"){
            item.innerHTML=data[i].name;
        }
        fileRightMenu.appendChild(item);
    }

    return fileRightMenu;
}


//点击导航条进入相应的页面
 navsList.addEventListener('click',function(e){
    var target=e.target;
    if(target.classList.contains('demo')){
        current=getDataSet(target);
         //重新生成文件夹页面
        currentData=getChildrenById(data,current);
        createFilesHtml(currentData,current)
        //重新生成导航栏
        parents=getParentsById(data,current);
        createNavsHtml(parents,current)
    }
    //点击返回上一级
    if(target.classList.contains('return')){
      let id=target.parentNode.lastElementChild.dataset.id;
      current=getItemById(data,id).pId;
      //重新生成文件夹页面
      currentData=getChildrenById(data,current);
      createFilesHtml(currentData,current)
      //重新生成导航栏
      parents=getParentsById(data,current);
      createNavsHtml(parents,current)
    }
 });



//点击进入文件夹
fileList.addEventListener('dblclick',function(e){
    var target=e.target;
    if(target.classList.contains('file-box')||target.classList.contains('fileImg')){
        //重新生成文件夹页面
        current=getDataSet(target);
        currentData=getChildrenById(data,current);
        createFilesHtml(currentData,current)
        //重新生成导航栏
        parents=getParentsById(data,current);
        createNavsHtml(parents,current)
    }   
}); 



//点击选中
fileList.addEventListener('click',function(e){
   var target=e.target;
   if(target.classList.contains('circle')){
     checkedItem(target.parentNode);
  }
  if(target.classList.contains('file-name')){
   initChecked();
   rename(target,getDataSet(target));
  }
  removeRightMenu();
  isRightMenu=false;
});
//选中文件夹
function checkedItem(obj,selected){
    var checked=false;
    obj.classList.toggle('active');
    obj.firstElementChild.classList.toggle('active');
     //包含checked就为true，不包含就为false
    var checked=obj.classList.contains('active')&& obj.firstElementChild.classList.contains('active');
    if(selected&&!obj.classList.contains('active')){
      obj.classList.add('active');
      obj.firstElementChild.classList.add('active');
      checked=true;
    }
    var targetData=getItemById(currentData,getDataSet(obj))
    targetData.checked = checked;
    //判断是否是全选
    if(isCheckedAll(currentData)){
        fileCheckboxAll.classList.add('active');
    }else{
        fileCheckboxAll.classList.remove('active');
    } 
  //判断头部菜单是否显示
   menuShow(isChecked(currentData))
};
//全选
fileCheckboxAll.onclick=function(){
    removeRightMenu();
    this.classList.toggle('active');
    for(var i=0;i<currentData.length;i++){
        if(this.classList.contains('active')){
            currentData[i].checked=true;
            fileList.children[i].classList.add('active');
            fileList.children[i].firstElementChild.classList.add('active');
        }else{
            currentData[i].checked=false;
            fileList.children[i].classList.remove('active');
            fileList.children[i].firstElementChild.classList.remove('active');
        }
    }
    //判断头部菜单是否显示
    menuShow(isChecked(currentData))
};
//取消全选
function initChecked(){
    fileCheckboxAll.classList.remove('active');
    for(var i=0;i<currentData.length;i++){
        currentData[i].checked=false;
        fileList.children[i].classList.remove('active');
        fileList.children[i].firstElementChild.classList.remove('active');
    }
}



//新建文件夹
createNewFolderBtn.onclick=function(){
    //在重命名的时候不能新建文件夹
     removeRightMenu();
    if(isNameing) return;
    createFolder();
};
function createFolder(){
    //新建文件夹的过程中需要重命名(一次只能新建一个)
    isNameing=true;
    //新建文件夹的过程中取消全选
    initChecked();
    //新文件夹的节点
    var newFolderNode=createFileNode();
    fileList.insertBefore(newFolderNode,fileList.firstElementChild);
    renameFile(newFolderNode,data)
}
//新建单个文件夹节点
function createFileNode(){
    //创建文件夹最外层
    var folder=document.createElement('div');
    folder.className="file-box";
    //创建选中框
    var folderBox=document.createElement('div');
    folderBox.className="circle";
    folderBox.innerHTML="√"
    //创建文件图标
    var folderImg=document.createElement('div');
    folderImg.className="fileImg";
    //创建文件的名字(先要隐藏掉初始化的名字)
    var folderName=document.createElement('div');
    folderName.className="file-name active";
    folderName.innerHTML=folderName.title='';
    //重命名文本框
    var text_file=document.createElement('div');
    text_file.className="text-file active";
    var rename_text=document.createElement('input');
    rename_text.className='rename-text';
    rename_text.value="新建文件夹";
    var cancel=document.createElement('a');
    cancel.href="javascript:;";
    cancel.className="cancel";
    cancel.innerHTML="×"
    var sure=document.createElement('a');
    sure.href="javascript:;";
    sure.className="sure";
    sure.innerHTML="√"
    text_file.appendChild(rename_text);
    text_file.appendChild(sure);
    text_file.appendChild(cancel);
    //将节点渲染到页面当中
    folder.appendChild(folderBox);
    folder.appendChild(folderImg);
    folder.appendChild(folderName);
    folder.appendChild(text_file);
    return folder;
};
//新建文件夹重命名功能
   function renameFile(fileNode,data){
    //获取到显示名字的元素
     var showName=fileNode.querySelector('.file-name');
     //获取到要修改的文本框(以及它的按钮们)
     var nextSibling=showName.nextElementSibling;
     var inputText=nextSibling.firstElementChild;
     var sureBtn=inputText.nextElementSibling;
     var cancelBtn=sureBtn.nextElementSibling;
     inputText.focus();
     inputText.select();
     function isSure(){
      let val=inputText.value.trim();
      if(val===''){
        //删除该节点
        fileNode.parentNode.removeChild(fileNode);
        alertMessage('取消创建文件夹','fail');
      }else{
        if(nameCanUse(currentData,val)){
            var filesData={
                name:val,
                id:Date.now(),
                pId:current,
                type:'folder',
                checked:false,
                children:[]
            };
            currentData.unshift(filesData);
             //重新生成文件夹页面
            currentData=getChildrenById(data,current)
            createFilesHtml(currentData,current)
            //重新生成导航栏
            parents=getParentsById(data,current);
            createNavsHtml(parents,current)
            isNameing=false;
            alertMessage('新建文件夹成功','succ');
        }else{
            alertMessage('新建文件夹失败','fail');
            inputText.select();
        }
      }
   }
   //按钮点击确认
   sureBtn.onclick=function(){
     isSure();
   }
   //回车确认
   window.onkeydown=function(e){
        if(e.keyCode===13){
          isSure();
        }
    }
   //点击取消
   cancelBtn.onclick=function(){
    fileNode.parentNode.removeChild(fileNode);
    alertMessage('取消创建文件夹','fail');
    isNameing=false;
   }
}; 
   


//重命名
   renameFiles.onclick=function(){
     removeRightMenu();
      //获取被选中的数据
     var checkedItems=isCheckedFile(currentData);
     if(!checkedItems.length){
        alertMessage('请选择文件！','fail');
        return;
     }
     if(checkedItems.length>1){
        alertMessage('只能选择一个文件夹','fail');
        return;
     }
     if(checkedItems.length===1){
        initChecked();
        //通过数据中对应的id获取到对应的DOM节点
        var reNameChild=getChildNode(fileList,checkedItems[0].id);
        var showName=reNameChild.querySelector('.file-name');
        rename(showName,getDataSet(showName));
     }  
   }
//重命名文件
function rename(ele,id){
    isNameing=true;
    //获取到它下一个的兄弟节点（text-file）
    var nextSibling=ele.nextElementSibling;
    //隐藏原来的名字
    ele.classList.add('active');
    //显示要修改的
    nextSibling.classList.add('active');

    let inputText=nextSibling.firstElementChild;

    let sure=inputText.nextElementSibling;

    let cancel=sure.nextElementSibling;
    //自动选中文字内容
    inputText.select();
    function isSure(){
        var val=inputText.value.trim();
        if(val==''||val==ele.title){
            nextSibling.classList.remove('active');
            ele.classList.remove('active');
            alertMessage('取消重命名！','fail');
            isNameing=false;
        }else{
            if(nameCanUse(currentData,val)){
                //这里的id是这个函数的id参数哦
                var currentItem=getItemById(currentData,id);
                currentItem.name=val;
                ele.title=ele.innerHTML=val;
                nextSibling.classList.remove('active');
                ele.classList.remove('active');
                isNameing=false;
                alertMessage('重命名成功！','succ');
            }else{
                alertMessage('重命名失败！','fail');
                //失败了继续改啊
                this.select();
            };
        }
    }
      //点击确认
      sure.onclick=function(){
         isSure();
      }
      //按回车键确认
      window.onkeydown=function(e){
        if(e.keyCode===13){
          isSure();
        }
      }
      //点击取消
     cancel.onclick=function(){
        nextSibling.classList.remove('active');
        ele.classList.remove('active');
        alertMessage('取消重命名！','fail');
        isNameing=false;
     }
};



//删除功能
deleteFiles.onclick=function(){
   removeRightMenu();
   var checkedFiles=isCheckedFile(currentData);
   if(checkedFiles.length){
    var isDelete=confirm('确定要删除吗','succ');
    if(!isDelete) return;
    deleteCheckedFile(currentData); 
    //重新生成文件夹页面
      currentData=getChildrenById(data,current);
      createFilesHtml(currentData,current)
      //重新生成导航栏
      parents=getParentsById(data,current);
      createNavsHtml(parents,current)
      alertMessage('删除成功！','succ');
   }else{
    alertMessage('请选择要删除的内容','fail');
   }
}

function deleteCheckedFile(data){
    for(var i=0;i<data.length;i++){
        if(data[i].checked){
            data.splice(i,1);
            i--;
        }
    }
    return data;
}


//移动到功能
moveListBtn.onclick=function(){
   removeRightMenu();
   var checkedFiles=isCheckedFile(currentData);
   if(checkedFiles.length>1){
    alertMessage('只能选择一个文件夹','fail');
    return;
   }
    moveListMenu.innerHTML=createTreeHtml(data,current);
    moveListWrap.classList.add('active');
    moveItemsFn(data);
};
function moveItemsFn(data){
    //获取当前弹出的头部
    var moveListHeader=moveListWrap.querySelector('.move-list-header');
    //关闭按钮
    var closeMoveList=moveListWrap.querySelector('.move-list-header span');
    //树状菜单
    var moveListMenu=moveListWrap.querySelector('.move-list-menu');
    //确定
    var moveSure=moveListWrap.querySelector('.move-list-wrap .sureMove');
    //取消
    var moveCancel=moveListWrap.querySelector('.move-list-wrap .cancelMove');

    //当前要移动到的目录（初始是当前这一层）
    var currentMove=current;
    //拖拽弹窗
    dragElement(moveListHeader,moveListHeader.parentNode,true);
    //点击对应菜单切换对应的class
    moveListMenu.onclick=function(e){
        var target=e.target;
        if(target.nodeName==='H2'||target.classList.contains('add')){
          currentMove=getDataSet(target);
          moveListMenu.innerHTML=createTreeHtml(data,currentMove);
        }
    };
    //确定按钮
    moveSure.onclick=function(){
        if(current===currentMove){
            alertMessage('不能移动到同一目录','fail');
            return;
        };
    //找到要移动到目标目录的所有子目录
    var targetMoveData=getChildrenById(data,currentMove)
    //关闭弹窗
    moveListWrap.classList.remove('active');
    moveItemsData(targetMoveData,currentMove);
    if(currentData.length===0){
        initChecked();
    }
    //重新渲染页面
    currentData=getChildrenById(data,current)
    createFilesHtml(currentData,current)
    //重新生成导航栏
    parents=getParentsById(data,current);
    createNavsHtml(parents,current)
    alertMessage('移动完成','succ');
    clearEvent();
  };
  moveCancel.onclick=closeMoveList.onclick=function(){
    moveListWrap.classList.remove('active');
    clearEvent();
  }
  //清除事件，释放内存
  function clearEvent(){
    moveListMenu.onclick=moveSure.onclick=null;
    moveCancel.onclick=closeMoveList.onclick=null;
    moveListHeader.onmousedown=null;
  }
} 

//移动数据
function moveItemsData(moveTargetData,targetId){
    for(var i=0;i<currentData.length;i++){
        if(currentData[i].checked){
            //如果名字是有重复的（移动目标里的子目录文件与当前页面选中的文件名字是否重复）
            if(!nameCanUse(moveTargetData,currentData[i].name)){
            let repeatMessage=confirm('有相同名字文件，是否覆盖？');
            if(repeatMessage){
              replaceSameNameData(moveTargetData,currentData[i]);
              currentData.splice(i,1);
              i--;
              continue;
            }
            let confirmMessage=confirm('是否保留两者？')
            if(!confirmMessage)continue;
            currentData[i].name=currentData[i].name+('副本')
        }
        //修改自身的pId为目标目录的pId
        currentData[i].pId=targetId;
        currentData[i].checked=false;
        moveTargetData.push(currentData.splice(i,1)[0]);
        i--;
    }
 }
};



//鼠标画框
fileList.onmousedown=function(e){
    if(e.buttons!==1)return;
    if(isNameing)return;
    if(isRightMenu)return;
    e.preventDefault();

    var target=e.target;
    if(!target.classList.contains('body')){
        return;
    }
    initChecked();
    var div=document.createElement('div');
    div.className="frame";
    this.appendChild(div);

    var startX=e.pageX,startY=e.pageY;
    fileList.onmousemove=function(e){
       var currentX=e.pageX,currentY=e.pageY;
       var L=Math.min(currentX-getRect(this,'left'),startX-getRect(this,'left'));
       var T=Math.min(currentY-getRect(this,'top'),startY-getRect(this,'top'));
       var W=Math.abs(currentX-startX);
       var H=Math.abs(currentY-startY);

       selectDuang(div);
       div.style.left=L+'px';
       div.style.top=T+'px';
       div.style.width=W+'px';
       div.style.height=H+'px';
    }
    document.onmouseup=()=>{
        document.onmouseup=this.onmousemove=null;
        this.removeChild(div);
    }
};

//碰撞检测函数
function selectDuang(obj){
    var checked=false;
    for(var i=0;i<fileList.children.length;i++){
        //通过getItemById找到当前页面中的对应id的数据
        var currentCheckedData=getItemById(currentData,getDataSet(fileList.children[i]));
        if(duang(obj,fileList.children[i])&&fileList.children[i]!==obj){
            fileList.children[i].classList.add('active');
            fileList.children[i].firstElementChild.classList.add('active');
            currentCheckedData.checked=true;
            if(isCheckedAll(currentData)){
                fileCheckboxAll.classList.add('active');
            }else{
                fileCheckboxAll.classList.remove('active');
            }
        }else{
            if(fileList.children[i].classList.contains('active')&&fileList.children[i].firstElementChild.classList.contains('active')){
                fileList.children[i].classList.remove('active');
                fileList.children[i].firstElementChild.classList.remove('active');
                currentCheckedData.checked=false;
            }
        }
        menuShow(isChecked(currentData))
    }
}



//由键菜单
fileList.oncontextmenu=function(e){
    removeRightMenu();
    isRightMenu=true;
    e.preventDefault();
    var L=e.pageX-getRect(fileList,'left'),T=e.pageY-getRect(fileList,"top");
    var target=e.target;
    var checkedItems=isCheckedFile(currentData);
    if(target.classList.contains('body')){
        var rightMenuNode=createRightMenu(menudata,current);

    }
    if(target.classList.contains('file-box')||target.classList.contains('fileImg')||target.classList.contains('file-name')){
        var id=getDataSet(target);
        var itemData=getItemById(currentData,id);
        if(checkedItems.indexOf(itemData)==-1){
             initChecked();
        }
        var itemNode=getChildNode(this,id);
        checkedItem(itemNode,true);
        var rightMenuNode=createRightMenu(menudata,id,true);
    }
    rightMenuNode.style.left=L+'px';
    rightMenuNode.style.top=T+'px';
    this.appendChild(rightMenuNode);
}
function removeRightMenu(){
    if(isRightMenu&&fileList.lastElementChild&&fileList.lastElementChild.classList.contains('fileRightMenu')){
        fileList.removeChild(fileList.lastElementChild);
    }
}