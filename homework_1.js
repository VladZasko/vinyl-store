/*---1---*/
const example1 = 8;
const example2 = 610;

const fibonacci = (number) => {
    const fibNumber = [];
    let n1 = 0, n2 = 1, nextTerm;

    for (let i = 1; i <= number; i++) {
        if (n1 + n2 <= number){
            fibNumber.push(n1);
            nextTerm = n1 + n2;
            n1 = n2;
            n2 = nextTerm;
        } else {
            fibNumber.push(n1)
            return fibNumber;
        }
    }
}

console.log(fibonacci(example1));
console.log(fibonacci(example2));

/*---2---*/

const example1Array1 = [1, 2, 3];
const example1Array2 = [100, 2, 1, 10];

const example2Array1 = [1, 2, 3, 4, 5];
const example2Array2 = [1, [2], [3, [[4]]],[5,6]];

function findUnique(arr1,arr2){
    const arrayFlat1 = arr1.flat(Infinity);
    const arrayFlat2 = arr2.flat(Infinity);

    let unique1 = arrayFlat1.filter((o) =>
        arrayFlat2.indexOf(o) === -1);
    let unique2 = arrayFlat2.filter((o) =>
        arrayFlat1.indexOf(o) === -1);

    const unique = unique1.concat(unique2).sort((a, b) => a - b);
    return unique.map((a)=>a.toString())
}

console.log(findUnique(example1Array1, example1Array2))
console.log(findUnique(example2Array1, example2Array2));

/*---3---*/

function caseInsensitiveSearch(string, search)
{
    let result = string.search(new RegExp(search, "i"));

    if (result>0)
        return 'Matched';
    else
        return 'Not Matched';
}

console.log(caseInsensitiveSearch('JavaScript Exercises', 'exercises'));
console.log(caseInsensitiveSearch('JavaScript Exercises', 'Exercisess'));

/*---4---*/

const exampleObj = {
    1 : 'one',
    2 : 'two',
    3 : 'three'
}

const exampleObj2 = {
    'firstName' : 'Uladzislau',
    'lastName' : 'Zasko',
    'age' : '27',
    'city' : 'Minsk'
}

function valuesToKeys(obj)  {
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    const newObj = {}

    for(let i = 0; i < keys.length; i++){
        newObj[values[i]] = keys[i];
    }
    return newObj
}

console.log(exampleObj);
console.log(valuesToKeys(exampleObj));

console.log(exampleObj2);
console.log(valuesToKeys(exampleObj2));

/*---5---*/

function  convertObject(obj)  {
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    const newArray = []

    for(let i = 0; i < keys.length; i++){
        const newElement = [keys[i],values[i]];

        newArray.push(newElement)
    }
    return newArray
}

console.log(exampleObj);
console.log(convertObject(exampleObj));

console.log(exampleObj2);
console.log(convertObject(exampleObj2));

/*---6---*/

function uncamelize(str) {
    const separator = " ";

    const text = str.replace(/[A-Z]/g, function (letter)
    {
        return separator + letter.toLowerCase();
    });

    return text.replace("/^" + separator + "/", '');
}

console.log(uncamelize('forExample'));

/*---7---*/

function countSubstring (string, word) {
    return string.split(word).length - 1;
}
console.log(countSubstring("Example one", "e"))
console.log(countSubstring("Example one", "on"))
console.log(countSubstring("Example one", "r"))

/*---8---*/

function flatArray (arr){
    return arr.reduce(
        (acc, val) =>
            Array.isArray(val)
                ? acc.concat(flatArray(val))
                : acc.concat(val), [])
        .sort((a, b) => a - b);
}

console.log(flatArray([1, 2, 1000, 300, [400, [3, 10, [11, 12]], [1, 2, [3, 4]], 5, 6]]))

/*---9---*/

const exampleArray9 = [1, 'xxx', null, undefined, 'yyy', null];
function deleteNullAndUndefined(array, callback) {
    const filterArray = array.filter((value) => value !== null && value !== undefined);

    setTimeout(() => {
        callback(filterArray);
    }, 5000);
}

function callbackForEx9(res){
    console.log("Filtered Array:", res);
}

deleteNullAndUndefined(exampleArray9, callbackForEx9);

/*---10---*/

function resolveAfter (value){
    return new Promise(resolve => {
        setTimeout(() => resolve(value), 6000);
    });
}
console.log(resolveAfter('Resolve'));

/*---11---*/

const exampleArrayPromises = [
    new Promise((res, rej) => {
        setTimeout(() => {
            const promise1 = "Promise-1";
            res(`${promise1} выполнен!`);
        }, 5000);
    }),
    new Promise((res, rej) => {
        setTimeout(() => {
            const promise2 = "Promise-2";
            res(`${promise2} выполнен!`);
        }, 10000);
    }),
    new Promise((res, rej) => {
        setTimeout(() => {
            const promise3 = "Promise-3";
            res(`${promise3} выполнен!`);
        }, 3000);
    })
];

async function runPromisesInSeries(arrayPromise) {
    const results = [];

    for (let i = 0; i < arrayPromise.length; i++) {
        const result = await arrayPromise[i];
        results.push(result);
    }

    return results;
}

runPromisesInSeries(exampleArrayPromises).then(results => console.log(results))
