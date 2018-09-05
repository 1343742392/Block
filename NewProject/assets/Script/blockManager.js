
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

//碰撞检测方向要反过来 
function log(str)
{
    console.log(str);
}

//self在以project为原点的位置

class Grid
{
    
    constructor( columnNum,rowNum, size)
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

    setBlock(obj) 
    {
        switch(arguments.length)
        {
            case 2:
                var pos = arguments[1];
                if( pos.x >= this.columnNum || pos.y >= this.rowNum ) return false;
                this.rowArray[pos.x][pos.y] = obj;
                if(obj == null) return;
                var xPoint = pos.x * this.blockSize + 25;
                var yPoint = 1415 -  pos.y * this.blockSize;
                obj.setPosition(xPoint, yPoint);
                break;
            case 3:
                var x = arguments[1];
                var y = arguments[2];
                if( x >= this.columnNum || y >= this.rowNum ) return false;
                this.rowArray[x][y] = obj;
                if(obj == null) return;
                var xPoint = x * this.blockSize + 25;
                var yPoint = 1415 -  y * this.blockSize;
                obj.setPosition(xPoint, yPoint);
                break;
            
        }
        
    };

    setBlocks(objs, posArr)
    {
        objs.forEach(obj=>
        {
            var pos = posArr.pop();
            if(pos.x >= this.columnNum || pos.y >= this.rowNum ) return false;
            this.rowArray[pos.x][pos.y] = obj;
            if(obj == null) return;
            let x = pos.y * this.blockSize + 25;
            let y = 1415 -  pos.x * this.blockSize;
            obj.setPosition(x, y);
        })
    }

    get( colum,row)
    {
        switch(arguments.length)
        {
            case 1:
                var pos = arguments[0];
                if(pos.x >= this.columnNum  || pos.y >= this.rowNum  || pos.x < 0 || pos.y < 0) return false;
                return this.rowArray[pos.x][pos.y];
            break;
            case 2:
                if(colum >= this.columnNum   || row >= this.rowNum  || row < 0 || colum < 0) return false;
                return this.rowArray[colum][row];
            break;
        }
        
    }

