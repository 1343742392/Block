
/*

function Grid(rowNum, columnNum) 
{
    var rowArray = new Array(rowNum);
    this.rowNum = rowNum;
    this.columnNum = columnNum;
    for (var f = 0; f < columnNum; f++) 
    {
        rowArray[f] = Array(25);
    }

    this.add = function (obj, row, colum) 
    {
        rowArray[row][colum] = obj;
        obj.setPosition(300, 1300);
    };

    this.set = function (obj, row, colum) 
    {
        rowArray[row][colum] = obj;
        obj.setPosition()
    };

    this.get = function (row, colum)
    {
        return rowArray[row][colum];
    }
    
}
*/

function log(str)
{
    console.log(str);
}

//self在以project为原点的位置
function relative(self, project)
{
    return new cc.Vec2(self.x - project.x, self.y - project.y);
}

class Grid
{
    
    constructor(rowNum, columnNum, size)
    {
        this.rowArray = new Array(rowNum);
        this.rowNum = rowNum;
        this.columnNum = columnNum;
        this.blockSize = size;
        for (var f = 0; f < rowNum; f++) 
        {
            this.rowArray[f] = Array(columnNum);
        }
    }

    add(obj) 
    {
        let colum = parseInt(this.columnNum / 2 + 1);
        this.set(obj, 0, colum);
    };

    set(obj) 
    {
        switch(arguments.length)
        {
            case 2:
                var pos = arguments[1];
                if(pos.x >= this.rowNum || pos.y >= this.columnNum) return false;
                this.rowArray[pos.x][pos.y] = obj
                if(obj == null) return;
                let x1 = pos.y * this.blockSize + 25;
                let y1 = 1415 -  pos.x * this.blockSize;
                obj.setPosition(x1, y1);
                break;
            case 3:
                var row = arguments[1];
                var colum = arguments[2];
                if(row >= this.rowNum || colum >= this.columnNum) return false;
                this.rowArray[row][colum] = obj;
                if(obj == null) return;
                let x = colum * this.blockSize + 25;
                let y = 1415 -  row * this.blockSize;
                obj.setPosition(x, y);
                break;
        }
        
    };

    get(row, colum)
    {
        switch(arguments.length)
        {
            case 1:
                var pos = arguments[0];
                if(pos.x >= this.rowNum || pos.y >= this.columnNum || pos.x < 0 || pos.y < 0) return false;
                return this.rowArray[pos.x][pos.y];
            break;
            case 2:
                if(row >= this.rowNum || colum >= this.columnNum || row < 0 || colum < 0) return false;
                return this.rowArray[row][colum];
            break;
        }
        
    }

    getActives(num)
    {
        var reslut = [];
        for(var f = 0; f < this.rowNum; f ++)
        {
            for(var f1  = 0; f1 < this.columnNum; f1 ++)
            {
                var block = this.get(f,f1);
                if(block == undefined) continue;
                if(block.getComponent("block").active)
                {
                    num--;
                    reslut.push(new cc.Vec2(f, f1));
                    if(num == 0)return reslut;
                }
            }
        }
    }

}

var gri =  new Grid(28, 10, 50);
var activeNum = 4;

