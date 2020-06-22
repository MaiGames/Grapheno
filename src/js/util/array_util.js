/* To insert a value in an array to an specific index and move the values
*  next to that index to position i+1, for example: we have an array of
*  [2, 4, 6, 10] and we want to insert #8 at index 3 to continue with
*  the sucession, so we'd use this function and the result would be
*  [2, 4, 6, 8, 10]
*/
function displace_insert_at_index(array, value, index) {

    if(array.length < 2){ 
        array.push(value)
        return array
    }

    var new_array = []

    for(var i = 0 ; i < index ; i++) {
        new_array.push(array[i])
    }

    new_array.push(value)

    for(var i = index ; i < array.length ; i++ ) {
        new_array.push(array[i])
    }

    return new_array

}

/* To move a value (with index) in an array to another specific index 
*  and move the values next to that index to position i+1, for example:
*  we have an array of [2, 8, 4, 6, 10] and we want to move #8 at index
*  2 to 5 to continue with the sucession, so we'd use this function and 
*  the result would be [2, 4, 6, 8, 10]
*/
function move_index_to_index(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
}

module.exports.displace_insert_at_index = displace_insert_at_index
module.exports.move_index_to_index = move_index_to_index