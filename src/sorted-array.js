
'use strict';
(function(){
  //require
  var has_require = typeof require !== 'undefined'
  var Promise;
  if( has_require ) {
    Promise = require('es6-promise').Promise
  }
  else {
      Promise = window.Promise;
  }
  if(typeof Promise === 'undefined'){
    throw 'Promise is not defined';
  }

  var SortedArray = (function(){

    function getSortStrategy(dirtyFactor){
      return dirtyFactor > 10 ? quickSort : insertionSort;
    }

    function objectCompare(a, b){
      if (a > b) { return 1; }
      if (a < b) { return -1; }
      return 0;
    }


    function SortedArray(arr, comparer){
      this._isSorting_ = false;
      this._data_ = [];
      this._dirty_ = 0;
      if(arr && Array.isArray(arr)){
        arr.map(function(item, index, array){
          this._data_.push(item);
        }.bind(this));
        this._dirty_ = arr.length;
      }
      this._comparer_ = comparer || objectCompare;
    }

    //TODO: inline this function for performance
    function swap(array, i, j){
      var ai = array[i];
      array[i] = array[j];
      array[j] = ai;
    }

    function quickSort(array, comparer) {
      //allocate a stack the length of the array
      var stack = new Array(array.length);
      var pivotIndex = array.length / 2;

      //put the pivot at the end of the array;
      swap(array, pivotIndex, array.length - 1);

      stack.push(0);
      stack.push(array.length-1);

      while(stack.length > 0){
        var endIndex = stack.pop();
        var startIndex = stack.pop();
        var trackingIndex = startIndex - 1;
        var pivotValue = array[endIndex];
        for(var i = startIndex; i < endIndex; i++){
          if(comparer(array[i], pivotValue) < 0){
            swap(array, ++trackingIndex, i);
          }
        }
        //Put the pivot inbetween the high and low arrays
        swap(array, ++trackingIndex, endIndex);

        //push start and end index for lower half of array
        if(startIndex < trackingIndex -1){
          stack.push(startIndex);
          stack.push(trackingIndex - 1);
        }

        //push start and end index for upper half of array
        if(trackingIndex + 1 < endIndex){
          stack.push(trackingIndex + 1);
          stack.push(endIndex);
        }
      }
    }

    //for small arrays with a lower dirty factor
    function insertionSort(a, comparer){
      for (var i = 1; i < a.length; i++) {
        var element = a[i];
        for (var j = i - 1; j >= 0; j--) {
          var tmp = a[j];
          var order = comparer(tmp, element);
          if (order > 0) { a[j + 1] = tmp; }
          else { break; }
        }
        a[j + 1] = element;
      }
    }

    SortedArray.prototype._cleanup_ = function(){
      if(this._dirty_ > 0){
        var sort = getSortStrategy(this._dirty_);
        sort(this._data_, this._comparer_);
      }
    }

    SortedArray.prototype.set = function(index, item){
      return new Promise(function(resolve, reject){
        if(index < this._data_.length){
          this._dirty_++;
          this._data_[index] = item;
          resolve();
        }
        else{
          reject("index greater than length of array");
        }
      }.bind(this));
    }

    SortedArray.prototype.length = function(){
      return this._data_.length;
    }

    SortedArray.prototype.clear = function(){
      return new Promise(function(resolve, reject){
        this._dirty_ = 0;
        this._data_ = [];
        resolve();
      }.bind(this));
    }

    SortedArray.prototype.push = function(item){
      return new Promise(function(resolve, reject){
        try{
          this._dirty_++;
          this._data_.push(item);
          resolve();
        }
        catch(err){
          reject(err);
        }
      }.bind(this));
    }

    SortedArray.prototype.get = function(index, endIndex){
      return new Promise(function(resolve, reject){
        try{
          this._cleanup_();
          if(endIndex && endIndex > index && endIndex < this._data_.length){
            var range = [];
            for(var i = index; i <= endIndex; i++){
              range.push(this._data_[i]);
            }
            resolve(range);
          }
          else{
            resolve(this._data_[index]);
          }
        }
        catch(err){
          reject(err);
        }
      }.bind(this));
    }


    SortedArray.prototype.getArray = function(){
      return new Promise(function (resolve, reject){
        try{
          this._cleanup_();
          var cpy = new Array(this._data_.length);
          this._data_.map(function(item, index){
            cpy[index] = item;
          });
          resolve(cpy);
        }
        catch(err){
          reject(err);
        }
      }.bind(this));
    }

    return SortedArray;
  })();

  //exports
  if( typeof exports !== 'undefined' ) {
    if( typeof module !== 'undefined' && module.exports ) {
      exports = module.exports = SortedArray
    }
    exports.SortedArray = SortedArray
  }
  else {
    root.mymodule = mymodule
  }

}).call(this);
