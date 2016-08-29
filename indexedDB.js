DBs={
openDB:function (name,version,onsuccess,predatas,onupgradeneeded) {
//predatas:[{"table":"students","key":"id","indexs":[{"index":"nameIndex","unique":true},{"ageIndex":"age","unique":false}]}]
            var version=version || 1;
            var request=window.indexedDB.open(name,version);
            request.onerror=function(e){
                console.log(e.currentTarget.error.message);
            };
            request.onsuccess=function(e){
                myDB.db=e.target.result;
				onsuccess&&onsuccess(myDB.db)
            };
            request.onupgradeneeded=function(e){
                var db=e.target.result;
				for(var z=0;z<predatas.length;z++){
					var predata=predatas[z];
					var table=predata["table"];
					var key=predata["key"];//'id'
					var indexs=predata["indexs"];
					if(table){
						if(!db.objectStoreNames.contains(table)){
							var store=db.createObjectStore(table,{keyPath: key});
							for(var i=0;i<indexs.length;i++){
								store.createIndex(indexs[i]['index'],indexs[i]['name'],{unique:indexs[i]['unique']}); 
							}
						}	
					}
				}
                onupgradeneeded&&onupgradeneeded(e);
                console.log('DB version changed to '+version);						
            };
},
closeDB:function(db){
	db.close();
},
deleteDB:function (name){
	indexedDB.deleteDatabase(name);
},
addData:function (db,storeName,arrdata){
	var transaction=db.transaction(storeName,'readwrite'); 
	var store=transaction.objectStore(storeName); 
	for(var i=0;i<arrdata.length;i++){
		store.add(arrdata[i]);
	}
},
getDataByKey:function (db,storeName,key,callback){
	var transaction=db.transaction(storeName,'readwrite'); 
	var store=transaction.objectStore(storeName); 
	var request=store.get(key); 
	request.onsuccess=function(e){ 
		callback&&callback(e.target.result)
	};
},
updateDataByKey:function (db,storeName,key,value,callback){
	var transaction=db.transaction(storeName,'readwrite'); 
	var store=transaction.objectStore(storeName); 
	var request=store.get(key); 
	request.onsuccess=function(e){ 
		store.put(value); 
		callback&&callback(e.target.result)		
	};
},
deleteDataByKey:function (db,storeName,key){
	var transaction=db.transaction(storeName,'readwrite'); 
	var store=transaction.objectStore(storeName); 
	store.delete(key); 
},
clearObjectStore:function (db,storeName){
	var transaction=db.transaction(storeName,'readwrite'); 
	var store=transaction.objectStore(storeName); 
	store.clear();
},
deleteObjectStore:function (db,storeName){
	var transaction=db.transaction(storeName,'versionchange'); 
	db.deleteObjectStore(storeName);
},
fetchStoreByCursor:function (db,storeName,callback){
	var transaction=db.transaction(storeName);
	var store=transaction.objectStore(storeName);
	var request=store.openCursor();
	request.onsuccess=function(e){
		var cursor=e.target.result;
		if(cursor){
			callback&&callback(cursor.key,cursor.value);//key,value
			cursor.continue();
		}
	};
},
getDataByIndex:function (db,storeName,indexName,indexId,callback){
	var transaction=db.transaction(storeName);
	var store=transaction.objectStore(storeName);
	var index = store.index(indexName);
	index.get(indexId).onsuccess=function(e){
		callback&&callback(e.target.result)
	}
},
getMultipleData:function (db,storeName,indexName,indexId,callback){
	var transaction=db.transaction(storeName);
	var store=transaction.objectStore(storeName);
	var index = store.index(indexName);
	var request=index.openCursor(null,IDBCursor.prev);
	request.onsuccess=function(e){
		var cursor=e.target.result;
		if(cursor){
			callback&&callback(cursor.key,cursor.value);//key,value
			cursor.continue();
		}
	}
}
}