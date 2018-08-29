
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

class Grid
{
    
    constructor(rowNum, columnNum)
    {
        this.rowArray = new Array(rowNum);
        this.rowNum = rowNum;
        this.columnNum = columnNum;
        for (var f = 0; f < columnNum; f++) 
        {
            this.rowArray[f] = Array(25);
        }
    }

    add(obj, row, colum) 
    {
        this.rowArray[row][colum] = obj;
        obj.setPosition(300, 1300);
    };

    set(obj, row, colum) 
    {
        this.rowArray[row][colum] = obj;
        obj.setPosition()
    };

    get(row, colum)
    {
        return this.rowArray[row][colum];
    }
}

var gri = null;
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
        for(var f = 0; f < gri.rowNum; f ++)
        {
            for(var f1  = 0; f1 < gri.columnNum; f1 ++)
            {
                var block = gri.get(f,f1);
                if(block == undefined) continue;
                if(block.getComponent("block").activite)
                {
                    block.setPosition(block.x, block.y - 50);
                    gri.set(null,f,f1);
                    gri.set(block,f + 1,f1)
                }
            }
        }
        
    },

    addblock:function()
    {
        var blockClone = cc.instantiate(this.block);
        var scene = cc.director.getScene();
        blockClone.parent = scene;
        gri = new Grid(25, 80);
        gri.add(blockClone, 0, 0);

    },

    onLoad () {
       
    },

    start () {
        this.addblock();
        this.autoDown();
    },

    autoDown:function(){
        setTimeout(() => {
            this.down();
            this.autoDown();
        }, 200);
    }
   

});
