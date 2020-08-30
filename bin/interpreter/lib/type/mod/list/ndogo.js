/*
    function min(list)

    // The pecking order: numbers > iterables > dates > booleans > (first item is min last is max)
    // Will hold the resulting min value
    let min = 0

    // Check if all elements in list are of the same type
    let same_type = [true, type_list]
    let current_element = list[1]
    let previous_element = list[0]
    for i in list.length-1{
        
        if type(current_element) === type(previous_element){
            same_type = [true, type_list.push(type(current_element))]
        } else {
            same_type = [false, type_list.push(type(current_element))]
        }
        previous_element = current_element
        current_element = list[i+1]
    }

    if (same_type[0] == true){  // Checks if the list is holding the same type
        switch(same_type[0][0]) {
            case numberType:
                min = list[0].length
                for i in list{
                    i<min ? min = i : next
                }
                break;
            case stringType:
                min = list[0].length
                for i in list{
                    i.length < min ? min = i.length : next
                }
                break;
            case listType:
                min = list[0].length
                for i in list{
                    i.length < min ? min = i.length : next
                }
                break;
            case dateType:
                min = list[0]
                for i in list{
                    i< min ? min = i : next
                }
                break;
            case booleanType: // If there are multiple false statements, this will return the first onne it encounters
                min = list[0]
                for i in list{
                    i === false ? min = i.length : next
                }
                break;
            
            default:
                // If the list is not of a single type it will return the first element.
                min = list[0]
            } 
        }
    } else { 
        // If the list is not of a single type it will return the first element.
        min = list[0] 
    }

    return min

*/