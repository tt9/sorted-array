'use strict';
var expect = require("chai").expect;
var SortedArray = require('../src/sorted-array');
var instance,
fullInstance;


function defaultComparer(a,b){
  return a-b;
}
function isInOrder(arr, comparer){
  var comp = comparer || defaultComparer;
  for(var i = 0; i < arr.length-1; i++){
    if(comp(arr[i], arr[i+1]) > 0){
      return false;
    }
  }
  return true;
}

describe("sorted-array", function(){

  beforeEach(function(){
    instance = new SortedArray();
    var mockData = [5,3,4,1,2];
    fullInstance = new SortedArray(mockData);
  });

  describe("initialization", function(){

    it("should intiialize data empty", function(){
      var emptyInstance = new SortedArray();
      expect(emptyInstance._data_).to.be.empty;
    });

    it("should intiializay with array unsorted", function(){
      var array = [1, 3, 2]
      var initInstance = new SortedArray(array);
      expect(initInstance._data_).to.include(1);
      expect(initInstance._data_).to.include(2);
      expect(initInstance._data_).to.include(3);
      expect(initInstance._data_).to.eql(array);
    });
  });

  describe("push", function(){
    it("should add a new object to item._data_", function(done){
      instance.push(5).then(function(){
        expect(instance._dirty_).to.be.equal(1);
        expect(instance._data_[0]).to.be.equal(5);
        done();
      });
    });

    it("push many items in no particular order", function(done){
      var promises = [];
      promises.push(instance.push(10));
      promises.push(instance.push(50));
      promises.push(instance.push(5));
      promises.push(instance.push(4));
      Promise.all(promises).then(function(){
        expect(instance._data_.length).to.equal(4);
        expect(instance._data_).to.include(10);
        expect(instance._data_).to.include(50);
        expect(instance._data_).to.include(5);
        expect(instance._data_).to.include(4);
        done();
      });
    });

    it("push an array of items", function(done){
      instance.push([5,4,3,2,1,0]).then(function(){
        expect(instance._data_.length).to.equal(6);
        expect(instance._data_).to.eql([5,4,3,2,1,0]);
        done();
      });
    });

  });

  describe("pushSync", function(){
    it('should add items to the sorted array synchronously and not sort them', function(){
      instance.pushSync(5);
      instance.pushSync(4);
      expect(instance._data_[0]).to.equal(5);
      expect(instance._data_[1]).to.equal(4);
    });

    it('should add range of items to the array synchronously and not sort them', function(){
      instance.pushSync([5, 4 ,3]);
      expect(instance._data_[0]).to.equal(5);
      expect(instance._data_[1]).to.equal(4);
      expect(instance._data_[2]).to.equal(3);
    });

  });

  describe("pop", function(){
    it('should pop last item in array after sorting it', function(done){
      instance.push(5);
      instance.push(4);
      instance.pop().then(function(item){
        expect(item).to.equal(5);
        done();
      })
    });
    it('should pop many items', function(done){
      fullInstance.pop(3).then(function(range){
        expect(range.length).to.equal(3);
        expect(range).to.eql([3,4,5]);
        expect(fullInstance._data_.length).to.equal(2);
        expect(fullInstance._data_).to.eql([1,2]);
        done();
      });
    });

  });

  describe("clear", function(){
    it("should clear all items in array", function(done){

      expect(fullInstance.length).to.not.equal(0);
      fullInstance.clear()
      .then(function(){
        expect(fullInstance.length()).to.equal(0);
        done();
      })
    });
  });

  describe('length', function(){
    it('should match the inner array length', function(){
      expect(fullInstance.length()).to.equal(fullInstance._data_.length);
    });
  });

  describe("get", function(){
    it('should return a value', function(done){
      instance.push(5).then(function(){
        instance.get(0).then(function(val){
          expect(val).to.be.equal(5);
          done();
        });
      });
    });

    it('should return a range of values', function(done){
      fullInstance.get(0, 2).then(function(val){
        expect(val).to.be.an.instanceof(Array);
        expect(val).to.eql([1,2,3]);
        done();
      });
    });

  });

  describe('last', function(){
    it('should return the last value in the array', function(done){
      fullInstance.last().then(function(item){
        expect(item).to.equal(5);
        done();
      });
    });
  });

  describe("getArray:largeSet", function(){
    var largeSetInstance,
        mockSet;
    beforeEach(function(){
      mockSet = [9,8,7,6,5,4,3,2,1,19,18,17,16,15,14,13,12,10,56,78,99,100];
      largeSetInstance = new SortedArray(mockSet);
    });

    it('should sort and get the whole array', function(done){
      largeSetInstance.getArray().then(function(arr){
        expect(arr.length).to.not.equal(0);
        expect(arr.length).to.equal(mockSet.length);
        expect(isInOrder(arr)).to.be.true;
        done();
      });
    });
  });

  describe("custom comparer", function(){
    var objInstance;
    function customComparer(a, b){
      return a.val - b.val;
    }
    beforeEach(function(){
      objInstance = new SortedArray([
        { val : 10 },
        { val : 89 },
        { val : 1 },
        { val : 100  }
      ], customComparer);
    });

    it("should sort objects with a custom Comparer", function(done){
      objInstance.getArray().then(function(arr){
        expect(arr[0].val).to.equal(1);
        expect(arr[1].val).to.equal(10);
        expect(arr[2].val).to.equal(89);
        expect(arr[3].val).to.equal(100);
        done();
      });
    });


  });

  describe("set", function(){
    it('should set a specific index', function(done){
      fullInstance.set(1, 50).then(function(){
        expect(fullInstance._data_[1]).to.equal(50);
        done();
      });
    });
  });
});