    getActives(num)
    {
        var reslut = [];
        for(var f = 0; f < this.columnNum; f ++)
        {
            for(var f1  = 0; f1 < this.rowNum; f1 ++)
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
        return reslut;
    }

}

var gri =  new Grid(10, 28, 50);
var activeNum = 4;
var autoDownTime = 2000;

cc.Class({
    extends: cc.Component,
    properties: {
        block: {
            default: null,
            type: cc.Node,
          },
          leftButton: {
            default: null,
            type: cc.Node,
          },
          rightButton: {
            default: null,
            type: cc.Node,
          },
         
    }, 

    relative:function(self, project)
    {
        return new cc.Vec2(self.x - project.x, self.y - project.y);
    },
    blockRotate:function()
    {
        //获取中心点
        var center = new cc.Vec2(0, 0);
        var actives = gri.getActives(activeNum);
        for(var f = 0; f < actives.length; f ++)
        {
           if(gri.get(actives[f]).center == true)
           {
               center = actives[f];
               break;
           }
        }
        if(center.equals(new cc.Vec2(0, 0)) ) 
        {
            log('not center point, unable rotate')
            return;
        }
        //从网格提取方块
        var blocks = [];
        for(var f = 0; f < actives.length; f ++)
        {
            blocks.push(gri.get(actives[f]));
            gri.setBlock(undefined, actives[f]);
        }
        
        //是否有选择空间
        var projects = [];
        for(var f = 0; f < actives.length; f ++)
        {

            /*var a = new cc.Vec2(-1, 0);
            var b = this.relative(a, new cc.Vec2(0,0));
            alert(b.rotate(3.1415 / 2))*/

            var re = this.relative(actives[f],  center);
            var add = re.rotate(3.1415 / 2);
            var  project = center.add(add);
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
            gri.setBlock(blocks[f], projects[f])
        }

    },

    down:function()
    {
        var index = 0
        var pos = [];
        var values = [];
        for(var f = 0; f < gri.columnNum; f ++)
        {
            for(var f1  = 0; f1 < gri.rowNum; f1 ++)
            {
                var block = gri.get(f,f1);
                if(block == undefined) continue;
                if(block.getComponent("block").active)
                {
                    values.push(block);
                    pos.push(new cc.Vec2(f, f1));
                    index ++;
                    if(index == activeNum) 
                    {
                        for(var f2 =  pos.length - 1; f2 >= 0; f2 --)
                        {
                            gri.setBlock(undefined, pos[f2]);
                        }
                        for(var f3 = pos.length - 1; f3 >= 0 ; f3 --)
                        {

                            if(gri.get(pos[f3].x, pos[f3].y + 1) == false)
                            {
                                //将会出网格
                                if(f == gri.rowNum - 1)
                                {
                                    //底部网格
                                    values.forEach(value=>
                                    {
                                        value.getComponent("block").active = false;
                                    })
                                    autoDownTime = 500;
                                    this.rightButton.getComponent(cc.Button).interactable = true;
                                    this.leftButton.getComponent(cc.Button).interactable = true;

                                    this.addblock('7');
                                    gri.setBlocks(values, pos);
                                    return;
                                }
                                return;
                            }
                            if(typeof gri.get( pos[f3].x, pos[f3].y + 1) == "object" )
                            {
                                //将会碰到其他块
                                values.forEach(value=>
                                {
                                    value.getComponent("block").active = false;
                                })
                                autoDownTime = 500;
                                this.rightButton.getComponent(cc.Button).interactable = true;
                                this.leftButton.getComponent(cc.Button).interactable = true;
                                gri.setBlocks(values, pos);
                                return;
                            }
                            gri.setBlock(values[f3], pos[f3].x, pos[f3].y + 1);
                        }
                        return;
                    }
                }
            }
        }
        
    },
    speedDown:function()
    {
        autoDownTime = 50;
        this.rightButton.getComponent(cc.Button).interactable = false;
        this.leftButton.getComponent(cc.Button).interactable = false;
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
                    if(gri.get(f + 1,f1) == undefined || gri.get(f + 1,f1) != false)
                    {
                        values.push(block);
                        pos.push(new cc.Vec2(f, f1));
                        index ++;
                        if(index == activeNum) 
                        {
                            for(var f2 =  pos.length - 1; f2 >= 0; f2 --)
                            {
                                gri.setBlock(undefined, pos[f2]);
                            }
                            for(var f2 =  pos.length - 1; f2 >= 0; f2 --)
                            {
                                gri.setBlock(values[f2], pos[f2].x + 1 , pos[f2].y);
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
                    if(gri.get(f - 1,f1) == undefined || gri.get(f - 1,f1) != false)
                    {
                        values.push(block);
                        pos.push(new cc.Vec2(f, f1));
                        index ++;
                        if(index == activeNum) 
                        {
                            for(var f2 =  pos.length - 1; f2 >= 0; f2 --)
                            {
                                gri.setBlock(undefined, pos[f2]);
                            }
                            for(var f2 =  pos.length - 1; f2 >= 0; f2 --)
                            {
                                gri.setBlock(values[f2], pos[f2].x - 1, pos[f2].y);
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
           
           gri.setBlock(blockClone1, 5, 0);
           gri.setBlock(blockClone2, 6, 0);
           gri.setBlock(blockClone3, 7, 0);
           gri.setBlock(blockClone4, 5, 1);
           break;
        }
       

    },

    onLoad () {
       
    },

    start () {
        
        this.addblock("7");
        this.autoDown();
    },

    autoDown:function(){
        setTimeout(() => {
            this.down();
            this.autoDown();
        }, autoDownTime);
    }
   

});
