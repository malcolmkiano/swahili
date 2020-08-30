/*
    function max(list)

    // The pecking order: numbers > iterables > dates > booleans > (first item is min last is max)
    // Will hold the resulting max value
    let max = 0

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
                max = list[0].length
                for i in list{
                    i>max ? max = i : next
                }
                break;
            case stringType:
                max = list[0].length
                for i in list{
                    i.length > max ? max = i.length : next
                }
                break;
            case listType:
                max = list[0].length
                for i in list{
                    i.length > max ? max = i.length : next
                }
                break;
            case dateType:
                max = list[0]
                for i in list{
                    i> max ? max = i : next
                }
                break;
            case booleanType: // If there are multiple true statements, this will return the first onne it encounters
                max = list[0]
                for i in list{
                    i === true ? max = i.length : next
                }
                break;
            
            default:
                // If the list is not of a single type it will return the first element.
                max = list[last_element]
            } 
        }
    } else { 
        // If the list is not of a single type it will return the first element.
        max = list[last_element] 
    }

    return max

*/