cc.Class({
    extends: cc.Component,
    properties: {
        block: {
            default: null,
            type: cc.Node,
          },
         
    },


    blockRotate:function()
    {
        //获取中心点
        var center = null;
        var actives = gri.getActives(activeNum);
        for(var f = 0; f < actives.length; f ++)
        {
           if(gri.get(actives[f]).center == true)
           {
               center = actives[f];
               break;
           }
        }
        if(center == null) 
        {
            log('not center point, unable rotate')
            reutrn;
        }
        //从网格提取方块
        var blocks = [];
        for(var f = 0; f < actives.length; f ++)
        {
            blocks.push(gri.get(actives[f]));
            gri.set(null, actives[f]);
        }
        
        //是否有选择空间
        var projects = [];
        for(var f = 0; f < actives.length; f ++)
        {
            var   project = center.add(relative(actives[f],  center).rotate(Math.PI / 2));
            project.x = parseInt(project.x);
            project.y = parseInt(project.y);

            if(gri.get(project) != undefined || gri.get(project) == false)
            {
                //没有空间旋转
                return;
            }
            projects.push(project);
        }

        //放置方块
        for(var f = 0; f < actives.length; f ++)
        {
            gri.set(blocks[f], projects[f])
        }

    },

    down:function()
    {
        var index = 0
        var pos = [];
        var values = [];
        for(var f = 0; f < gri.rowNum; f ++)
        {
            for(var f1  = 0; f1 < gri.columnNum; f1 ++)
            {
                var block = gri.get(f,f1);
                if(block == undefined) continue;
                if(block.getComponent("block").active)
                {
                    if(gri.get(f + 1,f1) == undefined || gri.get(f + 1,f1) != false)
                    {
                        values.push(block);
                        pos.push(new cc.Vec2(f, f1));
                        index ++;
                        if(index == activeNum) 
                        {
                            for(var f2 =  pos.length - 1; f2 >= 0; f2 --)
                            {
                                gri.set(null, pos[f2]);
                            }
                            for(var f2 =  pos.length - 1; f2 >= 0; f2 --)
                            {
                                gri.set(values[f2], pos[f2].x += 1, pos[f2].y);
                            }
                            return;
                        }
                    }
                }
            }
        }
        
    },

    right:function()
    {
        var index = 0
        var pos = [];
        var values = [];
        for(var f = 0; f < gri.rowNum; f ++)
        {
            for(var f1  = 0; f1 < gri.columnNum; f1 ++)
            {
                var block = gri.get(f,f1);
                if(block == undefined) continue;
                if(block.getComponent("block").active)
                {
                    if(gri.get(f,f1 + 1) == undefined || gri.get(f,f1 + 1) != false)
                    {
                        values.push(block);
                        pos.push(new cc.Vec2(f, f1));
                        index ++;
                        if(index == activeNum) 
                        {
                            for(var f2 =  pos.length - 1; f2 >= 0; f2 --)
                            {
                                gri.set(null, pos[f2]);
                            }
                            for(var f2 =  pos.length - 1; f2 >= 0; f2 --)
                            {
                                gri.set(values[f2], pos[f2].x , pos[f2].y += 1);
                            }
                            return;
                        }
                    }
                }
            }
        }
    },

    left:function()
    {
        var index = 0
        var pos = [];
        var values = [];
        for(var f = 0; f < gri.rowNum; f ++)
        {
            for(var f1  = 0; f1 < gri.columnNum; f1 ++)
            {
                var block = gri.get(f,f1);
                if(block == undefined) continue;
                if(block.getComponent("block").active)
                {
                    if(gri.get(f,f1 - 1) == undefined || gri.get(f,f1 - 1) != false)
                    {
                        values.push(block);
                        pos.push(new cc.Vec2(f, f1));
                        index ++;
                        if(index == activeNum) 
                        {
                            for(var f2 =  pos.length - 1; f2 >= 0; f2 --)
                            {
                                gri.set(null, pos[f2]);
                            }
                            for(var f2 =  pos.length - 1; f2 >= 0; f2 --)
                            {
                                gri.set(values[f2], pos[f2].x, pos[f2].y -= 1);
                            }
                            return;
                        }
                    }
                }
            }
        }
    },
    
    rotate:function()
    {

    },

    addblock:function(bolckType)
    {
        switch(bolckType)
        {
           case  "7":
           var blockClone1 = cc.instantiate(this.block);
           var blockClone2 = cc.instantiate(this.block);
           var blockClone3 = cc.instantiate(this.block);
           var blockClone4 = cc.instantiate(this.block);
           blockClone2.center = true;
           var scene = cc.director.getScene();
           blockClone1.parent = scene;
           blockClone2.parent = scene;
           blockClone3.parent = scene;
           blockClone4.parent = scene;
           
           gri.set(blockClone1, 0, 5);
           gri.set(blockClone2, 0, 6);
           gri.set(blockClone3, 0, 7);
           gri.set(blockClone4, 1, 5);
           break;
        }
       

    },

    onLoad () {
       
    },

    start () {
        var a = new cc.Vec2(1,1);
        alert(a.add(a));
        this.addblock("7");
        this.autoDown();
    },

    autoDown:function(){
        setTimeout(() => {
            this.down();
            this.autoDown();
        }, 500);
    }
   

});
