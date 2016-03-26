# SortedArrayAsync

## Warning

This is in super Alpha at the moment, don't use it yet. Just don't. I'll remove this warning when the build is more stable.

## Description

An asynchronous, lazy, self sorting array. Use it to keep things in order. Like me the SortedArray object is lazy, meaning it won't sort until it absolutely has to. This will allow you to throw all of your junk into the array and then worry about sorting last minute. This might help your performance, but it also might not, that's for you to figure out.

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
|`SortedArray.length();`| Get the current number of elements in the array.| `int` |
|`SortedArray.clear();`| Deletes all items in the array.| `void` |
|`SortedArray.get(index);`| Get the item at the specific index. Triggers sorting.| `Promise(item)` |
|`SortedArray.getArray();`| Gets a sorted copy of the inner array. Triggers sorting.| `Promise(Array)` |
|`SortedArray.set(index, item);`| Sets the specific index to an item.| `Promise(void);` |




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


## RoadMap

* Add synchronous push functions. *(Sometimes there is just no need to be async, particularily when the function takes a trivial amount of time).*
* Add synchronous get and getArray functions. *(it kind of defeats the purpose of an async sorted array but might be needed in certain cases).*
* Add pop and last functions. *(Its difficult to predict the value at an index so it is probably more useful to be able to take positional items instead).*
* Add dequeue and first functions. *(same argument as above)*
* Become a dependency of many large projects. *($$$$)*
* Angrily remove package from NPM causing widespread havoc. *($$$$$$$$)*
* ????? *(?????)*
* Profit!!! *($$$$$$$$$$$$$$$$$)*
