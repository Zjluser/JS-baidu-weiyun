var user_data = {
  files: [
    {
      name: '根目录',
      id: 0,
      maxId: 13,
      type: 'root',
      children: [
        {
          name: 'html5',
          id: 1,
          pId: 0,
          type: 'folder',
          checked: false,
          children: [
            {
              name: '电影',
              id: 5,
              pId: 1,
              type: 'folder',
              checked: false,
              children: []
            },
            {
              name: '音乐',
              id: 6,
              pId: 1,
              type: 'folder',
              checked: false,
              children: []
            }
          ]
        },
        {
          name: 'css',
          id: 2,
          pId: 0,
          checked: false,
          children: [
            {
              name: '图书',
              id: 7,
              pId: 2,
              type: 'folder',
              checked: false,
              children: []
            }
          ]
        },
        {
          name: 'javascript',
          id: 3,
          pId: 0,
          type: 'folder',
          checked: false,
          children: [
            {
              name: '小说',
              id: 8,
              pId: 3,
              type: 'folder',
              checked: false,
              children: []
            },
            {
              name: '门票',
              id: 9,
              pId: 3,
              type: 'folder',
              checked: false,
              children: []
            }
          ]
        }
      ]
    }
  ],
  fileRightMenu:[
     {
      name:function(isFile){
        return isFile?'打开':'新建';
      },
      click:function(id,isFile){
        if(isFile){
          initChecked();
          currentData=getChildrenById(data,current=id);
          createFilesHtml(currentData,current=id)
          parents=getParentsById(data,current=id);
          createNavsHtml(parents,current=id)
        }else{
          createNewFolderBtn.onclick();
        }
      }
    },
    {
      name:0
    },
    {
      name:'移动到',
      click:function(id){
        moveListBtn.onclick();
      }
    },
    {
      name:'重命名',
      click:function(id){
        initChecked();
        var itemNode=getChildNode(fileList,id);
        checkedItem(itemNode,true);
        renameFiles.onclick();
      }
    },
    {
      name:0
    },
    {
      name:'删除',
      click:function(id){
        deleteFiles.onclick();
      }
    },
    {
      name:'属性',
      click:function(id){
        var data=getItemById(currentData,id);
        data?alertMessage(`当前文件类型：${data.type}`,'succ'):alertMessage(`当前文件类型：目录`,'succ');
        removeRightMenu();
      }
    }
  ]
};



// 工具函数：
// 通过指定的id获取到对应的数据：
let data=user_data.files;
function getItemById(data,id){
  var current=null;
  for(var i=0;i<data.length;i++){
      if(data[i].id == id){
        current=data[i]
        break;
      }
      if(!current&&data[i].children){
        current=getItemById(data[i].children,id)
        if(current){
          break;
        }
      }
   }
 return current
};

//通过指定的id获取到它所有的子级
function getChildrenById(data,id){
    var current=null;
    current=getItemById(data,id).children;
   return current;
}

//通过指定的id获取到它所有的父级
function getParentsById(data,id){
  let current=null;
  let parents=[];
  current=getItemById(data,id);
  if(current){
   parents.push(current);
   parents=parents.concat(getParentsById(data,current.pId));
  }
  return parents
};


