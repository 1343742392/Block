
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
    
    constructor(rowNum, columnNum, size)
    {
        this.rowArray = new Array(rowNum);
        this.rowNum = rowNum;
        this.columnNum = columnNum;
        this.blockSize = size;
        for (var f = 0; f < columnNum; f++) 
        {
            this.rowArray[f] = Array(25);
        }
    }

    add(obj) 
    {
        this.rowArray[13][0] = obj;
        obj.setPosition(325, 1415);
    };

    set(obj, row, colum) 
    {
        this.rowArray[row][colum] = obj;
        if(obj == null) return;
        let x = row * (this.blockSize / 2);
        let y = 1440 -  colum * (this.blockSize / 2);
        console.log(`set size:${this.blockSize}   row:${row}`);
        obj.setPosition(x, y);
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
                    gri.set(null,f,f1);
                    gri.set(block,f,f1 + 1)
                    return;
                }
            }
        }
        
    },

    addblock:function()
    {
        var blockClone = cc.instantiate(this.block);
        var scene = cc.director.getScene();
        blockClone.parent = scene;
        gri = new Grid(25, 80, 50);
        gri.add(blockClone);

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
        }, 500);
    }
   

});
