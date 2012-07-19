/**
 * @class App.view.mineView
 * @extends Ext.view.View
 * @author Ernesto Ramirez 
 * Esta es la definicion del DataView que creara nuestro tablero de minas.
 */
Ext.define('App.view.mineView', {
    extend: 'Ext.view.View',
	alias :'widget.mineView',
	num : 8, // inicialmente el trablero consta de 8 x 8  minas y esta es la variable que modificaremos para aumentar o disminuir el tablero
    initComponent: function(){
		var me = this;
		me.store = me.buildStore();
		me.itemSelector = ".square";
		me.tpl = new Ext.XTemplate(
	    		'<tpl for=".">',
	    			'<tpl if="isBorder === 1"><div class="square"> - </div></tpl>',
	    			'<tpl if="isBorder === 0">',
					'<tpl if="isRevealed === 1"><div class="square mineUncovered">{numMines} </div></tpl>',
	    				'<tpl if="isRevealed === 0">',
	    					'<tpl if="hasBomb != 1">',
	    						'<div class="square mineCovered"></div>',
    						'</tpl>',
    						'<tpl if="hasBomb === 1">',
	    						'<div class="square mineCovered">{hasBomb} </div>',
    						'</tpl>',
					'</tpl>',
    				'</tpl>',
	                 	'<tpl if="( xindex % '+(me.num+2)+' ) === 0 "><div class="x-clear"></div></tpl>',
	            '</tpl>'
		);
		this.callParent(arguments);
		this.on('itemclick',me.validateMine,this); // evento que se dispara cuando se da click sobre alguna posible mina
	},
	validateMine:function( table, record, item, index, e, eOpts ){
		//console.log(Ext.get(e.target).setHTML("asdfghj"));	
		if( record.get('isRevealed') === 0){ // si existe mina la explotamos
			this.revealMine(record,item);
		} else {
			console.log("already revealed");
		}
	},
	revealMine:function(record,item){ // creamos las columnas de nuestro grid
		var me = this, revealArray = [];
		console.log("in revealMine");
		if(record.get('hasBomb') ){ // si existe mina la explotamos
			Ext.Msg.alert(':(','kaboooom!. GAME OVER!');
		} else {
			record.set('isRevealed', 1);
			var adjacentMines = this.getAdjacentMines(record.get('id')),
				numMines = this.countMines(adjacentMines);
			if(numMines != 0){
				record.set('numMines', numMines);
				//item.setHTML(numMines);
			}
		}
		this.refresh();
	},
	
	countMines:function(adjacentMines){ // creamos las columnas de nuestro grid
		var me = this, 
			numMines = 0;

		for(var i = 0; i < 8; i++ ){
			if(this.getStore().getAt(adjacentMines[i]).get('hasBomb'))
				numMines++;
		}
		return numMines;
		
	},

	getAdjacentMines:function(id){ // creamos las columnas de nuestro grid
		var me = this, adjacentMines = [];
		// NEED to optimize this CODE!!!!! to sleepy
		adjacentMines.push(( id -  ( this.num + 3 ) ) );
		adjacentMines.push(( id -  ( this.num + 2 ) ) );
		adjacentMines.push(( id -  ( this.num + 1 ) ) );
		adjacentMines.push(( id -  1 ) );
		adjacentMines.push(( id + 1) );
		adjacentMines.push(( id +  ( this.num + 1 ) ) );
		adjacentMines.push(( id + ( this.num + 2 ) ) );
		adjacentMines.push(( id +  ( this.num + 3 ) ) );
		// NEED to optimize this CODE!!!!! to sleepy
		return adjacentMines;
	},
	buildStore:function(){ //creamos nuestro store que contendra cada una de las entidades de nuestro tablero
		var me = this, store;
		Ext.define('Mine', {
		    extend: 'Ext.data.Model',
		    fields: [
		        {
		        	name: 'hasBomb',   
		        	type: 'int'
		        },
		        {
		        	name: 'isRevealed',   
		        	type: 'int'
		        },
		        {
		        	name: 'isBorder',   
		        	type: 'int',
		        	defaultValue: 0
		        },
		        {
		        	name: 'numMines',   
		        	type: 'int',
		        	defaultValue: 0
		        }
		    ]
		});
		
		store = Ext.create('Ext.data.Store', {
	        model: 'Mine',
	        data: me.buildData()
	    });
		return store;
	},
	buildData:function(){ // aqui creamos nuestras entidades slots para cada una de las filas de nuestro store (Records)
		var me = this,data = [],row, max = Math.pow(me.num+2,2);
		for(var i = 0; i < max; i++){
			// if (   (checksFirstRow) || (checksLastRow)   || (checksFirstColumn) || (checksLastColumn) )
			row = ( ( ( i < (me.num+2) || ( i >= ( max - ( me.num+2 ) ) ) ) || ( i %  ( me.num+2 ) === 0 ) || ( (i+1) % (me.num+2) === 0 ) ) ? {
				id : i,
				hasBomb: 0,
				isBorder: 1,
				isRevealed: 1
			} : {
				id : i,
				hasBomb: Math.floor(Math.random()*2),
				isRevealed: 0
			} );
			
			data.push(row);
		}
		return data;
	}
});