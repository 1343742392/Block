
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

    this.getBlock = function (row, colum)
    {
        return rowArray[row][colum];
    }
    
}
*/
function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
} 
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
                this.rowArray[pos.y][pos.x] = obj;
                if(obj == null) return;
                var xPoint = pos.x * this.blockSize + 25;
                var yPoint = 1415 -  pos.y * this.blockSize;
                obj.setPosition(xPoint, yPoint);
                break;
            case 3:
                var x = arguments[1];
                var y = arguments[2];
                if( x >= this.columnNum || y >= this.rowNum ) return false;
                this.rowArray[y][x] = obj;
                if(obj == null) return;
                var xPoint = x * this.blockSize + 25;
                var yPoint = 1415 -  y * this.blockSize;
                obj.setPosition(xPoint, yPoint);
                break;
            
        }
        
    };

    setBlocks(objs, posArr)
    {
        var index = 0;
        objs.forEach(obj=>
        {
            var pos = posArr[index];
            if(pos.x >= this.columnNum || pos.y >= this.rowNum ) return false;
            this.rowArray[pos.y][pos.x] = obj;
            if(obj == null) return;
            let x = pos.x * this.blockSize + 25;
            let y = 1415 -  pos.y * this.blockSize;
            obj.setPosition(x, y);
            index ++;
        })
    }

    getBlock( colum,row)
    {
        switch(arguments.length)
        {
            case 1:
                var pos = arguments[0];
                if(pos.x >= this.columnNum  || pos.y >= this.rowNum  || pos.x < 0 || pos.y < 0) return false;
                return this.rowArray[pos.y][pos.x];
            break;
            case 2:
                if(colum >= this.columnNum   || row >= this.rowNum  || row < 0 || colum < 0) return false;
                return this.rowArray[row][colum];
            break;
        }
        
    }

    getBlocks( allPos)
    {
        var reslut = [];
        allPos.forEach(pos=>
        {
            if(pos.x >= this.columnNum  || pos.y >= this.rowNum  || pos.x < 0 || pos.y < 0) return false;
            reslut.push(this.rowArray[pos.y][pos.x]);
        })
        return reslut;
    }

    getActives(num)
    {
        var reslut = [];
        for(var f = 0; f < this.columnNum; f ++)
        {
            for(var f1  = 0; f1 < this.rowNum; f1 ++)
            {
                var block = this.getBlock(f,f1);
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
var autoDownTime = 0.5;
var LOWDOWNTIME = 0.5;
var SPEEDDOWNTIME = 0.05;
var DELETEANIMALEN = 1;
var blockNames = ["7", "z", "4", "1"];
var downIndex = 0;

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
           if(gri.getBlock(actives[f]).center == true)
           {
               center = actives[f];
               break;
           }
        }
        if(center.equals(new cc.Vec2(0, 0)) ) 
        {
            log('not center point, unable rotate')
            gri.setBlocks(actives, projects);
            return;
        }
        //从网格提取方块
        var blocks = [];
        for(var f = 0; f < actives.length; f ++)
        {
            blocks.push(gri.getBlock(actives[f]));
            gri.setBlock(undefined, actives[f]);
        }
        
        //是否有选择空间
        var projects = [];
        for(var f = 0; f < actives.length; f ++)
        {
            var re = this.relative(actives[f],  center);
            var add = re.rotate(3.1415 / 2);
            var  project = center.add(add);
            project.x = Math.round(project.x);
            project.y = Math.round(project.y);

            if(gri.getBlock(project) != undefined )
            {
                gri.setBlocks(blocks, actives);
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
         //提取方块
         var blocks = [];
         var actives = gri.getActives(activeNum);
         for(var f = 0; f < actives.length; f++)
         {
             blocks.push(gri.getBlock(actives[f]));
             gri.setBlock(undefined, actives[f]);
         }
 
         //能否移动
         for(var f = 0; f < actives.length; f ++)
         {
            var object = new cc.Vec2(actives[f].x , actives[f].y + 1);
            var reslut = gri.getBlock(object);
            if(reslut != undefined)
            {
                if(reslut == false)
                {
                    log("出网格");
                    gri.setBlocks(blocks, actives);
                    if(actives[f].y == gri.rowNum - 1)
                    {
                        this.end(blocks);
                    }
                   return;
                }
                if(typeof reslut == "object")
                {
                    if(downIndex== 0)
                    {
                        cc.director.loadScene("gameover");
                        autoDownTime = 100000;
                        return;
                    }
                    log("会碰到别的块");
                    gri.setBlocks(blocks, actives);
                    this.end(blocks);
                   return;
                }
            }
         }
 
         //放置
         for(var f = 0; f < actives.length; f ++)
         {
             var object = new cc.Vec2(actives[f].x, actives[f].y + 1);
             gri.setBlock(blocks[f], object);
         }
         downIndex++
    },
    speedDown:function()
    {
        autoDownTime = SPEEDDOWNTIME;
        this.rightButton.getComponent(cc.Button).interactable = false;
        this.leftButton.getComponent(cc.Button).interactable = false;
    },

    right:function()
    {
        //提取方块
        var blocks = [];
        var actives = gri.getActives(activeNum);
        for(var f = 0; f < actives.length; f++)
        {
            blocks.push(gri.getBlock(actives[f]));
            gri.setBlock(undefined, actives[f]);
        }

        //能否移动
        for(var f = 0; f < actives.length; f ++)
        {
           var object = new cc.Vec2(actives[f].x + 1, actives[f].y);
           if(gri.getBlock(object) != undefined)
           {
               log("没有空间移动");
                gri.setBlocks(blocks, actives);
               return;
           }
        }

        //放置
        for(var f = 0; f < actives.length; f ++)
        {
            var object = new cc.Vec2(actives[f].x + 1, actives[f].y);
            gri.setBlock(blocks[f], object);
        }
    },

    left:function()
    {
         //提取方块
         var blocks = [];
         var actives = gri.getActives(activeNum);
         for(var f = 0; f < actives.length; f++)
         {
             blocks.push(gri.getBlock(actives[f]));
             gri.setBlock(undefined, actives[f]);
         }
 
         //能否移动
         for(var f = 0; f < actives.length; f ++)
         {
            var object = new cc.Vec2(actives[f].x - 1, actives[f].y);
            if(gri.getBlock(object) != undefined)
            {
                log("没有空间移动");
                 gri.setBlocks(blocks, actives);
                return;
            }
         }
 
         //放置
         for(var f = 0; f < actives.length; f ++)
         {
             var object = new cc.Vec2(actives[f].x - 1, actives[f].y);
             gri.setBlock(blocks[f], object);
         }
    },
    start:function()
    {

    },
    end:function(blocks)
    {
        //消除
        var f1 = 0;
        var hasDelete = false;

        var deleteYs = [];
        gri.rowArray.forEach(colum=>
        {
            var index = 0;
            
            colum.forEach(value=>
            {
                if(typeof value == "object") index ++;
            })
            if(index == gri.columnNum)
            {
                //发现一行满了 开始消除动画
                hasDelete = true;
                deleteYs.push(f1);
                colum.forEach(block=>
                {
                    block.getComponent(cc.Animation).play("delete")
                });
            }
            f1 ++;
        })

        downIndex = 0;

        //让方块不受控制
        blocks.forEach(value=>
        {
            if(typeof value == 'object' )
                value.getComponent("block").active = false;
        })
        //恢复默认设置
        autoDownTime = LOWDOWNTIME;
        this.rightButton.getComponent(cc.Button).interactable = true;
        this.leftButton.getComponent(cc.Button).interactable = true;

        if(hasDelete)
        {
            this.scheduleOnce(function()
            {
                    //消除动画播放完
                for(var f2 = deleteYs.length - 1; f2 >= 0; f2 --)
                {
                    var deleteLine = deleteYs[f2];
                    for(var x = 0; x < gri.columnNum; x ++)
                    {
                        var block = gri.getBlock(x, deleteLine);
                        block.getComponent(cc.Animation).stop("delete")
                        block.destroy();
                        gri.setBlock(undefined, x, deleteLine);
                    }
                }

                for(var top = deleteYs[0] - 1; top >= 0 ; top--)
                {
                    for(var f3 = 0; f3 < gri.columnNum; f3 ++)
                    {
                        var block = gri.getBlock(f3, top);
                        gri.setBlock(block, f3, top + deleteYs.length);
                    }
                }  
                
                this.addblock(blockNames[randomNum(0, 4)]);
            }, DELETEANIMALEN);
            return;
        } 
        this.addblock(blockNames[randomNum(0, 4)]);

    },

    addblock:function(bolckType)
    {
        var scene = cc.director.getScene();
        switch(bolckType)
        {
           case  "7":
           var blockClone1 = cc.instantiate(this.block);
           var blockClone2 = cc.instantiate(this.block);
           var blockClone3 = cc.instantiate(this.block);
           var blockClone4 = cc.instantiate(this.block);
           blockClone2.center = true;
           blockClone1.parent = scene;
           blockClone2.parent = scene;
           blockClone3.parent = scene;
           blockClone4.parent = scene;
           
           gri.setBlock(blockClone1, 5, 0);
           gri.setBlock(blockClone2, 6, 0);
           gri.setBlock(blockClone3, 7, 0);
           gri.setBlock(blockClone4, 5, 1);
           break;

           case "z":
           var blockClone1 = cc.instantiate(this.block);
           var blockClone2 = cc.instantiate(this.block);
           var blockClone3 = cc.instantiate(this.block);
           var blockClone4 = cc.instantiate(this.block);
           blockClone2.center = true;
           blockClone1.parent = scene;
           blockClone2.parent = scene;
           blockClone3.parent = scene;
           blockClone4.parent = scene;
           
           gri.setBlock(blockClone1, 5, 1);
           gri.setBlock(blockClone2, 6, 1);
           gri.setBlock(blockClone3, 6, 0);
           gri.setBlock(blockClone4, 7, 0);
           break;

           case "1":
           var blockClone1 = cc.instantiate(this.block);
           var blockClone2 = cc.instantiate(this.block);
           var blockClone3 = cc.instantiate(this.block);
           var blockClone4 = cc.instantiate(this.block);
           blockClone2.center = true;
           blockClone1.parent = scene;
           blockClone2.parent = scene;
           blockClone3.parent = scene;
           blockClone4.parent = scene;
           
           gri.setBlock(blockClone1, 6, 0);
           gri.setBlock(blockClone2, 6, 1);
           gri.setBlock(blockClone3, 6, 2);
           gri.setBlock(blockClone4, 6, 3);
           break;
           case "4":
           var blockClone1 = cc.instantiate(this.block);
           var blockClone2 = cc.instantiate(this.block);
           var blockClone3 = cc.instantiate(this.block);
           var blockClone4 = cc.instantiate(this.block);
           blockClone2.center = true;
           blockClone1.parent = scene;
           blockClone2.parent = scene;
           blockClone3.parent = scene;
           blockClone4.parent = scene;
           
           gri.setBlock(blockClone1, 5, 0);
           gri.setBlock(blockClone2, 6, 0);
           gri.setBlock(blockClone3, 5, 1);
           gri.setBlock(blockClone4, 6, 1);
           break;
        }
       

    },

    onLoad () {
       
    },

    start () {
        
        this.addblock(blockNames[randomNum(0, 4)]);
        this.autoDown();
    },

    autoDown:function(){
        this.scheduleOnce(() => {
            this.down();
            this.autoDown();
        }, autoDownTime);
    }
   

});
