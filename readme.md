# SortedArrayAsync

## Description

An asynchronous, lazy, self sorting array. Use it to keep things in order. Like me, the SortedArray object is lazy, meaning it won't sort until it absolutely has to. This will allow you to throw all of your junk into the array and then worry about sorting last minute. This might help your performance, but it also might not, that's for you to figure out.

Like the name would imply, the important functions are async through the use of Promises. See **usage** below if you need clarification on what that means or how to use it.



## API

The API contains the basic functions you would see in any other array, the difference being that when you try to retrieve objects they will have been sorted.

**require**

`var SortedArray = require('sorted-array-async');`

**functions**

| Function       | Description   | Returns  |
| -------------- | ------------- | :--------: |
|`new SortedArray(array, comparer);`| Constructor. Can pass existing array and custom comparator. comparer is type function(a, b). It should return a number. Less than 0 if a < b, 0 if a == b, or greater than 0 if a > b  | A new instance of SortedArray |
|`SortedArray.push(item);`| Add a new item to the array. | `Promise(void)` |
|`SortedArray.pushSync(item);`| Add a new item to the array synchronously. | `void` |
|`SortedArray.set(index, item);`| Sets the specific index to an item.| `Promise(void);` |
|`SortedArray.length();`| Get the current number of elements in the array.| `int` |
|`SortedArray.clear();`| Deletes all items in the array.| `void` |
|`SortedArray.get(index);`| Get the item at the specific index. Triggers sorting.| `Promise(item)` |
|`SortedArray.getArray();`| Gets a sorted copy of the inner array. Triggers sorting.| `Promise(Array)` |
|`SortedArray.pop(count);`| Pops last n elements off of array. count is optional, leaving it blank pops 1. Triggers sorting.| `Promise(Array)` or `Promise(obj)` |
|`SortedArray.last(count);`| Gets the last element from array. Triggers sorting.| `Promise(obj)` |





## Usage


#### Basic

```JavaScript

var SortedArray = require('sorted-array-async');

var instance = new SortedArray();

instance.push(56).then(function(){
	//Maybe you want to wait until the item was added before doing something??
});

instance.get(0).then(function(item){
	//item is the value at index 0;
});


```

#### With Objects and Custom Comparer

```JavaScript

var SortedArray = require('sorted-array-async');

var instance = new SortedArray(null, function(a, b){
	return a.val - b.val;
});

var promises = [];
promises.push(instance.push({ name: 'foo', val: 15}));
promises.push(instance.push({ name: 'bar', val: 10}));
promises.push(instance.push({ name: 'baz', val: 11}));

Promise.all(promises).then(function(){
  instance.get(0).then(function(item){
  	 //remember the array gets sorted so item
     //at the 0th index is { name: 'bar', val: 10 }
  });
});


```


#### Use It to Sort an Existing Array!

``` JavaScript

var SortedArray = require('sorted-array-async');

var uglyUnsortedArray = [5,4,8,9,1];

var instance = new SortedArray(uglyUnsortedArray);

var shinySortedArray;

instance.getArray().then(function(arr){
	//arr is your array but sorted.
    //it is a new array so your uglyUnsortedArray remains the same.
    shinySortedArray = arr;

    //shinySortedArray = [1,4,5,8,9]
});

```

#### Pop a Few Items

``` JavaScript

var SortedArray = require('sorted-array-async');

var instance = new SortedArray([3,2,0,1,6,7,9,8]);

instance.pop(3).then(function(arr){
	//arr == [7,8,9]

    instance.pop().then(function(i){
   		//i == 6;
    });
});

```

*for live examples click [here](https://tonicdev.com/56e24baf44ffc91100a44ef5/56f5f6bfc4a9701400a9bdda)*

## RoadMap

* Add synchronous get and getArray functions. *(it kind of defeats the purpose of an async sorted array but might be needed in certain cases).*
* Add dequeue and first functions.
* Become a dependency of many large projects. *($$$$)*
* Angrily remove package from NPM causing widespread havoc. *($$$$$$$$)*
* ????? *(?????)*
* Profit!!! *($$$$$$$$$$$$$$$$$)*
