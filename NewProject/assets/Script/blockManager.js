
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

    set(obj, row, colum) 
    {
        if(row >= this.rowNum || colum >= this.columnNum) return false;
        this.rowArray[row][colum] = obj;
        if(obj == null) return;
        let x = colum * this.blockSize + 25;
        let y = 1415 -  row * this.blockSize;
        log(`set x:${x}   y:${y}`);
        obj.setPosition(x, y);
    };

    set(obj, pos) 
    {
        if(pos.x >= this.rowNum || pos.y >= this.columnNum) return false;
        this.rowArray[pos.x][pos.y] = obj;
        if(obj == null) return;
        let x = pos.y * this.blockSize + 25;
        let y = 1415 -  pos.x * this.blockSize;
        log(`set x:${x}   y:${y}`);
        obj.setPosition(x, y);
    };

    get(row, colum)
    {
        if(row >= this.rowNum || colum >= this.columnNum || row < 0 || colum < 0) return false;
        return this.rowArray[row][colum];
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
                        gri.set(null,f,f1);
                        gri.set(block,f,f1 + 1);
                    }
                    return;
                }
            }
        }
    },

    left:function()
    {
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
                        gri.set(null,f,f1);
                        gri.set(block,f,f1 - 1);
                    }
                    return;
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
